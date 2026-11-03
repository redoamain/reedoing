import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import {
	getSubmissionById,
	getSubmissionResult,
	getShoppingChecks,
	toggleShoppingCheck,
	deleteSubmissionData,
	getAllAIGeneratedImages,
	saveAIGeneratedImage,
	getAffiliateMap,
	getActiveAdminOutfits,
	enrichStyleGuide
} from "$lib/server/db/queries";
import { generateStyleGuide } from "$lib/engine";
import { checkRateLimit } from "$lib/server/rate-limit";
import { generateOutfitTryOn, getGeminiApiKey } from "$lib/server/gemini";
import type { QuizAnswers, StyleGuideResult, Undertone } from "$lib/types/style";

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id;

	// Demo lookbook dinonaktifkan - alihkan ke style check personal
	if (id === "sample-pria" || id === "sample-wanita") {
		throw redirect(303, "/mulai");
	}

	const submission = await getSubmissionById(id);
	if (!submission || submission.status !== "selesai") {
		throw redirect(303, "/mulai");
	}

	const dbResult = await getSubmissionResult(id);
	if (!dbResult) {
		throw redirect(303, "/mulai");
	}

	let answers: QuizAnswers;
	try {
		answers =
			typeof submission.answers === "string"
				? JSON.parse(submission.answers)
				: (submission.answers as QuizAnswers);
	} catch {
		answers = {
			gender: "pria",
			styles: ["minimalis"],
			routines: ["kantor"],
			goals: ["lebih-rapi"],
			challenges: ["bingung-padu-padan"],
			undertone: "hangat",
			bodyProportion: "seimbang"
		};
	}

	const affiliateMap = await getAffiliateMap();
	const activeAdminOutfits = await getActiveAdminOutfits();
	const adminTemplates = activeAdminOutfits.length > 0 ? activeAdminOutfits : undefined;

	// Gunakan undertone spesifik dari hasil analisis foto / kuis pengguna
	const userTone: Undertone =
		(answers.undertone as Undertone) ||
		(dbResult.palette?.undertone as Undertone) ||
		"hangat";

	const generatedGuide = generateStyleGuide({ ...answers, undertone: userTone }, adminTemplates);
	const enrichedGuide = enrichStyleGuide(generatedGuide, affiliateMap, answers.gender);

	// Gabungkan data dari DB dengan summary dan data tone spesifik pengguna
	const result: StyleGuideResult = {
		summary: enrichedGuide.summary,
		palette: dbResult.palette || enrichedGuide.palette,
		capsule: dbResult.capsule || enrichedGuide.capsule,
		outfits: dbResult.outfits || enrichedGuide.outfits,
		shopping: dbResult.shopping || enrichedGuide.shopping,
		photoAnalysis: enrichedGuide.photoAnalysis
	};

	const checks = await getShoppingChecks(id);
	const aiImages = await getAllAIGeneratedImages(id);
	const hasGeminiKey = Boolean(await getGeminiApiKey());

	return {
		id,
		isSample: false,
		sampleGender: answers.gender || "pria",
		result,
		checks,
		aiImages,
		hasGeminiKey,
		userAnswers: answers,
		affiliateSettings: dbResult.affiliateSettings || {},
		isOwner: submission.sessionId === locals.sessionId
	};
};

export const actions: Actions = {
	generateTryOn: async ({ request, params, locals }) => {
		const id = params.id;

		const rate = checkRateLimit(`${locals.sessionId}:generateTryOn`, 10, 60 * 1000);
		if (!rate.allowed) {
			return fail(429, { error: "Terlalu banyak permintaan generate AI. Tunggu beberapa saat." });
		}

		const formData = await request.formData();
		const outfitId = formData.get("outfitId")?.toString();
		const photoFromForm = formData.get("photoBase64")?.toString();

		if (!outfitId) {
			return fail(400, { error: "ID Outfit diperlukan." });
		}

		const submission = await getSubmissionById(id);
		if (!submission) {
			return fail(404, { error: "Submission tidak ditemukan." });
		}

		const dbResult = await getSubmissionResult(id);
		if (!dbResult) {
			return fail(404, { error: "Data hasil tidak ditemukan." });
		}

		let answers: QuizAnswers;
		try {
			answers =
				typeof submission.answers === "string"
					? JSON.parse(submission.answers)
					: (submission.answers as QuizAnswers);
		} catch {
			answers = {
				gender: "pria",
				styles: ["minimalis"],
				routines: ["kantor"],
				goals: ["lebih-rapi"],
				challenges: ["bingung-padu-padan"],
				undertone: "hangat",
				bodyProportion: "seimbang"
			};
		}

		const outfit = (dbResult.outfits || []).find((o: any) => o.id === outfitId);
		if (!outfit) {
			return fail(404, { error: "Outfit tidak ditemukan." });
		}

		const userPhoto = (photoFromForm && photoFromForm.trim().length > 0)
			? photoFromForm.trim()
			: answers.photoBase64;

		const aiRes = await generateOutfitTryOn({
			outfit,
			userAnswers: answers,
			userPhotoBase64: userPhoto
		});

		if (!aiRes.success || !aiRes.imageUrl) {
			return fail(400, { error: aiRes.message || "Gagal menghasilkan visualisasi AI." });
		}

		await saveAIGeneratedImage(id, outfitId, aiRes.imageUrl);

		return {
			success: true,
			outfitId,
			imageUrl: aiRes.imageUrl
		};
	},

	toggleCheck: async ({ request, params, locals }) => {
		const id = params.id;

		const rate = checkRateLimit(`${locals.sessionId}:toggleCheck`, 60, 60 * 1000);
		if (!rate.allowed) {
			return fail(429, { error: "Terlalu banyak request checklist." });
		}

		const formData = await request.formData();
		const itemId = formData.get("itemId")?.toString();
		const checked = formData.get("checked")?.toString() === "true";

		if (!itemId) {
			return fail(400, { error: "Item ID diperlukan." });
		}

		await toggleShoppingCheck(id, itemId, checked);
		return { success: true, itemId, checked };
	},

	deleteData: async ({ params, cookies }) => {
		const id = params.id;
		await deleteSubmissionData(id);

		// Hapus cookie sesi
		cookies.delete("sid", { path: "/" });

		throw redirect(303, "/");
	}
};

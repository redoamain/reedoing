import type { PageServerLoad, Actions } from "./$types";
import { redirect, fail } from "@sveltejs/kit";
import {
	getSubmissionById,
	getSubmissionResult,
	getShoppingChecks,
	toggleShoppingCheck,
	deleteSubmissionData,
	getAllAIGeneratedImages,
	saveAIGeneratedImage
} from "$lib/server/db/queries";
import { generateStyleGuide } from "$lib/engine";
import { checkRateLimit } from "$lib/server/rate-limit";
import { generateOutfitTryOn, getGeminiApiKey } from "$lib/server/gemini";
import type { QuizAnswers, StyleGuideResult } from "$lib/types/style";

export const load: PageServerLoad = async ({ params, locals }) => {
	const id = params.id;

	// Support demo lookbook instant preview
	if (id === "sample-pria" || id === "sample-wanita") {
		const isWanita = id === "sample-wanita";
		const sampleAnswers: QuizAnswers = isWanita
			? {
					gender: "wanita",
					hijab: "tidak",
					coverage: "standar",
					styles: ["smart-casual", "minimalis"],
					routines: ["kantor", "hangout"],
					goals: ["lebih-rapi", "percaya-diri"],
					challenges: ["bingung-padu-padan"],
					undertone: "hangat",
					bodyProportion: "seimbang",
					budget: "Rp 350.000 - Rp 900.000",
					sizeTop: "M",
					sizeBottom: "29",
					sizeShoes: "38"
				}
			: {
					gender: "pria",
					hijab: "tidak",
					coverage: "standar",
					styles: ["smart-casual", "streetwear"],
					routines: ["kantor", "hangout"],
					goals: ["lebih-rapi", "percaya-diri"],
					challenges: ["bingung-padu-padan"],
					undertone: "hangat",
					bodyProportion: "seimbang",
					budget: "Rp 350.000 - Rp 900.000",
					sizeTop: "L",
					sizeBottom: "32",
					sizeShoes: "42"
				};

		const guidesByTone: Record<Undertone, StyleGuideResult> = {
			hangat: generateStyleGuide({ ...sampleAnswers, undertone: "hangat" }),
			dingin: generateStyleGuide({ ...sampleAnswers, undertone: "dingin" }),
			netral: generateStyleGuide({ ...sampleAnswers, undertone: "netral" })
		};

		return {
			id,
			isSample: true,
			sampleGender: isWanita ? "wanita" : "pria",
			result: guidesByTone[sampleAnswers.undertone],
			guidesByTone,
			checks: {},
			aiImages: {},
			hasGeminiKey: false,
			userAnswers: sampleAnswers,
			affiliateSettings: {
				shopee_fallback_url: "https://shopee.co.id",
				affiliate_disclaimer:
					"Tautan pakaian di atas terhubung ke toko resmi di Shopee. Kami dapat memperoleh sedikit komisi dari pembelianmu tanpa biaya tambahan."
			},
			isOwner: false
		};
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

	const guidesByTone: Record<Undertone, StyleGuideResult> = {
		hangat: generateStyleGuide({ ...answers, undertone: "hangat" }),
		dingin: generateStyleGuide({ ...answers, undertone: "dingin" }),
		netral: generateStyleGuide({ ...answers, undertone: "netral" })
	};

	const currentTone = answers.undertone || "hangat";
	const activeGuide = guidesByTone[currentTone];

	// Gabungkan data dari DB dengan summary
	const result: StyleGuideResult = {
		summary: activeGuide.summary,
		palette: dbResult.palette || activeGuide.palette,
		capsule: dbResult.capsule || activeGuide.capsule,
		outfits: dbResult.outfits || activeGuide.outfits,
		shopping: dbResult.shopping || activeGuide.shopping,
		photoAnalysis: activeGuide.photoAnalysis
	};

	const checks = await getShoppingChecks(id);
	const aiImages = await getAllAIGeneratedImages(id);
	const hasGeminiKey = Boolean(await getGeminiApiKey());

	return {
		id,
		isSample: false,
		sampleGender: answers.gender || "pria",
		result,
		guidesByTone,
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

		const aiRes = await generateOutfitTryOn({
			outfit,
			userAnswers: answers,
			userPhotoBase64: answers.photoBase64
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

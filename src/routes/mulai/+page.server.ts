import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import {
	getLatestSubmissionForSession,
	saveDraftSubmission,
	finalizeSubmission,
	getActiveAdminOutfits
} from "$lib/server/db/queries";
import { generateStyleGuide } from "$lib/engine";
import { completeQuizSchema } from "$lib/validation/quiz";
import { checkRateLimit } from "$lib/server/rate-limit";
import type { QuizAnswers } from "$lib/types/style";

export const load: PageServerLoad = async ({ locals }) => {
	const sessionId = locals.sessionId;
	const existingSubmission = await getLatestSubmissionForSession(sessionId);

	let answers: Partial<QuizAnswers> = {};
	let currentStep = 1;

	if (existingSubmission) {
		try {
			answers =
				typeof existingSubmission.answers === "string"
					? JSON.parse(existingSubmission.answers)
					: existingSubmission.answers;
		} catch (e) {
			answers = {};
		}

		if (existingSubmission.status === "draft") {
			currentStep = Math.min(Math.max(existingSubmission.step, 1), 7);
		}
	}

	return {
		submissionId: existingSubmission?.id || null,
		step: currentStep,
		answers
	};
};

export const actions: Actions = {
	saveStep: async ({ request, locals }) => {
		const sessionId = locals.sessionId;

		// Rate limiting check
		const rate = checkRateLimit(`${sessionId}:saveStep`, 30, 60 * 1000);
		if (!rate.allowed) {
			return fail(429, {
				error: "Terlalu banyak permintaan. Mohon tunggu beberapa detik."
			});
		}

		const formData = await request.formData();
		const step = parseInt(formData.get("step")?.toString() || "1", 10);
		const answersRaw = formData.get("answers")?.toString();

		if (!answersRaw) {
			return fail(400, { error: "Data jawaban tidak ditemukan." });
		}

		let parsedAnswers: Record<string, any> = {};
		try {
			parsedAnswers = JSON.parse(answersRaw);
		} catch {
			return fail(400, { error: "Format data jawaban tidak valid." });
		}

		const submissionId = await saveDraftSubmission(sessionId, step, parsedAnswers);

		return {
			success: true,
			submissionId,
			step
		};
	},

	complete: async ({ request, locals }) => {
		const sessionId = locals.sessionId;

		// Rate limiting check
		const rate = checkRateLimit(`${sessionId}:complete`, 15, 60 * 1000);
		if (!rate.allowed) {
			return fail(429, {
				error: "Terlalu banyak permintaan. Mohon tunggu beberapa saat."
			});
		}

		const formData = await request.formData();
		const answersRaw = formData.get("answers")?.toString();

		if (!answersRaw) {
			return fail(400, { error: "Data jawaban tidak ditemukan." });
		}

		let parsedAnswers: any = {};
		try {
			parsedAnswers = JSON.parse(answersRaw);
		} catch {
			return fail(400, { error: "Format data jawaban tidak valid." });
		}

		const validation = completeQuizSchema.safeParse(parsedAnswers);
		if (!validation.success) {
			const firstError = validation.error.issues[0]?.message || "Data jawaban belum lengkap.";
			return fail(400, { error: firstError });
		}

		const validData = validation.data as QuizAnswers;

		// Simpan submission akhir
		const submissionId = await saveDraftSubmission(sessionId, 7, validData);

		// Hasilkan rekomendasi dari engine rule-based dengan mempertimbangkan outfit admin aktif
		const activeOutfits = await getActiveAdminOutfits();
		const guideResult = generateStyleGuide(validData, activeOutfits.length > 0 ? activeOutfits : undefined);

		// Finalisasi di SQLite
		await finalizeSubmission(submissionId, {
			palette: guideResult.palette,
			capsule: guideResult.capsule,
			outfits: guideResult.outfits,
			shopping: guideResult.shopping
		});

		// Arahkan langsung ke halaman hasil
		throw redirect(303, `/panduan/${submissionId}`);
	}
};

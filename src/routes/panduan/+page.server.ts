import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { getLatestCompletedSubmissionForSession } from "$lib/server/db/queries";

export const load: PageServerLoad = async ({ locals }) => {
	const sessionId = locals.sessionId;
	const completed = await getLatestCompletedSubmissionForSession(sessionId);

	if (completed) {
		throw redirect(303, `/panduan/${completed.id}`);
	}

	throw redirect(303, "/mulai");
};

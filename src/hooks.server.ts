import type { Handle } from "@sveltejs/kit/hooks";
import { getOrCreateSession } from "$lib/server/db/queries";

export const handle: Handle = async ({ event, resolve }) => {
	let sid = event.cookies.get("sid");

	// Validasi atau buat sesi baru di SQLite
	sid = await getOrCreateSession(sid);

	// Simpan di cookies (1 tahun retensi anonim)
	event.cookies.set("sid", sid, {
		path: "/",
		httpOnly: true,
		sameSite: "lax",
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24 * 365
	});

	event.locals.sessionId = sid;

	const response = await resolve(event);
	return response;
};

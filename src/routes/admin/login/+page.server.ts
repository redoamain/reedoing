import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { verifyAdminCredentials, createAdminToken } from "$lib/server/admin-auth";

export const actions: Actions = {
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const username = data.get("username")?.toString()?.trim() || "";
		const password = data.get("password")?.toString() || "";

		if (!password) {
			return fail(400, { error: "Password wajib diisi.", username });
		}

		const isValid = await verifyAdminCredentials(password, username || undefined);
		if (!isValid) {
			return fail(400, {
				error: username ? "Username atau password admin salah." : "Password admin salah. Silakan periksa kembali.",
				username
			});
		}

		const token = createAdminToken(username || "admin");
		cookies.set("admin_session", token, {
			path: "/",
			httpOnly: true,
			sameSite: "lax",
			secure: process.env.NODE_ENV === "production",
			maxAge: 60 * 60 * 24 * 7 // 7 hari
		});

		throw redirect(303, "/admin");
	}
};

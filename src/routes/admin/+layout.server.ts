import type { LayoutServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { isValidAdminToken } from "$lib/server/admin-auth";

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	const token = cookies.get("admin_session");
	const isAuthenticated = isValidAdminToken(token);

	if (url.pathname !== "/admin/login") {
		if (!isAuthenticated) {
			throw redirect(303, "/admin/login");
		}
	} else {
		if (isAuthenticated) {
			throw redirect(303, "/admin");
		}
	}

	return {
		isAuthenticated
	};
};

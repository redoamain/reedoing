import { getAdminSettings } from "$lib/server/db/queries";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	try {
		const settings = await getAdminSettings();
		return {
			siteSettings: {
				name: settings.site_name || "reedoing",
				logo: settings.site_logo || "",
				tagline: settings.site_tagline || "Lebih Sedikit Item, Lebih Banyak Outfit"
			}
		};
	} catch (e) {
		console.error("Failed to load admin settings for root layout:", e);
		return {
			siteSettings: {
				name: "reedoing",
				logo: "",
				tagline: "Lebih Sedikit Item, Lebih Banyak Outfit"
			}
		};
	}
};

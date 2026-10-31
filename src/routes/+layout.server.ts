import { getAdminSettings } from "$lib/server/db/queries";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async () => {
	try {
		const settings = await getAdminSettings();
		let warmColors = null;
		let coolColors = null;
		let neutralColors = null;
		try {
			if (settings.hero_tone_warm_colors) warmColors = JSON.parse(settings.hero_tone_warm_colors);
			if (settings.hero_tone_cool_colors) coolColors = JSON.parse(settings.hero_tone_cool_colors);
			if (settings.hero_tone_neutral_colors) neutralColors = JSON.parse(settings.hero_tone_neutral_colors);
		} catch (err) {
			console.error("Error parsing hero tone colors in layout load:", err);
		}

		return {
			siteSettings: {
				name: settings.site_name || "reedoing",
				logo: settings.site_logo || "",
				tagline: settings.site_tagline || "Lebih Sedikit Item, Lebih Banyak Outfit",
				hero: {
					title1: settings.hero_title_1 || "Lebih sedikit pakaian,",
					title2: settings.hero_title_2 || "lebih banyak gaya.",
					description:
						settings.hero_description ||
						"Bangun capsule wardrobe fungsional 12 item yang menghasilkan 30+ kombinasi outfit siap pakai. Dirancang personal untuk pria dan wanita berdasarkan undertone urat nadi dan proporsi tubuhmu.",
					ctaText: settings.hero_cta_text || "Mulai Style Check",
					ctaSecondaryText: settings.hero_cta_secondary_text || "Lihat Contoh Lookbook",
					ctaSubtext: settings.hero_cta_subtext || "Gratis · Sekitar 3 menit · Langsung siap pakai",
					floatingText: settings.hero_floating_text || "Deteksi warna urat nadi pergelangan tangan otomatis",
					stat1Val: settings.hero_stat_1_val || "12 Item",
					stat1Lbl: settings.hero_stat_1_lbl || "Wardrobe esensial",
					stat2Val: settings.hero_stat_2_val || "30+ Look",
					stat2Lbl: settings.hero_stat_2_lbl || "Kombinasi siap pakai",
					stat3Val: settings.hero_stat_3_val || "100%",
					stat3Lbl: settings.hero_stat_3_lbl || "Gratis selamanya",
					defaultTone: (settings.hero_default_tone || "hangat") as "hangat" | "dingin" | "netral",
					warmName: settings.hero_tone_warm_name || "Warm Earth & Sun",
					warmDesc: settings.hero_tone_warm_desc || "Nuansa bumi hangat: broken white, camel, espresso, dan aksen terracotta.",
					warmColors,
					coolName: settings.hero_tone_cool_name || "Cool Slate & Coastal",
					coolDesc: settings.hero_tone_cool_desc || "Nuansa sejuk berkelas: pure white, classic navy, charcoal, dan slate blue.",
					coolColors,
					neutralName: settings.hero_tone_neutral_name || "Neutral Mineral & Stone",
					neutralDesc: settings.hero_tone_neutral_desc || "Nuansa netral seimbang: soft ecru, midnight graphite, taupe, dan sage green.",
					neutralColors
				}
			}
		};
	} catch (e) {
		console.error("Failed to load admin settings for root layout:", e);
		return {
			siteSettings: {
				name: "reedoing",
				logo: "",
				tagline: "Lebih Sedikit Item, Lebih Banyak Outfit",
				hero: {
					title1: "Lebih sedikit pakaian,",
					title2: "lebih banyak gaya.",
					description:
						"Bangun capsule wardrobe fungsional 12 item yang menghasilkan 30+ kombinasi outfit siap pakai. Dirancang personal untuk pria dan wanita berdasarkan undertone urat nadi dan proporsi tubuhmu.",
					ctaText: "Mulai Style Check",
					ctaSecondaryText: "Lihat Contoh Lookbook",
					ctaSubtext: "Gratis · Sekitar 3 menit · Langsung siap pakai",
					floatingText: "Deteksi warna urat nadi pergelangan tangan otomatis",
					stat1Val: "12 Item",
					stat1Lbl: "Wardrobe esensial",
					stat2Val: "30+ Look",
					stat2Lbl: "Kombinasi siap pakai",
					stat3Val: "100%",
					stat3Lbl: "Gratis selamanya",
					defaultTone: "hangat",
					warmName: "Warm Earth & Sun",
					warmDesc: "Nuansa bumi hangat: broken white, camel, espresso, dan aksen terracotta.",
					warmColors: null,
					coolName: "Cool Slate & Coastal",
					coolDesc: "Nuansa sejuk berkelas: pure white, classic navy, charcoal, dan slate blue.",
					coolColors: null,
					neutralName: "Neutral Mineral & Stone",
					neutralDesc: "Nuansa netral seimbang: soft ecru, midnight graphite, taupe, dan sage green.",
					neutralColors: null
				}
			}
		};
	}
};

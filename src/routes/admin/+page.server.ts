import type { PageServerLoad, Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import fs from "node:fs";
import {
	getAllAdminOutfits,
	saveAdminOutfit,
	deleteAdminOutfit,
	resetDefaultOutfits,
	getAllAffiliateItems,
	saveAffiliateItem,
	deleteAffiliateItem,
	getAdminSettings,
	saveAdminSetting,
	deleteAdminSetting
} from "$lib/server/db/queries";

export const load: PageServerLoad = async () => {
	const outfits = await getAllAdminOutfits();
	const items = await getAllAffiliateItems();
	const settings = await getAdminSettings();

	const stats = {
		totalOutfits: outfits.length,
		outfitsWithAffiliate: outfits.filter((o) => Boolean(o.affiliateUrl?.trim())).length,
		totalItems: items.length,
		itemsWithAffiliate: items.filter((i) => Boolean(i.affiliateUrl?.trim())).length
	};

	return {
		outfits,
		items,
		settings,
		stats
	};
};

export const actions: Actions = {
	saveOutfit: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString();
		const name = data.get("name")?.toString()?.trim();
		const occasion = data.get("occasion")?.toString()?.trim();
		const occasionLabel = data.get("occasionLabel")?.toString()?.trim();
		const formula = data.get("formula")?.toString()?.trim();
		const styleTips = data.get("styleTips")?.toString()?.trim();
		const affiliateUrl = data.get("affiliateUrl")?.toString()?.trim() || null;
		let imageUrl = data.get("imageUrl")?.toString()?.trim() || null;
		const isActive = data.get("isActive")?.toString() === "true";
		const itemIdsRaw = data.get("itemIds")?.toString() || "[]";

		const imageFile = data.get("imageFile");
		if (imageFile instanceof File && imageFile.size > 0 && imageFile.name) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
			const filename = `outfit-${Date.now()}-${cleanName}`;
			const uploadDir = "./static/uploads";
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}
			fs.writeFileSync(`${uploadDir}/${filename}`, buffer);
			imageUrl = `/uploads/${filename}`;
		}

		if (!name || !occasion || !formula || !styleTips) {
			return fail(400, { error: "Semua field teks outfit wajib diisi." });
		}

		let itemIds: string[] = [];
		try {
			itemIds = JSON.parse(itemIdsRaw);
		} catch {
			itemIds = itemIdsRaw.split(",").map((s) => s.trim()).filter(Boolean);
		}

		const occasionLabelsMap: Record<string, string> = {
			kantor: "Kerja Kantor",
			meeting: "Meeting Klien & Presentasi",
			kampus: "Kuliah & Kampus",
			hangout: "Hangout Akhir Pekan",
			santai: "Santai & Harian",
			formal: "Acara Formal & Undangan"
		};

		const finalOccasionLabel = occasionLabel || occasionLabelsMap[occasion] || occasion;

		await saveAdminOutfit({
			id: id || undefined,
			name,
			occasion,
			occasionLabel: finalOccasionLabel,
			formula,
			styleTips,
			itemIds,
			affiliateUrl,
			imageUrl,
			isActive
		});

		return { success: true, message: "Outfit berhasil disimpan." };
	},

	deleteOutfit: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString();

		if (!id) {
			return fail(400, { error: "ID Outfit tidak ditemukan." });
		}

		await deleteAdminOutfit(id);
		return { success: true, message: "Outfit berhasil dihapus." };
	},

	resetOutfits: async () => {
		await resetDefaultOutfits();
		return { success: true, message: "32 outfit bawaan berhasil dipulihkan." };
	},

	saveItem: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString();
		const name = data.get("name")?.toString()?.trim();
		const category = data.get("category")?.toString()?.trim();
		const affiliateUrl = data.get("affiliateUrl")?.toString()?.trim() || null;
		let imageUrl = data.get("imageUrl")?.toString()?.trim() || null;
		const priceEstimate = data.get("priceEstimate")?.toString()?.trim() || null;

		const imageFile = data.get("imageFile");
		if (imageFile instanceof File && imageFile.size > 0 && imageFile.name) {
			const buffer = Buffer.from(await imageFile.arrayBuffer());
			const cleanName = imageFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
			const filename = `item-${Date.now()}-${cleanName}`;
			const uploadDir = "./static/uploads";
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}
			fs.writeFileSync(`${uploadDir}/${filename}`, buffer);
			imageUrl = `/uploads/${filename}`;
		}

		if (!id) {
			return fail(400, { error: "ID Item tidak ditemukan." });
		}

		await saveAffiliateItem({
			id,
			name,
			category,
			affiliateUrl,
			imageUrl,
			priceEstimate
		});

		return { success: true, message: "Item belanja Shopee berhasil diperbarui." };
	},

	deleteItem: async ({ request }) => {
		const data = await request.formData();
		const id = data.get("id")?.toString();

		if (!id) {
			return fail(400, { error: "ID Item tidak ditemukan." });
		}

		await deleteAffiliateItem(id);
		return { success: true, message: "Item belanja berhasil dihapus." };
	},

	saveSettings: async ({ request }) => {
		const data = await request.formData();
		const siteName = data.get("site_name")?.toString()?.trim();
		const siteTagline = data.get("site_tagline")?.toString()?.trim();
		const siteLogo = data.get("site_logo")?.toString()?.trim();
		const adminUser = data.get("admin_user")?.toString()?.trim();
		const adminPassword = data.get("admin_password")?.toString();
		const adminPasswordConfirm = data.get("admin_password_confirm")?.toString();
		const fallbackUrl = data.get("shopee_fallback_url")?.toString()?.trim();
		const disclaimer = data.get("affiliate_disclaimer")?.toString()?.trim();
		const geminiApiKey = data.get("gemini_api_key")?.toString()?.trim();

		// Handle logo upload
		const logoFile = data.get("logoFile");
		if (logoFile instanceof File && logoFile.size > 0 && logoFile.name) {
			const buffer = Buffer.from(await logoFile.arrayBuffer());
			const cleanName = logoFile.name.replace(/[^a-zA-Z0-9.-]/g, "_");
			const filename = `logo-${Date.now()}-${cleanName}`;
			const uploadDir = "./static/uploads";
			if (!fs.existsSync(uploadDir)) {
				fs.mkdirSync(uploadDir, { recursive: true });
			}
			fs.writeFileSync(`${uploadDir}/${filename}`, buffer);
			await saveAdminSetting("site_logo", `/uploads/${filename}`);
		} else if (siteLogo !== undefined && siteLogo !== "") {
			await saveAdminSetting("site_logo", siteLogo);
		}

		if (siteName) {
			await saveAdminSetting("site_name", siteName);
		}
		if (siteTagline !== undefined) {
			await saveAdminSetting("site_tagline", siteTagline);
		}

		// Security update
		if (adminUser) {
			await saveAdminSetting("admin_user", adminUser);
		}

		if (adminPassword && adminPassword.trim()) {
			if (adminPasswordConfirm !== undefined && adminPassword !== adminPasswordConfirm) {
				return fail(400, { error: "Konfirmasi password baru tidak cocok." });
			}
			if (adminPassword.length < 4) {
				return fail(400, { error: "Password admin minimal 4 karakter." });
			}
			await saveAdminSetting("admin_password", adminPassword.trim());
		}

		// Shopee & Gemini
		if (fallbackUrl) {
			await saveAdminSetting("shopee_fallback_url", fallbackUrl);
		}
		if (disclaimer) {
			await saveAdminSetting("affiliate_disclaimer", disclaimer);
		}
		if (geminiApiKey !== undefined) {
			await saveAdminSetting("gemini_api_key", geminiApiKey);
		}

		return { success: true, message: "Pengaturan berhasil disimpan." };
	},

	saveHeroSettings: async ({ request }) => {
		const data = await request.formData();
		const heroTitle1 = data.get("hero_title_1")?.toString();
		const heroTitle2 = data.get("hero_title_2")?.toString();
		const heroDescription = data.get("hero_description")?.toString();
		const heroCtaText = data.get("hero_cta_text")?.toString();
		const heroCtaSecondaryText = data.get("hero_cta_secondary_text")?.toString();
		const heroCtaSubtext = data.get("hero_cta_subtext")?.toString();
		const heroFloatingText = data.get("hero_floating_text")?.toString();

		const heroStat1Val = data.get("hero_stat_1_val")?.toString();
		const heroStat1Lbl = data.get("hero_stat_1_lbl")?.toString();
		const heroStat2Val = data.get("hero_stat_2_val")?.toString();
		const heroStat2Lbl = data.get("hero_stat_2_lbl")?.toString();
		const heroStat3Val = data.get("hero_stat_3_val")?.toString();
		const heroStat3Lbl = data.get("hero_stat_3_lbl")?.toString();

		const heroDefaultTone = data.get("hero_default_tone")?.toString()?.trim();

		const heroToneWarmName = data.get("hero_tone_warm_name")?.toString();
		const heroToneWarmDesc = data.get("hero_tone_warm_desc")?.toString();
		const heroToneWarmColors = data.get("hero_tone_warm_colors")?.toString();

		const heroToneCoolName = data.get("hero_tone_cool_name")?.toString();
		const heroToneCoolDesc = data.get("hero_tone_cool_desc")?.toString();
		const heroToneCoolColors = data.get("hero_tone_cool_colors")?.toString();

		const heroToneNeutralName = data.get("hero_tone_neutral_name")?.toString();
		const heroToneNeutralDesc = data.get("hero_tone_neutral_desc")?.toString();
		const heroToneNeutralColors = data.get("hero_tone_neutral_colors")?.toString();

		if (heroTitle1 !== undefined) await saveAdminSetting("hero_title_1", heroTitle1.trim());
		if (heroTitle2 !== undefined) await saveAdminSetting("hero_title_2", heroTitle2.trim());
		if (heroDescription !== undefined) await saveAdminSetting("hero_description", heroDescription.trim());
		if (heroCtaText !== undefined) await saveAdminSetting("hero_cta_text", heroCtaText.trim());
		if (heroCtaSecondaryText !== undefined) await saveAdminSetting("hero_cta_secondary_text", heroCtaSecondaryText.trim());
		if (heroCtaSubtext !== undefined) await saveAdminSetting("hero_cta_subtext", heroCtaSubtext.trim());
		if (heroFloatingText !== undefined) await saveAdminSetting("hero_floating_text", heroFloatingText.trim());

		if (heroStat1Val !== undefined) await saveAdminSetting("hero_stat_1_val", heroStat1Val.trim());
		if (heroStat1Lbl !== undefined) await saveAdminSetting("hero_stat_1_lbl", heroStat1Lbl.trim());
		if (heroStat2Val !== undefined) await saveAdminSetting("hero_stat_2_val", heroStat2Val.trim());
		if (heroStat2Lbl !== undefined) await saveAdminSetting("hero_stat_2_lbl", heroStat2Lbl.trim());
		if (heroStat3Val !== undefined) await saveAdminSetting("hero_stat_3_val", heroStat3Val.trim());
		if (heroStat3Lbl !== undefined) await saveAdminSetting("hero_stat_3_lbl", heroStat3Lbl.trim());

		if (heroDefaultTone && ["hangat", "dingin", "netral"].includes(heroDefaultTone)) {
			await saveAdminSetting("hero_default_tone", heroDefaultTone);
		}

		if (heroToneWarmName !== undefined) await saveAdminSetting("hero_tone_warm_name", heroToneWarmName.trim());
		if (heroToneWarmDesc !== undefined) await saveAdminSetting("hero_tone_warm_desc", heroToneWarmDesc.trim());
		if (heroToneWarmColors) await saveAdminSetting("hero_tone_warm_colors", heroToneWarmColors);

		if (heroToneCoolName !== undefined) await saveAdminSetting("hero_tone_cool_name", heroToneCoolName.trim());
		if (heroToneCoolDesc !== undefined) await saveAdminSetting("hero_tone_cool_desc", heroToneCoolDesc.trim());
		if (heroToneCoolColors) await saveAdminSetting("hero_tone_cool_colors", heroToneCoolColors);

		if (heroToneNeutralName !== undefined) await saveAdminSetting("hero_tone_neutral_name", heroToneNeutralName.trim());
		if (heroToneNeutralDesc !== undefined) await saveAdminSetting("hero_tone_neutral_desc", heroToneNeutralDesc.trim());
		if (heroToneNeutralColors) await saveAdminSetting("hero_tone_neutral_colors", heroToneNeutralColors);

		return { success: true, message: "Pengaturan teks Hero & Tone Color berhasil disimpan." };
	},

	resetHeroSettings: async () => {
		const keysToReset = [
			"hero_title_1",
			"hero_title_2",
			"hero_description",
			"hero_cta_text",
			"hero_cta_secondary_text",
			"hero_cta_subtext",
			"hero_floating_text",
			"hero_stat_1_val",
			"hero_stat_1_lbl",
			"hero_stat_2_val",
			"hero_stat_2_lbl",
			"hero_stat_3_val",
			"hero_stat_3_lbl",
			"hero_default_tone",
			"hero_tone_warm_name",
			"hero_tone_warm_desc",
			"hero_tone_warm_colors",
			"hero_tone_cool_name",
			"hero_tone_cool_desc",
			"hero_tone_cool_colors",
			"hero_tone_neutral_name",
			"hero_tone_neutral_desc",
			"hero_tone_neutral_colors"
		];
		for (const k of keysToReset) {
			await deleteAdminSetting(k);
		}
		return { success: true, message: "Pengaturan Hero & Tone Color berhasil direset ke standar." };
	},

	logout: async ({ cookies }) => {
		cookies.delete("admin_session", { path: "/" });
		throw redirect(303, "/admin/login");
	}
};

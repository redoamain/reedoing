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
	saveAdminSetting
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

	logout: async ({ cookies }) => {
		cookies.delete("admin_session", { path: "/" });
		throw redirect(303, "/admin/login");
	}
};

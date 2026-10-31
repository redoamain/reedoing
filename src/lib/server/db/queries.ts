import { eq, and, desc, asc } from "drizzle-orm";
import { db, sqlite } from "./index";
import {
	sessions,
	submissions,
	results,
	shoppingChecks,
	adminOutfits,
	affiliateItems,
	adminSettings,
	aiGeneratedImages
} from "./schema";
import { nanoid } from "nanoid";
import { rawOutfitTemplates } from "../../engine/outfits";

export async function getOrCreateSession(existingSessionId?: string): Promise<string> {
	if (existingSessionId) {
		const existing = await db
			.select()
			.from(sessions)
			.where(eq(sessions.id, existingSessionId))
			.limit(1);

		if (existing.length > 0) {
			await db
				.update(sessions)
				.set({ updatedAt: new Date() })
				.where(eq(sessions.id, existingSessionId));
			return existingSessionId;
		}
	}

	const newId = nanoid(32);
	const now = new Date();
	await db.insert(sessions).values({
		id: newId,
		createdAt: now,
		updatedAt: now
	});
	return newId;
}

export async function getLatestSubmissionForSession(sessionId: string) {
	const res = await db
		.select()
		.from(submissions)
		.where(eq(submissions.sessionId, sessionId))
		.orderBy(desc(submissions.updatedAt))
		.limit(1);

	return res[0] || null;
}

export async function getLatestCompletedSubmissionForSession(sessionId: string) {
	const res = await db
		.select()
		.from(submissions)
		.where(and(eq(submissions.sessionId, sessionId), eq(submissions.status, "selesai")))
		.orderBy(desc(submissions.updatedAt))
		.limit(1);

	return res[0] || null;
}

export async function getSubmissionById(id: string) {
	const res = await db
		.select()
		.from(submissions)
		.where(eq(submissions.id, id))
		.limit(1);

	return res[0] || null;
}

export async function saveDraftSubmission(
	sessionId: string,
	step: number,
	answers: Record<string, any>
): Promise<string> {
	const existing = await getLatestSubmissionForSession(sessionId);
	const now = new Date();

	if (existing && existing.status === "draft") {
		const mergedAnswers = {
			...(typeof existing.answers === "string" ? JSON.parse(existing.answers) : existing.answers),
			...answers
		};

		await db
			.update(submissions)
			.set({
				step,
				answers: JSON.stringify(mergedAnswers),
				updatedAt: now
			})
			.where(eq(submissions.id, existing.id));

		return existing.id;
	}

	// Buat submission baru jika belum ada draft
	// nanoid minimal 21 karakter sesuai ketentuan
	const newSubId = nanoid(24);
	await db.insert(submissions).values({
		id: newSubId,
		sessionId,
		step,
		answers: JSON.stringify(answers),
		status: "draft",
		createdAt: now,
		updatedAt: now
	});

	return newSubId;
}

export async function finalizeSubmission(
	submissionId: string,
	resultData: {
		palette: any;
		capsule: any;
		outfits: any;
		shopping: any;
	}
) {
	const now = new Date();

	// Tandai submission sebagai selesai
	await db
		.update(submissions)
		.set({
			status: "selesai",
			updatedAt: now
		})
		.where(eq(submissions.id, submissionId));

	// Tulis atau timpa results
	const existingResult = await db
		.select()
		.from(results)
		.where(eq(results.submissionId, submissionId))
		.limit(1);

	if (existingResult.length > 0) {
		await db
			.update(results)
			.set({
				palette: JSON.stringify(resultData.palette),
				capsule: JSON.stringify(resultData.capsule),
				outfits: JSON.stringify(resultData.outfits),
				shopping: JSON.stringify(resultData.shopping),
				schemaVersion: 1
			})
			.where(eq(results.submissionId, submissionId));
	} else {
		await db.insert(results).values({
			submissionId,
			schemaVersion: 1,
			palette: JSON.stringify(resultData.palette),
			capsule: JSON.stringify(resultData.capsule),
			outfits: JSON.stringify(resultData.outfits),
			shopping: JSON.stringify(resultData.shopping),
			createdAt: now
		});
	}
}

export async function getSubmissionResult(submissionId: string) {
	const res = await db
		.select()
		.from(results)
		.where(eq(results.submissionId, submissionId))
		.limit(1);

	if (!res[0]) return null;

	const r = res[0];
	const outfits = typeof r.outfits === "string" ? JSON.parse(r.outfits) : r.outfits;
	const shopping = typeof r.shopping === "string" ? JSON.parse(r.shopping) : r.shopping;
	const capsule = typeof r.capsule === "string" ? JSON.parse(r.capsule) : r.capsule;

	// Sinkronkan dengan data afiliasi Shopee per produk terbaru dari database admin
	const affiliateMap = await getAffiliateMap();

	const enrichedOutfits = (outfits || []).map((o: any) => ({
		...o,
		affiliateUrl: affiliateMap.outfits[o.id] || o.affiliateUrl || null,
		imageUrl: affiliateMap.outfitImages[o.id] || o.imageUrl || `/images/real/looks/${o.id}.jpg`,
		items: (o.items || []).map((it: any) => ({
			...it,
			affiliateUrl: affiliateMap.items[it.id] || null,
			priceEstimate: affiliateMap.itemPrices[it.id] || null,
			imageUrl: affiliateMap.itemImages[it.id] || it.imageUrl || null
		}))
	}));

	const enrichedShopping = (shopping || []).map((s: any) => ({
		...s,
		affiliateUrl: affiliateMap.items[s.id] || s.affiliateUrl || null,
		priceEstimate: affiliateMap.itemPrices[s.id] || s.priceEstimate || null,
		imageUrl: affiliateMap.itemImages[s.id] || s.imageUrl || null
	}));

	const enrichedCapsule = (capsule || []).map((c: any) => ({
		...c,
		affiliateUrl: affiliateMap.items[c.id] || null,
		priceEstimate: affiliateMap.itemPrices[c.id] || null,
		imageUrl: affiliateMap.itemImages[c.id] || c.imageUrl || null
	}));

	return {
		submissionId: r.submissionId,
		schemaVersion: r.schemaVersion,
		palette: typeof r.palette === "string" ? JSON.parse(r.palette) : r.palette,
		capsule: enrichedCapsule,
		outfits: enrichedOutfits,
		shopping: enrichedShopping,
		createdAt: r.createdAt,
		affiliateSettings: affiliateMap.settings
	};
}

export async function getShoppingChecks(submissionId: string): Promise<Record<string, boolean>> {
	const rows = await db
		.select()
		.from(shoppingChecks)
		.where(eq(shoppingChecks.submissionId, submissionId));

	const map: Record<string, boolean> = {};
	for (const row of rows) {
		map[row.itemId] = row.checked;
	}
	return map;
}

export async function toggleShoppingCheck(
	submissionId: string,
	itemId: string,
	checked: boolean
) {
	const existing = await db
		.select()
		.from(shoppingChecks)
		.where(
			and(
				eq(shoppingChecks.submissionId, submissionId),
				eq(shoppingChecks.itemId, itemId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(shoppingChecks)
			.set({ checked })
			.where(
				and(
					eq(shoppingChecks.submissionId, submissionId),
					eq(shoppingChecks.itemId, itemId)
				)
			);
	} else {
		await db.insert(shoppingChecks).values({
			submissionId,
			itemId,
			checked
		});
	}
}

export async function deleteSubmissionData(submissionId: string) {
	await db.delete(submissions).where(eq(submissions.id, submissionId));
}

// ==========================================
// ADMIN OUTFITS & SHOPEE AFFILIATE QUERIES
// ==========================================

export async function getAffiliateMap() {
	const outfitRows = await db
		.select({
			id: adminOutfits.id,
			affiliateUrl: adminOutfits.affiliateUrl,
			imageUrl: adminOutfits.imageUrl
		})
		.from(adminOutfits);

	const itemRows = await db
		.select()
		.from(affiliateItems);

	const settingRows = await db
		.select()
		.from(adminSettings);

	const outfitMap: Record<string, string> = {};
	const outfitImageMap: Record<string, string> = {};
	for (const row of outfitRows) {
		if (row.affiliateUrl) outfitMap[row.id] = row.affiliateUrl;
		if (row.imageUrl) outfitImageMap[row.id] = row.imageUrl;
	}

	const itemMap: Record<string, string> = {};
	const itemPriceMap: Record<string, string> = {};
	const itemImageMap: Record<string, string> = {};
	for (const row of itemRows) {
		if (row.affiliateUrl) itemMap[row.id] = row.affiliateUrl;
		if (row.priceEstimate) itemPriceMap[row.id] = row.priceEstimate;
		if (row.imageUrl) itemImageMap[row.id] = row.imageUrl;
	}

	const settingsMap: Record<string, string> = {};
	for (const row of settingRows) {
		settingsMap[row.key] = row.value;
	}

	return {
		outfits: outfitMap,
		outfitImages: outfitImageMap,
		items: itemMap,
		itemPrices: itemPriceMap,
		itemImages: itemImageMap,
		settings: settingsMap
	};
}

export async function getAllAdminOutfits() {
	const rows = await db
		.select()
		.from(adminOutfits)
		.orderBy(asc(adminOutfits.sortOrder), desc(adminOutfits.updatedAt));

	return rows.map((r) => ({
		...r,
		imageUrl: r.imageUrl || `/images/real/looks/${r.id}.jpg`,
		itemIds: typeof r.itemIds === "string" ? JSON.parse(r.itemIds) : (r.itemIds as string[])
	}));
}

export async function getActiveAdminOutfits() {
	const rows = await db
		.select()
		.from(adminOutfits)
		.where(eq(adminOutfits.isActive, true))
		.orderBy(asc(adminOutfits.sortOrder), asc(adminOutfits.createdAt));

	return rows.map((r) => ({
		id: r.id,
		name: r.name,
		occasion: r.occasion as any,
		occasionLabel: r.occasionLabel,
		formula: r.formula,
		styleTips: r.styleTips,
		itemIds: typeof r.itemIds === "string" ? JSON.parse(r.itemIds) : (r.itemIds as string[]),
		affiliateUrl: r.affiliateUrl || "",
		imageUrl: r.imageUrl || `/images/real/looks/${r.id}.jpg`
	}));
}

export async function getAdminOutfitById(id: string) {
	const rows = await db
		.select()
		.from(adminOutfits)
		.where(eq(adminOutfits.id, id))
		.limit(1);

	if (!rows[0]) return null;
	const r = rows[0];
	return {
		...r,
		itemIds: typeof r.itemIds === "string" ? JSON.parse(r.itemIds) : (r.itemIds as string[])
	};
}

export async function saveAdminOutfit(data: {
	id?: string;
	name: string;
	occasion: string;
	occasionLabel: string;
	formula: string;
	styleTips: string;
	itemIds: string[];
	affiliateUrl?: string | null;
	imageUrl?: string | null;
	isActive?: boolean;
	sortOrder?: number;
}) {
	const now = new Date();
	const id = data.id || `custom-outfit-${nanoid(8)}`;

	const existing = await db
		.select()
		.from(adminOutfits)
		.where(eq(adminOutfits.id, id))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(adminOutfits)
			.set({
				name: data.name,
				occasion: data.occasion,
				occasionLabel: data.occasionLabel,
				formula: data.formula,
				styleTips: data.styleTips,
				itemIds: JSON.stringify(data.itemIds),
				affiliateUrl: data.affiliateUrl?.trim() || null,
				imageUrl: data.imageUrl?.trim() || null,
				isActive: data.isActive !== undefined ? data.isActive : true,
				sortOrder: data.sortOrder ?? existing[0].sortOrder,
				updatedAt: now
			})
			.where(eq(adminOutfits.id, id));
	} else {
		await db.insert(adminOutfits).values({
			id,
			name: data.name,
			occasion: data.occasion,
			occasionLabel: data.occasionLabel,
			formula: data.formula,
			styleTips: data.styleTips,
			itemIds: JSON.stringify(data.itemIds),
			affiliateUrl: data.affiliateUrl?.trim() || null,
			imageUrl: data.imageUrl?.trim() || null,
			isActive: data.isActive !== undefined ? data.isActive : true,
			sortOrder: data.sortOrder ?? 0,
			createdAt: now,
			updatedAt: now
		});
	}

	return id;
}

export async function deleteAdminOutfit(id: string) {
	await db.delete(adminOutfits).where(eq(adminOutfits.id, id));
}

export async function resetDefaultOutfits() {
	const now = Date.now();
	// Hapus semua lalu masukkan kembali 32 outfit bawaan
	sqlite.transaction(() => {
		sqlite.prepare("DELETE FROM admin_outfits").run();
		const insertStmt = sqlite.prepare(`
			INSERT INTO admin_outfits (
				id, name, occasion, occasion_label, formula, style_tips, item_ids, 
				affiliate_url, image_url, sort_order, is_active, created_at, updated_at
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
		`);

		for (let i = 0; i < rawOutfitTemplates.length; i++) {
			const it = rawOutfitTemplates[i];
			insertStmt.run(
				it.id,
				it.name,
				it.occasion,
				it.occasionLabel,
				it.formula,
				it.styleTips,
				JSON.stringify(it.itemIds),
				it.affiliateUrl || null,
				it.imageUrl || `/images/real/looks/${it.id}.jpg`,
				i + 1,
				now,
				now
			);
		}
	})();
}

export async function getAllAffiliateItems() {
	return await db
		.select()
		.from(affiliateItems)
		.orderBy(asc(affiliateItems.category), asc(affiliateItems.name));
}

export async function saveAffiliateItem(data: {
	id: string;
	name?: string;
	category?: string;
	affiliateUrl?: string | null;
	imageUrl?: string | null;
	priceEstimate?: string | null;
}) {
	const now = new Date();
	const existing = await db
		.select()
		.from(affiliateItems)
		.where(eq(affiliateItems.id, data.id))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(affiliateItems)
			.set({
				name: data.name ?? existing[0].name,
				category: data.category ?? existing[0].category,
				affiliateUrl: data.affiliateUrl !== undefined ? data.affiliateUrl?.trim() || null : existing[0].affiliateUrl,
				imageUrl: data.imageUrl !== undefined ? data.imageUrl?.trim() || null : existing[0].imageUrl,
				priceEstimate: data.priceEstimate !== undefined ? data.priceEstimate?.trim() || null : existing[0].priceEstimate,
				updatedAt: now
			})
			.where(eq(affiliateItems.id, data.id));
	} else if (data.name && data.category) {
		await db.insert(affiliateItems).values({
			id: data.id,
			name: data.name,
			category: data.category,
			affiliateUrl: data.affiliateUrl?.trim() || null,
			imageUrl: data.imageUrl?.trim() || null,
			priceEstimate: data.priceEstimate?.trim() || null,
			updatedAt: now
		});
	}
}

export async function deleteAffiliateItem(id: string) {
	await db.delete(affiliateItems).where(eq(affiliateItems.id, id));
}

export async function getAdminSettings(): Promise<Record<string, string>> {
	const rows = await db.select().from(adminSettings);
	const res: Record<string, string> = {
		site_name: "reedoing",
		site_tagline: "Lebih Sedikit Item, Lebih Banyak Outfit",
		site_logo: "",
		admin_user: process.env.ADMIN_USER || "admin",
		admin_password: process.env.ADMIN_PASSWORD || "admin123",
		shopee_fallback_url: "https://shopee.co.id",
		affiliate_disclaimer:
			"Tautan pakaian di atas terhubung ke toko resmi di Shopee. Kami dapat memperoleh sedikit komisi dari pembelianmu tanpa biaya tambahan.",
		// Pengaturan Teks Hero Section
		hero_title_1: "Lebih sedikit pakaian,",
		hero_title_2: "lebih banyak gaya.",
		hero_description:
			"Bangun capsule wardrobe fungsional 12 item yang menghasilkan 30+ kombinasi outfit siap pakai. Dirancang personal untuk pria dan wanita berdasarkan undertone urat nadi dan proporsi tubuhmu.",
		hero_cta_text: "Mulai Style Check",
		hero_cta_secondary_text: "Lihat Contoh Lookbook",
		hero_cta_subtext: "Gratis · Sekitar 3 menit · Langsung siap pakai",
		hero_floating_text: "Deteksi warna urat nadi pergelangan tangan otomatis",
		hero_stat_1_val: "12 Item",
		hero_stat_1_lbl: "Wardrobe esensial",
		hero_stat_2_val: "30+ Look",
		hero_stat_2_lbl: "Kombinasi siap pakai",
		hero_stat_3_val: "100%",
		hero_stat_3_lbl: "Gratis selamanya",
		// Pengaturan Tone Color Hero
		hero_default_tone: "hangat",
		hero_tone_warm_name: "Warm Earth & Sun",
		hero_tone_warm_desc: "Nuansa bumi hangat: broken white, camel, espresso, dan aksen terracotta.",
		hero_tone_warm_colors: JSON.stringify([
			{ name: "Broken White", hex: "#F9F6F0", role: "base" },
			{ name: "Oat Camel", hex: "#C2A27E", role: "base" },
			{ name: "Espresso Brown", hex: "#3D2B1F", role: "base" },
			{ name: "Deep Olive", hex: "#4E5340", role: "base" },
			{ name: "Terracotta", hex: "#B85D43", role: "accent" },
			{ name: "Warm Amber", hex: "#D49B4B", role: "accent" }
		]),
		hero_tone_cool_name: "Cool Slate & Coastal",
		hero_tone_cool_desc: "Nuansa sejuk berkelas: pure white, classic navy, charcoal, dan slate blue.",
		hero_tone_cool_colors: JSON.stringify([
			{ name: "Crisp White", hex: "#FFFFFF", role: "base" },
			{ name: "Classic Navy", hex: "#1B2A47", role: "base" },
			{ name: "Charcoal Grey", hex: "#33383F", role: "base" },
			{ name: "Heather Fog", hex: "#CBD2D9", role: "base" },
			{ name: "Slate Blue", hex: "#4D6B88", role: "accent" },
			{ name: "Deep Burgundy", hex: "#6B1D2F", role: "accent" }
		]),
		hero_tone_neutral_name: "Neutral Mineral & Stone",
		hero_tone_neutral_desc: "Nuansa netral seimbang: soft ecru, midnight graphite, taupe, dan sage green.",
		hero_tone_neutral_colors: JSON.stringify([
			{ name: "Soft Ecru", hex: "#F5F2EB", role: "base" },
			{ name: "Midnight Graphite", hex: "#26292E", role: "base" },
			{ name: "Smokey Taupe", hex: "#7A7265", role: "base" },
			{ name: "French Navy", hex: "#202E42", role: "base" },
			{ name: "Muted Sage", hex: "#768B75", role: "accent" },
			{ name: "Rosewood Mauve", hex: "#9B6A6C", role: "accent" }
		])
	};
	for (const row of rows) {
		res[row.key] = row.value;
	}
	return res;
}

export async function deleteAdminSetting(key: string) {
	await db.delete(adminSettings).where(eq(adminSettings.key, key));
}

export async function saveAdminSetting(key: string, value: string) {
	const now = new Date();
	const existing = await db
		.select()
		.from(adminSettings)
		.where(eq(adminSettings.key, key))
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(adminSettings)
			.set({ value, updatedAt: now })
			.where(eq(adminSettings.key, key));
	} else {
		await db.insert(adminSettings).values({
			key,
			value,
			updatedAt: now
		});
	}
}

// ==========================================
// AI GENERATED TRY-ON IMAGES
// ==========================================

export async function getAIGeneratedImage(submissionId: string, outfitId: string): Promise<string | null> {
	const rows = await db
		.select()
		.from(aiGeneratedImages)
		.where(
			and(
				eq(aiGeneratedImages.submissionId, submissionId),
				eq(aiGeneratedImages.outfitId, outfitId)
			)
		)
		.limit(1);

	return rows[0]?.imageData || null;
}

export async function saveAIGeneratedImage(
	submissionId: string,
	outfitId: string,
	imageData: string
) {
	const now = new Date();
	const existing = await db
		.select()
		.from(aiGeneratedImages)
		.where(
			and(
				eq(aiGeneratedImages.submissionId, submissionId),
				eq(aiGeneratedImages.outfitId, outfitId)
			)
		)
		.limit(1);

	if (existing.length > 0) {
		await db
			.update(aiGeneratedImages)
			.set({ imageData, createdAt: now })
			.where(eq(aiGeneratedImages.id, existing[0].id));
	} else {
		await db.insert(aiGeneratedImages).values({
			id: nanoid(24),
			submissionId,
			outfitId,
			imageData,
			createdAt: now
		});
	}
}

export async function getAllAIGeneratedImages(submissionId: string): Promise<Record<string, string>> {
	const rows = await db
		.select()
		.from(aiGeneratedImages)
		.where(eq(aiGeneratedImages.submissionId, submissionId));

	const map: Record<string, string> = {};
	for (const row of rows) {
		map[row.outfitId] = row.imageData;
	}
	return map;
}

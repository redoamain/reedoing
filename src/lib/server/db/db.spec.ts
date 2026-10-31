import { describe, it, expect, beforeAll } from "vitest";
import {
	getOrCreateSession,
	saveDraftSubmission,
	finalizeSubmission,
	getSubmissionResult,
	toggleShoppingCheck,
	getShoppingChecks,
	deleteSubmissionData,
	getSubmissionById,
	getAllAdminOutfits,
	saveAdminOutfit,
	deleteAdminOutfit,
	resetDefaultOutfits,
	getAllAffiliateItems,
	saveAffiliateItem,
	getAdminSettings,
	saveAdminSetting,
	deleteAdminSetting,
	getAffiliateMap
} from "./queries";
import { generateStyleGuide } from "$lib/engine";
import type { QuizAnswers } from "$lib/types/style";

describe("Database SQLite & Drizzle Queries", () => {
	let sessionId: string;
	let submissionId: string;

	const dummyAnswers: QuizAnswers = {
		gender: "pria",
		styles: ["smart-casual"],
		routines: ["kantor", "meeting"],
		goals: ["lebih-rapi"],
		challenges: ["bingung-padu-padan"],
		undertone: "hangat",
		bodyProportion: "seimbang"
	};

	beforeAll(async () => {
		// Pastikan sesi dibuat
		sessionId = await getOrCreateSession();
	});

	it("membuat atau mengembalikan sesi yang valid", async () => {
		expect(sessionId).toBeTruthy();
		expect(sessionId.length).toBeGreaterThanOrEqual(20);

		// Panggilan ulang dengan ID yang sama harus mengembalikan ID yang sama
		const sameSession = await getOrCreateSession(sessionId);
		expect(sameSession).toBe(sessionId);
	});

	it("menyimpan draft submission anonim", async () => {
		submissionId = await saveDraftSubmission(sessionId, 2, dummyAnswers);
		expect(submissionId).toBeTruthy();
		expect(submissionId.length).toBeGreaterThanOrEqual(21);

		const sub = await getSubmissionById(submissionId);
		expect(sub).not.toBeNull();
		expect(sub?.status).toBe("draft");
		expect(sub?.step).toBe(2);
	});

	it("memfinalisasi submission dan menyimpan hasil engine", async () => {
		const guide = generateStyleGuide(dummyAnswers);

		await finalizeSubmission(submissionId, {
			palette: guide.palette,
			capsule: guide.capsule,
			outfits: guide.outfits,
			shopping: guide.shopping
		});

		const sub = await getSubmissionById(submissionId);
		expect(sub?.status).toBe("selesai");

		const result = await getSubmissionResult(submissionId);
		expect(result).not.toBeNull();
		expect(result?.capsule.length).toBe(12);
		expect(result?.outfits.length).toBeGreaterThanOrEqual(20);
		expect(result?.palette.undertone).toBe("hangat");
	});

	it("menyimpan dan memperbarui checklist belanja", async () => {
		// Centang item outer-1
		await toggleShoppingCheck(submissionId, "outer-1", true);
		let checks = await getShoppingChecks(submissionId);
		expect(checks["outer-1"]).toBe(true);

		// Hapus centang
		await toggleShoppingCheck(submissionId, "outer-1", false);
		checks = await getShoppingChecks(submissionId);
		expect(checks["outer-1"]).toBe(false);
	});

	it("menghapus data submission secara permanen", async () => {
		await deleteSubmissionData(submissionId);

		const sub = await getSubmissionById(submissionId);
		expect(sub).toBeNull();

		const result = await getSubmissionResult(submissionId);
		expect(result).toBeNull();
	});

	it("mengambil dan mengedit outfit admin beserta link Shopee Affiliate", async () => {
		const outfits = await getAllAdminOutfits();
		expect(outfits.length).toBeGreaterThanOrEqual(32);

		const firstOutfit = outfits[0];
		expect(firstOutfit).toBeDefined();

		// Update link Shopee affiliate untuk outfit pertama
		const testShopeeUrl = "https://s.shopee.co.id/test-affiliate-outfit-1";
		await saveAdminOutfit({
			id: firstOutfit.id,
			name: firstOutfit.name,
			occasion: firstOutfit.occasion,
			occasionLabel: firstOutfit.occasionLabel,
			formula: firstOutfit.formula,
			styleTips: firstOutfit.styleTips,
			itemIds: firstOutfit.itemIds,
			affiliateUrl: testShopeeUrl,
			isActive: true
		});

		const map = await getAffiliateMap();
		expect(map.outfits[firstOutfit.id]).toBe(testShopeeUrl);
	});

	it("mengelola item belanja dan menyimpan link Shopee produk", async () => {
		const items = await getAllAffiliateItems();
		expect(items.length).toBeGreaterThanOrEqual(12);

		const testItemUrl = "https://s.shopee.co.id/test-kemeja-poplin";
		await saveAffiliateItem({
			id: "top-1",
			name: "Kemeja Katun Poplin / Oxford",
			category: "atasan",
			affiliateUrl: testItemUrl,
			priceEstimate: "Rp 150.000 - Rp 250.000"
		});

		const map = await getAffiliateMap();
		expect(map.items["top-1"]).toBe(testItemUrl);
		expect(map.itemPrices["top-1"]).toBe("Rp 150.000 - Rp 250.000");
	});

	it("menyimpan dan membaca pengaturan Shopee Affiliate global", async () => {
		await saveAdminSetting("shopee_fallback_url", "https://shopee.co.id/rupakastyle");
		const settings = await getAdminSettings();
		expect(settings.shopee_fallback_url).toBe("https://shopee.co.id/rupakastyle");
	});

	it("menyimpan, membaca, dan mereset pengaturan kata-kata Hero dan Tone Color", async () => {
		// 1. Cek default value sebelum diubah
		const initial = await getAdminSettings();
		expect(initial.hero_title_1).toBe("Lebih sedikit pakaian,");
		expect(initial.hero_default_tone).toBe("hangat");

		// 2. Simpan kata-kata hero kustom
		await saveAdminSetting("hero_title_1", "Gaya Minimalis Elegan,");
		await saveAdminSetting("hero_title_2", "maksimalkan potensimu.");
		await saveAdminSetting("hero_description", "Panduan gaya personal modern dengan 12 item esensial.");
		await saveAdminSetting("hero_cta_text", "Mulai Konsultasi");

		// 3. Simpan pengaturan tone color kustom
		await saveAdminSetting("hero_default_tone", "dingin");
		const customWarmColors = [
			{ name: "Cream White", hex: "#FFFDF9", role: "base" },
			{ name: "Golden Honey", hex: "#D4A373", role: "base" },
			{ name: "Coffee", hex: "#2B1E16", role: "base" },
			{ name: "Forest", hex: "#3A5A40", role: "base" },
			{ name: "Rust", hex: "#BC4749", role: "accent" },
			{ name: "Mustard", hex: "#E9C46A", role: "accent" }
		];
		await saveAdminSetting("hero_tone_warm_colors", JSON.stringify(customWarmColors));

		// 4. Verifikasi pembacaan
		const updated = await getAdminSettings();
		expect(updated.hero_title_1).toBe("Gaya Minimalis Elegan,");
		expect(updated.hero_title_2).toBe("maksimalkan potensimu.");
		expect(updated.hero_description).toBe("Panduan gaya personal modern dengan 12 item esensial.");
		expect(updated.hero_cta_text).toBe("Mulai Konsultasi");
		expect(updated.hero_default_tone).toBe("dingin");
		expect(JSON.parse(updated.hero_tone_warm_colors)).toEqual(customWarmColors);

		// 5. Hapus / Reset pengaturan dan pastikan kembali ke fallback default
		await deleteAdminSetting("hero_title_1");
		await deleteAdminSetting("hero_default_tone");
		const reset = await getAdminSettings();
		expect(reset.hero_title_1).toBe("Lebih sedikit pakaian,");
		expect(reset.hero_default_tone).toBe("hangat");
	});
});

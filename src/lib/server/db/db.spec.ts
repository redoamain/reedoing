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
});

import { describe, it, expect } from "vitest";
import {
	generateColorPalette,
	generateCapsuleWardrobe,
	generateOutfits,
	generateShoppingPriority,
	generateStyleGuide
} from "./index";
import type { QuizAnswers } from "$lib/types/style";

describe("Engine Rekomendasi Style Guideline", () => {
	const sampleAnswersMan: QuizAnswers = {
		gender: "pria",
		styles: ["smart-casual", "minimalis"],
		routines: ["kantor", "meeting", "hangout"],
		goals: ["lebih-rapi", "hemat-belanja"],
		challenges: ["bingung-padu-padan"],
		undertone: "hangat",
		bodyProportion: "seimbang"
	};

	const sampleAnswersWomanHijab: QuizAnswers = {
		gender: "wanita",
		hijab: "ya",
		coverage: "longgar",
		styles: ["feminin", "minimalis"],
		routines: ["kampus", "hangout", "kantor"],
		goals: ["percaya-diri"],
		challenges: ["lemari-penuh"],
		undertone: "dingin",
		bodyProportion: "petite"
	};

	describe("generateColorPalette", () => {
		it("menghasilkan palet hangat untuk undertone hangat", () => {
			const palette = generateColorPalette("hangat", ["minimalis"]);
			expect(palette.undertone).toBe("hangat");
			expect(palette.baseColors.length).toBeGreaterThanOrEqual(3);
			expect(palette.accentColors.length).toBe(2);
			expect(palette.avoidColors.length).toBe(2);
			expect(palette.baseColors.some((c) => c.name.includes("White"))).toBe(true);
		});

		it("menghasilkan palet dingin dengan navy dan burgundy untuk undertone dingin", () => {
			const palette = generateColorPalette("dingin", ["smart-casual"]);
			expect(palette.undertone).toBe("dingin");
			expect(palette.baseColors.some((c) => c.name.includes("Navy"))).toBe(true);
			expect(palette.accentColors.some((c) => c.name.includes("Burgundy"))).toBe(true);
		});

		it("menghasilkan palet netral untuk undertone netral", () => {
			const palette = generateColorPalette("netral", ["casual"]);
			expect(palette.undertone).toBe("netral");
			expect(palette.accentColors.some((c) => c.name.includes("Sage"))).toBe(true);
		});
	});

	describe("generateCapsuleWardrobe", () => {
		it("menghasilkan 8-14 item (tepatnya 12 item esensial)", () => {
			const capsule = generateCapsuleWardrobe(sampleAnswersMan);
			expect(capsule.length).toBeGreaterThanOrEqual(8);
			expect(capsule.length).toBeLessThanOrEqual(14);
			expect(capsule.length).toBe(12);

			const categories = new Set(capsule.map((i) => i.category));
			expect(categories.has("outer")).toBe(true);
			expect(categories.has("atasan")).toBe(true);
			expect(categories.has("bawahan")).toBe(true);
			expect(categories.has("sepatu")).toBe(true);
		});

		it("menyesuaikan item untuk wanita berhijab", () => {
			const capsule = generateCapsuleWardrobe(sampleAnswersWomanHijab);
			const hasHijabAccessory = capsule.some(
				(i) => i.name.toLowerCase().includes("hijab") || i.name.toLowerCase().includes("pashmina")
			);
			expect(hasHijabAccessory).toBe(true);

			const hasModestTop = capsule.some(
				(i) => i.name.toLowerCase().includes("tunik") || i.name.toLowerCase().includes("longsleeve") || i.name.toLowerCase().includes("lengan panjang")
			);
			expect(hasModestTop).toBe(true);
		});

		it("memberikan fitTips proporsi petite yang tepat", () => {
			const capsule = generateCapsuleWardrobe(sampleAnswersWomanHijab);
			const trousers = capsule.find((i) => i.category === "bawahan");
			expect(trousers?.fitTips).toBeDefined();
			expect(trousers?.fitTips.length).toBeGreaterThan(10);
		});
	});

	describe("generateOutfits", () => {
		it("menghasilkan minimal 20 outfit dari 12 item (30+ outfit)", () => {
			const capsule = generateCapsuleWardrobe(sampleAnswersMan);
			const outfits = generateOutfits(capsule);

			expect(outfits.length).toBeGreaterThanOrEqual(20);
			expect(outfits.length).toBeGreaterThanOrEqual(30);

			for (const outfit of outfits) {
				expect(outfit.itemIds.length).toBeGreaterThanOrEqual(3);
				expect(outfit.items?.length).toBe(outfit.itemIds.length);
				expect(outfit.styleTips).toBeTruthy();
			}
		});

		it("mencakup semua situasi: kantor, meeting, kampus, hangout, santai, formal", () => {
			const capsule = generateCapsuleWardrobe(sampleAnswersMan);
			const outfits = generateOutfits(capsule);
			const occasions = new Set(outfits.map((o) => o.occasion));

			expect(occasions.has("kantor")).toBe(true);
			expect(occasions.has("meeting")).toBe(true);
			expect(occasions.has("kampus")).toBe(true);
			expect(occasions.has("hangout")).toBe(true);
			expect(occasions.has("santai")).toBe(true);
			expect(occasions.has("formal")).toBe(true);
		});
	});

	describe("generateShoppingPriority", () => {
		it("mengurutkan daftar belanja berdasarkan frekuensi pemakaian outfit", () => {
			const capsule = generateCapsuleWardrobe(sampleAnswersMan);
			const outfits = generateOutfits(capsule);
			const shopping = generateShoppingPriority(capsule, outfits);

			expect(shopping.length).toBe(capsule.length);
			// Pastikan urutan menurun
			for (let i = 0; i < shopping.length - 1; i++) {
				expect(shopping[i].outfitCount).toBeGreaterThanOrEqual(shopping[i + 1].outfitCount);
			}

			// Item teratas harus prioritas Tinggi
			expect(shopping[0].priority).toBe("Tinggi");
		});
	});

	describe("generateStyleGuide (End-to-End)", () => {
		it("menghasilkan panduan lengkap yang koheren", () => {
			const guide = generateStyleGuide(sampleAnswersMan);

			expect(guide.summary.headline).toContain("Capsule Wardrobe");
			expect(guide.summary.itemCount).toBe(12);
			expect(guide.summary.outfitCount).toBeGreaterThanOrEqual(30);
			expect(guide.palette.baseColors.length).toBeGreaterThanOrEqual(3);
			expect(guide.capsule.length).toBe(12);
			expect(guide.outfits.length).toBeGreaterThanOrEqual(30);
			expect(guide.shopping.length).toBe(12);
		});
	});
});

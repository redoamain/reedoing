import { describe, it, expect } from "vitest";
import {
	rgbToHex,
	rgbToLab,
	isSkinPixel,
	classifyUndertoneFromRGB,
	analyzeSkinFromImageData
} from "./photo-analyzer";

describe("Photo Analyzer & Skin Undertone Detection", () => {
	it("mengonversi RGB ke format HEX dengan benar", () => {
		expect(rgbToHex(255, 255, 255)).toBe("#FFFFFF");
		expect(rgbToHex(0, 0, 0)).toBe("#000000");
		expect(rgbToHex(210, 175, 140)).toBe("#D2AF8C");
	});

	it("mengonversi RGB ke Lab color space", () => {
		const lab = rgbToLab(210, 175, 140);
		expect(lab.l).toBeGreaterThan(0);
		expect(lab.l).toBeLessThanOrEqual(100);
		expect(typeof lab.a).toBe("number");
		expect(typeof lab.b).toBe("number");
	});

	it("mengenali pixel warna kulit manusia", () => {
		// Nilai kulit khas
		expect(isSkinPixel(210, 160, 120)).toBe(true);
		// Nilai non-kulit (hijau murni, biru langit, hitam pekat)
		expect(isSkinPixel(0, 255, 0)).toBe(false);
		expect(isSkinPixel(50, 150, 255)).toBe(false);
		expect(isSkinPixel(10, 10, 10)).toBe(false);
	});

	it("mendeteksi undertone hangat untuk kulit bernuansa keemasan/peachy", () => {
		// Kulit hangat khas tropis (golden warmth)
		const res = classifyUndertoneFromRGB(220, 170, 115);
		expect(res.undertone).toBe("hangat");
		expect(res.confidence).toBeGreaterThanOrEqual(70);
		expect(res.explanation).toContain("keemasan");
	});

	it("mendeteksi undertone dingin untuk kulit bernuansa sejuk/rosy", () => {
		// Kulit dingin (rosy/pinkish)
		const res = classifyUndertoneFromRGB(230, 180, 185);
		expect(res.undertone).toBe("dingin");
		expect(res.confidence).toBeGreaterThanOrEqual(70);
		expect(res.explanation).toContain("sejuk");
	});

	it("mendeteksi undertone netral untuk kulit seimbang", () => {
		// Kulit netral (seimbang)
		const res = classifyUndertoneFromRGB(212, 180, 152);
		expect(res.undertone).toBe("netral");
		expect(res.confidence).toBeGreaterThanOrEqual(70);
	});

	it("mengekstrak warna dominan dari ImageData buatan", () => {
		// Buat mock ImageData 10x10 dengan warna kulit hangat
		const width = 10;
		const height = 10;
		const buffer = new Uint8ClampedArray(width * height * 4);

		for (let i = 0; i < buffer.length; i += 4) {
			buffer[i] = 220; // R
			buffer[i + 1] = 170; // G
			buffer[i + 2] = 120; // B
			buffer[i + 3] = 255; // Alpha
		}

		const mockImageData = {
			data: buffer,
			width,
			height,
			colorSpace: "srgb" as PredefinedColorSpace
		} as ImageData;

		const analysis = analyzeSkinFromImageData(mockImageData);
		expect(analysis.dominantHex).toBeTruthy();
		expect(analysis.dominantHex.startsWith("#")).toBe(true);
		expect(analysis.recommendedOutfitColors.length).toBeGreaterThan(0);
		expect(analysis.avoidColors.length).toBeGreaterThan(0);
	});
});

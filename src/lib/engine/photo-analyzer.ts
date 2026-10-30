import type { Undertone } from "$lib/types/style";

export type VeinColorType = "hijau" | "biru" | "campuran";

export interface PhotoAnalysisResult {
	dominantHex: string;
	rgb: { r: number; g: number; b: number };
	undertone: Undertone;
	confidence: number;
	explanation: string;
	recommendedOutfitColors: string[];
	avoidColors: string[];
	skinDetected: boolean;
	veinDetected: boolean;
	veinColorType: VeinColorType;
	veinDescription: string;
}

/**
 * Konversi RGB (0-255) ke HEX string
 */
export function rgbToHex(r: number, g: number, b: number): string {
	const toHex = (n: number) => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0");
	return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/**
 * Konversi RGB ke sRGB linear lalu ke CIE Lab untuk analisis undertone b* (yellow-blue) dan a* (red-green)
 */
export function rgbToLab(r: number, g: number, b: number): { l: number; a: number; b: number } {
	let sR = r / 255;
	let sG = g / 255;
	let sB = b / 255;

	sR = sR > 0.04045 ? Math.pow((sR + 0.055) / 1.055, 2.4) : sR / 12.92;
	sG = sG > 0.04045 ? Math.pow((sG + 0.055) / 1.055, 2.4) : sG / 12.92;
	sB = sB > 0.04045 ? Math.pow((sB + 0.055) / 1.055, 2.4) : sB / 12.92;

	const x = (sR * 0.4124 + sG * 0.3576 + sB * 0.1805) / 0.95047;
	const y = (sR * 0.2126 + sG * 0.7152 + sB * 0.0722) / 1.0;
	const z = (sR * 0.0193 + sG * 0.1192 + sB * 0.9505) / 1.08883;

	const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1 / 3) : 7.787 * t + 16 / 116);

	const fx = f(x);
	const fy = f(y);
	const fz = f(z);

	const l = Math.max(0, 116 * fy - 16);
	const a = 500 * (fx - fy);
	const bVal = 200 * (fy - fz);

	return { l, a, b: bVal };
}

/**
 * Cek apakah sebuah pixel RGB berada dalam rentang pigmen kulit manusia
 */
export function isSkinPixel(r: number, g: number, b: number): boolean {
	const basicSkin =
		r > 60 &&
		g > 40 &&
		b > 20 &&
		r > g &&
		r > b &&
		Math.abs(r - g) > 12 &&
		r - b > 15;

	if (!basicSkin) return false;

	const brightness = (r + g + b) / 3;
	if (brightness < 35 || brightness > 245) return false;

	return true;
}

/**
 * Dapatkan rekomendasi warna pakaian dan warna yang dihindari berdasarkan undertone
 */
export function getOutfitColorsForUndertone(undertone: Undertone): {
	recommended: string[];
	avoid: string[];
} {
	if (undertone === "hangat") {
		return {
			recommended: ["Broken White", "Cokelat Espresso", "Camel / Oat", "Terracotta", "Deep Olive", "Warm Beige"],
			avoid: ["Icy Blue Neon", "Magenta Terik", "Stark Pure White"]
		};
	} else if (undertone === "dingin") {
		return {
			recommended: ["Pure White", "Deep Navy", "Charcoal Grey", "Dusty Blue", "Burgundy", "Emerald Sejuk"],
			avoid: ["Kuning Mustard", "Jingga Oranye Terik", "Cokelat Karamel"]
		};
	} else {
		return {
			recommended: ["Ecru White", "Midnight Graphite", "Smokey Taupe", "Sage Green", "Dusty Rosewood", "Classic Navy"],
			avoid: ["Kuning Stabilo Neon", "Fluorescent Orange", "Magenta Neon"]
		};
	}
}

/**
 * Klasifikasi undertone berdasarkan nilai RGB & Lab permukaan kulit
 */
export function classifyUndertoneFromRGB(r: number, g: number, b: number): {
	undertone: Undertone;
	confidence: number;
	explanation: string;
} {
	const lab = rgbToLab(r, g, b);
	const goldenIndex = lab.b; // yellow vs blue
	const rosyIndex = lab.a; // red vs green
	const ratio = goldenIndex / (rosyIndex || 1);

	let undertone: Undertone = "netral";
	let confidence = 88;
	let explanation = "";

	if (goldenIndex > 22 || (goldenIndex > 19 && ratio > 2.2)) {
		undertone = "hangat";
		confidence = Math.min(97, Math.round(75 + goldenIndex * 0.6));
		explanation =
			"Pigmen kulitmu didominasi spektrum keemasan/peachy (warm tone). Nuansa bumi (earthy tones), broken white, camel, dan terracotta akan menyatu paling harmonis dengan warna kulitmu.";
	} else if (goldenIndex < 11 || ratio < 0.95) {
		undertone = "dingin";
		confidence = Math.min(96, Math.round(82 + (12 - goldenIndex) * 1.1));
		explanation =
			"Pigmen kulitmu didominasi spektrum sejuk/rosy (cool tone). Nuansa sejuk tegas seperti navy klasik, abu arang, pure white, dan burgundy akan membuat kulitmu tampak cerah dan jernih.";
	} else {
		undertone = "netral";
		confidence = 92;
		explanation =
			"Kulitmu memiliki keseimbangan alami antara pigmen hangat dan sejuk (neutral tone). Kamu sangat fleksibel memadukan spektrum warna navy, krem taupe, maupun aksen sage green.";
	}

	return { undertone, confidence, explanation };
}

/**
 * Buat hasil analisis lengkap berdasarkan jenis urat nadi (manual override atau re-sinkronisasi)
 */
export function buildResultForVein(
	veinType: VeinColorType,
	skinHex: string,
	baseConfidence: number = 94
): PhotoAnalysisResult {
	const undertone: Undertone =
		veinType === "hijau" ? "hangat" : veinType === "biru" ? "dingin" : "netral";

	const { recommended, avoid } = getOutfitColorsForUndertone(undertone);

	let veinDescription = "";
	let explanation = "";

	if (veinType === "hijau") {
		veinDescription = "Urat nadi pergelangan tangan tampak kehijauan (olive green).";
		explanation =
			"Urat nadi kehijauan/olive menandakan Warm Color Tone. Pigmen alami keemasan (yellow/peachy) pada lapisan kulit membiaskan warna biru pembuluh darah sehingga tampak hijau. Koleksi pakaian bernuansa earthy (broken white, camel, terracotta, olive) akan menyatu paling memukau dengan kulitmu.";
	} else if (veinType === "biru") {
		veinDescription = "Urat nadi pergelangan tangan tampak kebiruan atau ungu.";
		explanation =
			"Urat nadi kebiruan/ungu menandakan Cool Color Tone. Lapisan kulitmu minim pigmen kuning sehingga warna alami pembuluh darah terpancar jernih biru/ungu. Koleksi pakaian bernuansa sejuk (pure white, deep navy, abu arang, burgundy) akan membuat penampilanmu terlihat segar dan berkarakter.";
	} else {
		veinDescription = "Urat nadi pergelangan tangan tampak campuran seimbang antara hijau dan biru.";
		explanation =
			"Urat nadi campuran hijau-biru menandakan Neutral Color Tone. Kulitmu berada di titik keseimbangan alami tanpa dominasi hangat atau dingin, memberikan fleksibilitas tinggi dalam mengenakan spektrum warna netral, sage, maupun navy.";
	}

	// Parse hex ke RGB
	const cleanHex = skinHex.replace("#", "");
	const r = parseInt(cleanHex.substring(0, 2), 16) || 210;
	const g = parseInt(cleanHex.substring(2, 4), 16) || 175;
	const b = parseInt(cleanHex.substring(4, 6), 16) || 145;

	return {
		dominantHex: skinHex,
		rgb: { r, g, b },
		undertone,
		confidence: baseConfidence,
		explanation,
		recommendedOutfitColors: recommended,
		avoidColors: avoid,
		skinDetected: true,
		veinDetected: true,
		veinColorType: veinType,
		veinDescription
	};
}

/**
 * Menganalisis ImageData (dari HTML5 canvas) untuk mengekstrak warna kulit dan pembuluh darah urat nadi pergelangan tangan
 */
export function analyzeSkinFromImageData(imageData: ImageData): PhotoAnalysisResult {
	const data = imageData.data;
	const width = imageData.width;
	const height = imageData.height;

	const startX = Math.floor(width * 0.15);
	const endX = Math.floor(width * 0.85);
	const startY = Math.floor(height * 0.15);
	const endY = Math.floor(height * 0.85);

	let totalR = 0;
	let totalG = 0;
	let totalB = 0;
	let skinPixelCount = 0;

	let allPixelR = 0;
	let allPixelG = 0;
	let allPixelB = 0;
	let allCount = 0;

	// Penampung data pixel kulit untuk analisis urat nadi
	const skinPixels: Array<{ r: number; g: number; b: number; lum: number }> = [];

	for (let y = startY; y < endY; y += 2) {
		for (let x = startX; x < endX; x += 2) {
			const idx = (y * width + x) * 4;
			const r = data[idx];
			const g = data[idx + 1];
			const b = data[idx + 2];
			const a = data[idx + 3];

			if (a > 200) {
				allPixelR += r;
				allPixelG += g;
				allPixelB += b;
				allCount++;

				if (isSkinPixel(r, g, b)) {
					totalR += r;
					totalG += g;
					totalB += b;
					skinPixelCount++;

					const lum = 0.299 * r + 0.587 * g + 0.114 * b;
					skinPixels.push({ r, g, b, lum });
				}
			}
		}
	}

	let avgR = 210;
	let avgG = 175;
	let avgB = 145;

	if (skinPixelCount > 20) {
		avgR = Math.round(totalR / skinPixelCount);
		avgG = Math.round(totalG / skinPixelCount);
		avgB = Math.round(totalB / skinPixelCount);
	} else if (allCount > 0) {
		avgR = Math.round(allPixelR / allCount);
		avgG = Math.round(allPixelG / allCount);
		avgB = Math.round(allPixelB / allCount);
	}

	const dominantHex = rgbToHex(avgR, avgG, avgB);
	const skinLabResult = classifyUndertoneFromRGB(avgR, avgG, avgB);

	// Analisis Urat Nadi (Vascular Subcutaneous Tint Analysis)
	// Urat nadi pada pergelangan tangan bagian dalam memiliki kontras pencahayaan sedikit lebih gelap (lum lebih rendah)
	// dengan pembiasan warna kehijauan (Warm) atau kebiruan/keunguan (Cool).
	const avgLum = 0.299 * avgR + 0.587 * avgG + 0.114 * avgB;
	let greenVeinScore = 0;
	let blueVeinScore = 0;
	let veinCandidateCount = 0;

	if (skinPixels.length > 50) {
		const baseGreenRatio = avgG / (avgR + avgB + 0.001);
		const baseBlueRatio = avgB / (avgR + avgG + 0.001);

		for (const p of skinPixels) {
			// Urat nadi berada pada area bayangan vaskular yang sedikit lebih gelap dari rata-rata kulit (70% - 95% dari lum rata-rata)
			if (p.lum >= avgLum * 0.65 && p.lum <= avgLum * 0.96) {
				const pGreenRatio = p.g / (p.r + p.b + 0.001);
				const pBlueRatio = p.b / (p.r + p.g + 0.001);

				const diffGreen = pGreenRatio - baseGreenRatio;
				const diffBlue = pBlueRatio - baseBlueRatio;

				if (diffGreen > 0.015 && p.g > p.b) {
					greenVeinScore += 1 + diffGreen * 10;
					veinCandidateCount++;
				} else if (diffBlue > 0.015 && (p.b > p.g || (p.b / p.g) > 0.85)) {
					blueVeinScore += 1 + diffBlue * 10;
					veinCandidateCount++;
				}
			}
		}
	}

	const veinDetected = veinCandidateCount >= 15;
	let veinColorType: VeinColorType = "campuran";
	let undertone: Undertone = skinLabResult.undertone;
	let veinDescription = "";
	let explanation = "";
	let confidence = skinLabResult.confidence;

	if (veinDetected) {
		if (greenVeinScore > blueVeinScore * 1.3) {
			veinColorType = "hijau";
			undertone = "hangat";
			confidence = Math.min(97, Math.round(confidence + 5));
			veinDescription = "Urat nadi pergelangan tangan terdeteksi dominan kehijauan (olive green).";
			explanation =
				"Foto pergelangan tangan mendeteksi urat nadi berwarna kehijauan (olive green). Pembiasan hijau ini adalah indikator akurat Warm Color Tone, karena pigmen kulit keemasan/peachy menyaring cahaya pembuluh darah. Warna bumi seperti Broken White, Camel, Terracotta, dan Deep Olive akan berpadu sempurna dengan penampilanmu.";
		} else if (blueVeinScore > greenVeinScore * 1.3) {
			veinColorType = "biru";
			undertone = "dingin";
			confidence = Math.min(96, Math.round(confidence + 5));
			veinDescription = "Urat nadi pergelangan tangan terdeteksi dominan kebiruan atau ungu.";
			explanation =
				"Foto pergelangan tangan mendeteksi urat nadi berwarna kebiruan hingga ungu. Pembiasan biru jernih ini adalah indikator akurat Cool Color Tone akibat pigmen kulit sejuk alami. Warna berani dan sejuk seperti Pure White, Deep Navy, Abu Arang, dan Burgundy akan membuat kulitmu tampak cerah dan tegas.";
		} else {
			veinColorType = "campuran";
			undertone = "netral";
			confidence = Math.min(94, Math.round(confidence + 3));
			veinDescription = "Urat nadi pergelangan tangan memperlihatkan perpaduan seimbang warna hijau dan biru.";
			explanation =
				"Foto pergelangan tangan memperlihatkan perpaduan warna urat nadi hijau dan biru secara seimbang. Ini menandakan Neutral Color Tone. Kulitmu tidak condong ke pigmen hangat maupun dingin berlebih, sehingga kamu memiliki kebebasan tinggi mengenakan spektrum warna netral, navy klasik, maupun sage green.";
		}
	} else {
		// Jika kontras urat nadi kurang menonjol, ikuti klasifikasi CIE Lab kulit dan beri keterangan ramah
		undertone = skinLabResult.undertone;
		veinColorType = undertone === "hangat" ? "hijau" : undertone === "dingin" ? "biru" : "campuran";
		veinDescription =
			undertone === "hangat"
				? "Berdasarkan pigmen keemasan permukaan kulit, urat nadi pergelangan tangan cenderung kehijauan."
				: undertone === "dingin"
					? "Berdasarkan pigmen sejuk permukaan kulit, urat nadi pergelangan tangan cenderung kebiruan/ungu."
					: "Urat nadi pergelangan tangan terlihat memadukan spektrum biru dan hijau.";

		explanation = skinLabResult.explanation;
	}

	const { recommended, avoid } = getOutfitColorsForUndertone(undertone);
	const skinDetected = skinPixelCount >= 10;

	return {
		dominantHex,
		rgb: { r: avgR, g: avgG, b: avgB },
		undertone,
		confidence: skinDetected ? confidence : 65,
		explanation: skinDetected
			? explanation
			: "Warna kulit dan urat nadi pergelangan tangan kurang terbaca jelas. Disarankan mengambil foto di dekat jendela dengan pencahayaan alami terang siang hari.",
		recommendedOutfitColors: recommended,
		avoidColors: avoid,
		skinDetected,
		veinDetected,
		veinColorType,
		veinDescription
	};
}

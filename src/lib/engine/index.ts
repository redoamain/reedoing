import type { QuizAnswers, StyleGuideResult } from "$lib/types/style";
import { generateColorPalette } from "./palette";
import { generateCapsuleWardrobe } from "./capsule";
import { generateOutfits, type OutfitTemplate } from "./outfits";
import { generateShoppingPriority } from "./shopping";

export function generateStyleGuide(
	answers: QuizAnswers,
	customTemplates?: OutfitTemplate[]
): StyleGuideResult {
	const palette = generateColorPalette(answers.undertone, answers.styles);
	const capsule = generateCapsuleWardrobe(answers);
	const outfits = generateOutfits(capsule, customTemplates);
	const shopping = generateShoppingPriority(capsule, outfits);

	const styleNamesMap: Record<string, string> = {
		casual: "Casual Santai",
		"smart-casual": "Smart Casual",
		minimalis: "Minimalis Fungsional",
		klasik: "Klasik Abadi",
		streetwear: "Streetwear Kontemporer",
		feminin: "Feminin Elegan"
	};

	const primaryStyleName =
		answers.styles.length > 0
			? styleNamesMap[answers.styles[0]] || answers.styles[0]
			: "Minimalis Fungsional";

	const genderDesc =
		answers.gender === "wanita"
			? answers.hijab === "ya"
				? "Wanita (Hijab Modest)"
				: "Wanita"
			: "Pria";

	const headline = `Panduan Capsule Wardrobe ${primaryStyleName}`;
	const subheadline = `Koleksi esensial dirancang khusus untuk proporsi tubuhmu, undertone kulit ${answers.undertone}, dan rutinitas aktif harian.`;

	let photoAnalysis = undefined;
	if (answers.photoSkinHex) {
		const recColors =
			answers.undertone === "hangat"
				? ["Broken White", "Cokelat Espresso", "Camel / Oat", "Terracotta", "Deep Olive"]
				: answers.undertone === "dingin"
					? ["Pure White", "Deep Navy", "Charcoal Grey", "Dusty Blue", "Burgundy"]
					: ["Ecru White", "Midnight Graphite", "Smokey Taupe", "Sage Green", "Dusty Rosewood"];
		const avoidColors =
			answers.undertone === "hangat"
				? ["Icy Blue Neon", "Magenta Tajam"]
				: answers.undertone === "dingin"
					? ["Kuning Mustard", "Jingga Oranye Terik"]
					: ["Kuning Stabilo Neon", "Fluorescent Orange"];

		const veinType =
			answers.photoVeinType ||
			(answers.undertone === "hangat" ? "hijau" : answers.undertone === "dingin" ? "biru" : "campuran");

		const veinDesc =
			veinType === "hijau"
				? "Urat nadi pergelangan tangan terdeteksi dominan kehijauan (Warm Color Tone)."
				: veinType === "biru"
					? "Urat nadi pergelangan tangan terdeteksi dominan kebiruan/ungu (Cool Color Tone)."
					: "Urat nadi pergelangan tangan terdeteksi perpaduan seimbang hijau & biru (Neutral Color Tone).";

		photoAnalysis = {
			skinHex: answers.photoSkinHex,
			undertone: answers.undertone,
			confidence: answers.photoConfidence || 92,
			recommendedOutfitColors: recColors,
			avoidColors,
			veinColorType: veinType,
			veinDescription: veinDesc,
			explanation:
				answers.undertone === "hangat"
					? "Berdasarkan analisis warna kulit & urat nadi pergelangan tangan yang kehijauan, kamu memiliki Warm Color Tone. Pigmen kulit keemasan/peachy sangat memikat saat dipadukan dengan palet bernuansa bumi (earthy tones), broken white, camel, dan terracotta."
					: answers.undertone === "dingin"
						? "Berdasarkan analisis warna kulit & urat nadi pergelangan tangan yang kebiruan/ungu, kamu memiliki Cool Color Tone. Spektrum sejuk alami membuat kulitmu tampak cerah dan jernih dengan warna kontras tegas seperti deep navy, abu arang, pure white, dan burgundy."
						: "Berdasarkan analisis warna kulit & urat nadi pergelangan tangan campuran hijau-biru, kamu memiliki Neutral Color Tone. Kulitmu memiliki keseimbangan sejuk-hangat yang harmonis dan fleksibel memadukan spektrum warna navy, krem taupe, maupun sage green."
		};
	}

	return {
		summary: {
			headline,
			subheadline,
			itemCount: capsule.length,
			outfitCount: outfits.length,
			primaryStyle: primaryStyleName,
			genderDesc,
			coreRatio: `${capsule.length} item esensial → ${outfits.length} outfit siap pakai`
		},
		palette,
		capsule,
		outfits,
		shopping,
		photoAnalysis
	};
}

export * from "./palette";
export * from "./capsule";
export * from "./outfits";
export * from "./shopping";
export * from "./photo-analyzer";

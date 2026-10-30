import { db } from "./db";
import { adminSettings } from "./db/schema";
import { eq } from "drizzle-orm";
import type { Outfit, QuizAnswers } from "$lib/types/style";

/**
 * Mengambil Gemini API Key dari environment variable atau dari pengaturan database admin
 */
export async function getGeminiApiKey(): Promise<string | null> {
	// 1. Cek dari process.env
	if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0) {
		return process.env.GEMINI_API_KEY.trim();
	}

	// 2. Cek dari database admin_settings
	try {
		const row = await db
			.select()
			.from(adminSettings)
			.where(eq(adminSettings.key, "gemini_api_key"))
			.limit(1);

		if (row[0]?.value && row[0].value.trim().length > 0) {
			return row[0].value.trim();
		}
	} catch (err) {
		console.error("[Gemini] Error checking admin_settings for API key:", err);
	}

	return null;
}

export interface GenerateTryOnParams {
	outfit: Outfit;
	userAnswers: QuizAnswers;
	userPhotoBase64?: string;
}

export interface GenerateTryOnResult {
	success: boolean;
	imageUrl?: string;
	promptUsed?: string;
	message?: string;
}

/**
 * Men-generate visualisasi foto model/pengguna mengenakan kombinasi outfit menggunakan Google Imagen 3 / Gemini
 */
export async function generateOutfitTryOn(
	params: GenerateTryOnParams
): Promise<GenerateTryOnResult> {
	const apiKey = await getGeminiApiKey();

	if (!apiKey) {
		return {
			success: false,
			message:
				"API Key Google Gemini belum dikonfigurasi. Harap isi GEMINI_API_KEY di file .env atau melalui menu Pengaturan di Panel Admin."
		};
	}

	const { outfit, userAnswers } = params;

	// Susun deskripsi model berdasarkan preferensi pengguna
	const isWoman = userAnswers.gender === "wanita";
	const isHijab = isWoman && userAnswers.hijab === "ya";
	const genderDesc = isHijab
		? "an Indonesian young woman wearing an elegant minimalist modern hijab"
		: isWoman
			? "an Indonesian modern stylish young woman with neat contemporary hair"
			: "an Indonesian modern stylish young man with well-groomed hair";

	const undertoneDesc =
		userAnswers.undertone === "hangat"
			? "warm golden honey undertone skin"
			: userAnswers.undertone === "dingin"
				? "cool porcelain fair undertone skin"
				: "natural balanced neutral undertone skin";

	const bodyShapeMap: Record<string, string> = {
		seimbang: "balanced athletic proportions",
		"atasan-lebar": "inverted triangle silhouette with structured shoulders",
		"bawahan-lebar": "pear silhouette with relaxed flattering trousers",
		"tinggi-ramping": "tall lean elegant frame",
		petite: "petite well-proportioned frame with elongating vertical lines"
	};
	const bodyDesc = bodyShapeMap[userAnswers.bodyProportion] || "natural balanced fit";

	// Rincian item pakaian
	const itemsList = outfit.items && outfit.items.length > 0
		? outfit.items.map((it) => `${it.name} in ${it.color}`).join(", ")
		: outfit.formula;

	// Prompt Imagen 3 fotorealistis editorial
	const prompt = [
		`Full-body editorial fashion lookbook photograph of ${genderDesc}, ${undertoneDesc}, ${bodyDesc}.`,
		`The person is wearing the exact outfit combination: ${outfit.name} (${outfit.formula}). Detailed clothing items: ${itemsList}.`,
		`The outfit is impeccably fitted, clean tailoring, premium natural textiles, harmonious colors.`,
		`Standing in a clean, sophisticated modern architectural setting with soft ambient natural window daylight.`,
		`Cinematic lighting, 8k resolution, authentic real human skin texture, ultra-high fashion catalog aesthetic, 35mm lens depth of field.`
	].join(" ");

	try {
		// Panggil endpoint Google Imagen 3 via REST
		const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:predict?key=${apiKey}`;

		const response = await fetch(url, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				instances: [
					{
						prompt
					}
				],
				parameters: {
					sampleCount: 1,
					aspectRatio: "3:4"
				}
			})
		});

		if (!response.ok) {
			const errText = await response.text();
			console.error("[Gemini Imagen Error]", response.status, errText);

			// Berikan pesan ramah kepada admin/user
			let userMsg = "Gagal memproses gambar dari Google AI.";
			if (response.status === 400) {
				userMsg = "Permintaan gambar tidak valid atau kuota model Google AI telah tercapai.";
			} else if (response.status === 403) {
				userMsg = "API Key Gemini tidak valid atau belum memiliki akses ke model Imagen 3.";
			}

			return {
				success: false,
				message: `${userMsg} (Status: ${response.status})`
			};
		}

		const data = await response.json();
		const prediction = data.predictions?.[0];

		if (!prediction?.bytesBase64Encoded) {
			return {
				success: false,
				message: "Google Imagen tidak mengembalikan data gambar yang valid."
			};
		}

		const mimeType = prediction.mimeType || "image/jpeg";
		const imageUrl = `data:${mimeType};base64,${prediction.bytesBase64Encoded}`;

		return {
			success: true,
			imageUrl,
			promptUsed: prompt
		};
	} catch (err: any) {
		console.error("[Gemini Network Error]", err);
		return {
			success: false,
			message: err?.message || "Terjadi kesalahan jaringan saat menghubungi Google Gemini API."
		};
	}
}

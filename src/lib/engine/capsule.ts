import type { QuizAnswers, CapsuleItem, BodyProportion } from "$lib/types/style";

export function generateCapsuleWardrobe(answers: QuizAnswers): CapsuleItem[] {
	const { gender, hijab, styles, bodyProportion, undertone } = answers;
	const isWoman = gender === "wanita";
	const isHijab = isWoman && hijab === "ya";
	const primaryStyle = styles[0] || "minimalis";

	// Tentukan warna dasar berdasarkan undertone
	const whiteColor = undertone === "hangat" ? "Broken White" : undertone === "dingin" ? "Pure White" : "Ecru Cream";
	const darkColor = undertone === "hangat" ? "Espresso Brown" : undertone === "dingin" ? "Classic Deep Navy" : "Midnight Charcoal";
	const midNeutral = undertone === "hangat" ? "Warm Camel / Khaki" : undertone === "dingin" ? "Slate Fog Grey" : "Muted Taupe";
	const accentColor = undertone === "hangat" ? "Terracotta" : undertone === "dingin" ? "Dusty Blue" : "Sage Green";

	// Rekomendasi Fit Tips berdasarkan proporsi tubuh
	const getFitTip = (category: string, itemType: string): string => {
		switch (bodyProportion) {
			case "atasan-lebar":
				if (category === "atasan") return "Pilih kerah V atau buka kancing atas untuk memanjangkan leher dan melunakkan garis bahu.";
				if (category === "bawahan") return "Potongan straight atau wide leg membantu menyeimbangkan volume tubuh bagian atas.";
				return "Pilih siluet yang jatuh lurus tanpa bantalan bahu tambahan.";
			case "bawahan-lebar":
				if (category === "bawahan") return "Pilih high-waist dengan bahan jatuh yang tidak menempel ketat di pinggul.";
				if (category === "outer") return "Panjang outer melewati pinggul (mid-thigh) menyamarkan lebar samping dengan anggun.";
				return "Fokuskan detail warna atau kerah pada atasan untuk menarik pandangan ke atas.";
			case "petite":
				if (category === "bawahan") return "High-waist dengan keliman yang tepat di atas mata kaki memberi ilusi kaki lebih jenjang.";
				if (category === "outer") return "Hindari outer yang terlalu panjang; panjang pas di pinggul atau paha atas paling ideal.";
				return "Pertahankan kesinambungan warna (low contrast) antara atasan dan bawahan.";
			case "tinggi-ramping":
				if (category === "atasan") return "Potongan relaxed fit atau layer dengan tekstur memberi dimensi proporsional.";
				if (category === "bawahan") return "Potongan straight atau ankle trousers mempertegas siluet jenjang alami.";
				return "Bisa leluasa bermain dengan layer outer dan aksen kontras.";
			default: // seimbang
				if (category === "bawahan") return "Potongan regular straight atau tapered menonjolkan proporsi alami yang seimbang.";
				if (category === "atasan") return "Regular fit atau clean tuck in mempertegas garis pinggang tanpa terkesan kaku.";
				return "Pastikan garis jahitan bahu pas berada di ujung tulang bahu.";
		}
	};

	const items: CapsuleItem[] = [];

	// 1. OUTER UTAMA (Blazer / Relaxed Jacket)
	items.push({
		id: "outer-1",
		name: isWoman
			? primaryStyle === "smart-casual" || primaryStyle === "klasik"
				? "Tailored Relaxed Blazer"
				: "Minimalist Soft Linen Blazer"
			: "Unstructured Relaxed Blazer",
		category: "outer",
		color: darkColor,
		fitTips: getFitTip("outer", "blazer"),
		versatileScore: 10,
		occasions: ["kantor", "meeting", "formal", "hangout"],
		iconName: "briefcase"
	});

	// 2. OUTER KEDUA (Cardigan / Overshirt / Jaket Ringan)
	items.push({
		id: "outer-2",
		name: isWoman
			? isHijab
				? "Longline Fine-Knit Cardigan"
				: primaryStyle === "casual"
					? "Oversized Cotton Overshirt"
					: "V-Neck Fine-Knit Cardigan"
			: primaryStyle === "streetwear" || primaryStyle === "casual"
				? "Cotton Twill Overshirt / Shacket"
				: "Fine Gauge Knit Cardigan",
		category: "outer",
		color: midNeutral,
		fitTips: getFitTip("outer", "cardigan"),
		versatileScore: 9,
		occasions: ["kampus", "hangout", "santai", "kantor"],
		iconName: "layers"
	});

	// 3. ATASAN FORMAL / CLEAN (Kemeja)
	items.push({
		id: "top-1",
		name: isHijab
			? "Kemeja Tunik Katun Poplin"
			: isWoman
				? "Kemeja Relaxed Poplin Shirt"
				: "Kemeja Oxford Button-Down",
		category: "atasan",
		color: whiteColor,
		fitTips: getFitTip("atasan", "kemeja"),
		versatileScore: 10,
		occasions: ["kantor", "meeting", "formal", "kampus", "hangout"],
		iconName: "shirt"
	});

	// 4. ATASAN KEDUA (Polo Knit / Blouse)
	items.push({
		id: "top-2",
		name: isWoman
			? isHijab
				? "Blouse Drape Minimalis Berlengan Manset"
				: primaryStyle === "feminin"
					? "Soft Drape Boatneck Blouse"
					: "Ribbed Longsleeve Top"
			: primaryStyle === "smart-casual" || primaryStyle === "klasik"
				? "Fine-Knit Polo Shirt"
				: "Kemeja Linen Kerah Camp",
		category: "atasan",
		color: accentColor,
		fitTips: getFitTip("atasan", "blouse"),
		versatileScore: 8,
		occasions: ["meeting", "hangout", "kampus", "kantor"],
		iconName: "sparkles"
	});

	// 5. ATASAN DASAR CASUAL (Kaos Katun Premium)
	items.push({
		id: "top-3",
		name: isHijab
			? "Kaos Katun Heavyweight Lengan Panjang"
			: "Heavyweight Crewneck T-Shirt",
		category: "atasan",
		color: whiteColor,
		fitTips: getFitTip("atasan", "tshirt"),
		versatileScore: 10,
		occasions: ["kampus", "hangout", "santai"],
		iconName: "smile"
	});

	// 6. ATASAN ALTERNATIF CASUAL (Kaos Gelap / Striped)
	items.push({
		id: "top-4",
		name: isHijab
			? "Turtleneck / High-Neck Knit Inner Top"
			: primaryStyle === "minimalis"
				? "Crewneck T-Shirt Gelap"
				: "Breton Striped Tee / Kaos Bergaris",
		category: "atasan",
		color: darkColor,
		fitTips: getFitTip("atasan", "tshirt-gelap"),
		versatileScore: 8,
		occasions: ["hangout", "santai", "kampus"],
		iconName: "moon"
	});

	// 7. BAWAHAN UTAMA (Tailored Trousers / Celana Bahan Rapi)
	items.push({
		id: "bottom-1",
		name: isWoman
			? isHijab || primaryStyle === "minimalis"
				? "Pleated Wide-Leg Trousers"
				: "Straight-Leg Tailored Pants"
			: "Pleated Tapered Trousers",
		category: "bawahan",
		color: darkColor,
		fitTips: getFitTip("bawahan", "trousers"),
		versatileScore: 10,
		occasions: ["kantor", "meeting", "formal", "hangout"],
		iconName: "scissors"
	});

	// 8. BAWAHAN KEDUA (Denim Klasik / Rok A-Line)
	items.push({
		id: "bottom-2",
		name: isWoman && (primaryStyle === "feminin" || isHijab)
			? "A-Line Flowy Midi/Maxi Skirt"
			: "Straight-Fit Dark Indigo Denim",
		category: "bawahan",
		color: isWoman && (primaryStyle === "feminin" || isHijab) ? midNeutral : "Dark Indigo Blue",
		fitTips: getFitTip("bawahan", "denim"),
		versatileScore: 9,
		occasions: ["kampus", "hangout", "santai", "meeting"],
		iconName: "compass"
	});

	// 9. BAWAHAN KETIGA (Chinos / Celana Katun Santai)
	items.push({
		id: "bottom-3",
		name: isWoman
			? "Ankle-Length Linen/Cotton Pants"
			: "Relaxed Fit Chino Pants",
		category: "bawahan",
		color: midNeutral,
		fitTips: getFitTip("bawahan", "chinos"),
		versatileScore: 8,
		occasions: ["kantor", "kampus", "hangout", "santai"],
		iconName: "feather"
	});

	// 10. SEPATU KASUAL (Clean Minimalist Sneakers)
	items.push({
		id: "shoes-1",
		name: "Clean Minimalist Leather Sneakers",
		category: "sepatu",
		color: whiteColor,
		fitTips: "Pilih siluet low-profile tanpa logo besar agar cocok dipadukan dari celana bahan sampai denim santai.",
		versatileScore: 10,
		occasions: ["kampus", "hangout", "santai", "kantor"],
		iconName: "footprints"
	});

	// 11. SEPATU RAPI (Leather Loafers / Mules / Dress Shoes)
	items.push({
		id: "shoes-2",
		name: isWoman
			? primaryStyle === "feminin"
				? "Pointed-Toe Leather Flats / Slingback"
				: "Classic Penny Loafers"
			: "Classic Leather Penny Loafers",
		category: "sepatu",
		color: darkColor,
		fitTips: "Bahan kulit asli atau vegan leather berkualitas dengan sol ramping memberikan kesan clean dan rapi tanpa terasa kaku.",
		versatileScore: 9,
		occasions: ["kantor", "meeting", "formal", "hangout"],
		iconName: "shield"
	});

	// 12. TAS / AKSESORI UTAMA
	items.push({
		id: "acc-1",
		name: isHijab
			? "Set Scarf Pashmina Ceruty / Voal Premium"
			: isWoman
				? "Structured Minimalist Leather Tote / Shoulder Bag"
				: "Minimalist Leather Tote / Crossbody Bag",
		category: isHijab ? "aksesori" : "tas",
		color: isHijab ? midNeutral : darkColor,
		fitTips: isHijab
			? "Pilih bahan voal ultrafine atau ceruty babydoll yang tegak di dahi dan bernapas sejuk untuk iklim tropis."
			: "Bentuk terstruktur tanpa hardware berlebihan menjaga outfit tetap terlihat rapi dan profesional.",
		versatileScore: 10,
		occasions: ["kantor", "meeting", "kampus", "hangout", "formal"],
		iconName: isHijab ? "wind" : "shopping-bag"
	});

	return items;
}

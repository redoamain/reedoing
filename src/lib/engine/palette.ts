import type { Undertone, StyleOption, PaletteResult, ColorSwatch } from "$lib/types/style";

export function generateColorPalette(undertone: Undertone, styles: StyleOption[] = []): PaletteResult {
	const primaryStyle = styles[0] || "minimalis";

	if (undertone === "hangat") {
		const baseColors: ColorSwatch[] = [
			{
				name: "Broken White",
				hex: "#F9F6F0",
				role: "base",
				description: "Putih gading hangat, lebih natural dibanding putih terang untuk kulit berseri."
			},
			{
				name: "Camel / Oat Warm",
				hex: "#C2A27E",
				role: "base",
				description: "Warna netral tengah yang memberi kesan elegan, hangat, dan mudah dipadukan."
			},
			{
				name: "Espresso Brown",
				hex: "#3D2B1F",
				role: "base",
				description: "Alternatif hitam yang lebih berkelas dan menyatu lembut dengan kulit hangat."
			},
			{
				name: "Deep Olive",
				hex: "#4E5340",
				role: "base",
				description: "Hijau bumi yang maskulin/feminin, pengganti netral untuk nuansa semi-formal dan kasual."
			}
		];

		const accentColors: ColorSwatch[] = [
			{
				name: "Terracotta",
				hex: "#B85D43",
				role: "accent",
				description: "Aksen bata hangat yang seketika membuat wajah tampak segar dan berenergi."
			},
			{
				name: "Warm Amber",
				hex: "#D49B4B",
				role: "accent",
				description: "Kuning keemasan lembut untuk scarf, knitwear, atau detail aksesori."
			}
		];

		const avoidColors: ColorSwatch[] = [
			{
				name: "Icy Blue Neon",
				hex: "#8FE5FF",
				role: "avoid",
				description: "Biru pucat membeku membuat undertone hangat terlihat kusam atau lelah."
			},
			{
				name: "Magenta Tajam",
				hex: "#D6006E",
				role: "avoid",
				description: "Warna dingin berkontras tajam menabrak tone alami kulit dan sulit dipadukan."
			}
		];

		return {
			name: "Warm Earth & Sun",
			undertone: "hangat",
			description:
				"Palet bernuansa bumi hangat dengan perpaduan broken white, cokelat espresso, dan aksen terracotta yang menyatu sempurna dengan undertone kulitmu.",
			baseColors,
			accentColors,
			avoidColors,
			stylePairingTips: getStyleTips(primaryStyle, "hangat")
		};
	}

	if (undertone === "dingin") {
		const baseColors: ColorSwatch[] = [
			{
				name: "Crisp Pure White",
				hex: "#FFFFFF",
				role: "base",
				description: "Putih bersih tegas yang memberikan kontras jernih dan segar pada kulit dingin."
			},
			{
				name: "Classic Deep Navy",
				hex: "#1B2A47",
				role: "base",
				description: "Biru gelap berwibawa, fondasi terbaik untuk setelan kerja dan kasual rapi."
			},
			{
				name: "Charcoal Grey",
				hex: "#33383F",
				role: "base",
				description: "Abu-abu arang modern yang fleksibel menggantikan warna hitam pekat."
			},
			{
				name: "Heather Fog Grey",
				hex: "#CBD2D9",
				role: "base",
				description: "Abu-abu terang sejuk untuk t-shirt, kemeja santai, atau inner layering."
			}
		];

		const accentColors: ColorSwatch[] = [
			{
				name: "Dusty Slate Blue",
				hex: "#4D6B88",
				role: "accent",
				description: "Biru berdebu yang tenang dan berwibawa, cocok untuk atasan maupun jaket."
			},
			{
				name: "Deep Burgundy",
				hex: "#6B1D2F",
				role: "accent",
				description: "Merah anggur dingin yang memberi sentuhan kemewahan tanpa mencolok."
			}
		];

		const avoidColors: ColorSwatch[] = [
			{
				name: "Mustard Kuning Terang",
				hex: "#E5A93B",
				role: "avoid",
				description: "Kuning hangat keemasan dapat membuat kulit dingin tampak pucat kekuningan."
			},
			{
				name: "Jingga Oranye Terik",
				hex: "#FF5C1C",
				role: "avoid",
				description: "Tone oranye murni bertabrakan dengan karakter sejuk undertone kulitmu."
			}
		];

		return {
			name: "Cool Slate & Coastal",
			undertone: "dingin",
			description:
				"Palet sejuk berkelas dengan dasar navy klasik, abu arang, dan aksen dusty blue serta burgundy yang membuat kulitmu terlihat bersih dan jernih.",
			baseColors,
			accentColors,
			avoidColors,
			stylePairingTips: getStyleTips(primaryStyle, "dingin")
		};
	}

	// Netral
	const baseColors: ColorSwatch[] = [
		{
			name: "Soft Ecru White",
			hex: "#F5F2EB",
			role: "base",
			description: "Krem lembut alami yang seimbang antara spektrum hangat dan dingin."
		},
		{
			name: "Midnight Graphite",
			hex: "#26292E",
			role: "base",
			description: "Abu kehitaman modern yang netral, cocok dipadukan dengan spektrum warna apa pun."
		},
		{
			name: "Smokey Taupe",
			hex: "#7A7265",
			role: "base",
			description: "Peleburan abu-abu dan cokelat yang sangat versatile untuk bawahan atau outer."
		},
		{
			name: "French Ink Navy",
			hex: "#202E42",
			role: "base",
			description: "Navy seimbang dengan saturasi tenang yang selalu tampak rapi dan profesional."
		}
	];

	const accentColors: ColorSwatch[] = [
		{
			name: "Muted Sage Green",
			hex: "#768B75",
			role: "accent",
			description: "Hijau sage berdebu yang menenangkan dan mudah berpadu dengan semua warna dasar."
		},
		{
			name: "Dusty Rosewood",
			hex: "#A36D73",
			role: "accent",
			description: "Sentuhan mawar kecokelatan lembut yang netral untuk pria maupun wanita."
		}
	];

	const avoidColors: ColorSwatch[] = [
		{
			name: "Kuning Neon Stabilo",
			hex: "#DFFF00",
			role: "avoid",
			description: "Neon bervolume tinggi menenggelamkan keseimbangan alami kulit netral."
		},
		{
			name: "Orange Fluorescent",
			hex: "#FF4500",
			role: "avoid",
			description: "Warna yang terlalu menyala mengaburkan fokus siluet pakaianmu."
		}
	];

	return {
		name: "Balanced Muted Harmony",
		undertone: "netral",
		description:
			"Palet seimbang sempurna antara kehangatan taupe dan ketenangan navy. Kamu memiliki fleksibilitas tinggi memadukan aksen sage atau rosewood.",
		baseColors,
		accentColors,
		avoidColors,
		stylePairingTips: getStyleTips(primaryStyle, "netral")
	};
}

function getStyleTips(style: StyleOption, undertone: Undertone): string[] {
	const tips: string[] = [];

	if (style === "minimalis") {
		tips.push("Terapkan rasio 80% warna dasar dan 20% aksen untuk siluet bersih khas gaya minimalis.");
		tips.push("Padukan tekstur berbeda dalam satu keluarga warna (monokromatik terukur) agar tidak terasa datar.");
	} else if (style === "smart-casual") {
		tips.push("Gunakan atasan warna terang (putih/krem) dan bawahan gelap untuk kesan formal, lalu balik untuk suasana santai.");
		tips.push("Outer warna netral (navy atau taupe) seketika menaikkan level kaos polos menjadi siap meeting.");
	} else if (style === "streetwear") {
		tips.push("Gunakan warna netral gelap sebagai kanvas, lalu biarkan aksen terlihat pada sneakers atau topi.");
		tips.push("Pilih siluet yang sedikit oversized tanpa mengorbankan garis bahu agar tetap terlihat terstruktur.");
	} else if (style === "feminin") {
		tips.push("Padukan warna dasar lembut dengan aksen rosewood atau sage pada rok atau scarf.");
		tips.push("Pilih bahan yang jatuh natural seperti katun rayon, tencel, atau linen blend.");
	} else if (style === "klasik") {
		tips.push("Pertahankan kombinasi warna tri-warna: 1 warna dominan, 1 sekunder, 1 aksen kecil pada jam/sepatu.");
		tips.push("Hindari memadukan lebih dari 3 warna kontras dalam satu outfit.");
	} else {
		// casual
		tips.push("Fokus pada kenyamanan kain katun combed atau denim dengan warna yang tidak cepat kusam.");
		tips.push("Gunakan sneakers putih bersih atau cokelat kulit sebagai jangkar warna semua outfit kasualmu.");
	}

	if (undertone === "hangat") {
		tips.push("Aksesoris logam warna emas atau kuningan antik akan tampak lebih bersinar di kulitmu.");
	} else if (undertone === "dingin") {
		tips.push("Aksesoris logam warna silver atau platinum akan memberikan kilau terbaik untuk penampilanmu.");
	} else {
		tips.push("Kamu bebas mengenakan perhiasan silver maupun gold karena undertone kulitmu seimbang.");
	}

	return tips;
}

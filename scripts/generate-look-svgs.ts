import fs from "node:fs";
import path from "node:path";
import { rawOutfitTemplates } from "../src/lib/engine/outfits";

// Definisi path dan warna untuk masing-masing item
const itemDefinitions: Record<string, {
	name: string;
	category: string;
	path: string;
	stroke: string;
	fill: string;
	fillOpacity: number;
}> = {
	"outer-1": {
		name: "Tailored Blazer",
		category: "Outer",
		path: "M20 30 L40 10 L60 30 L55 90 L25 90 Z M40 10 L40 90 M25 35 L10 65 L20 70 L30 45 M55 35 L70 65 L60 70 L50 45",
		stroke: "#262423",
		fill: "#262423",
		fillOpacity: 0.18
	},
	"outer-2": {
		name: "Knit Cardigan",
		category: "Outer",
		path: "M25 25 L40 15 L55 25 L50 85 L30 85 Z M40 15 L40 85 M25 25 L12 55 L22 60 M55 25 L68 55 L58 60",
		stroke: "#5C5248",
		fill: "#5C5248",
		fillOpacity: 0.16
	},
	"top-1": {
		name: "Oxford Shirt",
		category: "Atasan",
		path: "M25 25 L40 15 L55 25 L52 85 L28 85 Z M35 15 L40 25 L45 15 M25 25 L12 55 L20 58 M55 25 L68 55 L60 58 M40 25 L40 85",
		stroke: "#3A4654",
		fill: "#E8EEF5",
		fillOpacity: 0.75
	},
	"top-2": {
		name: "Drape Blouse",
		category: "Atasan",
		path: "M28 20 Q40 30 52 20 L50 80 Q40 82 30 80 Z M28 20 L15 50 M52 20 L65 50",
		stroke: "#9E7B5C",
		fill: "#F7EFE7",
		fillOpacity: 0.8
	},
	"top-3": {
		name: "Cotton Tee",
		category: "Atasan",
		path: "M25 20 Q40 28 55 20 L52 75 L28 75 Z M25 20 L12 40 L22 44 M55 20 L68 40 L58 44",
		stroke: "#3D3A37",
		fill: "#FAF7F2",
		fillOpacity: 0.85
	},
	"top-4": {
		name: "Fine Knit Top",
		category: "Atasan",
		path: "M25 22 L40 16 L55 22 L52 80 L28 80 Z M25 22 L14 55 M55 22 L66 55",
		stroke: "#2A2B2D",
		fill: "#2A2B2D",
		fillOpacity: 0.22
	},
	"bottom-1": {
		name: "Trousers",
		category: "Bawahan",
		path: "M28 20 L52 20 L50 85 L42 85 L40 45 L38 85 L30 85 Z M35 20 L35 40 M45 20 L45 40",
		stroke: "#222120",
		fill: "#222120",
		fillOpacity: 0.22
	},
	"bottom-2": {
		name: "Classic Denim",
		category: "Bawahan",
		path: "M27 20 L53 20 L51 86 L43 86 L40 48 L37 86 L29 86 Z M33 28 Q40 30 47 28",
		stroke: "#223347",
		fill: "#223347",
		fillOpacity: 0.22
	},
	"bottom-3": {
		name: "Smart Chinos",
		category: "Bawahan",
		path: "M28 20 L52 20 L50 85 L42 85 L40 46 L38 85 L30 85 Z",
		stroke: "#8E6E4C",
		fill: "#E8D9C8",
		fillOpacity: 0.55
	},
	"shoes-1": {
		name: "Clean Sneakers",
		category: "Sepatu",
		path: "M15 55 Q25 45 45 45 Q65 45 75 50 Q85 55 85 68 L15 68 Z M20 68 L80 68 M35 48 L45 58",
		stroke: "#4A4744",
		fill: "#FAF8F5",
		fillOpacity: 0.9
	},
	"shoes-2": {
		name: "Leather Loafers",
		category: "Sepatu",
		path: "M15 55 Q30 46 50 48 Q70 50 82 56 Q85 62 82 66 L15 66 Z M30 50 Q45 52 55 50",
		stroke: "#332219",
		fill: "#332219",
		fillOpacity: 0.35
	},
	"acc-1": {
		name: "Structured Bag",
		category: "Aksesori",
		path: "M30 40 L30 25 Q40 20 50 25 L50 40 M20 40 L60 40 L56 85 L24 85 Z",
		stroke: "#3A2A20",
		fill: "#3A2A20",
		fillOpacity: 0.25
	},
	"acc-2": {
		name: "Voal Scarf",
		category: "Aksesori",
		path: "M20 20 Q40 30 60 20 L50 80 Q40 70 30 80 Z",
		stroke: "#7A695C",
		fill: "#7A695C",
		fillOpacity: 0.2
	}
};

const occasionThemes: Record<string, {
	bgStart: string;
	bgEnd: string;
	badgeBg: string;
	badgeText: string;
	accentColor: string;
	label: string;
}> = {
	kantor: {
		bgStart: "#F5F7FA",
		bgEnd: "#EAEFF5",
		badgeBg: "#DCE5F0",
		badgeText: "#2C405A",
		accentColor: "#2C405A",
		label: "KERJA KANTOR"
	},
	meeting: {
		bgStart: "#F7F6F3",
		bgEnd: "#ECE8E1",
		badgeBg: "#DFD8CE",
		badgeText: "#45382B",
		accentColor: "#45382B",
		label: "MEETING KLIEN"
	},
	kampus: {
		bgStart: "#F6F8F6",
		bgEnd: "#EAF0EA",
		badgeBg: "#D8E6D8",
		badgeText: "#2E5230",
		accentColor: "#2E5230",
		label: "KAMPUS / KULIAH"
	},
	hangout: {
		bgStart: "#FAF6F4",
		bgEnd: "#F3E9E4",
		badgeBg: "#EADAD3",
		badgeText: "#5E3829",
		accentColor: "#5E3829",
		label: "HANGOUT"
	},
	santai: {
		bgStart: "#FBF9F5",
		bgEnd: "#F3EDE3",
		badgeBg: "#E8DEC8",
		badgeText: "#524433",
		accentColor: "#524433",
		label: "SANTAI / WFH"
	},
	formal: {
		bgStart: "#F5F4F2",
		bgEnd: "#E8E6E1",
		badgeBg: "#D8D4CC",
		badgeText: "#22201E",
		accentColor: "#22201E",
		label: "ACARA FORMAL"
	}
};

function generateOutfitSvg(outfit: typeof rawOutfitTemplates[0], index: number): string {
	const theme = occasionThemes[outfit.occasion] || occasionThemes.kantor;
	const items = outfit.itemIds.map((id) => itemDefinitions[id]).filter(Boolean);

	// Hitung posisi horizontal kartu item
	const count = items.length;
	const cardW = 90;
	const gap = 12;
	const totalW = count * cardW + (count - 1) * gap;
	const startX = Math.round((600 - totalW) / 2);

	let itemsSvg = "";
	items.forEach((it, i) => {
		const x = startX + i * (cardW + gap);
		const y = 88;
		itemsSvg += `
		<g transform="translate(${x}, ${y})">
			<rect width="${cardW}" height="126" rx="14" fill="#FFFFFF" fill-opacity="0.82" stroke="#E3DBD0" stroke-width="1.2" />
			<g transform="translate(${cardW / 2 - 32}, 8) scale(0.64)">
				<rect width="100" height="100" rx="12" fill="#F4EFEA" fill-opacity="0.7" stroke="#E5DDD3" stroke-width="1" />
				<path d="${it.path}" stroke="${it.stroke}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="${it.fill}" fill-opacity="${it.fillOpacity}" />
			</g>
			<text x="${cardW / 2}" y="89" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="8" font-weight="700" text-anchor="middle" fill="#2C2A29">${escapeXml(it.name)}</text>
			<text x="${cardW / 2}" y="103" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7" font-weight="600" text-anchor="middle" fill="#8C8278" letter-spacing="0.5">${escapeXml(it.category.toUpperCase())}</text>
		</g>`;
	});

	return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 340" width="600" height="340" fill="none">
	<defs>
		<linearGradient id="bgGrad" x1="0" y1="0" x2="600" y2="340" gradientUnits="userSpaceOnUse">
			<stop offset="0%" stop-color="${theme.bgStart}"/>
			<stop offset="100%" stop-color="${theme.bgEnd}"/>
		</linearGradient>
		<filter id="cardShadow" x="-5%" y="-5%" width="110%" height="115%" filterUnits="userSpaceOnUse">
			<feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.04" />
		</filter>
	</defs>

	<!-- Base Card -->
	<rect width="600" height="340" rx="20" fill="url(#bgGrad)" stroke="#E4DCD0" stroke-width="1.5"/>

	<!-- Header Pill Badges -->
	<g transform="translate(32, 28)">
		<rect width="120" height="26" rx="13" fill="${theme.badgeBg}" />
		<text x="60" y="17" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="800" text-anchor="middle" fill="${theme.badgeText}" letter-spacing="0.8">${theme.label}</text>
	</g>

	<g transform="translate(480, 28)">
		<rect width="88" height="26" rx="13" fill="#FFFFFF" fill-opacity="0.9" stroke="#E3DBD0" stroke-width="1" />
		<text x="44" y="17" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="9" font-weight="700" text-anchor="middle" fill="#6B6258" letter-spacing="0.5">LOOK #${String(index + 1).padStart(2, "0")}</text>
	</g>

	<!-- Items Row -->
	${itemsSvg}

	<!-- Divider Line -->
	<line x1="36" y1="234" x2="564" y2="234" stroke="#E3DBD0" stroke-width="1" stroke-dasharray="4 4" />

	<!-- Bottom Section: Title & Formula -->
	<g transform="translate(36, 268)">
		<text x="0" y="0" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="800" fill="#1C1A19">${escapeXml(outfit.name)}</text>
		<text x="0" y="24" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="11" font-weight="500" fill="#6B6258">${escapeXml(outfit.formula)}</text>
	</g>

	<g transform="translate(564, 276)">
		<text x="0" y="0" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="8" font-weight="700" text-anchor="end" fill="#9C9286" letter-spacing="1">RUPAKA LOOKBOOK</text>
		<text x="0" y="14" font-family="'Plus Jakarta Sans', system-ui, sans-serif" font-size="7.5" font-weight="500" text-anchor="end" fill="#A89E92">12-Capsule Formula</text>
	</g>
</svg>
`;
}

function escapeXml(unsafe: string): string {
	return unsafe.replace(/[<>&'"]/g, (c) => {
		switch (c) {
			case "<": return "&lt;";
			case ">": return "&gt;";
			case "&": return "&amp;";
			case "'": return "&apos;";
			case '"': return "&quot;";
			default: return c;
		}
	});
}

const outDir = path.resolve(process.cwd(), "static/images/looks");
if (!fs.existsSync(outDir)) {
	fs.mkdirSync(outDir, { recursive: true });
}

rawOutfitTemplates.forEach((outfit, idx) => {
	const svg = generateOutfitSvg(outfit, idx);
	const filePath = path.join(outDir, `${outfit.id}.svg`);
	fs.writeFileSync(filePath, svg, "utf-8");
	console.log(`Generated ${filePath}`);
});

console.log(`Successfully generated ${rawOutfitTemplates.length} look SVGs in ${outDir}`);

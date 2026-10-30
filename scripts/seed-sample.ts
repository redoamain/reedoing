import Database from "better-sqlite3";
import { generateStyleGuide } from "../src/lib/engine";
import type { QuizAnswers } from "../src/lib/types/style";

const db = new Database("./data/app.db");

console.log("Seeding sample data for Shopee Affiliate & AI Virtual Try-On...");

// 1. Update affiliate_items dengan link Shopee Affiliate per produk
const sampleProducts = [
	{ id: "outer-1", name: "Tailored Relaxed Blazer", category: "outer", url: "https://shopee.co.id/search?keyword=blazer+formal+pria+wanita+relaxed", price: "Rp 279.000 - Rp 450.000" },
	{ id: "outer-2", name: "Cardigan / Overshirt Katun", category: "outer", url: "https://shopee.co.id/search?keyword=cardigan+overshirt+katun+twill", price: "Rp 159.000 - Rp 280.000" },
	{ id: "top-1", name: "Kemeja Oxford / Poplin Bersih", category: "atasan", url: "https://shopee.co.id/search?keyword=kemeja+katun+oxford+poplin+putih", price: "Rp 129.000 - Rp 220.000" },
	{ id: "top-2", name: "Atasan Drape / Knit Polo / Blouse", category: "atasan", url: "https://shopee.co.id/search?keyword=knit+polo+shirt+blouse+minimalis", price: "Rp 115.000 - Rp 199.000" },
	{ id: "top-3", name: "Kaos Katun Premium Netral Terang", category: "atasan", url: "https://shopee.co.id/search?keyword=kaos+katun+combed+24s+heavyweight+putih", price: "Rp 69.000 - Rp 120.000" },
	{ id: "top-4", name: "Kaos / Inner Katun Gelap", category: "atasan", url: "https://shopee.co.id/search?keyword=kaos+polos+katun+hitam+charcoal", price: "Rp 69.000 - Rp 120.000" },
	{ id: "bottom-1", name: "Trousers Bahan / Ankle Pants", category: "bawahan", url: "https://shopee.co.id/search?keyword=celana+trousers+ankle+pants+formal", price: "Rp 165.000 - Rp 310.000" },
	{ id: "bottom-2", name: "Dark Indigo Denim Jeans", category: "bawahan", url: "https://shopee.co.id/search?keyword=celana+jeans+indigo+dark+denim+straight", price: "Rp 189.000 - Rp 360.000" },
	{ id: "bottom-3", name: "Chinos Relaxed / Linen Pants", category: "bawahan", url: "https://shopee.co.id/search?keyword=celana+chinos+relaxed+fit+linen", price: "Rp 149.000 - Rp 280.000" },
	{ id: "shoes-1", name: "Clean Leather Minimalist Sneakers", category: "sepatu", url: "https://shopee.co.id/search?keyword=sepatu+sneakers+kulit+putih+minimalis", price: "Rp 249.000 - Rp 520.000" },
	{ id: "shoes-2", name: "Loafers Kulit / Sepatu Formal Rapi", category: "sepatu", url: "https://shopee.co.id/search?keyword=sepatu+loafers+kulit+formal+penny", price: "Rp 269.000 - Rp 650.000" },
	{ id: "acc-1", name: "Tas Kulit Minimalis / Structured Bag", category: "aksesori", url: "https://shopee.co.id/search?keyword=tas+kulit+totebag+minimalis+leather", price: "Rp 159.000 - Rp 390.000" },
	{ id: "acc-2", name: "Ikat Pinggang Kulit & Jam Tangan Minimalis", category: "aksesori", url: "https://shopee.co.id/search?keyword=ikat+pinggang+kulit+leather+belt", price: "Rp 79.000 - Rp 190.000" }
];

const updateProductStmt = db.prepare(`
	INSERT INTO affiliate_items (id, name, category, affiliate_url, price_estimate, updated_at)
	VALUES (?, ?, ?, ?, ?, ?)
	ON CONFLICT(id) DO UPDATE SET
		name = excluded.name,
		category = excluded.category,
		affiliate_url = excluded.affiliate_url,
		price_estimate = excluded.price_estimate,
		updated_at = excluded.updated_at
`);

const now = Date.now();
for (const p of sampleProducts) {
	updateProductStmt.run(p.id, p.name, p.category, p.url, p.price, now);
}
console.log(`[Sample] Updated ${sampleProducts.length} affiliate items with Shopee URLs.`);

// 2. Buat Session
const sessionStmt = db.prepare(`
	INSERT OR REPLACE INTO sessions (id, created_at, updated_at)
	VALUES (?, ?, ?)
`);
sessionStmt.run("sample-session-pria", now, now);
sessionStmt.run("sample-session-wanita", now, now);

// 3. Sample 1: Pria Smart-Casual
const answersPria: QuizAnswers = {
	gender: "pria",
	styles: ["smart-casual", "minimalis"],
	routines: ["kantor", "meeting", "hangout"],
	goals: ["lebih-rapi", "percaya-diri"],
	challenges: ["bingung-padu-padan"],
	undertone: "hangat",
	bodyProportion: "seimbang",
	budget: "Rp 1.500.000 - Rp 3.000.000",
	sizeTop: "L",
	sizeBottom: "32",
	sizeShoes: "42",
	photoSkinHex: "#D49B6A",
	photoUndertone: "hangat",
	photoConfidence: 94
};

const guidePria = generateStyleGuide(answersPria);

const insertSubStmt = db.prepare(`
	INSERT OR REPLACE INTO submissions (id, session_id, step, answers, status, created_at, updated_at)
	VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const insertResultStmt = db.prepare(`
	INSERT OR REPLACE INTO results (submission_id, schema_version, palette, capsule, outfits, shopping, created_at)
	VALUES (?, 1, ?, ?, ?, ?, ?)
`);

insertSubStmt.run(
	"sample-pria",
	"sample-session-pria",
	7,
	JSON.stringify(answersPria),
	"selesai",
	now,
	now
);

insertResultStmt.run(
	"sample-pria",
	JSON.stringify(guidePria.palette),
	JSON.stringify(guidePria.capsule),
	JSON.stringify(guidePria.outfits),
	JSON.stringify(guidePria.shopping),
	now
);
console.log("[Sample] Created sample guide: /panduan/sample-pria");

// 4. Sample 2: Wanita Modest Hijab
const answersWanita: QuizAnswers = {
	gender: "wanita",
	hijab: "ya",
	coverage: "longgar",
	styles: ["minimalis", "smart-casual"],
	routines: ["kantor", "kampus", "santai"],
	goals: ["lebih-rapi", "hemat-belanja"],
	challenges: ["lemari-penuh"],
	undertone: "dingin",
	bodyProportion: "petite",
	budget: "Rp 1.000.000 - Rp 2.500.000",
	sizeTop: "M",
	sizeBottom: "28",
	sizeShoes: "38",
	photoSkinHex: "#EAC3B2",
	photoUndertone: "dingin",
	photoConfidence: 92
};

const guideWanita = generateStyleGuide(answersWanita);

insertSubStmt.run(
	"sample-wanita",
	"sample-session-wanita",
	7,
	JSON.stringify(answersWanita),
	"selesai",
	now,
	now
);

insertResultStmt.run(
	"sample-wanita",
	JSON.stringify(guideWanita.palette),
	JSON.stringify(guideWanita.capsule),
	JSON.stringify(guideWanita.outfits),
	JSON.stringify(guideWanita.shopping),
	now
);
console.log("[Sample] Created sample guide: /panduan/sample-wanita");

// 5. Sample AI Generated Images (SVG data URI lookbook photorealistic illustration)
const sampleSvgIllustrationPria = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5efe6"/>
      <stop offset="100%" stop-color="#dfd3c3"/>
    </linearGradient>
    <linearGradient id="blazer" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2c3437"/>
      <stop offset="100%" stop-color="#1b2022"/>
    </linearGradient>
    <linearGradient id="skin" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e2ab7f"/>
      <stop offset="100%" stop-color="#cb9267"/>
    </linearGradient>
    <linearGradient id="pants" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#7a7066"/>
      <stop offset="100%" stop-color="#5a524a"/>
    </linearGradient>
  </defs>
  
  <rect width="400" height="520" fill="url(#bg)"/>
  
  <!-- Studio lighting shadow -->
  <ellipse cx="200" cy="495" rx="80" ry="12" fill="#000000" opacity="0.12"/>
  
  <!-- Head & Hair -->
  <circle cx="200" cy="95" r="32" fill="url(#skin)"/>
  <path d="M 170 85 Q 200 50 230 85 Q 235 70 215 65 Q 185 62 170 85 Z" fill="#1e1815"/>
  <ellipse cx="200" cy="98" rx="2" ry="2" fill="#5c3a21"/>
  
  <!-- Neck -->
  <rect x="193" y="122" width="14" height="20" fill="url(#skin)"/>
  
  <!-- Shirt & Collar -->
  <polygon points="190,135 200,165 182,142" fill="#ffffff"/>
  <polygon points="210,135 200,165 218,142" fill="#ffffff"/>
  <polygon points="194,142 200,195 206,142" fill="#f8fafc"/>
  
  <!-- Blazer -->
  <path d="M 160 142 L 188 142 L 195 240 L 165 240 L 142 195 Z" fill="url(#blazer)"/>
  <path d="M 240 142 L 212 142 L 205 240 L 235 240 L 258 195 Z" fill="url(#blazer)"/>
  <polygon points="188,142 198,220 200,240 202,220 212,142 200,165" fill="#f8fafc"/>
  
  <!-- Arms & Hands -->
  <rect x="136" y="180" width="18" height="110" rx="9" fill="url(#blazer)" transform="rotate(6 145 180)"/>
  <rect x="246" y="180" width="18" height="110" rx="9" fill="url(#blazer)" transform="rotate(-6 255 180)"/>
  <circle cx="152" cy="298" r="9" fill="url(#skin)"/>
  <circle cx="248" cy="298" r="9" fill="url(#skin)"/>
  
  <!-- Trousers -->
  <path d="M 172 235 L 228 235 L 222 435 L 204 435 L 201 270 L 199 270 L 196 435 L 178 435 Z" fill="url(#pants)"/>
  
  <!-- Shoes -->
  <ellipse cx="187" cy="450" rx="15" ry="8" fill="#1b120c"/>
  <ellipse cx="213" cy="450" rx="15" ry="8" fill="#1b120c"/>
  
  <!-- Watermark badge -->
  <rect x="18" y="18" width="170" height="26" rx="6" fill="#000000" opacity="0.6"/>
  <text x="26" y="35" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f59e0b">✨ Google Gemini Try-On</text>
  <text x="200" y="490" text-anchor="middle" font-family="serif" font-size="11" font-weight="600" fill="#713f12">Smart-Casual Look: Blazer + Kemeja + Trousers</text>
</svg>
`)}`;

const sampleSvgIllustrationWanita = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 520" width="100%" height="100%">
  <defs>
    <linearGradient id="bgw" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#fdfbf7"/>
      <stop offset="100%" stop-color="#ebe5dc"/>
    </linearGradient>
    <linearGradient id="hijab" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#cbb5a1"/>
      <stop offset="100%" stop-color="#a8927d"/>
    </linearGradient>
    <linearGradient id="outerw" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#42505a"/>
      <stop offset="100%" stop-color="#2e3840"/>
    </linearGradient>
    <linearGradient id="skirt" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d4c7b8"/>
      <stop offset="100%" stop-color="#b8a896"/>
    </linearGradient>
    <linearGradient id="skinw" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f3d2be"/>
      <stop offset="100%" stop-color="#e0b8a2"/>
    </linearGradient>
  </defs>
  
  <rect width="400" height="520" fill="url(#bgw)"/>
  
  <!-- Shadow -->
  <ellipse cx="200" cy="495" rx="75" ry="12" fill="#000000" opacity="0.1"/>
  
  <!-- Hijab & Face -->
  <path d="M 165 95 C 165 55, 235 55, 235 95 C 235 140, 225 165, 200 165 C 175 165, 165 140, 165 95 Z" fill="url(#hijab)"/>
  <ellipse cx="200" cy="105" rx="18" ry="22" fill="url(#skinw)"/>
  
  <!-- Outer Longline -->
  <path d="M 158 155 L 188 155 L 192 340 L 150 340 Z" fill="url(#outerw)"/>
  <path d="M 242 155 L 212 155 L 208 340 L 250 340 Z" fill="url(#outerw)"/>
  <polygon points="188,155 194,340 206,340 212,155 200,175" fill="#ffffff"/>
  
  <!-- Skirt / Wide Pants -->
  <polygon points="182,320 218,320 236,445 164,445" fill="url(#skirt)"/>
  
  <!-- Loafers -->
  <ellipse cx="190" cy="455" rx="12" ry="7" fill="#3a2f2d"/>
  <ellipse cx="210" cy="455" rx="12" ry="7" fill="#3a2f2d"/>
  
  <!-- Watermark badge -->
  <rect x="18" y="18" width="170" height="26" rx="6" fill="#000000" opacity="0.6"/>
  <text x="26" y="35" font-family="sans-serif" font-size="10" font-weight="bold" fill="#f59e0b">✨ Google Gemini Try-On</text>
  <text x="200" y="490" text-anchor="middle" font-family="serif" font-size="11" font-weight="600" fill="#713f12">Modest Look: Longline Outer + Tunik + Wide Skirt</text>
</svg>
`)}`;

const insertAiImageStmt = db.prepare(`
	INSERT OR REPLACE INTO ai_generated_images (id, submission_id, outfit_id, image_data, created_at)
	VALUES (?, ?, ?, ?, ?)
`);

// Simpan AI image untuk outfit kantor 1 dan outfit kantor 2
insertAiImageStmt.run("ai-img-pria-1", "sample-pria", "outfit-kantor-1", sampleSvgIllustrationPria, now);
insertAiImageStmt.run("ai-img-pria-2", "sample-pria", "outfit-kantor-2", sampleSvgIllustrationPria, now);
insertAiImageStmt.run("ai-img-wanita-1", "sample-wanita", "outfit-kantor-1", sampleSvgIllustrationWanita, now);

console.log("[Sample] Seeded AI Try-On sample images for outfits.");
console.log("Seeding complete! You can now visit /panduan/sample-pria or /panduan/sample-wanita.");

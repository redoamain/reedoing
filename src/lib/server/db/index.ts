import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import fs from "fs";
import path from "path";

const dbPath = process.env.DATABASE_PATH || "./data/app.db";
const dbDir = path.dirname(dbPath);

if (!fs.existsSync(dbDir)) {
	fs.mkdirSync(dbDir, { recursive: true });
}

// Koneksi tunggal SQLite
const sqlite = new Database(dbPath);

// Konfigurasi PRAGMA sesuai spesifikasi
sqlite.pragma("journal_mode = WAL");
sqlite.pragma("foreign_keys = ON");

// Inisialisasi tabel jika belum ada
sqlite.exec(`
	CREATE TABLE IF NOT EXISTS sessions (
		id TEXT PRIMARY KEY NOT NULL,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS submissions (
		id TEXT PRIMARY KEY NOT NULL,
		session_id TEXT NOT NULL,
		step INTEGER NOT NULL DEFAULT 1,
		answers TEXT NOT NULL,
		status TEXT NOT NULL DEFAULT 'draft',
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL,
		FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS results (
		submission_id TEXT PRIMARY KEY NOT NULL,
		schema_version INTEGER NOT NULL DEFAULT 1,
		palette TEXT NOT NULL,
		capsule TEXT NOT NULL,
		outfits TEXT NOT NULL,
		shopping TEXT NOT NULL,
		created_at INTEGER NOT NULL,
		FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS shopping_checks (
		submission_id TEXT NOT NULL,
		item_id TEXT NOT NULL,
		checked INTEGER NOT NULL DEFAULT 0,
		PRIMARY KEY (submission_id, item_id),
		FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
	);

	CREATE TABLE IF NOT EXISTS admin_outfits (
		id TEXT PRIMARY KEY NOT NULL,
		name TEXT NOT NULL,
		occasion TEXT NOT NULL,
		occasion_label TEXT NOT NULL,
		formula TEXT NOT NULL,
		style_tips TEXT NOT NULL,
		item_ids TEXT NOT NULL,
		affiliate_url TEXT,
		image_url TEXT,
		sort_order INTEGER NOT NULL DEFAULT 0,
		is_active INTEGER NOT NULL DEFAULT 1,
		created_at INTEGER NOT NULL,
		updated_at INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS affiliate_items (
		id TEXT PRIMARY KEY NOT NULL,
		name TEXT NOT NULL,
		category TEXT NOT NULL,
		affiliate_url TEXT,
		price_estimate TEXT,
		updated_at INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS admin_settings (
		key TEXT PRIMARY KEY NOT NULL,
		value TEXT NOT NULL,
		updated_at INTEGER NOT NULL
	);

	CREATE TABLE IF NOT EXISTS ai_generated_images (
		id TEXT PRIMARY KEY NOT NULL,
		submission_id TEXT NOT NULL,
		outfit_id TEXT NOT NULL,
		image_data TEXT NOT NULL,
		created_at INTEGER NOT NULL,
		FOREIGN KEY (submission_id) REFERENCES submissions(id) ON DELETE CASCADE
	);

	CREATE INDEX IF NOT EXISTS idx_submissions_session ON submissions(session_id);
	CREATE INDEX IF NOT EXISTS idx_submissions_status ON submissions(status);
	CREATE INDEX IF NOT EXISTS idx_admin_outfits_occasion ON admin_outfits(occasion);
	CREATE INDEX IF NOT EXISTS idx_ai_images_sub_outfit ON ai_generated_images(submission_id, outfit_id);
`);

// Job pembersihan draft yang tidak aktif lebih dari 90 hari
export function cleanupOldDrafts() {
	try {
		const ninetyDaysAgo = Date.now() - 90 * 24 * 60 * 60 * 1000;
		const stmt = sqlite.prepare(`
			DELETE FROM submissions 
			WHERE status = 'draft' AND updated_at < ?
		`);
		const info = stmt.run(ninetyDaysAgo);
		if (info.changes > 0) {
			console.log(`[DB Cleanup] Removed ${info.changes} inactive draft submissions older than 90 days.`);
		}
	} catch (err) {
		console.error("[DB Cleanup] Error cleaning old drafts:", err);
	}
}

// Inisialisasi data bawaan jika tabel admin masih kosong
export function seedDefaultData() {
	try {
		// 1. Seed 32 template outfit bawaan
		const outfitCount = sqlite.prepare("SELECT COUNT(*) as count FROM admin_outfits").get() as { count: number };
		if (outfitCount.count === 0) {
			// Import templates secara dinamis agar aman
			import("../../engine/outfits").then(({ rawOutfitTemplates }) => {
				const insertStmt = sqlite.prepare(`
					INSERT INTO admin_outfits (
						id, name, occasion, occasion_label, formula, style_tips, item_ids, 
						affiliate_url, image_url, sort_order, is_active, created_at, updated_at
					) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?)
				`);

				const now = Date.now();
				const insertMany = sqlite.transaction((items) => {
					for (let i = 0; i < items.length; i++) {
						const it = items[i];
						insertStmt.run(
							it.id,
							it.name,
							it.occasion,
							it.occasionLabel,
							it.formula,
							it.styleTips,
							JSON.stringify(it.itemIds),
							it.affiliateUrl || null,
							it.imageUrl || `/images/looks/${it.id}.svg`,
							i + 1,
							now,
							now
						);
					}
				});

				insertMany(rawOutfitTemplates);
				console.log(`[DB Seed] Migrated ${rawOutfitTemplates.length} default outfits to admin_outfits table.`);
			}).catch((err) => {
				console.error("[DB Seed] Error loading rawOutfitTemplates for seeding:", err);
			});
		}

		// 2. Seed item pakaian bawaan untuk Shopee affiliate
		const itemCount = sqlite.prepare("SELECT COUNT(*) as count FROM affiliate_items").get() as { count: number };
		if (itemCount.count === 0) {
			const initialItems = [
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

			const insertItem = sqlite.prepare(`
				INSERT INTO affiliate_items (id, name, category, affiliate_url, price_estimate, updated_at)
				VALUES (?, ?, ?, ?, ?, ?)
			`);

			const now = Date.now();
			for (const it of initialItems) {
				insertItem.run(it.id, it.name, it.category, it.url, it.price, now);
			}
			console.log(`[DB Seed] Seeded ${initialItems.length} affiliate items with Shopee URLs.`);
		}

		// 3. Seed default admin settings
		const insertSetting = sqlite.prepare(`
			INSERT OR IGNORE INTO admin_settings (key, value, updated_at)
			VALUES (?, ?, ?)
		`);
		const now = Date.now();
		insertSetting.run("shopee_fallback_url", "https://shopee.co.id", now);
		insertSetting.run(
			"affiliate_disclaimer",
			"Tautan pakaian di atas terhubung ke toko resmi di Shopee. Kami dapat memperoleh sedikit komisi dari pembelianmu tanpa biaya tambahan.",
			now
		);
	} catch (err) {
		console.error("[DB Seed] Error running seedDefaultData:", err);
	}
}

// Jalankan pembersihan & seeding saat inisialisasi
cleanupOldDrafts();
seedDefaultData();

export const db = drizzle(sqlite, { schema });
export { sqlite };

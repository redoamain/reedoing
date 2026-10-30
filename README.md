# Rupaka — Web Personal Style Guideline

> **Lebih sedikit item, lebih banyak outfit.**  
> Web app personal style guideline berbahasa Indonesia yang **100% gratis**: tanpa pembayaran, tanpa paywall, tanpa login, dan tanpa unggah foto wajah.

---

## Fitur Utama

- **100% Gratis & Terbuka**: Tanpa payment gateway, tanpa model freemium, dan tanpa registrasi akun.
- **Mobile-First & Responsif**: Dirancang khusus untuk kenyamanan pengguna ponsel pintar dan desktop.
- **Style Check 3 Menit**: Form multi-langkah (7 pertanyaan intuitif) dengan auto-save anonim ke SQLite.
- **Menghormati Privasi**: Menggunakan deteksi undertone visual & proporsi tubuh **tanpa perlu unggah foto selfie**.
- **Mesin Rekomendasi Rule-Based**:
  - Palet warna personal (warna dasar, aksen, dan warna yang dihindari sesuai undertone).
  - Capsule wardrobe 12 item esensial terpadu untuk pria & wanita (termasuk preferensi hijab/modest).
  - 30+ kombinasi outfit siap pakai lintas 6 situasi (kerja kantor, meeting klien, kampus, hangout, santai/WFH, acara formal).
  - Daftar belanja prioritas dengan frekuensi penggunaan item dan fitur checklist interaktif.
- **Dukungan Cetak & PDF**: Lembar cetak rapi berbasis `@media print` untuk disimpan atau dibawa berbelanja.
- **Aman & Fleksibel**: Dilengkapi fitur "Salin Tautan", "Ulangi Style Check", dan "Hapus Data Saya" permanen.

---

## Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5 Runes: `$state`, `$derived`, `$props`) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn-svelte](https://shadcn-svelte.com/)
- **Komponen UI**: Button, Card, Carousel, Accordion, Progress, Radio Group, Checkbox, Tabs, Badge, Separator, Dialog, Input, Label, Sonner Toast
- **Ikon**: [lucide-svelte](https://lucide.dev/)
- **Validasi**: [Zod](https://zod.dev/)
- **Database**: [SQLite](https://sqlite.org/) (file lokal `data/app.db`) lewat [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) + [Drizzle ORM](https://orm.drizzle.team/)
- **Adapter**: `@sveltejs/adapter-node`
- **Testing**: [Vitest](https://vitest.dev/)

---

## Struktur Folder

```text
src/
├── lib/
│   ├── components/
│   │   ├── ui/          # Komponen UI shadcn-svelte (button, card, carousel, dll.)
│   │   ├── landing/     # Komponen landing page (Header, Hero, CapsuleStrip, Problem, dll.)
│   │   └── quiz/        # Komponen pertanyaan wizard style check (Langkah 1–7)
│   ├── data/            # Data katalog pakaian, palet warna, dan aturan
│   ├── engine/          # Mesin rekomendasi (palette, capsule, outfits, shopping, spec)
│   ├── server/
│   │   ├── db/          # Schema SQLite, koneksi Drizzle (WAL mode), queries, test
│   │   └── rate-limit.ts# Rate limiter form actions
│   ├── types/           # Definisi TypeScript untuk seluruh model data
│   ├── validation/      # Skema validasi Zod per langkah quiz
│   ├── config.ts        # Pusat konfigurasi nama merek, slogan, dan tautan
│   └── utils.ts         # Helper utility classnames
├── hooks.server.ts      # Pengelolaan cookie sesi anonim (sid)
└── routes/
    ├── +layout.svelte   # ModeWatcher, Toaster, dan Layout global
    ├── +page.svelte     # Landing page lengkap (11 section)
    ├── mulai/           # Halaman style check multi-langkah (auto-save SQLite)
    ├── panduan/         # Redirect otomatis ke panduan aktif
    ├── panduan/[id]/    # Halaman hasil panduan lengkap (Tabs 5 bagian)
    ├── kontak/          # Halaman statis kontak
    ├── ketentuan/       # Halaman statis ketentuan layanan
    ├── privasi/         # Halaman statis kebijakan privasi
    └── sitemap.xml/     # Endpoint XML sitemap dinamis
static/
├── images/placeholder/  # Ilustrasi siluet SVG pakaian
└── robots.txt           # Kebijakan bot pencari (noindex panduan privat)
Dockerfile               # Multi-stage Docker build
docker-compose.yml       # Konfigurasi container dengan volume data/ persisten
```

---

## Cara Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js versi 20 atau lebih baru
- npm, pnpm, atau yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan (Dev)
```bash
npm run dev
```
Buka browser di `http://localhost:5173`. Database SQLite otomatis dibuat di `./data/app.db` saat aplikasi pertama kali dijalankan.

### 4. Menjalankan Pengujian (Testing)
Jalankan pengujian unit untuk engine rekomendasi dan database:
```bash
npm test
```

### 5. Memeriksa Tipe Data (Type Check)
```bash
npm run check
```

### 6. Build Produksi
```bash
npm run build
npm run preview
```

---

## Panel Admin & Shopee Affiliate (`/admin`)

Aplikasi dilengkapi dengan panel admin untuk mengelola katalog outfit dan menambahkan tautan **Shopee Affiliate**:

1. **Akses Dashboard**: Kunjungi `/admin` di browser (atau klik tautan **Admin** di footer).
2. **Keamanan Login**:
   - Password bawaan: `admin123`
   - Kamu dapat mengubah password melalui variabel lingkungan di file `.env`:
     ```env
     ADMIN_PASSWORD=password_rahasia_anda
     ```
3. **Fitur Pengelolaan**:
   - **Katalog Outfit**: Lihat seluruh 32 outfit bawaan, filter per situasi (kantor, kampus, meeting, formal, hangout, santai), cari berdasarkan formula, edit formula & tips, serta tambahkan **Link Shopee Affiliate** dan URL foto preview untuk setiap look.
   - **Item Belanja (Capsule Items)**: Tambahkan link Shopee Affiliate khusus dan estimasi harga untuk masing-masing item dasar pakaian (Blazer, Kemeja, Kaos, Celana Bahan, Denim, Sneakers, Loafers, dll).
   - **Tampilan Otomatis**: Tombol **"Beli Look Ini di Shopee"** dan **"Beli di Shopee"** otomatis tampil di halaman hasil panduan pengunjung (`/panduan/[id]`) pada tab *Outfit* dan tab *Daftar Belanja*.
   - **Pengaturan Fallback & Disclaimer**: Atur tautan fallback toko Shopee dan teks transparansi etis bagi pengunjung.
   - **Reset Outfit**: Tombol sekali klik untuk memulihkan seluruh 32 outfit bawaan jika diperlukan.
   - **Virtual Try-On (Google Gemini AI)**: Atur `GEMINI_API_KEY` (di `.env` atau menu Pengaturan Admin) untuk mengaktifkan render foto busana langsung dikenakan oleh pengguna via Google Imagen 3.

---

## Cara Mengganti Nama Merek & Konten

Semua informasi merek, slogan, email kontak, dan statistik terpusat dalam satu file:  
👉 **`src/lib/config.ts`**

```typescript
export const siteConfig = {
  name: "NamaMerekmu",
  brandPlaceholder: "NamaMerekmu Style",
  tagline: "Lebih Sedikit Item, Lebih Banyak Outfit",
  description: "Deskripsi panduan personal style...",
  url: "https://domainmu.com",
  contactEmail: "halo@domainmu.com",
  stats: {
    itemsCount: 12,
    outfitsCount: "30+",
    quizMinutes: 3
  }
};
```
Cukup ubah nilai di file tersebut dan seluruh halaman beranda, judul SEO, metadata, serta footer akan otomatis diperbarui.

---

## Cara Deploy Gratis / Murah (Disk Persisten)

Karena aplikasi menggunakan SQLite lokal (`data/app.db`), server deploy **wajib mendukung disk persisten** agar data panduan pengguna tidak hilang saat restart.

### Opsi 1: Menjalankan dengan Docker (VPS / Server Pribadi)
Gunakan Docker dan Docker Compose yang telah disediakan:

```bash
docker compose up -d --build
```
Folder `./data` di host server akan di-mount ke `/app/data` di dalam container, memastikan database SQLite selalu aman dan persisten.

### Opsi 2: Deploy ke Fly.io (Gratis / Murah dengan Volume)
1. Pasang Fly CLI (`flyctl`):
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```
2. Buat aplikasi dan volume disk di Fly.io:
   ```bash
   fly launch
   fly volumes create app_data --size 1
   ```
3. Tambahkan konfigurasi mount di `fly.toml`:
   ```toml
   [mounts]
     source = "app_data"
     destination = "/app/data"

   [env]
     DATABASE_PATH = "/app/data/app.db"
   ```
4. Deploy:
   ```bash
   fly deploy
   ```

### Opsi 3: Alternatif Cloudflare D1 (Serverless Gratis)
Jika kamu ingin deploy ke Cloudflare Pages secara serverless, gunakan driver Drizzle D1 (`drizzle-orm/d1`) dengan mengganti `src/lib/server/db/index.ts` ke binding Cloudflare D1.

---

## Lisensi

Proyek ini dibuat untuk umum dan bebas digunakan serta dimodifikasi secara gratis.

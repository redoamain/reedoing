# Prompt: Web Personal Style Guideline (SvelteKit + shadcn-svelte, 100% Gratis)

Salin seluruh isi di bawah ini ke AI coding tool (Claude Code, Cursor, dll.).

---

## Peran

Kamu adalah senior frontend engineer. Bangun web app **personal style guideline** berbahasa Indonesia yang **sepenuhnya gratis**: tanpa pembayaran, tanpa paywall, tanpa login. Pengguna mengisi style check singkat, lalu langsung mendapat panduan lengkap.

## Tech stack (wajib)

- **SvelteKit** (Svelte 5, runes: `$state`, `$derived`, `$props`) + **TypeScript**
- **Tailwind CSS** + **shadcn-svelte** (komponen UI)
- **lucide-svelte** untuk ikon
- **Zod** untuk validasi form, **svelte-sonner** untuk toast
- Penyimpanan: **SQLite** (file lokal `data/app.db`) lewat **better-sqlite3** + **Drizzle ORM** (migrasi dengan `drizzle-kit`). Akses database hanya di sisi server (`+page.server.ts`, form actions, `hooks.server.ts`), tidak pernah dari browser.
- Adapter: **`@sveltejs/adapter-node`** (butuh runtime Node karena SQLite berupa file)
- Deploy target gratis/murah yang mendukung disk persisten: VPS sendiri, Fly.io (volume), atau Docker di server pribadi. Sertakan `Dockerfile` dan instruksi mount folder `data/`. (Alternatif bila ingin serverless gratis: Cloudflare D1, yang juga SQLite, dengan Drizzle driver D1.)
- Tidak boleh ada library atau layanan berbayar, tidak ada payment gateway, tidak ada akun pengguna

Setup awal:

```bash
npx sv create style-guideline   # pilih: SvelteKit minimal, TypeScript, Tailwind
cd style-guideline
npx shadcn-svelte@latest init
npx shadcn-svelte@latest add button card carousel accordion progress radio-group checkbox tabs badge separator sheet input label sonner toggle-group
npm i lucide-svelte zod better-sqlite3 drizzle-orm nanoid
npm i -D drizzle-kit @types/better-sqlite3 @sveltejs/adapter-node
```

## Konsep produk

Web membantu pengguna tampil percaya diri dengan **item pakaian seminimal mungkin**. Pesan inti: _lebih sedikit item, lebih banyak outfit_. Contoh: capsule wardrobe 12 item yang menghasilkan 30+ outfit.

Targetnya pria dan wanita (termasuk pengguna hijab), usia sekitar 18–35 tahun, mayoritas membuka lewat ponsel, jadi desain **mobile-first**.

Tentukan sendiri nama merek, slogan, dan teks. Gunakan placeholder seperti `[Nama Merek]` yang mudah diganti lewat satu file `src/lib/config.ts`.

## Halaman dan route

| Route | Fungsi |
| --- | --- |
| `/` | Landing page |
| `/mulai` | Style check multi-langkah |
| `/panduan/[id]` | Hasil panduan lengkap (dibaca dari SQLite berdasarkan `id` acak) |
| `/panduan` | Redirect ke `/panduan/[id]` milik sesi saat ini, atau ke `/mulai` bila belum ada |
| `/kontak`, `/ketentuan`, `/privasi` | Halaman statis |

## Landing page (`/`), urutan section

1. **Header**: logo + tombol "Mulai gratis" (sticky, ringan).
2. **Hero**: judul manfaat, satu kalimat penjelasan, CTA "Mulai style check" (gratis, sekitar 3 menit), badge "Gratis · Tanpa daftar", dan kolase kartu look + item.
3. **Contoh capsule**: strip item bergerak pelan (marquee) berisi 12 item, label "12 item → 30+ outfit".
4. **Masalah sebenarnya**: dua `Card` berdampingan: "Beli satuan" (✗) vs "Bangun sebuah sistem" (✓).
5. **Satu item, banyak situasi**: `Carousel` shadcn, satu item (mis. blazer) dalam 5 situasi: kerja, kampus, presentasi, meeting klien, acara.
6. **Cara kerja**: 3 langkah bernomor: ceritakan dirimu, sistem disusun, kamu tinggal pakai.
7. **Yang kamu dapat**: `Carousel` 4 kartu: warna personal, wardrobe inti, outfit siap pakai, daftar belanja prioritas.
8. **Minimum item, maksimum pakai**: grid 12 item + 4 poin prinsip (warna saling terhubung, fit sesuai proporsi, siap banyak situasi, belanja berdasarkan prioritas).
9. **CTA penutup**: "Mulai style check gratis", tanpa komitmen.
10. **FAQ**: `Accordion` (cocok untuk pemula? harus beli item baru? untuk pria dan wanita? berapa lama prosesnya? **apakah benar-benar gratis?**).
11. **Footer**: tautan kontak, ketentuan, privasi.

Semua CTA mengarah ke `/mulai`. **Jangan ada kata atau elemen harga, checkout, atau premium.**

## Style check (`/mulai`)

Form multi-langkah, satu pertanyaan per layar, dengan `Progress` di atas, tombol Kembali/Lanjut, dan **progres tersimpan otomatis ke SQLite** lewat SvelteKit form actions (gunakan `use:enhance` agar tanpa reload). Sesi anonim diidentifikasi cookie `sid` (httpOnly, sameSite=lax, acak via nanoid), jadi pengguna bisa menutup tab dan melanjutkan.

Langkah:

1. **Jenis pakaian**: pria / wanita; jika wanita, tanya preferensi hijab dan tingkat coverage (`RadioGroup`).
2. **Gaya yang disukai**: pilih 1–2 (casual, smart casual, minimalis, klasik, streetwear, feminin).
3. **Rutinitas harian**: pilih beberapa (kerja kantor, kampus, meeting, hangout, olahraga, acara formal) pakai `Checkbox`.
4. **Target penampilan**: lebih rapi, lebih percaya diri, lebih hemat belanja, dll.
5. **Tantangan saat ini**: bingung padu padan, lemari penuh tapi tak ada yang cocok, dll.
6. **Warna dan fit**: pilih opsi bentuk tubuh/proporsi dan warna kulit (undertone: hangat/dingin/netral) lewat pilihan visual, bukan analisis foto.
7. **Anggaran dan ukuran item**: opsional.

**Tanpa unggah selfie.** Penentuan warna memakai pertanyaan undertone supaya tidak butuh pemrosesan foto dan tidak ada data sensitif yang disimpan.

Validasi tiap langkah dengan Zod, tampilkan pesan error ramah dalam Bahasa Indonesia.

## Mesin rekomendasi (rule-based, tanpa AI berbayar)

Buat `src/lib/engine/` berisi fungsi murni (mudah diuji):

- `palette.ts`: undertone + gaya → palet warna inti (3–4 warna dasar, 2 aksen, 2 warna dihindari).
- `capsule.ts`: gaya + rutinitas + gender/hijab → wardrobe inti **8–14 item** (outer, atasan, bawahan, sepatu, tas, aksesori) dengan field `id`, `nama`, `kategori`, `warna`, `fitTips`.
- `outfits.ts`: menghasilkan kombinasi dari item capsule per situasi (kerja, kampus, hangout, date, olahraga, acara), minimal 20 outfit, tiap outfit menyebut item yang dipakai.
- `shopping.ts`: urutan prioritas item yang perlu dibeli, dengan alasan singkat ("dipakai di 6 outfit").

Data katalog disimpan sebagai JSON/TS statis di `src/lib/data/`. Hasil akhir ditulis ke SQLite dalam kolom JSON beserta `schemaVersion`.

## Skema SQLite (Drizzle)

```ts
// src/lib/server/db/schema.ts
sessions:    id (text, pk, nanoid), createdAt, updatedAt
submissions: id (text, pk, nanoid, dipakai di URL /panduan/[id]),
             sessionId (fk -> sessions.id), step (int), answers (json),
             status ('draft' | 'selesai'), createdAt, updatedAt
results:     submissionId (pk, fk), schemaVersion (int), palette (json),
             capsule (json), outfits (json), shopping (json), createdAt
shopping_checks: submissionId (fk), itemId (text), checked (bool), pk (submissionId, itemId)
```

Aturan database:

- Aktifkan `PRAGMA journal_mode = WAL` dan `foreign_keys = ON` saat koneksi dibuat; satu koneksi tunggal di `src/lib/server/db/index.ts`.
- Semua query lewat Drizzle (parameterized), validasi input dengan Zod sebelum menyentuh DB.
- Jalankan migrasi otomatis saat server start (`migrate()` dari drizzle-orm).
- Job sederhana membersihkan sesi `draft` yang tidak aktif lebih dari 90 hari.
- Path database dari env `DATABASE_PATH` (default `./data/app.db`); folder `data/` masuk `.gitignore`.

## Halaman panduan (`/panduan/[id]`)

Pakai `Tabs`: **Ringkasan · Warna personal · Wardrobe inti · Outfit · Daftar belanja**.

- Ringkasan: arah gaya pengguna + angka seperti "12 item → 28 outfit".
- Warna personal: swatch warna + penjelasan singkat.
- Wardrobe inti: grid kartu item dengan `Badge` kategori.
- Outfit: filter per situasi (`ToggleGroup`), kartu outfit memuat item yang dipakai.
- Daftar belanja: checklist yang bisa dicentang (tersimpan di tabel `shopping_checks`) + tombol "Cetak / Simpan PDF" memakai `window.print()` dengan stylesheet `@media print` yang rapi.
- Tombol "Salin tautan panduan" agar pengguna bisa membuka hasilnya lagi di perangkat lain. `id` harus acak dan tidak bisa ditebak (nanoid ≥ 21 karakter); halaman diberi `noindex`.
- Tombol "Ulangi style check" dan "Hapus data saya" (menghapus baris submission, result, dan checks di SQLite beserta cookie, dengan dialog konfirmasi).
- Jika `id` tidak ditemukan atau belum selesai, arahkan ke `/mulai`.

## Arah desain

- Bersih, editorial, minimalis; banyak ruang kosong, tipografi jelas (satu font serif untuk judul + satu sans untuk isi, dari Google Fonts/`@fontsource`).
- Palet netral hangat (krem, navy, abu, cokelat) lewat CSS variable shadcn; dukung **dark mode** (`mode-watcher`).
- Radius sedang, bayangan halus, animasi lembut saat scroll (CSS saja, hormati `prefers-reduced-motion`).
- Gambar: pakai **placeholder** (`/images/placeholder/...`) dan komponen `<img>` dengan `loading="lazy"`, format WebP. **Jangan menyalin gambar atau teks dari situs lain.**
- Tone: Bahasa Indonesia santai tapi meyakinkan, pakai "kamu", kalimat pendek.

## Kualitas, aksesibilitas, SEO

- Skor Lighthouse target ≥ 90 untuk mobile.
- Semantik HTML, label form terhubung, fokus keyboard terlihat, kontras warna cukup, `alt` pada gambar.
- Meta title/description dan Open Graph per halaman; `sitemap.xml` dan `robots.txt`.
- Analitik opsional dan **gratis** (mis. Plausible self-host atau tanpa analitik); jangan menyimpan data pribadi.

## Privasi

Data jawaban dan hasil disimpan di database SQLite pada server milikmu, tanpa nama, email, atau foto. Tampilkan catatan singkat di `/mulai` dan `/privasi`: "Jawabanmu disimpan anonim agar kamu bisa membuka panduan lagi. Kamu bisa menghapusnya kapan saja." Sediakan tombol hapus data, jangan bagikan data ke pihak ketiga, dan jelaskan masa retensi (90 hari untuk draft). Tambahkan rate limiting sederhana pada form actions untuk mencegah spam.

## Struktur folder yang diharapkan

```text
src/
  lib/
    components/ui/        # komponen shadcn-svelte
    components/landing/   # Hero, Capsule, Problem, Situations, HowItWorks, Benefits, Faq, Footer
    components/quiz/      # Step*, ProgressBar
    engine/               # palette, capsule, outfits, shopping
    data/                 # katalog item, palet, aturan
    server/db/            # index.ts (koneksi), schema.ts, migrations/, queries.ts
    stores/               # quiz.svelte.ts (state UI sementara dengan rune)
    config.ts             # nama merek, slogan, kontak
  hooks.server.ts         # baca/buat cookie sid
  routes/
    +layout.svelte
    +page.svelte
    mulai/+page.svelte
    mulai/+page.server.ts # load + form actions simpan langkah
    panduan/+page.server.ts          # redirect
    panduan/[id]/+page.svelte
    panduan/[id]/+page.server.ts     # load hasil + actions centang/hapus
    kontak/ ketentuan/ privasi/
static/images/placeholder/
```

## Cara kerja yang diminta darimu

1. Mulai dengan rencana singkat dan struktur folder, lalu **bangun bertahap**: setup → layout + landing → style check → mesin rekomendasi → halaman panduan → polish (a11y, SEO, print).
2. Setelah tiap tahap, jalankan `npm run check` dan `npm run build`, perbaiki error sebelum lanjut.
3. Tulis unit test (Vitest) untuk fungsi di `src/lib/engine/`.
4. Di akhir, buat `README.md` berisi cara menjalankan, cara mengganti nama merek/konten, dan cara deploy gratis.

## Batasan (jangan dilakukan)

- Jangan menambahkan payment gateway, paywall, kupon, harga, atau fitur login.
- Jangan memakai API berbayar atau key rahasia, dan jangan memakai database selain SQLite.
- Jangan mengakses SQLite dari kode browser; semua lewat server.
- Jangan meniru nama merek, slogan, teks, atau gambar dari situs referensi.
- Jangan mengunggah atau menyimpan foto pengguna.

## Definisi selesai

- [ ] Alur `/` → `/mulai` → `/panduan` berjalan penuh di ponsel dan desktop tanpa error.
- [ ] Tidak ada elemen pembayaran di UI maupun kode.
- [ ] Hasil panduan konsisten, tersimpan di SQLite, dan tetap ada setelah refresh atau restart server.
- [ ] Migrasi berjalan otomatis; `data/app.db` tidak masuk git.
- [ ] `npm run build` sukses, test engine dan query DB lulus.
- [ ] Bisa dijalankan lewat Docker dengan volume `data/` dan dideploy ke hosting yang mendukung disk persisten.

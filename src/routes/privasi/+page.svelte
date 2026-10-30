<script lang="ts">
	import { siteConfig } from "$lib/config";
	import Header from "$lib/components/landing/Header.svelte";
	import Footer from "$lib/components/landing/Footer.svelte";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
</script>

<svelte:head>
	<title>Kebijakan Privasi — {siteConfig.name}</title>
	<meta name="description" content="Kebijakan privasi transparan dan anonim {siteConfig.name}. Tanpa upload foto, tanpa akun, tanpa pelacakan pihak ketiga." />
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<Header />

	<main class="flex-1 py-8 sm:py-16">
		<div class="mx-auto max-w-3xl px-3 sm:px-6">
			<div class="mb-8">
				<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
					<ShieldCheckIcon class="size-4 text-emerald-600 dark:text-emerald-400" />
					Privasi & Keamanan Anonim
				</div>
				<h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
					Kebijakan Privasi
				</h1>
				<p class="mt-2 text-xs text-muted-foreground">
					Terakhir diperbarui: 28 Oktober 2026
				</p>
			</div>

			<div class="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">1. Komitmen 100% Anonim</h2>
					<p class="text-muted-foreground">
						{siteConfig.name} didirikan dengan komitmen teguh terhadap privasi pengguna. Kami <strong>tidak pernah</strong> meminta nama lengkap, alamat email, nomor telepon, akun media sosial, maupun informasi pembayaran apa pun.
					</p>
				</section>

				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">2. Tanpa Pemrosesan atau Unggah Foto</h2>
					<p class="text-muted-foreground">
						Kami tidak meminta atau menyimpan foto wajah (selfie) pengguna. Analisis undertone warna kulit dilakukan murni secara visual lewat pertanyaan intuitif (karakteristik urat nadi, perhiasan yang cocok, respon terhadap sinar matahari). Tidak ada data biometrik yang pernah diproses atau disimpan.
					</p>
				</section>

				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">3. Penyimpanan Data & Cookie Sesi</h2>
					<p class="text-muted-foreground">
						Jawabanmu disimpan anonim agar kamu bisa membuka panduan lagi kapan saja. Sesi diidentifikasi menggunakan cookie acak <code class="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">sid</code> (httpOnly, sameSite=lax) yang tidak mengandung identitas pribadimu. Data disimpan secara mandiri di database SQLite server privat kami dan <strong>tidak pernah dijual atau dibagikan ke pihak ketiga atau platform iklan mana pun</strong>.
					</p>
				</section>

				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">4. Masa Retensi Data</h2>
					<p class="text-muted-foreground">
						Draf style check yang tidak diselesaikan dan tidak aktif selama lebih dari 90 hari akan dibersihkan secara otomatis oleh sistem terjadwal kami. Panduan yang telah selesai disimpan secara permanen dengan tautan acak rahasia berenkripsi nanoid (minimal 21 karakter acak) dan diatur dengan instruksi <code class="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">noindex</code> sehingga tidak dapat dicari lewat mesin pencari Google.
					</p>
				</section>

				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">5. Hak Menghapus Data Anda</h2>
					<p class="text-muted-foreground">
						Kamu memiliki kontrol penuh atas datamu. Di setiap halaman panduan hasil (<code class="bg-muted px-1.5 py-0.5 rounded text-foreground font-mono text-[11px]">/panduan/[id]</code>), tersedia tombol <strong>"Hapus Data Saya"</strong>. Mengeklik tombol ini akan seketika melenyapkan seluruh data jawaban, rekomendasi capsule, dan riwayat checklist belanja dari server kami tanpa sisa, serta menghapus cookie sesi di perambanmu.
					</p>
				</section>
			</div>
		</div>
	</main>

	<Footer />
</div>

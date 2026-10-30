<script lang="ts">
	import { siteConfig } from "$lib/config";
	import Header from "$lib/components/landing/Header.svelte";
	import Footer from "$lib/components/landing/Footer.svelte";
	import BookOpenIcon from "@lucide/svelte/icons/book-open";
</script>

<svelte:head>
	<title>Ketentuan Layanan — {siteConfig.name}</title>
	<meta name="description" content="Ketentuan layanan penggunaan web app personal style guide {siteConfig.name}. 100% gratis, edukatif, dan bebas komersialisasi." />
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<Header />

	<main class="flex-1 py-8 sm:py-16">
		<div class="mx-auto max-w-3xl px-3 sm:px-6">
			<div class="mb-8">
				<div class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
					<BookOpenIcon class="size-4 text-primary" />
					Panduan Terbuka
				</div>
				<h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
					Ketentuan Layanan
				</h1>
				<p class="mt-2 text-xs text-muted-foreground">
					Terakhir diperbarui: 28 Oktober 2026
				</p>
			</div>

			<div class="prose prose-stone dark:prose-invert max-w-none text-xs sm:text-sm leading-relaxed space-y-6">
				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">1. Sifat Layanan (100% Gratis & Edukatif)</h2>
					<p class="text-muted-foreground">
						Layanan {siteConfig.name} disediakan secara gratis sebagai sarana edukasi gaya berpakaian dan efisiensi lemari pakaian (capsule wardrobe). Kami tidak mengenakan biaya langganan, tidak menyediakan transaksi komersial, dan tidak terafiliasi secara resmi dengan merek fashion tertentu.
					</p>
				</section>

				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">2. Penggunaan Mandiri</h2>
					<p class="text-muted-foreground">
						Rekomendasi warna, jenis pakaian, dan proporsi yang dihasilkan adalah saran panduan estetika berbasis aturan (rule-based). Pengguna bebas memilih untuk mengikuti sebagian atau seluruh rekomendasi sesuai kenyamanan dan keyakinan masing-masing.
					</p>
				</section>

				<section class="rounded-2xl border border-border bg-card p-6">
					<h2 class="font-serif text-lg font-bold text-foreground mb-3">3. Hak Cipta & Pembagian Tautan</h2>
					<p class="text-muted-foreground">
						Kamu bebas membagikan tautan panduan pribadimu kepada penata busana, teman, penjahit, atau keluarga. Penggunaan materi untuk tujuan komersial massal tanpa izin tertulis dari tim pengembang tidak diperkenankan.
					</p>
				</section>
			</div>
		</div>
	</main>

	<Footer />
</div>

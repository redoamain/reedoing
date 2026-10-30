<script lang="ts">
	import { page } from "$app/state";
	import { siteConfig } from "$lib/config";

	let siteName = $derived(page.data?.siteSettings?.name || siteConfig.name);
	let siteTagline = $derived(page.data?.siteSettings?.tagline || siteConfig.tagline);
	let siteLogo = $derived(page.data?.siteSettings?.logo || "");
	let firstLetter = $derived(siteName.charAt(0).toUpperCase() || "R");
</script>

<footer class="border-t border-border/80 bg-background py-12 text-sm text-muted-foreground">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex flex-col md:flex-row items-center justify-between gap-6">
			<div class="flex items-center gap-2.5">
				{#if siteLogo}
					<img src={siteLogo} alt={siteName} class="h-7 max-w-[100px] object-contain rounded-md" />
				{:else}
					<div class="flex size-7 items-center justify-center rounded-md border border-border bg-stone-100 dark:bg-stone-800 text-foreground font-serif font-bold text-xs">
						{firstLetter}
					</div>
				{/if}
				<div>
					<span class="font-serif font-bold text-foreground">{siteName}</span>
					<span class="text-xs text-muted-foreground ml-2">· {siteTagline}</span>
				</div>
			</div>

			<nav class="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm">
				<a href="/" class="text-stone-700 dark:text-stone-300 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Beranda</a>
				<a href="/mulai" class="text-stone-700 dark:text-stone-300 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Style Check</a>
				<a href="/panduan" class="text-stone-700 dark:text-stone-300 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Panduan Saya</a>
				<a href="/privasi" class="text-stone-700 dark:text-stone-300 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Kebijakan Privasi</a>
				<a href="/ketentuan" class="text-stone-700 dark:text-stone-300 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Ketentuan Layanan</a>
				<a href="/kontak" class="text-stone-700 dark:text-stone-300 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Hubungi Kami</a>
				<a href="/admin" class="text-stone-600 dark:text-stone-400 font-medium hover:text-foreground hover:underline underline-offset-4 transition-colors">Admin</a>
			</nav>
		</div>

		<div class="mt-8 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-3">
			<p>© {new Date().getFullYear()} {siteName}. 100% Gratis & Terbuka untuk Semua.</p>
			<p>Data jawaban disimpan anonim di perangkat & server pribadi Anda.</p>
		</div>
	</div>
</footer>

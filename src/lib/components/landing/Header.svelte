<script lang="ts">
	import { page } from "$app/state";
	import { siteConfig } from "$lib/config";
	import { Button } from "$lib/components/ui/button";
	import { toggleMode, mode } from "mode-watcher";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import CompassIcon from "@lucide/svelte/icons/compass";

	let siteName = $derived(page.data?.siteSettings?.name || siteConfig.name);
	let siteLogo = $derived(page.data?.siteSettings?.logo || "");
	let firstLetter = $derived(siteName.charAt(0).toUpperCase() || "R");
</script>

<header class="sticky top-0 z-50 w-full border-b border-border/70 bg-background/90 backdrop-blur-md transition-colors">
	<div class="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
		<a href="/" class="group flex items-center gap-2 sm:gap-3 min-w-0">
			{#if siteLogo}
				<img src={siteLogo} alt={siteName} class="h-7 sm:h-8 max-w-[110px] sm:max-w-[140px] object-contain rounded-md shrink-0" />
			{:else}
				<div class="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 transition-colors group-hover:border-foreground/40 shrink-0">
					<span class="font-serif text-xs sm:text-sm font-bold tracking-tight">{firstLetter}</span>
				</div>
			{/if}
			<div class="flex flex-col min-w-0">
				<span class="font-serif text-base sm:text-lg font-bold tracking-tight text-foreground leading-none truncate">{siteName}</span>
				<span class="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-muted-foreground mt-0.5">Style System</span>
			</div>
		</a>

		<div class="flex items-center gap-1.5 sm:gap-3 shrink-0">
			<button
				onclick={toggleMode}
				type="button"
				class="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border/80 text-foreground transition-all hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground active:scale-95 shrink-0"
				aria-label="Ganti mode gelap/terang"
				title="Ganti mode gelap/terang"
			>
				{#if mode.current === "dark"}
					<SunIcon class="size-4 text-stone-100" />
				{:else}
					<MoonIcon class="size-4 text-stone-800" />
				{/if}
			</button>

			<Button
				href="/panduan/sample-pria"
				variant="outline"
				size="sm"
				class="hidden sm:inline-flex rounded-lg text-xs font-semibold border border-border/80 bg-background text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground hover:border-foreground/30 transition-all"
			>
				<CompassIcon class="size-3.5 text-foreground" />
				<span>Demo Lookbook</span>
			</Button>

			<Button
				href="/mulai"
				class="font-semibold rounded-lg text-xs sm:text-sm px-3 sm:px-4 h-8 sm:h-9 bg-stone-900 hover:bg-stone-800 text-white hover:text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 dark:hover:text-stone-900 shadow-xs transition-colors shrink-0"
			>
				Mulai Gratis
			</Button>
		</div>
	</div>
</header>

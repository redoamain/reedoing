<script lang="ts">
	import { page } from "$app/state";
	import { Button } from "$lib/components/ui/button";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import CompassIcon from "@lucide/svelte/icons/compass";
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";

	type UndertoneKey = "hangat" | "dingin" | "netral";

	interface PalettePreview {
		key: UndertoneKey;
		label: string;
		veinText: string;
		name: string;
		desc: string;
		colors: { name: string; hex: string; role: "base" | "accent" }[];
		lookFormula: string;
		lookName: string;
		lookOccasion: string;
		items: { name: string; category: string; img: string }[];
	}

	const basePalettes: Record<UndertoneKey, PalettePreview> = {
		hangat: {
			key: "hangat",
			label: "Warm Tone",
			veinText: "Urat nadi kehijauan",
			name: "Warm Earth & Sun",
			desc: "Nuansa bumi hangat: broken white, camel, espresso, dan aksen terracotta.",
			colors: [
				{ name: "Broken White", hex: "#F9F6F0", role: "base" },
				{ name: "Oat Camel", hex: "#C2A27E", role: "base" },
				{ name: "Espresso Brown", hex: "#3D2B1F", role: "base" },
				{ name: "Deep Olive", hex: "#4E5340", role: "base" },
				{ name: "Terracotta", hex: "#B85D43", role: "accent" },
				{ name: "Warm Amber", hex: "#D49B4B", role: "accent" }
			],
			lookFormula: "Blazer Camel + Kemeja Broken White + Trousers Espresso",
			lookName: "The Earth Architect",
			lookOccasion: "Kerja & Meeting",
			items: [
				{ name: "Camel Blazer", category: "Outer", img: "/images/real/items/camel-blazer.jpg" },
				{ name: "Broken White Shirt", category: "Atasan", img: "/images/real/items/broken-white-shirt.jpg" },
				{ name: "Espresso Pants", category: "Bawahan", img: "/images/real/items/espresso-trousers.jpg" }
			]
		},
		dingin: {
			key: "dingin",
			label: "Cool Tone",
			veinText: "Urat nadi kebiruan / ungu",
			name: "Cool Slate & Coastal",
			desc: "Nuansa sejuk berkelas: pure white, classic navy, charcoal, dan slate blue.",
			colors: [
				{ name: "Crisp White", hex: "#FFFFFF", role: "base" },
				{ name: "Classic Navy", hex: "#1B2A47", role: "base" },
				{ name: "Charcoal Grey", hex: "#33383F", role: "base" },
				{ name: "Heather Fog", hex: "#CBD2D9", role: "base" },
				{ name: "Slate Blue", hex: "#4D6B88", role: "accent" },
				{ name: "Deep Burgundy", hex: "#6B1D2F", role: "accent" }
			],
			lookFormula: "Navy Blazer + Kemeja Crisp White + Charcoal Pants",
			lookName: "Executive Slate",
			lookOccasion: "Formal & Bisnis",
			items: [
				{ name: "Navy Blazer", category: "Outer", img: "/images/real/items/navy-blazer.jpg" },
				{ name: "Crisp Oxford Shirt", category: "Atasan", img: "/images/real/items/crisp-oxford-shirt.jpg" },
				{ name: "Charcoal Pants", category: "Bawahan", img: "/images/real/items/charcoal-pants.jpg" }
			]
		},
		netral: {
			key: "netral",
			label: "Neutral Tone",
			veinText: "Urat nadi campuran (biru & hijau)",
			name: "Neutral Mineral & Stone",
			desc: "Nuansa netral seimbang: soft ecru, midnight graphite, taupe, dan sage green.",
			colors: [
				{ name: "Soft Ecru", hex: "#F5F2EB", role: "base" },
				{ name: "Midnight Graphite", hex: "#26292E", role: "base" },
				{ name: "Smokey Taupe", hex: "#7A7265", role: "base" },
				{ name: "French Navy", hex: "#202E42", role: "base" },
				{ name: "Muted Sage", hex: "#768B75", role: "accent" },
				{ name: "Rosewood Mauve", hex: "#9B6A6C", role: "accent" }
			],
			lookFormula: "Graphite Blazer + Ecru Heavy Tee + Taupe Chinos",
			lookName: "Minimalist Mineral",
			lookOccasion: "Smart Casual",
			items: [
				{ name: "Graphite Blazer", category: "Outer", img: "/images/real/items/graphite-blazer.jpg" },
				{ name: "Ecru Heavy Tee", category: "Atasan", img: "/images/real/items/ecru-heavy-tee.jpg" },
				{ name: "Taupe Chinos", category: "Bawahan", img: "/images/real/items/taupe-chinos.jpg" }
			]
		}
	};

	let heroConfig = $derived(page.data?.siteSettings?.hero);

	let activeTone = $state<UndertoneKey>("hangat");

	$effect(() => {
		if (heroConfig?.defaultTone && (heroConfig.defaultTone === "hangat" || heroConfig.defaultTone === "dingin" || heroConfig.defaultTone === "netral")) {
			activeTone = heroConfig.defaultTone;
		}
	});

	let palettes = $derived<Record<UndertoneKey, PalettePreview>>({
		hangat: {
			...basePalettes.hangat,
			name: heroConfig?.warmName || basePalettes.hangat.name,
			desc: heroConfig?.warmDesc || basePalettes.hangat.desc,
			colors: heroConfig?.warmColors && heroConfig.warmColors.length ? heroConfig.warmColors : basePalettes.hangat.colors
		},
		dingin: {
			...basePalettes.dingin,
			name: heroConfig?.coolName || basePalettes.dingin.name,
			desc: heroConfig?.coolDesc || basePalettes.dingin.desc,
			colors: heroConfig?.coolColors && heroConfig.coolColors.length ? heroConfig.coolColors : basePalettes.dingin.colors
		},
		netral: {
			...basePalettes.netral,
			name: heroConfig?.neutralName || basePalettes.netral.name,
			desc: heroConfig?.neutralDesc || basePalettes.netral.desc,
			colors: heroConfig?.neutralColors && heroConfig.neutralColors.length ? heroConfig.neutralColors : basePalettes.netral.colors
		}
	});

	let currentPalette = $derived(palettes[activeTone]);
</script>

<section class="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="grid items-center gap-10 lg:grid-cols-12 lg:gap-10">
			<!-- Teks Kiri -->
			<div class="flex flex-col items-center text-center lg:col-span-6 lg:items-start lg:text-left">
				<h1 class="font-serif text-3xl font-normal tracking-tight sm:text-5xl lg:text-6xl text-foreground leading-[1.15]">
					{heroConfig?.title1 || "Lebih sedikit pakaian,"} <br class="hidden sm:inline" />
					<span class="italic text-foreground font-medium">{heroConfig?.title2 || "lebih banyak gaya."}</span>
				</h1>

				<p class="mt-4 sm:mt-5 max-w-xl text-sm sm:text-base md:text-lg text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
					{heroConfig?.description || "Bangun capsule wardrobe fungsional 12 item yang menghasilkan 30+ kombinasi outfit siap pakai. Dirancang personal untuk pria dan wanita berdasarkan undertone urat nadi dan proporsi tubuhmu."}
				</p>

				<div class="mt-6 sm:mt-7 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
					<Button
						href="/mulai"
						size="lg"
						class="w-full sm:w-auto gap-2 px-7 text-sm font-semibold bg-stone-900 hover:bg-stone-800 text-white hover:text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 dark:hover:text-stone-900 shadow-sm transition-colors"
					>
						{heroConfig?.ctaText || "Mulai Style Check"}
						<ArrowRightIcon class="size-4" />
					</Button>
					<Button
						href="/panduan/sample-pria"
						variant="outline"
						size="lg"
						class="w-full sm:w-auto gap-2 text-xs font-semibold border border-border/80 bg-background text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground hover:border-foreground/30 transition-all"
					>
						<CompassIcon class="size-3.5 text-foreground" />
						{heroConfig?.ctaSecondaryText || "Lihat Contoh Lookbook"}
					</Button>
				</div>
				<span class="mt-2.5 sm:mt-3 text-xs text-stone-600 dark:text-stone-400 font-medium">
					{heroConfig?.ctaSubtext || "Gratis · Sekitar 3 menit · Langsung siap pakai"}
				</span>

				<div class="mt-6 sm:mt-8 grid grid-cols-3 gap-2.5 sm:gap-6 border-t border-border/70 pt-5 sm:pt-6 text-center sm:text-left w-full sm:w-auto">
					<div>
						<div class="font-serif text-xl sm:text-2xl font-bold text-foreground">{heroConfig?.stat1Val || "12 Item"}</div>
						<div class="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">{heroConfig?.stat1Lbl || "Wardrobe esensial"}</div>
					</div>
					<div>
						<div class="font-serif text-xl sm:text-2xl font-bold text-foreground">{heroConfig?.stat2Val || "30+ Look"}</div>
						<div class="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">{heroConfig?.stat2Lbl || "Kombinasi siap pakai"}</div>
					</div>
					<div>
						<div class="font-serif text-xl sm:text-2xl font-bold text-foreground">{heroConfig?.stat3Val || "100%"}</div>
						<div class="text-[11px] sm:text-xs text-muted-foreground font-medium mt-0.5">{heroConfig?.stat3Lbl || "Gratis selamanya"}</div>
					</div>
				</div>
			</div>

			<!-- Kartu Preview Color Palette & Capsule System (Kanan) -->
			<div class="lg:col-span-6">
				<div class="relative mx-auto max-w-lg lg:max-w-none">
					<!-- Kartu Utama -->
					<div class="relative rounded-2xl border border-border/80 bg-card p-5 sm:p-6 shadow-sm">
						<!-- Header Kartu: Judul & Tabs Undertone -->
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3.5">
							<div class="flex items-center gap-2">
								<div class="flex size-7 items-center justify-center rounded-lg bg-stone-100 dark:bg-stone-800 text-foreground">
									<PaletteIcon class="size-4" />
								</div>
								<div>
									<span class="text-xs font-bold tracking-wider text-foreground uppercase block">Color Palette Personal</span>
									<span class="text-[11px] text-muted-foreground">Harmonisasi tone kulit & pakaian</span>
								</div>
							</div>

							<!-- Tabs Switcher Undertone -->
							<div class="flex items-center gap-1 p-1 rounded-lg bg-stone-100 dark:bg-stone-800/80 border border-border/60">
								{#each [
									{ id: "hangat", label: "Warm" },
									{ id: "dingin", label: "Cool" },
									{ id: "netral", label: "Neutral" }
								] as t}
									<button
										type="button"
										onclick={() => (activeTone = t.id as UndertoneKey)}
										class="rounded-md py-1 px-2.5 text-xs transition-all {activeTone === t.id ? 'bg-background shadow-xs font-bold text-foreground border border-border/60' : 'text-stone-700 dark:text-stone-300 font-medium hover:bg-background/60 hover:text-foreground'}"
									>
										{t.label}
									</button>
								{/each}
							</div>
						</div>

						<!-- Info Palet Aktif & Indikasi Urat Nadi -->
						<div class="mt-3.5 flex items-center justify-between gap-2">
							<div>
								<div class="flex items-center gap-2">
									<h2 class="font-serif text-sm sm:text-base font-bold text-foreground">
										{currentPalette.name}
									</h2>
									<span class="inline-flex items-center gap-1 rounded-full border border-border/80 bg-secondary px-2 py-0.2 text-[10px] font-semibold text-foreground">
										<SparklesIcon class="size-2.5 text-amber-500" />
										{currentPalette.label}
									</span>
								</div>
								<p class="text-[11px] text-muted-foreground font-medium mt-0.5">
									Deteksi: <span class="text-foreground font-semibold">{currentPalette.veinText}</span>
								</p>
							</div>

							<span class="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded border border-border/80 bg-stone-50 dark:bg-stone-900/60 text-foreground shrink-0">
								6 Warna Kunci
							</span>
						</div>

						<!-- Grid 6 Color Swatches -->
						<div class="mt-3 grid grid-cols-3 sm:grid-cols-6 gap-2">
							{#each currentPalette.colors as col}
								<div class="group/swatch relative flex flex-col items-center rounded-xl border border-border/70 bg-stone-50 dark:bg-stone-900/40 p-2 text-center transition-all hover:border-foreground/30 hover:bg-stone-100 dark:hover:bg-stone-800/80">
									<span
										class="size-7 sm:size-8 rounded-lg border border-black/15 dark:border-white/20 shadow-2xs shrink-0 transition-transform group-hover/swatch:scale-105"
										style="background-color: {col.hex}"
									></span>
									<span class="mt-1.5 text-[10px] font-bold text-foreground truncate w-full" title={col.name}>
										{col.name}
									</span>
									<span class="text-[9px] font-mono text-muted-foreground font-semibold">
										{col.hex}
									</span>
								</div>
							{/each}
						</div>

						<!-- Penerapan Pada Item Capsule Wardrobe -->
						<div class="mt-4 pt-3.5 border-t border-border/60">
							<div class="flex items-center justify-between mb-2.5">
								<span class="text-[11px] font-bold text-foreground tracking-wider uppercase">Penerapan Pada Capsule Wardrobe</span>
								<span class="text-[10px] text-muted-foreground font-semibold">{currentPalette.lookOccasion}</span>
							</div>

							<div class="grid grid-cols-3 gap-2">
								{#each currentPalette.items as it}
									<div class="rounded-xl border border-border/70 bg-stone-50 dark:bg-stone-900/40 p-2 text-center transition-all hover:border-foreground/30 hover:bg-stone-100 dark:hover:bg-stone-800/80">
										<img src={it.img} alt={it.name} class="mx-auto size-12 sm:size-14 rounded-lg object-cover shadow-2xs border border-border/70" />
										<p class="mt-1.5 text-[11px] font-bold text-foreground leading-tight truncate">{it.name}</p>
										<span class="text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">{it.category}</span>
									</div>
								{/each}
							</div>

							<!-- Look Result Card -->
							<div class="mt-3 rounded-xl border border-border/70 bg-background p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs">
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-1.5">
										<span class="size-1.5 rounded-full bg-emerald-500 shrink-0"></span>
										<p class="text-xs font-bold text-foreground truncate">{currentPalette.lookName}</p>
									</div>
									<p class="text-[11px] text-muted-foreground truncate font-medium mt-0.5">{currentPalette.lookFormula}</p>
								</div>
								<span class="shrink-0 self-start sm:self-auto text-[10px] font-bold text-foreground uppercase tracking-wider px-2 py-0.5 rounded border border-border bg-secondary/70">
									3 Warna Harmonis
								</span>
							</div>
						</div>
					</div>

					<!-- Floating Pill Bawah -->
					<div class="absolute -bottom-3.5 left-2 sm:-left-3 max-w-[calc(100%-1rem)] rounded-full border border-border bg-card px-3 sm:px-3.5 py-1.5 shadow-sm flex items-center gap-2 text-[11px] sm:text-xs font-semibold text-foreground">
						<span class="size-2 shrink-0 rounded-full bg-emerald-500"></span>
						<span class="truncate">{heroConfig?.floatingText || "Deteksi warna urat nadi pergelangan tangan otomatis"}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</section>
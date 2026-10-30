<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import { siteConfig } from "$lib/config";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as ToggleGroup from "$lib/components/ui/toggle-group";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";

	import Share2Icon from "@lucide/svelte/icons/share-2";
	import PrinterIcon from "@lucide/svelte/icons/printer";
	import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import ShirtIcon from "@lucide/svelte/icons/shirt";
	import CompassIcon from "@lucide/svelte/icons/compass";
	import ShoppingBagIcon from "@lucide/svelte/icons/shopping-bag";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
	import InfoIcon from "@lucide/svelte/icons/info";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SnowflakeIcon from "@lucide/svelte/icons/snowflake";
	import ScaleIcon from "@lucide/svelte/icons/scale";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import { toggleMode, mode } from "mode-watcher";

	import type { PageData } from "./$types";
	import type { RoutineOption, Outfit, ShoppingItem, CapsuleItem, Undertone } from "$lib/types/style";

	let { data }: { data: PageData } = $props();

	// State undertone aktif — dapat diubah langsung & reaktif secara instan di website hasil
	let activeUndertone = $state<Undertone>("hangat");

	$effect(() => {
		activeUndertone =
			(data.userAnswers?.undertone as Undertone) ||
			(data.result?.palette?.undertone as Undertone) ||
			"hangat";
	});

	// Panduan aktif yang otomatis reaktif saat undertone diubah (Warm, Cool, Neutral)
	let activeGuide = $derived.by(() => {
		if (data.guidesByTone && data.guidesByTone[activeUndertone]) {
			return data.guidesByTone[activeUndertone];
		}
		return data.result;
	});

	let guide = $derived(activeGuide);
	let shoppingChecks = $state<Record<string, boolean>>({});

	$effect(() => {
		if (data.checks) {
			shoppingChecks = { ...data.checks };
		}
	});

	// State filter situasi outfit — LANGSUNG TAMPILKAN OUTFIT & WARNA REKOMENDASI SECARA DEFAULT
	let selectedOccasion = $state<string>("semua");
	let activeGuideTab = $state<string>("outfit");

	// State AI Try-On Image Generation (Google Gemini)
	let aiImages = $state<Record<string, string>>({});
	let isGeneratingOutfitId = $state<string | null>(null);
	let currentTryOnOutfitId = $state<string>("");
	let tryOnForm: HTMLFormElement | undefined = $state();

	$effect(() => {
		if (data.aiImages) {
			aiImages = { ...data.aiImages };
		}
	});

	function triggerTryOn(outfitId: string) {
		currentTryOnOutfitId = outfitId;
		tryOnForm?.requestSubmit();
	}

	// Dialog state
	let isDeleteDialogOpen = $state(false);
	let isResetDialogOpen = $state(false);

	// Hitung progres kepemilikan item belanja
	let ownedCount = $derived(
		Object.values(shoppingChecks).filter(Boolean).length
	);
	let totalItemsCount = $derived(guide?.capsule?.length || 12);
	let ownedPercentage = $derived(
		Math.round((ownedCount / totalItemsCount) * 100)
	);

	// Filter outfit sesuai situasi
	let filteredOutfits = $derived.by(() => {
		if (!guide?.outfits) return [];
		if (selectedOccasion === "semua") return guide.outfits;
		return guide.outfits.filter(
			(o: Outfit) => o.occasion === selectedOccasion
		);
	});

	// Form toggle checklist tersembunyi
	let checkForm: HTMLFormElement | undefined = $state();
	let currentCheckItem = $state<string>("");
	let currentCheckValue = $state<boolean>(false);

	function handleToggleCheck(itemId: string) {
		const newValue = !shoppingChecks[itemId];
		shoppingChecks[itemId] = newValue;
		currentCheckItem = itemId;
		currentCheckValue = newValue;

		checkForm?.requestSubmit();
	}

	function copyGuideLink() {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(window.location.href);
			toast.success("Tautan panduan berhasil disalin!", {
				description: "Simpan atau buka di perangkat lain kapan saja."
			});
		}
	}

	function handlePrint() {
		if (typeof window !== "undefined") {
			window.print();
		}
	}

	const occasionFilters: Array<{ id: string; label: string }> = [
		{ id: "semua", label: "Semua Look" },
		{ id: "kantor", label: "Kerja Kantor" },
		{ id: "meeting", label: "Meeting Klien" },
		{ id: "kampus", label: "Kuliah / Kampus" },
		{ id: "hangout", label: "Hangout" },
		{ id: "santai", label: "Santai / WFH" },
		{ id: "formal", label: "Acara Formal" }
	];
</script>

<svelte:head>
	<title>{guide.summary.headline} — {siteConfig.name}</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="Panduan personal capsule wardrobe fungsional dan palet warna kulit." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col pb-16">
	<!-- Top Navigation Bar -->
	<header class="border-b border-border/70 bg-background/90 backdrop-blur-md sticky top-0 z-40 transition-colors no-print">
		<div class="mx-auto flex h-14 sm:h-16 max-w-6xl items-center justify-between px-3 sm:px-6">
			<!-- Brand & Breadcrumb -->
			<div class="flex items-center gap-2 sm:gap-3 min-w-0">
				<a href="/" class="group flex items-center gap-2 sm:gap-3 min-w-0">
					<div class="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 transition-colors group-hover:border-foreground/30 shrink-0">
						<span class="font-serif text-xs sm:text-sm font-bold tracking-tight">R</span>
					</div>
					<div class="flex flex-col min-w-0">
						<span class="font-serif text-base sm:text-lg font-bold tracking-tight text-foreground leading-none truncate">
							{siteConfig.name}
						</span>
						<span class="text-[8px] sm:text-[9px] tracking-[0.2em] uppercase font-semibold text-muted-foreground mt-0.5">
							Personal Lookbook
						</span>
					</div>
				</a>

				<span class="hidden md:inline-block h-4 w-px bg-border/80"></span>

				<div class="hidden md:flex items-center gap-2">
					<span class="rounded-full border border-border/70 bg-stone-50 dark:bg-stone-900/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
						{guide.summary.genderDesc}
					</span>
					<span class="rounded-full border border-border/70 bg-stone-50 dark:bg-stone-900/50 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
						Undertone {guide.palette.undertone}
					</span>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="flex items-center gap-1 sm:gap-2 shrink-0">
				<!-- Theme Toggle -->
				<button
					onclick={toggleMode}
					type="button"
					class="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border/80 text-foreground transition-all hover:bg-muted active:scale-95 shrink-0"
					aria-label="Ganti mode gelap/terang"
					title="Ganti mode gelap/terang"
				>
					{#if mode.current === "dark"}
						<SunIcon class="size-3.5 sm:size-4 text-stone-200" />
					{:else}
						<MoonIcon class="size-3.5 sm:size-4 text-stone-700" />
					{/if}
				</button>

				<!-- Bagikan / Salin Tautan -->
				<Button
					variant="outline"
					size="sm"
					onclick={copyGuideLink}
					class="gap-1 sm:gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border-border/80 text-xs font-medium text-foreground hover:bg-muted active:scale-95 shrink-0"
					title="Salin tautan hasil panduan"
				>
					<Share2Icon class="size-3.5 text-muted-foreground" />
					<span class="hidden sm:inline">Bagikan</span>
				</Button>

				<!-- Cetak / PDF -->
				<Button
					variant="outline"
					size="sm"
					onclick={handlePrint}
					class="gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border-border/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 shrink-0"
					title="Cetak atau simpan sebagai PDF"
				>
					<PrinterIcon class="size-3.5" />
					<span class="hidden md:inline">Cetak / PDF</span>
				</Button>

				<!-- Check Baru -->
				<Button
					href="/mulai"
					size="sm"
					class="gap-1 sm:gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 active:scale-95 shadow-none shrink-0"
				>
					<RotateCcwIcon class="size-3.5" />
					<span class="hidden sm:inline">Check Baru</span>
				</Button>

				<!-- Hapus Data Button (Icon Only) -->
				<button
					type="button"
					onclick={() => (isDeleteDialogOpen = true)}
					class="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 active:scale-95 shrink-0"
					title="Hapus data panduan ini"
				>
					<Trash2Icon class="size-3.5" />
				</button>
			</div>
		</div>
	</header>

	<main class="flex-1 py-6 sm:py-12">
		<div class="mx-auto max-w-6xl px-3 sm:px-6">
			<!-- Header Banner Hasil -->
			<div class="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 md:p-8 mb-6 sm:mb-8 transition-colors">
				{#if data.isSample || data.id === 'sample-pria' || data.id === 'sample-wanita'}
					<!-- Switcher Demo Pria vs Wanita -->
					<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-stone-100/90 dark:bg-stone-800/80 border border-border/80 mb-5">
						<div class="flex items-center gap-2">
							<span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
							<span class="text-xs font-bold text-foreground">Mode Contoh Demo Interaktif</span>
							<span class="text-[11px] text-muted-foreground hidden sm:inline">· Ganti kategori lookbook:</span>
						</div>
						<div class="flex items-center gap-1.5 self-start sm:self-auto">
							<a
								href="/panduan/sample-pria"
								class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {data.id === 'sample-pria' ? 'bg-background shadow-xs text-foreground font-bold border border-border/80' : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-background/50'}"
							>
								<span>👨</span>
								<span>Demo Pria</span>
							</a>
							<a
								href="/panduan/sample-wanita"
								class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all {data.id === 'sample-wanita' ? 'bg-background text-foreground shadow-xs font-bold border border-border/80' : 'text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-background/50'}"
							>
								<span>👩</span>
								<span>Demo Wanita</span>
							</a>
						</div>
					</div>
				{/if}

				<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-5 sm:gap-6">
					<div class="space-y-2.5 sm:space-y-3">
						<div class="flex flex-wrap items-center gap-2">
							<span class="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-stone-100/80 dark:bg-stone-800/60 px-2.5 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-medium text-foreground">
								<span class="size-1.5 rounded-full bg-emerald-500"></span>
								<span>{data.isSample ? 'Lookbook Demo' : 'Panduan Tersimpan'}</span>
							</span>
							<span class="rounded-full border border-border/70 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-muted-foreground capitalize">
								{guide.summary.genderDesc}
							</span>

							<!-- Tone Switcher Quick Pills -->
							<div class="inline-flex items-center gap-1 p-0.5 rounded-full border border-border/80 bg-stone-100 dark:bg-stone-800/80">
								<button
									type="button"
									onclick={() => (activeUndertone = "hangat")}
									class="px-2.5 py-0.5 rounded-full text-[11px] transition-all {activeUndertone === 'hangat' ? 'bg-background text-foreground font-bold shadow-2xs border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Ganti ke Undertone Hangat"
								>
									☀️ Warm
								</button>
								<button
									type="button"
									onclick={() => (activeUndertone = "dingin")}
									class="px-2.5 py-0.5 rounded-full text-[11px] transition-all {activeUndertone === 'dingin' ? 'bg-background text-foreground font-bold shadow-2xs border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Ganti ke Undertone Dingin"
								>
									❄️ Cool
								</button>
								<button
									type="button"
									onclick={() => (activeUndertone = "netral")}
									class="px-2.5 py-0.5 rounded-full text-[11px] transition-all {activeUndertone === 'netral' ? 'bg-background text-foreground font-bold shadow-2xs border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Ganti ke Undertone Netral"
								>
									⚖️ Neutral
								</button>
							</div>

							{#if guide.photoAnalysis}
								<span class="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-stone-50 dark:bg-stone-900/40 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-foreground">
									<span class="size-2 rounded-full border border-background shadow-xs shrink-0" style="background-color: {guide.photoAnalysis.skinHex}"></span>
									<span>Tone Kulit: {guide.photoAnalysis.skinHex}</span>
								</span>
							{/if}
						</div>

						<h1 class="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-foreground tracking-tight leading-[1.15]">
							{guide.summary.headline}
						</h1>
						<p class="text-xs sm:text-sm text-muted-foreground max-w-2xl leading-relaxed font-normal">
							{guide.summary.subheadline}
						</p>
					</div>

					<!-- Ratio Stat Card -->
					<div class="flex shrink-0 items-center justify-around sm:justify-start gap-4 sm:gap-6 rounded-xl border border-border/70 bg-stone-50/50 dark:bg-stone-900/30 p-3.5 sm:p-5 w-full md:w-auto">
						<div class="text-center pr-4 sm:pr-6 border-r border-border/70">
							<div class="font-serif text-2xl sm:text-4xl font-normal text-foreground">{guide.summary.itemCount}</div>
							<div class="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Item Inti</div>
						</div>
						<div class="text-center">
							<div class="font-serif text-2xl sm:text-4xl font-normal text-foreground">{guide.summary.outfitCount}+</div>
							<div class="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5 font-medium">Kombinasi Look</div>
						</div>
					</div>
				</div>
			</div>

			<!-- Tabs Navigasi 5 Bagian — DEFAULT OUTFIT & WARNA -->
			<Tabs.Root bind:value={activeGuideTab} class="w-full">
				<!-- MOBILE TABS LIST (smooth horizontal scroll) -->
				<Tabs.List class="lg:hidden flex w-full overflow-x-auto touch-pan-x h-auto p-1 bg-stone-100/70 dark:bg-stone-900/60 rounded-xl mb-6 no-print gap-1 border border-border/70 scrollbar-none">
					<Tabs.Trigger value="outfit" class="shrink-0 gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-900 whitespace-nowrap">
						<CompassIcon class="size-3.5" />
						<span>Outfit & Warna ({guide.outfits.length})</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="wardrobe" class="shrink-0 gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-900 whitespace-nowrap">
						<ShirtIcon class="size-3.5" />
						<span>Wardrobe ({guide.capsule?.length || 12})</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="belanja" class="shrink-0 gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-900 whitespace-nowrap">
						<ShoppingBagIcon class="size-3.5" />
						<span>Belanja ({ownedCount}/{totalItemsCount})</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="warna" class="shrink-0 gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-900 whitespace-nowrap">
						<PaletteIcon class="size-3.5" />
						<span>Detail Warna</span>
					</Tabs.Trigger>
					<Tabs.Trigger value="ringkasan" class="shrink-0 gap-1.5 py-2 px-3 text-xs font-medium rounded-lg transition-all data-[state=active]:bg-stone-900 data-[state=active]:text-stone-50 dark:data-[state=active]:bg-stone-100 dark:data-[state=active]:text-stone-900 whitespace-nowrap">
						<InfoIcon class="size-3.5" />
						<span>Ringkasan</span>
					</Tabs.Trigger>
				</Tabs.List>

				<!-- 2-COLUMN LAYOUT ON DESKTOP -->
				<div class="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
					<!-- DESKTOP STICKY SIDEBAR NAVIGATION -->
					<aside class="hidden lg:block lg:col-span-3 space-y-4 sticky top-24 self-start no-print">
						<!-- User Profile Summary in Sidebar -->
						<div class="rounded-xl border border-border/80 bg-card p-4 space-y-3">
							<div class="flex items-center justify-between">
								<span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Profil Analisis</span>
								<span class="rounded border border-border/80 px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground capitalize">
									{guide.summary.genderDesc}
								</span>
							</div>
							<div class="flex items-center gap-2.5">
								<div class="flex size-8 items-center justify-center rounded-lg border border-border bg-stone-50 dark:bg-stone-800 text-foreground">
									<PaletteIcon class="size-3.5" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="text-xs font-semibold text-foreground leading-tight truncate">Undertone {guide.palette.undertone}</div>
									<div class="text-[10px] text-muted-foreground truncate">{guide.palette.name}</div>
								</div>
							</div>

							<!-- Undertone Quick Switcher in Sidebar -->
							<div class="pt-2 border-t border-border/60">
								<div class="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 font-medium">
									<span>Ganti Tone Kulit:</span>
								</div>
								<div class="grid grid-cols-3 gap-1">
									<button
										type="button"
										onclick={() => (activeUndertone = "hangat")}
										class="py-1 px-1.5 rounded text-[10px] font-medium transition-all text-center {activeUndertone === 'hangat' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-foreground'}"
									>
										Warm
									</button>
									<button
										type="button"
										onclick={() => (activeUndertone = "dingin")}
										class="py-1 px-1.5 rounded text-[10px] font-medium transition-all text-center {activeUndertone === 'dingin' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-foreground'}"
									>
										Cool
									</button>
									<button
										type="button"
										onclick={() => (activeUndertone = "netral")}
										class="py-1 px-1.5 rounded text-[10px] font-medium transition-all text-center {activeUndertone === 'netral' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-bold' : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:text-foreground'}"
									>
										Neutral
									</button>
								</div>
							</div>

							<!-- Mini Color Swatches -->
							<div class="pt-2 border-t border-border/60">
								<div class="flex items-center justify-between text-[10px] text-muted-foreground mb-1.5 font-medium">
									<span>Palet Rekomendasi</span>
									<span class="text-[9px] uppercase tracking-wider text-muted-foreground">6 Warna</span>
								</div>
								<div class="flex items-center gap-1.5">
									{#each guide.palette.baseColors.slice(0, 4) as col}
										<span class="size-4 rounded-full border border-black/10 shadow-2xs shrink-0" style="background-color: {col.hex}" title={col.name}></span>
									{/each}
									{#each guide.palette.accentColors.slice(0, 2) as col}
										<span class="size-4 rounded-full border border-black/10 shadow-2xs shrink-0" style="background-color: {col.hex}" title="Aksen: {col.name}"></span>
									{/each}
								</div>
							</div>
						</div>

						<!-- Vertical Navigation Menu in Sidebar -->
						<div class="rounded-xl border border-border/80 bg-card p-1.5 space-y-0.5">
							<span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-3 py-1.5 block">
								Bagian Panduan
							</span>
							<button
								type="button"
								onclick={() => (activeGuideTab = "outfit")}
								class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all {activeGuideTab === 'outfit' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground'}"
							>
								<div class="flex items-center gap-2.5">
									<CompassIcon class="size-3.5" />
									<span>Katalog Outfit & Warna</span>
								</div>
								<span class="text-[10px] py-0.5 px-1.5 rounded font-mono font-medium border {activeGuideTab === 'outfit' ? 'border-stone-700 dark:border-stone-300' : 'border-border/80'}">
									{guide.outfits.length}
								</span>
							</button>

							<button
								type="button"
								onclick={() => (activeGuideTab = "wardrobe")}
								class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all {activeGuideTab === 'wardrobe' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground'}"
							>
								<div class="flex items-center gap-2.5">
									<ShirtIcon class="size-3.5" />
									<span>Wardrobe Inti</span>
								</div>
								<span class="text-[10px] py-0.5 px-1.5 rounded font-mono font-medium border {activeGuideTab === 'wardrobe' ? 'border-stone-700 dark:border-stone-300' : 'border-border/80'}">
									{guide.capsule?.length || 12}
								</span>
							</button>

							<button
								type="button"
								onclick={() => (activeGuideTab = "belanja")}
								class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all {activeGuideTab === 'belanja' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground'}"
							>
								<div class="flex items-center gap-2.5">
									<ShoppingBagIcon class="size-3.5" />
									<span>Daftar Belanja</span>
								</div>
								<span class="text-[10px] py-0.5 px-1.5 rounded font-mono font-medium border {activeGuideTab === 'belanja' ? 'border-stone-700 dark:border-stone-300' : 'border-border/80'}">
									{ownedCount}/{totalItemsCount}
								</span>
							</button>

							<button
								type="button"
								onclick={() => (activeGuideTab = "warna")}
								class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all {activeGuideTab === 'warna' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground'}"
							>
								<div class="flex items-center gap-2.5">
									<PaletteIcon class="size-3.5" />
									<span>Detail Warna Personal</span>
								</div>
							</button>

							<button
								type="button"
								onclick={() => (activeGuideTab = "ringkasan")}
								class="w-full flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all {activeGuideTab === 'ringkasan' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900' : 'text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground'}"
							>
								<div class="flex items-center gap-2.5">
									<InfoIcon class="size-3.5" />
									<span>Ringkasan Gaya</span>
								</div>
							</button>
						</div>

						<!-- Wardrobe Checklist Progress Card in Sidebar -->
						<div class="rounded-xl border border-border/80 bg-card p-4 space-y-2.5">
							<div class="flex items-center justify-between text-xs">
								<span class="font-medium text-foreground">Progres Koleksi</span>
								<span class="font-mono text-muted-foreground">{ownedCount}/{totalItemsCount}</span>
							</div>
							<Progress value={ownedPercentage} class="h-1.5 bg-stone-100 dark:bg-stone-800" />
							<p class="text-[11px] text-muted-foreground leading-relaxed font-normal">
								{ownedPercentage}% dari {totalItemsCount} item inti sudah kamu miliki di lemari.
							</p>
						</div>

						<!-- Quick Actions in Sidebar -->
						<div class="rounded-xl border border-border/80 bg-card p-2.5 space-y-1.5">
							<Button
								variant="outline"
								size="sm"
								onclick={copyGuideLink}
								class="w-full justify-start gap-2 rounded-lg text-xs font-medium border-border/80 text-foreground hover:bg-muted"
							>
								<Share2Icon class="size-3.5 text-muted-foreground" />
								<span>Salin Link Panduan</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onclick={handlePrint}
								class="w-full justify-start gap-2 rounded-lg text-xs font-medium border-border/80 text-foreground hover:bg-muted"
							>
								<PrinterIcon class="size-3.5 text-muted-foreground" />
								<span>Cetak / Simpan PDF</span>
							</Button>
						</div>
					</aside>

					<!-- MAIN CONTENT AREA FOR TABS -->
					<div class="lg:col-span-9 space-y-8 min-w-0">

				<!-- 1. TAB RINGKASAN -->
				<Tabs.Content value="ringkasan" class="space-y-8">
					<div class="grid gap-5 md:grid-cols-3">
						<div class="rounded-xl border border-border/80 bg-card p-5 sm:p-6 transition-all hover:border-foreground/20">
							<span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
								Arah Estetika
							</span>
							<h3 class="font-serif text-xl font-normal text-foreground">{guide.summary.primaryStyle}</h3>
							<p class="mt-2 text-xs text-muted-foreground leading-relaxed font-normal">
								Koleksi dirancang untuk mengutamakan kesederhanaan, potongan proporsional, dan kemudahan mix-and-match dalam kegiatan sehari-hari.
							</p>
						</div>

						<div class="rounded-xl border border-border/80 bg-card p-5 sm:p-6 transition-all hover:border-foreground/20">
							<span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block mb-2">
								Formula Rasio
							</span>
							<h3 class="font-serif text-xl font-normal text-foreground">{guide.summary.coreRatio}</h3>
							<p class="mt-2 text-xs text-muted-foreground leading-relaxed font-normal">
								Hanya dengan 12 item esensial di lemarimu, kamu memiliki lebih dari 30 variasi pakaian berbeda untuk sebulan penuh.
							</p>
						</div>

						<div class="rounded-xl border border-border/80 bg-card p-5 sm:p-6 transition-all hover:border-foreground/20">
							<div class="flex items-center justify-between mb-2">
								<span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
									Palet Warna
								</span>
								<div class="flex items-center -space-x-1">
									{#each (guide.palette.baseColors || []).slice(0, 4) as c}
										<span class="size-3.5 rounded-full border border-card shadow-2xs" style="background-color: {c.hex};" title="{c.name}"></span>
									{/each}
								</div>
							</div>
							<h3 class="font-serif text-xl font-normal text-foreground">{guide.palette.name}</h3>
							<p class="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3 font-normal">
								{guide.palette.description}
							</p>
						</div>
					</div>

					<!-- Kartu Khusus Analisis Foto (Jika Ada) -->
					{#if guide.photoAnalysis}
						<div class="rounded-xl border border-border/80 bg-card p-6">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
								<div class="flex items-center gap-3.5">
									<div
										class="size-11 rounded-full border border-black/10 shadow-sm shrink-0"
										style="background-color: {guide.photoAnalysis.skinHex};"
										title="Warna Kulit: {guide.photoAnalysis.skinHex}"
									></div>
									<div>
										<div class="flex items-center gap-2">
											<span class="font-serif text-base font-normal text-foreground">
												Harmoni Warna Kulit & Outfit
											</span>
											<span class="rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
												{guide.photoAnalysis.skinHex}
											</span>
										</div>
										<p class="text-xs text-muted-foreground mt-0.5 font-normal">
											Tone kulit tergolong undertone <strong class="text-foreground capitalize font-medium">{guide.photoAnalysis.undertone}</strong>.
											{#if guide.photoAnalysis.veinDescription}
												<span class="block text-[11px] text-muted-foreground/90 mt-0.5">• {guide.photoAnalysis.veinDescription}</span>
											{/if}
										</p>
									</div>
								</div>
							</div>

							<p class="text-xs text-muted-foreground leading-relaxed mt-4 font-normal">
								{guide.photoAnalysis.explanation}
							</p>

							<div class="mt-4 pt-4 border-t border-border/60">
								<div class="text-xs font-medium text-foreground mb-2 flex items-center gap-1.5">
									<CheckIcon class="size-3.5 text-muted-foreground" />
									<span>Warna Pakaian Terbaik untuk Kulitmu:</span>
								</div>
								<div class="flex flex-wrap gap-2">
									{#each guide.photoAnalysis.recommendedOutfitColors as color}
										<span class="inline-flex items-center rounded-lg border border-border/70 bg-stone-50 dark:bg-stone-900/40 px-2.5 py-1 text-xs font-normal text-foreground">
											{color}
										</span>
									{/each}
								</div>
							</div>
						</div>
					{/if}

					<!-- Prinsip Panduan -->
					<div class="rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-6 sm:p-8">
						<h2 class="font-serif text-xl font-normal text-foreground mb-6">
							4 Aturan Esensial Capsule Wardrobe
						</h2>
						<div class="grid gap-4 sm:grid-cols-2">
							<div class="flex items-start gap-3.5 rounded-lg border border-border/70 bg-card p-4">
								<span class="font-mono text-xs font-medium text-muted-foreground mt-0.5 shrink-0">
									01
								</span>
								<div>
									<h3 class="text-sm font-medium text-foreground">Kombinasi 3 Warna Maksimal</h3>
									<p class="text-xs text-muted-foreground mt-1 leading-relaxed font-normal">
										Gunakan 2 warna dasar netral ditambah 1 warna aksen lembut untuk menjaga siluet tetap bersih dan rapi.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3.5 rounded-lg border border-border/70 bg-card p-4">
								<span class="font-mono text-xs font-medium text-muted-foreground mt-0.5 shrink-0">
									02
								</span>
								<div>
									<h3 class="text-sm font-medium text-foreground">Seimbangkan Volume Potongan</h3>
									<p class="text-xs text-muted-foreground mt-1 leading-relaxed font-normal">
										Jika atasanmu relaxed atau bervolume, padukan dengan bawahan berpotongan lurus (straight fit) atau sebaliknya.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3.5 rounded-lg border border-border/70 bg-card p-4">
								<span class="font-mono text-xs font-medium text-muted-foreground mt-0.5 shrink-0">
									03
								</span>
								<div>
									<h3 class="text-sm font-medium text-foreground">Sepatu Menentukan Formalitas</h3>
									<p class="text-xs text-muted-foreground mt-1 leading-relaxed font-normal">
										Ganti sneakers putihmu dengan loafers kulit atau mules untuk mengubah outfit santai menjadi siap meeting dalam sekejap.
									</p>
								</div>
							</div>

							<div class="flex items-start gap-3.5 rounded-lg border border-border/70 bg-card p-4">
								<span class="font-mono text-xs font-medium text-muted-foreground mt-0.5 shrink-0">
									04
								</span>
								<div>
									<h3 class="text-sm font-medium text-foreground">Cek Lemari Sebelum Belanja</h3>
									<p class="text-xs text-muted-foreground mt-1 leading-relaxed font-normal">
										Gunakan tab Daftar Belanja untuk mencentang item yang sudah kamu punya. Hindari membeli item baru bila belum dibutuhkan.
									</p>
								</div>
							</div>
						</div>
					</div>
				</Tabs.Content>

				<!-- 2. TAB WARNA PERSONAL -->
				<Tabs.Content value="warna" class="space-y-8">
					{#if guide.photoAnalysis}
						<div class="rounded-xl border border-border/80 bg-card p-6">
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
								<div class="flex items-center gap-3.5">
									<div
										class="size-11 rounded-full border border-black/10 shadow-sm shrink-0"
										style="background-color: {guide.photoAnalysis.skinHex};"
										title="Warna Kulit: {guide.photoAnalysis.skinHex}"
									></div>
									<div>
										<div class="flex items-center gap-2">
											<h3 class="font-serif text-base font-normal text-foreground">
												Warna Kulit Terdeteksi ({guide.photoAnalysis.skinHex})
											</h3>
											<span class="rounded-full border border-border/80 px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
												Analisis Foto
											</span>
										</div>
										<p class="text-xs text-muted-foreground mt-0.5 font-normal">
											Undertone: <strong class="text-foreground capitalize font-medium">{guide.photoAnalysis.undertone}</strong>.
											{#if guide.photoAnalysis.veinDescription}
												<span class="block text-[11px] text-muted-foreground/90 mt-0.5">• {guide.photoAnalysis.veinDescription}</span>
											{/if}
										</p>
									</div>
								</div>
							</div>
							<p class="mt-3 text-xs text-muted-foreground leading-relaxed font-normal">
								{guide.photoAnalysis.explanation}
							</p>
						</div>
					{/if}

					<div class="rounded-xl border border-border/80 bg-card p-6 sm:p-8">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6 mb-8">
							<div class="max-w-2xl">
								<div class="flex flex-wrap items-center gap-2 mb-2">
									<span class="inline-block rounded-full border border-border/80 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground capitalize">
										Undertone {guide.palette.undertone}
									</span>
									<span class="text-xs text-muted-foreground">Pilih variasi tone:</span>
								</div>
								<h2 class="font-serif text-2xl font-normal text-foreground">{guide.palette.name}</h2>
								<p class="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed font-normal">
									{guide.palette.description}
								</p>
							</div>

							<!-- Switcher Tone Interaktif (Warm, Cool, Neutral) -->
							<div class="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-border/70 shrink-0 self-start sm:self-auto">
								<button
									type="button"
									onclick={() => (activeUndertone = "hangat")}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all {activeUndertone === 'hangat' ? 'bg-background text-foreground shadow-xs font-bold border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Urat nadi kehijauan / nuansa warm & earth"
								>
									<SunIcon class="size-3.5 text-amber-500" />
									<span>Warm Tone</span>
								</button>
								<button
									type="button"
									onclick={() => (activeUndertone = "dingin")}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all {activeUndertone === 'dingin' ? 'bg-background text-foreground shadow-xs font-bold border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Urat nadi kebiruan / nuansa cool & slate"
								>
									<SnowflakeIcon class="size-3.5 text-sky-500" />
									<span>Cool Tone</span>
								</button>
								<button
									type="button"
									onclick={() => (activeUndertone = "netral")}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs transition-all {activeUndertone === 'netral' ? 'bg-background text-foreground shadow-xs font-bold border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Urat nadi campuran / neutral mineral"
								>
									<ScaleIcon class="size-3.5 text-emerald-500" />
									<span>Neutral Tone</span>
								</button>
							</div>
						</div>

						<!-- Warna Dasar (Base Colors) -->
						<div class="space-y-4 mb-8">
							<div class="flex items-center justify-between border-b border-border/60 pb-2">
								<span class="text-xs font-semibold uppercase tracking-wider text-foreground">
									Warna Dasar Netral (70–80% Porsi Pakaian)
								</span>
								<span class="text-xs text-muted-foreground">Fondasi utama lemari</span>
							</div>

							<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
								{#each guide.palette.baseColors as col}
									<div class="rounded-xl border border-border/80 bg-card p-3.5 transition-all hover:border-foreground/20">
										<div class="h-24 w-full rounded-lg border border-black/10 shadow-inner mb-3 flex items-end p-2.5" style="background-color: {col.hex};">
											<span class="rounded bg-black/50 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] text-white uppercase tracking-wider">
												{col.hex}
											</span>
										</div>
										<h4 class="text-xs font-semibold text-foreground">{col.name}</h4>
										<p class="mt-1 text-[11px] text-muted-foreground leading-relaxed font-normal">
											{col.description}
										</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Warna Aksen (Accent Colors) -->
						<div class="space-y-4 mb-8">
							<div class="flex items-center justify-between border-b border-border/60 pb-2">
								<span class="text-xs font-semibold uppercase tracking-wider text-foreground">
									Warna Aksen Pemikat (15–20% Porsi Pakaian)
								</span>
								<span class="text-xs text-muted-foreground">Untuk inner, knit, atau aksesori</span>
							</div>

							<div class="grid gap-4 sm:grid-cols-2">
								{#each guide.palette.accentColors as col}
									<div class="rounded-xl border border-border/80 bg-card p-3.5 transition-all hover:border-foreground/20">
										<div class="h-24 w-full rounded-lg border border-black/10 shadow-inner mb-3 flex items-end p-2.5" style="background-color: {col.hex};">
											<span class="rounded bg-black/50 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] text-white uppercase tracking-wider">
												{col.hex}
											</span>
										</div>
										<h4 class="text-xs font-semibold text-foreground">{col.name}</h4>
										<p class="mt-1 text-[11px] text-muted-foreground leading-relaxed font-normal">
											{col.description}
										</p>
									</div>
								{/each}
							</div>
						</div>

						<!-- Warna Dihindari (Avoid Colors) -->
						<div class="space-y-4">
							<div class="flex items-center justify-between border-b border-border/60 pb-2">
								<span class="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Warna yang Perlu Dihindari
								</span>
								<span class="text-xs text-muted-foreground">Dapat membuat tone kulit kusam</span>
							</div>

							<div class="grid gap-4 sm:grid-cols-2">
								{#each guide.palette.avoidColors as col}
									<div class="rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-3.5">
										<div class="h-20 w-full rounded-lg border border-black/10 shadow-inner mb-3 flex items-center justify-center relative overflow-hidden" style="background-color: {col.hex};">
											<span class="size-6 rounded-full bg-black/50 text-white flex items-center justify-center text-xs backdrop-blur-xs">✕</span>
											<span class="absolute bottom-2 left-2 rounded bg-black/50 backdrop-blur-xs px-2 py-0.5 font-mono text-[10px] text-white uppercase tracking-wider">
												{col.hex}
											</span>
										</div>
										<h4 class="text-xs font-semibold text-foreground">{col.name}</h4>
										<p class="mt-1 text-[11px] text-muted-foreground leading-relaxed font-normal">
											{col.description}
										</p>
									</div>
								{/each}
							</div>
						</div>
					</div>

					<!-- Tips Padu Padan Warna -->
					{#if guide.palette.stylePairingTips?.length}
						<div class="rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-6">
							<h3 class="font-serif text-lg font-normal text-foreground mb-3">Tips Harmonisasi Warna</h3>
							<ul class="space-y-2 text-xs sm:text-sm text-muted-foreground">
								{#each guide.palette.stylePairingTips as tip}
									<li class="flex items-start gap-2.5">
										<CheckCircleIcon class="size-4 text-muted-foreground mt-0.5 shrink-0" />
										<span class="font-normal">{tip}</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				</Tabs.Content>

				<!-- 3. TAB WARDROBE INTI -->
				<Tabs.Content value="wardrobe" class="space-y-8">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div>
							<h2 class="font-serif text-2xl font-normal text-foreground">Koleksi 12 Item Esensial</h2>
							<p class="text-xs sm:text-sm text-muted-foreground mt-0.5 font-normal">
								Semua item telah dikurasi agar saling cocok satu sama lain.
							</p>
						</div>
						<span class="rounded-full border border-border/80 bg-stone-50 dark:bg-stone-900/50 px-3 py-1 text-xs font-medium text-muted-foreground self-start">
							12 Item Lengkap
						</span>
					</div>

					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each guide.capsule as item (item.id)}
							<Card class="border-border/80 bg-card overflow-hidden transition-all duration-300 hover:border-foreground/30 flex flex-col justify-between rounded-xl">
								<div>
									<div class="aspect-4/3 bg-stone-50 dark:bg-stone-900/40 p-5 flex items-center justify-center border-b border-border/70 relative">
										<img
											src={item.imageUrl || `/images/placeholder/${item.id.startsWith("outer-1") ? "blazer" : item.id.startsWith("outer-2") ? "cardigan" : item.id.startsWith("top-1") ? "shirt" : item.id.startsWith("top-2") ? "blouse" : item.id.startsWith("top-3") ? "tshirt" : item.id.startsWith("top-4") ? "knitwear" : item.id.startsWith("bottom-1") ? "trousers" : item.id.startsWith("bottom-2") ? "denim" : item.id.startsWith("bottom-3") ? "chinos" : item.id.startsWith("shoes-1") ? "sneakers" : item.id.startsWith("shoes-2") ? "loafers" : "bag"}.svg`}
											alt={item.name}
											loading="lazy"
											class="max-h-36 w-auto object-contain transition-transform duration-300 hover:scale-105"
										/>
										<span class="absolute top-3 left-3 rounded border border-border/80 bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
											{item.category}
										</span>
										<span class="absolute top-3 right-3 text-[10px] font-mono text-muted-foreground bg-background/90 backdrop-blur-xs px-2.5 py-0.5 rounded border border-border/80">
											Versatilitas: {item.versatileScore}/10
										</span>
									</div>

									<CardHeader class="p-4 sm:p-5 pb-2">
										<CardTitle class="font-serif text-base font-normal text-foreground line-clamp-1">
											{item.name}
										</CardTitle>
										<div class="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
											<span>Rekomendasi Warna:</span>
											<span class="font-medium text-foreground">{item.color}</span>
										</div>
									</CardHeader>

									<CardContent class="p-4 sm:p-5 pt-1">
										<div class="rounded-lg bg-stone-50/60 dark:bg-stone-900/30 p-3 text-xs text-muted-foreground leading-relaxed border border-border/50 font-normal">
											<span class="font-medium text-foreground block mb-1">Panduan Fitting & Bahan:</span>
											{item.fitTips}
										</div>
									</CardContent>
								</div>

								<div class="border-t border-border/60 p-3 sm:p-3.5 bg-stone-50/40 dark:bg-stone-900/20 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
									<div class="flex flex-wrap gap-1 text-[10px] text-muted-foreground">
										{#each item.occasions as occ}
											<span class="rounded bg-background px-2 py-0.5 border border-border/70 capitalize font-normal text-[10px]">
												{occ}
											</span>
										{/each}
									</div>

									{#if item.affiliateUrl}
										<a
											href={item.affiliateUrl}
											target="_blank"
											rel="noopener noreferrer nofollow"
											class="inline-flex items-center justify-center gap-1.5 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 px-3 py-1.5 text-xs font-medium transition hover:opacity-90 active:scale-95 shrink-0"
											title="Beli {item.name} di Shopee"
										>
											<ShoppingBagIcon class="size-3" />
											<span>Beli di Shopee</span>
											<ExternalLinkIcon class="size-2.5 opacity-60" />
										</a>
									{/if}
								</div>
							</Card>
						{/each}
					</div>
				</Tabs.Content>

				<!-- 4. TAB OUTFIT & WARNA REKOMENDASI -->
				<Tabs.Content value="outfit" class="space-y-6">
					<!-- Rekomendasi Palet Warna & Switcher Tone Kulit Langsung -->
					<div class="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-xs space-y-4">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
							<div class="flex items-center gap-2.5">
								<div class="flex size-9 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-foreground border border-border/60 shrink-0">
									<PaletteIcon class="size-4.5" />
								</div>
								<div>
									<div class="flex flex-wrap items-center gap-2">
										<h3 class="font-serif text-base sm:text-lg font-bold text-foreground">
											{guide.palette.name}
										</h3>
										<span class="rounded-full border border-border/80 bg-secondary px-2.5 py-0.5 text-[10px] font-bold text-foreground capitalize">
											Undertone {guide.palette.undertone}
										</span>
									</div>
									<p class="text-xs text-muted-foreground mt-0.5 font-normal">
										{guide.palette.description}
									</p>
								</div>
							</div>

							<!-- Switcher Tone Interaktif (Warm, Cool, Neutral) -->
							<div class="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800/80 border border-border/70 shrink-0 self-start sm:self-auto">
								<button
									type="button"
									onclick={() => (activeUndertone = "hangat")}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all {activeUndertone === 'hangat' ? 'bg-background text-foreground shadow-xs font-bold border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Urat nadi kehijauan / nuansa warm & earth"
								>
									<SunIcon class="size-3 text-amber-500" />
									<span>Warm Tone</span>
								</button>
								<button
									type="button"
									onclick={() => (activeUndertone = "dingin")}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all {activeUndertone === 'dingin' ? 'bg-background text-foreground shadow-xs font-bold border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Urat nadi kebiruan / nuansa cool & slate"
								>
									<SnowflakeIcon class="size-3 text-sky-500" />
									<span>Cool Tone</span>
								</button>
								<button
									type="button"
									onclick={() => (activeUndertone = "netral")}
									class="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs transition-all {activeUndertone === 'netral' ? 'bg-background text-foreground shadow-xs font-bold border border-border/60' : 'text-stone-700 dark:text-stone-300 hover:text-foreground font-medium'}"
									title="Urat nadi campuran / neutral mineral"
								>
									<ScaleIcon class="size-3 text-emerald-500" />
									<span>Neutral Tone</span>
								</button>
							</div>
						</div>

						<!-- Grid 6 Swatches (4 Base + 2 Accent) -->
						<div class="space-y-2">
							<div class="flex items-center justify-between text-xs">
								<span class="font-semibold text-foreground uppercase tracking-wider text-[11px]">Warna Harmonisasi Pakaian</span>
								<span class="text-muted-foreground text-[11px]">4 Netral Dasar + 2 Aksen Kunci</span>
							</div>
							<div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
								{#each guide.palette.baseColors as col}
									<div class="group relative flex flex-col items-center rounded-xl border border-border/70 bg-stone-50 dark:bg-stone-900/40 p-2 text-center transition-all hover:border-foreground/30 hover:bg-stone-100 dark:hover:bg-stone-800">
										<span
											class="size-7 sm:size-8 rounded-lg border border-black/15 dark:border-white/20 shadow-2xs shrink-0 transition-transform group-hover:scale-105"
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
								{#each guide.palette.accentColors as col}
									<div class="group relative flex flex-col items-center rounded-xl border border-primary/30 bg-primary/5 p-2 text-center transition-all hover:border-primary/50">
										<span
											class="size-7 sm:size-8 rounded-lg border border-black/15 dark:border-white/20 shadow-2xs shrink-0 transition-transform group-hover:scale-105"
											style="background-color: {col.hex}"
										></span>
										<span class="mt-1.5 text-[10px] font-bold text-foreground truncate w-full" title="Aksen: {col.name}">
											{col.name}
										</span>
										<span class="text-[9px] font-mono text-primary font-semibold">
											Aksen
										</span>
									</div>
								{/each}
							</div>
						</div>

						<!-- Avoid Colors Warning Bar -->
						{#if guide.palette.avoidColors?.length}
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl bg-amber-500/10 border border-amber-500/20 px-3.5 py-2 text-xs text-amber-950 dark:text-amber-200">
								<div class="flex items-center gap-2 flex-wrap">
									<AlertTriangleIcon class="size-3.5 text-amber-600 shrink-0" />
									<span class="font-semibold">Hindari warna yang menabrak kulit:</span>
									<div class="flex items-center gap-1.5 flex-wrap">
										{#each guide.palette.avoidColors as col}
											<span class="inline-flex items-center gap-1 rounded bg-background/90 px-2 py-0.5 text-[10px] font-medium border border-border/80">
												<span class="size-1.5 rounded-full" style="background-color: {col.hex}"></span>
												<span class="line-through">{col.name}</span>
											</span>
										{/each}
									</div>
								</div>
								<span class="text-[10px] text-muted-foreground self-end sm:self-auto italic">
									Warna lookbook di bawah otomatis diselaraskan dengan tone {activeUndertone}.
								</span>
							</div>
						{/if}
					</div>

					<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pt-2">
						<div>
							<h2 class="font-serif text-2xl font-normal text-foreground">Katalog {guide.outfits.length} Kombinasi Look</h2>
							<p class="text-xs sm:text-sm text-muted-foreground mt-0.5 font-normal">
								Pilih filter situasi untuk menemukan inspirasi outfit harianmu secara instan.
							</p>
						</div>
					</div>

					{#if guide.photoAnalysis}
						<div class="flex items-center gap-3.5 rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-4 text-xs">
							<div class="flex size-8 shrink-0 items-center justify-center rounded-lg border border-border bg-card text-foreground">
								<CameraIcon class="size-3.5" />
							</div>
							<div>
								<div class="flex items-center gap-2">
									<span class="font-medium text-foreground">Rekomendasi Berdasarkan Tone Kulitmu</span>
									<span class="rounded border border-border/70 px-1.5 py-0.2 text-[10px] font-mono text-muted-foreground">
										{guide.photoAnalysis.skinHex}
									</span>
								</div>
								<p class="text-muted-foreground mt-0.5 leading-relaxed font-normal">
									Kombinasi look di bawah mengutamakan palet {guide.photoAnalysis.recommendedOutfitColors.slice(0, 3).join(", ")} yang serasi dengan karakter undertone kulitmu.
								</p>
							</div>
						</div>
					{/if}

					<!-- Filter Situasi -->
					<div class="flex flex-wrap gap-2 pb-2 border-b border-border/70 no-print">
						{#each occasionFilters as f}
							<button
								type="button"
								onclick={() => (selectedOccasion = f.id)}
								class="rounded-full px-3.5 py-1.5 text-xs transition-all {selectedOccasion === f.id ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-medium' : 'bg-stone-100/80 dark:bg-stone-800/60 text-muted-foreground hover:text-foreground font-normal'}"
							>
								{f.label}
							</button>
						{/each}
					</div>

					<div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
						{#each filteredOutfits as outfit, idx (outfit.id)}
							{@const currentImage = aiImages[outfit.id] || outfit.imageUrl || `/images/looks/${outfit.id}.svg`}
							<Card class="border-border/80 bg-card overflow-hidden transition-all duration-300 hover:border-foreground/30 flex flex-col justify-between rounded-xl group">
								<div>
									{#if currentImage}
										<div class="relative h-52 sm:h-56 w-full overflow-hidden bg-stone-50 dark:bg-stone-900/40 border-b border-border/70">
											<img
												src={currentImage}
												alt={outfit.name}
												class="h-full w-full {aiImages[outfit.id] ? 'object-cover' : 'object-contain p-2'} transition-transform duration-500 group-hover:scale-102"
												loading="lazy"
											/>

											<!-- Badges di atas gambar -->
											<div class="absolute top-2.5 left-2.5">
												<span class="rounded border border-border/80 bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
													{outfit.occasionLabel}
												</span>
											</div>

											<div class="absolute top-2.5 right-2.5">
												<span class="rounded border border-border/80 bg-background/90 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
													#{idx + 1}
												</span>
											</div>

											{#if aiImages[outfit.id]}
												<span class="absolute bottom-2.5 left-2.5 rounded-full border border-border/80 bg-background/90 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-medium text-foreground shadow-2xs">
													Visualisasi Terpasang
												</span>
											{/if}
										</div>
									{/if}

									<CardHeader class="p-4 sm:p-5 pb-2">
										<div class="flex items-start justify-between gap-2">
											<CardTitle class="font-serif text-lg font-normal text-foreground">
												{outfit.name}
											</CardTitle>

											<!-- Tombol Generate Visualisasi Foto (Google Gemini) -->
											<button
												type="button"
												onclick={() => triggerTryOn(outfit.id)}
												disabled={isGeneratingOutfitId === outfit.id}
												class="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border/80 bg-background hover:bg-stone-100 dark:hover:bg-stone-800 px-3 py-1 text-[11px] font-medium text-foreground transition active:scale-95 disabled:opacity-50"
												title="Simulasi visual foto look dikenakan"
											>
												{#if isGeneratingOutfitId === outfit.id}
													<Loader2Icon class="size-3 animate-spin text-muted-foreground" />
													<span>Merender...</span>
												{:else}
													<CameraIcon class="size-3 text-muted-foreground" />
													<span>{aiImages[outfit.id] ? "Simulasi Ulang" : "Simulasi Dipakai"}</span>
												{/if}
											</button>
										</div>

										<div class="rounded-lg bg-stone-50/70 dark:bg-stone-900/40 p-2.5 text-xs font-normal text-foreground mt-2 border border-border/50">
											{outfit.formula}
										</div>
									</CardHeader>

									<CardContent class="p-4 sm:p-5 pt-2 space-y-3">
										<div>
											<span class="text-[10px] font-semibold uppercase text-muted-foreground tracking-wider block mb-2">
												Item Produk yang Dipakai:
											</span>
											<ul class="space-y-1.5">
												{#if outfit.items}
													{#each outfit.items as it}
														<li class="flex items-center justify-between gap-2.5 rounded-lg border border-border/70 bg-stone-50/40 dark:bg-stone-900/20 p-2 text-xs transition-colors hover:bg-stone-50 dark:hover:bg-stone-900/40">
															<div class="flex items-center gap-2.5 min-w-0">
																<!-- Thumbnail Foto Produk Pakaian -->
																<div class="size-8 rounded-md border border-border/80 bg-background overflow-hidden shrink-0 flex items-center justify-center">
																	{#if it.imageUrl}
																		<img src={it.imageUrl} alt={it.name} class="size-full object-contain p-0.5" loading="lazy" />
																	{:else}
																		<ShirtIcon class="size-3.5 text-muted-foreground/40" />
																	{/if}
																</div>
																<span class="font-medium text-foreground truncate text-xs">{it.name}</span>
															</div>

															{#if it.affiliateUrl}
																<a
																	href={it.affiliateUrl}
																	target="_blank"
																	rel="noopener noreferrer nofollow"
																	class="inline-flex shrink-0 items-center gap-1 rounded-md border border-border/80 bg-background hover:bg-stone-100 dark:hover:bg-stone-800 px-2.5 py-1 text-[10px] font-medium text-foreground transition active:scale-95"
																	title="Beli {it.name} di Shopee"
																>
																	<span>Beli</span>
																	<ExternalLinkIcon class="size-2 opacity-60" />
																</a>
															{/if}
														</li>
													{/each}
												{/if}
											</ul>
										</div>

										<div class="rounded-lg border border-border/60 bg-stone-50/30 dark:bg-stone-900/10 p-3 text-xs text-muted-foreground italic leading-relaxed border-l-2 border-l-foreground/30 font-normal">
											"{outfit.styleTips}"
										</div>
									</CardContent>
								</div>

								<!-- Tombol Belanja Shopee untuk Keseluruhan Look -->
								{#if outfit.affiliateUrl}
									<div class="p-4 sm:p-5 pt-0 mt-2">
										<a
											href={outfit.affiliateUrl}
											target="_blank"
											rel="noopener noreferrer nofollow"
											class="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-stone-900 dark:bg-stone-100 text-stone-50 dark:text-stone-900 px-4 py-2.5 text-xs font-medium transition hover:opacity-90 active:scale-98"
										>
											<ShoppingBagIcon class="size-3.5" />
											<span>Beli 1 Set Look di Shopee</span>
											<ExternalLinkIcon class="size-3 opacity-60" />
										</a>
									</div>
								{/if}
							</Card>
						{/each}
					</div>

					<!-- Disclaimer Afiliasi di Outfit -->
					<div class="mt-6 rounded-lg border border-border/70 bg-stone-50/40 dark:bg-stone-900/20 p-4 text-xs text-muted-foreground flex items-start gap-3">
						<InfoIcon class="size-4 shrink-0 mt-0.5 text-muted-foreground" />
						<p class="leading-relaxed font-normal">
							{data.affiliateSettings?.affiliate_disclaimer || "Tautan belanja di atas terhubung ke mitra resmi Shopee Affiliate. Membeli melalui tautan ini membantu menjaga layanan reedoing 100% gratis tanpa biaya ekstra untukmu."}
						</p>
					</div>
				</Tabs.Content>

				<!-- 5. TAB DAFTAR BELANJA -->
				<Tabs.Content value="belanja" class="space-y-8">
					<div class="rounded-xl border border-border/80 bg-card p-6 sm:p-8">
						<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/70 pb-6">
							<div>
								<h2 class="font-serif text-2xl font-normal text-foreground">Daftar Belanja Prioritas</h2>
								<p class="text-xs sm:text-sm text-muted-foreground mt-0.5 font-normal">
									Centang item yang sudah kamu miliki di lemari untuk mengetahui item mana yang perlu dibeli selanjutnya.
								</p>
							</div>

							<div class="flex items-center gap-3 no-print">
								<Button
									variant="outline"
									size="sm"
									onclick={handlePrint}
									class="gap-1.5 font-medium text-xs rounded-lg border-border/80 text-foreground hover:bg-muted"
								>
									<PrinterIcon class="size-3.5 text-muted-foreground" />
									<span>Cetak / Simpan PDF</span>
								</Button>
							</div>
						</div>

						<!-- Progress Kepemilikan -->
						<div class="mt-6 rounded-lg border border-border/70 bg-stone-50/50 dark:bg-stone-900/30 p-4">
							<div class="flex items-center justify-between text-xs font-medium text-foreground mb-2">
								<span>Kesiapan Capsule Wardrobemu:</span>
								<span class="font-mono text-muted-foreground">{ownedCount} dari {totalItemsCount} Item ({ownedPercentage}%)</span>
							</div>
							<Progress value={ownedPercentage} class="h-1.5 w-full bg-stone-100 dark:bg-stone-800" />
							<p class="mt-2 text-[11px] text-muted-foreground font-normal">
								Status centang tersimpan otomatis di perangkat dan server pribadimu.
							</p>
						</div>

						<!-- Daftar Checklist Belanja -->
						<div class="mt-6 divide-y divide-border/60">
							{#each guide.shopping as item (item.id)}
								{@const isChecked = Boolean(shoppingChecks[item.id])}
								<div class="flex items-start sm:items-center justify-between gap-4 py-4 transition-colors {isChecked ? 'opacity-50' : ''}">
									<div class="flex items-start gap-3.5 flex-1">
										<button
											type="button"
											onclick={() => handleToggleCheck(item.id)}
											class="flex size-5 shrink-0 items-center justify-center rounded border transition-all mt-0.5 sm:mt-0 {isChecked ? 'border-foreground bg-foreground text-background' : 'border-border/80 bg-background hover:border-foreground/50'}"
											aria-label="Centang kepemilikan item"
										>
											{#if isChecked}
												<CheckIcon class="size-3.5 stroke-[2.5]" />
											{/if}
										</button>

										<!-- Foto Thumbnail Item Belanja -->
										<div class="size-10 rounded-md border border-border/70 bg-stone-50 dark:bg-stone-900/40 overflow-hidden shrink-0 flex items-center justify-center">
											{#if item.imageUrl}
												<img src={item.imageUrl} alt={item.name} class="size-full object-contain p-0.5" loading="lazy" />
											{:else}
												<ShirtIcon class="size-4 text-muted-foreground/30" />
											{/if}
										</div>

										<div class="flex-1 min-w-0">
											<div class="flex flex-wrap items-center gap-2">
												<span class="font-serif text-sm font-medium {isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}">
													{item.name}
												</span>
												<span class="rounded border border-border/80 px-1.5 py-0.2 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
													Prioritas {item.priority}
												</span>
												<span class="text-xs text-muted-foreground">
													· Warna: <strong class="font-medium text-foreground">{item.colorSuggestion}</strong>
												</span>
												{#if item.priceEstimate}
													<span class="text-[11px] font-mono text-muted-foreground bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded border border-border/70">
														{item.priceEstimate}
													</span>
												{/if}
											</div>

											<p class="text-xs text-muted-foreground mt-1 leading-relaxed font-normal">
												{item.reason}
											</p>
										</div>
									</div>

									<div class="text-right shrink-0 flex flex-col items-end gap-1.5">
										<span class="text-xs font-mono text-muted-foreground">
											{item.outfitCount} Look
										</span>

										{#if item.affiliateUrl}
											<a
												href={item.affiliateUrl}
												target="_blank"
												rel="noopener noreferrer nofollow"
												class="inline-flex items-center gap-1.5 rounded-md border border-border/80 bg-background hover:bg-stone-100 dark:hover:bg-stone-800 px-2.5 py-1 text-[11px] font-medium text-foreground transition active:scale-95"
											>
												<ShoppingBagIcon class="size-3 text-muted-foreground" />
												<span>Beli</span>
												<ExternalLinkIcon class="size-2 opacity-60" />
											</a>
										{/if}
									</div>
								</div>
							{/each}
						</div>

						<!-- Disclaimer Afiliasi di Belanja -->
						<div class="mt-8 rounded-lg border border-border/70 bg-stone-50/40 dark:bg-stone-900/20 p-4 text-xs text-muted-foreground flex items-start gap-3">
							<InfoIcon class="size-4 shrink-0 mt-0.5 text-muted-foreground" />
							<p class="leading-relaxed font-normal">
								{data.affiliateSettings?.affiliate_disclaimer || "Tautan belanja di atas terhubung ke toko resmi atau mitra Shopee Affiliate kami. Membeli melalui tautan ini membantu menjaga layanan reedoing tetap 100% gratis tanpa biaya tambahan bagimu."}
							</p>
						</div>
					</div>
				</Tabs.Content>
					</div>
				</div>
			</Tabs.Root>
		</div>
	</main>

	<!-- Hidden Form untuk toggle checklist -->
	<form
		bind:this={checkForm}
		action="?/toggleCheck"
		method="POST"
		use:enhance
		class="hidden"
	>
		<input type="hidden" name="itemId" value={currentCheckItem} />
		<input type="hidden" name="checked" value={currentCheckValue ? "true" : "false"} />
	</form>

	<!-- Hidden Form untuk generate AI Virtual Try-On -->
	<form
		bind:this={tryOnForm}
		action="?/generateTryOn"
		method="POST"
		use:enhance={() => {
			isGeneratingOutfitId = currentTryOnOutfitId;
			return async ({ result, update }) => {
				isGeneratingOutfitId = null;
				if (result.type === "success" && (result.data as any)?.imageUrl) {
					const outId = (result.data as any).outfitId;
					aiImages[outId] = (result.data as any).imageUrl;
					toast.success("Foto AI Try-On berhasil dibuat!", {
						description: "Visualisasi busana telah ditampilkan pada kartu look."
					});
				} else if (result.type === "failure") {
					toast.error("Gagal membuat gambar AI", {
						description: ((result.data as any)?.error as string) || "Kunci GEMINI_API_KEY belum valid atau kuota habis."
					});
				}
				await update({ reset: false });
			};
		}}
		class="hidden"
	>
		<input type="hidden" name="outfitId" value={currentTryOnOutfitId} />
	</form>

	<!-- Dialog Reset Style Check -->
	<Dialog.Root bind:open={isResetDialogOpen}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<Dialog.Title class="font-serif text-xl">Ulangi Style Check?</Dialog.Title>
				<Dialog.Description class="text-xs text-muted-foreground pt-1">
					Kamu akan diarahkan kembali ke pertanyaan awal untuk memilih preferensi baru. Panduan saat ini tetap bisa dibuka jika kamu menyimpan tautannya.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="mt-4 gap-2">
				<Button variant="outline" onclick={() => (isResetDialogOpen = false)}>
					Batal
				</Button>
				<Button href="/mulai" class="font-semibold">
					Mulai Ulang Sekarang
				</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>

	<!-- Dialog Hapus Data Saya -->
	<Dialog.Root bind:open={isDeleteDialogOpen}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<div class="flex size-10 items-center justify-center rounded-full bg-destructive/15 text-destructive mb-3">
					<AlertTriangleIcon class="size-5" />
				</div>
				<Dialog.Title class="font-serif text-xl text-destructive">Hapus Data Panduan Saya?</Dialog.Title>
				<Dialog.Description class="text-xs text-muted-foreground pt-1">
					Tindakan ini akan menghapus permanen data panduan, rekomendasi warna, dan status checklist belanja dari server. Sesi anonimmu juga akan dibersihkan.
				</Dialog.Description>
			</Dialog.Header>
			<Dialog.Footer class="mt-4 gap-2">
				<Button variant="outline" onclick={() => (isDeleteDialogOpen = false)}>
					Batal
				</Button>
				<form action="?/deleteData" method="POST">
					<Button type="submit" variant="destructive" class="font-semibold">
						Hapus Permanen
					</Button>
				</form>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

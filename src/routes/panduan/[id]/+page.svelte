<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import { siteConfig } from "$lib/config";
	import * as Dialog from "$lib/components/ui/dialog";
	import { Button } from "$lib/components/ui/button";
	import { Progress } from "$lib/components/ui/progress";
	import Pagination from "$lib/components/ui/pagination";

	import Share2Icon from "@lucide/svelte/icons/share-2";
	import PrinterIcon from "@lucide/svelte/icons/printer";
	import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import CheckIcon from "@lucide/svelte/icons/check";
	import ShoppingBagIcon from "@lucide/svelte/icons/shopping-bag";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import SnowflakeIcon from "@lucide/svelte/icons/snowflake";
	import ScaleIcon from "@lucide/svelte/icons/scale";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";
	import InfoIcon from "@lucide/svelte/icons/info";
	import AlertTriangleIcon from "@lucide/svelte/icons/alert-triangle";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import UploadCloudIcon from "@lucide/svelte/icons/upload-cloud";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import ChevronDownIcon from "@lucide/svelte/icons/chevron-down";
	import { toggleMode, mode } from "mode-watcher";

	import type { PageData } from "./$types";
	import type { Outfit, Undertone } from "$lib/types/style";

	let { data }: { data: PageData } = $props();

	// Panduan personal spesifik sesuai hasil kuis & foto pengguna
	let guide = $derived(data.result);
	let userTone = $derived<Undertone>(
		(guide?.palette?.undertone as Undertone) ||
		(data.userAnswers?.undertone as Undertone) ||
		"hangat"
	);
	let shoppingChecks = $state<Record<string, boolean>>({});

	$effect(() => {
		if (data.checks) {
			shoppingChecks = { ...data.checks };
		}
	});

	// Filter situasi outfit
	let selectedOccasion = $state<string>("semua");

	// Helper untuk mendapatkan kode hex warna pakaian
	function getColorHex(colorName: string): string {
		const lower = (colorName || "").toLowerCase();
		const allColors = [
			...(guide?.palette?.baseColors || []),
			...(guide?.palette?.accentColors || [])
		];
		const match = allColors.find(
			(c) =>
				lower.includes(c.name.toLowerCase()) ||
				c.name.toLowerCase().includes(lower)
		);
		if (match) return match.hex;

		if (lower.includes("broken white") || lower.includes("ecru") || lower.includes("gading")) return "#F9F6F0";
		if (lower.includes("pure white") || lower.includes("putih bersih") || lower.includes("crisp")) return "#FFFFFF";
		if (lower.includes("espresso") || lower.includes("cokelat") || lower.includes("brown")) return "#3D2B1F";
		if (lower.includes("navy") || lower.includes("biru gelap") || lower.includes("biru")) return "#1B2A47";
		if (lower.includes("charcoal") || lower.includes("arang") || lower.includes("dark grey")) return "#33383F";
		if (lower.includes("camel") || lower.includes("khaki") || lower.includes("oat")) return "#C2A27E";
		if (lower.includes("taupe") || lower.includes("smokey") || lower.includes("fog") || lower.includes("heather")) return "#CBD2D9";
		if (lower.includes("terracotta") || lower.includes("bata")) return "#B85D43";
		if (lower.includes("amber") || lower.includes("mustard") || lower.includes("gold")) return "#D49B4B";
		if (lower.includes("olive") || lower.includes("sage")) return "#4E5340";
		if (lower.includes("slate") || lower.includes("dusty blue")) return "#4D6B88";
		if (lower.includes("burgundy") || lower.includes("maroon") || lower.includes("merah")) return "#6B1D2F";
		if (lower.includes("black") || lower.includes("hitam")) return "#1A1A1A";
		if (lower.includes("denim") || lower.includes("indigo")) return "#2A3B5C";
		return "#7A828A";
	}

	// Data profil karakteristik Color Tone (Warm / Cool / Neutral)
	const colortoneProfiles: Record<Undertone, {
		title: string;
		badge: string;
		skinHex: string;
		vein: string;
		veinDesc: string;
		jewelry: string;
		clothingMood: string;
		contrastAdvice: string;
	}> = {
		hangat: {
			title: "Warm Earth & Golden Tone",
			badge: "Warm Tone",
			skinHex: "#D89F6B",
			vein: "Kehijauan (Greenish Veins)",
			veinDesc: "Pembuluh darah tampak kehijauan karena bias pigmen keemasan alami kulit.",
			jewelry: "Emas Kuning (Gold) & Rose Gold",
			clothingMood: "Nuansa bumi (earthy tones), broken white, cokelat espresso, camel, dan terracotta.",
			contrastAdvice: "Kontras sedang bernuansa hangat alami. Hindari warna icy pucat atau neon tajam."
		},
		dingin: {
			title: "Cool Slate & Jewel Tone",
			badge: "Cool Tone",
			skinHex: "#E2A794",
			vein: "Kebiruan / Ungu (Blue/Purple Veins)",
			veinDesc: "Pembuluh darah tampak jelas kebiruan di bawah kulit berspektrum sejuk alami.",
			jewelry: "Perak (Silver) & Platinum",
			clothingMood: "Kontras tegas, pure white, navy pekat, charcoal grey, dusty blue, dan burgundy.",
			contrastAdvice: "Kontras tegas (high contrast) membuat wajah tampak cerah berseri dan bersih."
		},
		netral: {
			title: "Neutral Mineral & Balanced Tone",
			badge: "Neutral Tone",
			skinHex: "#DFAC88",
			vein: "Campuran Hijau & Biru (Balanced Veins)",
			veinDesc: "Keseimbangan harmonis tanpa dominasi spektrum hangat atau dingin ekstrem.",
			jewelry: "Fleksibel: Emas maupun Perak",
			clothingMood: "Keseimbangan lembut: ecru white, midnight graphite, sage green, taupe, dan dusty rose.",
			contrastAdvice: "Kontras lembut seimbang (soft/medium contrast) memancarkan kesan anggun dan tenang."
		}
	};

	// State AI Try-On Image Generation (Google Gemini)
	let aiImages = $state<Record<string, string>>({});
	let isGeneratingOutfitId = $state<string | null>(null);
	let currentTryOnOutfitId = $state<string>("");
	let currentTryOnPhoto = $state<string>("");
	let tryOnForm: HTMLFormElement | undefined = $state();

	// Modal saran upload foto wajah sebelum try on
	let isPhotoPromptDialogOpen = $state(false);
	let pendingTryOnOutfitId = $state<string>("");
	let uploadedFacePhoto = $state<string | null>(null);
	let photoInputRef: HTMLInputElement | undefined = $state();

	$effect(() => {
		if (data.aiImages) {
			aiImages = { ...data.aiImages };
		}
	});

	function handleTryOnClick(outfitId: string) {
		const existingPhoto = uploadedFacePhoto || data.userAnswers?.photoBase64;
		if (existingPhoto) {
			// Sudah ada foto wajah, langsung jalankan simulasi AI
			triggerTryOn(outfitId, existingPhoto);
		} else {
			// Belum ada foto wajah: tampilkan rekomendasi upload foto terlebih dahulu
			pendingTryOnOutfitId = outfitId;
			isPhotoPromptDialogOpen = true;
		}
	}

	function handleFacePhotoSelected(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (!file) return;

		if (file.size > 5 * 1024 * 1024) {
			toast.error("Ukuran foto maksimal 5MB.");
			return;
		}

		const reader = new FileReader();
		reader.onload = (e) => {
			uploadedFacePhoto = e.target?.result as string;
			toast.success("Foto wajah berhasil dipilih!");
		};
		reader.readAsDataURL(file);
	}

	function confirmTryOnWithPhoto() {
		if (pendingTryOnOutfitId) {
			isPhotoPromptDialogOpen = false;
			triggerTryOn(pendingTryOnOutfitId, uploadedFacePhoto || undefined);
		}
	}

	function proceedTryOnWithoutPhoto() {
		if (pendingTryOnOutfitId) {
			isPhotoPromptDialogOpen = false;
			triggerTryOn(pendingTryOnOutfitId);
		}
	}

	function triggerTryOn(outfitId: string, photoBase64?: string) {
		currentTryOnOutfitId = outfitId;
		currentTryOnPhoto = photoBase64 || uploadedFacePhoto || data.userAnswers?.photoBase64 || "";
		setTimeout(() => {
			tryOnForm?.requestSubmit();
		}, 50);
	}

	// Dialog state
	let isDeleteDialogOpen = $state(false);

	// Hitung progres kepemilikan item belanja
	let ownedCount = $derived(
		Object.values(shoppingChecks).filter(Boolean).length
	);
	let totalItemsCount = $derived(guide?.capsule?.length || 12);
	let ownedPercentage = $derived(
		Math.round((ownedCount / totalItemsCount) * 100)
	);

	function matchesOccasion(outfitOccasion: string, filterId: string): boolean {
		if (!filterId || filterId === "semua") return true;
		const o = (outfitOccasion || "").toLowerCase().trim();
		const f = filterId.toLowerCase().trim();
		if (o === f) return true;
		if (f === "kantor" && (o === "kerja" || o.includes("kantor") || o.includes("kerja"))) return true;
		if (f === "kampus" && (o === "kuliah" || o.includes("kampus") || o.includes("kuliah"))) return true;
		if (f === "santai" && (o === "casual" || o.includes("santai") || o.includes("wfh"))) return true;
		if (f === "formal" && (o === "resmi" || o.includes("formal"))) return true;
		if (f === "meeting" && (o.includes("meet") || o.includes("klien"))) return true;
		if (f === "hangout" && (o.includes("hangout") || o.includes("weekend"))) return true;
		return false;
	}

	function selectOccasion(filterId: string) {
		selectedOccasion = filterId;
		outfitPage = 1;
	}

	function getOccasionCount(filterId: string): number {
		if (!guide?.outfits) return 0;
		if (filterId === "semua") return guide.outfits.length;
		return guide.outfits.filter((o: Outfit) => matchesOccasion(o.occasion, filterId)).length;
	}

	// Filter outfit sesuai situasi
	let filteredOutfits = $derived.by(() => {
		if (!guide?.outfits) return [];
		if (selectedOccasion === "semua") return guide.outfits;
		return guide.outfits.filter((o: Outfit) =>
			matchesOccasion(o.occasion, selectedOccasion)
		);
	});

	// Pagination outfit lookbook
	let outfitPage = $state(1);
	const outfitsPerPage = 6;
	let paginatedOutfits = $derived.by(() => {
		const total = filteredOutfits.length;
		const maxPage = Math.max(1, Math.ceil(total / outfitsPerPage));
		const currentPage = Math.min(Math.max(1, outfitPage), maxPage);
		const start = (currentPage - 1) * outfitsPerPage;
		return filteredOutfits.slice(start, start + outfitsPerPage);
	});

	function scrollToSection(sectionId: string) {
		if (typeof document !== "undefined") {
			const el = document.getElementById(sectionId);
			if (el) {
				el.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		}
	}

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
				description: "Bisa kamu simpan atau buka kembali kapan saja."
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
		{ id: "meeting", label: "Meeting" },
		{ id: "kampus", label: "Kuliah" },
		{ id: "hangout", label: "Hangout" },
		{ id: "santai", label: "Santai / WFH" },
		{ id: "formal", label: "Formal" }
	];
</script>

<svelte:head>
	<title>{guide.summary.headline} — {siteConfig.name}</title>
	<meta name="robots" content="noindex, nofollow" />
	<meta name="description" content="Panduan personal capsule wardrobe fungsional dan palet warna kulit." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col pb-20 antialiased selection:bg-stone-900 selection:text-white dark:selection:bg-stone-100 dark:selection:text-stone-900">
	<!-- TOP NAVIGATION BAR -->
	<header class="border-b border-border/70 bg-background/95 backdrop-blur-md sticky top-0 z-40 transition-colors no-print">
		<div class="mx-auto flex h-14 sm:h-16 max-w-4xl items-center justify-between px-3 sm:px-6">
			<!-- Brand -->
			<a href="/" class="group flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 sm:flex-initial mr-2 sm:mr-0">
				<div class="flex size-7 sm:size-8 items-center justify-center rounded-lg border border-border bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 transition-colors group-hover:border-foreground/30 shrink-0 shadow-2xs">
					<span class="font-serif text-xs sm:text-sm font-bold">R</span>
				</div>
				<div class="flex flex-col min-w-0">
					<span class="font-serif text-sm sm:text-base md:text-lg font-bold tracking-tight text-foreground leading-none truncate">
						{siteConfig.name}
					</span>
					<span class="hidden sm:inline text-[9px] tracking-widest uppercase font-semibold text-muted-foreground mt-0.5">
						Personal Lookbook
					</span>
				</div>
			</a>

			<!-- Actions -->
			<div class="flex items-center gap-1 sm:gap-1.5 shrink-0">
				<!-- Theme Toggle -->
				<button
					onclick={toggleMode}
					type="button"
					class="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border/80 text-foreground transition-all hover:bg-muted active:scale-95 shrink-0"
					aria-label="Ganti mode gelap/terang"
					title="Ganti mode gelap/terang"
				>
					{#if mode.current === "dark"}
						<SunIcon class="size-4 text-stone-200" />
					{:else}
						<MoonIcon class="size-4 text-stone-700" />
					{/if}
				</button>

				<!-- Bagikan -->
				<Button
					variant="outline"
					size="sm"
					onclick={copyGuideLink}
					class="gap-1.5 h-8 sm:h-9 px-2 sm:px-3 rounded-lg border-border/80 text-xs font-medium text-foreground hover:bg-muted active:scale-95 shrink-0"
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
					class="hidden md:inline-flex gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg border-border/80 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 shrink-0"
					title="Cetak atau simpan sebagai PDF"
				>
					<PrinterIcon class="size-3.5" />
					<span>Cetak</span>
				</Button>

				<!-- Check Baru -->
				<Button
					href="/mulai"
					size="sm"
					class="gap-1.5 h-8 sm:h-9 px-2 sm:px-3 rounded-lg text-xs font-medium bg-foreground text-background hover:opacity-90 active:scale-95 shadow-none shrink-0"
					title="Mulai Style Check baru"
				>
					<RotateCcwIcon class="size-3.5" />
					<span class="hidden sm:inline">Check Baru</span>
				</Button>

				<!-- Hapus Data -->
				<button
					type="button"
					onclick={() => (isDeleteDialogOpen = true)}
					class="inline-flex size-8 sm:size-9 items-center justify-center rounded-lg border border-border/70 text-muted-foreground transition-all hover:text-destructive hover:bg-destructive/10 active:scale-95 shrink-0"
					title="Hapus data panduan saya"
				>
					<Trash2Icon class="size-3.5" />
				</button>
			</div>
		</div>
	</header>

	<main class="flex-1 py-5 sm:py-10">
		<div class="mx-auto max-w-4xl px-3.5 sm:px-6 space-y-6 sm:space-y-12">

			<!-- 1. HERO SUMMARY SECTION (Sederhana, Bersih, Personal) -->
			<section class="space-y-3.5 sm:space-y-4">
				<div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
					<span class="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-stone-100/90 dark:bg-stone-800/80 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-foreground shrink-0">
						<span class="size-1.5 rounded-full bg-emerald-500"></span>
						<span>Panduan Personal</span>
					</span>
					<span class="rounded-full border border-border/70 bg-stone-50 dark:bg-stone-900/50 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-medium text-muted-foreground capitalize shrink-0">
						{guide.summary.genderDesc}
					</span>
					{#if guide.photoAnalysis}
						<span class="inline-flex items-center gap-1 rounded-full border border-border/70 bg-stone-50 dark:bg-stone-900/50 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-mono text-muted-foreground shrink-0">
							<span class="size-2 sm:size-2.5 rounded-full border border-black/20 shrink-0" style="background-color: {guide.photoAnalysis.skinHex}"></span>
							<span>{guide.photoAnalysis.skinHex}</span>
						</span>
					{/if}
				</div>

				<h1 class="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-foreground tracking-tight leading-tight">
					{guide.summary.headline}
				</h1>
				<p class="text-xs sm:text-base text-muted-foreground max-w-2xl leading-relaxed font-normal">
					{guide.summary.subheadline}
				</p>

				<!-- KARTU HASIL ANALISIS TONE KULIT DARI FOTO -->
				<div class="pt-2">
					<div class="rounded-2xl border border-border/80 bg-stone-50/70 dark:bg-stone-900/40 p-3.5 sm:p-5 shadow-2xs">
						<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
							<div class="flex items-center gap-3 sm:gap-3.5 min-w-0">
								{#if data.userAnswers?.photoBase64}
									<div class="size-13 sm:size-14 rounded-xl overflow-hidden border border-border/80 shrink-0 shadow-2xs bg-stone-100 dark:bg-stone-800">
										<img
											src={data.userAnswers.photoBase64}
											alt="Foto Wajah Analisis"
											class="size-full object-cover"
										/>
									</div>
								{:else}
									<div class="size-11 sm:size-12 rounded-xl border border-border/80 bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-muted-foreground shrink-0 shadow-2xs">
										<CameraIcon class="size-5" />
									</div>
								{/if}
								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-2 flex-wrap">
										<span class="text-xs sm:text-sm font-bold text-foreground">
											{colortoneProfiles[userTone]?.title || `Tone ${userTone}`}
										</span>
										<span class="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
											<span
												class="size-2 rounded-full border border-black/20 shrink-0"
												style="background-color: {guide.photoAnalysis?.skinHex || colortoneProfiles[userTone]?.skinHex}"
											></span>
											<span>{guide.photoAnalysis?.skinHex || colortoneProfiles[userTone]?.skinHex}</span>
										</span>
									</div>
									<div class="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
										{colortoneProfiles[userTone]?.contrastAdvice}
									</div>
								</div>
							</div>

							<!-- Detail Karakteristik Spektrum & Aksesori -->
							<div class="flex items-center gap-2 sm:gap-2.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/60 text-[11px] text-muted-foreground shrink-0 flex-wrap sm:flex-nowrap">
								<div class="rounded-lg bg-background/80 px-2.5 py-1 border border-border/60">
									<span class="font-semibold text-foreground">Aksesori:</span>
									<span class="ml-1">{colortoneProfiles[userTone]?.jewelry.split('&')[0].trim()}</span>
								</div>
								<div class="rounded-lg bg-background/80 px-2.5 py-1 border border-border/60">
									<span class="font-semibold text-foreground">Spektrum:</span>
									<span class="ml-1 capitalize">{userTone} Tone</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- 2. SECTION: PALET WARNA REKOMENDASI -->
			<section id="section-warna" class="rounded-2xl border border-border/80 bg-card p-4 sm:p-7 shadow-xs space-y-4">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
					<div>
						<h2 class="font-serif text-xl sm:text-2xl font-normal text-foreground">Palet Warna Personal</h2>
						<p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
							Warna terbaik yang menyatu alami dengan tone kulitmu ({colortoneProfiles[userTone]?.title}).
						</p>
					</div>
					<span class="self-start sm:self-auto shrink-0 rounded-full border border-border/70 bg-stone-50 dark:bg-stone-900/50 px-2.5 py-0.5 text-xs font-semibold text-foreground capitalize">
						Undertone {guide.palette.undertone}
					</span>
				</div>

				<!-- 4 Warna Dasar Netral -->
				<div class="space-y-2">
					<span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
						Warna Dasar Netral (70–80% Porsi Pakaian)
					</span>
					<div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
						{#each guide.palette.baseColors as col}
							<div class="rounded-xl border border-border/70 bg-stone-50/50 dark:bg-stone-900/30 p-2 sm:p-3 flex items-center gap-2 sm:gap-2.5 shadow-2xs min-w-0">
								<span class="size-7 sm:size-8 rounded-lg border border-black/15 shrink-0 shadow-2xs" style="background-color: {col.hex}"></span>
								<div class="min-w-0 flex-1">
									<div class="text-xs font-semibold text-foreground truncate">{col.name}</div>
									<div class="text-[10px] font-mono text-muted-foreground uppercase">{col.hex}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- 2 Warna Aksen Pemikat -->
				<div class="space-y-2 pt-1">
					<span class="text-[11px] sm:text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
						Warna Aksen Pemikat (15–20% Porsi Pakaian)
					</span>
					<div class="grid grid-cols-2 gap-2 sm:gap-3">
						{#each guide.palette.accentColors as col}
							<div class="rounded-xl border border-primary/30 bg-primary/5 p-2 sm:p-3 flex items-center gap-2 sm:gap-2.5 shadow-2xs min-w-0">
								<span class="size-7 sm:size-8 rounded-lg border border-black/15 shrink-0 shadow-2xs" style="background-color: {col.hex}"></span>
								<div class="min-w-0 flex-1">
									<div class="text-xs font-semibold text-foreground truncate">{col.name}</div>
									<div class="text-[10px] font-mono text-muted-foreground uppercase">{col.hex}</div>
								</div>
							</div>
						{/each}
					</div>
				</div>

				<!-- Warna yang Perlu Dihindari -->
				{#if guide.palette.avoidColors?.length}
					<div class="pt-2.5 border-t border-border/50 flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs">
						<span class="text-destructive font-semibold text-[11px] sm:text-xs shrink-0">✕ Hindari:</span>
						{#each guide.palette.avoidColors as col}
							<span class="inline-flex items-center gap-1.5 rounded-full border border-destructive/20 bg-destructive/5 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs text-foreground shrink-0">
								<span class="size-2 rounded-full border border-black/20 shrink-0" style="background-color: {col.hex}"></span>
								<span>{col.name}</span>
							</span>
						{/each}
					</div>
				{/if}
			</section>

			<!-- 3. SECTION: INSPIRASI LOOK & OUTFIT -->
			<section id="section-lookbook" class="space-y-4 sm:space-y-5">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
					<div>
						<h2 class="font-serif text-2xl sm:text-3xl font-normal text-foreground">Inspirasi Look Outfit</h2>
						<p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
							Paduan busana siap pakai yang dirancang sesuai bentuk tubuh dan palet warnamu.
						</p>
					</div>

					<!-- Filter Situasi Minimalis (Dropdown Bersih & Responsif di Semua Layar HP) -->
					<div class="flex items-center gap-2 self-start sm:self-auto shrink-0">
						<label for="occasion-filter" class="text-xs text-muted-foreground font-medium shrink-0">
							Kategori:
						</label>
						<div class="relative">
							<select
								id="occasion-filter"
								bind:value={selectedOccasion}
								onchange={() => (outfitPage = 1)}
								class="appearance-none rounded-xl border border-border/80 bg-stone-100/90 dark:bg-stone-800/90 pl-3 pr-8 py-1.5 text-xs font-semibold text-foreground hover:bg-stone-200/80 dark:hover:bg-stone-700/80 transition-all cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-foreground shadow-2xs"
							>
								{#each occasionFilters as f}
									<option value={f.id}>
										{f.label} ({getOccasionCount(f.id)})
									</option>
								{/each}
							</select>
							<ChevronDownIcon class="size-3.5 text-muted-foreground absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
						</div>
					</div>
				</div>

				<!-- Grid Kartu Lookbook atau Empty State -->
				{#if paginatedOutfits.length === 0}
					<div class="rounded-2xl border border-dashed border-border/80 bg-card p-8 sm:p-10 text-center space-y-3">
						<div class="flex size-12 mx-auto items-center justify-center rounded-2xl bg-stone-100 dark:bg-stone-800 text-muted-foreground">
							<SparklesIcon class="size-6" />
						</div>
						<div>
							<h3 class="font-serif text-base sm:text-lg font-semibold text-foreground">Belum ada look untuk kategori ini</h3>
							<p class="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
								Kamu bisa menjelajahi kategori look lainnya seperti Kerja Kantor, Kuliah, atau Semua Look.
							</p>
						</div>
						<button
							type="button"
							onclick={() => selectOccasion("semua")}
							class="inline-flex items-center gap-1.5 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 px-4 py-2 text-xs font-semibold hover:opacity-90 transition active:scale-95 shadow-xs"
						>
							<SparklesIcon class="size-3.5" />
							<span>Tampilkan Semua Look</span>
						</button>
					</div>
				{:else}
					<div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
						{#each paginatedOutfits as outfit, idx (outfit.id)}
							{@const currentImage = aiImages[outfit.id] || outfit.imageUrl || `/images/real/looks/${outfit.id}.jpg`}
							<div class="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs flex flex-col justify-between transition-all hover:border-foreground/20">
								<div>
									<!-- Foto Lookbook -->
									<div class="relative h-60 sm:h-72 w-full overflow-hidden bg-stone-100 dark:bg-stone-800 border-b border-border/70">
										<img
											src={currentImage}
											alt={outfit.name}
											class="h-full w-full object-cover transition-transform duration-500 hover:scale-102"
											loading="lazy"
										/>
										<span class="absolute top-2.5 left-2.5 rounded-lg border border-border/80 bg-background/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground shadow-2xs">
											{outfit.occasionLabel}
										</span>
										<span class="absolute top-2.5 right-2.5 rounded-lg border border-border/80 bg-background/95 backdrop-blur-xs px-2 py-0.5 text-[10px] font-mono font-semibold text-muted-foreground shadow-2xs">
											#{(outfitPage - 1) * outfitsPerPage + idx + 1}
										</span>
										{#if aiImages[outfit.id]}
											<span class="absolute bottom-2.5 left-2.5 rounded-full border border-border/80 bg-background/95 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-semibold text-foreground shadow-2xs">
												✨ Visualisasi AI Terpasang
											</span>
										{/if}
									</div>

									<!-- Info Lookbook -->
									<div class="p-3.5 sm:p-5 space-y-3">
										<div class="flex items-start justify-between gap-2">
											<h3 class="min-w-0 flex-1 font-serif text-base sm:text-lg font-semibold text-foreground leading-snug">
												{outfit.name}
											</h3>

											<!-- AI Virtual Try-On Button -->
											<button
												type="button"
												onclick={() => handleTryOnClick(outfit.id)}
												disabled={isGeneratingOutfitId === outfit.id}
												class="inline-flex shrink-0 items-center gap-1 rounded-full border border-border/80 bg-background hover:bg-stone-100 dark:hover:bg-stone-800 px-2.5 py-1 text-[11px] sm:text-xs font-medium text-foreground transition active:scale-95 disabled:opacity-50"
												title="Simulasi AI foto look saat dikenakan (disarankan dengan foto wajah)"
											>
												{#if isGeneratingOutfitId === outfit.id}
													<Loader2Icon class="size-3 animate-spin text-muted-foreground" />
													<span>Merender...</span>
												{:else}
													<CameraIcon class="size-3 text-muted-foreground" />
													<span>{aiImages[outfit.id] ? "Simulasi Ulang" : "AI Try-On"}</span>
												{/if}
											</button>
										</div>

										<div class="rounded-xl bg-stone-50/80 dark:bg-stone-900/50 p-2 sm:p-2.5 text-xs text-foreground border border-border/50">
											<span class="font-semibold text-muted-foreground block text-[10px] uppercase tracking-wider mb-0.5">Formula:</span>
											<p class="leading-relaxed">{outfit.formula}</p>
										</div>

										<!-- Style Tip Singkat -->
										<p class="text-xs text-muted-foreground italic leading-relaxed">
											"{outfit.styleTips}"
										</p>

										<!-- DAFTAR ITEM DENGAN TOMBOL BELANJA INDIVIDUAL -->
										<div class="pt-2 border-t border-border/50 space-y-2">
											<span class="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground block">
												Item Produk & Rekomendasi:
											</span>
											<ul class="space-y-1.5 sm:space-y-2">
												{#each outfit.items as it}
													<li class="flex items-center justify-between gap-2 rounded-xl border border-border/70 bg-stone-50/50 dark:bg-stone-900/30 p-2 sm:p-2.5 text-xs transition-colors hover:bg-stone-100/60 dark:hover:bg-stone-800/50">
														<div class="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
															<div class="size-9 sm:size-10 rounded-lg border border-border/80 bg-background overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
																<img
																	src={it.imageUrl || `/images/real/items/${it.id.startsWith("outer-1") ? "blazer" : it.id.startsWith("outer-2") ? "cardigan" : it.id.startsWith("top-1") ? "shirt" : it.id.startsWith("top-2") ? "blouse" : it.id.startsWith("top-3") ? "tshirt" : it.id.startsWith("top-4") ? "knitwear" : it.id.startsWith("bottom-1") ? "trousers" : it.id.startsWith("bottom-2") ? "denim" : it.id.startsWith("bottom-3") ? "chinos" : it.id.startsWith("shoes-1") ? "sneakers" : it.id.startsWith("shoes-2") ? "loafers" : "bag"}.jpg`}
																	alt={it.name}
																	class="size-full object-cover"
																	loading="lazy"
																/>
															</div>
															<div class="min-w-0 flex-1">
																<div class="flex items-center gap-1.5 min-w-0">
																	<span class="font-medium text-foreground text-xs leading-snug truncate">{it.name}</span>
																	<span class="rounded bg-muted px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground shrink-0">
																		{it.category}
																	</span>
																</div>
																<div class="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground truncate">
																	<span class="size-2 rounded-full border border-black/15 shrink-0" style="background-color: {getColorHex(it.color)}"></span>
																	<span class="truncate">{it.color || 'Netral'}</span>
																	{#if it.priceEstimate}
																		<span class="font-mono text-[10px] text-muted-foreground shrink-0">
																			• {it.priceEstimate}
																		</span>
																	{/if}
																</div>
															</div>
														</div>

														<!-- Tombol Beli Per Item -->
														{#if it.affiliateUrl}
															<a
																href={it.affiliateUrl}
																target="_blank"
																rel="noopener noreferrer nofollow"
																class="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 px-2 sm:px-2.5 py-1 sm:py-1.5 text-xs font-semibold shadow-2xs transition active:scale-95"
																title="Beli {it.name}"
															>
																<ShoppingBagIcon class="size-3 shrink-0" />
																<span>Beli</span>
															</a>
														{/if}
													</li>
												{/each}
											</ul>
										</div>
									</div>
								</div>

								<!-- TOMBOL UTAMA: BELI 1 SET LOOK -->
								{#if outfit.affiliateUrl}
									<div class="p-3.5 sm:p-5 pt-0">
										<a
											href={outfit.affiliateUrl}
											target="_blank"
											rel="noopener noreferrer nofollow"
											class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-98 tracking-wide"
											title="Dapatkan 1 Set Lengkap"
										>
											<ShoppingBagIcon class="size-4 shrink-0" />
											<span>Dapatkan 1 Set Lengkap</span>
										</a>
									</div>
								{/if}
							</div>
						{/each}
					</div>
				{/if}

				<!-- Pagination Lookbook (Hanya jika look melebihi 1 halaman) -->
				{#if filteredOutfits.length > outfitsPerPage}
					<div class="rounded-2xl border border-border/80 bg-card p-3 sm:p-4 mt-4 sm:mt-6">
						<Pagination
							bind:page={outfitPage}
							totalItems={filteredOutfits.length}
							perPage={outfitsPerPage}
							itemLabel="look"
							showEdges={true}
							onPageChange={() => scrollToSection("section-lookbook")}
						/>
					</div>
				{/if}
			</section>

			<!-- 4. SECTION: 12 ITEM CAPSULE WARDROBE -->
			<section id="section-wardrobe" class="space-y-4 sm:space-y-5">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-border/60 pb-3">
					<div>
						<h2 class="font-serif text-2xl sm:text-3xl font-normal text-foreground">12 Item Esensial Lemari</h2>
						<p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
							Pondasi capsule wardrobe serbaguna yang dapat saling dipadukan untuk puluhan variasi gaya.
						</p>
					</div>
					<span class="self-start sm:self-auto shrink-0 rounded-full border border-border/80 bg-stone-50 dark:bg-stone-900/50 px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
						12 Item Lengkap
					</span>
				</div>

				<!-- Grid 12 Items: 2 kolom di mobile, 3 kolom di tablet, 4 kolom di desktop -->
				<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
					{#each guide.capsule as item (item.id)}
						<div class="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-2xs flex flex-col justify-between transition-all hover:border-foreground/20">
							<div>
								<!-- Foto Item -->
								<div class="aspect-square bg-stone-50 dark:bg-stone-900/40 p-2 flex items-center justify-center border-b border-border/70 relative overflow-hidden">
									<img
										src={item.imageUrl || `/images/real/items/${item.id.startsWith("outer-1") ? "blazer" : item.id.startsWith("outer-2") ? "cardigan" : item.id.startsWith("top-1") ? "shirt" : item.id.startsWith("top-2") ? "blouse" : item.id.startsWith("top-3") ? "tshirt" : item.id.startsWith("top-4") ? "knitwear" : item.id.startsWith("bottom-1") ? "trousers" : item.id.startsWith("bottom-2") ? "denim" : item.id.startsWith("bottom-3") ? "chinos" : item.id.startsWith("shoes-1") ? "sneakers" : item.id.startsWith("shoes-2") ? "loafers" : "bag"}.jpg`}
										alt={item.name}
										loading="lazy"
										class="h-full w-full object-cover rounded-lg transition-transform duration-500 hover:scale-105"
									/>
									<span class="absolute top-2 left-2 rounded-md border border-border/80 bg-background/95 backdrop-blur-xs px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground shadow-2xs">
										{item.category}
									</span>
								</div>

								<!-- Info Item -->
								<div class="p-2.5 sm:p-3 space-y-1">
									<div class="font-serif text-xs sm:text-sm font-semibold text-foreground truncate" title={item.name}>
										{item.name}
									</div>

									<div class="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
										<span class="size-2 rounded-full border border-black/15 shrink-0" style="background-color: {getColorHex(item.color)}"></span>
										<span class="truncate">{item.color}</span>
									</div>

									{#if item.priceEstimate}
										<div class="text-[10px] font-mono text-muted-foreground font-medium truncate">
											{item.priceEstimate}
										</div>
									{/if}
								</div>
							</div>

							<!-- Tombol Beli Item -->
							{#if item.affiliateUrl}
								<div class="p-2.5 sm:p-3 pt-0">
									<a
										href={item.affiliateUrl}
										target="_blank"
										rel="noopener noreferrer nofollow"
										class="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 px-2 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium shadow-2xs transition active:scale-95"
										title="Beli {item.name}"
									>
										<ShoppingBagIcon class="size-3 sm:size-3.5 shrink-0" />
										<span>Beli Item</span>
									</a>
								</div>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<!-- 5. SECTION: CHECKLIST BELANJA & PROGRES LEMARI -->
			<section id="section-belanja" class="rounded-2xl border border-border/80 bg-card p-4 sm:p-7 shadow-xs space-y-4 sm:space-y-5">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-border/60 pb-3">
					<div>
						<h2 class="font-serif text-xl sm:text-2xl font-normal text-foreground">Checklist Belanja & Lemari</h2>
						<p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
							Centang item yang sudah ada di lemari untuk melacak kesiapan capsule wardrobe-mu.
						</p>
					</div>
					<Button
						variant="outline"
						size="sm"
						onclick={handlePrint}
						class="hidden sm:inline-flex self-start sm:self-auto gap-1.5 text-xs rounded-lg shrink-0"
					>
						<PrinterIcon class="size-3.5" />
						<span>Cetak PDF</span>
					</Button>
				</div>

				<!-- Progress Bar -->
				<div class="rounded-xl border border-border/70 bg-stone-50/50 dark:bg-stone-900/30 p-3 sm:p-4 space-y-1.5">
					<div class="flex items-center justify-between text-xs font-medium text-foreground">
						<span>Koleksi Lemari Saat Ini:</span>
						<span class="font-mono text-muted-foreground">{ownedCount} dari {totalItemsCount} Item ({ownedPercentage}%)</span>
					</div>
					<Progress value={ownedPercentage} class="h-2 w-full bg-stone-100 dark:bg-stone-800" />
				</div>

				<!-- Daftar Item Belanja -->
				<div class="space-y-2 sm:space-y-2.5">
					{#each guide.shopping as item (item.id)}
						{@const isChecked = Boolean(shoppingChecks[item.id])}
						<div class="rounded-xl border border-border/70 bg-card p-2.5 sm:p-3 flex items-center justify-between gap-2.5 sm:gap-3 transition-all hover:border-foreground/20 shadow-2xs {isChecked ? 'opacity-50 bg-stone-50/50 dark:bg-stone-900/20' : ''}">
							<div class="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
								<!-- Checkbox -->
								<button
									type="button"
									onclick={() => handleToggleCheck(item.id)}
									class="flex size-6 sm:size-7 shrink-0 items-center justify-center rounded-lg border transition-all {isChecked ? 'border-foreground bg-foreground text-background' : 'border-border/80 bg-background hover:border-foreground/50'}"
									aria-label="Tandai kepemilikan item {item.name}"
								>
									{#if isChecked}
										<CheckIcon class="size-3.5 stroke-[2.5]" />
									{/if}
								</button>

								<!-- Thumbnail -->
								<div class="size-9 sm:size-11 rounded-lg border border-border/70 bg-stone-50 dark:bg-stone-900/40 overflow-hidden shrink-0 flex items-center justify-center">
									<img
										src={item.imageUrl || `/images/real/items/${item.id.startsWith("outer-1") ? "blazer" : item.id.startsWith("outer-2") ? "cardigan" : item.id.startsWith("top-1") ? "shirt" : item.id.startsWith("top-2") ? "blouse" : item.id.startsWith("top-3") ? "tshirt" : item.id.startsWith("top-4") ? "knitwear" : item.id.startsWith("bottom-1") ? "trousers" : item.id.startsWith("bottom-2") ? "denim" : item.id.startsWith("bottom-3") ? "chinos" : item.id.startsWith("shoes-1") ? "sneakers" : item.id.startsWith("shoes-2") ? "loafers" : "bag"}.jpg`}
										alt={item.name}
										class="size-full object-cover"
										loading="lazy"
									/>
								</div>

								<div class="min-w-0 flex-1">
									<div class="flex items-center gap-1.5 min-w-0">
										<span class="font-serif text-xs sm:text-sm font-medium truncate {isChecked ? 'line-through text-muted-foreground' : 'text-foreground'}">
											{item.name}
										</span>
										<span class="rounded border border-border/80 px-1 py-0.2 text-[9px] font-medium text-muted-foreground uppercase shrink-0">
											P{item.priority}
										</span>
									</div>
									<div class="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 truncate">
										<span class="size-2 rounded-full border border-black/15 shrink-0" style="background-color: {getColorHex(item.colorSuggestion)}"></span>
										<span class="truncate">{item.colorSuggestion}</span>
										<span class="mx-0.5 opacity-50 shrink-0">•</span>
										<span class="shrink-0">{item.outfitCount} Look</span>
										{#if item.priceEstimate}
											<span class="mx-0.5 opacity-50 shrink-0">•</span>
											<span class="font-mono text-[10px] shrink-0">{item.priceEstimate}</span>
										{/if}
									</div>
								</div>
							</div>

							<!-- Tombol Beli Item -->
							{#if item.affiliateUrl}
								<a
									href={item.affiliateUrl}
									target="_blank"
									rel="noopener noreferrer nofollow"
									class="inline-flex shrink-0 items-center justify-center gap-1 rounded-lg bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold shadow-2xs transition active:scale-95"
									title="Beli {item.name}"
								>
									<ShoppingBagIcon class="size-3 shrink-0" />
									<span class="hidden sm:inline">Beli Item</span>
									<span class="sm:hidden">Beli</span>
								</a>
							{/if}
						</div>
					{/each}
				</div>
			</section>

			<!-- 6. SECTION: 4 ATURAN PADU-PADAN CEPAT -->
			<section class="rounded-2xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-4 sm:p-7 space-y-3.5 sm:space-y-4">
				<h2 class="font-serif text-lg sm:text-xl font-normal text-foreground">
					4 Aturan Esensial Padu-Padan
				</h2>
				<div class="grid gap-2.5 sm:gap-3 sm:grid-cols-2">
					<div class="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-border/70 bg-card p-3 sm:p-3.5">
						<span class="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">01</span>
						<div>
							<h3 class="text-xs font-semibold text-foreground">Kombinasi 3 Warna Maksimal</h3>
							<p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
								Gunakan 2 warna dasar netral ditambah 1 warna aksen lembut untuk siluet bersih dan rapi.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-border/70 bg-card p-3.5">
						<span class="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">02</span>
						<div>
							<h3 class="text-xs font-semibold text-foreground">Seimbangkan Volume Potongan</h3>
							<p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
								Jika atasan bervolume/relaxed, padukan dengan bawahan straight fit atau sebaliknya.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-border/70 bg-card p-3.5">
						<span class="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">03</span>
						<div>
							<h3 class="text-xs font-semibold text-foreground">Sepatu Menentukan Formalitas</h3>
							<p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
								Ganti sneakers putihmu dengan loafers kulit untuk mengubah outfit santai menjadi siap meeting.
							</p>
						</div>
					</div>

					<div class="flex items-start gap-2.5 sm:gap-3 rounded-xl border border-border/70 bg-card p-3.5">
						<span class="font-mono text-xs font-bold text-muted-foreground shrink-0 mt-0.5">04</span>
						<div>
							<h3 class="text-xs font-semibold text-foreground">Cek Lemari Sebelum Belanja</h3>
							<p class="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
								Fokus melengkapi item prioritas utama yang belum kamu miliki untuk variasi look maksimal.
							</p>
						</div>
					</div>
				</div>
			</section>

			<!-- FOOTER: CATATAN & RESET -->
			<footer class="pt-4 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
				<p class="text-center sm:text-left leading-relaxed">
					{data.affiliateSettings?.affiliate_disclaimer || "Rekomendasi busana dikurasi secara independen untuk memudahkan Anda menemukan pilihan outfit terbaik."}
				</p>
				<div class="flex items-center gap-3 shrink-0">
					<Button href="/mulai" variant="outline" size="sm" class="text-xs">
						<RotateCcwIcon class="size-3.5 mr-1.5" />
						<span>Ulangi Style Check</span>
					</Button>
				</div>
			</footer>

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
		<input type="hidden" name="photoBase64" value={currentTryOnPhoto} />
	</form>

	<!-- Dialog Rekomendasi Upload Foto Wajah untuk AI Try-On -->
	<Dialog.Root bind:open={isPhotoPromptDialogOpen}>
		<Dialog.Content class="sm:max-w-md">
			<Dialog.Header>
				<div class="flex size-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-foreground mb-2">
					<CameraIcon class="size-5" />
				</div>
				<Dialog.Title class="font-serif text-lg sm:text-xl font-semibold">
					Disarankan Unggah Foto Wajah
				</Dialog.Title>
				<Dialog.Description class="text-xs text-muted-foreground pt-1 leading-relaxed">
					Agar hasil visualisasi AI Try-On presisi dan menyerupai penampilan aslimu, disarankan untuk mengunggah foto wajah dengan pencahayaan yang jelas.
				</Dialog.Description>
			</Dialog.Header>

			<div class="space-y-3 pt-2">
				<!-- Area Upload Foto -->
				<input
					bind:this={photoInputRef}
					type="file"
					accept="image/*"
					capture="user"
					onchange={handleFacePhotoSelected}
					class="hidden"
				/>

				{#if uploadedFacePhoto}
					<div class="flex items-center gap-3 p-3 rounded-xl border border-emerald-500/40 bg-emerald-500/5">
						<img
							src={uploadedFacePhoto}
							alt="Preview Wajah"
							class="size-13 rounded-lg object-cover border border-border shadow-xs"
						/>
						<div class="flex-1 min-w-0">
							<div class="text-xs font-semibold text-foreground flex items-center gap-1">
								<CheckCircle2Icon class="size-3.5 text-emerald-500" />
								<span>Foto Wajah Terpasang</span>
							</div>
							<div class="text-[11px] text-muted-foreground mt-0.5">
								Siap digunakan untuk simulasi try-on outfit.
							</div>
							<button
								type="button"
								onclick={() => photoInputRef?.click()}
								class="text-xs text-primary font-medium hover:underline mt-1 block"
							>
								Ganti Foto Lain
							</button>
						</div>
					</div>
				{:else}
					<button
						type="button"
						onclick={() => photoInputRef?.click()}
						class="w-full flex flex-col items-center justify-center gap-2 p-4 sm:p-5 rounded-2xl border-2 border-dashed border-border hover:border-foreground/40 hover:bg-muted/40 transition-all text-center group cursor-pointer"
					>
						<div class="size-10 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center group-hover:scale-105 transition-transform text-muted-foreground group-hover:text-foreground">
							<UploadCloudIcon class="size-5" />
						</div>
						<div>
							<span class="text-xs font-semibold text-foreground block">
								Pilih / Ambil Foto Wajah
							</span>
							<span class="text-[11px] text-muted-foreground mt-0.5 block">
								Mendukung kamera langsung atau galeri (maks 5MB)
							</span>
						</div>
					</button>
				{/if}

				<div class="rounded-xl border border-border/60 bg-stone-50/70 dark:bg-stone-900/40 p-2.5 text-[11px] text-muted-foreground flex items-center gap-2">
					<InfoIcon class="size-4 shrink-0 text-muted-foreground" />
					<span>Privasi aman: Foto hanya dipakai untuk simulasi AI personalmu.</span>
				</div>
			</div>

			<Dialog.Footer class="mt-4 flex flex-col sm:flex-row gap-2">
				{#if uploadedFacePhoto}
					<Button
						type="button"
						onclick={confirmTryOnWithPhoto}
						class="w-full sm:w-auto font-semibold bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90"
					>
						Gunakan Foto & Generate Try-On
					</Button>
				{:else}
					<Button
						type="button"
						onclick={() => photoInputRef?.click()}
						class="w-full sm:w-auto font-semibold bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 hover:opacity-90"
					>
						<CameraIcon class="size-4 mr-1.5" />
						<span>Pilih Foto Wajah</span>
					</Button>
					<Button
						type="button"
						variant="ghost"
						onclick={proceedTryOnWithoutPhoto}
						class="w-full sm:w-auto text-xs text-muted-foreground hover:text-foreground"
					>
						Lanjutkan Tanpa Foto Wajah
					</Button>
				{/if}
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
			<Dialog.Footer class="mt-4 flex flex-col-reverse sm:flex-row gap-2">
				<Button variant="outline" onclick={() => (isDeleteDialogOpen = false)} class="w-full sm:w-auto">
					Batal
				</Button>
				<form action="?/deleteData" method="POST" class="w-full sm:w-auto">
					<Button type="submit" variant="destructive" class="w-full sm:w-auto font-semibold">
						Hapus Permanen
					</Button>
				</form>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
</div>

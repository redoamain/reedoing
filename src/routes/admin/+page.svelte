<script lang="ts">
	import { enhance } from "$app/forms";
	import { toast } from "svelte-sonner";
	import * as Tabs from "$lib/components/ui/tabs";
	import * as Dialog from "$lib/components/ui/dialog";
	import * as Sheet from "$lib/components/ui/sheet";
	import * as SidebarUI from "$lib/components/ui/sidebar";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "$lib/components/ui/card";
	import { Badge } from "$lib/components/ui/badge";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Progress } from "$lib/components/ui/progress";

	import ShoppingBagIcon from "@lucide/svelte/icons/shopping-bag";
	import ExternalLinkIcon from "@lucide/svelte/icons/external-link";
	import PlusIcon from "@lucide/svelte/icons/plus";
	import PencilIcon from "@lucide/svelte/icons/pencil";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import RotateCcwIcon from "@lucide/svelte/icons/rotate-ccw";
	import SearchIcon from "@lucide/svelte/icons/search";
	import CheckCircle2Icon from "@lucide/svelte/icons/check-circle-2";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import CopyIcon from "@lucide/svelte/icons/copy";
	import CheckIcon from "@lucide/svelte/icons/check";
	import SettingsIcon from "@lucide/svelte/icons/settings";
	import LogOutIcon from "@lucide/svelte/icons/log-out";
	import ShirtIcon from "@lucide/svelte/icons/shirt";
	import LayersIcon from "@lucide/svelte/icons/layers";
	import GlobeIcon from "@lucide/svelte/icons/globe";
	import LinkIcon from "@lucide/svelte/icons/link";
	import SunIcon from "@lucide/svelte/icons/sun";
	import MoonIcon from "@lucide/svelte/icons/moon";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import UserIcon from "@lucide/svelte/icons/user";
	import KeyRoundIcon from "@lucide/svelte/icons/key-round";
	import ImageIcon from "@lucide/svelte/icons/image";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import UploadIcon from "@lucide/svelte/icons/upload";
	import PanelLeftIcon from "@lucide/svelte/icons/panel-left";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import TypeIcon from "@lucide/svelte/icons/type";
	import EyeIcon from "@lucide/svelte/icons/eye";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import CompassIcon from "@lucide/svelte/icons/compass";
	import SlidersHorizontalIcon from "@lucide/svelte/icons/sliders-horizontal";
	import { toggleMode, mode } from "mode-watcher";

	import type { PageData } from "./$types";
	import type { RoutineOption } from "$lib/types/style";

	let { data }: { data: PageData } = $props();

	// Default color palettes definitions
	const defaultWarmColors = [
		{ name: "Broken White", hex: "#F9F6F0", role: "base" as const },
		{ name: "Oat Camel", hex: "#C2A27E", role: "base" as const },
		{ name: "Espresso Brown", hex: "#3D2B1F", role: "base" as const },
		{ name: "Deep Olive", hex: "#4E5340", role: "base" as const },
		{ name: "Terracotta", hex: "#B85D43", role: "accent" as const },
		{ name: "Warm Amber", hex: "#D49B4B", role: "accent" as const }
	];

	const defaultCoolColors = [
		{ name: "Crisp White", hex: "#FFFFFF", role: "base" as const },
		{ name: "Classic Navy", hex: "#1B2A47", role: "base" as const },
		{ name: "Charcoal Grey", hex: "#33383F", role: "base" as const },
		{ name: "Heather Fog", hex: "#CBD2D9", role: "base" as const },
		{ name: "Slate Blue", hex: "#4D6B88", role: "accent" as const },
		{ name: "Deep Burgundy", hex: "#6B1D2F", role: "accent" as const }
	];

	const defaultNeutralColors = [
		{ name: "Soft Ecru", hex: "#F5F2EB", role: "base" as const },
		{ name: "Midnight Graphite", hex: "#26292E", role: "base" as const },
		{ name: "Smokey Taupe", hex: "#7A7265", role: "base" as const },
		{ name: "French Navy", hex: "#202E42", role: "base" as const },
		{ name: "Muted Sage", hex: "#768B75", role: "accent" as const },
		{ name: "Rosewood Mauve", hex: "#9B6A6C", role: "accent" as const }
	];

	function parsePaletteColors(jsonStr?: string, fallback: typeof defaultWarmColors = defaultWarmColors) {
		if (!jsonStr) return JSON.parse(JSON.stringify(fallback));
		try {
			const parsed = JSON.parse(jsonStr);
			if (Array.isArray(parsed) && parsed.length > 0) return parsed;
		} catch {
			// fallback
		}
		return JSON.parse(JSON.stringify(fallback));
	}

	// State active tab navigasi sidebar
	let adminTab = $state<"outfits" | "items" | "hero" | "settings">("outfits");
	let mobileSidebarOpen = $state(false);

	// State Hero Editor & Live Preview
	let heroTitle1 = $state("Lebih sedikit pakaian,");
	let heroTitle2 = $state("lebih banyak gaya.");
	let heroDescription = $state(
		"Bangun capsule wardrobe fungsional 12 item yang menghasilkan 30+ kombinasi outfit siap pakai. Dirancang personal untuk pria dan wanita berdasarkan undertone urat nadi dan proporsi tubuhmu."
	);
	let heroCtaText = $state("Mulai Style Check");
	let heroCtaSecondaryText = $state("Lihat Contoh Lookbook");
	let heroCtaSubtext = $state("Gratis · Sekitar 3 menit · Langsung siap pakai");
	let heroFloatingText = $state("Deteksi warna urat nadi pergelangan tangan otomatis");
	let heroStat1Val = $state("12 Item");
	let heroStat1Lbl = $state("Wardrobe esensial");
	let heroStat2Val = $state("30+ Look");
	let heroStat2Lbl = $state("Kombinasi siap pakai");
	let heroStat3Val = $state("100%");
	let heroStat3Lbl = $state("Gratis selamanya");

	// Tone Color States
	let heroDefaultTone = $state<"hangat" | "dingin" | "netral">("hangat");
	let heroEditorSubTab = $state<"words" | "tones">("words");
	let toneEditorTab = $state<"hangat" | "dingin" | "netral">("hangat");
	let previewTone = $state<"hangat" | "dingin" | "netral">("hangat");

	let warmName = $state("Warm Earth & Sun");
	let warmDesc = $state("Nuansa bumi hangat: broken white, camel, espresso, dan aksen terracotta.");
	let warmColors = $state(JSON.parse(JSON.stringify(defaultWarmColors)));

	let coolName = $state("Cool Slate & Coastal");
	let coolDesc = $state("Nuansa sejuk berkelas: pure white, classic navy, charcoal, dan slate blue.");
	let coolColors = $state(JSON.parse(JSON.stringify(defaultCoolColors)));

	let neutralName = $state("Neutral Mineral & Stone");
	let neutralDesc = $state("Nuansa netral seimbang: soft ecru, midnight graphite, taupe, dan sage green.");
	let neutralColors = $state(JSON.parse(JSON.stringify(defaultNeutralColors)));

	let isResetHeroDialogOpen = $state(false);

	$effect(() => {
		if (data.settings.hero_title_1 !== undefined) heroTitle1 = data.settings.hero_title_1;
		if (data.settings.hero_title_2 !== undefined) heroTitle2 = data.settings.hero_title_2;
		if (data.settings.hero_description !== undefined) heroDescription = data.settings.hero_description;
		if (data.settings.hero_cta_text !== undefined) heroCtaText = data.settings.hero_cta_text;
		if (data.settings.hero_cta_secondary_text !== undefined) heroCtaSecondaryText = data.settings.hero_cta_secondary_text;
		if (data.settings.hero_cta_subtext !== undefined) heroCtaSubtext = data.settings.hero_cta_subtext;
		if (data.settings.hero_floating_text !== undefined) heroFloatingText = data.settings.hero_floating_text;
		if (data.settings.hero_stat_1_val !== undefined) heroStat1Val = data.settings.hero_stat_1_val;
		if (data.settings.hero_stat_1_lbl !== undefined) heroStat1Lbl = data.settings.hero_stat_1_lbl;
		if (data.settings.hero_stat_2_val !== undefined) heroStat2Val = data.settings.hero_stat_2_val;
		if (data.settings.hero_stat_2_lbl !== undefined) heroStat2Lbl = data.settings.hero_stat_2_lbl;
		if (data.settings.hero_stat_3_val !== undefined) heroStat3Val = data.settings.hero_stat_3_val;
		if (data.settings.hero_stat_3_lbl !== undefined) heroStat3Lbl = data.settings.hero_stat_3_lbl;
		if (data.settings.hero_default_tone && ["hangat", "dingin", "netral"].includes(data.settings.hero_default_tone)) {
			heroDefaultTone = data.settings.hero_default_tone as any;
			previewTone = data.settings.hero_default_tone as any;
		}
		if (data.settings.hero_tone_warm_name !== undefined) warmName = data.settings.hero_tone_warm_name;
		if (data.settings.hero_tone_warm_desc !== undefined) warmDesc = data.settings.hero_tone_warm_desc;
		if (data.settings.hero_tone_warm_colors) warmColors = parsePaletteColors(data.settings.hero_tone_warm_colors, defaultWarmColors);
		if (data.settings.hero_tone_cool_name !== undefined) coolName = data.settings.hero_tone_cool_name;
		if (data.settings.hero_tone_cool_desc !== undefined) coolDesc = data.settings.hero_tone_cool_desc;
		if (data.settings.hero_tone_cool_colors) coolColors = parsePaletteColors(data.settings.hero_tone_cool_colors, defaultCoolColors);
		if (data.settings.hero_tone_neutral_name !== undefined) neutralName = data.settings.hero_tone_neutral_name;
		if (data.settings.hero_tone_neutral_desc !== undefined) neutralDesc = data.settings.hero_tone_neutral_desc;
		if (data.settings.hero_tone_neutral_colors) neutralColors = parsePaletteColors(data.settings.hero_tone_neutral_colors, defaultNeutralColors);
	});

	// Computed preview palette
	let currentPreviewPalette = $derived.by(() => {
		if (previewTone === "hangat") {
			return {
				name: warmName,
				label: "Warm Tone",
				veinText: "Urat nadi kehijauan",
				desc: warmDesc,
				colors: warmColors,
				lookFormula: "Blazer Camel + Kemeja Broken White + Trousers Espresso",
				lookName: "The Earth Architect",
				items: [
					{ name: "Camel Blazer", category: "Outer", img: "/images/placeholder/blazer.svg" },
					{ name: "Broken White Shirt", category: "Atasan", img: "/images/placeholder/shirt.svg" },
					{ name: "Espresso Pants", category: "Bawahan", img: "/images/placeholder/trousers.svg" }
				]
			};
		} else if (previewTone === "dingin") {
			return {
				name: coolName,
				label: "Cool Tone",
				veinText: "Urat nadi kebiruan / ungu",
				desc: coolDesc,
				colors: coolColors,
				lookFormula: "Navy Blazer + Kemeja Crisp White + Charcoal Pants",
				lookName: "Executive Slate",
				items: [
					{ name: "Navy Blazer", category: "Outer", img: "/images/placeholder/blazer.svg" },
					{ name: "Crisp Oxford Shirt", category: "Atasan", img: "/images/placeholder/shirt.svg" },
					{ name: "Charcoal Pants", category: "Bawahan", img: "/images/placeholder/trousers.svg" }
				]
			};
		} else {
			return {
				name: neutralName,
				label: "Neutral Tone",
				veinText: "Urat nadi campuran (biru & hijau)",
				desc: neutralDesc,
				colors: neutralColors,
				lookFormula: "Graphite Blazer + Ecru Heavy Tee + Taupe Chinos",
				lookName: "Minimalist Mineral",
				items: [
					{ name: "Graphite Blazer", category: "Outer", img: "/images/placeholder/blazer.svg" },
					{ name: "Ecru Heavy Tee", category: "Atasan", img: "/images/placeholder/shirt.svg" },
					{ name: "Taupe Chinos", category: "Bawahan", img: "/images/placeholder/trousers.svg" }
				]
			};
		}
	});

	// State filter outfit
	let selectedOccasion = $state<string>("semua");
	let filterAffiliateStatus = $state<string>("semua"); // "semua" | "ada" | "belum"
	let searchQuery = $state<string>("");

	// State dialog edit/create outfit
	let isOutfitDialogOpen = $state(false);
	let isResetDialogOpen = $state(false);
	let isDeleteDialogOpen = $state(false);
	let outfitToDelete = $state<string | null>(null);

	// State edit item dialog
	let isItemDialogOpen = $state(false);
	let isEditingNewItem = $state(false);
	let activeItem = $state<any>(null);
	let searchItemQuery = $state<string>("");
	let filterItemStatus = $state<string>("semua");

	let filteredItems = $derived.by(() => {
		let list = data.items;
		if (filterItemStatus === "ada") {
			list = list.filter((i) => Boolean(i.affiliateUrl?.trim()));
		} else if (filterItemStatus === "belum") {
			list = list.filter((i) => !i.affiliateUrl?.trim());
		}
		if (searchItemQuery.trim()) {
			const q = searchItemQuery.toLowerCase();
			list = list.filter((i) => i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));
		}
		return list;
	});

	// Data outfit aktif yang diedit
	let editingOutfit = $state<{
		id: string;
		name: string;
		occasion: string;
		occasionLabel: string;
		formula: string;
		styleTips: string;
		itemIds: string[];
		affiliateUrl: string;
		imageUrl: string;
		isActive: boolean;
	}>({
		id: "",
		name: "",
		occasion: "kantor",
		occasionLabel: "Kerja Kantor",
		formula: "",
		styleTips: "",
		itemIds: [],
		affiliateUrl: "",
		imageUrl: "",
		isActive: true
	});

	let isEditingNewOutfit = $state(false);

	// Filter outfits
	let filteredOutfits = $derived.by(() => {
		let list = data.outfits;

		if (selectedOccasion !== "semua") {
			list = list.filter((o) => o.occasion === selectedOccasion);
		}

		if (filterAffiliateStatus === "ada") {
			list = list.filter((o) => Boolean(o.affiliateUrl?.trim()));
		} else if (filterAffiliateStatus === "belum") {
			list = list.filter((o) => !o.affiliateUrl?.trim());
		}

		if (searchQuery.trim()) {
			const q = searchQuery.toLowerCase();
			list = list.filter(
				(o) =>
					o.name.toLowerCase().includes(q) ||
					o.formula.toLowerCase().includes(q) ||
					o.styleTips.toLowerCase().includes(q)
			);
		}

		return list;
	});

	function openAddOutfitDialog() {
		isEditingNewOutfit = true;
		editingOutfit = {
			id: "",
			name: "",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			formula: "",
			styleTips: "",
			itemIds: ["outer-1", "top-1", "bottom-1", "shoes-2"],
			affiliateUrl: "",
			imageUrl: "",
			isActive: true
		};
		isOutfitDialogOpen = true;
	}

	function openEditOutfitDialog(outfit: any) {
		isEditingNewOutfit = false;
		editingOutfit = {
			id: outfit.id,
			name: outfit.name,
			occasion: outfit.occasion,
			occasionLabel: outfit.occasionLabel,
			formula: outfit.formula,
			styleTips: outfit.styleTips,
			itemIds: Array.isArray(outfit.itemIds) ? [...outfit.itemIds] : [],
			affiliateUrl: outfit.affiliateUrl || "",
			imageUrl: outfit.imageUrl || "",
			isActive: outfit.isActive !== false
		};
		isOutfitDialogOpen = true;
	}

	function confirmDeleteOutfit(id: string) {
		outfitToDelete = id;
		isDeleteDialogOpen = true;
	}

	function openEditItemDialog(item: any) {
		isEditingNewItem = false;
		activeItem = {
			id: item.id,
			name: item.name,
			category: item.category,
			affiliateUrl: item.affiliateUrl || "",
			imageUrl: item.imageUrl || "",
			priceEstimate: item.priceEstimate || ""
		};
		isItemDialogOpen = true;
	}

	function openAddItemDialog() {
		isEditingNewItem = true;
		activeItem = {
			id: `item-${Date.now().toString(36)}`,
			name: "",
			category: "atasan",
			affiliateUrl: "",
			imageUrl: "",
			priceEstimate: ""
		};
		isItemDialogOpen = true;
	}

	function handleItemImagePreview(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target?.files?.[0];
		if (file && activeItem) {
			const reader = new FileReader();
			reader.onload = (evt) => {
				activeItem.imageUrl = evt.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function handleOutfitImagePreview(e: Event) {
		const target = e.target as HTMLInputElement;
		const file = target?.files?.[0];
		if (file && editingOutfit) {
			const reader = new FileReader();
			reader.onload = (evt) => {
				editingOutfit.imageUrl = evt.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	}

	function copyToClipboard(text: string, label: string) {
		if (typeof window !== "undefined") {
			navigator.clipboard.writeText(text);
			toast.success(`${label} disalin ke clipboard!`);
		}
	}

	const occasionOptions = [
		{ id: "kantor", label: "Kerja Kantor" },
		{ id: "meeting", label: "Meeting Klien & Presentasi" },
		{ id: "kampus", label: "Kuliah & Kampus" },
		{ id: "hangout", label: "Hangout Akhir Pekan" },
		{ id: "santai", label: "Santai & Harian" },
		{ id: "formal", label: "Acara Formal & Undangan" }
	];
</script>

<svelte:head>
	<title>Admin Dashboard · Kelola Outfit & Shopee Affiliate</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

{#snippet sidebarNav()}
	<SidebarUI.SidebarHeader class="p-4">
		<div class="flex items-center gap-3">
			{#if data.settings.site_logo}
				<img src={data.settings.site_logo} alt={data.settings.site_name || "Logo"} class="size-9 rounded-lg object-contain border border-border bg-stone-50 dark:bg-stone-900" />
			{:else}
				<div class="flex size-9 items-center justify-center rounded-lg border border-border bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 font-serif font-bold text-sm shadow-2xs">
					{(data.settings.site_name || "R").charAt(0).toUpperCase()}
				</div>
			{/if}
			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-1.5">
					<span class="font-serif text-sm font-bold text-foreground leading-tight truncate">
						{data.settings.site_name || "reedoing"}
					</span>
					<span class="rounded border border-border/80 px-1 py-0.2 text-[8px] font-mono uppercase tracking-wider text-muted-foreground font-semibold">
						Admin
					</span>
				</div>
				<p class="text-[11px] text-muted-foreground truncate mt-0.5">
					{data.settings.site_tagline || "Style Management"}
				</p>
			</div>
		</div>
	</SidebarUI.SidebarHeader>

	<SidebarUI.SidebarContent class="p-3">
		<SidebarUI.SidebarGroup>
			<SidebarUI.SidebarGroupLabel>Katalog & Fashion</SidebarUI.SidebarGroupLabel>
			<SidebarUI.SidebarGroupContent>
				<SidebarUI.SidebarMenu>
					<SidebarUI.SidebarMenuItem>
						<SidebarUI.SidebarMenuButton
							isActive={adminTab === "outfits"}
							onclick={() => {
								adminTab = "outfits";
								mobileSidebarOpen = false;
							}}
						>
							<ShirtIcon class="size-4 shrink-0" />
							<span class="flex-1 truncate">Katalog Outfit</span>
							<SidebarUI.SidebarMenuBadge>
								{data.stats.totalOutfits}
							</SidebarUI.SidebarMenuBadge>
						</SidebarUI.SidebarMenuButton>
					</SidebarUI.SidebarMenuItem>

					<SidebarUI.SidebarMenuItem>
						<SidebarUI.SidebarMenuButton
							isActive={adminTab === "items"}
							onclick={() => {
								adminTab = "items";
								mobileSidebarOpen = false;
							}}
						>
							<LayersIcon class="size-4 shrink-0" />
							<span class="flex-1 truncate">Item Belanja</span>
							<SidebarUI.SidebarMenuBadge>
								{data.stats.totalItems}
							</SidebarUI.SidebarMenuBadge>
						</SidebarUI.SidebarMenuButton>
					</SidebarUI.SidebarMenuItem>
				</SidebarUI.SidebarMenu>
			</SidebarUI.SidebarGroupContent>
		</SidebarUI.SidebarGroup>

		<SidebarUI.SidebarSeparator />

		<SidebarUI.SidebarGroup>
			<SidebarUI.SidebarGroupLabel>Tampilan & Beranda</SidebarUI.SidebarGroupLabel>
			<SidebarUI.SidebarGroupContent>
				<SidebarUI.SidebarMenu>
					<SidebarUI.SidebarMenuItem>
						<SidebarUI.SidebarMenuButton
							isActive={adminTab === "hero"}
							onclick={() => {
								adminTab = "hero";
								mobileSidebarOpen = false;
							}}
						>
							<SparklesIcon class="size-4 shrink-0 text-amber-500" />
							<span class="flex-1 truncate">Hero & Tone Color</span>
							<SidebarUI.SidebarMenuBadge class="bg-amber-100 text-amber-900 dark:bg-amber-900/50 dark:text-amber-200 text-[10px]">
								{heroDefaultTone === 'hangat' ? 'Warm' : heroDefaultTone === 'dingin' ? 'Cool' : 'Netral'}
							</SidebarUI.SidebarMenuBadge>
						</SidebarUI.SidebarMenuButton>
					</SidebarUI.SidebarMenuItem>
				</SidebarUI.SidebarMenu>
			</SidebarUI.SidebarGroupContent>
		</SidebarUI.SidebarGroup>

		<SidebarUI.SidebarSeparator />

		<SidebarUI.SidebarGroup>
			<SidebarUI.SidebarGroupLabel>Pengaturan Sistem</SidebarUI.SidebarGroupLabel>
			<SidebarUI.SidebarGroupContent>
				<SidebarUI.SidebarMenu>
					<SidebarUI.SidebarMenuItem>
						<SidebarUI.SidebarMenuButton
							isActive={adminTab === "settings"}
							onclick={() => {
								adminTab = "settings";
								mobileSidebarOpen = false;
							}}
						>
							<SettingsIcon class="size-4 shrink-0" />
							<span class="flex-1 truncate">Website & Akun</span>
							<span class="size-2 rounded-full {data.settings.site_name ? 'bg-emerald-500' : 'bg-amber-400'}"></span>
						</SidebarUI.SidebarMenuButton>
					</SidebarUI.SidebarMenuItem>
				</SidebarUI.SidebarMenu>
			</SidebarUI.SidebarGroupContent>
		</SidebarUI.SidebarGroup>

		<!-- Progress Metric Kesiapan Shopee -->
		<div class="mt-4 rounded-xl border border-border/80 bg-stone-50/60 dark:bg-stone-900/40 p-3 text-xs space-y-2">
			<div class="flex items-center justify-between">
				<span class="font-medium text-foreground">Afiliasi Shopee</span>
				<span class="font-mono text-[11px] font-semibold text-foreground">
					{data.stats.outfitsWithAffiliate}/{data.stats.totalOutfits} Look
				</span>
			</div>
			<Progress value={Math.round((data.stats.outfitsWithAffiliate / (data.stats.totalOutfits || 1)) * 100)} class="h-1.5 bg-stone-200 dark:bg-stone-800" />
			<div class="flex items-center justify-between text-[10px] text-muted-foreground font-medium">
				<span>{Math.round((data.stats.outfitsWithAffiliate / (data.stats.totalOutfits || 1)) * 100)}% Terhubung</span>
				<span>{data.stats.itemsWithAffiliate}/{data.stats.totalItems} Item</span>
			</div>
		</div>
	</SidebarUI.SidebarContent>

	<SidebarUI.SidebarFooter class="p-3">
		<!-- User Profile Card -->
		<div class="flex items-center justify-between rounded-lg border border-border/70 bg-stone-50/80 dark:bg-stone-900/50 p-2.5">
			<div class="flex items-center gap-2 min-w-0">
				<div class="flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary font-bold text-xs shrink-0">
					<UserIcon class="size-3.5" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-xs font-bold text-foreground truncate leading-none">
						{data.settings.admin_user || "admin"}
					</p>
					<span class="text-[10px] text-muted-foreground font-medium">Super Admin</span>
				</div>
			</div>
		</div>

		<div class="flex items-center justify-between pt-1">
			<a
				href="/"
				target="_blank"
				class="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-foreground transition-colors"
			>
				<GlobeIcon class="size-3.5" />
				<span>Buka Web</span>
				<ExternalLinkIcon class="size-2.5 opacity-60" />
			</a>

			<button
				onclick={toggleMode}
				type="button"
				class="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-all hover:bg-muted active:scale-95"
				aria-label="Ganti mode gelap/terang"
				title="Ganti mode gelap/terang"
			>
				{#if mode.current === "dark"}
					<SunIcon class="size-3.5 text-stone-200" />
				{:else}
					<MoonIcon class="size-3.5 text-stone-700" />
				{/if}
			</button>
		</div>

		<form action="?/logout" method="POST" use:enhance>
			<Button variant="ghost" size="sm" type="submit" class="w-full justify-start gap-2 rounded-lg text-xs font-medium text-stone-700 dark:text-stone-300 hover:text-destructive hover:bg-destructive/15 transition-colors">
				<LogOutIcon class="size-3.5" />
				<span>Keluar dari Admin</span>
			</Button>
		</form>
	</SidebarUI.SidebarFooter>
{/snippet}

<div class="min-h-screen bg-muted/20 flex flex-col lg:flex-row">
	<!-- DESKTOP SHADCN SIDEBAR -->
	<SidebarUI.Sidebar class="hidden lg:flex sticky top-0 h-screen">
		{@render sidebarNav()}
	</SidebarUI.Sidebar>

	<!-- MOBILE SHEET DRAWER -->
	<Sheet.Root bind:open={mobileSidebarOpen}>
		<Sheet.Content side="left" class="p-0 w-72">
			<SidebarUI.Sidebar class="w-full h-full border-r-0">
				{@render sidebarNav()}
			</SidebarUI.Sidebar>
		</Sheet.Content>
	</Sheet.Root>

	<div class="flex-1 flex flex-col min-w-0">
		<!-- TOP NAVBAR -->
		<header class="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-card/95 px-3 sm:px-6 backdrop-blur">
			<div class="flex items-center gap-2 sm:gap-3 min-w-0">
				<SidebarUI.SidebarTrigger onclick={() => (mobileSidebarOpen = true)} class="lg:hidden shrink-0" />
				
				<div class="flex items-center gap-1.5 sm:gap-2 text-xs min-w-0">
					<span class="text-muted-foreground font-medium hidden sm:inline truncate">{data.settings.site_name || "reedoing"} Admin</span>
					<span class="text-muted-foreground/60 hidden sm:inline">/</span>
					<span class="font-bold text-foreground truncate">
						{#if adminTab === 'outfits'}Katalog Outfit
						{:else if adminTab === 'items'}Item Belanja
						{:else if adminTab === 'hero'}Hero & Tone Color
						{:else}Pengaturan Website & Akun{/if}
					</span>
				</div>
			</div>

			<div class="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
				<div class="hidden md:flex items-center gap-2 rounded-full border border-border/80 bg-stone-50 dark:bg-stone-900/60 px-2.5 py-1 text-[11px] font-semibold text-foreground">
					<span class="size-2 rounded-full bg-emerald-500 animate-pulse"></span>
					<span>Database SQLite</span>
				</div>

				<a
					href="/"
					target="_blank"
					class="hidden sm:inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background px-2.5 py-1.5 text-xs font-semibold text-stone-700 dark:text-stone-300 hover:text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
				>
					<GlobeIcon class="size-3.5" />
					<span>Lihat Website</span>
					<ExternalLinkIcon class="size-3 opacity-60" />
				</a>

				<button
					onclick={toggleMode}
					type="button"
					class="inline-flex size-8 items-center justify-center rounded-lg border border-border text-foreground transition-all hover:bg-muted hover:text-foreground active:scale-95 shrink-0"
					aria-label="Ganti mode gelap/terang"
					title="Ganti mode gelap/terang"
				>
					{#if mode.current === "dark"}
						<SunIcon class="size-3.5 sm:size-4 text-stone-200" />
					{:else}
						<MoonIcon class="size-3.5 sm:size-4 text-stone-700" />
					{/if}
				</button>

				<form action="?/logout" method="POST" use:enhance class="inline-flex shrink-0">
					<Button variant="ghost" size="sm" type="submit" class="h-8 px-2 sm:px-2.5 text-xs text-stone-600 dark:text-stone-400 hover:text-destructive hover:bg-destructive/15 gap-1.5">
						<LogOutIcon class="size-3.5" />
						<span class="hidden sm:inline">Keluar</span>
					</Button>
				</form>
			</div>
		</header>

		<!-- MAIN CONTENT AREA -->

	<!-- MAIN CONTENT AREA -->
	<main class="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
		<!-- Summary Cards -->
		<div class="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
			<Card class="border-border/80 bg-card rounded-xl">
				<CardContent class="p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-muted-foreground">Total Outfit</span>
						<ShirtIcon class="size-4 text-muted-foreground" />
					</div>
					<div class="mt-2 flex items-baseline gap-2">
						<span class="text-2xl font-bold font-serif">{data.stats.totalOutfits}</span>
						<span class="text-xs text-muted-foreground">lookbook</span>
					</div>
				</CardContent>
			</Card>

			<Card class="border-border/80 bg-card rounded-xl">
				<CardContent class="p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-muted-foreground">Outfit + Link Shopee</span>
						<ShoppingBagIcon class="size-4 text-muted-foreground" />
					</div>
					<div class="mt-2 flex items-baseline gap-2">
						<span class="text-2xl font-bold font-serif text-foreground">
							{data.stats.outfitsWithAffiliate}
						</span>
						<span class="text-xs text-muted-foreground">
							/ {data.stats.totalOutfits} ({Math.round((data.stats.outfitsWithAffiliate / (data.stats.totalOutfits || 1)) * 100)}%)
						</span>
					</div>
				</CardContent>
			</Card>

			<Card class="border-border/80 bg-card rounded-xl">
				<CardContent class="p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-muted-foreground">Item Produk + Shopee</span>
						<LayersIcon class="size-4 text-muted-foreground" />
					</div>
					<div class="mt-2 flex items-baseline gap-2">
						<span class="text-2xl font-bold font-serif text-foreground">
							{data.stats.itemsWithAffiliate}
						</span>
						<span class="text-xs text-muted-foreground">
							/ {data.stats.totalItems} item
						</span>
					</div>
				</CardContent>
			</Card>

			<Card class="border-border/80 bg-card rounded-xl">
				<CardContent class="p-4 sm:p-5">
					<div class="flex items-center justify-between">
						<span class="text-xs font-medium text-muted-foreground">Toko Fallback Shopee</span>
						<SettingsIcon class="size-4 text-muted-foreground" />
					</div>
					<div class="mt-2">
						<span class="inline-block rounded border border-border/80 px-2 py-0.5 text-[11px] font-medium {data.settings.shopee_fallback_url ? 'text-foreground' : 'text-muted-foreground'}">
							{data.settings.shopee_fallback_url ? "Aktif Tersedia" : "Belum diatur"}
						</span>
					</div>
				</CardContent>
			</Card>
		</div>

		<!-- Main Tabs Root bind:value={adminTab} -->
		<Tabs.Root bind:value={adminTab} class="space-y-6">
			<!-- ========================================== -->
			<!-- TAB 1: KELOLA OUTFIT & SHOPEE AFFILIATE -->
			<!-- ========================================== -->
			<Tabs.Content value="outfits" class="space-y-4">
				<!-- Action & Filters Bar -->
				<div class="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-4">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div>
							<h2 class="font-serif text-xl font-normal text-foreground">Daftar Look & Outfit</h2>
							<p class="text-xs text-muted-foreground font-normal">
								Atur formula pakaian, tips padu-padan, dan tautkan link Shopee Affiliate untuk setiap outfit.
							</p>
						</div>

						<div class="flex items-center gap-2 w-full sm:w-auto">
							<Button
								variant="outline"
								size="sm"
								onclick={() => (isResetDialogOpen = true)}
								class="gap-1.5 text-xs font-semibold border-border/80 text-foreground hover:bg-muted hover:text-foreground flex-1 sm:flex-initial"
							>
								<RotateCcwIcon class="size-3.5 text-muted-foreground" />
								<span class="hidden sm:inline">Reset 32 Outfit Bawaan</span>
								<span class="sm:hidden">Reset Bawaan</span>
							</Button>

							<Button
								size="sm"
								onclick={openAddOutfitDialog}
								class="gap-1.5 text-xs font-semibold bg-stone-900 hover:bg-stone-800 text-stone-50 dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 shadow-xs flex-1 sm:flex-initial"
							>
								<PlusIcon class="size-4" />
								<span>Tambah Outfit</span>
							</Button>
						</div>
					</div>

					<!-- Search & Status Filter -->
					<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-border/70">
						<div class="relative flex-1">
							<SearchIcon class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Cari nama outfit, formula, atau tips..."
								bind:value={searchQuery}
								class="pl-9 text-xs border-border/80 bg-background text-foreground"
							/>
						</div>

						<!-- Filter Status Shopee Link -->
						<div class="flex items-center gap-1 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-lg border border-border/60 overflow-x-auto touch-pan-x scrollbar-none shrink-0">
							<button
								type="button"
								onclick={() => (filterAffiliateStatus = "semua")}
								class="rounded-md px-2.5 py-1 text-xs transition-all whitespace-nowrap {filterAffiliateStatus === 'semua' ? 'bg-background shadow-xs font-semibold text-foreground' : 'text-stone-700 dark:text-stone-300 hover:bg-background/60 hover:text-foreground font-medium'}"
							>
								Semua ({data.outfits.length})
							</button>
							<button
								type="button"
								onclick={() => (filterAffiliateStatus = "ada")}
								class="rounded-md px-2.5 py-1 text-xs transition-all whitespace-nowrap {filterAffiliateStatus === 'ada' ? 'bg-background shadow-xs font-semibold text-[#ee4d2d]' : 'text-stone-700 dark:text-stone-300 hover:bg-background/60 hover:text-foreground font-medium'}"
							>
								Ada Link ({data.stats.outfitsWithAffiliate})
							</button>
							<button
								type="button"
								onclick={() => (filterAffiliateStatus = "belum")}
								class="rounded-md px-2.5 py-1 text-xs transition-all whitespace-nowrap {filterAffiliateStatus === 'belum' ? 'bg-background shadow-xs font-semibold text-amber-600 dark:text-amber-400' : 'text-stone-700 dark:text-stone-300 hover:bg-background/60 hover:text-foreground font-medium'}"
							>
								Belum Ada ({data.stats.totalOutfits - data.stats.outfitsWithAffiliate})
							</button>
						</div>
					</div>

					<!-- Filter Situasi / Occasion -->
					<div class="flex flex-wrap gap-1.5 pt-1">
						<button
							type="button"
							onclick={() => (selectedOccasion = "semua")}
							class="rounded-full px-3 py-1 text-xs transition-all {selectedOccasion === 'semua' ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs hover:bg-stone-800 dark:hover:bg-stone-200' : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-stone-50 border border-border/50'}"
						>
							Semua Situasi
						</button>
						{#each occasionOptions as occ}
							<button
								type="button"
								onclick={() => (selectedOccasion = occ.id)}
								class="rounded-full px-3 py-1 text-xs transition-all {selectedOccasion === occ.id ? 'bg-stone-900 text-stone-50 dark:bg-stone-100 dark:text-stone-900 font-semibold shadow-2xs hover:bg-stone-800 dark:hover:bg-stone-200' : 'bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 font-medium hover:bg-stone-200 dark:hover:bg-stone-700 hover:text-stone-950 dark:hover:text-stone-50 border border-border/50'}"
							>
								{occ.label}
							</button>
						{/each}
					</div>
				</div>

				<!-- Outfit Cards Grid -->
				{#if filteredOutfits.length === 0}
					<div class="rounded-xl border border-dashed border-border/80 bg-card p-12 text-center">
						<ShirtIcon class="mx-auto size-10 text-muted-foreground/40 mb-3" />
						<p class="text-sm font-semibold text-foreground">Tidak ada outfit yang cocok dengan filter.</p>
						<p class="text-xs text-muted-foreground mt-1">Coba ubah kata kunci pencarian atau reset filter.</p>
					</div>
				{:else}
					<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{#each filteredOutfits as outfit, idx (outfit.id)}
							{@const hasAffiliate = Boolean(outfit.affiliateUrl?.trim())}
							{@const adminImg = outfit.imageUrl || `/images/real/looks/${outfit.id}.jpg`}
							<Card class="border-border bg-card overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
								<div>
									<!-- Image preview -->
									{#if adminImg}
										<div class="relative h-44 w-full overflow-hidden bg-muted/30 border-b border-border">
											<img
												src={adminImg}
												alt={outfit.name}
												class="h-full w-full object-cover transition-transform duration-300 hover:scale-102"
												loading="lazy"
											/>
										</div>
									{/if}

									<!-- Header Badge -->
									<div class="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
										<Badge variant="outline" class="text-[10px] uppercase font-bold text-foreground bg-background/80 border-border">
											{outfit.occasionLabel}
										</Badge>
										<div class="flex items-center gap-1.5">
											{#if hasAffiliate}
												<Badge class="bg-[#ee4d2d] text-white text-[10px] py-0 px-2 font-semibold">
													Shopee Aktif
												</Badge>
											{:else}
												<Badge variant="secondary" class="text-[10px] py-0 px-2 text-stone-700 dark:text-stone-300 font-medium bg-stone-100 dark:bg-stone-800 border border-border/60">
													Belum Ada Link
												</Badge>
											{/if}
										</div>
									</div>

									<CardHeader class="p-4 pb-2">
										<CardTitle class="font-serif text-base font-bold text-foreground">
											{outfit.name}
										</CardTitle>
										<div class="rounded-md bg-secondary/80 p-2 text-xs font-semibold text-foreground mt-2 border border-border/40">
											{outfit.formula}
										</div>

										<!-- Item Produk dalam Outfit dengan Foto Produk -->
										<div class="flex flex-wrap gap-1.5 pt-1">
											{#each outfit.itemIds as iId}
												{@const itObj = data.items.find(i => i.id === iId)}
												{#if itObj}
													<span class="inline-flex items-center gap-1.5 rounded-lg bg-background border border-border/80 px-2 py-0.5 text-[10px] text-foreground font-medium shadow-2xs">
														{#if itObj.imageUrl}
															<img src={itObj.imageUrl} alt={itObj.name} class="size-3.5 rounded-xs object-cover" />
														{/if}
														<span class="truncate max-w-[120px]">{itObj.name}</span>
													</span>
												{/if}
											{/each}
										</div>
									</CardHeader>

									<CardContent class="p-4 pt-2 space-y-2.5">
										<p class="text-xs text-foreground/80 dark:text-foreground/85 italic line-clamp-2">
											"{outfit.styleTips}"
										</p>

										<!-- Shopee Link Display -->
										<div class="rounded-lg border border-border/80 bg-background p-2.5 text-xs">
											<div class="flex items-center justify-between text-[11px] font-semibold text-foreground mb-1">
												<span class="flex items-center gap-1 text-[#ee4d2d]">
													<ShoppingBagIcon class="size-3 text-[#ee4d2d]" />
													Link Shopee Affiliate:
												</span>
												{#if hasAffiliate}
													<a
														href={outfit.affiliateUrl}
														target="_blank"
														rel="noopener noreferrer"
														class="text-[10px] font-semibold text-[#ee4d2d] hover:text-[#d73211] hover:underline inline-flex items-center gap-0.5"
													>
														Test Buka <ExternalLinkIcon class="size-2.5" />
													</a>
												{/if}
											</div>

											{#if hasAffiliate}
												<div class="flex items-center justify-between gap-2">
													<span class="truncate font-mono text-[11px] text-foreground font-medium select-all">
														{outfit.affiliateUrl}
													</span>
													<button
														type="button"
														onclick={() => copyToClipboard(outfit.affiliateUrl!, "Link Shopee")}
														class="text-stone-600 dark:text-stone-400 hover:text-foreground hover:bg-muted/70 rounded p-1 transition-colors shrink-0"
														title="Salin Link"
													>
														<CopyIcon class="size-3.5" />
													</button>
												</div>
											{:else}
												<span class="text-[11px] text-amber-600 dark:text-amber-400 font-semibold">
													Belum ditambahkan tautan
												</span>
											{/if}
										</div>
									</CardContent>
								</div>

								<!-- Action Buttons -->
								<div class="flex items-center justify-between gap-2 border-t border-border/80 bg-muted/10 p-3">
									<Button
										variant="outline"
										size="sm"
										onclick={() => openEditOutfitDialog(outfit)}
										class="flex-1 gap-1.5 text-xs font-semibold text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground border-border/80"
									>
										<PencilIcon class="size-3.5" />
										<span>Edit & Link Shopee</span>
									</Button>

									<Button
										variant="ghost"
										size="sm"
										onclick={() => confirmDeleteOutfit(outfit.id)}
										class="text-destructive hover:bg-destructive/15 hover:text-destructive px-2.5 transition-colors"
										title="Hapus Outfit"
									>
										<Trash2Icon class="size-3.5" />
									</Button>
								</div>
							</Card>
						{/each}
					</div>
				{/if}
			</Tabs.Content>

			<!-- ========================================== -->
			<!-- TAB 2: KELOLA ITEM BELANJA & LINK SHOPEE -->
			<!-- ========================================== -->
			<Tabs.Content value="items" class="space-y-4">
				<div class="rounded-2xl border border-border bg-card p-6 space-y-4">
					<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
						<div>
							<h2 class="font-serif text-xl font-bold text-foreground">Link Shopee Per Produk Pakaian</h2>
							<p class="text-xs sm:text-sm text-muted-foreground mt-0.5">
								Atur tautan Shopee Affiliate untuk setiap produk pakaian. Tautan ini otomatis muncul di dalam daftar item setiap kartu Look Outfit dan di tab Daftar Belanja.
							</p>
						</div>

						<Button
							size="sm"
							onclick={openAddItemDialog}
							class="gap-1.5 text-xs bg-[#ee4d2d] hover:bg-[#d73211] text-white hover:text-white font-semibold shadow-xs shrink-0"
						>
							<PlusIcon class="size-4" />
							<span>Tambah Produk Baru</span>
						</Button>
					</div>

					<!-- Search & Status Filter for Items -->
					<div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
						<div class="relative flex-1">
							<SearchIcon class="absolute left-3 top-2.5 size-4 text-muted-foreground" />
							<Input
								type="search"
								placeholder="Cari nama produk pakaian atau kategori..."
								bind:value={searchItemQuery}
								class="pl-9 text-xs border-border/80 bg-background text-foreground"
							/>
						</div>

						<div class="flex items-center gap-1.5 bg-stone-100 dark:bg-stone-800/80 p-1 rounded-lg border border-border/60 overflow-x-auto touch-pan-x scrollbar-none shrink-0">
							<button
								type="button"
								onclick={() => (filterItemStatus = "semua")}
								class="rounded-md px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap {filterItemStatus === 'semua' ? 'bg-background shadow-xs text-foreground' : 'text-stone-700 dark:text-stone-300 hover:bg-background/60 hover:text-foreground'}"
							>
								Semua ({data.items.length})
							</button>
							<button
								type="button"
								onclick={() => (filterItemStatus = "ada")}
								class="rounded-md px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap {filterItemStatus === 'ada' ? 'bg-background shadow-xs text-[#ee4d2d]' : 'text-stone-700 dark:text-stone-300 hover:bg-background/60 hover:text-foreground'}"
							>
								Ada Link ({data.stats.itemsWithAffiliate})
							</button>
							<button
								type="button"
								onclick={() => (filterItemStatus = "belum")}
								class="rounded-md px-2.5 py-1 text-xs font-semibold transition-all whitespace-nowrap {filterItemStatus === 'belum' ? 'bg-background shadow-xs text-amber-600 dark:text-amber-400' : 'text-stone-700 dark:text-stone-300 hover:bg-background/60 hover:text-foreground'}"
							>
								Belum Ada ({data.stats.totalItems - data.stats.itemsWithAffiliate})
							</button>
						</div>
					</div>

					<div class="mt-4 divide-y divide-border/80">
						{#each filteredItems as item (item.id)}
							{@const hasAffiliate = Boolean(item.affiliateUrl?.trim())}
							<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
								<div class="flex items-center gap-3.5 flex-1 min-w-0">
									<!-- Foto Thumbnail Produk Pakaian -->
									<div class="size-14 rounded-xl border border-border/80 bg-muted/30 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
										{#if item.imageUrl}
											<img src={item.imageUrl} alt={item.name} class="size-full object-cover" />
										{:else}
											<ShirtIcon class="size-6 text-muted-foreground/30" />
										{/if}
									</div>

									<div class="space-y-1 flex-1 min-w-0">
										<div class="flex flex-wrap items-center gap-2">
											<span class="font-serif text-sm font-bold text-foreground">
												{item.name}
											</span>
											<Badge variant="outline" class="text-[10px] uppercase font-bold text-foreground bg-background border-border">
												{item.category}
											</Badge>
											{#if item.priceEstimate}
												<span class="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
													{item.priceEstimate}
												</span>
											{/if}
										</div>

										{#if hasAffiliate}
											<div class="flex items-center gap-2 text-xs min-w-0">
												<span class="text-[#ee4d2d] font-semibold flex items-center gap-1 shrink-0">
													<ShoppingBagIcon class="size-3" />
													Shopee:
												</span>
												<span class="truncate font-mono text-[11px] text-foreground/80 max-w-[150px] sm:max-w-sm md:max-w-md">
													{item.affiliateUrl}
												</span>
												<a
													href={item.affiliateUrl}
													target="_blank"
													rel="noopener noreferrer"
													class="text-[10px] font-semibold text-[#ee4d2d] hover:text-[#d73211] hover:underline inline-flex items-center gap-0.5 shrink-0"
												>
													Cek <ExternalLinkIcon class="size-2.5" />
												</a>
											</div>
										{:else}
											<p class="text-xs text-amber-600 dark:text-amber-400 font-semibold">
												⚠ Belum ada tautan Shopee Affiliate untuk produk ini
											</p>
										{/if}
									</div>
								</div>

								<div class="flex items-center gap-2 shrink-0 self-end sm:self-center">
									<Button
										variant="outline"
										size="sm"
										onclick={() => openEditItemDialog(item)}
										class="gap-1.5 text-xs font-semibold text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 hover:text-foreground border-border/80"
									>
										<PencilIcon class="size-3.5" />
										<span>Edit Produk & Foto</span>
									</Button>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</Tabs.Content>

			<!-- ========================================== -->
			<!-- TAB 3: KUSTOMISASI HERO & TONE COLOR -->
			<!-- ========================================== -->
			<Tabs.Content value="hero" class="space-y-6">
				<!-- Header Section -->
				<div class="rounded-xl border border-border/80 bg-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<span class="inline-flex size-6 items-center justify-center rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
								<SparklesIcon class="size-4" />
							</span>
							<h2 class="font-serif text-xl font-normal text-foreground">Pengaturan Hero & Tone Color</h2>
						</div>
						<p class="text-xs text-muted-foreground">
							Kustomisasi kata-kata headline, deskripsi, tombol CTA, serta tentukan tone color (Warm, Cool, Netral) dan palet warna yang tampil di Hero beranda.
						</p>
					</div>

					<div class="flex items-center gap-2 shrink-0">
						<Button
							variant="outline"
							size="sm"
							onclick={() => (isResetHeroDialogOpen = true)}
							class="gap-1.5 text-xs font-semibold border-border/80 text-foreground hover:bg-muted hover:text-foreground"
						>
							<RotateCcwIcon class="size-3.5 text-muted-foreground" />
							<span>Reset ke Standar</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							href="/"
							target="_blank"
							class="gap-1.5 text-xs font-semibold border-border/80 text-foreground hover:bg-muted hover:text-foreground"
						>
							<GlobeIcon class="size-3.5 text-muted-foreground" />
							<span>Lihat di Beranda</span>
							<ExternalLinkIcon class="size-3 opacity-60" />
						</Button>
					</div>
				</div>

				<!-- Grid Utama: Form Editor (Kiri) & Live Preview (Kanan) -->
				<div class="grid gap-6 xl:grid-cols-12 items-start">
					<!-- KOLOM KIRI: FORM EDITOR -->
					<div class="xl:col-span-7 space-y-6">
						<form
							action="?/saveHeroSettings"
							method="POST"
							use:enhance={() => {
								return async ({ update, result }) => {
									await update();
									if (result.type === "success") {
										toast.success("Pengaturan teks Hero & Tone Color berhasil disimpan!");
									} else {
										toast.error("Gagal menyimpan pengaturan Hero.");
									}
								};
							}}
							class="space-y-6"
						>
							<!-- Hidden fields untuk data JSON warna tone & default tone -->
							<input type="hidden" name="hero_default_tone" value={heroDefaultTone} />
							<input type="hidden" name="hero_tone_warm_colors" value={JSON.stringify(warmColors)} />
							<input type="hidden" name="hero_tone_cool_colors" value={JSON.stringify(coolColors)} />
							<input type="hidden" name="hero_tone_neutral_colors" value={JSON.stringify(neutralColors)} />

							<!-- Sub-Tabs Selector Editor: Kata-kata vs Tone Color -->
							<div class="flex items-center gap-2 p-1 rounded-xl bg-stone-100 dark:bg-stone-900 border border-border">
								<button
									type="button"
									onclick={() => (heroEditorSubTab = "words")}
									class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all {heroEditorSubTab === 'words' ? 'bg-background text-foreground shadow-xs border border-border/70' : 'text-muted-foreground hover:text-foreground'}"
								>
									<TypeIcon class="size-3.5" />
									<span>Kata-Kata Hero</span>
								</button>
								<button
									type="button"
									onclick={() => (heroEditorSubTab = "tones")}
									class="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all {heroEditorSubTab === 'tones' ? 'bg-background text-foreground shadow-xs border border-border/70' : 'text-muted-foreground hover:text-foreground'}"
								>
									<PaletteIcon class="size-3.5" />
									<span>Penentuan Tone Color</span>
								</button>
							</div>

							<!-- TAB SUB 1: KATA-KATA HERO -->
							{#if heroEditorSubTab === "words"}
								<!-- Kartu 1: Headline & Copywriting Utama -->
								<Card class="border-border shadow-xs">
									<CardHeader class="pb-3">
										<CardTitle class="font-serif text-base font-bold flex items-center gap-2">
											<TypeIcon class="size-4 text-primary" />
											Headline & Teks Utama
										</CardTitle>
										<CardDescription class="text-xs">
											Teks judul besar dan paragraf deskripsi value proposition di Hero section.
										</CardDescription>
									</CardHeader>
									<CardContent class="space-y-4 pt-1">
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div class="space-y-1.5">
												<Label for="hero_title_1" class="text-xs font-semibold">Judul Baris 1</Label>
												<Input
													id="hero_title_1"
													name="hero_title_1"
													type="text"
													bind:value={heroTitle1}
													placeholder="Lebih sedikit pakaian,"
													class="text-xs"
													required
												/>
												<p class="text-[10px] text-muted-foreground">Teks baris pertama headline.</p>
											</div>

											<div class="space-y-1.5">
												<Label for="hero_title_2" class="text-xs font-semibold">Judul Baris 2 (Aksen / Italic)</Label>
												<Input
													id="hero_title_2"
													name="hero_title_2"
													type="text"
													bind:value={heroTitle2}
													placeholder="lebih banyak gaya."
													class="text-xs font-medium italic"
													required
												/>
												<p class="text-[10px] text-muted-foreground">Teks baris kedua berformat miring elegan.</p>
											</div>
										</div>

										<div class="space-y-1.5">
											<Label for="hero_description" class="text-xs font-semibold">Paragraf Deskripsi Hero</Label>
											<textarea
												id="hero_description"
												name="hero_description"
												rows="3"
												bind:value={heroDescription}
												placeholder="Tuliskan deskripsi ringkas dan memikat mengenai capsule wardrobe..."
												class="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
												required
											></textarea>
											<p class="text-[10px] text-muted-foreground">Penjelasan singkat di bawah headline yang memandu pengguna mengambil tes gaya.</p>
										</div>
									</CardContent>
								</Card>

								<!-- Kartu 2: Tombol CTA & Jaminan -->
								<Card class="border-border shadow-xs">
									<CardHeader class="pb-3">
										<CardTitle class="font-serif text-base font-bold flex items-center gap-2">
											<ArrowRightIcon class="size-4 text-primary" />
											Tombol Aksi (CTA) & Catatan
										</CardTitle>
										<CardDescription class="text-xs">
											Sesuaikan label tombol navigasi dan teks penjelas di bawah tombol.
										</CardDescription>
									</CardHeader>
									<CardContent class="space-y-4 pt-1">
										<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div class="space-y-1.5">
												<Label for="hero_cta_text" class="text-xs font-semibold">Teks Tombol Utama</Label>
												<Input
													id="hero_cta_text"
													name="hero_cta_text"
													type="text"
													bind:value={heroCtaText}
													placeholder="Mulai Style Check"
													class="text-xs font-semibold"
													required
												/>
											</div>

											<div class="space-y-1.5">
												<Label for="hero_cta_secondary_text" class="text-xs font-semibold">Teks Tombol Sekunder (Lookbook)</Label>
												<Input
													id="hero_cta_secondary_text"
													name="hero_cta_secondary_text"
													type="text"
													bind:value={heroCtaSecondaryText}
													placeholder="Lihat Contoh Lookbook"
													class="text-xs"
													required
												/>
											</div>
										</div>

										<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<div class="space-y-1.5">
												<Label for="hero_cta_subtext" class="text-xs font-semibold">Subteks / Jaminan di Bawah Tombol</Label>
												<Input
													id="hero_cta_subtext"
													name="hero_cta_subtext"
													type="text"
													bind:value={heroCtaSubtext}
													placeholder="Gratis · Sekitar 3 menit · Langsung siap pakai"
													class="text-xs"
												/>
												<p class="text-[10px] text-muted-foreground">Menghilangkan keraguan pengunjung untuk mencoba.</p>
											</div>

											<div class="space-y-1.5">
												<Label for="hero_floating_text" class="text-xs font-semibold">Teks Badge / Floating Pill</Label>
												<Input
													id="hero_floating_text"
													name="hero_floating_text"
													type="text"
													bind:value={heroFloatingText}
													placeholder="Deteksi warna urat nadi pergelangan tangan otomatis"
													class="text-xs"
												/>
												<p class="text-[10px] text-muted-foreground">Teks pada pill melayang di bawah kartu palet hero.</p>
											</div>
										</div>
									</CardContent>
								</Card>

								<!-- Kartu 3: Tiga Kolom Statistik Hero -->
								<Card class="border-border shadow-xs">
									<CardHeader class="pb-3">
										<CardTitle class="font-serif text-base font-bold flex items-center gap-2">
											<SlidersHorizontalIcon class="size-4 text-primary" />
											3 Angka Statistik Hero
										</CardTitle>
										<CardDescription class="text-xs">
											Tiga metrik kunci yang membuktikan efisiensi sistem capsule wardrobe.
										</CardDescription>
									</CardHeader>
									<CardContent class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
										<div class="rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-3 space-y-2">
											<span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Statistik 1</span>
											<Input
												name="hero_stat_1_val"
												bind:value={heroStat1Val}
												placeholder="12 Item"
												class="text-xs font-serif font-bold bg-background"
											/>
											<Input
												name="hero_stat_1_lbl"
												bind:value={heroStat1Lbl}
												placeholder="Wardrobe esensial"
												class="text-[11px] bg-background text-muted-foreground"
											/>
										</div>

										<div class="rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-3 space-y-2">
											<span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Statistik 2</span>
											<Input
												name="hero_stat_2_val"
												bind:value={heroStat2Val}
												placeholder="30+ Look"
												class="text-xs font-serif font-bold bg-background"
											/>
											<Input
												name="hero_stat_2_lbl"
												bind:value={heroStat2Lbl}
												placeholder="Kombinasi siap pakai"
												class="text-[11px] bg-background text-muted-foreground"
											/>
										</div>

										<div class="rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-3 space-y-2">
											<span class="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">Statistik 3</span>
											<Input
												name="hero_stat_3_val"
												bind:value={heroStat3Val}
												placeholder="100%"
												class="text-xs font-serif font-bold bg-background"
											/>
											<Input
												name="hero_stat_3_lbl"
												bind:value={heroStat3Lbl}
												placeholder="Gratis selamanya"
												class="text-[11px] bg-background text-muted-foreground"
											/>
										</div>
									</CardContent>
								</Card>
							{:else}
								<!-- TAB SUB 2: PENENTUAN TONE COLOR -->
								<!-- KARTU A: PILIHAN DEFAULT TONE HERO -->
								<Card class="border-border shadow-xs">
									<CardHeader class="pb-3">
										<CardTitle class="font-serif text-base font-bold flex items-center gap-2">
											<PaletteIcon class="size-4 text-primary" />
											Menentukan Default Tone Color
										</CardTitle>
										<CardDescription class="text-xs">
											Tentukan undertone mana yang langsung aktif dan terpilih pertama kali saat pengunjung membuka halaman utama.
										</CardDescription>
									</CardHeader>
									<CardContent class="space-y-3 pt-1">
										<div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
											<!-- Warm Tone -->
											<button
												type="button"
												onclick={() => {
													heroDefaultTone = "hangat";
													previewTone = "hangat";
													toneEditorTab = "hangat";
												}}
												class="flex flex-col text-left p-3.5 rounded-xl border transition-all {heroDefaultTone === 'hangat' ? 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 ring-2 ring-amber-500/20' : 'border-border bg-card hover:bg-stone-50 dark:hover:bg-stone-900'}"
											>
												<div class="flex items-center justify-between w-full">
													<span class="text-xs font-bold text-foreground flex items-center gap-1.5">
														<span>☀️ Warm Tone</span>
													</span>
													{#if heroDefaultTone === "hangat"}
														<CheckCircle2Icon class="size-4 text-amber-500 shrink-0" />
													{/if}
												</div>
												<span class="text-[11px] text-muted-foreground mt-1">Urat nadi kehijauan</span>
												<div class="mt-2.5 flex items-center gap-1">
													{#each warmColors.slice(0, 5) as c}
														<span class="size-3.5 rounded-full border border-black/15 shadow-2xs" style="background-color: {c.hex}"></span>
													{/each}
												</div>
											</button>

											<!-- Cool Tone -->
											<button
												type="button"
												onclick={() => {
													heroDefaultTone = "dingin";
													previewTone = "dingin";
													toneEditorTab = "dingin";
												}}
												class="flex flex-col text-left p-3.5 rounded-xl border transition-all {heroDefaultTone === 'dingin' ? 'border-sky-500 bg-sky-50/50 dark:bg-sky-950/20 ring-2 ring-sky-500/20' : 'border-border bg-card hover:bg-stone-50 dark:hover:bg-stone-900'}"
											>
												<div class="flex items-center justify-between w-full">
													<span class="text-xs font-bold text-foreground flex items-center gap-1.5">
														<span>❄️ Cool Tone</span>
													</span>
													{#if heroDefaultTone === "dingin"}
														<CheckCircle2Icon class="size-4 text-sky-500 shrink-0" />
													{/if}
												</div>
												<span class="text-[11px] text-muted-foreground mt-1">Urat nadi kebiruan</span>
												<div class="mt-2.5 flex items-center gap-1">
													{#each coolColors.slice(0, 5) as c}
														<span class="size-3.5 rounded-full border border-black/15 shadow-2xs" style="background-color: {c.hex}"></span>
													{/each}
												</div>
											</button>

											<!-- Neutral Tone -->
											<button
												type="button"
												onclick={() => {
													heroDefaultTone = "netral";
													previewTone = "netral";
													toneEditorTab = "netral";
												}}
												class="flex flex-col text-left p-3.5 rounded-xl border transition-all {heroDefaultTone === 'netral' ? 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 ring-2 ring-emerald-500/20' : 'border-border bg-card hover:bg-stone-50 dark:hover:bg-stone-900'}"
											>
												<div class="flex items-center justify-between w-full">
													<span class="text-xs font-bold text-foreground flex items-center gap-1.5">
														<span>⚖️ Neutral Tone</span>
													</span>
													{#if heroDefaultTone === "netral"}
														<CheckCircle2Icon class="size-4 text-emerald-500 shrink-0" />
													{/if}
												</div>
												<span class="text-[11px] text-muted-foreground mt-1">Urat nadi campuran</span>
												<div class="mt-2.5 flex items-center gap-1">
													{#each neutralColors.slice(0, 5) as c}
														<span class="size-3.5 rounded-full border border-black/15 shadow-2xs" style="background-color: {c.hex}"></span>
													{/each}
												</div>
											</button>
										</div>
									</CardContent>
								</Card>

								<!-- KARTU B: EDITOR WARNA PALET PER TONE -->
								<Card class="border-border shadow-xs">
									<CardHeader class="pb-3">
										<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
											<div>
												<CardTitle class="font-serif text-base font-bold flex items-center gap-2">
													<SlidersHorizontalIcon class="size-4 text-primary" />
													Kustomisasi Swatch & Palet Tone Color
												</CardTitle>
												<CardDescription class="text-xs">
													Pilih tone di bawah untuk mengubah kode warna hex dan nama warna 6 swatch esensial.
												</CardDescription>
											</div>

											<!-- Switcher Tone yang sedang diedit -->
											<div class="flex items-center gap-1 p-1 rounded-lg bg-stone-100 dark:bg-stone-800 border border-border/70 shrink-0">
												<button
													type="button"
													onclick={() => {
														toneEditorTab = "hangat";
														previewTone = "hangat";
													}}
													class="rounded-md py-1 px-2.5 text-xs transition-all {toneEditorTab === 'hangat' ? 'bg-background shadow-xs font-bold text-foreground border border-border/60' : 'text-stone-700 dark:text-stone-300 font-medium'}"
												>
													Warm
												</button>
												<button
													type="button"
													onclick={() => {
														toneEditorTab = "dingin";
														previewTone = "dingin";
													}}
													class="rounded-md py-1 px-2.5 text-xs transition-all {toneEditorTab === 'dingin' ? 'bg-background shadow-xs font-bold text-foreground border border-border/60' : 'text-stone-700 dark:text-stone-300 font-medium'}"
												>
													Cool
												</button>
												<button
													type="button"
													onclick={() => {
														toneEditorTab = "netral";
														previewTone = "netral";
													}}
													class="rounded-md py-1 px-2.5 text-xs transition-all {toneEditorTab === 'netral' ? 'bg-background shadow-xs font-bold text-foreground border border-border/60' : 'text-stone-700 dark:text-stone-300 font-medium'}"
												>
													Neutral
												</button>
											</div>
										</div>
									</CardHeader>

									<CardContent class="space-y-4 pt-1">
										{#if toneEditorTab === "hangat"}
											<!-- Info Palet Warm -->
											<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div class="space-y-1.5">
													<Label for="hero_tone_warm_name" class="text-xs font-semibold">Nama Palet Warm Tone</Label>
													<Input
														id="hero_tone_warm_name"
														name="hero_tone_warm_name"
														type="text"
														bind:value={warmName}
														placeholder="Warm Earth & Sun"
														class="text-xs"
													/>
												</div>
												<div class="space-y-1.5">
													<Label for="hero_tone_warm_desc" class="text-xs font-semibold">Deskripsi Nuansa Warna</Label>
													<Input
														id="hero_tone_warm_desc"
														name="hero_tone_warm_desc"
														type="text"
														bind:value={warmDesc}
														placeholder="Nuansa bumi hangat: broken white, camel, espresso..."
														class="text-xs"
													/>
												</div>
											</div>

											<!-- 6 Color Swatches Editor Warm -->
											<div class="space-y-2 pt-2">
												<Label class="text-xs font-semibold text-foreground flex items-center justify-between">
													<span>6 Warna Kunci (4 Dasar + 2 Aksen)</span>
													<button
														type="button"
														onclick={() => (warmColors = JSON.parse(JSON.stringify(defaultWarmColors)))}
														class="text-[11px] font-medium text-muted-foreground hover:text-foreground underline"
													>
														Reset Warna Warm
													</button>
												</Label>

												<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
													{#each warmColors as col, i}
														<div class="flex items-center gap-2 p-2 rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30">
															<input
																type="color"
																bind:value={col.hex}
																class="size-8 rounded-lg border border-black/15 dark:border-white/20 cursor-pointer shrink-0 p-0 bg-transparent"
																title="Pilih warna swatch"
															/>
															<div class="min-w-0 flex-1 grid grid-cols-2 gap-1.5">
																<Input
																	type="text"
																	bind:value={col.name}
																	placeholder="Nama warna"
																	class="text-xs h-7 px-2"
																/>
																<Input
																	type="text"
																	bind:value={col.hex}
																	placeholder="#HEX"
																	class="text-xs h-7 px-2 font-mono uppercase"
																/>
															</div>
															<span class="text-[9px] font-semibold px-1.5 py-0.5 rounded border {i < 4 ? 'bg-secondary text-foreground' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'} shrink-0">
																{i < 4 ? 'Base' : 'Aksen'}
															</span>
														</div>
													{/each}
												</div>
											</div>
										{:else if toneEditorTab === "dingin"}
											<!-- Info Palet Cool -->
											<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div class="space-y-1.5">
													<Label for="hero_tone_cool_name" class="text-xs font-semibold">Nama Palet Cool Tone</Label>
													<Input
														id="hero_tone_cool_name"
														name="hero_tone_cool_name"
														type="text"
														bind:value={coolName}
														placeholder="Cool Slate & Coastal"
														class="text-xs"
													/>
												</div>
												<div class="space-y-1.5">
													<Label for="hero_tone_cool_desc" class="text-xs font-semibold">Deskripsi Nuansa Warna</Label>
													<Input
														id="hero_tone_cool_desc"
														name="hero_tone_cool_desc"
														type="text"
														bind:value={coolDesc}
														placeholder="Nuansa sejuk berkelas: pure white, classic navy..."
														class="text-xs"
													/>
												</div>
											</div>

											<!-- 6 Color Swatches Editor Cool -->
											<div class="space-y-2 pt-2">
												<Label class="text-xs font-semibold text-foreground flex items-center justify-between">
													<span>6 Warna Kunci (4 Dasar + 2 Aksen)</span>
													<button
														type="button"
														onclick={() => (coolColors = JSON.parse(JSON.stringify(defaultCoolColors)))}
														class="text-[11px] font-medium text-muted-foreground hover:text-foreground underline"
													>
														Reset Warna Cool
													</button>
												</Label>

												<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
													{#each coolColors as col, i}
														<div class="flex items-center gap-2 p-2 rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30">
															<input
																type="color"
																bind:value={col.hex}
																class="size-8 rounded-lg border border-black/15 dark:border-white/20 cursor-pointer shrink-0 p-0 bg-transparent"
																title="Pilih warna swatch"
															/>
															<div class="min-w-0 flex-1 grid grid-cols-2 gap-1.5">
																<Input
																	type="text"
																	bind:value={col.name}
																	placeholder="Nama warna"
																	class="text-xs h-7 px-2"
																/>
																<Input
																	type="text"
																	bind:value={col.hex}
																	placeholder="#HEX"
																	class="text-xs h-7 px-2 font-mono uppercase"
																/>
															</div>
															<span class="text-[9px] font-semibold px-1.5 py-0.5 rounded border {i < 4 ? 'bg-secondary text-foreground' : 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'} shrink-0">
																{i < 4 ? 'Base' : 'Aksen'}
															</span>
														</div>
													{/each}
												</div>
											</div>
										{:else}
											<!-- Info Palet Neutral -->
											<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
												<div class="space-y-1.5">
													<Label for="hero_tone_neutral_name" class="text-xs font-semibold">Nama Palet Neutral Tone</Label>
													<Input
														id="hero_tone_neutral_name"
														name="hero_tone_neutral_name"
														type="text"
														bind:value={neutralName}
														placeholder="Neutral Mineral & Stone"
														class="text-xs"
													/>
												</div>
												<div class="space-y-1.5">
													<Label for="hero_tone_neutral_desc" class="text-xs font-semibold">Deskripsi Nuansa Warna</Label>
													<Input
														id="hero_tone_neutral_desc"
														name="hero_tone_neutral_desc"
														type="text"
														bind:value={neutralDesc}
														placeholder="Nuansa netral seimbang: soft ecru, midnight graphite..."
														class="text-xs"
													/>
												</div>
											</div>

											<!-- 6 Color Swatches Editor Neutral -->
											<div class="space-y-2 pt-2">
												<Label class="text-xs font-semibold text-foreground flex items-center justify-between">
													<span>6 Warna Kunci (4 Dasar + 2 Aksen)</span>
													<button
														type="button"
														onclick={() => (neutralColors = JSON.parse(JSON.stringify(defaultNeutralColors)))}
														class="text-[11px] font-medium text-muted-foreground hover:text-foreground underline"
													>
														Reset Warna Neutral
													</button>
												</Label>

												<div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
													{#each neutralColors as col, i}
														<div class="flex items-center gap-2 p-2 rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30">
															<input
																type="color"
																bind:value={col.hex}
																class="size-8 rounded-lg border border-black/15 dark:border-white/20 cursor-pointer shrink-0 p-0 bg-transparent"
																title="Pilih warna swatch"
															/>
															<div class="min-w-0 flex-1 grid grid-cols-2 gap-1.5">
																<Input
																	type="text"
																	bind:value={col.name}
																	placeholder="Nama warna"
																	class="text-xs h-7 px-2"
																/>
																<Input
																	type="text"
																	bind:value={col.hex}
																	placeholder="#HEX"
																	class="text-xs h-7 px-2 font-mono uppercase"
																/>
															</div>
															<span class="text-[9px] font-semibold px-1.5 py-0.5 rounded border {i < 4 ? 'bg-secondary text-foreground' : 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'} shrink-0">
																{i < 4 ? 'Base' : 'Aksen'}
															</span>
														</div>
													{/each}
												</div>
											</div>
										{/if}
									</CardContent>
								</Card>
							{/if}

							<!-- Tombol Simpan Perubahan -->
							<div class="sticky bottom-4 z-10 p-3 rounded-xl border border-border/80 bg-card/95 backdrop-blur shadow-md flex items-center justify-between gap-3">
								<div class="flex items-center gap-2 text-xs text-muted-foreground">
									<CheckIcon class="size-3.5 text-emerald-500" />
									<span>Semua perubahan live preview langsung terlihat</span>
								</div>
								<Button
									type="submit"
									class="px-6 font-semibold text-xs bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 shadow-sm"
								>
									Simpan Pengaturan Hero & Tone
								</Button>
							</div>
						</form>
					</div>

					<!-- KOLOM KANAN: LIVE PREVIEW HERO INTERAKTIF -->
					<div class="xl:col-span-5 sticky top-20 space-y-4">
						<Card class="border-border shadow-sm overflow-hidden">
							<CardHeader class="pb-3 border-b border-border/60 bg-stone-50/50 dark:bg-stone-900/40">
								<div class="flex items-center justify-between">
									<CardTitle class="font-serif text-sm font-bold flex items-center gap-2">
										<EyeIcon class="size-4 text-emerald-500" />
										Live Preview Beranda
									</CardTitle>
									<span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
										Real-time
									</span>
								</div>
								<CardDescription class="text-[11px]">
									Tampilan hasil render yang akan dilihat pengguna di halaman beranda.
								</CardDescription>
							</CardHeader>

							<CardContent class="p-4 sm:p-5 space-y-5 bg-background">
								<!-- Preview Teks Kiri Hero -->
								<div class="space-y-3 border-b border-border/60 pb-4">
									<h3 class="font-serif text-xl sm:text-2xl font-normal tracking-tight text-foreground leading-[1.2]">
										{heroTitle1} <br />
										<span class="italic text-foreground font-medium">{heroTitle2}</span>
									</h3>

									<p class="text-xs text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
										{heroDescription}
									</p>

									<div class="flex flex-wrap items-center gap-2 pt-1">
										<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-2xs">
											{heroCtaText}
											<ArrowRightIcon class="size-3" />
										</span>
										<span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold border border-border text-foreground">
											<CompassIcon class="size-3" />
											{heroCtaSecondaryText}
										</span>
									</div>
									<p class="text-[10px] text-muted-foreground">{heroCtaSubtext}</p>

									<!-- 3 Stats Preview -->
									<div class="grid grid-cols-3 gap-2 border-t border-border/60 pt-3 text-center">
										<div>
											<div class="font-serif text-sm font-bold text-foreground">{heroStat1Val}</div>
											<div class="text-[9px] text-muted-foreground truncate">{heroStat1Lbl}</div>
										</div>
										<div>
											<div class="font-serif text-sm font-bold text-foreground">{heroStat2Val}</div>
											<div class="text-[9px] text-muted-foreground truncate">{heroStat2Lbl}</div>
										</div>
										<div>
											<div class="font-serif text-sm font-bold text-foreground">{heroStat3Val}</div>
											<div class="text-[9px] text-muted-foreground truncate">{heroStat3Lbl}</div>
										</div>
									</div>
								</div>

								<!-- Preview Kartu Color Palette & Capsule -->
								<div class="rounded-xl border border-border/80 bg-card p-3.5 shadow-2xs space-y-3">
									<div class="flex items-center justify-between border-b border-border/60 pb-2.5">
										<div class="flex items-center gap-1.5">
											<div class="flex size-6 items-center justify-center rounded-md bg-stone-100 dark:bg-stone-800 text-foreground">
												<PaletteIcon class="size-3.5" />
											</div>
											<span class="text-[11px] font-bold text-foreground uppercase tracking-wider">Color Palette</span>
										</div>

										<!-- Preview Tone Switcher -->
										<div class="flex items-center gap-1 p-0.5 rounded-md bg-stone-100 dark:bg-stone-800 border border-border/60">
											{#each [
												{ id: "hangat", label: "Warm" },
												{ id: "dingin", label: "Cool" },
												{ id: "netral", label: "Neutral" }
											] as t}
												<button
													type="button"
													onclick={() => (previewTone = t.id as any)}
													class="rounded py-0.5 px-2 text-[10px] transition-all {previewTone === t.id ? 'bg-background shadow-2xs font-bold text-foreground border border-border/60' : 'text-stone-600 dark:text-stone-400 font-medium'}"
												>
													{t.label}
												</button>
											{/each}
										</div>
									</div>

									<div class="flex items-center justify-between">
										<div>
											<h4 class="font-serif text-xs font-bold text-foreground">
												{currentPreviewPalette.name}
											</h4>
											<span class="text-[10px] text-muted-foreground">
												Deteksi: <strong class="text-foreground">{currentPreviewPalette.veinText}</strong>
											</span>
										</div>
										<span class="text-[9px] font-semibold px-1.5 py-0.5 rounded border border-border/80 bg-stone-50 dark:bg-stone-900/60 text-foreground">
											6 Warna Kunci
										</span>
									</div>

									<!-- 6 Swatches Preview -->
									<div class="grid grid-cols-6 gap-1.5">
										{#each currentPreviewPalette.colors as col}
											<div class="flex flex-col items-center rounded-lg border border-border/70 bg-stone-50 dark:bg-stone-900/40 p-1.5 text-center">
												<span
													class="size-6 rounded-md border border-black/15 shadow-2xs"
													style="background-color: {col.hex}"
												></span>
												<span class="mt-1 text-[8px] font-bold text-foreground truncate w-full" title={col.name}>
													{col.name}
												</span>
												<span class="text-[7px] font-mono text-muted-foreground">{col.hex}</span>
											</div>
										{/each}
									</div>

									<!-- Floating Pill -->
									<div class="rounded-full border border-border bg-stone-50 dark:bg-stone-900/50 px-2.5 py-1 text-[10px] font-semibold text-foreground flex items-center gap-1.5">
										<span class="size-1.5 rounded-full bg-emerald-500 shrink-0"></span>
										<span class="truncate">{heroFloatingText}</span>
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</Tabs.Content>

			<!-- ========================================== -->
			<!-- TAB 4: PENGATURAN SHOPEE GLOBAL & TIPS -->
			<!-- ========================================== -->
			<Tabs.Content value="settings" class="space-y-6">
				<!-- Header Section -->
				<div class="rounded-xl border border-border/80 bg-card p-4 sm:p-5 space-y-1">
					<h2 class="font-serif text-xl font-normal text-foreground">Pengaturan Sistem & Akun</h2>
					<p class="text-xs text-muted-foreground">
						Kelola identitas website, logo, akun & keamanan admin, serta konfigurasi integrasi Shopee Affiliate & AI.
					</p>
				</div>

				<!-- Banner Shortcut ke Pengaturan Hero & Tone Color -->
				<div class="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
					<div class="flex items-center gap-2.5">
						<span class="inline-flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 shrink-0">
							<SparklesIcon class="size-4" />
						</span>
						<div>
							<h3 class="text-xs font-bold text-foreground">Pengaturan Kata-Kata Hero & Tone Color</h3>
							<p class="text-[11px] text-muted-foreground">Kustomisasi judul, deskripsi hero, default tone, dan kode warna swatch di tab khusus.</p>
						</div>
					</div>
					<Button
						type="button"
						variant="outline"
						size="sm"
						onclick={() => (adminTab = "hero")}
						class="text-xs font-semibold gap-1.5 shrink-0 bg-background hover:bg-stone-100 dark:hover:bg-stone-800 text-foreground"
					>
						<span>Buka Tab Hero & Tone</span>
						<ArrowRightIcon class="size-3.5" />
					</Button>
				</div>

				<div class="grid gap-6 lg:grid-cols-2">
					<!-- KARTU 1: IDENTITAS & LOGO WEBSITE -->
					<Card class="border-border shadow-xs">
						<CardHeader>
							<CardTitle class="font-serif text-lg font-bold flex items-center gap-2">
								<GlobeIcon class="size-4 text-primary" />
								Identitas & Logo Website
							</CardTitle>
							<CardDescription class="text-xs text-muted-foreground">
								Nama merek, slogan, dan logo yang tampil di seluruh landing page dan dashboard.
							</CardDescription>
						</CardHeader>
						<form
							action="?/saveSettings"
							method="POST"
							enctype="multipart/form-data"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									toast.success("Identitas website & logo berhasil diperbarui!");
								};
							}}
						>
							<CardContent class="space-y-4 pt-2">
								<div class="space-y-2">
									<Label for="site_name" class="text-xs font-semibold">Nama Website / Brand</Label>
									<Input
										id="site_name"
										name="site_name"
										type="text"
										placeholder="reedoing"
										value={data.settings.site_name || "reedoing"}
										required
										class="text-xs"
									/>
									<p class="text-[11px] text-muted-foreground">
										Nama ini tampil di header, footer, meta title SEO, dan panduan style pengguna.
									</p>
								</div>

								<div class="space-y-2">
									<Label for="site_tagline" class="text-xs font-semibold">Slogan / Tagline</Label>
									<Input
										id="site_tagline"
										name="site_tagline"
										type="text"
										placeholder="Lebih Sedikit Item, Lebih Banyak Outfit"
										value={data.settings.site_tagline || "Lebih Sedikit Item, Lebih Banyak Outfit"}
										class="text-xs"
									/>
								</div>

								<!-- Logo Upload & Preview -->
								<div class="space-y-3 rounded-xl border border-border/80 bg-stone-50/60 dark:bg-stone-900/40 p-3.5">
									<Label class="text-xs font-semibold flex items-center gap-1.5 text-foreground">
										<ImageIcon class="size-4 text-muted-foreground" />
										<span>Logo Website</span>
									</Label>

									<div class="flex items-center gap-3 py-1">
										<div class="flex size-14 items-center justify-center rounded-xl border border-border bg-card p-1 shadow-2xs shrink-0">
											{#if data.settings.site_logo}
												<img src={data.settings.site_logo} alt="Logo Preview" class="size-full object-contain rounded-lg" />
											{:else}
												<span class="font-serif text-2xl font-bold text-foreground">
													{(data.settings.site_name || "R").charAt(0).toUpperCase()}
												</span>
											{/if}
										</div>
										<div class="min-w-0 flex-1 space-y-0.5">
											<p class="text-xs font-semibold text-foreground">
												{data.settings.site_logo ? "Logo Kustom Aktif" : "Badge Bawaan Inisial Aktif"}
											</p>
											<p class="text-[11px] text-muted-foreground truncate">
												Format PNG, SVG, JPG, atau WebP (disarankan transparan).
											</p>
										</div>
									</div>

									<div class="space-y-1.5">
										<Label for="logoFile" class="text-[11px] font-medium text-stone-700 dark:text-stone-300">
											Upload File Logo Baru:
										</Label>
										<Input
											id="logoFile"
											name="logoFile"
											type="file"
											accept="image/*"
											class="text-xs bg-background cursor-pointer"
										/>
									</div>

									<div class="space-y-1.5 pt-1 border-t border-border/60">
										<Label for="site_logo" class="text-[11px] font-medium text-muted-foreground">
											Atau Path / URL Logo Langsung:
										</Label>
										<Input
											id="site_logo"
											name="site_logo"
											type="text"
											placeholder="/favicon.svg atau /uploads/..."
											value={data.settings.site_logo || ""}
											class="text-xs bg-background font-mono"
										/>
									</div>
								</div>

								<Button type="submit" class="w-full font-semibold text-xs mt-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 shadow-xs">
									Simpan Identitas & Logo
								</Button>
							</CardContent>
						</form>
					</Card>

					<!-- KARTU 2: AKUN & KEAMANAN ADMIN (USER & PASSWORD) -->
					<Card class="border-border shadow-xs">
						<CardHeader>
							<CardTitle class="font-serif text-lg font-bold flex items-center gap-2">
								<ShieldCheckIcon class="size-4 text-primary" />
								Akun & Keamanan Admin
							</CardTitle>
							<CardDescription class="text-xs text-muted-foreground">
								Kelola username dan perbarui password admin untuk login ke console dashboard.
							</CardDescription>
						</CardHeader>
						<form
							action="?/saveSettings"
							method="POST"
							use:enhance={() => {
								return async ({ update, result }) => {
									await update();
									if (result.type === "success") {
										toast.success("Akun & password admin berhasil diperbarui!");
									} else if (result.type === "failure") {
										toast.error((result.data as any)?.error || "Gagal memperbarui akun admin.");
									}
								};
							}}
						>
							<CardContent class="space-y-4 pt-2">
								<div class="space-y-2">
									<Label for="admin_user" class="text-xs font-semibold">Username Admin</Label>
									<div class="relative">
										<Input
											id="admin_user"
											name="admin_user"
											type="text"
											placeholder="admin"
											value={data.settings.admin_user || "admin"}
											required
											class="text-xs pr-10"
										/>
										<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
											<UserIcon class="size-3.5" />
										</div>
									</div>
									<p class="text-[11px] text-muted-foreground">
										Username yang digunakan saat masuk di halaman login admin.
									</p>
								</div>

								<div class="space-y-3 rounded-xl border border-border/80 bg-stone-50/60 dark:bg-stone-900/40 p-3.5">
									<Label class="text-xs font-semibold flex items-center gap-1.5 text-foreground">
										<KeyRoundIcon class="size-3.5 text-muted-foreground" />
										<span>Ganti Password Admin</span>
									</Label>
									
									<div class="space-y-1.5">
										<Label for="admin_password" class="text-[11px] font-medium text-stone-700 dark:text-stone-300">
											Password Baru (Kosongkan jika tidak ingin ganti):
										</Label>
										<Input
											id="admin_password"
											name="admin_password"
											type="password"
											placeholder="Masukkan password baru..."
											class="text-xs bg-background"
										/>
									</div>

									<div class="space-y-1.5">
										<Label for="admin_password_confirm" class="text-[11px] font-medium text-stone-700 dark:text-stone-300">
											Ulangi Password Baru:
										</Label>
										<Input
											id="admin_password_confirm"
											name="admin_password_confirm"
											type="password"
											placeholder="Konfirmasi password baru..."
											class="text-xs bg-background"
										/>
									</div>

									<p class="text-[10px] text-muted-foreground">
										Minimal 4 karakter. Password baru akan langsung aktif dan tersimpan aman di database server.
									</p>
								</div>

								<Button type="submit" class="w-full font-semibold text-xs mt-2 bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-stone-200 dark:text-stone-900 shadow-xs">
									Simpan Username & Password
								</Button>
							</CardContent>
						</form>
					</Card>

					<!-- KARTU 3: PENGATURAN SHOPEE AFFILIATE & AI -->
					<Card class="border-border shadow-xs">
						<CardHeader>
							<CardTitle class="font-serif text-lg font-bold flex items-center gap-2">
								<ShoppingBagIcon class="size-4 text-[#ee4d2d]" />
								Konfigurasi Shopee Affiliate
							</CardTitle>
							<CardDescription class="text-xs text-muted-foreground">
								Tautan fallback toko dan teks transparansi afiliasi.
							</CardDescription>
						</CardHeader>

						<form
							action="?/saveSettings"
							method="POST"
							use:enhance={() => {
								return async ({ update }) => {
									await update();
									toast.success("Pengaturan Shopee berhasil disimpan!");
								};
							}}
						>
							<CardContent class="space-y-4 pt-2">
								<div class="space-y-2">
									<Label for="shopee_fallback_url" class="text-xs font-semibold">
										Tautan Fallback Shopee (Default Store / Profile)
									</Label>
									<Input
										id="shopee_fallback_url"
										name="shopee_fallback_url"
										type="url"
										placeholder="https://shopee.co.id/username-anda atau https://s.shopee.co.id/..."
										value={data.settings.shopee_fallback_url || "https://shopee.co.id"}
										required
										class="text-xs"
									/>
									<p class="text-[11px] text-muted-foreground">
										Dipakai jika outfit atau item tertentu belum memiliki link Shopee khusus.
									</p>
								</div>

								<!-- Google Gemini API Key Input -->
								<div class="space-y-2 rounded-xl border border-border/80 bg-stone-50/50 dark:bg-stone-900/30 p-3.5">
									<div class="flex items-center gap-1.5 text-xs font-semibold text-foreground">
										<CameraIcon class="size-4 text-muted-foreground" />
										<span>Google Gemini API Key (Visualisasi Try-On)</span>
									</div>
									<Input
										id="gemini_api_key"
										name="gemini_api_key"
										type="password"
										placeholder="AIzaSy..."
										value={data.settings.gemini_api_key || ""}
										class="text-xs bg-background font-mono"
									/>
									<p class="text-[11px] text-muted-foreground">
										Digunakan untuk men-generate foto visualisasi outfit pengguna lewat model Google Imagen 3. Dapatkan gratis di <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" class="underline text-foreground">Google AI Studio</a>.
									</p>
								</div>

								<div class="space-y-2">
									<Label for="affiliate_disclaimer" class="text-xs font-semibold text-foreground">
										Teks Transparansi Afiliasi (Disclaimer)
									</Label>
									<textarea
										id="affiliate_disclaimer"
										name="affiliate_disclaimer"
										rows="3"
										class="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
									>{data.settings.affiliate_disclaimer || "Tautan pakaian di atas terhubung ke toko resmi di Shopee. Kami dapat memperoleh sedikit komisi dari pembelianmu tanpa biaya tambahan."}</textarea>
								</div>

								<Button type="submit" class="w-full font-semibold text-xs mt-2 bg-[#ee4d2d] hover:bg-[#d73211] text-white hover:text-white shadow-xs">
									Simpan Pengaturan Shopee & AI
								</Button>
							</CardContent>
						</form>
					</Card>

					<!-- KARTU 4: PANDUAN SHOPEE AFFILIATE -->
					<Card class="border-border bg-muted/10 shadow-xs">
						<CardHeader>
							<CardTitle class="font-serif text-lg font-bold flex items-center gap-2">
								<ShoppingBagIcon class="size-4 text-muted-foreground" />
								Tips Shopee Affiliate
							</CardTitle>
							<CardDescription class="text-xs text-muted-foreground">
								Panduan singkat memaksimalkan komisi dari {data.settings.site_name || "reedoing"}.
							</CardDescription>
						</CardHeader>
						<CardContent class="space-y-3 text-xs text-muted-foreground leading-relaxed">
							<div class="rounded-lg bg-card p-3 border border-border">
								<h4 class="font-bold text-foreground mb-1">1. Cara Mengambil Link Shopee Affiliate</h4>
								<p>
									Buka aplikasi Shopee → Masuk ke menu <strong>Saya</strong> → <strong>Shopee Affiliate Program</strong>. Cari produk pakaian yang sesuai rekomendasi, lalu klik tombol <strong>Bagikan & Dapatkan Komisi</strong>, salin tautan pendeknya (contoh: <code class="text-[10px] bg-muted px-1 rounded">https://s.shopee.co.id/...</code>).
								</p>
							</div>

							<div class="rounded-lg bg-card p-3 border border-border">
								<h4 class="font-bold text-foreground mb-1">2. Prioritaskan Item Kunci</h4>
								<p>
									Pengunjung paling sering mengeklik item prioritas tinggi seperti <em>Blazer Formal</em>, <em>Kemeja Katun</em>, dan <em>Clean Sneakers</em>. Pastikan item-item ini sudah memiliki link affiliate.
								</p>
							</div>

							<div class="rounded-lg bg-card p-3 border border-border">
								<h4 class="font-bold text-foreground mb-1">3. Toko Mall atau Star+</h4>
								<p>
									Pilih produk dari <strong>Shopee Mall</strong> atau <strong>Star+ Seller</strong> agar pengunjung lebih percaya dan tingkat konversi pembelian tinggi.
								</p>
							</div>
						</CardContent>
					</Card>
				</div>
			</Tabs.Content>
		</Tabs.Root>
	</main>
	</div>
</div>

<!-- ========================================== -->
<!-- DIALOG EDIT / TAMBAH OUTFIT -->
<!-- ========================================== -->
<Dialog.Root bind:open={isOutfitDialogOpen}>
	<Dialog.Content class="sm:max-w-xl max-h-[90vh] overflow-y-auto">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-xl">
				{isEditingNewOutfit ? "Tambah Outfit Baru" : "Edit Outfit & Link Shopee"}
			</Dialog.Title>
			<Dialog.Description class="text-xs text-muted-foreground pt-1">
				Atur nama kombinasi, situasi pakaian, formula, tips, dan tautan Shopee Affiliate.
			</Dialog.Description>
		</Dialog.Header>

		<form
			action="?/saveOutfit"
			method="POST"
			enctype="multipart/form-data"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					isOutfitDialogOpen = false;
					toast.success("Outfit berhasil disimpan!");
				};
			}}
			class="space-y-4 pt-2"
		>
			{#if !isEditingNewOutfit}
				<input type="hidden" name="id" value={editingOutfit.id} />
			{/if}
			<input type="hidden" name="itemIds" value={JSON.stringify(editingOutfit.itemIds)} />
			<input type="hidden" name="isActive" value={editingOutfit.isActive ? "true" : "false"} />

			<div class="space-y-1.5">
				<Label for="outfit_name" class="text-xs font-semibold">Nama Outfit</Label>
				<Input
					id="outfit_name"
					name="name"
					type="text"
					placeholder="Contoh: The Power Foundation"
					bind:value={editingOutfit.name}
					required
					class="text-xs"
				/>
			</div>

			<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<div class="space-y-1.5">
					<Label for="outfit_occasion" class="text-xs font-semibold">Situasi / Kategori</Label>
					<select
						id="outfit_occasion"
						name="occasion"
						bind:value={editingOutfit.occasion}
						class="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
					>
						{#each occasionOptions as occ}
							<option value={occ.id} class="bg-background text-foreground">{occ.label}</option>
						{/each}
					</select>
				</div>

				<div class="space-y-1.5">
					<Label for="outfit_occasionLabel" class="text-xs font-semibold">Label Situasi Tampilan</Label>
					<Input
						id="outfit_occasionLabel"
						name="occasionLabel"
						type="text"
						placeholder="Contoh: Kerja Kantor"
						bind:value={editingOutfit.occasionLabel}
						class="text-xs"
					/>
				</div>
			</div>

			<div class="space-y-1.5">
				<Label for="outfit_formula" class="text-xs font-semibold">Formula Look</Label>
				<Input
					id="outfit_formula"
					name="formula"
					type="text"
					placeholder="Contoh: Blazer + Kemeja + Trousers + Sepatu Rapi"
					bind:value={editingOutfit.formula}
					required
					class="text-xs"
				/>
			</div>

			<!-- Pilih Item Produk yang Dipakai dalam Outfit Ini -->
			<div class="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3.5">
				<div class="flex items-center justify-between">
					<Label class="text-xs font-semibold flex items-center gap-1.5 text-foreground">
						<ShirtIcon class="size-3.5 text-primary" />
						<span>Produk Pakaian dalam Outfit Ini ({editingOutfit.itemIds.length} dipilih)</span>
					</Label>
					<span class="text-[10px] text-muted-foreground">Klik item untuk toggle</span>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1.5 border border-border/80 rounded-lg bg-background">
					{#each data.items as prodItem (prodItem.id)}
						{@const isSelected = editingOutfit.itemIds.includes(prodItem.id)}
						<button
							type="button"
							onclick={() => {
								if (isSelected) {
									editingOutfit.itemIds = editingOutfit.itemIds.filter((id) => id !== prodItem.id);
								} else {
									editingOutfit.itemIds = [...editingOutfit.itemIds, prodItem.id];
								}
							}}
							class="flex items-center gap-2 p-1.5 rounded-lg border text-left transition-all {isSelected ? 'border-primary bg-primary/10 text-foreground shadow-2xs font-semibold hover:bg-primary/15' : 'border-border/70 text-foreground hover:bg-muted/80 hover:border-border'}"
						>
							<div class="size-8 rounded-md border border-border/80 bg-background overflow-hidden shrink-0 flex items-center justify-center">
								{#if prodItem.imageUrl}
									<img src={prodItem.imageUrl} alt={prodItem.name} class="size-full object-cover" />
								{:else}
									<ShirtIcon class="size-4 text-muted-foreground/40" />
								{/if}
							</div>
							<div class="min-w-0 flex-1">
								<div class="text-[11px] leading-tight truncate text-foreground font-medium">{prodItem.name}</div>
								<div class="text-[9px] uppercase tracking-wider text-muted-foreground font-semibold">{prodItem.category}</div>
							</div>
							{#if isSelected}
								<CheckCircle2Icon class="size-3.5 text-primary shrink-0" />
							{/if}
						</button>
					{/each}
				</div>
			</div>

			<div class="space-y-1.5">
				<Label for="outfit_styleTips" class="text-xs font-semibold">Tips Padu-Padan</Label>
				<textarea
					id="outfit_styleTips"
					name="styleTips"
					rows="3"
					placeholder="Tuliskan panduan styling untuk outfit ini..."
					bind:value={editingOutfit.styleTips}
					required
					class="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring placeholder:text-muted-foreground"
				></textarea>
			</div>

			<!-- Shopee Affiliate URL Input -->
			<div class="space-y-1.5 rounded-xl border-2 border-[#ee4d2d]/30 bg-[#ee4d2d]/5 p-3.5">
				<div class="flex items-center gap-1.5 text-xs font-bold text-[#ee4d2d]">
					<ShoppingBagIcon class="size-4" />
					<span>Tautan Shopee Affiliate (Look Ini)</span>
				</div>
				<Input
					id="outfit_affiliateUrl"
					name="affiliateUrl"
					type="url"
					placeholder="https://s.shopee.co.id/... atau https://shope.ee/..."
					bind:value={editingOutfit.affiliateUrl}
					class="text-xs bg-background"
				/>
				<p class="text-[11px] text-muted-foreground">
					Tautan ini akan langsung muncul di kartu look pada panduan pengunjung.
				</p>
			</div>

			<!-- Look Image Input & Upload -->
			<div class="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3.5">
				<div class="flex items-center justify-between">
					<Label class="text-xs font-semibold flex items-center gap-1.5 text-foreground">
						<CameraIcon class="size-3.5 text-primary" />
						<span>Gambar / Foto Look Keseluruhan (Opsional)</span>
					</Label>
					{#if editingOutfit.imageUrl}
						<button
							type="button"
							onclick={() => (editingOutfit.imageUrl = "")}
							class="text-[10px] text-destructive hover:underline"
						>
							Reset Gambar
						</button>
					{/if}
				</div>

				<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
					<div class="size-16 rounded-xl border border-border/80 bg-background overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
						{#if editingOutfit.imageUrl}
							<img src={editingOutfit.imageUrl} alt="Preview Look" class="size-full object-cover" />
						{:else}
							<ShirtIcon class="size-7 text-muted-foreground/30" />
						{/if}
					</div>

					<div class="space-y-2 flex-1 min-w-0 w-full sm:w-auto">
						<div>
							<span class="text-[10px] text-muted-foreground font-medium block mb-1">Upload foto dari perangkat:</span>
							<input
								type="file"
								name="imageFile"
								accept="image/*"
								onchange={handleOutfitImagePreview}
								class="block w-full text-xs text-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
							/>
						</div>
						<div>
							<span class="text-[10px] text-muted-foreground font-medium block mb-1">Atau link gambar / SVG:</span>
							<Input
								id="outfit_imageUrl"
								name="imageUrl"
								type="text"
								placeholder="https://... atau /images/looks/...svg"
								bind:value={editingOutfit.imageUrl}
								class="text-xs bg-background h-8"
							/>
						</div>
					</div>
				</div>
			</div>

			<Dialog.Footer class="mt-4 flex flex-col-reverse sm:flex-row gap-2">
				<Button variant="outline" type="button" onclick={() => (isOutfitDialogOpen = false)} class="text-foreground hover:bg-muted hover:text-foreground">
					Batal
				</Button>
				<Button type="submit" class="bg-[#ee4d2d] hover:bg-[#d73211] text-white hover:text-white font-semibold">
					Simpan Outfit
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- ========================================== -->
<!-- DIALOG EDIT ITEM BELANJA & LINK SHOPEE -->
<!-- ========================================== -->
<Dialog.Root bind:open={isItemDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-xl">
				{isEditingNewItem ? "Tambah Produk Pakaian Baru" : "Edit Link Shopee Produk"}
			</Dialog.Title>
			<Dialog.Description class="text-xs text-muted-foreground pt-1">
				Masukkan nama produk, kategori, estimasi harga, dan tautan Shopee Affiliate.
			</Dialog.Description>
		</Dialog.Header>

		{#if activeItem}
			<form
				action="?/saveItem"
				method="POST"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({ update }) => {
						await update();
						isItemDialogOpen = false;
						toast.success(isEditingNewItem ? "Produk baru berhasil ditambahkan!" : "Produk & Foto berhasil disimpan!");
					};
				}}
				class="space-y-4 pt-2"
			>
				<input type="hidden" name="id" value={activeItem.id} />

				<div class="space-y-1.5">
					<Label for="item_name" class="text-xs font-semibold">Nama Produk</Label>
					<Input
						id="item_name"
						name="name"
						type="text"
						placeholder="Contoh: Kemeja Katun Poplin Putih"
						bind:value={activeItem.name}
						required
						class="text-xs"
					/>
				</div>

				<div class="space-y-1.5">
					<Label for="item_category" class="text-xs font-semibold">Kategori Pakaian</Label>
					<select
						id="item_category"
						name="category"
						bind:value={activeItem.category}
						class="w-full rounded-md border border-input bg-background text-foreground px-3 py-2 text-xs shadow-xs focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring cursor-pointer"
					>
						<option value="outer" class="bg-background text-foreground">Outer (Blazer, Cardigan, Jaket)</option>
						<option value="atasan" class="bg-background text-foreground">Atasan (Kemeja, Kaos, Polo, Blouse)</option>
						<option value="bawahan" class="bg-background text-foreground">Bawahan (Celana, Denim, Chinos, Rok)</option>
						<option value="sepatu" class="bg-background text-foreground">Sepatu (Sneakers, Loafers, Heels)</option>
						<option value="tas" class="bg-background text-foreground">Tas (Totebag, Sling bag, Tas Kerja)</option>
						<option value="aksesori" class="bg-background text-foreground">Aksesori (Ikat Pinggang, Jam, Kalung)</option>
					</select>
				</div>

				<!-- INPUT GAMBAR / FOTO PER PRODUK OUTFIT -->
				<div class="space-y-2 rounded-xl border border-border/80 bg-muted/20 p-3.5">
					<div class="flex items-center justify-between">
						<Label class="text-xs font-semibold flex items-center gap-1.5 text-foreground">
							<CameraIcon class="size-3.5 text-primary" />
							<span>Foto / Gambar Produk</span>
						</Label>
						{#if activeItem.imageUrl}
							<button
								type="button"
								onclick={() => (activeItem.imageUrl = "")}
								class="text-[10px] text-destructive hover:underline"
							>
								Hapus Gambar
							</button>
						{/if}
					</div>

					<div class="flex flex-col sm:flex-row items-start sm:items-center gap-3">
						<!-- Preview Thumbnail Produk -->
						<div class="size-16 rounded-xl border border-border/80 bg-background overflow-hidden shrink-0 flex items-center justify-center shadow-2xs">
							{#if activeItem.imageUrl}
								<img src={activeItem.imageUrl} alt="Preview" class="size-full object-cover" />
							{:else}
								<ShirtIcon class="size-7 text-muted-foreground/30" />
							{/if}
						</div>

						<div class="space-y-2 flex-1 min-w-0 w-full sm:w-auto">
							<!-- Upload File dari Perangkat -->
							<div>
								<span class="text-[10px] text-muted-foreground font-medium block mb-1">Upload foto dari perangkat:</span>
								<input
									type="file"
									name="imageFile"
									accept="image/*"
									onchange={handleItemImagePreview}
									class="block w-full text-xs text-foreground file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-semibold file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
								/>
							</div>

							<!-- Atau Masukkan URL Gambar -->
							<div>
								<span class="text-[10px] text-muted-foreground font-medium block mb-1">Atau link gambar:</span>
								<Input
									id="item_imageUrl"
									name="imageUrl"
									type="text"
									placeholder="https://... atau /images/placeholder/shirt.svg"
									bind:value={activeItem.imageUrl}
									class="text-xs bg-background h-8"
								/>
							</div>
						</div>
					</div>
				</div>

				<div class="space-y-1.5">
					<Label for="item_priceEstimate" class="text-xs font-semibold">Estimasi Harga (Opsional)</Label>
					<Input
						id="item_priceEstimate"
						name="priceEstimate"
						type="text"
						placeholder="Contoh: Rp 150.000 - Rp 300.000"
						bind:value={activeItem.priceEstimate}
						class="text-xs"
					/>
				</div>

				<div class="space-y-1.5 rounded-xl border border-[#ee4d2d]/30 bg-[#ee4d2d]/5 p-3.5">
					<div class="flex items-center gap-1.5 text-xs font-bold text-[#ee4d2d]">
						<ShoppingBagIcon class="size-4" />
						<span>Tautan Shopee Affiliate</span>
					</div>
					<Input
						id="item_affiliateUrl"
						name="affiliateUrl"
						type="url"
						placeholder="https://s.shopee.co.id/... atau https://shope.ee/..."
						bind:value={activeItem.affiliateUrl}
						class="text-xs bg-background"
					/>
				</div>

				<Dialog.Footer class="mt-4 flex flex-col-reverse sm:flex-row gap-2">
					<Button variant="outline" type="button" onclick={() => (isItemDialogOpen = false)} class="text-foreground hover:bg-muted hover:text-foreground">
						Batal
					</Button>
					<Button type="submit" class="bg-[#ee4d2d] hover:bg-[#d73211] text-white hover:text-white font-semibold">
						Simpan Produk
					</Button>
				</Dialog.Footer>
			</form>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- ========================================== -->
<!-- DIALOG KONFIRMASI RESET 32 OUTFIT -->
<!-- ========================================== -->
<Dialog.Root bind:open={isResetDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-xl">Reset 32 Outfit Bawaan?</Dialog.Title>
			<Dialog.Description class="text-xs text-muted-foreground pt-1">
				Tindakan ini akan mengembalikan seluruh 32 outfit ke pengaturan bawaan awal reedoing. Outfit custom yang telah dibuat akan dihapus.
			</Dialog.Description>
		</Dialog.Header>

		<form
			action="?/resetOutfits"
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					isResetDialogOpen = false;
					toast.success("32 outfit bawaan berhasil dipulihkan!");
				};
			}}
		>
			<Dialog.Footer class="mt-4 gap-2">
				<Button variant="outline" type="button" onclick={() => (isResetDialogOpen = false)} class="text-foreground hover:bg-muted hover:text-foreground">
					Batal
				</Button>
				<Button type="submit" class="bg-destructive hover:bg-destructive/90 text-white hover:text-white font-semibold shadow-xs">
					Ya, Pulihkan Default
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- ========================================== -->
<!-- DIALOG KONFIRMASI HAPUS OUTFIT -->
<!-- ========================================== -->
<Dialog.Root bind:open={isDeleteDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-xl">Hapus Outfit Ini?</Dialog.Title>
			<Dialog.Description class="text-xs text-muted-foreground pt-1">
				Outfit ini tidak akan lagi muncul dalam rekomendasi gaya pengunjung.
			</Dialog.Description>
		</Dialog.Header>

		<form
			action="?/deleteOutfit"
			method="POST"
			use:enhance={() => {
				return async ({ update }) => {
					await update();
					isDeleteDialogOpen = false;
					toast.success("Outfit berhasil dihapus!");
				};
			}}
		>
			<input type="hidden" name="id" value={outfitToDelete} />
			<Dialog.Footer class="mt-4 gap-2">
				<Button variant="outline" type="button" onclick={() => (isDeleteDialogOpen = false)} class="text-foreground hover:bg-muted hover:text-foreground">
					Batal
				</Button>
				<Button type="submit" class="bg-destructive hover:bg-destructive/90 text-white hover:text-white font-semibold shadow-xs">
					Hapus Outfit
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<!-- ========================================== -->
<!-- DIALOG KONFIRMASI RESET HERO & TONE COLOR -->
<!-- ========================================== -->
<Dialog.Root bind:open={isResetHeroDialogOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title class="font-serif text-lg font-bold flex items-center gap-2 text-foreground">
				<RotateCcwIcon class="size-4 text-amber-500" />
				Reset Hero & Tone Color ke Standar?
			</Dialog.Title>
			<Dialog.Description class="text-xs text-muted-foreground pt-1">
				Tindakan ini akan mengembalikan semua kata-kata headline, deskripsi, teks tombol, metrik statistik, serta susunan warna palet tone (Warm, Cool, Netral) ke bawaan standar awal.
			</Dialog.Description>
		</Dialog.Header>

		<form
			action="?/resetHeroSettings"
			method="POST"
			use:enhance={() => {
				return async ({ update, result }) => {
					await update();
					isResetHeroDialogOpen = false;
					if (result.type === "success") {
						toast.success("Pengaturan Hero & Tone Color berhasil direset!");
						heroTitle1 = "Lebih sedikit pakaian,";
						heroTitle2 = "lebih banyak gaya.";
						heroDescription = "Bangun capsule wardrobe fungsional 12 item yang menghasilkan 30+ kombinasi outfit siap pakai. Dirancang personal untuk pria dan wanita berdasarkan undertone urat nadi dan proporsi tubuhmu.";
						heroCtaText = "Mulai Style Check";
						heroCtaSecondaryText = "Lihat Contoh Lookbook";
						heroCtaSubtext = "Gratis · Sekitar 3 menit · Langsung siap pakai";
						heroFloatingText = "Deteksi warna urat nadi pergelangan tangan otomatis";
						heroStat1Val = "12 Item";
						heroStat1Lbl = "Wardrobe esensial";
						heroStat2Val = "30+ Look";
						heroStat2Lbl = "Kombinasi siap pakai";
						heroStat3Val = "100%";
						heroStat3Lbl = "Gratis selamanya";
						heroDefaultTone = "hangat";
						previewTone = "hangat";
						toneEditorTab = "hangat";
						warmName = "Warm Earth & Sun";
						warmDesc = "Nuansa bumi hangat: broken white, camel, espresso, dan aksen terracotta.";
						warmColors = JSON.parse(JSON.stringify(defaultWarmColors));
						coolName = "Cool Slate & Coastal";
						coolDesc = "Nuansa sejuk berkelas: pure white, classic navy, charcoal, dan slate blue.";
						coolColors = JSON.parse(JSON.stringify(defaultCoolColors));
						neutralName = "Neutral Mineral & Stone";
						neutralDesc = "Nuansa netral seimbang: soft ecru, midnight graphite, taupe, dan sage green.";
						neutralColors = JSON.parse(JSON.stringify(defaultNeutralColors));
					}
				};
			}}
		>
			<Dialog.Footer class="mt-4 gap-2">
				<Button variant="outline" type="button" onclick={() => (isResetHeroDialogOpen = false)} class="text-xs text-foreground hover:bg-muted hover:text-foreground">
					Batal
				</Button>
				<Button type="submit" class="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-xs">
					Ya, Reset ke Standar
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

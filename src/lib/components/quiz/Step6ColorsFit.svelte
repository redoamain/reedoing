<script lang="ts">
	import type { Undertone, BodyProportion } from "$lib/types/style";
	import PhotoAnalyzerInput from "./PhotoAnalyzerInput.svelte";
	import CheckIcon from "@lucide/svelte/icons/check";
	import SunIcon from "@lucide/svelte/icons/sun";
	import SnowflakeIcon from "@lucide/svelte/icons/snowflake";
	import ScaleIcon from "@lucide/svelte/icons/scale";

	interface Props {
		undertone: Undertone;
		bodyProportion: BodyProportion;
		photoSkinHex?: string;
		photoConfidence?: number;
		photoVeinType?: "hijau" | "biru" | "campuran";
		photoBase64?: string;
	}

	let {
		undertone = $bindable("hangat"),
		bodyProportion = $bindable("seimbang"),
		photoSkinHex = $bindable(undefined),
		photoConfidence = $bindable(undefined),
		photoVeinType = $bindable(undefined),
		photoBase64 = $bindable(undefined)
	}: Props = $props();

	const undertoneOptions: Array<{
		id: Undertone;
		title: string;
		subtitle: string;
		hints: string[];
		icon: any;
		colors: string[];
	}> = [
		{
			id: "hangat",
			title: "Undertone Hangat (Warm)",
			subtitle: "Nuansa keemasan / peachy di bawah permukaan kulit",
			hints: [
				"Urat nadi pergelangan tangan tampak kehijauan atau zaitun",
				"Perhiasan emas kuning terlihat lebih bersinar di kulitmu",
				"Kulit mudah menggelap (tan) alami saat terkena sinar matahari"
			],
			icon: SunIcon,
			colors: ["#C2A27E", "#B85D43", "#3D2B1F"]
		},
		{
			id: "dingin",
			title: "Undertone Dingin (Cool)",
			subtitle: "Nuansa kebiruan / merah muda sejuk di bawah kulit",
			hints: [
				"Urat nadi pergelangan tangan tampak kebiruan atau ungu",
				"Perhiasan perak / silver / platinum terlihat paling pas",
				"Kulit mudah memerah atau terbakar sinar matahari"
			],
			icon: SnowflakeIcon,
			colors: ["#1B2A47", "#6B1D2F", "#33383F"]
		},
		{
			id: "netral",
			title: "Undertone Netral (Neutral)",
			subtitle: "Keseimbangan alami tanpa dominasi hangat atau dingin",
			hints: [
				"Urat nadi terlihat campuran warna hijau dan biru",
				"Bagus mengenakan perhiasan emas maupun perak",
				"Mudah memadukan hampir semua spektrum warna"
			],
			icon: ScaleIcon,
			colors: ["#7A7265", "#768B75", "#26292E"]
		}
	];

	const proportionOptions: Array<{
		id: BodyProportion;
		title: string;
		desc: string;
		visual: string;
	}> = [
		{
			id: "seimbang",
			title: "Seimbang (Proporsional)",
			desc: "Lebar bahu dan lingkar pinggul relatif sejajar dengan garis pinggang terdefinisi.",
			visual: "❚❚"
		},
		{
			id: "atasan-lebar",
			title: "Atasan Lebih Lebar (Bahu Bidang)",
			desc: "Bahu atau dada lebih lebar dan dominan dibanding lingkar pinggul atau paha.",
			visual: "▼"
		},
		{
			id: "bawahan-lebar",
			title: "Bawahan Lebih Lebar (Pinggul / Paha)",
			desc: "Pinggul, paha, atau bokong lebih bervolume dibanding garis bahu.",
			visual: "▲"
		},
		{
			id: "tinggi-ramping",
			title: "Tinggi Ramping (Lean Silhouette)",
			desc: "Postur tubuh jenjang dengan siluet lurus memanjang.",
			visual: "❘❘"
		},
		{
			id: "petite",
			title: "Petite (Ringkas / Mungil)",
			desc: "Tinggi badan cenderung mungil, fokus pada ilusi kaki lebih panjang dan jenjang.",
			visual: "▪"
		}
	];
</script>

<div class="space-y-8">
	<!-- 1. Photo Analyzer Input -->
	<PhotoAnalyzerInput
		bind:undertone
		bind:photoSkinHex
		bind:photoConfidence
		bind:photoVeinType
		bind:photoBase64
	/>

	<!-- 2. Undertone Visual / Manual Confirmation -->
	<div>
		<div class="flex items-center justify-between mb-3">
			<span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
				Pilihan Undertone Kulit
			</span>
			<span class="text-[11px] text-muted-foreground">Bisa diubah manual kapan saja</span>
		</div>

		<div class="grid gap-3 sm:grid-cols-3">
			{#each undertoneOptions as opt (opt.id)}
				{@const isSelected = undertone === opt.id}
				<button
					type="button"
					onclick={() => { undertone = opt.id; }}
					class="relative flex flex-col justify-between rounded-2xl border-2 p-4 text-left transition-all {isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card hover:border-primary/40'}"
				>
					<div>
						<div class="flex items-center justify-between">
							<div class="flex size-8 items-center justify-center rounded-lg bg-secondary text-foreground">
								<opt.icon class="size-4" />
							</div>
							<div class="flex size-5 items-center justify-center rounded-full border {isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}">
								{#if isSelected}
									<CheckIcon class="size-3 stroke-[3]" />
								{/if}
							</div>
						</div>

						<h3 class="mt-3 font-serif text-sm font-bold text-foreground">
							{opt.title}
						</h3>
						<p class="mt-1 text-[11px] text-muted-foreground leading-snug">
							{opt.subtitle}
						</p>

						<ul class="mt-3 space-y-1.5 border-t border-border/60 pt-2.5 text-[10px] text-muted-foreground">
							{#each opt.hints as hint}
								<li class="flex items-start gap-1.5">
									<span class="text-primary mt-0.5">•</span>
									<span>{hint}</span>
								</li>
							{/each}
						</ul>
					</div>

					<div class="mt-4 flex gap-1.5 pt-2 border-t border-border/60">
						{#each opt.colors as col}
							<span class="size-4 rounded-full border border-black/10 shadow-2xs" style="background-color: {col};"></span>
						{/each}
						<span class="text-[10px] text-muted-foreground ml-1 self-center">Contoh Aksen</span>
					</div>
				</button>
			{/each}
		</div>
	</div>

	<!-- 2. Proporsi Tubuh -->
	<div>
		<span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
			2. Proporsi Siluet Tubuh
		</span>

		<div class="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
			{#each proportionOptions as prop (prop.id)}
				{@const isSelected = bodyProportion === prop.id}
				<button
					type="button"
					onclick={() => { bodyProportion = prop.id; }}
					class="flex items-start gap-3 rounded-xl border-2 p-3.5 text-left transition-all {isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card hover:border-primary/40'}"
				>
					<div class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-xs font-extrabold text-foreground">
						{prop.visual}
					</div>
					<div class="flex-1">
						<div class="flex items-center justify-between">
							<span class="font-serif text-xs sm:text-sm font-bold text-foreground">
								{prop.title}
							</span>
							{#if isSelected}
								<span class="text-primary font-bold text-xs">✓</span>
							{/if}
						</div>
						<p class="mt-0.5 text-[11px] text-muted-foreground leading-relaxed">
							{prop.desc}
						</p>
					</div>
				</button>
			{/each}
		</div>
	</div>
</div>

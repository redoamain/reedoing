<script lang="ts">
	import type { Undertone, BodyProportion } from "$lib/types/style";
	import PhotoAnalyzerInput from "./PhotoAnalyzerInput.svelte";

	interface Props {
		undertone: Undertone;
		bodyProportion: BodyProportion;
		photoSkinHex?: string;
		photoConfidence?: number;
		photoVeinType?: "hijau" | "biru" | "campuran";
		photoBase64?: string;
		onAnalyzed?: () => void;
	}

	let {
		undertone = $bindable("hangat"),
		bodyProportion = $bindable("seimbang"),
		photoSkinHex = $bindable(undefined),
		photoConfidence = $bindable(undefined),
		photoVeinType = $bindable(undefined),
		photoBase64 = $bindable(undefined),
		onAnalyzed
	}: Props = $props();

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
	<!-- 1. Deteksi Color Tone dari Foto Urat Nadi -->
	<PhotoAnalyzerInput
		bind:undertone
		bind:photoSkinHex
		bind:photoConfidence
		bind:photoVeinType
		bind:photoBase64
		{onAnalyzed}
	/>

	<!-- 2. Proporsi Siluet Tubuh -->
	<div>
		<div class="flex items-center justify-between mb-3">
			<span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
				Proporsi Siluet Tubuh
			</span>
			<span class="text-[11px] text-muted-foreground">Pilih siluet yang paling mendekati tubuhmu</span>
		</div>

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

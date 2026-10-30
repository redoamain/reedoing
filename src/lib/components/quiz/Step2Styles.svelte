<script lang="ts">
	import type { StyleOption } from "$lib/types/style";
	import CheckIcon from "@lucide/svelte/icons/check";

	interface Props {
		styles: StyleOption[];
	}

	let { styles = $bindable(["smart-casual"]) }: Props = $props();

	const styleOptions: Array<{
		id: StyleOption;
		title: string;
		desc: string;
		keywords: string;
	}> = [
		{
			id: "smart-casual",
			title: "Smart Casual",
			desc: "Rapi tanpa kaku, blazer dipadu kaos katun atau chinos bersih. Ideal untuk kantor modern.",
			keywords: "Blazer, Loafers, Chinos, Oxford"
		},
		{
			id: "minimalis",
			title: "Minimalis Fungsional",
			desc: "Garis bersih, warna monokrom atau netral hangat, tanpa logo besar. Mengutamakan esensi.",
			keywords: "Clean Lines, Neutral Palette, Simpel"
		},
		{
			id: "casual",
			title: "Casual Santai",
			desc: "Kenyamanan nomor satu. T-shirt berkualitas, denim favorit, dan sneakers harian.",
			keywords: "Denim, Sneakers, Kaos, Santai"
		},
		{
			id: "klasik",
			title: "Klasik Abadi (Timeless)",
			desc: "Potongan tailoring terstruktur, bahan berkualitas tinggi, dan siluet yang tak lekang zaman.",
			keywords: "Struktur, Elegan, Bahan Premium"
		},
		{
			id: "streetwear",
			title: "Streetwear Kontemporer",
			desc: "Siluet sedikit relaxed/oversized, statement sneakers, dan aksen modern urban.",
			keywords: "Relaxed Fit, Urban, Sneakers"
		},
		{
			id: "feminin",
			title: "Feminin Elegan",
			desc: "Bahan flowy yang jatuh lembut, rok A-line, blus manis, dan palet warna hangat/pastel.",
			keywords: "Flowy, A-Line, Halus, Anggun"
		}
	];

	function toggle(id: StyleOption) {
		if (styles.includes(id)) {
			if (styles.length > 1) {
				styles = styles.filter((item) => item !== id);
			}
		} else {
			if (styles.length < 2) {
				styles = [...styles, id];
			} else {
				styles = [styles[0], id];
			}
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-4">
		<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
			Pilih 1 atau 2 Gaya
		</span>
		<span class="text-xs font-semibold px-2.5 py-0.5 rounded-full {styles.length === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}">
			Terpilih: {styles.length}/2
		</span>
	</div>

	<div class="grid gap-3 sm:grid-cols-2">
		{#each styleOptions as opt (opt.id)}
			{@const isSelected = styles.includes(opt.id)}
			<button
				type="button"
				onclick={() => toggle(opt.id)}
				class="relative flex flex-col justify-between rounded-xl border-2 p-4 text-left transition-all {isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card hover:border-primary/40'}"
			>
				<div>
					<div class="flex items-center justify-between">
						<h3 class="font-serif text-base font-bold text-foreground">
							{opt.title}
						</h3>
						<div class="flex size-5 items-center justify-center rounded-full border {isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}">
							{#if isSelected}
								<CheckIcon class="size-3 stroke-[3]" />
							{/if}
						</div>
					</div>
					<p class="mt-2 text-xs text-muted-foreground leading-relaxed">
						{opt.desc}
					</p>
				</div>

				<div class="mt-3 border-t border-border/60 pt-2 text-[10px] text-muted-foreground italic">
					{opt.keywords}
				</div>
			</button>
		{/each}
	</div>
</div>

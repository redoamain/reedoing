<script lang="ts">
	import type { GoalOption } from "$lib/types/style";
	import CheckIcon from "@lucide/svelte/icons/check";

	interface Props {
		goals: GoalOption[];
	}

	let { goals = $bindable(["lebih-rapi", "percaya-diri"]) }: Props = $props();

	const goalList: Array<{
		id: GoalOption;
		title: string;
		desc: string;
	}> = [
		{
			id: "lebih-rapi",
			title: "Tampil Lebih Rapi & Profesional",
			desc: "Ingin dipandang berwibawa, terstruktur, dan dewasa di mata rekan kerja maupun teman."
		},
		{
			id: "percaya-diri",
			title: "Meningkatkan Rasa Percaya Diri",
			desc: "Merasa yakin dan nyaman dengan apa yang dikenakan tanpa perasaan minder atau salah kostum."
		},
		{
			id: "hemat-belanja",
			title: "Lebih Hemat Anggaran Belanja",
			desc: "Menghindari beli baju mubazir dan hanya membeli pakaian yang benar-benar sering dipakai."
		},
		{
			id: "praktis-cepat",
			title: "Praktis & Bebas Pusing Tiap Pagi",
			desc: "Bisa memilih outfit siap pakai dalam waktu kurang dari 2 menit tanpa membongkar lemari."
		},
		{
			id: "konsisten",
			title: "Menemukan Identitas Gaya Konsisten",
			desc: "Punya ciri khas signature style yang otentik dan selaras dengan kepribadian pribadimu."
		}
	];

	function toggle(id: GoalOption) {
		if (goals.includes(id)) {
			if (goals.length > 1) {
				goals = goals.filter((item) => item !== id);
			}
		} else {
			goals = [...goals, id];
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-4">
		<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
			Target yang Ingin Kamu Capai (Bisa Pilih Lebih dari Satu)
		</span>
	</div>

	<div class="space-y-3">
		{#each goalList as item (item.id)}
			{@const isSelected = goals.includes(item.id)}
			<button
				type="button"
				onclick={() => toggle(item.id)}
				class="w-full flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all {isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card hover:border-primary/40'}"
			>
				<div>
					<h3 class="font-serif text-base font-bold text-foreground">
						{item.title}
					</h3>
					<p class="mt-1 text-xs text-muted-foreground">
						{item.desc}
					</p>
				</div>

				<div class="flex size-5 shrink-0 items-center justify-center rounded-full border ml-4 {isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}">
					{#if isSelected}
						<CheckIcon class="size-3 stroke-[3]" />
					{/if}
				</div>
			</button>
		{/each}
	</div>
</div>

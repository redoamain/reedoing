<script lang="ts">
	import type { ChallengeOption } from "$lib/types/style";
	import CheckIcon from "@lucide/svelte/icons/check";

	interface Props {
		challenges: ChallengeOption[];
	}

	let { challenges = $bindable(["bingung-padu-padan"]) }: Props = $props();

	const challengeList: Array<{
		id: ChallengeOption;
		title: string;
		desc: string;
	}> = [
		{
			id: "bingung-padu-padan",
			title: "Bingung Memadukan Atasan & Bawahan",
			desc: "Punya banyak baju tapi selalu ragu apakah warna dan potongannya cocok saat digabungkan."
		},
		{
			id: "lemari-penuh",
			title: "Lemari Penuh Tapi Merasa Tak Punya Baju",
			desc: "Gantungan dan laci sesak, namun tiap kali mau bepergian selalu berputar pada 2 baju yang sama."
		},
		{
			id: "warna-monoton",
			title: "Warna Baju Terlalu Monoton atau Bertabrakan",
			desc: "Lemari hanya berisi hitam/putih polos, atau sebaliknya warna-warni yang sulit dicari pasangannya."
		},
		{
			id: "salah-beli",
			title: "Sering Impulsif dan Menyesal Setelah Beli",
			desc: "Bagus saat dicoba di fitting room, tapi setelah dibawa pulang tidak pernah dipakai sama sekali."
		},
		{
			id: "kurang-rapi",
			title: "Hasil Outfit Terasa Kurang Pas di Badan",
			desc: "Bentuk potongan sering terasa terlalu gombrang, kependekan, atau membuat proporsi tampak aneh."
		}
	];

	function toggle(id: ChallengeOption) {
		if (challenges.includes(id)) {
			if (challenges.length > 1) {
				challenges = challenges.filter((item) => item !== id);
			}
		} else {
			challenges = [...challenges, id];
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-4">
		<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
			Tantangan Paling Nyata yang Kamu Rasakan
		</span>
	</div>

	<div class="space-y-3">
		{#each challengeList as item (item.id)}
			{@const isSelected = challenges.includes(item.id)}
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

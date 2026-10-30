<script lang="ts">
	import type { Gender, HijabPreference, CoveragePreference } from "$lib/types/style";
	import UserIcon from "@lucide/svelte/icons/user";
	import UserRoundIcon from "@lucide/svelte/icons/user-round";

	interface Props {
		gender: Gender;
		hijab: HijabPreference;
		coverage: CoveragePreference;
	}

	let {
		gender = $bindable("wanita"),
		hijab = $bindable("tidak"),
		coverage = $bindable("standar")
	}: Props = $props();
</script>

<div class="space-y-6">
	<!-- Pilihan Gender -->
	<div>
		<span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">
			Kategori Pakaian Utama
		</span>
		<div class="grid grid-cols-2 gap-4">
			<button
				type="button"
				onclick={() => { gender = "pria"; }}
				class="group relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all {gender === 'pria' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/50'}"
			>
				<div class="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground group-hover:scale-105 transition-transform">
					<UserIcon class="size-7" />
				</div>
				<span class="mt-4 font-serif text-lg font-bold text-foreground">Pria</span>
				<span class="mt-1 text-xs text-muted-foreground">Siluet maskulin & tailoring klasik</span>
			</button>

			<button
				type="button"
				onclick={() => { gender = "wanita"; }}
				class="group relative flex flex-col items-center justify-center rounded-2xl border-2 p-6 text-center transition-all {gender === 'wanita' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/50'}"
			>
				<div class="flex size-14 items-center justify-center rounded-2xl bg-secondary text-foreground group-hover:scale-105 transition-transform">
					<UserRoundIcon class="size-7" />
				</div>
				<span class="mt-4 font-serif text-lg font-bold text-foreground">Wanita</span>
				<span class="mt-1 text-xs text-muted-foreground">Siluet feminin, kasual & modest</span>
			</button>
		</div>
	</div>

	<!-- Preferensi Hijab (Jika Wanita) -->
	{#if gender === "wanita"}
		<div class="rounded-2xl border border-border bg-muted/30 p-5 space-y-5 animate-in fade-in duration-300">
			<div>
				<span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
					Apakah kamu mengenakan hijab atau pakaian modest?
				</span>
				<div class="grid grid-cols-2 gap-3">
					<button
						type="button"
						onclick={() => { hijab = "ya"; }}
						class="flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs sm:text-sm font-semibold transition-all {hijab === 'ya' ? 'border-primary bg-primary text-primary-foreground shadow-xs' : 'border-border bg-card text-foreground hover:bg-muted'}"
					>
						<span>Ya, Berhijab / Modest</span>
					</button>
					<button
						type="button"
						onclick={() => { hijab = "tidak"; }}
						class="flex items-center justify-center gap-2 rounded-xl border p-3.5 text-xs sm:text-sm font-semibold transition-all {hijab === 'tidak' ? 'border-primary bg-primary text-primary-foreground shadow-xs' : 'border-border bg-card text-foreground hover:bg-muted'}"
					>
						<span>Tidak Berhijab</span>
					</button>
				</div>
			</div>

			{#if hijab === "ya"}
				<div>
					<span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
						Tingkat Coverage Potongan Pakaian
					</span>
					<div class="grid grid-cols-2 gap-3">
						<button
							type="button"
							onclick={() => { coverage = "longgar"; }}
							class="flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all {coverage === 'longgar' ? 'border-primary bg-primary/10 font-bold text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}"
						>
							<span class="text-xs sm:text-sm">Longgar / Oversized</span>
							<span class="text-[10px] text-muted-foreground mt-0.5">Tunik panjang & wide-leg flowy</span>
						</button>
						<button
							type="button"
							onclick={() => { coverage = "standar"; }}
							class="flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all {coverage === 'standar' ? 'border-primary bg-primary/10 font-bold text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}"
						>
							<span class="text-xs sm:text-sm">Standar Modest</span>
							<span class="text-[10px] text-muted-foreground mt-0.5">Tertutup rapi, panjang normal</span>
						</button>
					</div>
				</div>
			{/if}
		</div>
	{/if}
</div>

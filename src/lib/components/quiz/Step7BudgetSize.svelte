<script lang="ts">
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";

	interface Props {
		budget?: string;
		sizeTop?: string;
		sizeBottom?: string;
		sizeShoes?: string;
	}

	let {
		budget = $bindable(""),
		sizeTop = $bindable(""),
		sizeBottom = $bindable(""),
		sizeShoes = $bindable("")
	}: Props = $props();

	const budgetOptions = [
		"Hemat / Terjangkau (< Rp 350.000 / item)",
		"Menengah Berkualitas (Rp 350.000 - Rp 900.000 / item)",
		"Investasi Tahan Lama (> Rp 900.000 / item)",
		"Fleksibel / Belum Ditentukan"
	];

	const sizeTopOptions = ["XS", "S", "M", "L", "XL", "XXL", "Oversized / All Size"];
	const sizeBottomOptions = ["27-28 (S)", "29-30 (M)", "31-32 (L)", "33-34 (XL)", "35-36 (XXL)"];
</script>

<div class="space-y-6">
	<div class="rounded-xl border border-dashed border-border p-4 bg-muted/20 text-xs text-muted-foreground">
		<span class="font-bold text-foreground">Bagian ini opsional:</span> Kamu bisa langsung klik tombol "Selesaikan & Buat Panduan" tanpa mengisi, atau mengisinya agar catatan belanja pribadimu semakin lengkap.
	</div>

	<!-- Preferensi Anggaran Belanja -->
	<div>
		<Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5 block">
			Rentang Anggaran Pakaian Favorit (Opsional)
		</Label>
		<div class="grid gap-2 sm:grid-cols-2">
			{#each budgetOptions as opt}
				<button
					type="button"
					onclick={() => { budget = opt; }}
					class="rounded-xl border p-3 text-left text-xs transition-all {budget === opt ? 'border-primary bg-primary/10 font-bold text-foreground' : 'border-border bg-card text-muted-foreground hover:bg-muted'}"
				>
					{opt}
				</button>
			{/each}
		</div>
	</div>

	<!-- Ukuran Pakaian Standar -->
	<div class="border-t border-border/80 pt-5">
		<Label class="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
			Ukuran Tubuh Standar (Opsional)
		</Label>

		<div class="grid gap-4 sm:grid-cols-3">
			<div>
				<Label for="sizeTop" class="text-xs font-medium text-foreground mb-1.5 block">
					Ukuran Atasan / Baju
				</Label>
				<select
					id="sizeTop"
					bind:value={sizeTop}
					class="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<option value="">Pilih Ukuran Atasan</option>
					{#each sizeTopOptions as sz}
						<option value={sz}>{sz}</option>
					{/each}
				</select>
			</div>

			<div>
				<Label for="sizeBottom" class="text-xs font-medium text-foreground mb-1.5 block">
					Ukuran Celana / Rok
				</Label>
				<select
					id="sizeBottom"
					bind:value={sizeBottom}
					class="w-full rounded-lg border border-input bg-card px-3 py-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
				>
					<option value="">Pilih Ukuran Celana</option>
					{#each sizeBottomOptions as sz}
						<option value={sz}>{sz}</option>
					{/each}
				</select>
			</div>

			<div>
				<Label for="sizeShoes" class="text-xs font-medium text-foreground mb-1.5 block">
					Ukuran Sepatu (EU)
				</Label>
				<Input
					id="sizeShoes"
					type="text"
					placeholder="Mis. 40, 41, 42"
					bind:value={sizeShoes}
					class="text-xs"
				/>
			</div>
		</div>
	</div>
</div>

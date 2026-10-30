<script lang="ts">
	import { Card, CardHeader, CardTitle, CardContent } from "$lib/components/ui/card";
	import XIcon from "@lucide/svelte/icons/x";
	import CheckIcon from "@lucide/svelte/icons/check";
</script>

<section class="py-16 md:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Masalah Sebenarnya</span>
			<h2 class="mt-2 font-serif text-3xl font-extrabold sm:text-4xl text-foreground">
				Bukan kekurangan baju, <br class="hidden sm:inline" />
				kamu cuma kekurangan sistem.
			</h2>
			<p class="mt-3 text-muted-foreground text-sm sm:text-base">
				Membeli pakaian satu per satu tanpa rencana matang menciptakan lemari penuh yang saling bertabrakan.
			</p>
		</div>

		<div class="mt-12 grid gap-6 md:grid-cols-2">
			<!-- Sisi Kiri: Beli Satuan (Salah) -->
			<Card class="border-destructive/30 bg-destructive/5 relative overflow-hidden">
				<div class="absolute top-0 left-0 right-0 h-1 bg-destructive/60"></div>
				<CardHeader class="pb-3">
					<div class="flex items-center gap-2">
						<div class="flex size-7 items-center justify-center rounded-full bg-destructive/15 text-destructive">
							<XIcon class="size-4" />
						</div>
						<CardTitle class="font-serif text-xl text-destructive font-bold">Beli Satuan (Tanpa Arah)</CardTitle>
					</div>
					<p class="text-xs text-muted-foreground pt-1">
						Pola belanja impulsif yang sering dialami kebanyakan orang.
					</p>
				</CardHeader>
				<CardContent class="space-y-3.5 pt-2 text-sm text-foreground/90">
					<div class="flex items-start gap-2.5">
						<span class="text-destructive font-bold mt-0.5">✗</span>
						<span>Beli baju karena suka saat di gantungan toko, tapi bingung pasangannya apa di rumah.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="text-destructive font-bold mt-0.5">✗</span>
						<span>Warna-warna baju saling bertabrakan sehingga hanya bisa dipakai dengan 1 celana tertentu.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="text-destructive font-bold mt-0.5">✗</span>
						<span>Lemari terasa sesak dan berantakan, tapi tiap pagi mengeluh: <em>"Tak ada baju yang pas."</em></span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="text-destructive font-bold mt-0.5">✗</span>
						<span>Biaya belanja membengkak tanpa ada peningkatan kualitas penampilan.</span>
					</div>
				</CardContent>
			</Card>

			<!-- Sisi Kanan: Bangun Sebuah Sistem (Benar) -->
			<Card class="border-emerald-500/40 bg-emerald-500/5 relative overflow-hidden">
				<div class="absolute top-0 left-0 right-0 h-1 bg-emerald-600"></div>
				<CardHeader class="pb-3">
					<div class="flex items-center gap-2">
						<div class="flex size-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
							<CheckIcon class="size-4" />
						</div>
						<CardTitle class="font-serif text-xl text-emerald-700 dark:text-emerald-400 font-bold">Bangun Sebuah Sistem</CardTitle>
					</div>
					<p class="text-xs text-muted-foreground pt-1">
						Pendekatan terencana dengan formula capsule wardrobe terpadu.
					</p>
				</CardHeader>
				<CardContent class="space-y-3.5 pt-2 text-sm text-foreground/90">
					<div class="flex items-start gap-2.5">
						<span class="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
						<span>Tiap item baru wajib bisa dipadukan dengan minimal 3–4 item yang sudah ada di lemari.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
						<span>Palet warna netral saling mengunci (interlocking palette) memudahkan mix-and-match dengan mata tertutup.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
						<span>Hanya 12 item inti di gantungan, menghasilkan 30+ gaya tanpa pernah terlihat membosankan.</span>
					</div>
					<div class="flex items-start gap-2.5">
						<span class="text-emerald-600 dark:text-emerald-400 font-bold mt-0.5">✓</span>
						<span>Hemat anggaran belanja pakaian hingga 70% dengan kualitas bahan yang jauh lebih awet.</span>
					</div>
				</CardContent>
			</Card>
		</div>
	</div>
</section>

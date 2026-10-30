<script lang="ts">
	import PaletteIcon from "@lucide/svelte/icons/palette";
	import ShirtIcon from "@lucide/svelte/icons/shirt";
	import LayersIcon from "@lucide/svelte/icons/layers";
	import ShoppingBagIcon from "@lucide/svelte/icons/shopping-bag";
	import CheckIcon from "@lucide/svelte/icons/check";

	const benefits = [
		{
			title: "Warna Personal & Undertone",
			desc: "Padu padan warna yang menyatu dengan rona kulitmu berdasarkan analisis urat nadi pergelangan tangan (warm, cool, atau neutral tone).",
			icon: PaletteIcon,
			tag: "Harmonisasi Kulit"
		},
		{
			title: "Wardrobe Inti 12 Item",
			desc: "Koleksi item pakaian fungsional dengan tips fitting proporsi tubuh, panduan bahan adem tropis, dan tingkat fleksibilitas tiap item.",
			icon: ShirtIcon,
			tag: "Capsule Essentials"
		},
		{
			title: "30+ Outfit Siap Pakai",
			desc: "Katalog kombinasi visual per situasi (kerja kantor, meeting klien, kampus, hangout kafe, santai, dan formal) lengkap dengan rumus padu padannya.",
			icon: LayersIcon,
			tag: "Gaya Tanpa Bingung"
		},
		{
			title: "Daftar Belanja Prioritas",
			desc: "Urutan belanja berbasis dampak: tahu persis item mana yang perlu dibeli duluan karena membuka paling banyak outfit baru. Bebas cetak PDF.",
			icon: ShoppingBagIcon,
			tag: "Hemat & Terukur"
		}
	];
</script>

<section class="border-t border-border/80 bg-muted/20 py-16 md:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex flex-col items-center text-center">
			<span class="text-xs font-bold uppercase tracking-wider text-primary">Hasil Komprehensif</span>
			<h2 class="mt-2 font-serif text-3xl font-extrabold sm:text-4xl text-foreground">
				Yang Kamu Dapatkan
			</h2>
			<p class="mt-3 max-w-xl text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium">
				Satu panduan personal terpadu yang bisa kamu simpan, buka kembali kapan saja, atau unduh ke PDF.
			</p>
		</div>

		<!-- Clean Responsive 4-Column Grid -->
		<div class="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
			{#each benefits as b, i (i)}
				<div class="group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-md">
					<div>
						<div class="flex items-center justify-between">
							<div class="flex size-10 items-center justify-center rounded-xl bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100 border border-border/60 transition-colors group-hover:bg-stone-900 group-hover:text-stone-50 dark:group-hover:bg-stone-100 dark:group-hover:text-stone-900">
								<b.icon class="size-5" />
							</div>
							<span class="rounded-full border border-border/80 bg-stone-100 dark:bg-stone-800 px-2.5 py-0.5 text-[11px] font-bold text-foreground">
								{b.tag}
							</span>
						</div>

						<h3 class="mt-4 font-serif text-base sm:text-lg font-bold text-foreground">
							{b.title}
						</h3>
						<p class="mt-2 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
							{b.desc}
						</p>
					</div>

					<div class="mt-6 flex items-center gap-1.5 border-t border-border/60 pt-3 text-xs font-bold text-emerald-700 dark:text-emerald-400">
						<CheckIcon class="size-3.5 stroke-[3]" />
						<span>Termasuk dalam panduan</span>
					</div>
				</div>
			{/each}
		</div>
	</div>
</section>

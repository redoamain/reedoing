<script lang="ts">
	import LinkIcon from "@lucide/svelte/icons/link";
	import RulerIcon from "@lucide/svelte/icons/ruler";
	import CompassIcon from "@lucide/svelte/icons/compass";
	import TrendingUpIcon from "@lucide/svelte/icons/trending-up";

	const principles = [
		{
			title: "Warna Saling Terhubung",
			desc: "Semua warna dasar dan aksen saling mengunci sehingga atasan apa pun bisa dipasangkan dengan bawahan apa pun tanpa takut tabrakan.",
			icon: LinkIcon
		},
		{
			title: "Fit Sesuai Proporsi Tubuh",
			desc: "Bukan sekadar ukuran S/M/L, tapi pemahaman garis potongan (panjang keliman, tinggi pinggang, lebar bahu) yang menyeimbangkan siluet unikmu.",
			icon: RulerIcon
		},
		{
			title: "Siap di Banyak Situasi",
			desc: "Tiap item wajib bisa turun level (dress down) untuk nongkrong santai atau naik level (dress up) saat meeting penting dan acara formal.",
			icon: CompassIcon
		},
		{
			title: "Belanja Berdasarkan Prioritas",
			desc: "Hentikan belanja acak. Miliki checklist terukur yang memberitahu item mana yang paling bernilai investasi untuk koleksimu.",
			icon: TrendingUpIcon
		}
	];

	const sampleGridItems = [
		{ name: "Tailored Blazer", cat: "Outer", img: "/images/placeholder/blazer.svg" },
		{ name: "Knit Cardigan", cat: "Outer", img: "/images/placeholder/cardigan.svg" },
		{ name: "Kemeja Oxford", cat: "Atasan", img: "/images/placeholder/shirt.svg" },
		{ name: "Drape Blouse / Polo", cat: "Atasan", img: "/images/placeholder/blouse.svg" },
		{ name: "Kaos Katun Premium", cat: "Atasan", img: "/images/placeholder/tshirt.svg" },
		{ name: "Fine Knit Top", cat: "Atasan", img: "/images/placeholder/knitwear.svg" },
		{ name: "Pleated Trousers", cat: "Bawahan", img: "/images/placeholder/trousers.svg" },
		{ name: "Straight Denim", cat: "Bawahan", img: "/images/placeholder/denim.svg" },
		{ name: "Smart Chinos", cat: "Bawahan", img: "/images/placeholder/chinos.svg" },
		{ name: "Clean Sneakers", cat: "Sepatu", img: "/images/placeholder/sneakers.svg" },
		{ name: "Leather Loafers", cat: "Sepatu", img: "/images/placeholder/loafers.svg" },
		{ name: "Minimalist Bag / Scarf", cat: "Aksesori", img: "/images/placeholder/bag.svg" }
	];
</script>

<section class="py-16 md:py-24 border-t border-border/80">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filosofi Inti</span>
			<h2 class="mt-2 font-serif text-3xl font-extrabold sm:text-4xl text-foreground">
				Minimum Item, Maksimum Pakai
			</h2>
			<p class="mt-3 text-sm sm:text-base text-muted-foreground">
				Formula teruji yang mengubah cara pandangmu terhadap isi lemari pakaian.
			</p>
		</div>

		<!-- 4 Prinsip -->
		<div class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
			{#each principles as p, i (i)}
				<div class="rounded-xl border border-border bg-card p-5 shadow-xs">
					<div class="flex size-9 items-center justify-center rounded-lg bg-secondary text-foreground">
						<p.icon class="size-4.5" />
					</div>
					<h3 class="mt-3.5 font-serif text-base font-bold text-foreground">
						{p.title}
					</h3>
					<p class="mt-2 text-xs text-muted-foreground leading-relaxed">
						{p.desc}
					</p>
				</div>
			{/each}
		</div>

		<!-- Grid 12 Item -->
		<div class="mt-14 rounded-2xl border border-border bg-muted/30 p-6 sm:p-8">
			<div class="flex items-center justify-between border-b border-border pb-4">
				<div>
					<h3 class="font-serif text-lg font-bold text-foreground">Matriks 12 Item Esensial</h3>
					<p class="text-xs text-muted-foreground mt-0.5">Satu set item yang saling melengkapi untuk segala musim dan acara.</p>
				</div>
				<span class="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
					12 Item Terpadu
				</span>
			</div>

			<div class="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
				{#each sampleGridItems as it, idx (idx)}
					<div class="rounded-xl border border-border bg-card p-3 text-center transition-transform hover:-translate-y-1">
						<img
							src={it.img}
							alt={it.name}
							loading="lazy"
							class="mx-auto size-16 object-contain"
						/>
						<div class="mt-2 text-xs font-semibold text-foreground line-clamp-1">{it.name}</div>
						<div class="text-[10px] uppercase text-muted-foreground">{it.cat}</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

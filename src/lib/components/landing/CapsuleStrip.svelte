<script lang="ts">
	const items = [
		{ name: "Tailored Blazer", category: "Outer", img: "/images/placeholder/blazer.svg" },
		{ name: "Knit Cardigan", category: "Outer", img: "/images/placeholder/cardigan.svg" },
		{ name: "Kemeja Oxford", category: "Atasan", img: "/images/placeholder/shirt.svg" },
		{ name: "Drape Blouse / Polo", category: "Atasan", img: "/images/placeholder/blouse.svg" },
		{ name: "Kaos Katun Premium", category: "Atasan", img: "/images/placeholder/tshirt.svg" },
		{ name: "Fine Knit Top", category: "Atasan", img: "/images/placeholder/knitwear.svg" },
		{ name: "Pleated Trousers", category: "Bawahan", img: "/images/placeholder/trousers.svg" },
		{ name: "Straight Indigo Denim", category: "Bawahan", img: "/images/placeholder/denim.svg" },
		{ name: "Smart Chinos", category: "Bawahan", img: "/images/placeholder/chinos.svg" },
		{ name: "Clean Sneakers", category: "Sepatu", img: "/images/placeholder/sneakers.svg" },
		{ name: "Leather Loafers", category: "Sepatu", img: "/images/placeholder/loafers.svg" },
		{ name: "Structured Bag / Scarf", category: "Aksesori", img: "/images/placeholder/bag.svg" }
	];

	// Duplikasi array untuk looping marquee mulus
	const marqueeItems = [...items, ...items];
</script>

<section class="border-y border-border/80 bg-muted/30 py-5 sm:py-6 overflow-hidden">
	<div class="mx-auto max-w-6xl px-4 sm:px-6 mb-3 flex items-center justify-between">
		<div>
			<span class="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Contoh Capsule Wardrobe</span>
			<h2 class="font-serif text-lg sm:text-xl font-bold text-foreground mt-0.5">
				12 item esensial → 30+ outfit siap pakai
			</h2>
		</div>
		<span class="hidden sm:inline-block text-[11px] text-muted-foreground border border-border px-2.5 py-0.5 rounded-full bg-card">
			Sentuh untuk jeda
		</span>
	</div>

	<div class="relative w-full overflow-hidden">
		<!-- Fade Edge -->
		<div class="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 sm:w-16 bg-gradient-to-r from-muted/30 to-transparent"></div>
		<div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 sm:w-16 bg-gradient-to-l from-muted/30 to-transparent"></div>

		<div class="animate-marquee flex gap-3 py-1.5">
			{#each marqueeItems as item, i (i)}
				<div class="flex w-32 sm:w-36 shrink-0 flex-col items-center rounded-xl border border-border bg-card p-2 sm:p-2.5 shadow-2xs transition-transform hover:-translate-y-0.5">
					<img
						src={item.img}
						alt={item.name}
						loading="lazy"
						class="size-12 sm:size-14 object-contain"
					/>
					<span class="mt-1.5 text-[11px] sm:text-xs font-semibold text-foreground text-center line-clamp-1">{item.name}</span>
					<span class="text-[9px] uppercase tracking-wider text-muted-foreground">{item.category}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

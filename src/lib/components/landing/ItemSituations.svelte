<script lang="ts">
	import * as Carousel from "$lib/components/ui/carousel";
	import { Badge } from "$lib/components/ui/badge";
	import { Card, CardContent } from "$lib/components/ui/card";
	import LayersIcon from "@lucide/svelte/icons/layers";

	const situations = [
		{
			title: "Kerja Kantor",
			badge: "Formal Modern",
			pairing: "Blazer + Kemeja Putih + Pleated Trousers + Sepatu Kulit",
			tips: "Kancingkan saat berdiri untuk postur tegap. Tampilan clean yang berwibawa.",
			image: "/images/looks/outfit-kantor-1.svg"
		},
		{
			title: "Kampus / Kuliah",
			badge: "Smart Casual",
			pairing: "Blazer + Kaos Putih Katun + Straight Denim + Sneakers Bersih",
			tips: "Buka kancing dan singsingkan lengan sedikit untuk kesan santai namun tetap terdidik.",
			image: "/images/looks/outfit-kampus-1.svg"
		},
		{
			title: "Presentasi / Pitch",
			badge: "Kredibel & Tajam",
			pairing: "Blazer + Atasan Aksen Sage/Terracotta + Trousers + Tas Kulit",
			tips: "Warna aksen di bagian dalam mengarahkan fokus audiens ke wajah dan ekspresimu.",
			image: "/images/looks/outfit-meeting-1.svg"
		},
		{
			title: "Meeting Klien di Kafe",
			badge: "Relational Warm",
			pairing: "Blazer + Fine Knit Inner + Smart Chinos + Loafers",
			tips: "Kombinasi celana warna bumi memberi nuansa ramah tanpa kehilangan profesionalitas.",
			image: "/images/looks/outfit-meeting-3.svg"
		},
		{
			title: "Acara Santai / Dinner",
			badge: "Sophisticated Night",
			pairing: "Blazer + Kaos Gelap + Trousers + Jam Tangan / Aksesori Logam",
			tips: "Nuansa gelap monokromatik di malam hari memberikan daya tarik elegan yang effortless.",
			image: "/images/looks/outfit-formal-2.svg"
		}
	];
</script>

<section class="border-t border-border/80 bg-muted/20 py-16 md:py-24">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="flex flex-col items-center text-center">
			<div class="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-stone-100/80 dark:bg-stone-800/60 px-3 py-1 text-xs font-medium text-muted-foreground">
				<LayersIcon class="size-3 text-stone-500" />
				<span class="tracking-wider uppercase text-[10px]">Fleksibilitas Desain</span>
			</div>
			<h2 class="font-serif text-3xl font-bold sm:text-4xl text-foreground">
				Satu Item, Banyak Situasi
			</h2>
			<p class="mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground font-normal">
				Lihat bagaimana 1 potong blazer netral bisa beradaptasi sempurna ke 5 rutinitas berbeda hanya dengan menukar item pasangan dasarnya.
			</p>
		</div>

		<div class="mt-12 px-8 sm:px-12">
			<Carousel.Root class="w-full">
				<Carousel.Content class="-ml-4">
					{#each situations as item, i (i)}
						<Carousel.Item class="pl-4 md:basis-1/2 lg:basis-1/3">
							<Card class="h-full overflow-hidden border-border bg-card transition-all hover:shadow-md">
								<div class="aspect-16/10 max-h-52 w-full bg-muted/30 p-2 flex items-center justify-center border-b border-border">
									<img
										src={item.image}
										alt={item.title}
										loading="lazy"
										class="h-full w-full object-contain transition-transform duration-300 hover:scale-102"
									/>
								</div>
								<CardContent class="p-5">
									<div class="flex items-center justify-between">
										<span class="text-xs font-bold text-muted-foreground uppercase tracking-wider">Situasi #{i + 1}</span>
										<Badge variant="secondary" class="text-[10px]">{item.badge}</Badge>
									</div>
									<h3 class="mt-2 font-serif text-lg font-bold text-foreground">{item.title}</h3>
									<p class="mt-2 text-xs font-medium text-foreground/80 leading-relaxed bg-muted/50 p-2 rounded-md">
										{item.pairing}
									</p>
									<p class="mt-3 text-xs text-muted-foreground italic">
										"{item.tips}"
									</p>
								</CardContent>
							</Card>
						</Carousel.Item>
					{/each}
				</Carousel.Content>
				<Carousel.Previous class="-left-4 sm:-left-6" />
				<Carousel.Next class="-right-4 sm:-right-6" />
			</Carousel.Root>
		</div>
	</div>
</section>

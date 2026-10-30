<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
</script>

<section class="border-t border-border/80 bg-stone-900 text-white py-16 md:py-20 dark:bg-stone-950">
	<div class="mx-auto max-w-4xl px-4 sm:px-6 text-center">
		<div class="mx-auto flex size-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white mb-6">
			<span class="font-serif font-bold text-sm">R</span>
		</div>

		<h2 class="font-serif text-3xl font-bold sm:text-4xl text-white">
			Siap Membangun Gaya Pribadimu Hari Ini?
		</h2>

		<p class="mt-4 max-w-xl mx-auto text-sm sm:text-base text-stone-200 leading-relaxed font-normal">
			Hanya butuh 3 menit untuk mengetahui formula capsule wardrobe yang tepat. Bebas komitmen, tanpa biaya apa pun, dan langsung siap diterapkan.
		</p>

		<div class="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
			<Button
				href="/mulai"
				size="lg"
				class="w-full sm:w-auto bg-white hover:bg-stone-100 text-stone-950 hover:text-stone-950 font-bold px-8 py-3 text-sm shadow-md transition-colors"
			>
				Mulai Style Check Gratis
				<ArrowRightIcon class="size-4 ml-2" />
			</Button>
		</div>

		<p class="mt-4 text-xs text-stone-300 font-medium">
			100% Gratis Selamanya · Tanpa Buat Akun · Tanpa Iklan Spam
		</p>
	</div>
</section>

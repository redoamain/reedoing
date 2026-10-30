<script lang="ts">
	import UserCheckIcon from "@lucide/svelte/icons/user-check";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import CompassIcon from "@lucide/svelte/icons/compass";

	const steps = [
		{
			num: "01",
			title: "Ceritakan Rutinitas & Gaya",
			desc: "Jawab pertanyaan singkat seputar rutinitas harian, gaya favorit, dan siluet tubuhmu. Cepat, santai, dan tanpa perlu mendaftar akun.",
			icon: UserCheckIcon
		},
		{
			num: "02",
			title: "Deteksi Color Tone & Urat Nadi",
			desc: "Gunakan foto pergelangan tangan bagian dalam untuk mendeteksi warna urat nadi secara otomatis, atau pilih undertonemu langsung secara manual.",
			icon: SparklesIcon
		},
		{
			num: "03",
			title: "Dapatkan Panduan Siap Pakai",
			desc: "Terima formula personal 12 item esensial, 30+ padu-padan outfit per kegiatan, palet warna harmonis, dan checklist belanja prioritas.",
			icon: CompassIcon
		}
	];
</script>

<section class="py-16 md:py-24 border-t border-border/80">
	<div class="mx-auto max-w-6xl px-4 sm:px-6">
		<div class="mx-auto max-w-2xl text-center">
			<span class="text-xs font-bold uppercase tracking-wider text-primary">Proses Sederhana</span>
			<h2 class="mt-2 font-serif text-3xl font-extrabold sm:text-4xl text-foreground">
				Cara Kerja
			</h2>
			<p class="mt-3 text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium">
				Tiga langkah mudah menuju lemari pakaian fungsional yang bebas stres.
			</p>
		</div>

		<div class="mt-14 grid gap-8 md:grid-cols-3">
			{#each steps as step, i (i)}
				<div class="relative rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-stone-400 dark:hover:border-stone-600 hover:shadow-md">
					<div class="flex items-center justify-between">
						<span class="font-serif text-3xl font-extrabold text-stone-400 dark:text-stone-600">
							{step.num}
						</span>
						<div class="flex size-10 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-800 text-foreground border border-border/60">
							<step.icon class="size-5" />
						</div>
					</div>

					<h3 class="mt-4 font-serif text-xl font-bold text-foreground">
						{step.title}
					</h3>
					<p class="mt-2.5 text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed font-normal">
						{step.desc}
					</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<script lang="ts">
	import * as Accordion from "$lib/components/ui/accordion";
	import HelpCircleIcon from "@lucide/svelte/icons/help-circle";

	const faqs = [
		{
			id: "faq-1",
			question: "Apakah panduan ini cocok untuk pemula yang belum paham fashion?",
			answer:
				"Sangat cocok! Kami merancang panduan ini tanpa istilah fashion yang rumit. Kamu akan mendapatkan rumus padu padan sederhana yang sangat mudah dipahami, foto siluet visual, dan petunjuk langkah demi langkah yang bisa langsung dipraktikkan di depan cermin."
		},
		{
			id: "faq-2",
			question: "Apakah saya harus membeli semua item pakaian baru?",
			answer:
				"Sama sekali tidak. Prinsip utama capsule wardrobe adalah memanfaatkan apa yang sudah ada di lemarimu terlebih dahulu. Cek item yang sudah kamu punya, dan gunakan daftar belanja prioritas kami hanya jika ada item kunci yang belum kamu miliki."
		},
		{
			id: "faq-3",
			question: "Apakah panduan ini tersedia untuk pria dan wanita (termasuk yang berhijab)?",
			answer:
				"Ya! Di langkah pertama style check, kamu dapat memilih apakah ingin rekomendasi pria atau wanita. Untuk wanita, tersedia pilihan preferensi modest/hijab lengkap dengan potongan longgar, atasan tunik, dan rekomendasi warna pashmina/voal yang selaras."
		},
		{
			id: "faq-4",
			question: "Berapa lama proses style check hingga hasil keluar?",
			answer:
				"Sekitar 3 menit saja. Ada 7 pertanyaan pilihan ganda yang intuitif. Begitu selesai dijawab, sistem langsung menghasilkan panduan personalmu dalam sekejap tanpa proses tunggu yang bertele-tele."
		},
		{
			id: "faq-5",
			question: "Apakah web ini benar-benar 100% gratis?",
			answer:
				"Benar, 100% gratis tanpa biaya tersembunyi! Tidak ada paywall, tidak ada uji coba berbayar (free trial), tidak meminta kartu kredit, dan bahkan tidak mewajibkan kamu mendaftar atau login akun. Kami ingin semua orang bisa tampil percaya diri dengan mudah."
		}
	];
</script>

<section class="py-16 md:py-24">
	<div class="mx-auto max-w-4xl px-4 sm:px-6">
		<div class="flex flex-col items-center text-center">
			<div class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
				<HelpCircleIcon class="size-5" />
			</div>
			<span class="text-xs font-bold uppercase tracking-wider text-primary">Tanya Jawab</span>
			<h2 class="mt-2 font-serif text-3xl font-extrabold sm:text-4xl text-foreground">
				Pertanyaan yang Sering Diajukan
			</h2>
			<p class="mt-3 max-w-xl text-sm sm:text-base text-stone-700 dark:text-stone-300 font-medium">
				Jawaban terbuka untuk pertanyaan paling umum seputar panduan personal style ini.
			</p>
		</div>

		<div class="mt-12 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-xs">
			<Accordion.Root type="single" class="w-full">
				{#each faqs as item (item.id)}
					<Accordion.Item value={item.id} class="border-b border-border/80 last:border-b-0 py-1.5">
						<Accordion.Trigger class="text-left font-serif text-base sm:text-lg font-bold text-foreground hover:no-underline hover:text-foreground hover:bg-stone-100/80 dark:hover:bg-stone-800/60 rounded-xl px-3 py-2 -mx-3 transition-colors">
							{item.question}
						</Accordion.Trigger>
						<Accordion.Content class="text-xs sm:text-sm text-stone-700 dark:text-stone-300 leading-relaxed pt-2 pb-4 font-normal px-3 -mx-3">
							{item.answer}
						</Accordion.Content>
					</Accordion.Item>
				{/each}
			</Accordion.Root>
		</div>
	</div>
</section>

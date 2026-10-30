<script lang="ts">
	import { siteConfig } from "$lib/config";
	import Header from "$lib/components/landing/Header.svelte";
	import Hero from "$lib/components/landing/Hero.svelte";
	import HowItWorks from "$lib/components/landing/HowItWorks.svelte";
	import Benefits from "$lib/components/landing/Benefits.svelte";
	import Faq from "$lib/components/landing/Faq.svelte";
	import ClosingCta from "$lib/components/landing/ClosingCta.svelte";
	import Footer from "$lib/components/landing/Footer.svelte";

	const jsonLdSchema = {
		"@context": "https://schema.org",
		"@graph": [
			{
				"@type": "WebSite",
				"@id": `${siteConfig.url}/#website`,
				"url": siteConfig.url,
				"name": siteConfig.name,
				"description": siteConfig.description,
				"inLanguage": "id-ID"
			},
			{
				"@type": "Organization",
				"@id": `${siteConfig.url}/#organization`,
				"name": siteConfig.name,
				"url": siteConfig.url,
				"logo": `${siteConfig.url}/favicon.svg`,
				"email": siteConfig.contactEmail
			},
			{
				"@type": "WebApplication",
				"@id": `${siteConfig.url}/#app`,
				"name": "reedoing Capsule Wardrobe Generator",
				"applicationCategory": "LifestyleApplication",
				"operatingSystem": "All",
				"browserRequirements": "Requires HTML5 and JavaScript.",
				"offers": {
					"@type": "Offer",
					"price": "0",
					"priceCurrency": "IDR"
				},
				"description":
					"Aplikasi perancang capsule wardrobe 12 item personal dengan analisis color tone urat nadi pergelangan tangan dan proporsi tubuh."
			},
			{
				"@type": "HowTo",
				"name": "Cara Menentukan Capsule Wardrobe Personal",
				"description": "3 langkah praktis menyusun koleksi pakaian fungsional 12 item untuk 30+ outfit siap pakai.",
				"totalTime": "PT3M",
				"step": [
					{
						"@type": "HowToStep",
						"position": 1,
						"name": "Ceritakan Rutinitas & Gaya",
						"text": "Pilih rutinitas harian, gaya favorit (smart-casual, minimalis, dsb), dan bentuk tubuhmu."
					},
					{
						"@type": "HowToStep",
						"position": 2,
						"name": "Deteksi Color Tone & Urat Nadi",
						"text": "Unggah foto pergelangan tangan bagian dalam untuk deteksi otomatis warna urat nadi (kehijauan untuk warm tone, kebiruan untuk cool tone, campuran untuk neutral tone) atau tentukan secara manual."
					},
					{
						"@type": "HowToStep",
						"position": 3,
						"name": "Terima Panduan Siap Pakai",
						"text": "Dapatkan formula 12 item esensial, 30+ outfit siap pakai per situasi, palet warna kulit, dan checklist belanja prioritas."
					}
				]
			},
			{
				"@type": "FAQPage",
				"mainEntity": [
					{
						"@type": "Question",
						"name": "Apakah panduan ini cocok untuk pemula yang belum paham fashion?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Sangat cocok! Kami merancang panduan ini tanpa istilah fashion yang rumit. Kamu akan mendapatkan rumus padu padan sederhana yang sangat mudah dipahami, foto siluet visual, dan petunjuk langkah demi langkah yang bisa langsung dipraktikkan di depan cermin."
						}
					},
					{
						"@type": "Question",
						"name": "Apakah saya harus membeli semua item pakaian baru?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Sama sekali tidak. Prinsip utama capsule wardrobe adalah memanfaatkan apa yang sudah ada di lemarimu terlebih dahulu. Cek item yang sudah kamu punya, dan gunakan daftar belanja prioritas kami hanya jika ada item kunci yang belum kamu miliki."
						}
					},
					{
						"@type": "Question",
						"name": "Apakah panduan ini tersedia untuk pria dan wanita (termasuk yang berhijab)?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Ya! Di langkah pertama style check, kamu dapat memilih apakah ingin rekomendasi pria atau wanita. Untuk wanita, tersedia pilihan preferensi modest/hijab lengkap dengan potongan longgar, atasan tunik, dan rekomendasi warna pashmina/voal yang selaras."
						}
					},
					{
						"@type": "Question",
						"name": "Berapa lama proses style check hingga hasil keluar?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Sekitar 3 menit saja. Ada 7 pertanyaan pilihan ganda yang intuitif. Begitu selesai dijawab, sistem langsung menghasilkan panduan personalmu dalam sekejap tanpa proses tunggu yang bertele-tele."
						}
					},
					{
						"@type": "Question",
						"name": "Apakah web ini benar-benar 100% gratis?",
						"acceptedAnswer": {
							"@type": "Answer",
							"text": "Benar, 100% gratis tanpa biaya tersembunyi! Tidak ada paywall, tidak ada uji coba berbayar (free trial), tidak meminta kartu kredit, dan bahkan tidak mewajibkan kamu mendaftar atau login akun. Kami ingin semua orang bisa tampil percaya diri dengan mudah."
						}
					}
				]
			}
		]
	};
</script>

<svelte:head>
	<title>{siteConfig.name} — {siteConfig.tagline}</title>
	<meta name="description" content={siteConfig.description} />
	<meta name="keywords" content={siteConfig.keywords.join(", ")} />
	<meta name="author" content={siteConfig.author} />
	<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
	<link rel="canonical" href={siteConfig.url} />

	<!-- Open Graph / Meta Sosial -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteConfig.url} />
	<meta property="og:title" content={`${siteConfig.name} — ${siteConfig.tagline}`} />
	<meta property="og:description" content={siteConfig.description} />
	<meta property="og:site_name" content={siteConfig.name} />
	<meta property="og:locale" content={siteConfig.locale} />
	<meta property="og:image" content={`${siteConfig.url}/apple-touch-icon.png`} />
	<meta property="og:image:width" content="180" />
	<meta property="og:image:height" content="180" />
	<meta property="og:image:alt" content="Logo reedoing" />

	<!-- Twitter Cards -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:url" content={siteConfig.url} />
	<meta name="twitter:title" content={`${siteConfig.name} — ${siteConfig.tagline}`} />
	<meta name="twitter:description" content={siteConfig.description} />
	<meta name="twitter:image" content={`${siteConfig.url}/apple-touch-icon.png`} />

	<!-- Structured Data JSON-LD (Iteratif Schema) -->
	{@html `<script type="application/ld+json">${JSON.stringify(jsonLdSchema)}<\/script>`}
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<!-- 1. Header (Sticky) -->
	<Header />

	<main class="flex-1">
		<!-- 2. Hero Section (Hook + Value + CTA Utama) -->
		<Hero />

		<!-- 3. Cara Kerja (3 Langkah Cepat & Jelas) -->
		<HowItWorks />

		<!-- 4. Yang Kamu Dapatkan (Hasil Komprehensif) -->
		<Benefits />

		<!-- 5. Pertanyaan Umum (FAQ) -->
		<Faq />

		<!-- 6. Ajakan Penutup (Closing CTA) -->
		<ClosingCta />
	</main>

	<!-- 8. Footer -->
	<Footer />
</div>

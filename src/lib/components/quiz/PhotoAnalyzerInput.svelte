<script lang="ts">
	import type { Undertone } from "$lib/types/style";
	import {
		analyzeSkinFromImageData,
		buildResultForVein,
		type PhotoAnalysisResult,
		type VeinColorType
	} from "$lib/engine/photo-analyzer";
	import CameraIcon from "@lucide/svelte/icons/camera";
	import UploadIcon from "@lucide/svelte/icons/upload";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import CheckIcon from "@lucide/svelte/icons/check";
	import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
	import Trash2Icon from "@lucide/svelte/icons/trash-2";
	import SunIcon from "@lucide/svelte/icons/sun";
	import SnowflakeIcon from "@lucide/svelte/icons/snowflake";
	import ScaleIcon from "@lucide/svelte/icons/scale";
	import InfoIcon from "@lucide/svelte/icons/info";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";
	import SparklesIcon from "@lucide/svelte/icons/sparkles";
	import HandIcon from "@lucide/svelte/icons/hand";
	import LightbulbIcon from "@lucide/svelte/icons/lightbulb";
	import { Button } from "$lib/components/ui/button";

	interface Props {
		undertone: Undertone;
		photoSkinHex?: string;
		photoConfidence?: number;
		photoVeinType?: VeinColorType;
		photoBase64?: string;
	}

	let {
		undertone = $bindable("hangat"),
		photoSkinHex = $bindable(undefined),
		photoConfidence = $bindable(undefined),
		photoVeinType = $bindable(undefined),
		photoBase64 = $bindable(undefined)
	}: Props = $props();

	let fileInputGallery: HTMLInputElement | undefined = $state();
	let fileInputCamera: HTMLInputElement | undefined = $state();

	let previewUrl = $state<string | null>(null);
	let isAnalyzing = $state(false);
	let analysisResult = $state<PhotoAnalysisResult | null>(null);
	let isDragging = $state(false);
	let errorMessage = $state<string | null>(null);
	let showVeinGuide = $state(true);

	function processImageFile(file: File) {
		if (!file.type.startsWith("image/")) {
			errorMessage = "Harap unggah file gambar yang valid (JPG, PNG, atau WEBP).";
			return;
		}

		errorMessage = null;
		isAnalyzing = true;

		// Buat preview URL
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		const objectUrl = URL.createObjectURL(file);
		previewUrl = objectUrl;

		const img = new Image();
		img.onload = () => {
			try {
				const canvas = document.createElement("canvas");
				const maxDim = 360;
				let w = img.naturalWidth || img.width;
				let h = img.naturalHeight || img.height;

				if (w > maxDim || h > maxDim) {
					if (w > h) {
						h = Math.round((h * maxDim) / w);
						w = maxDim;
					} else {
						w = Math.round((w * maxDim) / h);
						h = maxDim;
					}
				}

				canvas.width = Math.max(1, w);
				canvas.height = Math.max(1, h);
				const ctx = canvas.getContext("2d");

				if (!ctx) {
					throw new Error("Gagal menginisialisasi canvas pemrosesan.");
				}

				ctx.drawImage(img, 0, 0, w, h);
				const imageData = ctx.getImageData(0, 0, w, h);
				const result = analyzeSkinFromImageData(imageData);

				analysisResult = result;
				photoSkinHex = result.dominantHex;
				photoConfidence = result.confidence;
				photoVeinType = result.veinColorType;

				// Simpan preview base64 untuk visualisasi AI
				try {
					photoBase64 = canvas.toDataURL("image/jpeg", 0.7);
				} catch (e) {
					// Abaikan jika toDataURL terblokir
				}

				// Terapkan undertone hasil deteksi otomatis
				undertone = result.undertone;
				isAnalyzing = false;
			} catch (err: any) {
				errorMessage = err?.message || "Gagal memproses gambar. Silakan coba unggah foto lain.";
				isAnalyzing = false;
			}
		};

		img.onerror = () => {
			errorMessage = "Gagal memuat gambar. Pastikan file gambar tidak rusak.";
			isAnalyzing = false;
		};

		img.src = objectUrl;
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const files = target.files;
		if (files && files.length > 0) {
			processImageFile(files[0]);
		}
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
		if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
			processImageFile(event.dataTransfer.files[0]);
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		isDragging = true;
	}

	function handleDragLeave(event: DragEvent) {
		event.preventDefault();
		isDragging = false;
	}

	function handleReset() {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
			previewUrl = null;
		}
		analysisResult = null;
		photoSkinHex = undefined;
		photoConfidence = undefined;
		photoVeinType = undefined;
		photoBase64 = undefined;
		errorMessage = null;
		if (fileInputGallery) fileInputGallery.value = "";
		if (fileInputCamera) fileInputCamera.value = "";
	}

	function applyUndertoneManual() {
		if (analysisResult) {
			undertone = analysisResult.undertone;
		}
	}

	function handleVeinTypeChange(type: VeinColorType) {
		if (analysisResult) {
			const updated = buildResultForVein(
				type,
				analysisResult.dominantHex,
				analysisResult.confidence
			);
			analysisResult = updated;
			undertone = updated.undertone;
			photoVeinType = updated.veinColorType;
		}
	}
</script>

<div class="rounded-2xl border border-primary/25 bg-gradient-to-b from-primary/5 via-card to-card p-5 sm:p-6 shadow-xs transition-all">
	<!-- Header -->
	<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/70 pb-4">
		<div class="flex items-center gap-2.5">
			<div class="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
				<HandIcon class="size-5" />
			</div>
			<div>
				<div class="flex items-center gap-2">
					<h3 class="font-serif text-base font-bold text-foreground">
						Analisis Color Tone Kulit dari Foto
					</h3>
					<span class="inline-flex items-center rounded-full border border-border/80 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
						Opsional
					</span>
				</div>
				<p class="text-xs text-muted-foreground mt-0.5">
					Sangat disarankan menggunakan foto <strong class="text-foreground">pergelangan tangan bagian dalam</strong> yang memperlihatkan warna urat nadi untuk deteksi color tone paling presisi.
				</p>
			</div>
		</div>

		<!-- Privacy Pill -->
		<div class="inline-flex items-center gap-1.5 self-start sm:self-auto rounded-full border border-border/80 bg-background/80 px-2.5 py-1 text-[11px] text-muted-foreground">
			<ShieldCheckIcon class="size-3.5 text-primary" />
			<span>100% diproses di browser, privasi terjaga</span>
		</div>
	</div>

	<!-- Vein & Color Tone Guidance Box (Why & How to take the photo) -->
	<div class="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs">
		<div class="flex items-center justify-between gap-2 mb-2">
			<div class="flex items-center gap-2 font-semibold text-foreground">
				<SparklesIcon class="size-4 text-primary" />
				<span>Panduan Foto: Mengapa Warna Urat Nadi Pergelangan Tangan?</span>
			</div>
			<button
				type="button"
				onclick={() => { showVeinGuide = !showVeinGuide; }}
				class="text-[11px] text-primary hover:underline font-medium"
			>
				{showVeinGuide ? "Sembunyikan Panduan" : "Lihat Panduan Urat Nadi"}
			</button>
		</div>

		{#if showVeinGuide}
			<p class="text-muted-foreground leading-relaxed mb-3">
				Warna urat nadi di pergelangan tangan bagian dalam adalah indikator ilmiah paling akurat untuk mengetahui undertone (color tone). Lapisan kulit di area ini tipis dan terlindung dari paparan sinar matahari, sehingga warna alami pembuluh darah terlihat paling murni.
			</p>

			<!-- 3 Tone Cards -->
			<div class="grid gap-2.5 sm:grid-cols-3 mb-3">
				<!-- Warm Tone -->
				<div class="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
					<div class="flex items-center gap-2 font-bold text-amber-900 dark:text-amber-200">
						<span class="size-3 rounded-full bg-emerald-600 border border-white shadow-xs"></span>
						<span>Urat Nadi Kehijauan</span>
					</div>
					<div class="mt-1 font-serif text-xs font-bold text-foreground">
						→ Warm Tone (Hangat)
					</div>
					<p class="mt-1 text-xs text-foreground/80 dark:text-foreground/90 leading-relaxed font-normal">
						Pigmen kuning keemasan kulit membiaskan warna biru darah menjadi hijau/olive. Serasi dengan broken white, camel, dan terracotta.
					</p>
				</div>

				<!-- Cool Tone -->
				<div class="rounded-lg border border-sky-500/30 bg-sky-500/10 p-3">
					<div class="flex items-center gap-2 font-bold text-sky-900 dark:text-sky-200">
						<span class="size-3 rounded-full bg-blue-600 border border-white shadow-xs"></span>
						<span>Urat Nadi Kebiruan / Ungu</span>
					</div>
					<div class="mt-1 font-serif text-xs font-bold text-foreground">
						→ Cool Tone (Dingin)
					</div>
					<p class="mt-1 text-xs text-foreground/80 dark:text-foreground/90 leading-relaxed font-normal">
						Kulit minim pigmen kuning sehingga pembuluh darah tampak biru/keunguan. Serasi dengan pure white, deep navy, dan burgundy.
					</p>
				</div>

				<!-- Neutral Tone -->
				<div class="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3">
					<div class="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
						<span class="size-3 rounded-full bg-teal-600 border border-white shadow-xs"></span>
						<span>Urat Nadi Campuran / Samar</span>
					</div>
					<div class="mt-1 font-serif text-xs font-bold text-foreground">
						→ Neutral Tone (Netral)
					</div>
					<p class="mt-1 text-xs text-foreground/80 dark:text-foreground/90 leading-relaxed font-normal">
						Perpaduan seimbang hijau dan biru. Fleksibel mengenakan spektrum warna netral, sage green, maupun navy klasik.
					</p>
				</div>
			</div>

			<!-- Tips Bar -->
			<div class="flex flex-wrap items-center gap-y-1.5 gap-x-4 border-t border-border/60 pt-2.5 text-xs text-foreground/85 dark:text-foreground/90 font-medium">
				<div class="flex items-center gap-1.5">
					<SunIcon class="size-3.5 text-amber-500" />
					<span>Gunakan cahaya alami dekat jendela</span>
				</div>
				<div class="flex items-center gap-1.5">
					<LightbulbIcon class="size-3.5 text-primary" />
					<span>Hindari lampu kuning ruangan & flash</span>
				</div>
				<div class="flex items-center gap-1.5">
					<CameraIcon class="size-3.5 text-sky-500" />
					<span>Fokuskan ke urat nadi pergelangan (15–20 cm)</span>
				</div>
			</div>
		{/if}
	</div>

	<!-- Error Alert -->
	{#if errorMessage}
		<div class="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
			<AlertCircleIcon class="size-4 shrink-0" />
			<span>{errorMessage}</span>
		</div>
	{/if}

	<!-- Upload Area (if no result and not analyzing) -->
	{#if !analysisResult && !isAnalyzing}
		<div
			role="region"
			aria-label="Area unggah foto pergelangan tangan untuk deteksi color tone urat nadi"
			ondrop={handleDrop}
			ondragover={handleDragOver}
			ondragleave={handleDragLeave}
			class="mt-4 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all {isDragging ? 'border-primary bg-primary/10 scale-[0.99]' : 'border-border/80 bg-card/60 hover:border-primary/50'}"
		>
			<!-- Hidden File Inputs -->
			<input
				type="file"
				accept="image/*"
				class="sr-only"
				bind:this={fileInputGallery}
				onchange={handleFileChange}
			/>
			<input
				type="file"
				accept="image/*"
				capture="environment"
				class="sr-only"
				bind:this={fileInputCamera}
				onchange={handleFileChange}
			/>

			<!-- Best Recommendation Pill -->
			<div class="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-semibold text-primary mb-2 shadow-2xs">
				<SparklesIcon class="size-3.5" />
				<span>Disarankan: Foto Pergelangan Tangan & Urat Nadi</span>
			</div>

			<div class="flex size-12 items-center justify-center rounded-2xl bg-secondary text-primary shadow-xs mt-1">
				<UploadIcon class="size-6" />
			</div>

			<h4 class="mt-3 text-sm font-semibold text-foreground">
				Tarik & lepas foto pergelangan tangan bagian dalam di sini
			</h4>
			<p class="mt-1 text-xs text-muted-foreground max-w-md">
				Arahkan kamera ke pergelangan tangan dengan pencahayaan alami di siang hari agar warna urat nadi terbaca akurat.
			</p>

			<div class="mt-4 flex flex-wrap items-center justify-center gap-2.5">
				<Button
					type="button"
					variant="default"
					size="sm"
					onclick={() => fileInputCamera?.click()}
					class="gap-1.5 font-medium shadow-xs"
				>
					<CameraIcon class="size-3.5" />
					Ambil Foto Pergelangan (Kamera)
				</Button>

				<Button
					type="button"
					variant="outline"
					size="sm"
					onclick={() => fileInputGallery?.click()}
					class="gap-1.5 font-medium"
				>
					<UploadIcon class="size-3.5" />
					Pilih dari Galeri
				</Button>
			</div>

			<div class="mt-3.5 flex flex-wrap items-center justify-center gap-3 text-[11px] text-muted-foreground">
				<div class="flex items-center gap-1">
					<InfoIcon class="size-3" />
					<span>Format: JPG, PNG, WEBP (maksimal 10MB)</span>
				</div>
				<span class="text-border">•</span>
				<span class="italic">Tetap bisa menggunakan foto wajah alami tanpa makeup</span>
			</div>
		</div>
	{:else if isAnalyzing}
		<!-- Loading state -->
		<div class="mt-4 flex flex-col items-center justify-center rounded-xl border border-border bg-card/60 p-8 text-center">
			<div class="size-10 animate-spin rounded-full border-3 border-primary border-t-transparent"></div>
			<p class="mt-3 text-sm font-semibold text-foreground">
				Menganalisis warna urat nadi & pigmen kulit...
			</p>
			<p class="mt-1 text-xs text-muted-foreground">
				Mendeteksi pembiasan warna pembuluh darah (kehijauan vs kebiruan) & ruang warna CIE Lab
			</p>
		</div>
	{:else if analysisResult}
		<!-- Result State -->
		<div class="mt-4 space-y-4">
			<!-- Top Result Bar -->
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-border bg-card p-4">
				<div class="flex items-center gap-3.5">
					<!-- Photo thumbnail & Detected Swatch Circle -->
					<div class="relative">
						{#if previewUrl}
							<img
								src={previewUrl}
								alt="Foto kulit dan urat nadi pergelangan tangan"
								class="size-14 rounded-full object-cover border-2 border-border shadow-xs"
							/>
						{/if}
						<div
							class="absolute -bottom-1 -right-1 size-7 rounded-full border-2 border-background shadow-md flex items-center justify-center"
							style="background-color: {analysisResult.dominantHex};"
							title="Warna kulit terdeteksi: {analysisResult.dominantHex}"
						></div>
					</div>

					<div>
						<div class="flex flex-wrap items-center gap-2">
							<span class="text-xs font-semibold text-muted-foreground">
								Warna Kulit:
							</span>
							<span class="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-secondary text-foreground">
								{analysisResult.dominantHex}
							</span>
							<span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
								<CheckIcon class="size-3" />
								{analysisResult.confidence}% Akurat
							</span>
						</div>

						<div class="mt-1 flex flex-wrap items-center gap-2">
							<!-- Undertone label -->
							<div class="flex items-center gap-1.5 font-serif text-sm font-bold text-foreground">
								{#if analysisResult.undertone === "hangat"}
									<SunIcon class="size-4 text-amber-500" />
									<span>Undertone Hangat (Warm Tone)</span>
								{:else if analysisResult.undertone === "dingin"}
									<SnowflakeIcon class="size-4 text-sky-500" />
									<span>Undertone Dingin (Cool Tone)</span>
								{:else}
									<ScaleIcon class="size-4 text-emerald-500" />
									<span>Undertone Netral (Neutral Tone)</span>
								{/if}
							</div>

							<!-- Vein indicator badge -->
							{#if analysisResult.veinColorType === "hijau"}
								<span class="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:text-emerald-300">
									<span class="size-1.5 rounded-full bg-emerald-600"></span>
									Urat Nadi Kehijauan (Olive)
								</span>
							{:else if analysisResult.veinColorType === "biru"}
								<span class="inline-flex items-center gap-1 rounded-full bg-sky-500/15 border border-sky-500/30 px-2 py-0.5 text-[10px] font-semibold text-sky-700 dark:text-sky-300">
									<span class="size-1.5 rounded-full bg-blue-600"></span>
									Urat Nadi Kebiruan / Ungu
								</span>
							{:else}
								<span class="inline-flex items-center gap-1 rounded-full bg-teal-500/15 border border-teal-500/30 px-2 py-0.5 text-[10px] font-semibold text-teal-700 dark:text-teal-300">
									<span class="size-1.5 rounded-full bg-teal-600"></span>
									Urat Nadi Campuran
								</span>
							{/if}
						</div>
					</div>
				</div>

				<!-- Actions -->
				<div class="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-border/60 pt-2 sm:pt-0">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onclick={() => fileInputGallery?.click()}
						class="text-xs text-muted-foreground hover:text-foreground gap-1.5"
					>
						<RefreshCwIcon class="size-3.5" />
						Ganti Foto
					</Button>
					<Button
						type="button"
						variant="ghost"
						size="sm"
						onclick={handleReset}
						class="text-xs text-destructive hover:bg-destructive/10 gap-1.5"
					>
						<Trash2Icon class="size-3.5" />
						Hapus
					</Button>
				</div>
			</div>

			<!-- Quick Vein Color Confirmation / Manual Override Bar -->
			<div class="rounded-xl border border-border/80 bg-background/60 p-3.5 text-xs">
				<div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
					<div>
						<span class="font-semibold text-foreground block">
							Sesuaikan Warna Urat Nadi (Bila Pencahayaan Foto Kurang Pas):
						</span>
						<span class="text-[11px] text-muted-foreground">
							Klik pilihan yang paling mirip dengan urat nadi pergelangan tanganmu di bawah cahaya alami:
						</span>
					</div>

					<div class="flex items-center gap-1.5 flex-wrap">
						<button
							type="button"
							onclick={() => handleVeinTypeChange("hijau")}
							class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all {analysisResult.veinColorType === 'hijau' ? 'border-amber-600 bg-amber-500/25 text-amber-950 dark:text-amber-100 shadow-2xs' : 'border-border bg-card hover:bg-secondary text-foreground'}"
						>
							<span class="size-2 rounded-full bg-emerald-600"></span>
							<span>Hijau (Warm)</span>
						</button>

						<button
							type="button"
							onclick={() => handleVeinTypeChange("biru")}
							class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all {analysisResult.veinColorType === 'biru' ? 'border-sky-600 bg-sky-500/25 text-sky-950 dark:text-sky-100 shadow-2xs' : 'border-border bg-card hover:bg-secondary text-foreground'}"
						>
							<span class="size-2 rounded-full bg-blue-600"></span>
							<span>Biru / Ungu (Cool)</span>
						</button>

						<button
							type="button"
							onclick={() => handleVeinTypeChange("campuran")}
							class="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-all {analysisResult.veinColorType === 'campuran' ? 'border-teal-600 bg-teal-500/25 text-teal-950 dark:text-teal-100 shadow-2xs' : 'border-border bg-card hover:bg-secondary text-foreground'}"
						>
							<span class="size-2 rounded-full bg-teal-600"></span>
							<span>Campuran (Netral)</span>
						</button>
					</div>
				</div>
			</div>

			<!-- Scientific Explanation -->
			<div class="rounded-xl bg-secondary/60 p-3.5 text-xs text-foreground leading-relaxed border border-border/80">
				<p>
					<strong class="font-bold text-foreground">Hasil Analisis Color Tone:</strong>
					{analysisResult.explanation}
				</p>
			</div>

			<!-- Recommended Outfit Colors from Photo -->
			<div class="grid gap-3 sm:grid-cols-2">
				<div class="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5">
					<div class="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
						<CheckIcon class="size-3.5 stroke-[3]" />
						<span>Warna Pakaian yang Paling Harmonis:</span>
					</div>
					<div class="mt-2.5 flex flex-wrap gap-1.5">
						{#each analysisResult.recommendedOutfitColors as color}
							<span class="inline-flex items-center rounded-lg bg-card px-2.5 py-1 text-xs font-bold text-foreground shadow-2xs border border-border">
								{color}
							</span>
						{/each}
					</div>
				</div>

				<div class="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5">
					<div class="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-300">
						<AlertCircleIcon class="size-3.5" />
						<span>Warna Pakaian yang Perlu Dihindari:</span>
					</div>
					<div class="mt-2.5 flex flex-wrap gap-1.5">
						{#each analysisResult.avoidColors as color}
							<span class="inline-flex items-center rounded-lg bg-card px-2.5 py-1 text-xs font-semibold text-foreground/80 line-through decoration-amber-600 dark:decoration-amber-400 shadow-2xs border border-border">
								{color}
							</span>
						{/each}
					</div>
				</div>
			</div>

			<!-- Applied Notification / Sync Button -->
			<div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 rounded-xl bg-primary/10 p-3 text-xs text-foreground border border-primary/20">
				<div class="flex items-center gap-2">
					<CheckIcon class="size-4 text-primary shrink-0 stroke-[2.5]" />
					<span>
						Undertone <strong>{analysisResult.undertone.toUpperCase()}</strong> otomatis diterapkan untuk rekomendasi capsule wardrobemu di bawah.
					</span>
				</div>
				{#if undertone !== analysisResult.undertone}
					<Button
						type="button"
						size="sm"
						variant="outline"
						onclick={applyUndertoneManual}
						class="text-xs h-7 gap-1 border-primary/40 text-primary font-semibold self-end sm:self-auto"
					>
						Terapkan Ulang
					</Button>
				{/if}
			</div>
		</div>
	{/if}
</div>

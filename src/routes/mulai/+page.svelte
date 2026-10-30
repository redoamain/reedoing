<script lang="ts">
	import { untrack } from "svelte";
	import { enhance, applyAction } from "$app/forms";
	import { toast } from "svelte-sonner";
	import { siteConfig } from "$lib/config";
	import ProgressBar from "$lib/components/quiz/ProgressBar.svelte";
	import Step1Gender from "$lib/components/quiz/Step1Gender.svelte";
	import Step2Styles from "$lib/components/quiz/Step2Styles.svelte";
	import Step3Routines from "$lib/components/quiz/Step3Routines.svelte";
	import Step4Goals from "$lib/components/quiz/Step4Goals.svelte";
	import Step5Challenges from "$lib/components/quiz/Step5Challenges.svelte";
	import Step6ColorsFit from "$lib/components/quiz/Step6ColorsFit.svelte";
	import Step7BudgetSize from "$lib/components/quiz/Step7BudgetSize.svelte";
	import { Button } from "$lib/components/ui/button";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import ArrowRightIcon from "@lucide/svelte/icons/arrow-right";
	import CheckCircleIcon from "@lucide/svelte/icons/check-circle";
	import ShieldCheckIcon from "@lucide/svelte/icons/shield-check";
	import Loader2Icon from "@lucide/svelte/icons/loader-2";

	import {
		step1Schema,
		step2Schema,
		step3Schema,
		step4Schema,
		step5Schema,
		step6Schema
	} from "$lib/validation/quiz";
	import type { PageData } from "./$types";
	import type { QuizAnswers, Gender, HijabPreference, CoveragePreference, StyleOption, RoutineOption, GoalOption, ChallengeOption, Undertone, BodyProportion } from "$lib/types/style";

	let { data }: { data: PageData } = $props();

	function getInitialState(pageData: PageData) {
		const ans: QuizAnswers = {
			gender: (pageData.answers?.gender as Gender) || "wanita",
			hijab: (pageData.answers?.hijab as HijabPreference) || "tidak",
			coverage: (pageData.answers?.coverage as CoveragePreference) || "standar",
			styles: (pageData.answers?.styles as StyleOption[]) || ["smart-casual"],
			routines: (pageData.answers?.routines as RoutineOption[]) || ["kantor", "hangout"],
			goals: (pageData.answers?.goals as GoalOption[]) || ["lebih-rapi", "percaya-diri"],
			challenges: (pageData.answers?.challenges as ChallengeOption[]) || ["bingung-padu-padan"],
			undertone: (pageData.answers?.undertone as Undertone) || "hangat",
			bodyProportion: (pageData.answers?.bodyProportion as BodyProportion) || "seimbang",
			budget: pageData.answers?.budget || "",
			sizeTop: pageData.answers?.sizeTop || "",
			sizeBottom: pageData.answers?.sizeBottom || "",
			sizeShoes: pageData.answers?.sizeShoes || "",
			photoSkinHex: pageData.answers?.photoSkinHex,
			photoConfidence: pageData.answers?.photoConfidence,
			photoVeinType: pageData.answers?.photoVeinType as ("hijau" | "biru" | "campuran" | undefined),
			photoBase64: pageData.answers?.photoBase64
		};
		return { initialStep: pageData.step || 1, initialAnswers: ans };
	}

	const initial = untrack(() => getInitialState(data));
	let step = $state<number>(initial.initialStep);
	let isSubmitting = $state<boolean>(false);
	let answers = $state<QuizAnswers>(initial.initialAnswers);

	let completeForm: HTMLFormElement | undefined = $state();

	const stepTitles = [
		{ title: "Kategori Pakaian & Preferensi", subtitle: "Tentukan arah kategori siluet yang sesuai untuk kebutuhanmu." },
		{ title: "Gaya yang Paling Kamu Sukai", subtitle: "Pilih 1 atau 2 estetika yang ingin kamu bangun dalam koleksimu." },
		{ title: "Rutinitas Harianmu", subtitle: "Capsule wardrobe disusun agar selalu pas dengan kegiatan utamamu." },
		{ title: "Target Penampilan Pribadi", subtitle: "Apa hal terpenting yang ingin kamu capai lewat panduan ini?" },
		{ title: "Tantangan Berpakaian Saat Ini", subtitle: "Kami akan membantu menyelesaikan kendala terbesarmu saat memilih outfit." },
		{ title: "Undertone Kulit & Proporsi Tubuh", subtitle: "Gunakan foto pergelangan tangan (warna urat nadi) untuk mengetahui color tone atau pilih manual." },
		{ title: "Preferensi Ukuran & Anggaran", subtitle: "Opsional — lengkapi catatan untuk daftar belanja pribadimu." }
	];

	// Simpan autosave ke server di background tanpa me-reload data loader
	async function saveStepToServer(newStep: number) {
		try {
			const fd = new FormData();
			fd.set("step", newStep.toString());
			fd.set("answers", JSON.stringify(answers));
			await fetch("?/saveStep", {
				method: "POST",
				body: fd
			});
		} catch (e) {
			// Fail silently di background
		}
	}

	function validateCurrentStep(): boolean {
		if (step === 1) {
			const res = step1Schema.safeParse({
				gender: answers.gender,
				hijab: answers.hijab,
				coverage: answers.coverage
			});
			if (!res.success) {
				toast.error(res.error.issues[0]?.message || "Lengkapi pilihan pada langkah ini.");
				return false;
			}
		} else if (step === 2) {
			const res = step2Schema.safeParse({ styles: answers.styles });
			if (!res.success) {
				toast.error(res.error.issues[0]?.message || "Pilih 1 atau 2 gaya favoritmu.");
				return false;
			}
		} else if (step === 3) {
			const res = step3Schema.safeParse({ routines: answers.routines });
			if (!res.success) {
				toast.error(res.error.issues[0]?.message || "Pilih minimal 1 rutinitas harian.");
				return false;
			}
		} else if (step === 4) {
			const res = step4Schema.safeParse({ goals: answers.goals });
			if (!res.success) {
				toast.error(res.error.issues[0]?.message || "Pilih minimal 1 target penampilan.");
				return false;
			}
		} else if (step === 5) {
			const res = step5Schema.safeParse({ challenges: answers.challenges });
			if (!res.success) {
				toast.error(res.error.issues[0]?.message || "Pilih minimal 1 tantangan yang dihadapi.");
				return false;
			}
		} else if (step === 6) {
			const res = step6Schema.safeParse({
				undertone: answers.undertone,
				bodyProportion: answers.bodyProportion
			});
			if (!res.success) {
				toast.error(res.error.issues[0]?.message || "Pilih undertone dan proporsi tubuhmu.");
				return false;
			}
		}
		return true;
	}

	function handleNext() {
		if (!validateCurrentStep()) return;

		if (step < 7) {
			step += 1;
			saveStepToServer(step);
			window.scrollTo({ top: 0, behavior: "smooth" });
		} else {
			isSubmitting = true;
			completeForm?.requestSubmit();
		}
	}

	function handlePrev() {
		if (step > 1) {
			step -= 1;
			saveStepToServer(step);
			window.scrollTo({ top: 0, behavior: "smooth" });
		}
	}
</script>

<svelte:head>
	<title>Mulai Style Check — {siteConfig.name}</title>
	<meta name="description" content="Temukan capsule wardrobe personalmu dalam 3 menit. Gratis, tanpa upload foto, tanpa login." />
</svelte:head>

<div class="min-h-screen bg-background text-foreground flex flex-col">
	<!-- Top Bar -->
	<header class="border-b border-border/80 bg-background/80 backdrop-blur-md sticky top-0 z-40">
		<div class="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
			<a href="/" class="flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors">
				<ArrowLeftIcon class="size-4" />
				<span>Kembali ke Beranda</span>
			</a>
			<div class="flex items-center gap-1.5 text-xs font-bold text-foreground font-serif">
				<span>{siteConfig.name}</span>
				<span class="text-muted-foreground font-sans font-normal">· Style Check</span>
			</div>
		</div>
	</header>

	<!-- Main Form Content -->
	<main class="flex-1 py-6 sm:py-12">
		<div class="mx-auto max-w-3xl px-3 sm:px-6">
			<!-- Progress Bar & Title -->
			<ProgressBar
				currentStep={step}
				totalSteps={7}
				title={stepTitles[step - 1].title}
				subtitle={stepTitles[step - 1].subtitle}
			/>

			<!-- Step Content Card -->
			<div class="mt-6 sm:mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6 md:p-8 shadow-xs">
				{#if step === 1}
					<Step1Gender
						bind:gender={answers.gender}
						bind:hijab={answers.hijab as HijabPreference}
						bind:coverage={answers.coverage as CoveragePreference}
					/>
				{:else if step === 2}
					<Step2Styles
						bind:styles={answers.styles}
					/>
				{:else if step === 3}
					<Step3Routines
						bind:routines={answers.routines}
					/>
				{:else if step === 4}
					<Step4Goals
						bind:goals={answers.goals}
					/>
				{:else if step === 5}
					<Step5Challenges
						bind:challenges={answers.challenges}
					/>
				{:else if step === 6}
					<Step6ColorsFit
						bind:undertone={answers.undertone}
						bind:bodyProportion={answers.bodyProportion}
						bind:photoSkinHex={answers.photoSkinHex}
						bind:photoConfidence={answers.photoConfidence}
						bind:photoVeinType={answers.photoVeinType}
						bind:photoBase64={answers.photoBase64}
					/>
				{:else if step === 7}
					<Step7BudgetSize
						bind:budget={answers.budget}
						bind:sizeTop={answers.sizeTop}
						bind:sizeBottom={answers.sizeBottom}
						bind:sizeShoes={answers.sizeShoes}
					/>
				{/if}

				<!-- Navigation Buttons -->
				<div class="mt-8 sm:mt-10 flex items-center justify-between border-t border-border/80 pt-5 sm:pt-6 gap-2">
					{#if step > 1}
						<Button
							type="button"
							variant="outline"
							onclick={handlePrev}
							disabled={isSubmitting}
							class="gap-1 sm:gap-1.5 px-3 sm:px-4 text-xs sm:text-sm h-9 sm:h-10"
						>
							<ArrowLeftIcon class="size-3.5 sm:size-4" />
							<span>Sebelumnya</span>
						</Button>
					{:else}
						<div></div>
					{/if}

					{#if step < 7}
						<Button
							type="button"
							onclick={handleNext}
							class="gap-1 sm:gap-1.5 font-semibold px-4 sm:px-6 text-xs sm:text-sm h-9 sm:h-10 shadow-xs"
						>
							<span>Lanjut</span>
							<ArrowRightIcon class="size-3.5 sm:size-4" />
						</Button>
					{:else}
						<Button
							type="button"
							onclick={handleNext}
							disabled={isSubmitting}
							class="gap-1.5 sm:gap-2 font-bold px-4 sm:px-7 text-xs sm:text-sm h-9 sm:h-10 bg-primary text-primary-foreground shadow-md"
						>
							{#if isSubmitting}
								<Loader2Icon class="size-4 animate-spin" />
								<span>Menyusun...</span>
							{:else}
								<CheckCircleIcon class="size-4" />
								<span>Selesaikan & Buat Panduan</span>
							{/if}
						</Button>
					{/if}
				</div>
			</div>

			<!-- Privacy & Autosave Indicator -->
			<div class="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted-foreground gap-2">
				<div class="flex items-center gap-1.5">
					<ShieldCheckIcon class="size-4 text-emerald-600 dark:text-emerald-400" />
					<span>Jawabanmu tersimpan anonim di peramban ini agar bisa dilanjutkan kapan saja.</span>
				</div>
				<span class="text-[11px] underline">
					<a href="/privasi">Kebijakan Privasi</a>
				</span>
			</div>
		</div>
	</main>

	<!-- Hidden Form untuk Selesaikan Quiz -->
	<form
		bind:this={completeForm}
		action="?/complete"
		method="POST"
		use:enhance={() => {
			isSubmitting = true;
			return async ({ result }) => {
				isSubmitting = false;
				if (result.type === "failure") {
					toast.error(
						typeof result.data?.error === "string"
							? result.data.error
							: "Gagal menyimpan panduan. Cek kembali jawabanmu."
					);
				}
				await applyAction(result);
			};
		}}
		class="hidden"
	>
		<input type="hidden" name="answers" value={JSON.stringify(answers)} />
	</form>
</div>

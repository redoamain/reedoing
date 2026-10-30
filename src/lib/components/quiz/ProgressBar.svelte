<script lang="ts">
	import { Progress } from "$lib/components/ui/progress";

	interface Props {
		currentStep: number;
		totalSteps: number;
		title: string;
		subtitle?: string;
	}

	let { currentStep, totalSteps = 7, title, subtitle }: Props = $props();

	let progressPercent = $derived(Math.round(((currentStep - 1) / totalSteps) * 100));
</script>

<div class="w-full">
	<div class="flex items-center justify-between text-xs text-muted-foreground mb-2">
		<span class="font-semibold uppercase tracking-wider text-primary">
			Langkah {currentStep} dari {totalSteps}
		</span>
		<span class="font-medium">{progressPercent}% Selesai</span>
	</div>

	<Progress value={progressPercent} class="h-2 w-full bg-secondary" />

	<div class="mt-6 text-center sm:text-left">
		<h1 class="font-serif text-2xl sm:text-3xl font-extrabold text-foreground">
			{title}
		</h1>
		{#if subtitle}
			<p class="mt-1.5 text-xs sm:text-sm text-muted-foreground">
				{subtitle}
			</p>
		{/if}
	</div>
</div>

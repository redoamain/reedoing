<script lang="ts">
	import ChevronLeftIcon from "@lucide/svelte/icons/chevron-left";
	import ChevronRightIcon from "@lucide/svelte/icons/chevron-right";
	import ChevronsLeftIcon from "@lucide/svelte/icons/chevron-first";
	import ChevronsRightIcon from "@lucide/svelte/icons/chevron-last";
	import { cn } from "$lib/utils.js";

	interface Props {
		page?: number;
		totalItems: number;
		perPage?: number;
		perPageOptions?: number[];
		siblingCount?: number;
		showInfo?: boolean;
		showEdges?: boolean;
		itemLabel?: string;
		class?: string;
		onPageChange?: (newPage: number) => void;
	}

	let {
		page = $bindable(1),
		totalItems,
		perPage = $bindable(9),
		perPageOptions = [],
		siblingCount = 1,
		showInfo = true,
		showEdges = false,
		itemLabel = "item",
		class: className = "",
		onPageChange
	}: Props = $props();

	let totalPages = $derived(Math.max(1, Math.ceil(totalItems / perPage)));

	// Clamp page when totalPages changes
	$effect(() => {
		if (page > totalPages) {
			page = totalPages;
		}
		if (page < 1) {
			page = 1;
		}
	});

	let startItem = $derived(totalItems === 0 ? 0 : (page - 1) * perPage + 1);
	let endItem = $derived(Math.min(page * perPage, totalItems));

	function goToPage(p: number) {
		if (p < 1 || p > totalPages || p === page) return;
		page = p;
		onPageChange?.(p);
	}

	let pageList = $derived.by(() => {
		const pages: (number | "...")[] = [];
		const total = totalPages;
		const current = page;

		if (total <= 5 + siblingCount * 2) {
			for (let i = 1; i <= total; i++) pages.push(i);
			return pages;
		}

		const leftSibling = Math.max(current - siblingCount, 1);
		const rightSibling = Math.min(current + siblingCount, total);

		const shouldShowLeftDots = leftSibling > 2;
		const shouldShowRightDots = rightSibling < total - 1;

		if (!shouldShowLeftDots && shouldShowRightDots) {
			const leftItemCount = 3 + 2 * siblingCount;
			for (let i = 1; i <= leftItemCount; i++) pages.push(i);
			pages.push("...");
			pages.push(total);
		} else if (shouldShowLeftDots && !shouldShowRightDots) {
			pages.push(1);
			pages.push("...");
			const rightItemCount = 3 + 2 * siblingCount;
			for (let i = total - rightItemCount + 1; i <= total; i++) pages.push(i);
		} else {
			pages.push(1);
			pages.push("...");
			for (let i = leftSibling; i <= rightSibling; i++) pages.push(i);
			pages.push("...");
			pages.push(total);
		}

		return pages;
	});
</script>

{#if totalItems > 0}
	<div class={cn("flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/70", className)}>
		<div class="flex items-center gap-3 order-2 sm:order-1">
			{#if showInfo}
				<p class="text-xs text-muted-foreground font-normal">
					Menampilkan <span class="font-medium text-foreground">{startItem}–{endItem}</span> dari <span class="font-medium text-foreground">{totalItems}</span> {itemLabel}
				</p>
			{/if}

			{#if perPageOptions.length > 0}
				<div class="hidden sm:flex items-center gap-1.5 border-l border-border/70 pl-3">
					<span class="text-xs text-muted-foreground">Per hal:</span>
					<div class="flex items-center gap-1">
						{#each perPageOptions as size (size)}
							<button
								type="button"
								onclick={() => { perPage = size; page = 1; }}
								class={cn(
									"rounded px-2 py-0.5 text-xs font-medium transition-all",
									perPage === size
										? "bg-foreground text-background font-semibold"
										: "bg-muted/60 text-muted-foreground hover:text-foreground"
								)}
							>
								{size}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>

		{#if totalPages > 1}
			<nav aria-label="Pagination" class="flex items-center gap-1 order-1 sm:order-2">
				{#if showEdges}
					<button
						type="button"
						onclick={() => goToPage(1)}
						disabled={page <= 1}
						aria-label="Halaman Pertama"
						class="inline-flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
					>
						<ChevronsLeftIcon class="size-3.5" />
					</button>
				{/if}

				<button
					type="button"
					onclick={() => goToPage(page - 1)}
					disabled={page <= 1}
					aria-label="Halaman Sebelumnya"
					class="inline-flex h-8 items-center gap-1 rounded-lg border border-border/80 bg-background px-2.5 text-xs font-medium text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
				>
					<ChevronLeftIcon class="size-3.5" />
					<span class="hidden sm:inline">Sebelumnya</span>
				</button>

				<div class="flex items-center gap-1">
					{#each pageList as item, i (i)}
						{#if item === "..."}
							<span class="inline-flex size-8 items-center justify-center text-xs text-muted-foreground select-none">
								…
							</span>
						{:else}
							<button
								type="button"
								onclick={() => goToPage(item as number)}
								aria-current={page === item ? "page" : undefined}
								class={cn(
									"inline-flex size-8 items-center justify-center rounded-lg text-xs font-medium transition-all shadow-2xs",
									page === item
										? "bg-foreground text-background font-semibold"
										: "border border-border/80 bg-background text-foreground hover:bg-stone-100 dark:hover:bg-stone-800"
								)}
							>
								{item}
							</button>
						{/if}
					{/each}
				</div>

				<button
					type="button"
					onclick={() => goToPage(page + 1)}
					disabled={page >= totalPages}
					aria-label="Halaman Selanjutnya"
					class="inline-flex h-8 items-center gap-1 rounded-lg border border-border/80 bg-background px-2.5 text-xs font-medium text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
				>
					<span class="hidden sm:inline">Selanjutnya</span>
					<ChevronRightIcon class="size-3.5" />
				</button>

				{#if showEdges}
					<button
						type="button"
						onclick={() => goToPage(totalPages)}
						disabled={page >= totalPages}
						aria-label="Halaman Terakhir"
						class="inline-flex size-8 items-center justify-center rounded-lg border border-border/80 bg-background text-foreground hover:bg-stone-100 dark:hover:bg-stone-800 disabled:opacity-40 disabled:pointer-events-none transition-all shadow-2xs"
					>
						<ChevronsRightIcon class="size-3.5" />
					</button>
				{/if}
			</nav>
		{/if}
	</div>
{/if}

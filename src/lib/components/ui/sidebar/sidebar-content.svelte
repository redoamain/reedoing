<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div
	bind:this={ref}
	data-slot="sidebar-content"
	class={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-3 scrollbar-thin", className)}
	{...restProps}
>
	{@render children?.()}
</div>

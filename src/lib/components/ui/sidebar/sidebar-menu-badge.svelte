<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span
	bind:this={ref}
	data-slot="sidebar-menu-badge"
	class={cn(
		"ml-auto pointer-events-none inline-flex h-5 min-w-5 select-none items-center justify-center rounded px-1.5 text-[10px] font-mono font-semibold border border-border/80 bg-muted/60 text-muted-foreground",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</span>

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
	data-slot="sidebar-group-label"
	class={cn(
		"flex h-7 shrink-0 items-center rounded-md px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground select-none",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</div>

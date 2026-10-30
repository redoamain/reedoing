<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		collapsible = false,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLElement>> & {
		collapsible?: boolean;
	} = $props();
</script>

<aside
	bind:this={ref}
	data-slot="sidebar"
	class={cn(
		"flex h-full w-64 md:w-72 flex-col border-r border-border bg-card text-card-foreground shrink-0 transition-[width] duration-200 ease-linear",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</aside>

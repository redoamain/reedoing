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
	data-slot="sidebar-footer"
	class={cn("flex flex-col gap-2 p-3 border-t border-border/70 bg-card/60", className)}
	{...restProps}
>
	{@render children?.()}
</div>

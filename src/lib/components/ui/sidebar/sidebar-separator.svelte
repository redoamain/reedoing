<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLHRElement>> = $props();
</script>

<hr
	bind:this={ref}
	data-slot="sidebar-separator"
	class={cn("mx-2 my-2 h-px border-0 bg-border/70", className)}
	{...restProps}
/>

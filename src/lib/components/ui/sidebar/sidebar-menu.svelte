<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLUListElement>> = $props();
</script>

<ul
	bind:this={ref}
	data-slot="sidebar-menu"
	class={cn("flex w-full min-w-0 flex-col gap-1 list-none p-0 m-0", className)}
	{...restProps}
>
	{@render children?.()}
</ul>

<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		children,
		isActive = false,
		type = "button",
		...restProps
	}: WithElementRef<HTMLButtonAttributes> & {
		isActive?: boolean;
	} = $props();
</script>

<button
	bind:this={ref}
	{type}
	data-slot="sidebar-menu-button"
	data-active={isActive}
	class={cn(
		"flex w-full items-center gap-2.5 overflow-hidden rounded-lg px-3 py-2 text-left text-xs font-medium outline-none transition-all cursor-pointer",
		"hover:bg-stone-200/70 dark:hover:bg-stone-800 hover:text-stone-950 dark:hover:text-stone-50",
		"focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
		"data-[active=true]:bg-stone-900 data-[active=true]:text-stone-50 data-[active=true]:font-semibold data-[active=true]:shadow-xs",
		"dark:data-[active=true]:bg-stone-100 dark:data-[active=true]:text-stone-900 dark:data-[active=true]:hover:bg-stone-200",
		className
	)}
	{...restProps}
>
	{@render children?.()}
</button>

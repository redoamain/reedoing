<script lang="ts">
	import { cn, type WithElementRef } from "$lib/utils.js";
	import type { HTMLButtonAttributes } from "svelte/elements";
	import PanelLeftIcon from "@lucide/svelte/icons/panel-left";

	let {
		ref = $bindable(null),
		class: className,
		type = "button",
		onclick,
		...restProps
	}: WithElementRef<HTMLButtonAttributes> = $props();
</script>

<button
	bind:this={ref}
	{type}
	data-slot="sidebar-trigger"
	class={cn(
		"inline-flex size-9 items-center justify-center rounded-lg border border-border bg-background text-foreground hover:bg-muted hover:text-foreground transition-colors cursor-pointer",
		className
	)}
	{onclick}
	aria-label="Toggle Sidebar"
	title="Toggle Sidebar"
	{...restProps}
>
	<PanelLeftIcon class="size-4" />
</button>

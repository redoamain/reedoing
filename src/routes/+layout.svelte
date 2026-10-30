<script lang="ts">
	import "./layout.css";
	import { ModeWatcher } from "mode-watcher";
	import { Toaster } from "$lib/components/ui/sonner";
	import type { LayoutProps } from "./$types";

	let { children }: LayoutProps = $props();
</script>

<ModeWatcher defaultMode="light" />
<Toaster richColors position="top-center" />

{@render children()}

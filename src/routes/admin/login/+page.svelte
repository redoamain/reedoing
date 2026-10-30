<script lang="ts">
	import { enhance } from "$app/forms";
	import { Button } from "$lib/components/ui/button";
	import { Input } from "$lib/components/ui/input";
	import { Label } from "$lib/components/ui/label";
	import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "$lib/components/ui/card";
	import LockIcon from "@lucide/svelte/icons/lock";
	import UserIcon from "@lucide/svelte/icons/user";
	import KeyRoundIcon from "@lucide/svelte/icons/key-round";
	import ArrowLeftIcon from "@lucide/svelte/icons/arrow-left";
	import AlertCircleIcon from "@lucide/svelte/icons/alert-circle";

	let { form } = $props();
	let loading = $state(false);
</script>

<svelte:head>
	<title>Login Admin · reedoing</title>
	<meta name="robots" content="noindex, nofollow" />
</svelte:head>

<div class="flex min-h-[80vh] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="mb-6 text-center">
			<a href="/" class="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground">
				<ArrowLeftIcon class="size-3.5" />
				Kembali ke Beranda
			</a>
		</div>

		<Card class="border-border shadow-lg">
			<CardHeader class="space-y-2 text-center pb-4">
				<div class="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
					<LockIcon class="size-6" />
				</div>
				<CardTitle class="font-serif text-2xl font-bold">Admin reedoing</CardTitle>
				<CardDescription class="text-xs text-muted-foreground">
					Masuk untuk mengelola katalog outfit dan tautan Shopee Affiliate.
				</CardDescription>
			</CardHeader>

			<form
				method="POST"
				use:enhance={() => {
					loading = true;
					return async ({ update }) => {
						loading = false;
						await update();
					};
				}}
			>
				<CardContent class="space-y-4 pt-2">
					{#if form?.error}
						<div class="flex items-center gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
							<AlertCircleIcon class="size-4 shrink-0" />
							<span>{form.error}</span>
						</div>
					{/if}

					<div class="space-y-2">
						<Label for="username" class="text-xs font-semibold">Username Admin</Label>
						<div class="relative">
							<Input
								id="username"
								name="username"
								type="text"
								placeholder="admin"
								value={form?.username ?? "admin"}
								class="pr-10"
							/>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
								<UserIcon class="size-4" />
							</div>
						</div>
					</div>

					<div class="space-y-2">
						<Label for="password" class="text-xs font-semibold">Password Admin</Label>
						<div class="relative">
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Masukkan password admin..."
								required
								class="pr-10"
								autofocus
							/>
							<div class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
								<KeyRoundIcon class="size-4" />
							</div>
						</div>
						<p class="text-[11px] text-muted-foreground">
							Akun bawaan adalah username <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground font-bold">admin</code> & password <code class="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground font-bold">admin123</code> (dapat diubah di Pengaturan Admin).
						</p>
					</div>
				</CardContent>

				<CardFooter class="pt-2">
					<Button
						type="submit"
						class="w-full font-semibold shadow-xs"
						disabled={loading}
					>
						{#if loading}
							Memeriksa...
						{:else}
							Masuk ke Dashboard
						{/if}
					</Button>
				</CardFooter>
			</form>
		</Card>
	</div>
</div>

<script lang="ts">
	import { siteConfig } from "$lib/config";
	import Header from "$lib/components/landing/Header.svelte";
	import Footer from "$lib/components/landing/Footer.svelte";
	import { Button } from "$lib/components/ui/button";
	import MailIcon from "@lucide/svelte/icons/mail";
	import MessageSquareIcon from "@lucide/svelte/icons/message-square";
	import HeartHandshakeIcon from "@lucide/svelte/icons/heart-handshake";
</script>

<svelte:head>
	<title>Hubungi Kami — {siteConfig.name}</title>
	<meta name="description" content="Kirimkan pertanyaan, saran, atau masukan untuk pengembangan panduan personal style {siteConfig.name}." />
</svelte:head>

<div class="flex min-h-screen flex-col bg-background text-foreground">
	<Header />

	<main class="flex-1 py-8 sm:py-16">
		<div class="mx-auto max-w-3xl px-3 sm:px-6">
			<div class="mb-8 text-center sm:text-left">
				<div class="flex items-center justify-center sm:justify-start gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
					<MessageSquareIcon class="size-4 text-primary" />
					Bantuan & Masukan
				</div>
				<h1 class="font-serif text-3xl sm:text-4xl font-extrabold text-foreground">
					Hubungi Kami
				</h1>
				<p class="mt-2 text-xs sm:text-sm text-muted-foreground">
					Punya ide fitur baru, koreksi kecocokan busana, atau pertanyaan seputar aplikasi? Kami senang mendengar darimu.
				</p>
			</div>

			<div class="grid gap-6 sm:grid-cols-2">
				<div class="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
					<div>
						<div class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
							<MailIcon class="size-5" />
						</div>
						<h2 class="font-serif text-lg font-bold text-foreground">Kirim Pesan Email</h2>
						<p class="mt-2 text-xs text-muted-foreground leading-relaxed">
							Kirimkan masukan langsung ke kotak surat elektronik pengembang kami. Kami berusaha membalas dalam 1–2 hari kerja.
						</p>
					</div>

					<div class="mt-6">
						<a
							href="mailto:{siteConfig.contactEmail}"
							class="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 w-full"
						>
							{siteConfig.contactEmail}
						</a>
					</div>
				</div>

				<div class="rounded-2xl border border-border bg-card p-6 shadow-xs flex flex-col justify-between">
					<div>
						<div class="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
							<HeartHandshakeIcon class="size-5" />
						</div>
						<h2 class="font-serif text-lg font-bold text-foreground">Proyek Terbuka & Komunitas</h2>
						<p class="mt-2 text-xs text-muted-foreground leading-relaxed">
							Aplikasi ini dibangun untuk membantu masyarakat luas berpenampilan rapi dengan pengeluaran terukur. Terima kasih telah mendukung proyek ini.
						</p>
					</div>

					<div class="mt-6 border-t border-border pt-4 text-center">
						<span class="text-xs font-medium text-muted-foreground">
							Dibuat dengan ❤️ untuk Pria & Wanita Indonesia
						</span>
					</div>
				</div>
			</div>
		</div>
	</main>

	<Footer />
</div>

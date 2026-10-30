<script lang="ts">
	import type { RoutineOption } from "$lib/types/style";
	import BriefcaseIcon from "@lucide/svelte/icons/briefcase";
	import GraduationCapIcon from "@lucide/svelte/icons/graduation-cap";
	import UsersIcon from "@lucide/svelte/icons/users";
	import CoffeeIcon from "@lucide/svelte/icons/coffee";
	import DumbbellIcon from "@lucide/svelte/icons/dumbbell";
	import AwardIcon from "@lucide/svelte/icons/award";
	import CheckIcon from "@lucide/svelte/icons/check";

	interface Props {
		routines: RoutineOption[];
	}

	let { routines = $bindable(["kantor", "hangout"]) }: Props = $props();

	const routineList: Array<{
		id: RoutineOption;
		label: string;
		desc: string;
		icon: any;
	}> = [
		{
			id: "kantor",
			label: "Kerja Kantor (WFO / Hybrid)",
			desc: "Butuh setelan rapi, profesional, dan nyaman sepanjang jam kerja di ruangan ber-AC.",
			icon: BriefcaseIcon
		},
		{
			id: "kampus",
			label: "Kuliah & Kampus",
			desc: "Aktivitas aktif berpindah ruang kelas, seminar, dan diskusi kelompok mahasiswa.",
			icon: GraduationCapIcon
		},
		{
			id: "meeting",
			label: "Meeting Klien & Presentasi",
			desc: "Menghadiri negosiasi penting yang membutuhkan wibawa dan kredibilitas instan.",
			icon: UsersIcon
		},
		{
			id: "hangout",
			label: "Hangout Akhir Pekan",
			desc: "Nongkrong di kafe, nonton film, makan malam santai, atau kencan bersama pasangan.",
			icon: CoffeeIcon
		},
		{
			id: "santai",
			label: "Santai di Rumah / WFH",
			desc: "Bekerja fleksibel dari rumah, belanja kilat, atau sekadar jalan santai sore hari.",
			icon: DumbbellIcon
		},
		{
			id: "formal",
			label: "Acara Formal & Undangan",
			desc: "Resepsi pernikahan, networking formal, jamuan gala, atau perayaan keluarga besar.",
			icon: AwardIcon
		}
	];

	function toggle(id: RoutineOption) {
		if (routines.includes(id)) {
			if (routines.length > 1) {
				routines = routines.filter((item) => item !== id);
			}
		} else {
			routines = [...routines, id];
		}
	}
</script>

<div>
	<div class="flex items-center justify-between mb-4">
		<span class="text-xs font-bold uppercase tracking-wider text-muted-foreground">
			Pilih Semua Rutinitas yang Kamu Jalani
		</span>
		<span class="text-xs text-muted-foreground">
			Minimal 1 pilihan
		</span>
	</div>

	<div class="grid gap-3 sm:grid-cols-2">
		{#each routineList as item (item.id)}
			{@const isSelected = routines.includes(item.id)}
			<button
				type="button"
				onclick={() => toggle(item.id)}
				class="flex items-start gap-3.5 rounded-xl border-2 p-4 text-left transition-all {isSelected ? 'border-primary bg-primary/5 shadow-xs' : 'border-border bg-card hover:border-primary/40'}"
			>
				<div class="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
					<item.icon class="size-5" />
				</div>

				<div class="flex-1">
					<div class="flex items-center justify-between">
						<span class="font-serif text-sm font-bold text-foreground">
							{item.label}
						</span>
						<div class="flex size-4.5 items-center justify-center rounded-md border {isSelected ? 'border-primary bg-primary text-primary-foreground' : 'border-border bg-background'}">
							{#if isSelected}
								<CheckIcon class="size-3 stroke-[3]" />
							{/if}
						</div>
					</div>
					<p class="mt-1 text-xs text-muted-foreground leading-relaxed">
						{item.desc}
					</p>
				</div>
			</button>
		{/each}
	</div>
</div>

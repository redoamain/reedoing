import type { CapsuleItem, Outfit, ShoppingItem } from "$lib/types/style";

export function generateShoppingPriority(
	capsuleItems: CapsuleItem[],
	outfits: Outfit[]
): ShoppingItem[] {
	// Hitung seberapa sering tiap item dipakai di outfit
	const frequencyMap = new Map<string, number>();

	for (const outfit of outfits) {
		for (const itemId of outfit.itemIds) {
			const count = frequencyMap.get(itemId) || 0;
			frequencyMap.set(itemId, count + 1);
		}
	}

	const shoppingItems: ShoppingItem[] = capsuleItems.map((item) => {
		const count = frequencyMap.get(item.id) || 0;

		let priority: "Tinggi" | "Sedang" | "Rendah" = "Rendah";
		let reason = `Dipakai di ${count} kombinasi outfit harianmu.`;

		if (count >= 12) {
			priority = "Tinggi";
			reason = `Fondasi utama lemari: dipakai di ${count} outfit lintas berbagai situasi! Prioritaskan beli yang berkualitas baik.`;
		} else if (count >= 6) {
			priority = "Sedang";
			reason = `Item serbaguna: membuka ${count} kombinasi baru untuk kerja dan santai.`;
		} else {
			priority = "Rendah";
			reason = `Item pelengkap: dipakai di ${count} outfit khusus untuk memberi variasi visual.`;
		}

		return {
			id: item.id,
			name: item.name,
			category: item.category,
			priority,
			reason,
			outfitCount: count,
			colorSuggestion: item.color,
			checkListText: `${item.name} (${item.color})`
		};
	});

	// Urutkan berdasarkan outfitCount terbanyak (paling prioritas di atas)
	return shoppingItems.sort((a, b) => b.outfitCount - a.outfitCount);
}

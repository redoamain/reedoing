import type { CapsuleItem, Outfit, RoutineOption } from "$lib/types/style";

export interface OutfitTemplate {
	id: string;
	name: string;
	occasion: RoutineOption;
	occasionLabel: string;
	itemIds: string[];
	formula: string;
	styleTips: string;
	affiliateUrl?: string | null;
	imageUrl?: string | null;
}

// Definisi 32 kombinasi outfit lintas 6 situasi
export const rawOutfitTemplates: OutfitTemplate[] = [
	// 1. KANTOR (6 outfits)
		{
			id: "outfit-kantor-1",
			name: "The Power Foundation",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			itemIds: ["outer-1", "top-1", "bottom-1", "shoes-2", "acc-1"],
			formula: "Blazer + Kemeja + Trousers + Sepatu Rapi",
			styleTips: "Kancingkan satu kancing tengah blazer saat berdiri, buka saat duduk. Gunakan belt senada dengan warna sepatu.",
			imageUrl: "/images/real/looks/outfit-kantor-1.jpg"
		},
		{
			id: "outfit-kantor-2",
			name: "Modern Professional",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			itemIds: ["outer-1", "top-2", "bottom-1", "shoes-2", "acc-1"],
			formula: "Blazer + Atasan Aksen + Trousers + Sepatu Rapi",
			styleTips: "Warna aksen pada atasan memberikan dinamika segar tanpa melanggar dress code formal.",
			imageUrl: "/images/real/looks/outfit-kantor-2.jpg"
		},
		{
			id: "outfit-kantor-3",
			name: "Relaxed Friday Corporate",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			itemIds: ["outer-1", "top-3", "bottom-1", "shoes-1", "acc-1"],
			formula: "Blazer + Kaos Putih + Trousers + Sneakers Bersih",
			styleTips: "Perpaduan kaos katun berkualitas tinggi dengan blazer dan celana bahan: kunci smart-casual yang rapi dan kekinian.",
			imageUrl: "/images/real/looks/outfit-kantor-3.jpg"
		},
		{
			id: "outfit-kantor-4",
			name: "Crisp Monochrome Day",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			itemIds: ["top-1", "bottom-1", "shoes-2", "acc-1"],
			formula: "Kemeja Bersih + Trousers + Sepatu Rapi",
			styleTips: "Gunakan teknik tuck in rapi. Jika merasa terlalu polos, kalung ramping atau jam tangan kulit jadi statement elegan.",
			imageUrl: "/images/real/looks/outfit-kantor-4.jpg"
		},
		{
			id: "outfit-kantor-5",
			name: "Soft Tailored Layer",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			itemIds: ["outer-2", "top-1", "bottom-3", "shoes-2", "acc-1"],
			formula: "Cardigan/Overshirt + Kemeja + Chinos/Linen + Loafers",
			styleTips: "Biarkan kerah kemeja terbuka sedikit di atas cardigan untuk siluet preppy yang hangat.",
			imageUrl: "/images/real/looks/outfit-kantor-5.jpg"
		},
		{
			id: "outfit-kantor-6",
			name: "Smart Contrast Office",
			occasion: "kantor",
			occasionLabel: "Kerja Kantor",
			itemIds: ["outer-1", "top-4", "bottom-3", "shoes-2", "acc-1"],
			formula: "Blazer + Atasan Gelap + Chinos + Sepatu Rapi",
			styleTips: "Kombinasi atasan gelap dengan bawahan netral hangat memberi ilusi tubuh lebih ramping dan terstruktur.",
			imageUrl: "/images/real/looks/outfit-kantor-6.jpg"
		},

		// 2. MEETING (5 outfits)
		{
			id: "outfit-meeting-1",
			name: "Executive Client Presentation",
			occasion: "meeting",
			occasionLabel: "Meeting Klien & Presentasi",
			itemIds: ["outer-1", "top-1", "bottom-1", "shoes-2", "acc-1"],
			formula: "Tailored Blazer + Kemeja + Trousers + Tas Terstruktur",
			styleTips: "Pastikan kerah kemeja rapi dan tidak berkerut. Outfit ini membangun kredibilitas instan di hadapan klien.",
			imageUrl: "/images/real/looks/outfit-meeting-1.jpg"
		},
		{
			id: "outfit-meeting-2",
			name: "Creative Pitch Meeting",
			occasion: "meeting",
			occasionLabel: "Meeting Klien & Presentasi",
			itemIds: ["outer-1", "top-2", "bottom-2", "shoes-2", "acc-1"],
			formula: "Blazer + Atasan Aksen + Denim Gelap/Rok + Loafers",
			styleTips: "Denim gelap tanpa robekan dipadu blazer menandakan profesionalitas dengan sentuhan fleksibilitas kreatif.",
			imageUrl: "/images/real/looks/outfit-meeting-2.jpg"
		},
		{
			id: "outfit-meeting-3",
			name: "Warm Advisory Talk",
			occasion: "meeting",
			occasionLabel: "Meeting Klien & Presentasi",
			itemIds: ["outer-2", "top-1", "bottom-1", "shoes-2", "acc-1"],
			formula: "Fine Knit/Overshirt + Kemeja + Trousers + Loafers",
			styleTips: "Tekstur rajut halus memberikan kesan ramah, bersahabat, dan dapat dipercaya dalam sesi diskusi panjang.",
			imageUrl: "/images/real/looks/outfit-meeting-3.jpg"
		},
		{
			id: "outfit-meeting-4",
			name: "Minimalist Pitch Deck",
			occasion: "meeting",
			occasionLabel: "Meeting Klien & Presentasi",
			itemIds: ["outer-1", "top-3", "bottom-3", "shoes-2", "acc-1"],
			formula: "Blazer + Kaos Putih + Chinos + Sepatu Rapi",
			styleTips: "Gaya modern tech-entrepreneur: minimalis, tajam, fokus pada substansi presentasi.",
			imageUrl: "/images/real/looks/outfit-meeting-4.jpg"
		},
		{
			id: "outfit-meeting-5",
			name: "Coffee Shop Business Sync",
			occasion: "meeting",
			occasionLabel: "Meeting Klien & Presentasi",
			itemIds: ["top-2", "bottom-1", "shoes-2", "acc-1"],
			formula: "Atasan Aksen + Trousers + Loafers + Tas Kulit",
			styleTips: "Tampil bersahaja tanpa blazer saat meeting di coffee shop agar suasana lebih santai namun tetap dihormati.",
			imageUrl: "/images/real/looks/outfit-meeting-5.jpg"
		},

		// 3. KAMPUS (5 outfits)
		{
			id: "outfit-kampus-1",
			name: "Campus Library Classic",
			occasion: "kampus",
			occasionLabel: "Kuliah & Kampus",
			itemIds: ["outer-2", "top-3", "bottom-2", "shoes-1", "acc-1"],
			formula: "Cardigan/Overshirt + Kaos Putih + Denim + Sneakers",
			styleTips: "Nyaman seharian berpindah ruang kuliah. Kenakan overshirt terbuka dengan kaos putih sebagai inner.",
			imageUrl: "/images/real/looks/outfit-kampus-1.jpg"
		},
		{
			id: "outfit-kampus-2",
			name: "Seminar & Bimbingan Dosen",
			occasion: "kampus",
			occasionLabel: "Kuliah & Kampus",
			itemIds: ["top-1", "bottom-2", "shoes-1", "acc-1"],
			formula: "Kemeja Rapi + Denim Gelap + Clean Sneakers",
			styleTips: "Kemeja poplin berkerah memberi rasa hormat saat bimbingan skripsi atau seminar fakultas.",
			imageUrl: "/images/real/looks/outfit-kampus-2.jpg"
		},
		{
			id: "outfit-kampus-3",
			name: "Modern Student Layer",
			occasion: "kampus",
			occasionLabel: "Kuliah & Kampus",
			itemIds: ["outer-2", "top-4", "bottom-3", "shoes-1", "acc-1"],
			formula: "Outer Ringan + Atasan Gelap + Chinos + Sneakers",
			styleTips: "Bahan katun chinos memudahkan pergerakan dan tidak mudah kusut meski duduk lama di kelas.",
			imageUrl: "/images/real/looks/outfit-kampus-3.jpg"
		},
		{
			id: "outfit-kampus-4",
			name: "Smart Preppy Study",
			occasion: "kampus",
			occasionLabel: "Kuliah & Kampus",
			itemIds: ["top-2", "bottom-3", "shoes-1", "acc-1"],
			formula: "Knit Polo/Blouse + Chinos/Linen + Sneakers Bersih",
			styleTips: "Memberi kesan mahasiswa aktif dan rapi tanpa berlebihan.",
			imageUrl: "/images/real/looks/outfit-kampus-4.jpg"
		},
		{
			id: "outfit-kampus-5",
			name: "Effortless Class Routine",
			occasion: "kampus",
			occasionLabel: "Kuliah & Kampus",
			itemIds: ["top-3", "bottom-2", "shoes-1", "acc-1"],
			formula: "Kaos Katun Premium + Denim Klasik + Sneakers",
			styleTips: "Kunci dari outfit kaos dan jeans adalah fitting yang sempurna: tidak terlalu ketat, tidak terlalu gombrang.",
			imageUrl: "/images/real/looks/outfit-kampus-5.jpg"
		},

		// 4. HANGOUT (6 outfits)
		{
			id: "outfit-hangout-1",
			name: "Weekend Cafe Hopping",
			occasion: "hangout",
			occasionLabel: "Hangout Akhir Pekan",
			itemIds: ["outer-2", "top-3", "bottom-2", "shoes-1", "acc-1"],
			formula: "Overshirt Terbuka + Kaos Putih + Denim + Sneakers",
			styleTips: "Singsingkan lengan overshirt satu lipatan untuk gaya kasual yang santai dan fotogenik di kafe.",
			imageUrl: "/images/real/looks/outfit-hangout-1.jpg"
		},
		{
			id: "outfit-hangout-2",
			name: "Dinner Date Night",
			occasion: "hangout",
			occasionLabel: "Hangout Akhir Pekan",
			itemIds: ["outer-1", "top-4", "bottom-1", "shoes-2", "acc-1"],
			formula: "Blazer + Kaos Gelap + Trousers + Sepatu Rapi",
			styleTips: "Kombinasi warna gelap monokromatik di malam hari memberikan nuansa misterius yang memikat.",
			imageUrl: "/images/real/looks/outfit-hangout-2.jpg"
		},
		{
			id: "outfit-hangout-3",
			name: "Art Exhibition Stroll",
			occasion: "hangout",
			occasionLabel: "Hangout Akhir Pekan",
			itemIds: ["top-2", "bottom-1", "shoes-1", "acc-1"],
			formula: "Atasan Aksen + Trousers + Sneakers Minimalis",
			styleTips: "Siluet kontemporer yang pas untuk menikmati galeri seni atau museum bersama teman.",
			imageUrl: "/images/real/looks/outfit-hangout-3.jpg"
		},
		{
			id: "outfit-hangout-4",
			name: "Sunday Brunch Casual",
			occasion: "hangout",
			occasionLabel: "Hangout Akhir Pekan",
			itemIds: ["top-1", "bottom-3", "shoes-1", "acc-1"],
			formula: "Kemeja Buka 2 Kancing + Chinos + Clean Sneakers",
			styleTips: "Kenakan kemeja tanpa diselipkan (untucked) jika panjang kelimannya tepat di bawah lingkar pinggang.",
			imageUrl: "/images/real/looks/outfit-hangout-4.jpg"
		},
		{
			id: "outfit-hangout-5",
			name: "Urban Sunset Walk",
			occasion: "hangout",
			occasionLabel: "Hangout Akhir Pekan",
			itemIds: ["outer-2", "top-2", "bottom-3", "shoes-1", "acc-1"],
			formula: "Cardigan Ringan + Atasan Aksen + Chinos + Sneakers",
			styleTips: "Kombinasi warna bumi lembut saat matahari terbenam: hangat, estetik, dan nyaman.",
			imageUrl: "/images/real/looks/outfit-hangout-5.jpg"
		},
		{
			id: "outfit-hangout-6",
			name: "Late Night Hangout",
			occasion: "hangout",
			occasionLabel: "Hangout Akhir Pekan",
			itemIds: ["outer-1", "top-3", "bottom-2", "shoes-1", "acc-1"],
			formula: "Blazer + Kaos Putih + Denim Gelap + Sneakers",
			styleTips: "Kombinasi andalan yang tak pernah gagal: santai namun tetap siap masuk ke tempat semi-formal.",
			imageUrl: "/images/real/looks/outfit-hangout-6.jpg"
		},

		// 5. SANTAI / HARIAN (5 outfits)
		{
			id: "outfit-santai-1",
			name: "Minimalist WFH Flow",
			occasion: "santai",
			occasionLabel: "Santai & Harian",
			itemIds: ["top-3", "bottom-3", "shoes-1"],
			formula: "Kaos Katun Lembut + Celana Chinos/Linen Santai",
			styleTips: "Bahan adem untuk bekerja dari rumah atau bepergian kilat ke supermarket sekitar.",
			imageUrl: "/images/real/looks/outfit-santai-1.jpg"
		},
		{
			id: "outfit-santai-2",
			name: "Breezy Morning Walk",
			occasion: "santai",
			occasionLabel: "Santai & Harian",
			itemIds: ["outer-2", "top-3", "bottom-3", "shoes-1"],
			formula: "Cardigan Tipis + Kaos Putih + Celana Santai + Sneakers",
			styleTips: "Lindungi diri dari angin pagi sambil tetap tampil enak dipandang saat menyapa tetangga.",
			imageUrl: "/images/real/looks/outfit-santai-2.jpg"
		},
		{
			id: "outfit-santai-3",
			name: "Casual Errand Master",
			occasion: "santai",
			occasionLabel: "Santai & Harian",
			itemIds: ["top-4", "bottom-2", "shoes-1"],
			formula: "Kaos Gelap + Denim Straight + Sneakers Bersih",
			styleTips: "Sederhana, cepat dipakai kurang dari 30 detik, namun tetap terlihat seperti orang yang punya selera.",
			imageUrl: "/images/real/looks/outfit-santai-3.jpg"
		},
		{
			id: "outfit-santai-4",
			name: "Relaxed Linen Holiday",
			occasion: "santai",
			occasionLabel: "Santai & Harian",
			itemIds: ["top-1", "bottom-3", "shoes-1"],
			formula: "Kemeja Gulung Lengan + Chinos + Sneakers",
			styleTips: "Gulung lengan kemeja sampai siku secara santai untuk suasana liburan akhir pekan.",
			imageUrl: "/images/real/looks/outfit-santai-4.jpg"
		},
		{
			id: "outfit-santai-5",
			name: "Cozy Study Corner",
			occasion: "santai",
			occasionLabel: "Santai & Harian",
			itemIds: ["outer-2", "top-4", "bottom-3", "shoes-1"],
			formula: "Cardigan Halus + Inner Top + Celana Nyaman",
			styleTips: "Pilihan terbaik untuk membaca buku atau belajar berjam-jam tanpa rasa terkekang pakaian.",
			imageUrl: "/images/real/looks/outfit-santai-5.jpg"
		},

		// 6. FORMAL & ACARA (5 outfits)
		{
			id: "outfit-formal-1",
			name: "Gala & Formal Reception",
			occasion: "formal",
			occasionLabel: "Acara Formal & Undangan",
			itemIds: ["outer-1", "top-1", "bottom-1", "shoes-2", "acc-1"],
			formula: "Blazer Formal + Kemeja + Trousers + Sepatu Kulit",
			styleTips: "Kerapian adalah nomor satu: kemeja tersetrika licin dan sepatu mengilap adalah bentuk penghormatan pada acara.",
			imageUrl: "/images/real/looks/outfit-formal-1.jpg"
		},
		{
			id: "outfit-formal-2",
			name: "Sophisticated Cocktail Hour",
			occasion: "formal",
			occasionLabel: "Acara Formal & Undangan",
			itemIds: ["outer-1", "top-4", "bottom-1", "shoes-2", "acc-1"],
			formula: "Blazer Gelap + Inner Gelap + Trousers + Loafers",
			styleTips: "Nuansa all-dark tailoring memberikan aura karismatik kontemporer di resepsi pernikahan atau jamuan malam.",
			imageUrl: "/images/real/looks/outfit-formal-2.jpg"
		},
		{
			id: "outfit-formal-3",
			name: "Daytime Wedding / Family Event",
			occasion: "formal",
			occasionLabel: "Acara Formal & Undangan",
			itemIds: ["outer-1", "top-2", "bottom-1", "shoes-2", "acc-1"],
			formula: "Blazer + Atasan Aksen + Trousers + Tas Formal",
			styleTips: "Warna aksen lembut memberikan kecerahan sopan yang menghargai nuansa hangat pertemuan keluarga.",
			imageUrl: "/images/real/looks/outfit-formal-3.jpg"
		},
		{
			id: "outfit-formal-4",
			name: "Modern Semi-Formal Dinner",
			occasion: "formal",
			occasionLabel: "Acara Formal & Undangan",
			itemIds: ["outer-1", "top-1", "bottom-3", "shoes-2", "acc-1"],
			formula: "Blazer + Kemeja Putih + Chinos Rapi + Sepatu Kulit",
			styleTips: "Perpaduan blazer gelap dengan celana warna netral lebih santai dari setelan jas lengkap tapi tetap anggun.",
			imageUrl: "/images/real/looks/outfit-formal-4.jpg"
		},
		{
			id: "outfit-formal-5",
			name: "Networking Night",
			occasion: "formal",
			occasionLabel: "Acara Formal & Undangan",
			itemIds: ["outer-2", "top-1", "bottom-1", "shoes-2", "acc-1"],
			formula: "Fine Knit Layer + Kemeja + Trousers + Sepatu Rapi",
			styleTips: "Memberikan kesan cerdas, mudah didekati untuk bertukar kartu nama, dan tidak intimidating.",
			imageUrl: "/images/real/looks/outfit-formal-5.jpg"
		}
	];

export function generateOutfits(
	capsuleItems: CapsuleItem[],
	customTemplates?: OutfitTemplate[]
): Outfit[] {
	const itemMap = new Map(capsuleItems.map((item) => [item.id, item]));
	const templates = customTemplates && customTemplates.length > 0 ? customTemplates : rawOutfitTemplates;

	// Hubungkan itemIds ke item objek yang sebenarnya
	return templates.map((template) => ({
		...template,
		imageUrl: template.imageUrl || `/images/real/looks/${template.id}.jpg`,
		items: template.itemIds
			.map((id) => itemMap.get(id))
			.filter((item): item is CapsuleItem => Boolean(item))
	}));
}

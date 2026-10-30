import { z } from "zod";

export const step1Schema = z
	.object({
		gender: z.enum(["pria", "wanita"], {
			message: "Pilih kategori pakaian: Pria atau Wanita."
		}),
		hijab: z.enum(["ya", "tidak"]).optional(),
		coverage: z.enum(["standar", "longgar"]).optional()
	})
	.refine(
		(data) => {
			if (data.gender === "wanita" && !data.hijab) {
				return false;
			}
			return true;
		},
		{
			message: "Pilih apakah kamu mengenakan hijab atau pakaian modest.",
			path: ["hijab"]
		}
	);

export const step2Schema = z.object({
	styles: z
		.array(z.enum(["casual", "smart-casual", "minimalis", "klasik", "streetwear", "feminin"]))
		.min(1, "Pilih minimal 1 gaya favoritmu.")
		.max(2, "Maksimal pilih 2 gaya agar capsule tetap fokus.")
});

export const step3Schema = z.object({
	routines: z
		.array(z.enum(["kantor", "kampus", "meeting", "hangout", "santai", "formal"]))
		.min(1, "Pilih minimal 1 rutinitas harianmu.")
});

export const step4Schema = z.object({
	goals: z
		.array(z.enum(["lebih-rapi", "percaya-diri", "hemat-belanja", "praktis-cepat", "konsisten"]))
		.min(1, "Pilih minimal 1 target penampilanmu.")
});

export const step5Schema = z.object({
	challenges: z
		.array(
			z.enum([
				"bingung-padu-padan",
				"lemari-penuh",
				"warna-monoton",
				"salah-beli",
				"kurang-rapi"
			])
		)
		.min(1, "Pilih minimal 1 tantangan yang sedang kamu hadapi.")
});

export const step6Schema = z.object({
	undertone: z.enum(["hangat", "dingin", "netral"], {
		message: "Pilih salah satu kecenderungan undertone kulitmu."
	}),
	bodyProportion: z.enum(
		["seimbang", "atasan-lebar", "bawahan-lebar", "tinggi-ramping", "petite"],
		{
			message: "Pilih proporsi tubuh yang paling mendekati dirimu."
		}
	),
	photoSkinHex: z.string().optional(),
	photoUndertone: z.enum(["hangat", "dingin", "netral"]).optional(),
	photoConfidence: z.number().optional(),
	photoBase64: z.string().optional()
});

export const step7Schema = z.object({
	budget: z.string().optional(),
	sizeTop: z.string().optional(),
	sizeBottom: z.string().optional(),
	sizeShoes: z.string().optional(),
	photoSkinHex: z.string().optional(),
	photoUndertone: z.enum(["hangat", "dingin", "netral"]).optional(),
	photoConfidence: z.number().optional(),
	photoBase64: z.string().optional()
});

export const completeQuizSchema = z.object({
	gender: z.enum(["pria", "wanita"]),
	hijab: z.enum(["ya", "tidak"]).optional(),
	coverage: z.enum(["standar", "longgar"]).optional(),
	styles: z.array(z.string()).min(1),
	routines: z.array(z.string()).min(1),
	goals: z.array(z.string()).min(1),
	challenges: z.array(z.string()).min(1),
	undertone: z.enum(["hangat", "dingin", "netral"]),
	bodyProportion: z.enum(["seimbang", "atasan-lebar", "bawahan-lebar", "tinggi-ramping", "petite"]),
	budget: z.string().optional(),
	sizeTop: z.string().optional(),
	sizeBottom: z.string().optional(),
	sizeShoes: z.string().optional(),
	photoSkinHex: z.string().optional(),
	photoUndertone: z.enum(["hangat", "dingin", "netral"]).optional(),
	photoConfidence: z.number().optional(),
	photoBase64: z.string().optional()
});

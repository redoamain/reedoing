export type Gender = "pria" | "wanita";
export type HijabPreference = "ya" | "tidak";
export type CoveragePreference = "longgar" | "standar";

export type StyleOption =
	| "casual"
	| "smart-casual"
	| "minimalis"
	| "klasik"
	| "streetwear"
	| "feminin";

export type RoutineOption =
	| "kantor"
	| "kampus"
	| "meeting"
	| "hangout"
	| "santai"
	| "formal";

export type GoalOption =
	| "lebih-rapi"
	| "percaya-diri"
	| "hemat-belanja"
	| "praktis-cepat"
	| "konsisten";

export type ChallengeOption =
	| "bingung-padu-padan"
	| "lemari-penuh"
	| "warna-monoton"
	| "salah-beli"
	| "kurang-rapi";

export type Undertone = "hangat" | "dingin" | "netral";

export type BodyProportion =
	| "seimbang"
	| "atasan-lebar"
	| "bawahan-lebar"
	| "tinggi-ramping"
	| "petite";

export interface QuizAnswers {
	gender: Gender;
	hijab?: HijabPreference;
	coverage?: CoveragePreference;
	styles: StyleOption[];
	routines: RoutineOption[];
	goals: GoalOption[];
	challenges: ChallengeOption[];
	undertone: Undertone;
	bodyProportion: BodyProportion;
	budget?: string;
	sizeTop?: string;
	sizeBottom?: string;
	sizeShoes?: string;
	photoSkinHex?: string;
	photoUndertone?: Undertone;
	photoConfidence?: number;
	photoVeinType?: "hijau" | "biru" | "campuran";
	photoBase64?: string;
}

export interface ColorSwatch {
	name: string;
	hex: string;
	role: "base" | "accent" | "avoid";
	description: string;
}

export interface PaletteResult {
	name: string;
	undertone: Undertone;
	description: string;
	baseColors: ColorSwatch[];
	accentColors: ColorSwatch[];
	avoidColors: ColorSwatch[];
	stylePairingTips: string[];
}

export interface CapsuleItem {
	id: string;
	name: string;
	category: "outer" | "atasan" | "bawahan" | "sepatu" | "tas" | "aksesori";
	color: string;
	fitTips: string;
	versatileScore: number;
	occasions: RoutineOption[];
	iconName?: string;
	affiliateUrl?: string | null;
	imageUrl?: string | null;
	priceEstimate?: string | null;
}

export interface Outfit {
	id: string;
	name: string;
	occasion: RoutineOption;
	occasionLabel: string;
	itemIds: string[];
	items?: CapsuleItem[];
	formula: string;
	styleTips: string;
	affiliateUrl?: string | null;
	imageUrl?: string | null;
}

export interface ShoppingItem {
	id: string;
	name: string;
	category: string;
	priority: "Tinggi" | "Sedang" | "Rendah";
	reason: string;
	outfitCount: number;
	colorSuggestion: string;
	checkListText: string;
	affiliateUrl?: string | null;
	imageUrl?: string | null;
	priceEstimate?: string | null;
}

export interface AdminOutfit {
	id: string;
	name: string;
	occasion: RoutineOption;
	occasionLabel: string;
	formula: string;
	styleTips: string;
	itemIds: string[];
	affiliateUrl?: string | null;
	imageUrl?: string | null;
	sortOrder?: number;
	isActive?: boolean;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface AffiliateItem {
	id: string;
	name: string;
	category: string;
	affiliateUrl?: string | null;
	imageUrl?: string | null;
	priceEstimate?: string | null;
	updatedAt?: Date;
}

export interface AdminSetting {
	key: string;
	value: string;
	updatedAt?: Date;
}

export interface StyleGuideResult {
	summary: {
		headline: string;
		subheadline: string;
		itemCount: number;
		outfitCount: number;
		primaryStyle: string;
		genderDesc: string;
		coreRatio: string;
	};
	palette: PaletteResult;
	capsule: CapsuleItem[];
	outfits: Outfit[];
	shopping: ShoppingItem[];
	photoAnalysis?: {
		skinHex: string;
		undertone: Undertone;
		confidence: number;
		recommendedOutfitColors: string[];
		avoidColors: string[];
		explanation: string;
		veinColorType?: "hijau" | "biru" | "campuran";
		veinDescription?: string;
	};
}

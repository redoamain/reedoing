import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const sessions = sqliteTable("sessions", {
	id: text("id").primaryKey(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const submissions = sqliteTable("submissions", {
	id: text("id").primaryKey(),
	sessionId: text("session_id")
		.notNull()
		.references(() => sessions.id, { onDelete: "cascade" }),
	step: integer("step").notNull().default(1),
	answers: text("answers", { mode: "json" }).notNull(),
	status: text("status", { enum: ["draft", "selesai"] }).notNull().default("draft"),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const results = sqliteTable("results", {
	submissionId: text("submission_id")
		.primaryKey()
		.references(() => submissions.id, { onDelete: "cascade" }),
	schemaVersion: integer("schema_version").notNull().default(1),
	palette: text("palette", { mode: "json" }).notNull(),
	capsule: text("capsule", { mode: "json" }).notNull(),
	outfits: text("outfits", { mode: "json" }).notNull(),
	shopping: text("shopping", { mode: "json" }).notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull()
});

export const shoppingChecks = sqliteTable(
	"shopping_checks",
	{
		submissionId: text("submission_id")
			.notNull()
			.references(() => submissions.id, { onDelete: "cascade" }),
		itemId: text("item_id").notNull(),
		checked: integer("checked", { mode: "boolean" }).notNull().default(false)
	},
	(table) => [
		primaryKey({ columns: [table.submissionId, table.itemId] })
	]
);

export const adminOutfits = sqliteTable("admin_outfits", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	occasion: text("occasion").notNull(),
	occasionLabel: text("occasion_label").notNull(),
	formula: text("formula").notNull(),
	styleTips: text("style_tips").notNull(),
	itemIds: text("item_ids", { mode: "json" }).notNull(),
	affiliateUrl: text("affiliate_url"),
	imageUrl: text("image_url"),
	sortOrder: integer("sort_order").notNull().default(0),
	isActive: integer("is_active", { mode: "boolean" }).notNull().default(true),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const affiliateItems = sqliteTable("affiliate_items", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	category: text("category").notNull(),
	affiliateUrl: text("affiliate_url"),
	imageUrl: text("image_url"),
	priceEstimate: text("price_estimate"),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const adminSettings = sqliteTable("admin_settings", {
	key: text("key").primaryKey(),
	value: text("value").notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
});

export const aiGeneratedImages = sqliteTable("ai_generated_images", {
	id: text("id").primaryKey(),
	submissionId: text("submission_id")
		.notNull()
		.references(() => submissions.id, { onDelete: "cascade" }),
	outfitId: text("outfit_id").notNull(),
	imageData: text("image_data").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull()
});

export type Session = typeof sessions.$inferSelect;
export type Submission = typeof submissions.$inferSelect;
export type Result = typeof results.$inferSelect;
export type ShoppingCheck = typeof shoppingChecks.$inferSelect;
export type AdminOutfitRecord = typeof adminOutfits.$inferSelect;
export type AffiliateItemRecord = typeof affiliateItems.$inferSelect;
export type AdminSettingRecord = typeof adminSettings.$inferSelect;
export type AIGeneratedImageRecord = typeof aiGeneratedImages.$inferSelect;

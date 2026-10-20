import { createInsertSchema } from "drizzle-zod";
import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const adminStoreStateTable = pgTable("admin_store_state", {
  id: text("id").primaryKey(),
  data: jsonb("data").$type<Record<string, unknown>>().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export const insertAdminStoreStateSchema = createInsertSchema(
  adminStoreStateTable,
).omit({ updatedAt: true });

export type InsertAdminStoreState = z.infer<typeof insertAdminStoreStateSchema>;
export type AdminStoreStateRecord = typeof adminStoreStateTable.$inferSelect;

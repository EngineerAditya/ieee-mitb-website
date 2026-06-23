import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { societyTypeEnum } from "./enums";

/**
 * IEEE technical societies and affinity groups. Replaces the old free-text
 * `society` string that was duplicated across the codebase. `slug` reproduces
 * the legacy route slugs so `/societies/[slug]` can serve every society from
 * one dynamic route.
 */
export const societies = pgTable(
  "societies",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 80 }).notNull().unique(),
    name: varchar("name", { length: 160 }).notNull(),
    shortName: varchar("short_name", { length: 32 }),
    type: societyTypeEnum("type").notNull().default("society"),
    about: text("about").notNull().default(""),
    tagline: varchar("tagline", { length: 240 }),
    logoUrl: text("logo_url"),
    themeColor: varchar("theme_color", { length: 9 }),
    email: varchar("email", { length: 160 }),
    instagram: text("instagram"),
    linkedin: text("linkedin"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("societies_type_order_idx").on(t.type, t.displayOrder)],
);

export type Society = typeof societies.$inferSelect;
export type NewSociety = typeof societies.$inferInsert;

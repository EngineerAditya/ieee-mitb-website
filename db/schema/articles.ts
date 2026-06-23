import {
  date,
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { contentStatusEnum } from "./enums";
import { societies } from "./societies";

/**
 * Articles / publications authored or curated by the societies.
 *
 * Canonical column names (`publication`, `publicationDate`, `externalUrl`,
 * `excerpt`) resolve the legacy UI↔query mismatch where the card read
 * `publication_details` / `date_of_publication` / `link_url` but the query
 * selected `publication` / `publication_date` / `article_url`.
 */
export const articles = pgTable(
  "articles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    societyId: uuid("society_id").references(() => societies.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 240 }).notNull(),
    author: varchar("author", { length: 160 }),
    publication: varchar("publication", { length: 200 }),
    publicationDate: date("publication_date"),
    externalUrl: text("external_url"),
    imageUrl: text("image_url"),
    excerpt: text("excerpt"),
    body: text("body"),
    status: contentStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("articles_status_date_idx").on(t.status, t.publicationDate),
    index("articles_society_date_idx").on(t.societyId, t.publicationDate),
  ],
);

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

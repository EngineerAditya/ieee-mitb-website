import {
  index,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { announcementKindEnum, contentStatusEnum } from "./enums";
import { societies } from "./societies";

/** Announcements and achievements surfaced on the home page. */
export const announcements = pgTable(
  "announcements",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    kind: announcementKindEnum("kind").notNull().default("announcement"),
    title: varchar("title", { length: 240 }).notNull(),
    body: text("body"),
    imageUrl: text("image_url"),
    societyId: uuid("society_id").references(() => societies.id, {
      onDelete: "set null",
    }),
    status: contentStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("announcements_status_pub_idx").on(t.status, t.publishedAt)],
);

export type Announcement = typeof announcements.$inferSelect;
export type NewAnnouncement = typeof announcements.$inferInsert;

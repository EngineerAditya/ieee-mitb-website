import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { contentStatusEnum } from "./enums";
import { societies } from "./societies";

/**
 * Events hosted by IEEE MIT Bengaluru or its societies.
 *
 * Fixes carried over from the legacy schema:
 *  - `society` free-text string → `societyId` FK (nullable for org-wide events).
 *  - `link` (rendered but never selected) → `registrationUrl`.
 *  - flat `date` → `startAt` (+ optional `endAt`).
 *  - adds `slug` for `/events/[slug]` detail pages and `status` for drafts.
 */
export const events = pgTable(
  "events",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: varchar("slug", { length: 200 }).notNull().unique(),
    societyId: uuid("society_id").references(() => societies.id, {
      onDelete: "set null",
    }),
    title: varchar("title", { length: 240 }).notNull(),
    description: text("description").notNull().default(""),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }),
    venue: varchar("venue", { length: 240 }),
    imageUrl: text("image_url"),
    registrationUrl: text("registration_url"),
    eventType: varchar("event_type", { length: 60 }),
    rsvpCount: integer("rsvp_count").notNull().default(0),
    status: contentStatusEnum("status").notNull().default("draft"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    // Primary public list query: published events ordered by date (upcoming/past).
    index("events_status_start_idx").on(t.status, t.startAt),
    // Society-filtered list.
    index("events_society_start_idx").on(t.societyId, t.startAt),
  ],
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;

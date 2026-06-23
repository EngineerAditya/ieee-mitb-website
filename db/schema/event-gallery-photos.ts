import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { events } from "./events";

/** Photo gallery attached to a (typically past) event. */
export const eventGalleryPhotos = pgTable(
  "event_gallery_photos",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    imageUrl: text("image_url").notNull(),
    caption: varchar("caption", { length: 240 }),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("event_gallery_event_order_idx").on(t.eventId, t.displayOrder)],
);

export type EventGalleryPhoto = typeof eventGalleryPhotos.$inferSelect;
export type NewEventGalleryPhoto = typeof eventGalleryPhotos.$inferInsert;

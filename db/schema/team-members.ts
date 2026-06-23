import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * Organisation-level leadership (the student-branch cabinet shown on Home).
 * `term` + `isCurrent` keep historical cabinets while the public site queries
 * only the current one.
 */
export const teamMembers = pgTable(
  "team_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 160 }).notNull(),
    position: varchar("position", { length: 120 }).notNull(),
    photoUrl: text("photo_url"),
    email: varchar("email", { length: 160 }),
    linkedin: text("linkedin"),
    term: varchar("term", { length: 20 }),
    isCurrent: boolean("is_current").notNull().default(true),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("team_members_current_order_idx").on(t.isCurrent, t.displayOrder),
  ],
);

export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;

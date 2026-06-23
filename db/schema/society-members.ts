import {
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { memberTypeEnum } from "./enums";
import { societies } from "./societies";

/**
 * Office-bearers (students) and faculty advisors of a society. A single table
 * for both — they differ only by `memberType` and which fields are populated
 * (`roleTitle` unifies the old student `role` and faculty `title`).
 */
export const societyMembers = pgTable(
  "society_members",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    societyId: uuid("society_id")
      .notNull()
      .references(() => societies.id, { onDelete: "cascade" }),
    memberType: memberTypeEnum("member_type").notNull(),
    name: varchar("name", { length: 160 }).notNull(),
    roleTitle: varchar("role_title", { length: 120 }),
    photoUrl: text("photo_url"),
    email: varchar("email", { length: 160 }),
    linkedin: text("linkedin"),
    displayOrder: integer("display_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("society_members_society_type_order_idx").on(
      t.societyId,
      t.memberType,
      t.displayOrder,
    ),
  ],
);

export type SocietyMember = typeof societyMembers.$inferSelect;
export type NewSocietyMember = typeof societyMembers.$inferInsert;

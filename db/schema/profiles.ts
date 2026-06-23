import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { userRoleEnum } from "./enums";

/**
 * Application profile, 1:1 with Supabase `auth.users`.
 *
 * Drizzle does not own the `auth` schema, so the FK to `auth.users(id)`, the
 * `handle_new_user` signup trigger, and the `is_admin()` helper are added by a
 * custom migration (drizzle/0001_*). `role` drives admin-dashboard access and
 * RLS write policies.
 */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: varchar("email", { length: 160 }),
  fullName: varchar("full_name", { length: 160 }),
  role: userRoleEnum("role").notNull().default("viewer"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;

import { pgEnum } from "drizzle-orm/pg-core";

/** A technical Society vs. an Affinity group (e.g. Women in Engineering). */
export const societyTypeEnum = pgEnum("society_type", ["society", "affinity"]);

/** Student office-bearers vs. faculty advisors of a society. */
export const memberTypeEnum = pgEnum("member_type", ["student", "faculty"]);

/** Publication lifecycle for events / articles / announcements. */
export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "published",
  "archived",
]);

/** Admin dashboard access levels. */
export const userRoleEnum = pgEnum("user_role", ["admin", "editor", "viewer"]);

/** Triage state for inbound contact messages. */
export const messageStatusEnum = pgEnum("message_status", [
  "new",
  "read",
  "archived",
]);

/** Distinguishes general announcements from achievements/highlights. */
export const announcementKindEnum = pgEnum("announcement_kind", [
  "announcement",
  "achievement",
]);

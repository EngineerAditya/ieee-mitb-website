import { desc, eq, sql } from "drizzle-orm";
import { db } from "@/db/client";
import { contactMessages, newsletterSubscribers } from "@/db/schema";
import type {
  ContactMessageInput,
  NewsletterInput,
} from "@/lib/validations/inbox";

export async function createContactMessage(data: ContactMessageInput) {
  await db.insert(contactMessages).values(data);
}

export async function subscribeNewsletter(data: NewsletterInput) {
  await db
    .insert(newsletterSubscribers)
    .values({ email: data.email })
    .onConflictDoNothing({ target: newsletterSubscribers.email });
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function listContactMessages() {
  return db
    .select()
    .from(contactMessages)
    .orderBy(desc(contactMessages.createdAt));
}

export async function updateMessageStatus(
  id: string,
  status: "new" | "read" | "archived",
) {
  await db
    .update(contactMessages)
    .set({ status })
    .where(eq(contactMessages.id, id));
}

export async function listNewsletterSubscribers() {
  return db
    .select()
    .from(newsletterSubscribers)
    .orderBy(desc(newsletterSubscribers.createdAt));
}

export async function countNewContactMessages(): Promise<number> {
  const rows = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(contactMessages)
    .where(eq(contactMessages.status, "new"));
  return rows[0]?.count ?? 0;
}

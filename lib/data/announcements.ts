import { desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { announcements, societies } from "@/db/schema";
import type { AnnouncementInput } from "@/lib/validations/announcement";

export type AnnouncementListItem = {
  id: string;
  kind: "announcement" | "achievement";
  title: string;
  body: string | null;
  imageUrl: string | null;
  publishedAt: Date | null;
  societyName: string | null;
};

const listSelection = {
  id: announcements.id,
  kind: announcements.kind,
  title: announcements.title,
  body: announcements.body,
  imageUrl: announcements.imageUrl,
  publishedAt: announcements.publishedAt,
  societyName: societies.name,
};

/** Published announcements, newest first (home page / announcements section). */
export async function listPublishedAnnouncements(
  limit = 6,
): Promise<AnnouncementListItem[]> {
  return db
    .select(listSelection)
    .from(announcements)
    .leftJoin(societies, eq(announcements.societyId, societies.id))
    .where(eq(announcements.status, "published"))
    .orderBy(desc(announcements.publishedAt))
    .limit(limit);
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function listAnnouncementsAdmin() {
  return db
    .select({ ...listSelection, status: announcements.status })
    .from(announcements)
    .leftJoin(societies, eq(announcements.societyId, societies.id))
    .orderBy(desc(announcements.createdAt));
}

export async function getAnnouncementById(id: string) {
  const rows = await db
    .select()
    .from(announcements)
    .where(eq(announcements.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createAnnouncement(data: AnnouncementInput) {
  // If publishing without an explicit date, stamp it now.
  const publishedAt =
    data.publishedAt ?? (data.status === "published" ? new Date() : null);
  const rows = await db
    .insert(announcements)
    .values({ ...data, publishedAt })
    .returning({ id: announcements.id });
  return rows[0]!;
}

export async function updateAnnouncement(id: string, data: AnnouncementInput) {
  const publishedAt =
    data.publishedAt ?? (data.status === "published" ? new Date() : null);
  await db
    .update(announcements)
    .set({ ...data, publishedAt, updatedAt: new Date() })
    .where(eq(announcements.id, id));
}

export async function deleteAnnouncement(id: string) {
  await db.delete(announcements).where(eq(announcements.id, id));
}

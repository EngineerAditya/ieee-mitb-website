import { asc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { societies, societyMembers } from "@/db/schema";
import type { Society, SocietyMember } from "@/db/schema";
import type {
  SocietyInput,
  SocietyMemberInput,
} from "@/lib/validations/society";

export type SocietySummary = {
  id: string;
  slug: string;
  name: string;
  shortName: string | null;
  type: "society" | "affinity";
  about: string;
  tagline: string | null;
  logoUrl: string | null;
  themeColor: string | null;
};

/** All societies + affinity groups, in display order (overview page). */
export async function listSocieties(): Promise<SocietySummary[]> {
  return db
    .select({
      id: societies.id,
      slug: societies.slug,
      name: societies.name,
      shortName: societies.shortName,
      type: societies.type,
      about: societies.about,
      tagline: societies.tagline,
      logoUrl: societies.logoUrl,
      themeColor: societies.themeColor,
    })
    .from(societies)
    .orderBy(asc(societies.displayOrder), asc(societies.name));
}

/** Just the slugs — for `generateStaticParams`. */
export async function listSocietySlugs(): Promise<string[]> {
  const rows = await db.select({ slug: societies.slug }).from(societies);
  return rows.map((r) => r.slug);
}

export type SocietyWithMembers = {
  society: Society;
  students: SocietyMember[];
  faculty: SocietyMember[];
};

/** A society by slug with its members split into students and faculty. */
export async function getSocietyBySlug(
  slug: string,
): Promise<SocietyWithMembers | null> {
  const rows = await db
    .select()
    .from(societies)
    .where(eq(societies.slug, slug))
    .limit(1);
  const society = rows[0];
  if (!society) return null;

  const members = await db
    .select()
    .from(societyMembers)
    .where(eq(societyMembers.societyId, society.id))
    .orderBy(asc(societyMembers.displayOrder), asc(societyMembers.name));

  return {
    society,
    students: members.filter((m) => m.memberType === "student"),
    faculty: members.filter((m) => m.memberType === "faculty"),
  };
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function listSocietiesAdmin(): Promise<Society[]> {
  return db
    .select()
    .from(societies)
    .orderBy(asc(societies.displayOrder), asc(societies.name));
}

export async function getSocietyById(id: string): Promise<Society | null> {
  const rows = await db
    .select()
    .from(societies)
    .where(eq(societies.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createSociety(data: SocietyInput) {
  const rows = await db
    .insert(societies)
    .values(data)
    .returning({ id: societies.id, slug: societies.slug });
  return rows[0]!;
}

export async function updateSociety(id: string, data: SocietyInput) {
  await db
    .update(societies)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(societies.id, id));
}

export async function deleteSociety(id: string) {
  await db.delete(societies).where(eq(societies.id, id));
}

// ── Members ───────────────────────────────────────────────────────────────--

export async function listMembersBySociety(
  societyId: string,
): Promise<SocietyMember[]> {
  return db
    .select()
    .from(societyMembers)
    .where(eq(societyMembers.societyId, societyId))
    .orderBy(asc(societyMembers.displayOrder), asc(societyMembers.name));
}

export async function getMemberById(id: string): Promise<SocietyMember | null> {
  const rows = await db
    .select()
    .from(societyMembers)
    .where(eq(societyMembers.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createMember(data: SocietyMemberInput) {
  const rows = await db
    .insert(societyMembers)
    .values(data)
    .returning({ id: societyMembers.id });
  return rows[0]!;
}

export async function updateMember(id: string, data: SocietyMemberInput) {
  await db
    .update(societyMembers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(societyMembers.id, id));
}

export async function deleteMember(id: string) {
  await db.delete(societyMembers).where(eq(societyMembers.id, id));
}

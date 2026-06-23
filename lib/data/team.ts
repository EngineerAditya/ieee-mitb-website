import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db/client";
import { teamMembers } from "@/db/schema";
import type { TeamMember } from "@/db/schema";
import type { TeamMemberInput } from "@/lib/validations/team";

/** The current student-branch cabinet (home page), in display order. */
export async function listCurrentTeam(): Promise<TeamMember[]> {
  return db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.isCurrent, true))
    .orderBy(asc(teamMembers.displayOrder), asc(teamMembers.name));
}

// ── Admin ───────────────────────────────────────────────────────────────────

export async function listTeamAdmin(): Promise<TeamMember[]> {
  return db
    .select()
    .from(teamMembers)
    .orderBy(
      desc(teamMembers.isCurrent),
      asc(teamMembers.displayOrder),
      asc(teamMembers.name),
    );
}

export async function getTeamMemberById(
  id: string,
): Promise<TeamMember | null> {
  const rows = await db
    .select()
    .from(teamMembers)
    .where(eq(teamMembers.id, id))
    .limit(1);
  return rows[0] ?? null;
}

export async function createTeamMember(data: TeamMemberInput) {
  const rows = await db
    .insert(teamMembers)
    .values(data)
    .returning({ id: teamMembers.id });
  return rows[0]!;
}

export async function updateTeamMember(id: string, data: TeamMemberInput) {
  await db
    .update(teamMembers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(teamMembers.id, id));
}

export async function deleteTeamMember(id: string) {
  await db.delete(teamMembers).where(eq(teamMembers.id, id));
}

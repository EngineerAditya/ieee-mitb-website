import { cache } from "react";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db/client";
import { profiles } from "@/db/schema";
import type { Profile } from "@/db/schema";
import { getUser } from "./get-user";

/** The current user's profile row (with role), or null if signed out. */
export const getCurrentProfile = cache(async (): Promise<Profile | null> => {
  const user = await getUser();
  if (!user) return null;
  const rows = await db
    .select()
    .from(profiles)
    .where(eq(profiles.id, user.id))
    .limit(1);
  return rows[0] ?? null;
});

export async function isAdmin(): Promise<boolean> {
  const profile = await getCurrentProfile();
  return profile?.role === "admin";
}

/**
 * Page/layout guard. Redirects to login (or back with an error) when the
 * current user is not an admin. Returns the profile on success.
 */
export async function requireAdmin(): Promise<Profile> {
  const user = await getUser();
  if (!user) redirect("/admin/login");
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }
  return profile;
}

/**
 * Server Action guard. Throws (rather than redirecting) so the action can
 * surface an error to the form. Every mutating action must call this.
 */
export async function assertAdmin(): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized: admin access required.");
  }
  return profile;
}

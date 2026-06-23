"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/require-admin";
import {
  createTeamMember,
  deleteTeamMember,
  updateTeamMember,
} from "@/lib/data/team";
import { teamMemberInputSchema } from "@/lib/validations/team";
import {
  type ActionState,
  errorState,
  resolveImageUrl,
  toObject,
  validationError,
} from "./_shared";

function revalidateTeam() {
  revalidatePath("/");
  revalidatePath("/admin/team");
}

export async function createTeamMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await assertAdmin();
    const obj = toObject(formData);
    obj.photoUrl = await resolveImageUrl(formData, "team");
    const parsed = teamMemberInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await createTeamMember(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateTeam();
  redirect("/admin/team");
}

export async function updateTeamMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  try {
    await assertAdmin();
    if (!id) return { ok: false, error: "Missing team member id." };
    const obj = toObject(formData);
    obj.photoUrl = await resolveImageUrl(formData, "team");
    const parsed = teamMemberInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await updateTeamMember(id, parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateTeam();
  redirect("/admin/team");
}

export async function deleteTeamMemberAction(
  formData: FormData,
): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteTeamMember(id);
  revalidateTeam();
  redirect("/admin/team");
}

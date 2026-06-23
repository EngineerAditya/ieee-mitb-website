"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/require-admin";
import {
  createMember,
  createSociety,
  deleteMember,
  deleteSociety,
  getMemberById,
  updateMember,
  updateSociety,
} from "@/lib/data/societies";
import {
  societyInputSchema,
  societyMemberInputSchema,
} from "@/lib/validations/society";
import {
  type ActionState,
  errorState,
  resolveImageUrl,
  toObject,
  validationError,
} from "./_shared";

function revalidateSocieties() {
  revalidatePath("/societies");
  revalidatePath("/admin/societies");
}

// ── Societies ────────────────────────────────────────────────────────────────

export async function createSocietyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await assertAdmin();
    const obj = toObject(formData);
    obj.logoUrl = await resolveImageUrl(formData, "societies");
    const parsed = societyInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await createSociety(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateSocieties();
  redirect("/admin/societies");
}

export async function updateSocietyAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  try {
    await assertAdmin();
    if (!id) return { ok: false, error: "Missing society id." };
    const obj = toObject(formData);
    obj.logoUrl = await resolveImageUrl(formData, "societies");
    const parsed = societyInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await updateSociety(id, parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateSocieties();
  redirect("/admin/societies");
}

export async function deleteSocietyAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteSociety(id);
  revalidateSocieties();
  redirect("/admin/societies");
}

// ── Society members ──────────────────────────────────────────────────────────

export async function createMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  let societyId = "";
  try {
    await assertAdmin();
    const obj = toObject(formData);
    obj.photoUrl = await resolveImageUrl(formData, "members");
    const parsed = societyMemberInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    societyId = parsed.data.societyId;
    await createMember(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateSocieties();
  redirect(`/admin/societies/${societyId}/members`);
}

export async function updateMemberAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  let societyId = "";
  try {
    await assertAdmin();
    if (!id) return { ok: false, error: "Missing member id." };
    const obj = toObject(formData);
    obj.photoUrl = await resolveImageUrl(formData, "members");
    const parsed = societyMemberInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    societyId = parsed.data.societyId;
    await updateMember(id, parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateSocieties();
  redirect(`/admin/societies/${societyId}/members`);
}

export async function deleteMemberAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const member = id ? await getMemberById(id) : null;
  if (id) await deleteMember(id);
  revalidateSocieties();
  redirect(
    member
      ? `/admin/societies/${member.societyId}/members`
      : "/admin/societies",
  );
}

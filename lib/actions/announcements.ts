"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/require-admin";
import {
  createAnnouncement,
  deleteAnnouncement,
  updateAnnouncement,
} from "@/lib/data/announcements";
import { announcementInputSchema } from "@/lib/validations/announcement";
import {
  type ActionState,
  errorState,
  resolveImageUrl,
  toObject,
  validationError,
} from "./_shared";

function revalidateAnnouncements() {
  revalidatePath("/");
  revalidatePath("/admin/announcements");
}

export async function createAnnouncementAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await assertAdmin();
    const obj = toObject(formData);
    obj.imageUrl = await resolveImageUrl(formData, "announcements");
    const parsed = announcementInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await createAnnouncement(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateAnnouncements();
  redirect("/admin/announcements");
}

export async function updateAnnouncementAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  try {
    await assertAdmin();
    if (!id) return { ok: false, error: "Missing announcement id." };
    const obj = toObject(formData);
    obj.imageUrl = await resolveImageUrl(formData, "announcements");
    const parsed = announcementInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await updateAnnouncement(id, parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateAnnouncements();
  redirect("/admin/announcements");
}

export async function deleteAnnouncementAction(
  formData: FormData,
): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteAnnouncement(id);
  revalidateAnnouncements();
  redirect("/admin/announcements");
}

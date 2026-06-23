"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { assertAdmin } from "@/lib/auth/require-admin";
import { createEvent, deleteEvent, updateEvent } from "@/lib/data/events";
import { eventInputSchema } from "@/lib/validations/event";
import {
  type ActionState,
  errorState,
  resolveImageUrl,
  toObject,
  validationError,
} from "./_shared";

function revalidateEvents() {
  revalidatePath("/");
  revalidatePath("/events");
  revalidatePath("/admin/events");
}

export async function createEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    await assertAdmin();
    const obj = toObject(formData);
    obj.imageUrl = await resolveImageUrl(formData, "events");
    const parsed = eventInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await createEvent(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateEvents();
  redirect("/admin/events");
}

export async function updateEventAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  try {
    await assertAdmin();
    if (!id) return { ok: false, error: "Missing event id." };
    const obj = toObject(formData);
    obj.imageUrl = await resolveImageUrl(formData, "events");
    const parsed = eventInputSchema.safeParse(obj);
    if (!parsed.success) return validationError(parsed.error);
    await updateEvent(id, parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidateEvents();
  redirect("/admin/events");
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  if (id) await deleteEvent(id);
  revalidateEvents();
  redirect("/admin/events");
}

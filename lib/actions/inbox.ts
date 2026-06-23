"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { assertAdmin } from "@/lib/auth/require-admin";
import { rateLimit } from "@/lib/rate-limit";
import {
  createContactMessage,
  subscribeNewsletter,
  updateMessageStatus,
} from "@/lib/data/inbox";
import {
  contactMessageInputSchema,
  messageStatusSchema,
  newsletterInputSchema,
} from "@/lib/validations/inbox";
import {
  type ActionState,
  errorState,
  toObject,
  validationError,
} from "./_shared";

/** Public — contact form. `website` is a honeypot; bots fill it, humans don't. */
export async function submitContactAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (String(formData.get("website") ?? "")) return { ok: true };
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!rateLimit(`contact:${ip}`)) {
      return { ok: false, error: "Too many requests. Try again in a minute." };
    }
    const parsed = contactMessageInputSchema.safeParse(toObject(formData));
    if (!parsed.success) return validationError(parsed.error);
    await createContactMessage(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  revalidatePath("/admin/inbox");
  return { ok: true };
}

/** Public — newsletter signup. */
export async function subscribeNewsletterAction(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  try {
    if (String(formData.get("website") ?? "")) return { ok: true };
    const ip =
      (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() ||
      "unknown";
    if (!rateLimit(`newsletter:${ip}`)) {
      return { ok: false, error: "Too many requests. Try again in a minute." };
    }
    const parsed = newsletterInputSchema.safeParse(toObject(formData));
    if (!parsed.success) return validationError(parsed.error);
    await subscribeNewsletter(parsed.data);
  } catch (e) {
    return errorState(e);
  }
  return { ok: true };
}

/** Admin — change a contact message's triage status. */
export async function updateMessageStatusAction(
  formData: FormData,
): Promise<void> {
  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = messageStatusSchema.parse(formData.get("status"));
  if (id) await updateMessageStatus(id, status);
  revalidatePath("/admin/inbox");
}

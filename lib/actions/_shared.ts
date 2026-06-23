import "server-only";
import { z } from "zod";
import { uploadImage } from "@/lib/storage";
import type { ActionState } from "./types";

export type { ActionState } from "./types";
export { initialActionState } from "./types";

/** Error whose message is SAFE to show to the user (validation/upload). Anything
 *  else is treated as unexpected and surfaced generically (no internal leakage). */
export class ActionError extends Error {}

const ALLOWED_IMAGE_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "image/avif",
]);
const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB

/** Flatten FormData into a plain object for schema parsing. */
export function toObject(formData: FormData): Record<string, unknown> {
  return Object.fromEntries(formData.entries());
}

export function validationError(error: z.ZodError): ActionState {
  return {
    ok: false,
    error: "Please fix the errors below.",
    fieldErrors: z.flattenError(error).fieldErrors,
  };
}

export function errorState(e: unknown): ActionState {
  // Only show messages we explicitly marked safe; never leak raw error text
  // (could expose DB/internal details).
  if (e instanceof ActionError) return { ok: false, error: e.message };
  console.error("Action error:", e);
  return { ok: false, error: "Something went wrong. Please try again." };
}

/**
 * Resolve the final image URL for a form: if an `imageFile` was uploaded, store
 * it and return its URL; otherwise fall back to the `imageUrl` text field.
 */
export async function resolveImageUrl(
  formData: FormData,
  folder: string,
): Promise<string | null> {
  const file = formData.get("imageFile");
  if (file instanceof File && file.size > 0) {
    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      throw new ActionError(
        "Unsupported image type. Use PNG, JPEG, WebP, GIF, or AVIF.",
      );
    }
    if (file.size > MAX_IMAGE_BYTES) {
      throw new ActionError("Image too large (max 4 MB).");
    }
    return uploadImage(file, folder);
  }
  const url = formData.get("imageUrl");
  return typeof url === "string" && url.trim() ? url.trim() : null;
}

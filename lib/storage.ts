import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

/** Supabase Storage bucket for all uploaded media. Create it (public) in the
 *  Supabase dashboard, or it is created on first deploy via the setup docs. */
export const MEDIA_BUCKET = "media";

/**
 * Upload an image to Supabase Storage and return its public URL.
 * Server-only; uses the service role, so callers MUST authorize first.
 */
export async function uploadImage(
  file: File,
  folder = "uploads",
): Promise<string> {
  const supabase = createAdminClient();
  const ext = (file.name.split(".").pop() || "bin")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(MEDIA_BUCKET)
    .upload(path, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });
  if (error) throw new Error(`Image upload failed: ${error.message}`);

  const { data } = supabase.storage.from(MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

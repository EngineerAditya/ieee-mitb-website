import { cache } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";

/**
 * The authenticated Supabase user for the current request, or null.
 * `cache` dedupes the call across a single render pass. Always uses
 * `getUser()` (validates the token), never `getSession()`.
 */
export const getUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

import { createBrowserClient } from "@supabase/ssr";

/**
 * Supabase client for the browser (Client Components only). Used for the admin
 * login form and any direct Storage uploads. Reads the public, browser-safe
 * env vars (inlined by Next at build time).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}

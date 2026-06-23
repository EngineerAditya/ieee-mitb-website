import "server-only";
import { z } from "zod";

/**
 * Centralized, validated environment configuration.
 *
 * ⚠️ Server-only. This module reads server secrets (DATABASE_URL,
 * SUPABASE_SERVICE_ROLE_KEY), so it must NEVER be imported from a Client
 * Component. Client Components read `NEXT_PUBLIC_*` values from `process.env`
 * directly (Next.js inlines them at build time). The server-only `postgres`
 * driver that consumes `DATABASE_URL` also can't be bundled for the browser,
 * so an accidental client import fails loudly at build time.
 *
 * Validation runs once at module load and throws a descriptive error if any
 * required variable is missing or malformed — failing fast instead of at the
 * first database/auth call.
 */
const envSchema = z.object({
  // --- Server-only ---
  /** Supabase Supavisor pooler connection (transaction mode, port 6543) — runtime queries. */
  DATABASE_URL: z.url(),
  /** Direct Postgres connection (port 5432) — used by drizzle-kit for migrations only. */
  DIRECT_URL: z.url().optional(),
  /** Service-role key for trusted server-side Supabase operations (Storage admin, etc.). */
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // --- Public (browser-safe, inlined at build) ---
  NEXT_PUBLIC_SUPABASE_URL: z.url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),

  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
});

function loadEnv() {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("\n");
    throw new Error(
      `❌ Invalid environment variables:\n${issues}\n\nSee .env.example for the required keys.`,
    );
  }
  return parsed.data;
}

export const env = loadEnv();

export type Env = z.infer<typeof envSchema>;

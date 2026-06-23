import "server-only";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/lib/env";
import * as schema from "./schema";

/**
 * Drizzle database client.
 *
 * Connects via `postgres-js` to the Supabase Supavisor pooler (transaction
 * mode). `prepare: false` is REQUIRED — transaction-mode pooling does not
 * support prepared statements. The client is cached on `globalThis` in
 * non-production to avoid exhausting connections across Next.js hot reloads.
 *
 * Server-only. Importing this from a Client Component will fail to bundle.
 */
const globalForDb = globalThis as unknown as {
  __pgClient?: ReturnType<typeof postgres>;
};

const client =
  globalForDb.__pgClient ?? postgres(env.DATABASE_URL, { prepare: false });

if (env.NODE_ENV !== "production") {
  globalForDb.__pgClient = client;
}

export const db = drizzle(client, { schema });

export { schema };

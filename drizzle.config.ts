import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit runs outside Next.js, so load env from .env.local explicitly.
config({ path: ".env.local" });

/**
 * Migrations use the DIRECT connection (port 5432) — the transaction pooler
 * cannot run migration DDL reliably. Falls back to DATABASE_URL if unset.
 */
export default defineConfig({
  schema: "./db/schema/index.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
  verbose: true,
  strict: true,
});

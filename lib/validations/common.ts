import { z } from "zod";

/** Shared scalar schemas. */
export const idSchema = z.uuid();
export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9-]+$/, "Must be lowercase letters, numbers, and hyphens");

export const contentStatusSchema = z.enum(["draft", "published", "archived"]);
export type ContentStatus = z.infer<typeof contentStatusSchema>;

export const eventScopeSchema = z.enum(["all", "upcoming", "past"]);
export type EventScope = z.infer<typeof eventScopeSchema>;

/**
 * An optional URL field that tolerates empty strings. Only http(s) is allowed —
 * `z.url()` accepts `javascript:`/`data:`/`vbscript:` schemes, which would be
 * stored and later rendered into href/src (stored XSS / open redirect).
 */
const httpUrl = z
  .string()
  .trim()
  .max(2048)
  .refine((u) => {
    // Same-origin relative path (but not protocol-relative "//…").
    if (u.startsWith("/") && !u.startsWith("//")) return true;
    try {
      const proto = new URL(u).protocol;
      return proto === "http:" || proto === "https:";
    } catch {
      return false;
    }
  }, "Must be an http(s) or relative URL");

export const optionalUrl = z
  .union([httpUrl, z.literal("")])
  .nullish()
  .transform((v) => (v ? v : null));

/** Optional trimmed text that normalizes "" to null. */
export const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .nullish()
    .transform((v) => (v ? v : null));

/** Optional UUID FK from a form select; "" → null. */
export const optionalUuid = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.uuid().nullable(),
);

/** Optional date from a form input; "" → null. */
export const optionalDate = z.preprocess(
  (v) => (v === "" || v == null ? null : v),
  z.coerce.date().nullable(),
);

/**
 * Pagination + filter query, parsed from URL `searchParams`. `coerce` turns the
 * string values that arrive from the URL into numbers.
 */
export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).catch(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).catch(12).default(12),
  /** Society slug (e.g. "computer-society"). */
  society: z.string().max(80).optional(),
  year: z.coerce.number().int().min(1970).max(2100).optional(),
  month: z.coerce.number().int().min(1).max(12).optional(),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  search: z.string().trim().max(120).optional(),
});
export type ListQuery = z.infer<typeof listQuerySchema>;

export const eventsQuerySchema = listQuerySchema.extend({
  scope: eventScopeSchema.catch("all").default("all"),
});
export type EventsQuery = z.infer<typeof eventsQuerySchema>;

/** Result envelope returned by every paginated repository query. */
export type Paginated<T> = {
  rows: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

/**
 * Coerce a Next.js `searchParams` record (string | string[] | undefined) into a
 * flat record of single string values for schema parsing.
 */
export function flattenSearchParams(
  sp: Record<string, string | string[] | undefined>,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, value] of Object.entries(sp)) {
    if (value === undefined) continue;
    const v = Array.isArray(value) ? value[0] : value;
    if (v !== undefined && v !== "") out[key] = v;
  }
  return out;
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Render-time guard (defense-in-depth): return a URL only if it uses a safe
 * scheme (http/https, optionally mailto), else undefined. Use on every
 * user/admin-supplied href/src so a poisoned value can never become a
 * `javascript:`/`data:` sink even if it bypassed input validation.
 */
export function safeUrl(
  value: string | null | undefined,
  allowMailto = false,
): string | undefined {
  if (!value) return undefined;
  const v = value.trim();
  // Same-origin relative path (but not protocol-relative "//…").
  if (v.startsWith("/") && !v.startsWith("//")) return v;
  try {
    const proto = new URL(v).protocol;
    if (proto === "http:" || proto === "https:") return v;
    if (allowMailto && proto === "mailto:") return v;
    return undefined;
  } catch {
    return undefined;
  }
}

/** Merge class names with clsx + tailwind-merge (later utilities win conflicts). */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** URL-safe slug from arbitrary text (e.g. an event/article title). */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['’"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);
}

/** Format a date for display, e.g. "21 June 2026 • 5:30 PM". */
export function formatDateTime(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `${datePart} • ${timePart}`;
}

/** Format a date (no time), e.g. "21 June 2026". */
export function formatDate(value: string | Date): string {
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

const pad = (n: number) => String(n).padStart(2, "0");

/** Format a Date as a `datetime-local` input value ("YYYY-MM-DDTHH:mm"). */
export function toDateTimeLocal(value?: Date | string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Format a date as a `date` input value ("YYYY-MM-DD"). */
export function toDateInput(value?: Date | string | null): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

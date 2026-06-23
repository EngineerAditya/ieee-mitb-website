import "server-only";

/**
 * Best-effort in-memory rate limiter for public form posts.
 *
 * ⚠️ Per-instance only. On serverless / multi-instance deployments this does NOT
 * provide hard guarantees — for that, put an edge limiter (e.g. Upstash Ratelimit)
 * or a CAPTCHA (Cloudflare Turnstile) in front of the public actions. This is a
 * basic abuse brake so a single client can't trivially flood the inbox tables.
 */
type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

export function rateLimit(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (b.count >= limit) return false;
  b.count++;
  return true;
}

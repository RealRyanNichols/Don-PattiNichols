/**
 * Best-effort, dependency-free spam controls for the public form endpoints.
 *
 * The Supabase INSERT policies on `messages` and `subscribers` are
 * intentionally open (anon can submit the contact + newsletter forms), so we
 * filter abuse at the app layer here.
 */

/**
 * Honeypot: a form field that is hidden from humans. If it comes back with any
 * value, the submitter is almost certainly a bot filling every field it sees.
 */
export function isBot(honeypot: unknown): boolean {
  return typeof honeypot === "string" && honeypot.trim().length > 0;
}

/** Best-guess client IP from the proxy headers Vercel sets in front of us. */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

type Hit = { count: number; resetAt: number };
const buckets = new Map<string, Hit>();

/**
 * In-memory fixed-window rate limit. Best-effort only: serverless instances do
 * not share memory, so this throttles a burst against a single warm instance,
 * not globally. For a hard limit, front it with Upstash/Redis or hCaptcha.
 */
export function rateLimit(
  key: string,
  { limit = 5, windowMs = 60_000 }: { limit?: number; windowMs?: number } = {},
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Opportunistic cleanup so the map can't grow without bound.
  if (buckets.size > 5000) {
    buckets.forEach((v, k) => {
      if (now >= v.resetAt) buckets.delete(k);
    });
  }

  const hit = buckets.get(key);
  if (!hit || now >= hit.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }
  hit.count += 1;
  if (hit.count > limit) {
    return { ok: false, retryAfterSec: Math.max(1, Math.ceil((hit.resetAt - now) / 1000)) };
  }
  return { ok: true, retryAfterSec: 0 };
}

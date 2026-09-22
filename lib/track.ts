"use client";

import { track as vercelTrack } from "@vercel/analytics";

/**
 * Anonymous interactions, never payment confirmations or form contents.
 * Uses the existing Vercel Analytics installation. GA4/Meta also receive events
 * if configured. Only the public context fields below may leave the browser.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

const contextFields = new Set([
  "location",
  "fund",
  "target",
  "path",
  "to",
  "from",
  "item",
  "qty",
  "amount",
  "total",
  "monthly",
  "items",
  "score",
  "what",
  "tool",
  "interest",
  "topic",
]);
const urlFields = new Set(["target", "path", "to", "from"]);

function publicProperties(props: Record<string, string | number>) {
  const safe: Record<string, string | number> = {};
  for (const [key, value] of Object.entries(props)) {
    if (!contextFields.has(key)) continue;
    if (typeof value === "number") {
      if (Number.isFinite(value)) safe[key] = value;
    } else if (typeof value === "string") {
      // Query strings and fragments can contain form details or access tokens.
      if (urlFields.has(key)) {
        try {
          const url = new URL(value, "https://www.donandpatti.com");
          if (!url.pathname.startsWith("/admin")) {
            safe[key] = (
              value.startsWith("/")
                ? url.pathname
                : `${url.origin}${url.pathname}`
            ).slice(0, 200);
          }
        } catch {
          // Malformed destinations are not useful event properties.
        }
      } else if (!value.includes("@")) {
        safe[key] = value.slice(0, 120);
      }
    }
  }
  return safe;
}

export function track(
  event: string,
  props: Record<string, string | number> = {},
) {
  if (typeof window === "undefined") return;
  if (!/^[a-z][a-z0-9_]{0,63}$/.test(event)) return;
  const safe = publicProperties(props);
  try {
    vercelTrack(event, safe);
  } catch {
    // A blocked analytics provider must never block a donation or another provider.
  }
  try {
    window.gtag?.("event", event, safe);
  } catch {}
  try {
    window.fbq?.("trackCustom", event, safe);
  } catch {}
}

"use client";

/**
 * Click + event tracking helper.
 * Fires to GA4 and Meta Pixel automatically once their IDs are set in lib/site.ts.
 * Usage: track("give_click", { fund: "belize-trip", location: "header" })
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  try {
    window.gtag?.("event", event, props);
    window.fbq?.("trackCustom", event, props);
    if (process.env.NODE_ENV === "development") {
      console.log("[track]", event, props);
    }
  } catch {
    // never let analytics break the site
  }
}

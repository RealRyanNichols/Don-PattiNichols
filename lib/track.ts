/**
 * Lightweight click/event tracking.
 *
 * Sends custom events to Google Analytics (gtag) and Meta Pixel (fbq)
 * when those scripts are present. Safe to call when they are not —
 * ad-blocked or unconfigured analytics never break the site.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function track(event: string, props: Record<string, unknown> = {}) {
  try {
    window.gtag?.("event", event, props);
    window.fbq?.("trackCustom", event, props);
  } catch {
    // never let analytics break the page
  }
}

"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { track } from "@/lib/track";

/**
 * SHARE — one tap on a phone opens the native share sheet (Messages, Facebook,
 * WhatsApp…); on desktop it copies the link. Facebook shares are this site's
 * biggest traffic source, so every share button is a small evangelist.
 */
export default function ShareButton({
  title,
  text,
  path,
  dark = false,
  compact = false,
}: {
  title: string;
  text: string;
  path: string;
  dark?: boolean;
  compact?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const url = `${site.url}${path}`;

  async function share() {
    track("share_click", { path });
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }
    } catch {
      // User closed the sheet — fine.
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard blocked — nothing to do.
    }
  }

  const base = compact
    ? "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold transition"
    : "inline-flex items-center justify-center gap-2 rounded-md px-6 py-3.5 text-sm font-bold uppercase tracking-[0.14em] transition";

  return (
    <button
      type="button"
      onClick={share}
      className={`${base} ${
        dark
          ? "border-2 border-white/60 text-white hover:bg-white hover:text-deep"
          : "border-2 border-sea text-sea hover:bg-sea hover:text-white"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {copied ? "Link copied!" : "Share This"}
    </button>
  );
}

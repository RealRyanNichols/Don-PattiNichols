import { readFile } from "node:fs/promises";
import path from "node:path";

/**
 * THE FONT FOR EVERY SHARE CARD — read from disk, never the network.
 *
 * The original version fetched Lora from Google Fonts at render time. That
 * worked until 29 Jul 2026, when the fetch flaked during a git deploy's
 * build-time prerender of /what-a-mission-trip-costs/opengraph-image and
 * FAILED THE ENTIRE PRODUCTION BUILD — Satori crashes with
 * "Cannot read properties of undefined (reading 'split')" when it has no
 * font to draw text with.
 *
 * A share card must never be able to take the site down. So the .ttf lives
 * in the repo (assets/fonts/Lora-Bold.ttf — OFL licensed, committing it is
 * explicitly allowed) and is read off disk via process.cwd().
 *
 * NOT import.meta.url: after Next compiles this file into .next/server the
 * URL resolves relative to the compiled chunk and the read fails during
 * build-time prerender — which is exactly the failure this file exists to
 * prevent. process.cwd() is the project root at build time and /var/task at
 * runtime; next.config.mjs pins assets/fonts into the traced output so the
 * file exists in both.
 */
let cached: ArrayBuffer | null = null;

export async function loraBold(): Promise<ArrayBuffer | null> {
  if (cached) return cached;
  try {
    const buf = await readFile(
      path.join(process.cwd(), "assets", "fonts", "Lora-Bold.ttf"),
    );
    cached = buf.buffer.slice(
      buf.byteOffset,
      buf.byteOffset + buf.byteLength,
    ) as ArrayBuffer;
    return cached;
  } catch {
    // Should be impossible with a bundled file — but a card in the fallback
    // sans-serif still beats a failed render.
    return null;
  }
}

/** ImageResponse options fragment: Lora if we have it, safe default if not. */
export function ogFonts(lora: ArrayBuffer | null) {
  return lora
    ? [{ name: "Lora", data: lora, style: "normal" as const, weight: 700 as const }]
    : undefined;
}

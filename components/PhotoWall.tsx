"use client";

import { useCallback, useEffect, useState } from "react";
import { photo, photoSrcSet, LIGHTBOX_WIDTH } from "@/content/albums";
import { photoAlt, photoCaption } from "@/content/captions";
import { site } from "@/lib/site";
import { track } from "@/lib/track";

/**
 * PHOTO WALL — an editorial mosaic, not a uniform grid.
 *
 * Tile sizes follow a fixed repeating rhythm (large / wide / tall / small) so
 * the layout is deterministic between server and client, never random. Photos
 * load lazily and are requested at a width that matches the tile they land in,
 * so a thumbnail never pulls a full-size file — and each tile carries a srcset
 * so a retina or 4K screen gets a sharper rendition without costing a phone
 * anything.
 *
 * Click any photo to open the lightbox at the largest rendition the CDN will
 * serve; arrow keys and swipe move through the album. Photographs with a
 * verified caption (content/captions.ts) show it under the picture and use it
 * as alt text. The rest are described honestly as "photograph N".
 */

const RHYTHM = [
  "col-span-2 row-span-2", // large
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-2", // tall
  "col-span-2 row-span-1", // wide
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-1 row-span-1",
  "col-span-2 row-span-2", // large
  "col-span-1 row-span-1",
  "col-span-1 row-span-2", // tall
  "col-span-1 row-span-1",
];

/** Bigger tiles ask the CDN for a bigger file. */
function widthFor(span: string) {
  if (span.includes("col-span-2") && span.includes("row-span-2")) return 900;
  if (span.includes("col-span-2") || span.includes("row-span-2")) return 700;
  return 500;
}

export default function PhotoWall({
  ids,
  albumTitle,
  albumPath,
  initialCount = 24,
}: {
  ids: string[];
  albumTitle: string;
  /** Path of the page this wall lives on, for per-photo share links. */
  albumPath?: string;
  initialCount?: number;
}) {
  const [shown, setShown] = useState(Math.min(initialCount, ids.length));
  const [open, setOpen] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [touchX, setTouchX] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? null : (i + delta + ids.length) % ids.length)),
    [ids.length],
  );

  // Deep link: /albums/malawi#photo-12 opens the twelfth picture.
  useEffect(() => {
    const m = window.location.hash.match(/^#photo-(\d+)$/);
    if (m) {
      const n = Number(m[1]) - 1;
      if (n >= 0 && n < ids.length) {
        setShown((s) => Math.max(s, n + 1));
        setOpen(n);
      }
    }
  }, [ids.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  async function sharePhoto(i: number) {
    const url = `${site.url}${albumPath ?? ""}#photo-${i + 1}`;
    const title = photoCaption(ids[i]) ?? `${albumTitle} — photograph ${i + 1}`;
    track("share_click", { path: `${albumPath ?? ""}#photo-${i + 1}` });
    try {
      if (navigator.share) {
        await navigator.share({ title, text: `${title} — Don & Patti Nichols`, url });
        return;
      }
    } catch {
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked — nothing to do.
    }
  }

  return (
    <>
      <div className="grid auto-rows-[110px] grid-cols-2 gap-2 sm:auto-rows-[150px] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[170px] lg:grid-cols-6">
        {ids.slice(0, shown).map((id, i) => {
          const span = RHYTHM[i % RHYTHM.length];
          const w = widthFor(span);
          const cap = photoCaption(id);
          return (
            <button
              key={id}
              type="button"
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden rounded-lg bg-sand-dark ring-1 ring-ink/5 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-gold ${span}`}
              aria-label={`View photo ${i + 1} of ${ids.length} from ${albumTitle}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo(id, w)}
                srcSet={photoSrcSet(id, [w, w * 2])}
                sizes={`${Math.round(w / 2)}px`}
                alt={photoAlt(id, albumTitle, i)}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-0 bg-deep/0 transition group-hover:bg-deep/15" />
              {cap && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-deep/90 to-deep/0 px-2.5 pb-2 pt-6 text-left text-[11px] leading-snug text-white opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100 sm:text-xs">
                  {cap}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {shown < ids.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => Math.min(n + 36, ids.length))}
            className="btn-outline"
          >
            Show more photographs
          </button>
          <p className="mt-3 text-sm text-ink/55">
            Showing {shown} of {ids.length}
          </p>
        </div>
      )}

      {open !== null && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-deep/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${albumTitle} photo viewer`}
          onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX === null) return;
            const dx = e.changedTouches[0].clientX - touchX;
            if (Math.abs(dx) > 48) step(dx < 0 ? 1 : -1);
            setTouchX(null);
          }}
        >
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white/80 sm:px-6">
            <p className="min-w-0 truncate font-serif text-sm sm:text-base">
              {albumTitle}
              <span className="ml-3 text-white/50">
                {open + 1} / {ids.length}
              </span>
            </p>
            <div className="flex shrink-0 items-center gap-1">
              <a
                href={photo(ids[open], 4000)}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Open full-size photograph"
                title="Open full size"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M14 4h6v6M20 4l-8 8M10 20H4v-6M4 20l8-8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
              <button
                type="button"
                onClick={() => sharePhoto(open)}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Share this photograph"
                title={copied ? "Link copied" : "Share"}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={close}
                className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Close viewer"
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 pb-2 sm:px-16">
            <button
              type="button"
              onClick={() => step(-1)}
              className="absolute left-1 z-10 rounded-full bg-black/30 p-3 text-white transition hover:bg-black/60 sm:left-4"
              aria-label="Previous photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M15 5l-7 7 7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={ids[open]}
              src={photo(ids[open], LIGHTBOX_WIDTH)}
              srcSet={photoSrcSet(ids[open], [1200, 1600, 2000, LIGHTBOX_WIDTH])}
              sizes="100vw"
              alt={photoAlt(ids[open], albumTitle, open)}
              className="max-h-full max-w-full rounded-lg object-contain shadow-2xl"
            />

            <button
              type="button"
              onClick={() => step(1)}
              className="absolute right-1 z-10 rounded-full bg-black/30 p-3 text-white transition hover:bg-black/60 sm:right-4"
              aria-label="Next photo"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M9 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="safe-bottom px-4 pb-4 pt-2 text-center sm:px-16">
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
              {photoCaption(ids[open]) ?? (
                <span className="text-white/45">
                  {albumTitle} — photograph {open + 1}. Photographed by Don &amp; Patti Nichols.
                </span>
              )}
            </p>
            {copied && (
              <p className="mt-1 text-xs font-semibold text-gold">Link copied</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

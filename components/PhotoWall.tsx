"use client";

import { useCallback, useEffect, useState } from "react";
import { photo } from "@/content/albums";

/**
 * PHOTO WALL — an editorial mosaic, not a uniform grid.
 *
 * Tile sizes follow a fixed repeating rhythm (large / wide / tall / small) so
 * the layout is deterministic between server and client, never random. Photos
 * load lazily and are requested at a width that matches the tile they land in,
 * so a thumbnail never pulls a full-size file.
 *
 * Click any photo to open the full-resolution lightbox; arrow keys and swipe
 * move through the album.
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
  initialCount = 24,
}: {
  ids: string[];
  albumTitle: string;
  initialCount?: number;
}) {
  const [shown, setShown] = useState(Math.min(initialCount, ids.length));
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (delta: number) =>
      setOpen((i) => (i === null ? null : (i + delta + ids.length) % ids.length)),
    [ids.length],
  );

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

  return (
    <>
      <div className="grid auto-rows-[110px] grid-cols-2 gap-2 sm:auto-rows-[150px] sm:grid-cols-4 sm:gap-3 lg:auto-rows-[170px] lg:grid-cols-6">
        {ids.slice(0, shown).map((id, i) => {
          const span = RHYTHM[i % RHYTHM.length];
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
                src={photo(id, widthFor(span))}
                alt={`${albumTitle} — photograph ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
              />
              <span className="pointer-events-none absolute inset-0 bg-deep/0 transition group-hover:bg-deep/15" />
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
        >
          <div className="flex items-center justify-between px-4 py-3 text-white/80 sm:px-6">
            <p className="font-serif text-sm sm:text-base">
              {albumTitle}
              <span className="ml-3 text-white/50">
                {open + 1} / {ids.length}
              </span>
            </p>
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

          <div className="relative flex flex-1 items-center justify-center px-2 pb-6 sm:px-16">
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
              src={photo(ids[open], 2000)}
              alt={`${albumTitle} — photograph ${open + 1}`}
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
        </div>
      )}
    </>
  );
}

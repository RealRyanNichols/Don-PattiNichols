"use client";

import { useState } from "react";
import { storageImage } from "@/lib/storageImage";

/**
 * The photographs under a story.
 *
 * Don attached 56 pictures to his first post. Shown all at once they made a
 * wall roughly nine screens tall between his last sentence and everything that
 * came after it — the giving card, the follow box, the album link. Most
 * readers would simply have stopped scrolling.
 *
 * So: twelve to begin with, and a button that opens the rest. Nothing is
 * hidden — the count is on the button, in his own photographs' honest number —
 * and once opened it stays open. This is not a paywall or a tease; it is the
 * difference between a page someone finishes and a page someone abandons.
 */
export default function PostPhotos({
  urls,
  captions,
  title,
}: {
  urls: string[];
  captions: (string | null)[];
  title: string;
}) {
  const INITIAL = 12;
  const [showAll, setShowAll] = useState(false);
  if (!urls.length) return null;

  const shown = showAll ? urls : urls.slice(0, INITIAL);
  const hidden = urls.length - shown.length;
  const cap = (i: number) => (captions[i] ?? "").trim();

  return (
    <div className="mt-8">
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3">
        {shown.map((u, i) => {
          const c = cap(i);
          return (
            <figure key={u}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={storageImage(u, 400)}
                alt={c || `${title} — photograph ${i + 1}`}
                width={400}
                height={400}
                loading="lazy"
                decoding="async"
                className="aspect-square w-full rounded-lg bg-sand-dark object-cover"
              />
              {c && (
                <figcaption className="mt-1.5 text-[13px] leading-snug text-ink/60">
                  {c}
                </figcaption>
              )}
            </figure>
          );
        })}
      </div>

      {hidden > 0 && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="btn-outline mt-6 w-full sm:w-auto"
        >
          Show all {urls.length} photographs
        </button>
      )}
    </div>
  );
}

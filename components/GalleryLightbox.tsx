"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Photo = { src: string; alt: string; caption?: string };

type Props = {
  photos: Photo[];
  /** Classes for the thumbnail grid wrapper. */
  gridClassName: string;
  /** Classes for each thumbnail image. */
  imgClassName: string;
};

/**
 * The reader-facing line for a photo. Falls back to the alt text so a photo
 * without a written caption still says something rather than nothing.
 */
const captionOf = (photo: Photo) => photo.caption ?? photo.alt;

/**
 * Tap-to-enlarge photo gallery built on the native <dialog> element —
 * focus trapping, Esc-to-close, and backdrop come free from the platform.
 * Arrow keys and on-screen buttons move between photos.
 */
export default function GalleryLightbox({ photos, gridClassName, imgClassName }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const close = useCallback(() => {
    dialogRef.current?.close();
  }, []);

  const step = useCallback(
    (delta: number) => {
      setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length));
    },
    [photos.length],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!dialogRef.current?.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step]);

  const current = index === null ? null : photos[index];

  return (
    <>
      <div className={gridClassName}>
        {photos.map((photo, i) => (
          <figure key={photo.src} className="flex flex-col">
            <button
              type="button"
              onClick={() => open(i)}
              aria-label={`View larger: ${photo.alt}`}
              className="group/thumb relative overflow-hidden rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sea"
            >
              <img
                src={photo.src}
                alt={photo.alt}
                className={`${imgClassName} transition-transform duration-300 group-hover/thumb:scale-[1.03]`}
                loading="lazy"
              />
              <span
                aria-hidden="true"
                className="absolute inset-0 bg-deep/0 transition-colors duration-300 group-hover/thumb:bg-deep/10"
              />
            </button>
            {/* Captions are real page content — they are what a reader and a
                search engine actually get to read about the photograph. */}
            <figcaption className="mt-2 text-xs leading-relaxed text-ink/70">
              {captionOf(photo)}
            </figcaption>
          </figure>
        ))}
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setIndex(null)}
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        className="m-auto w-full max-w-4xl bg-transparent p-4 backdrop:bg-deep/90 backdrop:backdrop-blur-sm"
        aria-label="Photo viewer"
      >
        {current ? (
          <div className="flex flex-col items-center">
            <img
              src={current.src}
              alt={current.alt}
              className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-md"
            />
            <p className="mt-3 max-w-xl text-center text-sm italic text-white/85">
              {captionOf(current)}
            </p>
            <div className="mt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Previous photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
              >
                ←
              </button>
              <span className="text-sm font-semibold tabular-nums text-white/80">
                {index! + 1} / {photos.length}
              </span>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Next photo"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-xl text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
              >
                →
              </button>
              <button
                type="button"
                onClick={close}
                className="ml-4 rounded-full bg-white/10 px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition-colors hover:bg-white/20"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}

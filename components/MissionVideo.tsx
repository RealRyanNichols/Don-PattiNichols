"use client";

import { useRef, useState } from "react";
import { videoMediaBase, type MissionVideo as Film } from "@/content/videos";

/** Load the film only when a visitor chooses to watch. */
export default function MissionVideo({
  video,
  className = "",
}: {
  video: Film;
  className?: string;
}) {
  const player = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState(false);

  async function play() {
    setError(false);
    setStarted(true);
    try {
      await player.current?.play();
    } catch {
      setError(true);
    }
  }

  return (
    <div
      className={`relative overflow-hidden rounded-2xl bg-black shadow-xl ring-1 ring-white/20 ${className}`}
    >
      <video
        ref={player}
        controls={started}
        controlsList="nodownload"
        playsInline
        preload="none"
        width={720}
        height={1280}
        poster={`${videoMediaBase}/${video.poster}`}
        aria-label={video.title}
        onPlay={() => {
          setStarted(true);
          setError(false);
        }}
        onError={() => setError(true)}
        className="h-full w-full object-contain"
      >
        <source src={`${videoMediaBase}/${video.playback}`} type="video/mp4" />
        <track
          src={`${videoMediaBase}/${video.captions}`}
          kind="captions"
          srcLang="en"
          label="English"
          default
        />
        Your browser cannot play this video. Try opening this page in another
        browser.
      </video>
      {!started && (
        <button
          type="button"
          onClick={play}
          aria-label={`Play ${video.title}`}
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/10 text-white transition hover:bg-black/25 focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-4 focus-visible:outline-gold"
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full bg-gold text-deep shadow-lg"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="rounded-full bg-deep/90 px-4 py-2 text-sm font-bold">
            Watch Don’s story
          </span>
        </button>
      )}
      {error && (
        <p
          role="status"
          className="absolute left-3 right-3 top-3 rounded-lg bg-white p-3 text-sm text-ink"
        >
          The video couldn’t start.{" "}
          <button
            type="button"
            onClick={play}
            className="min-h-11 font-bold text-sea underline"
          >
            Try again
          </button>
        </p>
      )}
    </div>
  );
}

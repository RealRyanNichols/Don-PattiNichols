"use client";

import { useEffect, useId, useRef, useState } from "react";
import {
  copyVideoShareText,
  isShareCancelled,
  isVideoShareId,
  videoShareLinks,
  videoTextMessageUrl,
} from "@/lib/videoSharing";

type Props = { id: string; title: string; dark?: boolean };
type CopyFallback = { label: string; value: string } | null;

export default function VideoShareActions({ id, title, dark = false }: Props) {
  const sectionId = useId();
  const fallbackRef = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState("");
  const [sharing, setSharing] = useState(false);
  const [embedOpen, setEmbedOpen] = useState(false);
  const [fallback, setFallback] = useState<CopyFallback>(null);

  useEffect(() => {
    if (fallback) {
      fallbackRef.current?.focus();
      fallbackRef.current?.select();
    }
  }, [fallback]);

  if (!isVideoShareId(id)) return null;

  const links = videoShareLinks(id, title);
  const button = `inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg border px-3 py-2 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 ${
    dark
      ? "border-white/40 text-white hover:bg-white/10 focus-visible:outline-gold"
      : "border-sea/30 bg-white text-deep hover:bg-sand-dark focus-visible:outline-sea"
  }`;
  const muted = dark ? "text-white/75" : "text-ink/70";

  function offerCopy(label: string, value: string, message: string) {
    setFallback({ label, value });
    setStatus(message);
  }

  async function copy(value: string, label: string) {
    setStatus("");
    const copied = await copyVideoShareText(
      value,
      navigator.clipboard
        ? (text) => navigator.clipboard.writeText(text)
        : undefined,
    );
    if (copied) {
      setFallback(null);
      setStatus(`${label} copied.`);
    } else {
      offerCopy(label, value, "Select and copy the text below.");
    }
  }

  async function share() {
    setStatus("");
    if (typeof navigator.share !== "function") {
      offerCopy(
        "Video link",
        links.watchUrl,
        "Copy this link into Messenger, a group text, or another app.",
      );
      return;
    }
    setSharing(true);
    try {
      await navigator.share({
        title,
        text: links.text,
        url: links.watchUrl,
      });
      setStatus("Share menu opened.");
    } catch (error) {
      if (!isShareCancelled(error)) {
        offerCopy(
          "Video link",
          links.watchUrl,
          "Sharing could not open. Copy this link into your favorite app.",
        );
      }
    } finally {
      setSharing(false);
    }
  }

  return (
    <div role="group" aria-label={`Share ${title}`} className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={share}
          disabled={sharing}
          className={`${button} disabled:opacity-60`}
        >
          {sharing ? "Opening share menu…" : "Share"}
        </button>
        <a
          href={links.facebook}
          target="_blank"
          rel="noopener noreferrer"
          className={button}
          aria-label={`Share ${title} on Facebook (opens a new tab)`}
        >
          Facebook
        </a>
        <a
          href={links.x}
          target="_blank"
          rel="noopener noreferrer"
          className={button}
          aria-label={`Share ${title} on X (opens a new tab)`}
        >
          X
        </a>
        <a
          href={videoTextMessageUrl(id, title)}
          className={button}
          onClick={(event) => {
            const appleDevice =
              /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
              (navigator.platform === "MacIntel" &&
                navigator.maxTouchPoints > 1);
            event.currentTarget.href = videoTextMessageUrl(
              id,
              title,
              appleDevice,
            );
          }}
        >
          Text message
        </a>
        <button
          type="button"
          onClick={() => copy(links.watchUrl, "Video link")}
          className={button}
        >
          Copy link
        </button>
        <button
          type="button"
          aria-expanded={embedOpen}
          aria-controls={`${sectionId}-embed`}
          onClick={() => setEmbedOpen((open) => !open)}
          className={button}
        >
          Embed on your website
        </button>
      </div>
      <p className={`text-xs leading-relaxed ${muted}`}>
        Use Share to choose Messenger or other apps available on your phone.
      </p>
      {embedOpen && (
        <div
          id={`${sectionId}-embed`}
          className={`space-y-3 rounded-xl border p-4 ${dark ? "border-white/25" : "border-sea/20"}`}
        >
          <label
            htmlFor={`${sectionId}-embed-code`}
            className="block text-sm font-semibold"
          >
            Add this video to your website
          </label>
          <p className={`text-sm ${muted}`}>
            Copy this code into your website’s embed block.
          </p>
          <textarea
            id={`${sectionId}-embed-code`}
            readOnly
            value={links.embedCode}
            rows={4}
            onFocus={(event) => event.currentTarget.select()}
            className="block w-full resize-y rounded-lg border border-sea/30 bg-white p-3 font-mono text-xs leading-relaxed text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
          />
          <button
            type="button"
            onClick={() => copy(links.embedCode, "Embed code")}
            className={button}
          >
            Copy embed code
          </button>
        </div>
      )}
      {fallback && (
        <div className="space-y-2">
          <label
            htmlFor={`${sectionId}-copy-fallback`}
            className="block text-sm font-semibold"
          >
            {fallback.label}
          </label>
          <textarea
            ref={fallbackRef}
            id={`${sectionId}-copy-fallback`}
            readOnly
            value={fallback.value}
            rows={fallback.label === "Embed code" ? 4 : 2}
            onFocus={(event) => event.currentTarget.select()}
            className="block w-full resize-y rounded-lg border border-sea/30 bg-white p-3 text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
          />
          <button
            type="button"
            className={button}
            onClick={() => {
              fallbackRef.current?.focus();
              fallbackRef.current?.select();
            }}
          >
            Select all
          </button>
        </div>
      )}
      <p role="status" aria-live="polite" className={`text-sm ${muted}`}>
        {status}
      </p>
    </div>
  );
}

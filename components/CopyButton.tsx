"use client";

import { useState } from "react";
import { track } from "@/lib/track";

/** Copies a block of text to the clipboard and says so. */
export default function CopyButton({
  text,
  label = "Copy",
  what = "text",
  className = "btn-outline !px-4 !py-2 !text-xs",
}: {
  text: string;
  label?: string;
  what?: string;
  className?: string;
}) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className={className}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setDone(true);
          track("copy_click", { what });
          setTimeout(() => setDone(false), 2000);
        } catch {
          // Clipboard blocked — the text is still on screen to select.
        }
      }}
    >
      {done ? "Copied" : label}
    </button>
  );
}

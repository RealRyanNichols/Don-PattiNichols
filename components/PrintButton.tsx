"use client";

import { track } from "@/lib/track";

/** Opens the browser's print dialog; the print stylesheet does the rest. */
export default function PrintButton({
  label = "Print this page",
  className = "btn-primary",
  what = "page",
}: {
  label?: string;
  className?: string;
  what?: string;
}) {
  return (
    <button
      type="button"
      className={`${className} print:hidden`}
      onClick={() => {
        track("print_click", { what });
        window.print();
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v7H6z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {label}
    </button>
  );
}

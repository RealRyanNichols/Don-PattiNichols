import type { SupplyIconKind } from "@/content/supplies";

/** Line icons for the supply drive items — 24×24 stroke SVGs. */
export default function SupplyIcon({
  kind,
  className,
}: {
  kind: SupplyIconKind;
  className?: string;
}) {
  const stroke = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  } as const;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      {kind === "bible" && (
        <>
          <path {...stroke} d="M5 4a2 2 0 0 1 2-2h12v18H7a2 2 0 0 0-2 2V4Z" />
          <path {...stroke} d="M12 6v6M9.5 8.5h5" />
        </>
      )}
      {kind === "kit" && (
        <>
          <rect {...stroke} x="3" y="8" width="18" height="12" rx="2" />
          <path {...stroke} d="M9 8V6a3 3 0 0 1 6 0v2M12 11v5M9.5 13.5h5" />
        </>
      )}
      {kind === "glasses" && (
        <>
          <circle {...stroke} cx="7" cy="14" r="3.5" />
          <circle {...stroke} cx="17" cy="14" r="3.5" />
          <path {...stroke} d="M10.5 14h3M3.5 14 2 9M20.5 14 22 9" />
        </>
      )}
      {kind === "sun" && (
        <>
          <circle {...stroke} cx="12" cy="12" r="4" />
          <path
            {...stroke}
            d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M18.4 5.6 17 7M7 17l-1.4 1.4"
          />
        </>
      )}
      {kind === "trunk" && (
        <>
          <rect {...stroke} x="3" y="7" width="18" height="13" rx="2" />
          <path {...stroke} d="M3 12h18M9 7V5h6v2M9 12v2M15 12v2" />
        </>
      )}
      {kind === "plane" && (
        <path
          {...stroke}
          d="M10.5 13.5 3 11l1.5-2 6.5 1L16 4.5 18.5 5l-3 6.5 5 1.5-1 2-6-.5-2.5 5H9l1.5-6Z"
        />
      )}
      {kind === "gift" && (
        <>
          <rect {...stroke} x="4" y="10" width="16" height="10" rx="1.5" />
          <path
            {...stroke}
            d="M4 10h16M12 10v10M12 10c-4 0-5-2-5-3.5A1.8 1.8 0 0 1 9 5c2 0 3 2.5 3 5 0-2.5 1-5 3-5a1.8 1.8 0 0 1 2 1.5C17 8 16 10 12 10Z"
          />
        </>
      )}
      {kind === "tract" && (
        <>
          <path {...stroke} d="M4 5h9v15H4zM13 5h7v15h-7z" />
          <path {...stroke} d="M7 9h3M7 12h3M16 9h1.5" />
        </>
      )}
      {kind === "shield" && (
        <>
          <path {...stroke} d="M12 3 5 6v6c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V6l-7-3Z" />
          <path {...stroke} d="M12 8v5M9.5 10.5h5" />
        </>
      )}
      {kind === "person" && (
        <>
          <circle {...stroke} cx="12" cy="8" r="3.5" />
          <path {...stroke} d="M5 20c1-3.5 3.7-5.5 7-5.5s6 2 7 5.5" />
        </>
      )}
    </svg>
  );
}

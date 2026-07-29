"use client";

import Link from "next/link";
import { track } from "@/lib/track";

/**
 * Tracked giving CTA. Every give-button click reports where it came from.
 * If an external payment URL exists it goes straight there; otherwise to /give.
 */
export default function GiveLink({
  href = "/give",
  location,
  fund,
  className = "btn-give",
  children,
}: {
  href?: string;
  location: string;
  fund?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const external = href.startsWith("http");
  const props = {
    className,
    onClick: () =>
      track("give_click", { location, ...(fund ? { fund } : {}), target: href }),
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}

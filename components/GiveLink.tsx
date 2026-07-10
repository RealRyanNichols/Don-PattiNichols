"use client";

import Link from "next/link";
import { track } from "@/lib/track";

type Props = {
  /** Destination — internal path or external (PayPal) URL. */
  href?: string;
  /** Where on the site this button lives, for click tracking. */
  location: string;
  /** Optional designated fund key, for click tracking. */
  fund?: string;
  className?: string;
  children: React.ReactNode;
};

export default function GiveLink({
  href = "/give",
  location,
  fund,
  className = "btn-give",
  children,
}: Props) {
  const external = href.startsWith("http");
  const shared = {
    className,
    onClick: () => track("give_click", { location, ...(fund ? { fund } : {}), target: href }),
  };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...shared}>
      {children}
    </Link>
  );
}

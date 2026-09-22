"use client";

import Link from "next/link";
import { track } from "@/lib/track";
import { recordGiftIntent } from "@/lib/giftIntent";

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
    onClick: () => {
      track("give_click", {
        location,
        ...(fund ? { fund } : {}),
        target: href,
      });
      // Opening /give is navigation, not checkout intent. Record only a click
      // that actually leaves for our PayPal donation flow, without awaiting it.
      try {
        const checkout = new URL(href);
        if (
          checkout.protocol === "https:" &&
          ["paypal.com", "www.paypal.com"].includes(checkout.hostname) &&
          checkout.pathname.startsWith("/donate")
        ) {
          const amount = Number(checkout.searchParams.get("amount"));
          recordGiftIntent({
            itemId: fund ?? "general",
            itemName:
              checkout.searchParams.get("item_name") ?? "Mission support",
            ...(checkout.searchParams.get("currency_code") === "USD" &&
            amount > 0 &&
            Number.isFinite(amount)
              ? { amountUsd: amount }
              : {}),
          });
        }
      } catch {
        // Internal links and analytics failures must never prevent navigation.
      }
    },
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

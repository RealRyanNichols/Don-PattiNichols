"use client";

import { track } from "@/lib/track";

export default function MerchLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn-give mt-6"
      onClick={() =>
        track("merch_shop_click", { location: "store", target: href })
      }
    >
      Shop merchandise →
    </a>
  );
}

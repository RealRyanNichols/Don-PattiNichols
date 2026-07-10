"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { track } from "@/lib/track";

export default function Nav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-sand/95 backdrop-blur">
      <div className="container-content flex h-16 items-center justify-between gap-4">
        <Link
          href="/"
          className="font-serif text-lg font-bold leading-tight text-ink sm:text-xl"
          onClick={() => setOpen(false)}
        >
          Don &amp; Patti Nichols
          <span className="block text-[11px] font-sans font-medium uppercase tracking-widest text-sea">
            Mission Work &amp; Ministry
          </span>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex">
          {site.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm font-medium transition-colors hover:text-sea ${
                pathname === item.href ? "text-sea" : "text-ink/80"
              }`}
              onClick={() => track("nav_click", { to: item.href, location: "header" })}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/give"
            className="btn-give !px-5 !py-2"
            data-track="give_click"
            onClick={() => track("give_click", { location: "header", from: pathname })}
          >
            Give
          </Link>
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center rounded-md text-ink lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <>
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-ink/10 bg-sand lg:hidden">
          <div className="container-content flex flex-col py-2">
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b border-ink/5 py-3.5 text-base font-medium ${
                  pathname === item.href ? "text-sea" : "text-ink/85"
                }`}
                onClick={() => {
                  setOpen(false);
                  track("nav_click", { to: item.href, location: "mobile_menu" });
                }}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/give"
              className="btn-give my-3"
              onClick={() => {
                setOpen(false);
                track("give_click", { location: "mobile_menu", from: pathname });
              }}
            >
              Give to the Mission
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

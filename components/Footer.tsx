"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";

export default function Footer() {
  const pathname = usePathname();

  // Hidden inside the admin area — see the note in Nav.tsx.
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-deep text-sand">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-serif text-xl font-bold">Don &amp; Patti Nichols</p>
          <p className="mt-1 text-sm text-sand/70">Mission Work &amp; Ministry</p>
          <p className="mt-4 font-serif italic leading-relaxed text-sand/90">
            &ldquo;{site.verse.text}&rdquo;
          </p>
          <p className="mt-1 text-sm font-semibold text-gold">{site.verse.reference}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-sand/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Partner</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/give" className="text-sand/85 hover:text-white">Give to the Mission</Link></li>
            <li><Link href="/sponsor" className="text-sand/85 hover:text-white">Fill the Trunks</Link></li>
            <li><Link href="/members" className="text-sand/85 hover:text-white">Mission Partners Hub</Link></li>
            <li><Link href="/thank-you" className="text-sand/85 hover:text-white">Thank You</Link></li>
            <li><Link href="/transparency" className="text-sand/85 hover:text-white">Open Book — Transparency</Link></li>
            <li><Link href="/admin" className="inline-flex items-center gap-1.5 font-semibold text-gold hover:text-white">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              Don &amp; Patti Sign In
            </Link></li>
            <li><Link href="/contact" className="text-sand/85 hover:text-white">Send a Prayer Request</Link></li>
            <li><Link href="/contact" className="text-sand/85 hover:text-white">Invite Don to Speak</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Follow</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link href="/blog" className="text-sand/85 hover:text-white">Read the Blog</Link></li>
            <li><Link href="/don" className="text-sand/85 hover:text-white">Don&rsquo;s Page</Link></li>
            <li><Link href="/patti" className="text-sand/85 hover:text-white">Patti&rsquo;s Page</Link></li>
            <li><Link href="/albums" className="text-sand/85 hover:text-white">Photo Albums</Link></li>
            <li><Link href="/store" className="text-sand/85 hover:text-white">The Store</Link></li>
            <li><Link href="/#newsletter" className="text-sand/85 hover:text-white">Email Updates</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/15">
        <div className="container-content flex flex-col items-center justify-between gap-3 py-6 text-xs text-sand/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Don &amp; Patti Nichols. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

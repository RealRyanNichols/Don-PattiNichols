import Link from "next/link";
import { site } from "@/lib/site";

const partner = [
  { label: "Give to the Mission", href: "/give" },
  { label: "Fill the Trunks", href: "/sponsor" },
  { label: "Mission Partners Hub", href: "/members" },
  { label: "Send a Prayer Request", href: "/contact" },
  { label: "Invite Don to Speak", href: "/contact" },
];

const follow = [
  { label: "Read the Blog", href: "/blog" },
  { label: "Don’s Page", href: "/don" },
  { label: "Patti’s Page", href: "/patti" },
  { label: "The Store", href: "/store" },
  { label: "Email Updates", href: "/#newsletter" },
];

export default function Footer() {
  return (
    <footer className="bg-deep text-sand">
      <div className="container-content grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 lg:col-span-1">
          <p className="font-serif text-xl font-bold">Don &amp; Patti Nichols</p>
          <p className="mt-1 text-sm text-sand/70">Mission Work &amp; Ministry</p>
          <p className="mt-4 font-serif italic leading-relaxed text-sand/90">
            &ldquo;
            {
              "Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit."
            }
            &rdquo;
          </p>
          <p className="mt-1 text-sm font-semibold text-gold">Matthew 28:19</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Explore</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {site.nav.map((item) => (
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
            {partner.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sand/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">Follow</p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {follow.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className="text-sand/85 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-sand/15">
        <div className="container-content flex flex-col items-center justify-between gap-3 py-6 text-xs text-sand/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Don &amp; Patti Nichols. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

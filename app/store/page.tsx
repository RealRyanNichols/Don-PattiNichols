import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/store` },
  title: "Store",
  description:
    "Books, materials, and mission merchandise from Don & Patti Nichols — every purchase supports the mission work in Belize.",
};

/** Placeholder product slots — replace with real products (name, price, image, Stripe link). */
const comingSoon = [
  { name: "Mission Merchandise", note: "Shirts and items that fund the trips" },
  { name: "Books & Teaching Materials", note: "From Don's preaching and teaching" },
  { name: "Sponsor-a-Kit Packs", note: "Buy a hygiene kit or Bible bundle as a gift" },
];

export default function StorePage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Every Purchase Funds the Mission
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">The Store</h1>
        </div>
      </section>

      <section className="container-content py-14">
        <div className="grid gap-6 md:grid-cols-3">
          {comingSoon.map((p) => (
            <div
              key={p.name}
              className="flex flex-col items-center rounded-xl border-2 border-dashed border-ink/15 bg-white p-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-dark font-serif text-2xl font-bold text-sea">
                ✝
              </div>
              <h2 className="mt-4 font-serif text-xl font-bold">{p.name}</h2>
              <p className="mt-2 text-sm text-ink/65">{p.note}</p>
              <p className="mt-4 rounded-full bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold-dark">
                Coming Soon
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-8 text-center">
          <h2 className="font-serif text-2xl font-bold">Be first to know when the store opens</h2>
          <div className="mx-auto mt-5 flex max-w-md justify-center">
            <NewsletterForm compact />
          </div>
          <p className="mt-6 text-ink/70">
            Want to support the mission today?{" "}
            <Link href="/give" className="font-semibold text-sea hover:underline">
              Give directly →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

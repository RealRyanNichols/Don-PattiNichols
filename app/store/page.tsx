import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = socialMetadata({
  title: "Store",
  description: "Books, materials, and mission merchandise from Don & Patti Nichols — every purchase supports the mission work in Belize.",
  path: "/store",
  eyebrow: "Every Purchase Funds the Mission",
  image: "/images/clinic-supplies-staged.jpg",
});

const comingSoon = [
  { title: "Mission Merchandise", blurb: "Shirts and items that fund the trips" },
  { title: "Books & Teaching Materials", blurb: "From Don's preaching and teaching" },
  { title: "Sponsor-a-Kit Packs", blurb: "Buy a hygiene kit or Bible bundle as a gift" },
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
          {comingSoon.map((item) => (
            <div
              key={item.title}
              className="flex flex-col items-center rounded-xl border-2 border-dashed border-ink/15 bg-white p-8 text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sand-dark font-serif text-2xl font-bold text-sea">
                {/* U+FE0E forces text presentation — bare ✝ becomes a purple emoji on iOS */}
                {"✝︎"}
              </div>
              <h2 className="mt-4 font-serif text-xl font-bold">{item.title}</h2>
              <p className="mt-2 text-sm text-ink/65">{item.blurb}</p>
              <p className="mt-4 rounded-full bg-gold/15 px-4 py-1 text-xs font-bold uppercase tracking-widest text-gold-dark">
                Coming Soon
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-8 text-center">
          <h2 className="font-serif text-2xl font-bold">Be first to know when the store opens</h2>
          <div className="mx-auto mt-5 flex max-w-md justify-center">
            <NewsletterForm />
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

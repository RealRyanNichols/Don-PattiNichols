import type { Metadata } from "next";
import Link from "next/link";
import GalleryLightbox from "@/components/GalleryLightbox";
import GiveLink from "@/components/GiveLink";
import { journeySteps } from "@/content/journey";
import { behindTheMissionGallery } from "@/lib/photos";

export const metadata: Metadata = {
  title: "Behind Every Mission Trip — The Preparation",
  description:
    "The mission begins long before the airplane takes off. See the months of purchasing, packing, inventorying, and customs preparation behind every Belize medical mission trip.",
};

// Don's exact wording — do not edit without his approval.
const intro = [
  "One of the biggest misconceptions about mission trips is that the work begins when the team lands in another country. In reality, the ministry starts months before departure.",
  "Before we ever board an airplane, months of preparation have already taken place. Hundreds of donated items are carefully purchased, sorted, inventoried, labeled, translated, packed, weighed, and documented for customs officials.",
  "Every trunk is packed by hand. Every supply is counted. Every Bible is purchased through donations. Every hygiene kit is assembled one item at a time. Every pair of reading glasses is sorted by prescription. Every document is translated. Every customs form is prepared. Every trunk is inventoried.",
  "By the time our team arrives in Belize, hundreds of volunteer hours have already been invested before the first patient walks into the clinic. This preparation allows us to focus on serving people instead of worrying about logistics.",
];

const trunkContents = [
  "Medical clinic supplies",
  "New Testaments",
  "Reading glasses",
  "Hygiene kits",
  "Gospel literature",
  "Gifts for village pastors and their wives",
  "Children's items",
  "Evangelism materials",
];

// Don's exact wording — do not edit without his approval.
const accountable = [
  "Every trunk carries numbered identification, owner information, a full inventory sheet, a Spanish translation, and a customs explanation — so officials know exactly what is inside and exactly why it is coming.",
  "The inventory sheets do not say vague things like “medical supplies.” They list it out: New Testaments, reading glasses, sewing kits, hygiene supplies — item by item. Every item has been donated through the generosity of faithful supporters, nothing is for sale, and everything is given to villagers completely free.",
  "On our most recent trip, the team traveled with nine trunks, each weighing around fifty pounds — nearly 450 pounds of ministry supplies moving through airports, airline check-in, and Belize customs to reach remote villages.",
];

export default function BehindTheMissionPage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Transparency &amp; Preparation
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">
            Behind Every Mission Trip
          </h1>
          <p className="mt-4 max-w-2xl font-serif text-xl italic text-white/85">
            The mission begins long before the airplane takes off.
          </p>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {intro.map((text) => (
            <p key={text.slice(0, 32)}>{text}</p>
          ))}
        </div>

        <GalleryLightbox
          photos={behindTheMissionGallery}
          gridClassName="mt-10 grid grid-cols-2 gap-3"
          imgClassName="aspect-[4/3] w-full rounded-xl object-cover shadow-sm"
        />
        <p className="mt-3 text-center text-sm italic text-ink/60">
          The trunks, the supplies, the flight, the setup — months of preparation in four frames.
        </p>

        <blockquote className="my-10 rounded-2xl bg-deep p-8 text-center">
          <p className="font-serif text-2xl font-bold italic text-gold sm:text-3xl">
            &ldquo;All of this will be GIVEN FREE OF CHARGE.&rdquo;
          </p>
          <cite className="mt-3 block text-sm not-italic text-white/70">
            — printed on every trunk inventory sheet that travels with the team into Belize
          </cite>
        </blockquote>

        <div className="rounded-xl border border-ink/10 bg-white p-7 shadow-sm">
          <h2 className="font-serif text-2xl font-bold">What Rides in the Trunks</h2>
          <p className="mt-2 text-ink/75">
            Each trunk contains supplies designated for specific ministries, including:
          </p>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {trunkContents.map((item) => (
              <li key={item} className="flex items-start gap-2 text-ink/80">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-gold" />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="font-serif text-2xl font-bold">Organized and Accountable</h2>
          <div className="prose-mission mt-4">
            {accountable.map((text) => (
              <p key={text.slice(0, 32)}>{text}</p>
            ))}
          </div>
        </div>

        <div className="mt-8 rounded-xl bg-sand-dark p-7">
          <h2 className="font-serif text-2xl font-bold">What&apos;s in a Hygiene Kit?</h2>
          <div className="prose-mission mt-4">
            <p>A towel. A sewing kit. Toothpaste and a toothbrush. A hair tie. Lip balm. A Gospel booklet.</p>
            <p>
              It isn&apos;t expensive. But to a family with limited access to these everyday items,
              it is a meaningful gift — a practical reminder that someone they have never met cared
              enough to help, and an open door to conversation, prayer, and the love of Christ.
            </p>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold">The Story of Every Mission</h2>
          <ol className="mt-6 space-y-4">
            {journeySteps.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sea font-serif font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <Link href={step.href} className="font-serif text-lg font-bold hover:text-sea">
                    {step.title}
                  </Link>
                  <p className="text-ink/70">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-12 flex flex-col gap-3 sm:flex-row">
          <GiveLink location="behind_page" className="btn-give">
            Help Fill the Trunks
          </GiveLink>
          <Link href="/belize" className="btn-outline">
            The Belize Mission
          </Link>
        </div>
      </section>
    </>
  );
}

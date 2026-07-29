import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { mission } from "@/content/mission";
import GiveLink from "@/components/GiveLink";

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/mission` },
  title: "Our Mission",
  description:
    "Our mission is to share the love of Jesus Christ by meeting both the physical and spiritual needs of the people of Belize — free medical clinics, pharmacy services, vision care, and personal evangelism.",
};

export default function MissionPage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Don &amp; Patti Nichols
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">{mission.title}</h1>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {mission.paragraphs.map((p, i) => (
            <p key={p.slice(0, 32)} className={i === 0 ? "dropcap" : undefined}>
              {p}
            </p>
          ))}
        </div>

        <div className="divider-cross" aria-hidden>
          ✝
        </div>

        <div className="rounded-2xl bg-sand-dark p-8">
          <h2 className="font-serif text-2xl font-bold">Be part of this mission</h2>
          <p className="mt-2 text-ink/75">
            Every gift sends medical care, Bibles, and the hope of Christ into the villages of
            Belize.
          </p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="mission_page" className="btn-give">
              Give to the Mission
            </GiveLink>
            <Link href="/belize" className="btn-outline">
              Why Belize?
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

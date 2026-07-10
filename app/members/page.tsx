import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import PostCard from "@/components/PostCard";
import VerseRotator from "@/components/VerseRotator";
import { getAllPosts } from "@/lib/posts-live";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Mission Partners Hub",
  description:
    "Join the mission family: every trip update, photo drop, and new post from Don & Patti — plus first word when trip dates and needs are announced.",
};

const perks = [
  {
    title: "Every update, first",
    text: "Trip announcements, field reports, and photo drops land in your inbox before anywhere else.",
  },
  {
    title: "See what your gift did",
    text: "When the team returns, partners get the full recap — patients served, Bibles given, stories from the villages.",
  },
  {
    title: "Prayer that's specific",
    text: "Real prayer needs from the field, while the team is on the ground — not after the fact.",
  },
];

export const revalidate = 300;

export default async function MembersPage() {
  const posts = await getAllPosts();
  return (
    <>
      <section className="relative overflow-hidden bg-deep py-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 20% -10%, rgba(14,107,112,0.6), transparent 60%)",
          }}
        />
        <div className="container-content relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            For Donors, Partners &amp; Prayer Warriors
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">Mission Partners Hub</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            This mission runs on people who pray, give, and follow along. Join the partner list and
            you become part of every trip — from the first trunk packed to the last patient seen.
          </p>
          <div className="mt-6 max-w-2xl">
            <VerseRotator />
          </div>
        </div>
      </section>

      <section className="container-content py-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div className="rounded-2xl border border-ink/10 bg-white p-7 shadow-sm sm:p-8">
            <p className="eyebrow">Join the Partner List</p>
            <h2 className="h-display mt-2 text-2xl sm:text-3xl">
              Name, email, and a phone if you want texts
            </h2>
            <p className="mb-6 mt-3 text-ink/70">
              Free, no spam, unsubscribe anytime. This is how the mission stays connected to the
              people who carry it.
            </p>
            <NewsletterForm full />
          </div>

          <div className="space-y-4">
            {perks.map((perk) => (
              <div
                key={perk.title}
                className="rounded-xl border border-ink/10 border-l-4 border-l-gold bg-white p-5 shadow-sm"
              >
                <h3 className="font-serif text-lg font-bold">{perk.title}</h3>
                <p className="mt-1 text-sm text-ink/70">{perk.text}</p>
              </div>
            ))}
            <div className="rounded-xl bg-sand-dark p-5">
              <h3 className="font-serif text-lg font-bold">Coming to this hub</h3>
              <p className="mt-1 text-sm text-ink/70">
                Partner accounts with your own giving history and sponsorship record — arriving
                when online giving opens. Your gifts will show up right here, item by item.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 rounded-2xl bg-deep p-7 text-white sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Next Trip · {site.trip.dateLabel || "Dates announced soon"}
            </p>
            <p className="mt-1 font-serif text-2xl font-bold">{site.trip.title}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href="/sponsor" className="btn-give">
              Fill the Trunks
            </Link>
            <Link
              href="/trips/belize-upcoming"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Trip Details
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-display text-2xl sm:text-3xl">Latest from the timeline</h2>
            <Link href="/blog" className="font-semibold text-sea hover:underline">
              Full timeline →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

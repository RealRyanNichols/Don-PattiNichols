import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import PostCard from "@/components/PostCard";
import { people } from "@/content/people";
import { posts } from "@/content/posts";

export const metadata: Metadata = {
  title: "Don Nichols — Preacher & Mission Team Member",
  description:
    "Don Nichols preaches the Word of God and serves on medical mission teams bringing free clinics, Bibles, and the Gospel of Jesus Christ to rural villages in Belize.",
};

export default function DonPage() {
  const donPosts = posts.filter((post) => post.author === "don" || post.author === "both");

  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {people.don.role}
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">{people.don.name}</h1>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          <p>
            Don Nichols preaches the Word of God and serves on medical mission teams bringing free
            clinics, Bibles, and the Gospel of Jesus Christ to rural villages in Belize.
          </p>
        </div>
        {/* [NEEDED] Don's full bio and testimony, in his own words, plus a headshot. */}
        <p className="mt-2 rounded-lg bg-sand-dark px-4 py-3 text-sm text-ink/60">
          Don&rsquo;s full story is being written and will be published here soon.
        </p>

        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold">Posts by Don</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {donPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-7">
          <h2 className="font-serif text-xl font-bold">Follow Don&rsquo;s writing</h2>
          <p className="mb-4 mt-2 text-ink/75">
            New posts and mission updates, straight to your inbox.
          </p>
          <NewsletterForm />
          <p className="mt-4 text-sm">
            <Link href="/our-story" className="font-semibold text-sea hover:underline">
              Read the Nichols family story →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

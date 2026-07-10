import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import PostCard from "@/components/PostCard";
import { people } from "@/content/people";
import { getAllPosts } from "@/lib/posts-live";

export const metadata: Metadata = {
  title: "Patti Nichols — Mission Team Member",
  description:
    "Patti Nichols serves alongside Don in mission work in Belize and in their local community — meeting practical needs and sharing the love of Christ.",
};

export const revalidate = 300;

export default async function PattiPage() {
  const posts = await getAllPosts();
  const pattiPosts = posts.filter((post) => post.author === "patti" || post.author === "both");

  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {people.patti.role}
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">{people.patti.name}</h1>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          <p>
            Patti Nichols serves alongside Don in mission work in Belize and in their local
            community — meeting practical needs and sharing the love of Christ.
          </p>
        </div>
        {/* [NEEDED] Patti's full bio and testimony, in her own words, plus a headshot. */}
        <p className="mt-2 rounded-lg bg-sand-dark px-4 py-3 text-sm text-ink/60">
          Patti&rsquo;s full story is being written and will be published here soon.
        </p>

        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold">Posts by Patti</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {pattiPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-7">
          <h2 className="font-serif text-xl font-bold">Follow Patti&rsquo;s writing</h2>
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

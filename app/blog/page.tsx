import type { Metadata } from "next";
import Link from "next/link";
import Avatar from "@/components/Avatar";
import { people } from "@/content/people";
import { getAllPosts } from "@/lib/posts-live";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "The Timeline — Updates from Don & Patti",
  description:
    "One shared timeline. Two voices. Mission updates, preaching and teaching, and stories from the field — written by Don & Patti Nichols.",
};

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getAllPosts();
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            One Timeline. Two Voices.
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">The Timeline</h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Everything Don and Patti write lands here — mission updates, words from Scripture, and
            stories from the field.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            {(["don", "patti"] as const).map((key) => (
              <Link
                key={key}
                href={people[key].href}
                className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition-colors hover:bg-white/15"
              >
                <Avatar author={key} tone="gold" />
                <span>
                  <span className="block font-serif font-bold">{people[key].name}</span>
                  <span className="block text-xs text-white/70">{people[key].role}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <ol className="relative space-y-8 border-l-2 border-sea/20 pl-8">
          {posts.map((post) => (
            <li key={post.slug} className="relative">
              <span className="absolute -left-[3.4rem] top-0">
                <Avatar author={post.author} />
              </span>
              <article className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-sm text-ink/60">
                  <span className="font-semibold text-ink/85">{people[post.author].name}</span> ·{" "}
                  {formatDate(post.date)} ·{" "}
                  <span className="font-semibold uppercase tracking-wider text-sea">
                    {post.category}
                  </span>
                </p>
                <h2 className="mt-2 font-serif text-2xl font-bold leading-snug">
                  <Link href={`/blog/${post.slug}`} className="hover:text-sea">
                    {post.title}
                  </Link>
                </h2>
                <p className="mt-2 text-ink/75">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-3 inline-block text-sm font-semibold text-sea hover:underline"
                >
                  Read the full post →
                </Link>
              </article>
            </li>
          ))}
        </ol>
        <p className="mt-10 rounded-xl bg-sand-dark p-5 text-center text-sm text-ink/65">
          New posts from Don and Patti land here as they write them. Follow along on the{" "}
          <Link href="/members" className="font-semibold text-sea hover:underline">
            Mission Partners Hub
          </Link>{" "}
          to get every update by email.
        </p>
      </section>
    </>
  );
}

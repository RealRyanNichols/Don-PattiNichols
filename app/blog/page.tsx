import { site } from "@/lib/site";
import { storageImage } from "@/lib/storageImage";
import type { Metadata } from "next";
import Link from "next/link";
import { sortedPosts } from "@/content/posts";
import { people, authorNames } from "@/content/people";
import {
  fetchDbPosts,
  dbAuthorName,
  dbPostDate,
  type DbPost,
} from "@/lib/postsDb";

/**
 * The timeline merges two sources into one river, newest first:
 *   - posts Don & Patti publish from their phones (Supabase, live within 60s)
 *   - the founding posts kept in code (content/posts.ts)
 */
export const revalidate = 60;

type TimelineEntry =
  | { kind: "static"; date: number; post: (typeof sortedPosts)[number] }
  | { kind: "db"; date: number; post: DbPost };

export const metadata: Metadata = {
  alternates: { canonical: `${site.url}/blog` },
  title: "The Timeline — Updates from Don & Patti",
  description:
    "One shared timeline. Two voices. Mission updates, preaching and teaching, and stories from the field — written by Don & Patti Nichols.",
};

function Avatar({ initials, dark = false }: { initials: string; dark?: boolean }) {
  return (
    <span
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-base font-bold ${
        dark ? "bg-gold text-ink" : "bg-sea text-white"
      }`}
    >
      {initials}
    </span>
  );
}

export default async function TimelinePage() {
  const dbPosts = await fetchDbPosts();
  const entries: TimelineEntry[] = [
    ...dbPosts.map((post) => ({
      kind: "db" as const,
      date: new Date(post.published_at ?? post.created_at).getTime(),
      post,
    })),
    ...sortedPosts.map((post) => ({
      kind: "static" as const,
      date: new Date(post.date + "T12:00:00").getTime(),
      post,
    })),
  ].sort((a, b) => b.date - a.date);

  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            One Timeline. Two Voices.
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">The Timeline</h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Everything Don and Patti write lands here — mission updates, words from Scripture,
            and stories from the field.
          </p>

          {/* profile chips */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/don"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition-colors hover:bg-white/15"
            >
              <Avatar initials="DN" dark />
              <span>
                <span className="block font-serif font-bold">Don Nichols</span>
                <span className="block text-xs text-white/70">{people.don.role}</span>
              </span>
            </Link>
            <Link
              href="/patti"
              className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15 transition-colors hover:bg-white/15"
            >
              <Avatar initials="PN" dark />
              <span>
                <span className="block font-serif font-bold">Patti Nichols</span>
                <span className="block text-xs text-white/70">{people.patti.role}</span>
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <ol className="relative space-y-8 border-l-2 border-sea/20 pl-8">
          {entries.map((entry) => {
            if (entry.kind === "db") {
              const post = entry.post;
              const initials = post.author_handle === "patti" ? "PN" : "DN";
              return (
                <li key={`db-${post.id}`} className="relative">
                  <span className="absolute -left-[3.4rem] top-0">
                    <Avatar initials={initials} dark={post.author_handle === "patti"} />
                  </span>
                  <article className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                    <p className="text-sm text-ink/60">
                      <span className="font-semibold text-ink/85">
                        {dbAuthorName(post.author_handle)}
                      </span>
                      {" · "}
                      {dbPostDate(post)}
                      {post.tags[0] ? (
                        <>
                          {" · "}
                          <span className="font-semibold uppercase tracking-wider text-sea">
                            {post.tags[0]}
                          </span>
                        </>
                      ) : null}
                    </p>
                    <h2 className="mt-2 font-serif text-2xl font-bold leading-snug">
                      <Link href={`/blog/${post.slug}`} className="hover:text-sea">
                        {post.title}
                      </Link>
                    </h2>
                    {post.photo_urls[0] && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={storageImage(post.photo_urls[0], 800)}
                        alt={
                          (post.photo_captions?.[0] ?? "").trim() || post.title
                        }
                        width={800}
                        height={450}
                        loading="lazy"
                        className="mt-3 aspect-video w-full rounded-lg bg-sand-dark object-cover"
                      />
                    )}
                    <p className="mt-2 text-ink/75">{post.excerpt}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-3 inline-block text-sm font-semibold text-sea hover:underline"
                    >
                      Read the full post →
                    </Link>
                  </article>
                </li>
              );
            }
            const post = entry.post;
            const date = new Date(post.date + "T12:00:00").toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const initials =
              post.author === "don" ? "DN" : post.author === "patti" ? "PN" : "D&P";
            return (
              <li key={post.slug} className="relative">
                <span className="absolute -left-[3.4rem] top-0">
                  <Avatar initials={initials} dark={post.author === "patti"} />
                </span>
                <article className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
                  <p className="text-sm text-ink/60">
                    <span className="font-semibold text-ink/85">{authorNames(post.author)}</span>
                    {" · "}
                    {date}
                    {" · "}
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
            );
          })}
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

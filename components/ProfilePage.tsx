import Link from "next/link";
import { people } from "@/content/people";
import { fetchPostFeed } from "@/lib/postFeed";
import PostCard from "@/components/PostCard";
import NewsletterForm from "@/components/NewsletterForm";
import { lifeStories } from "@/content/life-stories";

export default async function ProfilePage({ who }: { who: "don" | "patti" }) {
  const person = people[who];
  const theirPosts = await fetchPostFeed(who);
  const familyStories = lifeStories.filter((story) =>
    story.subjects.includes(who),
  );

  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {person.role}
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">
            {person.name}
          </h1>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {person.bio.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
        <section className="mt-10" aria-labelledby="family-stories-heading">
          <p className="eyebrow">Life beyond the mission field</p>
          <h2
            id="family-stories-heading"
            className="mt-2 font-serif text-3xl font-semibold"
          >
            Family, faith, and the memories that matter.
          </h2>
          <div className="mt-6 divide-y divide-ink/15 border-y border-ink/15">
            {familyStories.map((story) => (
              <article key={story.slug} className="py-6">
                <p className="text-sm text-sea">
                  {story.category} · As remembered by {story.narrator}
                </p>
                <h3 className="mt-2 font-serif text-xl font-semibold">
                  <Link
                    href={`/our-story/${story.slug}`}
                    className="hover:text-sea"
                  >
                    {story.title} →
                  </Link>
                </h3>
                <p className="mt-2 leading-relaxed text-ink/75">
                  {story.excerpt}
                </p>
              </article>
            ))}
          </div>
          <Link
            href="/our-story"
            className="mt-4 inline-block py-2 font-semibold text-sea hover:underline"
          >
            Read their life story together →
          </Link>
        </section>

        <div className="mt-12">
          <h2 className="font-serif text-2xl font-bold">
            Posts by {person.name.split(" ")[0]}
          </h2>
          {theirPosts.length > 0 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {theirPosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <p className="mt-4 text-ink/70">First posts coming soon.</p>
          )}
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-7">
          <h2 className="font-serif text-xl font-bold">
            Follow {person.name.split(" ")[0]}&rsquo;s writing
          </h2>
          <p className="mb-4 mt-2 text-ink/75">
            New posts and mission updates, straight to your inbox.
          </p>
          <NewsletterForm compact />
          <p className="mt-4 text-sm">
            <Link
              href="/our-story"
              className="font-semibold text-sea hover:underline"
            >
              Read the Nichols family story →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

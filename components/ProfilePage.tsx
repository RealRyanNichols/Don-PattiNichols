import Link from "next/link";
import { people, type Author } from "@/content/people";
import { postsByAuthor } from "@/content/posts";
import PostCard from "@/components/PostCard";
import NewsletterForm from "@/components/NewsletterForm";

export default function ProfilePage({ who }: { who: "don" | "patti" }) {
  const person = people[who];
  const theirPosts = postsByAuthor(who as Author);

  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {person.role}
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">{person.name}</h1>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {person.bio.map((p) => (
            <p key={p.slice(0, 32)}>{p}</p>
          ))}
        </div>
        <p className="mt-2 rounded-lg bg-sand-dark px-4 py-3 text-sm text-ink/60">
          {person.name.split(" ")[0]}&rsquo;s full story is being written and will be published
          here soon.
        </p>

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
            <Link href="/our-story" className="font-semibold text-sea hover:underline">
              Read the Nichols family story →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}

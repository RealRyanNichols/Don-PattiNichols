import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import GiveLink from "@/components/GiveLink";
import { people } from "@/content/people";
import { posts } from "@/content/posts";
import { getPostLive } from "@/lib/posts-live";
import { formatDate } from "@/lib/format";
import { site } from "@/lib/site";
import { socialMetadata } from "@/lib/seo";

/** Render dashboard-published posts on demand; refresh every 5 minutes. */
export const revalidate = 300;
export const dynamicParams = true;

type Props = { params: { slug: string } };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await getPostLive(params.slug);
  if (!post) return {};
  return socialMetadata({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    eyebrow: `${post.category} · Don & Patti Nichols`,
    image: post.slug === "why-belize" ? "/images/belize-2026-03.jpg" : post.slug === "how-a-mission-trip-changes-lives" ? "/images/belize-2026-09.jpg" : "/images/team.jpg",
  });
}

export default async function BlogPostPage({ params }: Props) {
  const post = await getPostLive(params.slug);
  if (!post) notFound();

  const author = people[post.author];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author:
      post.author === "both"
        ? [
            { "@type": "Person", name: people.don.name, url: `${site.url}/don` },
            { "@type": "Person", name: people.patti.name, url: `${site.url}/patti` },
          ]
        : { "@type": "Person", name: author.name, url: `${site.url}${author.href}` },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="bg-deep py-14 text-white">
        <div className="container-content max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            {post.category}
          </p>
          <h1 className="h-display mt-2 text-3xl !text-white sm:text-5xl">{post.title}</h1>
          <p className="mt-4 text-white/75">
            By{" "}
            {post.author === "both" ? (
              <span className="font-semibold text-white">{author.name}</span>
            ) : (
              <Link href={author.href} className="font-semibold text-gold hover:underline">
                {author.name}
              </Link>
            )}{" "}
            · {formatDate(post.date)}
          </p>
        </div>
      </section>

      <section className="container-content max-w-3xl py-12">
        <div className="prose-mission">
          {post.body.map((text) => (
            <p key={text.slice(0, 32)}>{text}</p>
          ))}
        </div>

        <div className="mt-12 rounded-2xl bg-sand-dark p-7">
          <h2 className="font-serif text-xl font-bold">Stand with the mission</h2>
          <p className="mt-2 text-ink/75">
            If this stirred your heart, share it with someone — and consider partnering with the
            work in Belize.
          </p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <GiveLink location="blog_post" className="btn-give">
              Give to the Mission
            </GiveLink>
            <Link href="/blog" className="btn-outline">
              More Posts
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

import Link from "next/link";
import { people } from "@/content/people";
import type { Post } from "@/content/posts";
import { formatDate } from "@/lib/format";

export default function PostCard({ post }: { post: Post }) {
  const author = people[post.author];
  return (
    <article className="group flex h-full flex-col rounded-xl border border-ink/10 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <p className="eyebrow">{post.category}</p>
      <h3 className="mt-2 font-serif text-xl font-bold leading-snug">
        <Link href={`/blog/${post.slug}`} className="hover:text-sea">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 flex-1 text-ink/75">{post.excerpt}</p>
      <p className="mt-4 text-sm text-ink/60">
        By{" "}
        {post.author === "both" ? (
          <span className="font-semibold text-ink/80">{author.name}</span>
        ) : (
          <Link href={author.href} className="font-semibold text-sea hover:underline">
            {author.name}
          </Link>
        )}{" "}
        · {formatDate(post.date)}
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="mt-3 text-sm font-semibold text-sea group-hover:underline"
      >
        Read more →
      </Link>
    </article>
  );
}

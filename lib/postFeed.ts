import { sortedPosts, type Post } from "@/content/posts";
import { fetchDbPosts } from "./postsDb";

/** The homepage and author pages use the same published stories as the blog. */
export type PostSummary = Omit<Post, "paragraphs" | "category" | "author"> & {
  category: string;
  author: Post["author"] | "team";
};

export async function fetchPostFeed(
  author?: "don" | "patti",
): Promise<PostSummary[]> {
  const live = await fetchDbPosts();
  const foundingSlugs = new Set(sortedPosts.map((post) => post.slug));
  const published = live
    // The article route gives founding posts precedence for an existing slug.
    .filter((post) => !foundingSlugs.has(post.slug))
    .map((post) => {
      const publishedAt = post.published_at ?? post.created_at;
      const summary: PostSummary = {
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        author:
          post.author_handle === "don" || post.author_handle === "patti"
            ? post.author_handle
            : "team",
        date: publishedAt.slice(0, 10),
        category: post.tags[0] ?? "Mission Updates",
      };
      return { summary, timestamp: Date.parse(publishedAt) };
    });
  return (
    [
      ...published,
      ...sortedPosts.map((summary) => ({
        summary,
        timestamp: Date.parse(summary.date),
      })),
    ]
      .filter(
        ({ summary }) =>
          !author || summary.author === author || summary.author === "both",
      )
      // Retain the publication time for ordering, even when the card shows only a date.
      .sort((a, b) => b.timestamp - a.timestamp)
      .map(({ summary }) => summary)
  );
}

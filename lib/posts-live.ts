import { posts as seedPosts, type Post } from "@/content/posts";
import type { AuthorKey } from "@/content/people";
import { supabaseAnonKey, supabaseUrl } from "./supabase";

type DbPostRow = {
  slug: string;
  title: string;
  author: string;
  category: string | null;
  excerpt: string | null;
  body: string | null;
  published_at: string | null;
};

/**
 * All posts, newest first: updates Don & Patti publish from the dashboard
 * (Supabase `posts` table) merged with the seed posts in content/posts.ts.
 * Falls back to the seed posts alone if the fetch ever fails, so the
 * Timeline never goes dark. Revalidates every 5 minutes.
 */
export async function getAllPosts(): Promise<Post[]> {
  let dbPosts: Post[] = [];
  try {
    const res = await fetch(
      `${supabaseUrl}/rest/v1/posts?select=slug,title,author,category,excerpt,body,published_at&published=eq.true&order=published_at.desc`,
      {
        headers: {
          apikey: supabaseAnonKey,
          Authorization: `Bearer ${supabaseAnonKey}`,
        },
        next: { revalidate: 300 },
      },
    );
    if (res.ok) {
      const rows: DbPostRow[] = await res.json();
      dbPosts = rows
        .filter((r) => r.slug && r.title)
        .map((r) => {
          const body = String(r.body ?? "")
            .split(/\n\s*\n/)
            .map((p) => p.trim())
            .filter(Boolean);
          const author: AuthorKey = r.author === "patti" || r.author === "both" ? r.author : "don";
          return {
            slug: r.slug,
            title: r.title,
            author,
            category: r.category || "Mission Updates",
            date: (r.published_at ?? new Date().toISOString()).slice(0, 10),
            excerpt: r.excerpt || body[0] || "",
            body,
          };
        });
    }
  } catch {
    // fall through to seeds
  }

  const seedOnly = seedPosts.filter((seed) => !dbPosts.some((db) => db.slug === seed.slug));
  return [...dbPosts, ...seedOnly].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getPostLive(slug: string): Promise<Post | undefined> {
  const all = await getAllPosts();
  return all.find((p) => p.slug === slug);
}

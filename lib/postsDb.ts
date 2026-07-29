import { supabaseConfig } from "./supabase";

/**
 * LIVE POSTS — the bridge between the admin and the public blog.
 *
 * Don and Patti write in /admin; posts land in the `site_posts` table. These
 * server-side fetchers pull the PUBLISHED ones onto the public timeline, so a
 * story published from Patti's phone is on donandpatti.com within a minute
 * (pages revalidate every 60 seconds).
 *
 * RLS guarantees only `published = true` rows are visible to this anon-key
 * fetch — drafts stay private no matter what this code asks for.
 */

export type DbPost = {
  id: string;
  slug: string;
  title: string;
  body: string;
  excerpt: string;
  author_handle: string;
  tags: string[];
  photo_urls: string[];
  /** One line per photo, matched by position. May be shorter than photo_urls. */
  photo_captions: string[] | null;
  link_url: string | null;
  link_label: string | null;
  published_at: string | null;
  created_at: string;
};

const HEADERS = {
  apikey: supabaseConfig.key,
  Authorization: `Bearer ${supabaseConfig.key}`,
};

/** All published posts, newest first. Never throws — an outage returns []. */
export async function fetchDbPosts(): Promise<DbPost[]> {
  try {
    const res = await fetch(
      `${supabaseConfig.url}/rest/v1/site_posts?published=eq.true&select=*&order=published_at.desc.nullslast&limit=100`,
      { headers: HEADERS, next: { revalidate: 60 } },
    );
    if (!res.ok) return [];
    return (await res.json()) as DbPost[];
  } catch {
    return [];
  }
}

/** One published post by slug, or null. */
export async function fetchDbPost(slug: string): Promise<DbPost | null> {
  try {
    const res = await fetch(
      `${supabaseConfig.url}/rest/v1/site_posts?published=eq.true&slug=eq.${encodeURIComponent(slug)}&select=*&limit=1`,
      { headers: HEADERS, next: { revalidate: 60 } },
    );
    if (!res.ok) return null;
    const rows = (await res.json()) as DbPost[];
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Byline helpers shared by the timeline and post pages. */
export function dbAuthorName(handle: string) {
  if (handle === "don") return "Don Nichols";
  if (handle === "patti") return "Patti Nichols";
  return "The Mission Team";
}

export function dbAuthorHref(handle: string) {
  return handle === "don" || handle === "patti" ? `/${handle}` : "/our-story";
}

export function dbPostDate(post: DbPost) {
  return new Date(post.published_at ?? post.created_at).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long", day: "numeric" },
  );
}

/** Split phone-typed text into paragraphs on blank lines. */
export function dbPostParagraphs(post: DbPost): string[] {
  return post.body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

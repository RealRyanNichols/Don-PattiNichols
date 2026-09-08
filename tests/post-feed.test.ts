import assert from "node:assert/strict";
import test from "node:test";
import { fetchPostFeed } from "../lib/postFeed";
import { sortedPosts } from "../content/posts";
import type { DbPost } from "../lib/postsDb";

const story = (overrides: Partial<DbPost>): DbPost => ({
  id: "fixture-id",
  slug: "fixture-story",
  title: "A story from the field",
  excerpt: "The author's words.",
  body: "The author's words.",
  author_handle: "don",
  tags: ["Belize"],
  photo_urls: [],
  photo_captions: null,
  link_url: null,
  link_label: null,
  published_at: "2026-08-01T12:00:00Z",
  created_at: "2026-08-01T12:00:00Z",
  ...overrides,
});

test("the newest stories appear first, including separate publishing times on one day", async (t) => {
  const records = [
    story({ slug: "morning", published_at: "2026-08-01T08:00:00Z" }),
    story({ slug: "yesterday", published_at: "2026-07-31T23:00:00Z" }),
    story({ slug: "evening", published_at: "2026-08-01T20:00:00Z" }),
    story({
      slug: "created-fallback",
      published_at: null,
      created_at: "2026-08-01T15:00:00Z",
    }),
  ];
  t.mock.method(globalThis, "fetch", async () => Response.json(records));
  const feed = await fetchPostFeed();
  assert.deepEqual(
    feed.slice(0, 4).map((post) => post.slug),
    ["evening", "created-fallback", "morning", "yesterday"],
  );
  assert.equal(feed[0].date, "2026-08-01");
});

test("an author page includes their writing and shared founding posts without attributing team stories to either parent", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json([
      story({ slug: "don-story", author_handle: "don" }),
      story({ slug: "patti-story", author_handle: "patti" }),
      story({ slug: "team-story", author_handle: "mission-volunteer" }),
    ]),
  );
  const all = await fetchPostFeed();
  assert.equal(all.find((post) => post.slug === "team-story")?.author, "team");
  for (const author of ["don", "patti"] as const) {
    const feed = await fetchPostFeed(author);
    assert(feed.some((post) => post.slug === `${author}-story`));
    assert(feed.some((post) => post.author === "both"));
    assert(
      feed.every((post) => post.author === author || post.author === "both"),
    );
  }
});

test("a duplicate database slug keeps the founding story that its article route actually renders", async (t) => {
  const existing = sortedPosts[0];
  t.mock.method(globalThis, "fetch", async () =>
    Response.json([
      story({
        slug: existing.slug,
        title: "A conflicting title",
        published_at: "2026-09-01T00:00:00Z",
      }),
    ]),
  );
  const feed = await fetchPostFeed();
  assert.equal(feed.filter((post) => post.slug === existing.slug).length, 1);
  assert.equal(
    feed.find((post) => post.slug === existing.slug)?.title,
    existing.title,
  );
});

test("published-post fetching filters drafts and a database outage leaves founding stories readable", async (t) => {
  const fetchMock = t.mock.method(
    globalThis,
    "fetch",
    async (url: string | URL | Request) => {
      const requestUrl = new URL(String(url));
      assert.equal(requestUrl.searchParams.get("published"), "eq.true");
      return new Response(null, { status: 503 });
    },
  );
  const feed = await fetchPostFeed();
  assert.equal(fetchMock.mock.callCount(), 1);
  assert.deepEqual(
    feed.map((post) => post.slug),
    sortedPosts.map((post) => post.slug),
  );
});

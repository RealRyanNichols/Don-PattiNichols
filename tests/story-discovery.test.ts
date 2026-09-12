import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "../app/sitemap";
import { GET } from "../app/feed.xml/route";
import { lifeStories } from "../content/life-stories";
import { posts } from "../content/posts";
import { site } from "../lib/site";
import type { DbPost } from "../lib/postsDb";

const conflictingPost: DbPost = {
  id: "conflicting-static-slug",
  slug: posts[0].slug,
  title: "This title is not rendered by the article route",
  body: "A duplicate record should not produce a duplicate discovery URL.",
  excerpt: "Conflicting database record",
  author_handle: "patti",
  tags: [],
  photo_urls: [],
  photo_captions: null,
  link_url: null,
  link_label: null,
  published_at: "2026-09-11T12:00:00Z",
  created_at: "2026-09-11T12:00:00Z",
};

test("the sitemap discovers all eight life stories with publication dates and no duplicate article URLs", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json([conflictingPost]),
  );
  const entries = await sitemap();
  assert.equal(new Set(entries.map((entry) => entry.url)).size, entries.length);

  const stories = entries.filter((entry) =>
    entry.url.startsWith(`${site.url}/our-story/`),
  );
  assert.equal(stories.length, 8);
  assert.deepEqual(
    stories.map((story) => story.url).sort(),
    lifeStories.map((story) => `${site.url}/our-story/${story.slug}`).sort(),
  );
  for (const story of stories) {
    assert.equal(
      new Date(story.lastModified!).toISOString(),
      "2026-09-12T12:00:00.000Z",
    );
  }

  const founding = entries.find(
    (entry) => entry.url === `${site.url}/blog/${posts[0].slug}`,
  );
  assert.equal(
    new Date(founding!.lastModified!).toISOString(),
    new Date(posts[0].date).toISOString(),
  );
});

test("RSS keeps family storytellers distinct and never treats a recording date as publication", async (t) => {
  t.mock.method(globalThis, "fetch", async () =>
    Response.json([conflictingPost]),
  );
  const response = await GET();
  assert.match(response.headers.get("Content-Type")!, /application\/rss\+xml/);
  const xml = await response.text();
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(
    (match) => match[1],
  );
  const urls = items.map((item) => item.match(/<link>(.*?)<\/link>/)![1]);
  assert.equal(new Set(urls).size, urls.length);
  assert(!xml.includes(conflictingPost.title));

  const stories = items.filter((item) =>
    item.includes(`<link>${site.url}/our-story/`),
  );
  assert.equal(stories.length, 8);
  for (const story of stories) {
    assert(story.includes("<pubDate>Sat, 12 Sep 2026 12:00:00 GMT</pubDate>"));
    assert(!story.includes(">Patti Nichols</dc:creator>"));
  }
  const ryansMemory = stories.find((item) =>
    item.includes("/the-faith-patti-passed-on</link>"),
  )!;
  assert(ryansMemory.includes(">Ryan Nichols</dc:creator>"));
  assert(ryansMemory.includes("From Ryan Nichols's recollections."));
  const donsMemory = stories.find((item) =>
    item.includes("/the-ordination-question-don-never-forgot</link>"),
  )!;
  assert(donsMemory.includes(">Don Nichols</dc:creator>"));
});

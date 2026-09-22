import assert from "node:assert/strict";
import test from "node:test";
import sitemap from "../app/sitemap";
import { site } from "../lib/site";

test("newly published stories join the next sitemap read while drafts stay out", async (t) => {
  const rows = [
    {
      slug: "private-draft",
      published: false,
      published_at: null,
      created_at: "2026-09-21T10:00:00Z",
    },
    {
      slug: "first-published-story",
      published: true,
      published_at: "2026-09-20T10:00:00Z",
      created_at: "2026-09-19T10:00:00Z",
    },
  ];
  let requests = 0;
  t.mock.method(globalThis, "fetch", async (input: string | URL | Request) => {
    const url = new URL(String(input));
    assert.equal(url.pathname, "/rest/v1/site_posts");
    assert.equal(url.searchParams.get("published"), "eq.true");
    requests += 1;
    return Response.json(rows.filter((row) => row.published));
  });

  const before = await sitemap();
  rows.push({
    slug: "new-story-after-build",
    published: true,
    published_at: "2026-09-21T20:21:11Z",
    created_at: "2026-09-21T20:00:00Z",
  });
  const after = await sitemap();
  assert.equal(requests, 2);
  assert.equal(after.length, before.length + 1);
  assert.equal(new Set(after.map((entry) => entry.url)).size, after.length);
  assert(after.every((entry) => !entry.url.includes("private-draft")));
  assert.equal(
    after.find(
      (entry) => entry.url === `${site.url}/blog/new-story-after-build`,
    )?.lastModified,
    "2026-09-21T20:21:11Z",
  );
  for (const entry of before) {
    assert(after.some((current) => current.url === entry.url));
  }
});

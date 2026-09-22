import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import test from "node:test";
import { socialPosts } from "../content/social-kit";
import { site } from "../lib/site";
import sitemap from "../app/sitemap";

test("all fourteen social downloads are complete PNGs with the advertised dimensions", () => {
  assert.equal(socialPosts.length, 14);
  assert.equal(new Set(socialPosts.map((post) => post.id)).size, 14);
  assert.equal(new Set(socialPosts.map((post) => post.image)).size, 14);
  for (const [index, post] of socialPosts.entries()) {
    assert.equal(post.number, index + 1);
    assert.match(post.image, /^\/images\/social\/\d{2}-[a-z-]+\.png$/);
    const image = readFileSync(resolve("public", `.${post.image}`));
    assert.equal(image.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    assert.equal(image.readUInt32BE(16), post.width);
    assert.equal(image.readUInt32BE(20), post.height);
    assert.equal(post.width, 1254);
    assert.equal(post.height, 1254);
    // PNG's final IEND chunk must be present, not just an image header.
    assert.equal(image.subarray(-8, -4).toString(), "IEND");
    const destination = new URL(post.destination);
    assert.equal(destination.origin, site.url);
    assert(post.caption.endsWith(post.destination));
  }
});

test("the public share page exposes its fourteen originals in the image sitemap", async (t) => {
  t.mock.method(globalThis, "fetch", async () => Response.json([]));
  const entries = await sitemap();
  const share = entries.filter((entry) => entry.url === `${site.url}/share`);
  assert.equal(share.length, 1);
  assert.deepEqual(
    share[0].images,
    socialPosts.map((post) => `${site.url}${post.image}`),
  );
});

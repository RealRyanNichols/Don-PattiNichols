import test from "node:test";
import assert from "node:assert/strict";
import { GET } from "../app/embed/[slug]/route";
import { featuredVideo, missionVideos } from "../content/videos";
import { videoEmbedHtml } from "../lib/videoEmbed";

test("public embeds allow framing and retain captions without download actions", async () => {
  for (const video of missionVideos) {
    const response = await GET(
      new Request(`https://www.donandpatti.com/embed/${video.id}`),
      { params: Promise.resolve({ slug: video.id }) },
    );
    assert.equal(response.status, 200);
    assert.match(
      response.headers.get("Content-Security-Policy")!,
      /frame-ancestors \*/,
    );
    const html = await response.text();
    assert.match(html, /controlslist="nodownload"/);
    assert.match(html, /kind="captions"/);
    assert.match(html, /playsinline preload="none"/);
    assert.match(html, /-web\.mp4/);
    assert.doesNotMatch(html, /download=|\.srt|\.zip|<a[^>]+\.mp4|<script/);
  }
});

test("embed routes reject unknown video IDs and escape text", async () => {
  const response = await GET(
    new Request("https://www.donandpatti.com/embed/unknown"),
    { params: Promise.resolve({ slug: "unknown" }) },
  );
  assert.equal(response.status, 404);
  const html = videoEmbedHtml({
    ...featuredVideo,
    title: '\"><script>alert(1)</script>',
  });
  assert.doesNotMatch(html, /<script>/);
  assert.match(html, /&lt;script&gt;/);
});

#!/usr/bin/env node
/**
 * PUSH EVERY URL IN THE SITEMAP TO INDEXNOW.
 *
 * Google needs Search Console; Bing, Yandex, Seznam, Naver and every other
 * IndexNow participant accept a POST the moment a page changes. One request
 * fans out to all of them. The key file at /<key>.txt proves domain
 * ownership and is world-readable by design (see lib/indexnow.ts).
 *
 *   npm run indexnow            # everything in the live sitemap
 *   npm run indexnow -- --wait  # poll the sitemap until it is reachable
 *                               # (used by the GitHub Action after a deploy)
 *
 * No dependencies; runs on Node 18+. Prints the HTTP status IndexNow returns:
 * 200/202 accepted, 400 bad request, 403 key mismatch, 422 bad URLs, 429 slow down.
 */

const HOST = "www.donandpatti.com";
const KEY = "448094894f88e5d128eceaafa798b4e9";
const SITEMAP = `https://${HOST}/sitemap.xml`;
const wait = process.argv.includes("--wait");

async function fetchSitemap() {
  const res = await fetch(SITEMAP, { headers: { "User-Agent": "donandpatti-indexnow/1.0" } });
  if (!res.ok) throw new Error(`sitemap ${res.status}`);
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  // <image:loc> entries also match the pattern above only if unqualified;
  // the sitemap uses <image:loc>, so plain <loc> is page URLs only.
  return [...new Set(urls)].filter((u) => u.startsWith(`https://${HOST}/`));
}

async function main() {
  let urls = [];
  const deadline = Date.now() + (wait ? 12 * 60 * 1000 : 0);
  for (;;) {
    try {
      urls = await fetchSitemap();
      if (urls.length > 0) break;
      throw new Error("sitemap empty");
    } catch (err) {
      if (Date.now() >= deadline) throw err;
      console.log(`sitemap not ready (${err.message}); retrying in 30s`);
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }
  console.log(`submitting ${urls.length} URLs from ${SITEMAP}`);
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  console.log(`IndexNow responded ${res.status} ${res.statusText}`);
  if (res.status >= 400) {
    console.log(await res.text());
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

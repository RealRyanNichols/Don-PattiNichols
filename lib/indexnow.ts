/**
 * INDEXNOW — the half of search indexing that needs no account.
 *
 * Google requires Search Console verification before it will take submissions
 * (that token is still waiting on Ryan). Bing, Yandex, Seznam, Naver and every
 * other IndexNow participant accept URL pushes immediately: host a key file at
 * /<key>.txt to prove domain ownership, then POST changed URLs to the shared
 * endpoint. One POST fans out to all participating engines.
 *
 * The key lives in public/448094894f88e5d128eceaafa798b4e9.txt. It is not a
 * secret — the protocol requires it to be world-readable. Do not "clean it up".
 */
export const INDEXNOW_KEY = "448094894f88e5d128eceaafa798b4e9";

export async function pingIndexNow(urls: string[]): Promise<number> {
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: "www.donandpatti.com",
      key: INDEXNOW_KEY,
      keyLocation: `https://www.donandpatti.com/${INDEXNOW_KEY}.txt`,
      urlList: urls.slice(0, 10000),
    }),
  });
  return res.status;
}

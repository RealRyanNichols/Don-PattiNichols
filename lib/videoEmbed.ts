import { videoMediaBase, type MissionVideo } from "../content/videos";

function escape(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}

/** An isolated public player, with no account UI, analytics, or download link. */
export function videoEmbedHtml(video: MissionVideo): string {
  const title = escape(video.title);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,follow"><title>${title} | Don &amp; Patti Nichols</title><style>html,body{margin:0;width:100%;height:100%;background:#071f21;color:white;font:14px system-ui}body{display:flex;flex-direction:column}video{display:block;width:100%;min-height:0;flex:1;object-fit:contain}nav{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px;padding:4px 8px;background:#0a3d40}a{display:inline-flex;align-items:center;min-height:40px;color:#f0c76b;text-decoration:underline;text-underline-offset:3px}a:focus-visible{outline:2px solid white;outline-offset:2px}</style></head><body><video controls controlslist="nodownload" playsinline preload="none" poster="${videoMediaBase}/${escape(video.poster)}" aria-label="${title}"><source src="${videoMediaBase}/${escape(video.playback)}" type="video/mp4"><track src="${videoMediaBase}/${escape(video.captions)}" kind="captions" srclang="en" label="English" default>Your browser cannot play this video.</video><nav aria-label="Support and share"><a href="https://www.donandpatti.com/watch/${escape(video.id)}" target="_blank" rel="noopener noreferrer">Watch &amp; share</a><a href="https://www.donandpatti.com/give${video.id === "don-ministry-extended-story" ? "" : "#local-outreach"}" target="_blank" rel="noopener noreferrer">Support the mission →</a></nav></body></html>`;
}

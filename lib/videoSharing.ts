const SITE_URL = "https://www.donandpatti.com";

export function isVideoShareId(id: string): boolean {
  return id.length <= 120 && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id);
}

function escapeAttribute(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

export function videoShareLinks(id: string, title: string) {
  if (!isVideoShareId(id)) throw new Error("Invalid video ID");

  const watchUrl = `${SITE_URL}/watch/${id}`;
  const embedUrl = `${SITE_URL}/embed/${id}`;
  const text = `Watch ${title} from Don & Patti Nichols.`;
  const embedCode = `<iframe src="${embedUrl}" title="${escapeAttribute(title)}" width="360" height="640" style="width:100%;max-width:360px;height:auto;aspect-ratio:9/16;border:0" allow="fullscreen; picture-in-picture" allowfullscreen loading="lazy"></iframe>`;

  return {
    watchUrl,
    text,
    embedCode,
    facebook: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: watchUrl })}`,
    x: `https://twitter.com/intent/tweet?${new URLSearchParams({ text, url: watchUrl })}`,
  };
}

export function videoTextMessageUrl(
  id: string,
  title: string,
  appleDevice = false,
): string {
  const { watchUrl, text } = videoShareLinks(id, title);
  return `sms:${appleDevice ? "&" : "?"}body=${encodeURIComponent(`${text} ${watchUrl}`)}`;
}

/** Success means the clipboard operation actually completed. */
export async function copyVideoShareText(
  value: string,
  write?: (text: string) => Promise<void>,
): Promise<boolean> {
  if (!write) return false;
  try {
    await write(value);
    return true;
  } catch {
    return false;
  }
}

export function isShareCancelled(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  );
}

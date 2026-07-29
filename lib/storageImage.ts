/**
 * RESIZE PHOTOS ON THE WAY OUT.
 *
 * Don uploads straight from his phone, so every picture arrives at full camera
 * resolution — often half a megabyte, sometimes more. His first post carried
 * 56 of them. Served as-is that page weighed about ELEVEN MEGABYTES, and 55%
 * of this site's readers are on a phone, plenty of them on rural East Texas
 * data. Most would never have reached the end of the story, let alone the
 * giving card under it.
 *
 * Supabase can resize on delivery. Swapping `/object/public/` for
 * `/render/image/public/` and asking for the width actually being displayed
 * takes a 678KB photograph down to 163KB at 600px — and the thumbnails in a
 * grid only need 400px, which is smaller still.
 *
 * Nothing is re-uploaded and nothing is lost. The full-resolution original
 * stays exactly where it is; this only changes what the browser is sent.
 */
export function storageImage(
  url: string,
  width: number,
  quality = 72,
): string {
  if (!url) return url;
  // Only Supabase storage URLs can be transformed. Google Drive photos (the
  // 509-picture archive) already carry their own `=w` size parameter, and
  // anything else is left completely alone.
  if (!url.includes("/storage/v1/object/public/")) return url;
  const base = url.replace("/storage/v1/object/public/", "/storage/v1/render/image/public/");
  const sep = base.includes("?") ? "&" : "?";
  // `resize=contain` never crops — a face at the edge of a photo stays in it.
  return `${base}${sep}width=${width}&quality=${quality}&resize=contain`;
}

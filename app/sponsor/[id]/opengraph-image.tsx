import { supplyDrive } from "@/content/supplies";
import { ogCard, photoDataUrl, OG_SIZE } from "@/lib/ogCard";
import { sponsorCardCopy } from "@/lib/og";

/**
 * The share card for one supply item: the item's own photograph with the
 * ask written on it — "Sponsor a Bible for $2.50". Big photographs fill the
 * card; the small iCloud exports sit framed beside the words so they stay
 * sharp. If the photograph cannot be fetched, the typographic card still
 * carries the words.
 */
export const runtime = "nodejs";
export const alt = "Sponsor real mission supplies with Don & Patti Nichols";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = supplyDrive.items.find((i) => i.id === id);
  if (!item) {
    return ogCard({
      eyebrow: "Fill the Trunks",
      title: "Sponsor the exact supplies that fly to Belize",
      line: supplyDrive.tagline,
    });
  }
  const copy = sponsorCardCopy(item);
  const photo = await photoDataUrl(item.photo, copy.inset ? Math.min(item.photoPx, 1200) : 1200);
  return ogCard({ ...copy, photo });
}

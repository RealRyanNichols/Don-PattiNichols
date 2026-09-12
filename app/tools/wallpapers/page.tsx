import type { Metadata } from "next";
import { toolBySlug } from "@/content/tools";
import { prayerDays } from "@/content/prayer";
import { createPageMetadata } from "@/lib/metadata";
import { keywords, ogCardImage } from "@/lib/seo";
import ToolShell from "@/components/tools/ToolShell";

const tool = toolBySlug("wallpapers")!;

export const metadata: Metadata = createPageMetadata({
  path: tool.href,
  title: `${tool.title} — Free Bible Verse Lock Screens`,
  description: tool.blurb,
  keywords: keywords(tool.keywords, "prayer"),
  image: ogCardImage({
    eyebrow: "Free download",
    title: "Seven Scripture wallpapers from the mission field",
    line: "One verse per day of the prayer guide, over Don and Patti's own photographs.",
    photo: tool.photo,
  }),
});

export default function Page() {
  return (
    <ToolShell
      slug={tool.slug}
      eyebrow="Download"
      intro="Seven lock screens, 1080 × 1920, one for each day of the prayer guide. Set one the week a team is on the ground and see the verse every time you pick up your phone."
      guide={{ label: "How to pray for a mission team", href: "/guides/how-to-pray-for-a-mission-team" }}
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {prayerDays.map((d) => {
          const src = `/api/wallpaper/${d.day}`;
          return (
            <figure key={d.day} className="reveal flex flex-col">
              <a
                href={src}
                download={`prayer-wallpaper-day-${d.day}.png`}
                className="group overflow-hidden rounded-2xl bg-deep shadow-md ring-1 ring-ink/10"
                aria-label={`Download day ${d.day} wallpaper: ${d.verse.ref}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={src}
                  alt={`Wallpaper for day ${d.day}, ${d.title}: “${d.verse.text}” — ${d.verse.ref}`}
                  width={1080}
                  height={1920}
                  loading={d.day <= 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="aspect-[9/16] w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                />
              </a>
              <figcaption className="mt-2">
                <p className="text-xs font-bold uppercase tracking-widest text-sea">
                  Day {d.day} · {d.title}
                </p>
                <p className="text-sm text-ink/70">{d.verse.ref}</p>
                <a
                  href={src}
                  download={`prayer-wallpaper-day-${d.day}.png`}
                  className="mt-1 inline-block text-sm font-bold text-gold-dark hover:underline"
                >
                  Save to phone →
                </a>
              </figcaption>
            </figure>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-ink/55">
        On an iPhone, tap and hold the picture and choose &ldquo;Add to Photos&rdquo;; on Android, tap &ldquo;Save to phone.&rdquo; Then set it as your lock screen from Photos.
      </p>
    </ToolShell>
  );
}

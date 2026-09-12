import Link from "next/link";
import { tools } from "@/content/tools";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";
import Breadcrumbs from "@/components/Breadcrumbs";
import ShareButton from "@/components/ShareButton";

/**
 * The frame every tool page shares: a photo hero with breadcrumbs, the tool
 * itself, an honest note about what the tool does with your data (nothing),
 * a related guide, and the other tools.
 */
export default function ToolShell({
  slug,
  eyebrow = "Tool",
  intro,
  guide,
  children,
}: {
  slug: string;
  eyebrow?: string;
  intro: string;
  /** The guide this tool belongs to. */
  guide?: { label: string; href: string };
  children: React.ReactNode;
}) {
  const tool = tools.find((t) => t.slug === slug)!;
  const others = tools.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <>
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo(tool.photo, 1600)}
          srcSet={photoSrcSet(tool.photo, [900, 1600, 2000])}
          sizes="100vw"
          alt={photoAlt(tool.photo, tool.title, 0)}
          width={1600}
          height={1000}
          fetchPriority="high"
          decoding="async"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(105deg, rgba(10,61,64,0.97) 0%, rgba(10,61,64,0.90) 50%, rgba(10,61,64,0.70) 100%)",
          }}
        />
        <div className="container-content relative py-12 sm:py-16">
          <Breadcrumbs
            dark
            crumbs={[
              { name: "Resources", path: "/resources" },
              { name: tool.title, path: tool.href },
            ]}
          />
          <p className="mt-6 text-sm font-bold uppercase tracking-[0.2em] text-gold">
            {eyebrow}
          </p>
          <h1 className="h-display mt-3 max-w-3xl text-4xl !text-white sm:text-5xl">
            {tool.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            {intro}
          </p>
        </div>
      </section>

      <section className="container-content py-10 sm:py-14">{children}</section>

      <section className="container-content pb-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <div className="rounded-2xl bg-sand-dark p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-sea">
              About this tool
            </p>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/75">
              Runs in your browser. Nothing you type is sent anywhere or saved.
              Any prices shown are Don Nichols&rsquo; published figures from the{" "}
              <Link href="/what-a-mission-trip-costs" className="font-semibold text-sea underline">
                cost page
              </Link>
              .
            </p>
            {guide && (
              <Link
                href={guide.href}
                className="mt-4 inline-block text-sm font-bold uppercase tracking-widest text-gold-dark hover:underline"
              >
                Read the guide: {guide.label} →
              </Link>
            )}
            <div className="mt-5">
              <ShareButton title={tool.title} text={tool.blurb} path={tool.href} compact />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-sea">
              More tools
            </p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {others.map((t) => (
                <li key={t.slug}>
                  <Link
                    href={t.href}
                    className="group flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-ink/10 transition hover:shadow-md"
                  >
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-deep">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={photo(t.photo, 200)}
                        alt=""
                        aria-hidden
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="font-serif font-bold leading-snug text-ink group-hover:text-sea">
                      {t.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

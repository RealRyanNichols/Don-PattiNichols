import Link from "next/link";
import { photo, photoSrcSet } from "@/content/albums";
import { photoAlt } from "@/content/captions";

/**
 * A photo-forward card for a guide or a tool. Same treatment as the impact
 * cards on the homepage: the archive photograph is the loudest thing, a gold
 * pill says what kind of thing it is, and the whole card is one link.
 */
export default function ResourceCard({
  href,
  title,
  blurb,
  photoId,
  kind,
  eager = false,
}: {
  href: string;
  title: string;
  blurb: string;
  photoId: string;
  kind: string;
  eager?: boolean;
}) {
  return (
    <Link
      href={href}
      className="group relative flex min-h-[20rem] flex-col justify-end overflow-hidden rounded-2xl shadow-md ring-1 ring-ink/10 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[22rem]"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo(photoId, 900)}
        srcSet={photoSrcSet(photoId, [600, 900, 1200, 1600])}
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        alt={photoAlt(photoId, title, 0)}
        width={900}
        height={1200}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(10,61,64,0.95) 0%, rgba(10,61,64,0.82) 34%, rgba(10,61,64,0.22) 64%, rgba(10,61,64,0.05) 100%)",
        }}
      />
      <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-deep shadow">
        {kind}
      </span>
      <div className="relative p-6">
        <h3 className="font-serif text-2xl font-bold leading-snug text-white">
          {title}
        </h3>
        <p className="mt-2 text-[15px] leading-relaxed text-white/85">{blurb}</p>
        <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-gold">
          Open
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </span>
      </div>
    </Link>
  );
}

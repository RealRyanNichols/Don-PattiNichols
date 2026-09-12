import Link from "next/link";
import type { LifeStory } from "@/content/life-stories";

export default function LifeStoryCard({
  story,
  index,
}: {
  story: LifeStory;
  index?: number;
}) {
  return (
    <article className="group flex h-full flex-col border-t border-sea/25 py-7 sm:py-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-sea">
          {story.category}
        </p>
        {index !== undefined && (
          <span aria-hidden className="font-serif text-2xl text-gold-dark/70">
            {String(index + 1).padStart(2, "0")}
          </span>
        )}
      </div>
      <h3 className="mt-4 font-serif text-2xl font-bold leading-[1.25] tracking-tight text-deep sm:text-[1.75rem]">
        <Link
          href={`/our-story/${story.slug}`}
          className="rounded-sm decoration-gold decoration-1 underline-offset-4 transition-colors hover:text-sea hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
        >
          {story.title}
        </Link>
      </h3>
      <p className="mt-4 text-base leading-relaxed text-ink/75">
        {story.excerpt}
      </p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-4 pt-6">
        <p className="text-xs leading-relaxed text-ink/65">
          Remembered by <span className="font-semibold">{story.narrator}</span>
        </p>
        <Link
          href={`/our-story/${story.slug}`}
          className="rounded-sm text-sm font-bold text-sea underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sea"
          aria-label={`Read ${story.title}`}
        >
          Read the story <span aria-hidden>→</span>
        </Link>
      </div>
    </article>
  );
}

"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { socialPosts, type SocialPost } from "@/content/social-kit";
import { track } from "@/lib/track";

function SocialCard({ post }: { post: SocialPost }) {
  const destination = new URL(post.destination);
  const captionRef = useRef<HTMLTextAreaElement>(null);
  const [copyState, setCopyState] = useState<
    "idle" | "copying" | "copied" | "manual"
  >("idle");

  async function copyCaption() {
    setCopyState("copying");
    try {
      if (!navigator.clipboard?.writeText)
        throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(post.caption);
      setCopyState("copied");
      track("social_caption_copy", { item: post.id, location: "share" });
    } catch {
      setCopyState("manual");
      captionRef.current?.focus();
      captionRef.current?.select();
    }
  }

  return (
    <article
      className="overflow-hidden rounded-2xl border border-sea/15 bg-white shadow-sm"
      aria-labelledby={`${post.id}-title`}
    >
      <a
        href={post.image}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Open full-size image: ${post.title} (new tab)`}
        className="block bg-sand-dark focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-[-4px] focus-visible:outline-sea"
      >
        <Image
          src={post.image}
          alt={`${post.title}. Don & Patti Nichols ministry graphic.`}
          width={post.width}
          height={post.height}
          sizes="(min-width: 1152px) 346px, (min-width: 1024px) 31vw, (min-width: 640px) 47vw, 94vw"
          loading="lazy"
          className="aspect-square h-auto w-full object-contain"
        />
      </a>
      <div className="p-5 sm:p-6">
        <p className="text-xs font-bold uppercase tracking-widest text-sea">
          {String(post.number).padStart(2, "0")} /{" "}
          {post.category === "giving"
            ? "Support the mission"
            : "Share the story"}
        </p>
        <h3
          id={`${post.id}-title`}
          className="mt-2 font-serif text-2xl font-bold leading-tight text-deep"
        >
          {post.title}
        </h3>
        <label
          htmlFor={`${post.id}-caption`}
          className="mt-5 block text-sm font-semibold text-ink"
        >
          Caption and link
        </label>
        <textarea
          ref={captionRef}
          id={`${post.id}-caption`}
          readOnly
          value={post.caption}
          rows={6}
          className="mt-2 block w-full resize-y rounded-lg border border-sea/20 bg-sand/70 p-3 text-sm leading-relaxed text-ink focus:border-sea focus:outline-none focus:ring-2 focus:ring-sea/25"
          aria-describedby={`${post.id}-status`}
        />
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          <a
            href={post.image}
            download={`Don-and-Patti-${post.id}.png`}
            onClick={() =>
              track("social_image_download", {
                item: post.id,
                location: "share",
              })
            }
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-sea px-3 py-3 text-sm font-bold text-white transition hover:bg-sea-dark focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
          >
            Download image
          </a>
          <button
            type="button"
            onClick={copyCaption}
            disabled={copyState === "copying"}
            className="inline-flex min-h-12 items-center justify-center rounded-md border border-sea/40 px-3 py-3 text-sm font-bold text-sea transition hover:bg-sand disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea"
          >
            {copyState === "copying"
              ? "Copying…"
              : copyState === "copied"
                ? "Caption copied"
                : "Copy caption"}
          </button>
        </div>
        <p
          id={`${post.id}-status`}
          role="status"
          className="mt-2 min-h-10 text-xs leading-relaxed text-ink/70"
        >
          {copyState === "copied"
            ? "Copied, including the link. Paste it beside your image."
            : copyState === "manual"
              ? "Your browser could not copy automatically. The caption is selected above; use Copy on your phone or keyboard."
              : "Original PNG · 1,254 × 1,254 pixels. On a phone, you can also open the image and save it to Photos."}
        </p>
        <Link
          href={`${destination.pathname}${destination.search}${destination.hash}`}
          className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-sea underline decoration-sea/35 underline-offset-4 hover:decoration-sea"
        >
          Visit this post’s link →
        </Link>
      </div>
    </article>
  );
}

const filters = [
  { value: "all", label: "All 14 images" },
  { value: "giving", label: "Giving & supplies" },
  { value: "story", label: "Stories & prayer" },
] as const;

export default function SocialShareKit() {
  const [filter, setFilter] = useState<"all" | SocialPost["category"]>("all");
  const visible = socialPosts.filter(
    (post) => filter === "all" || post.category === filter,
  );

  return (
    <>
      <div
        role="group"
        aria-label="Choose social image topics"
        className="mt-7 flex flex-wrap gap-2"
      >
        {filters.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            aria-pressed={filter === option.value}
            className={`min-h-12 rounded-full border px-5 py-3 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sea ${filter === option.value ? "border-deep bg-deep text-white" : "border-sea/25 bg-white text-sea hover:bg-sand-dark"}`}
          >
            {option.label}
          </button>
        ))}
      </div>
      <p role="status" className="mt-4 text-sm text-ink/65">
        Showing {visible.length} of {socialPosts.length} images. Every download
        is free.
      </p>
      <div className="mt-7 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <SocialCard key={post.id} post={post} />
        ))}
      </div>
    </>
  );
}

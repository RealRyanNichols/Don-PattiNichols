import type { Metadata } from "next";
import Link from "next/link";
import NewsletterForm from "@/components/NewsletterForm";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = socialMetadata({
  title: "Thank You",
  description: "Thank you for partnering with the mission.",
  path: "/give/thank-you",
  eyebrow: "Your Gift Is Part of the Mission",
  image: "/images/belize-2026-09.jpg",
});

export default function ThankYouPage() {
  return (
    <section className="container-content max-w-2xl py-20 text-center">
      <p className="eyebrow">Gift Received</p>
      <h1 className="h-display mt-3 text-4xl sm:text-5xl">Thank you.</h1>
      <p className="mt-6 text-lg leading-relaxed text-ink/80">
        Your gift is now part of every patient treated, every Bible placed in someone&rsquo;s
        hands, every pair of reading glasses that restores sight, and every pastor encouraged in
        the villages of Belize.
      </p>
      <p className="mt-4 font-serif text-xl italic text-sea">
        &ldquo;Together, we can change lives for eternity.&rdquo;
      </p>
      <div className="mx-auto mt-10 max-w-md">
        <p className="mb-3 font-semibold">Follow what your gift does — get trip updates:</p>
        <NewsletterForm />
      </div>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/belize" className="btn-primary">
          See the Mission
        </Link>
        <Link href="/blog" className="btn-outline">
          Read the Latest Updates
        </Link>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...socialMetadata({
    title: "Page Not Found",
    description: "The page you are looking for does not exist, but the mission continues.",
    path: "/404",
    eyebrow: "Don & Patti Nichols",
    image: "/images/anchor-mission-sign.jpg",
  }),
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="container-content max-w-2xl py-24 text-center">
      <p className="eyebrow">Page Not Found</p>
      <h1 className="h-display mt-3 text-4xl sm:text-5xl">This page has gone to the mission field.</h1>
      <p className="mt-4 text-ink/70">The page you&rsquo;re looking for doesn&rsquo;t exist &mdash; but the mission does.</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary">
          Back Home
        </Link>
        <Link href="/give" className="btn-give">
          Give to the Mission
        </Link>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = socialMetadata({
  title: "Privacy Policy",
  description: "Privacy policy for the Don & Patti Nichols mission website.",
  path: "/privacy",
  eyebrow: "Don & Patti Nichols",
  image: "/images/anchor-mission-sign.jpg",
});

export default function PrivacyPage() {
  return (
    <section className="container-content max-w-3xl py-14">
      <h1 className="h-display text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: July 9, 2026</p>
      <div className="prose-mission mt-8">
        <p>
          This website is operated on behalf of Don &amp; Patti Nichols (&ldquo;we,&rdquo;
          &ldquo;us&rdquo;). We respect your privacy. This policy explains what information we
          collect and how we use it.
        </p>
        <p>
          <strong>Information you give us.</strong> When you subscribe to email updates, submit a
          contact or prayer request form, or give a donation, we receive the information you
          provide — such as your name, email address, and message. We use it only to respond to
          you, send updates you requested, and administer giving. We do not sell or rent your
          personal information to anyone.
        </p>
        <p>
          <strong>Prayer requests</strong> are treated as confidential and shared only with Don
          &amp; Patti Nichols.
        </p>
        <p>
          <strong>Donations.</strong> Online gifts are processed securely by PayPal. Your
          payment details go directly to PayPal and never touch this website&rsquo;s servers.
          PayPal handles your data under its own privacy policy.
        </p>
        <p>
          <strong>Analytics.</strong> We use analytics tools (such as Vercel Analytics, and, if
          enabled, Google Analytics and the Meta Pixel) to understand how visitors use the site —
          pages visited, links clicked, and general location. This helps us improve the site and,
          if we run advertising, measure it. You can limit tracking through your browser settings,
          ad-blocking tools, and the opt-out tools those providers offer.
        </p>
        <p>
          <strong>Cookies.</strong> Analytics and payment tools may set cookies. We do not use
          cookies to collect sensitive personal information.
        </p>
        <p>
          <strong>Children.</strong> This site is not directed at children under 13, and we do not
          knowingly collect their personal information.
        </p>
        <p>
          <strong>Your choices.</strong> You may unsubscribe from emails at any time, and you may
          contact us to request that we delete the personal information you have submitted.
        </p>
        <p>
          <strong>Contact.</strong> Questions about this policy can be sent through the{" "}
          <Link href="/contact" className="font-semibold text-sea hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

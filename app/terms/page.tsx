import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for the Don & Patti Nichols mission website.",
};

export default function TermsPage() {
  return (
    <section className="container-content max-w-3xl py-14">
      <h1 className="h-display text-4xl">Terms of Use</h1>
      <p className="mt-2 text-sm text-ink/60">Last updated: July 9, 2026</p>
      <div className="prose-mission mt-8">
        <p>
          By using this website you agree to these terms. The site exists to share the mission
          work of Don &amp; Patti Nichols and to receive voluntary gifts that support that work.
        </p>
        <p>
          <strong>Donations.</strong> Gifts are voluntary contributions to the mission work
          described on this site. Designated gifts are used for the designated purpose; if a
          designated need is fully funded, remaining funds are applied to the closest similar
          ministry need. Whether a gift is tax-deductible depends on the receiving organization —
          see the Give page for current details, and consult your tax advisor.
        </p>
        <p>
          <strong>Content.</strong> Articles, photos, and videos on this site belong to Don &amp;
          Patti Nichols unless otherwise noted. You are welcome to share links to this site;
          please ask before republishing content elsewhere.
        </p>
        <p>
          <strong>No professional advice.</strong> Nothing on this site is medical, legal, tax, or
          financial advice.
        </p>
        <p>
          <strong>Third-party services.</strong> Payments and other services are provided by third
          parties under their own terms. We are not responsible for third-party sites linked from
          here.
        </p>
        <p>
          <strong>Changes.</strong> We may update these terms and will post the current version on
          this page.
        </p>
        <p>
          Questions? Reach out through the{" "}
          <Link href="/contact" className="font-semibold text-sea hover:underline">
            contact page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

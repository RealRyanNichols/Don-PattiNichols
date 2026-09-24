import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import GiveLink from "@/components/GiveLink";
import JsonLd from "@/components/JsonLd";
import SocialShareKit from "@/components/SocialShareKit";
import { socialPosts } from "@/content/social-kit";
import { createPageMetadata } from "@/lib/metadata";
import { ogCardImage } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  path: "/share",
  title: "Share the Mission | Free Social Images & Captions",
  description:
    "Download 14 free images and captions to share Don and Patti Nichols’ ministry. Help friends discover their stories, mission supplies, and ways to give.",
  image: ogCardImage({
    eyebrow: "Share the mission",
    title: "One small post. One more person who cares.",
    line: "14 free social images, ready-to-use captions, and ways to help Don & Patti.",
  }),
});

export default function SharePage() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Share Don & Patti’s mission",
          url: `${site.url}/share`,
          description:
            "Free ministry outreach graphics and captions to download and share.",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: socialPosts.map((post) => ({
              "@type": "ListItem",
              position: post.number,
              item: {
                "@type": "ImageObject",
                name: post.title,
                contentUrl: `${site.url}${post.image}`,
                width: post.width,
                height: post.height,
                caption: post.caption,
              },
            })),
          },
        }}
      />
      <section className="overflow-hidden border-b border-sea/15 bg-deep text-white">
        <div className="container-content py-10 sm:py-14">
          <Breadcrumbs
            dark
            crumbs={[{ name: "Share the mission", path: "/share" }]}
          />
          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-gold">
                A small way to help
              </p>
              <h1 className="mt-4 max-w-2xl font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
                One more person
                <br />
                <span className="font-normal italic text-gold">who cares.</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/85">
                A friend, a church, a neighbor. Your next post can introduce
                someone to Don and Patti and the work they love.
              </p>
              <p className="mt-4 max-w-xl leading-relaxed text-white/75">
                Choose a free image, copy its caption, and share it with your
                community. Each post gives people a real next step.
              </p>
              <a href="#images" className="btn-give mt-7">
                Choose an image ↓
              </a>
            </div>
            <a
              href="#images"
              aria-label="Browse all 14 social images"
              className="mx-auto block w-full max-w-sm rounded-lg border border-white/25 bg-sand p-3 shadow-xl"
            >
              <Image
                src={socialPosts[0].image}
                alt="Love in action. Help Don & Patti serve."
                width={1254}
                height={1254}
                sizes="(min-width: 1024px) 350px, 360px"
                loading="eager"
                className="h-auto w-full"
              />
            </a>
          </div>
        </div>
      </section>

      <section
        className="border-b border-sea/15 bg-white"
        aria-labelledby="how-to-share"
      >
        <div className="container-content py-8 sm:py-10">
          <h2
            id="how-to-share"
            className="font-serif text-2xl font-bold text-deep"
          >
            Three simple steps
          </h2>
          <ol className="mt-5 grid gap-5 sm:grid-cols-3">
            {[
              {
                title: "Save an image",
                body: "Choose a cause or story you care about. Download the original square image to your phone or computer.",
              },
              {
                title: "Copy the caption",
                body: "Each caption includes a link. Add a personal sentence about why you’re sharing, if you like.",
              },
              {
                title: "Share with your community",
                body: "On Facebook, paste the caption with the image. On Instagram, put the link in your bio or a Story link sticker.",
              },
            ].map((step, index) => (
              <li key={step.title} className="flex gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/20 text-sm font-bold text-deep">
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-bold text-deep">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/70">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="images"
        className="container-content scroll-mt-24 py-12 sm:py-16"
        aria-labelledby="image-gallery-title"
      >
        <p className="eyebrow">Ready to share</p>
        <h2
          id="image-gallery-title"
          className="mt-3 font-serif text-3xl font-bold text-deep sm:text-4xl"
        >
          Their story. Your circle.
        </h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-ink/75">
          Fourteen illustrations about faith, practical care, and the people who
          make this ministry possible. Use them to help others meet Don and
          Patti.
        </p>
        <SocialShareKit />
        <p className="mt-7 max-w-3xl text-sm leading-relaxed text-ink/65">
          These graphics are free to share in support of Don and Patti’s
          ministry. Supply amounts come from Don’s published budget. Supply
          sponsorships are donations for the mission; they are not merchandise
          delivered to the giver.
        </p>
      </section>

      <section
        className="bg-deep py-12 text-white sm:py-16"
        aria-labelledby="help-title"
      >
        <div className="container-content">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold">
            Take the next step
          </p>
          <h2
            id="help-title"
            className="mt-3 font-serif text-3xl font-bold sm:text-4xl"
          >
            Help carry the mission forward.
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-white/80">
            Give toward a practical need, help fill a mission trunk, or visit
            the mission shop to see ways to support the work.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <GiveLink location="share_footer">Give to the mission</GiveLink>
            <Link
              href="/sponsor"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Sponsor supplies
            </Link>
            <Link
              href="/store"
              className="inline-flex min-h-12 items-center px-3 font-semibold text-white underline decoration-white/40 underline-offset-4"
            >
              Visit the mission shop →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

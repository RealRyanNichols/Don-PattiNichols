import type { Metadata } from "next";
import Link from "next/link";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = socialMetadata({
  title: "Our Story — The Nichols Family",
  description: "Who Don & Patti Nichols are: their Christian faith, their family, their mission work in Belize, and the legacy they are building for generations to come.",
  path: "/our-story",
  eyebrow: "Faith · Family · A Life of Service",
  image: "/images/team.jpg",
});

// [NEEDED] The full story, in Don & Patti's own words, plus family photos/videos.
const paragraphs = [
  "This page is more than an “about” page. It is a record — of who Don and Patti Nichols are, what they believe, how they have lived, and the work God has done through them. It is being written for the people they serve today, and for their children, their grandchildren, and the generations who will read it long after.",
  "Don preaches the Word of God. Together, Don and Patti serve on medical mission teams carrying free clinics, Bibles, and the hope of Jesus Christ into the villages of Belize — and they serve their own community at home the same way: personally, faithfully, and in the name of Christ.",
  "Their full story — their faith journey, their family, their years of ministry, and the moments that shaped them — is being gathered now, in their own words, along with photographs and videos from across the years.",
];

const comingToThisPage = [
  "· How Don & Patti met, and their walk of faith together",
  "· Don’s preaching ministry through the years",
  "· The story of how God called them to medical missions",
  "· Family — children, grandchildren, and the heritage of faith",
  "· Photo and video archive from decades of life and ministry",
];

export default function OurStoryPage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Nichols Family
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">Our Story</h1>
        </div>
      </section>

      <section className="container-content max-w-3xl py-14">
        <div className="prose-mission">
          {paragraphs.map((text) => (
            <p key={text.slice(0, 32)}>{text}</p>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border-2 border-dashed border-sea/40 bg-white p-7">
          <p className="eyebrow">Coming to this page</p>
          <ul className="mt-4 space-y-2 text-ink/75">
            {comingToThisPage.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 rounded-2xl bg-sea p-8 text-center text-white">
          <p className="font-serif text-xl italic leading-relaxed sm:text-2xl">
            &ldquo;Go therefore and make disciples of all nations, baptizing them in the name of
            the Father and of the Son and of the Holy Spirit.&rdquo;
          </p>
          <p className="mt-3 text-sm font-bold uppercase tracking-widest text-white/80">
            Matthew 28:19
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/don" className="btn-primary">
            Meet Don
          </Link>
          <Link href="/patti" className="btn-outline">
            Meet Patti
          </Link>
        </div>
      </section>
    </>
  );
}

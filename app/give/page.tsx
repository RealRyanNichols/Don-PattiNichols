import type { Metadata } from "next";
import Link from "next/link";
import GiveLink from "@/components/GiveLink";
import { site } from "@/lib/site";
import { socialMetadata } from "@/lib/seo";

export const metadata: Metadata = socialMetadata({
  title: "Give to the Mission",
  description: "Partner with Don & Patti Nichols to bring free medical care, Bibles, and the hope of Jesus Christ to the villages of Belize. $2.50 places a Bible in someone's hands. $1,200 sends a missionary.",
  path: "/give",
  eyebrow: "Your Gift Goes to the Field",
  image: "/images/clinic-supplies-staged.jpg",
});

// Don's published giving levels — his exact figures and wording.
// Each level names its item up front and links to that item's sales page.
const givingLevels = [
  {
    amount: "$2.50",
    label: "A Bible",
    text: "places a Bible into the hands of someone eager to read God's Word.",
    href: "/sponsor/bible",
  },
  {
    amount: "$3",
    label: "A Hygiene Kit",
    text: "provides a complete hygiene kit filled with practical necessities.",
    href: "/sponsor/hygiene-kit",
  },
  {
    amount: "$5.50",
    label: "A Kit & Bible",
    text: "provides both a hygiene kit and a Bible for one person.",
    href: "/sponsor/kit-and-bible",
  },
  {
    amount: "$25",
    label: "A Ministry Trunk",
    text: "purchases one ministry trunk that will carry supplies to Belize.",
    href: "/sponsor/trunk",
  },
  {
    amount: "$100",
    label: "Pastor & Wife Gift Set",
    text: "provides a study Bible and practical household gifts for a village pastor or his wife.",
    href: "/sponsor/pastor-gift",
  },
  {
    amount: "$200",
    label: "Fly a Trunk to Belize",
    text: "pays the airline baggage fee for one trunk filled with donated supplies.",
    href: "/sponsor/baggage",
  },
  {
    amount: "$1,200",
    label: "Sponsor a Missionary",
    text: "sends one missionary to Belize to serve with medical care, compassion, and the Gospel of Jesus Christ.",
    href: "/sponsor/missionary",
  },
];

// Don's exact wording — do not edit without his approval.
const transparencyIntro = [
  "Every mission trip represents months of planning, preparation, and faithful generosity. While every member of our team volunteers their time to serve, there are significant expenses involved in transporting people, medical equipment, ministry supplies, and hundreds of pounds of donated materials into Belize.",
  "Every dollar entrusted to this ministry is carefully used to maximize the number of people we can serve while ensuring that every patient receives compassionate care completely free of charge. No one is ever charged for a medical evaluation, medications, reading glasses, hygiene supplies, Bibles, prescription medications, or any ministry resource we provide.",
  "Our goal is simple: to remove every possible barrier so that people can receive quality medical care, experience genuine Christian compassion, and hear the life-changing message of Jesus Christ.",
];

// Don's exact wording — do not edit without his approval.
const wordFromTheMission = [
  "Every year, our mission team has the privilege of serving communities where many people have limited access to medical care, prescription medications, vision care, and biblical resources. Through the generosity of faithful supporters, we are able to provide these services completely free of charge while sharing the hope found only in Jesus Christ.",
  "When you partner with this ministry, you become part of every patient we treat, every Bible we place into someone's hands, every pair of reading glasses that restores the ability to read, every hygiene kit that meets a practical need, every pastor we encourage, and every prayer offered in the name of Jesus.",
  "Some supporters are able to sponsor an entire missionary. Others choose to purchase Bibles, reading glasses, hygiene kits, ministry trunks, or help transport supplies into Belize. No matter the size of your gift, every donation becomes part of a ministry that is changing lives both physically and spiritually.",
  "Just as important as financial support are your prayers. We ask you to pray for the safety of our team, for wisdom as medical decisions are made, for strength and encouragement for the pastors who faithfully serve their communities throughout the year, and most importantly, that every person we meet will experience the love of Christ and respond to the truth of the Gospel.",
  "Throughout the coming year, we will share photos, videos, and updates documenting every stage of this mission. You'll see the supplies being purchased, the hygiene kits assembled, the trunks packed, the flights into Belize, the customs process, the transportation to the villages, and, most importantly, the people whose lives are touched through your generosity. We believe every donor deserves to see how God is using their gifts to make an eternal difference.",
  "Whether you choose to give, pray, or share this ministry with others, you are helping carry the love of Jesus Christ beyond borders and into communities where hope is needed every day.",
  "Thank you for believing in this mission. Thank you for investing in people you may never meet this side of Heaven. And thank you for partnering with us as we seek to glorify God by serving others with compassion, excellence, humility, and the unchanging truth of His Word.",
  "Together, we can change lives for eternity.",
];

export default function GivePage() {
  return (
    <>
      <section className="bg-deep py-14 text-white">
        <div className="container-content">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            Partner With the Mission
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">
            Join Us in Changing Lives
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/85">
            The people of Belize are more than names on a map&mdash;they are fathers and mothers,
            grandparents and children, pastors and church families, each created in the image of
            God and deeply loved by Him.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href="#give-now" className="btn-give text-lg">
              Give Now
            </a>
            <a
              href="#monthly"
              className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
            >
              Give Monthly
            </a>
          </div>
        </div>
      </section>

      <section id="give-now" className="container-content py-14 sm:py-16">
        <p className="eyebrow">What a Gift Does</p>
        <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">
          Every gift, large or small, becomes part of something much greater
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {givingLevels.map((level) => (
            <div
              key={level.amount}
              className="flex flex-col rounded-xl border border-ink/10 border-t-2 border-t-gold bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-serif text-3xl font-bold text-sea">{level.amount}</span>
                <span className="font-serif text-lg font-bold text-ink">· {level.label}</span>
              </p>
              <p className="mt-2 flex-1 text-ink/75">
                {level.amount} {level.text}
              </p>
              <Link
                href={level.href}
                className="mt-4 text-sm font-semibold text-gold-dark hover:underline"
              >
                Give this →
              </Link>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-xl bg-sand-dark p-4 text-center text-ink/75">
          Want to pick the exact supplies and watch the trip fill up, item by item?{" "}
          <Link href="/sponsor" className="font-bold text-sea hover:underline">
            Fill the Trunks →
          </Link>
        </p>

        {/* The biggest single gift, featured full-width. Figures and wording
            are Don's published budget — do not change them. */}
        <div className="relative mt-10 overflow-hidden rounded-2xl bg-deep p-8 text-white sm:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 90% at 85% 10%, rgba(201,150,46,0.28), transparent 60%)",
            }}
          />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-gold">
                The Gift That Sends Someone
              </p>
              <h3 className="h-display mt-2 max-w-xl text-3xl !text-white sm:text-4xl">
                <span className="text-gold">$1,200</span> sends one missionary to Belize to serve
                with medical care, compassion, and the Gospel of Jesus Christ.
              </h3>
              <p className="mt-4 max-w-xl text-sm text-white/70">
                Each missionary raises approximately $1,200 to serve on this mission. Every member
                of our team serves as an unpaid volunteer. No one receives a salary or financial
                compensation for participating in this ministry.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/sponsor/missionary" className="btn-give">
                  Sponsor a Missionary
                </Link>
                <a
                  href="#ways-to-give"
                  className="btn-outline !border-white/60 !text-white hover:!bg-white hover:!text-deep"
                >
                  Ways to Give
                </a>
              </div>
            </div>
            <ul className="space-y-3 rounded-xl bg-white/5 p-6 text-sm ring-1 ring-white/15">
              <li className="flex justify-between gap-2">
                <span className="text-white/80">Round-trip airfare</span>
                <span className="font-semibold">$800</span>
              </li>
              <li className="flex justify-between gap-2 border-t border-white/10 pt-3">
                <span className="text-white/80">
                  Lodging, meals, and ground transportation in Belize
                </span>
                <span className="font-semibold">$400</span>
              </li>
              <li className="flex justify-between gap-2 border-t border-white/10 pt-3">
                <span className="font-semibold uppercase tracking-wider text-gold">
                  One missionary
                </span>
                <span className="font-serif text-xl font-bold text-gold">$1,200</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content">
          <p className="eyebrow">You Choose Where It Goes</p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl sm:text-4xl">Designate your gift</h2>
          <p className="mt-3 max-w-2xl text-ink/75">
            Pick the part of the mission God has put on your heart. Every fund is used exactly as
            designated.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {site.giving.funds.map((fund) => (
              <div
                key={fund.key}
                className="flex flex-col rounded-xl border border-ink/10 bg-white p-6 shadow-sm"
              >
                <h3 className="font-serif text-xl font-bold">{fund.name}</h3>
                <p className="mt-2 flex-1 text-sm text-ink/70">{fund.blurb}</p>
                <div className="mt-4">
                  <GiveLink
                    href={fund.paypalUrl || "#ways-to-give"}
                    location="fund_card"
                    fund={fund.key}
                    className="btn-give w-full !px-4 !py-2.5"
                  >
                    Give to This Fund
                  </GiveLink>
                  <p className="mt-2 text-center text-xs text-ink/55">
                    One-time or monthly — you choose at checkout
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="monthly" className="container-content py-14 sm:py-16">
        <div className="rounded-2xl bg-deep p-8 text-white sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Monthly Mission Team
          </p>
          <h2 className="h-display mt-2 max-w-2xl text-3xl !text-white sm:text-4xl">
            The most powerful way to give is monthly
          </h2>
          <p className="mt-4 max-w-2xl text-white/85">
            Recurring gifts let the team plan trips, buy supplies in bulk, and say yes to needs the
            moment they appear — instead of waiting for the next fundraising season. Even $10 a
            month stocks hygiene kits and Bibles all year long.
          </p>
          <p className="mt-4 max-w-2xl text-sm text-white/70">
            Choose any fund above and select &ldquo;monthly&rdquo; at PayPal checkout —
            that&rsquo;s it. Cancel anytime from your PayPal account.
          </p>
          <GiveLink
            location="monthly_section"
            href={site.giving.paypalUrl || "#give-now"}
            className="btn-give mt-6"
          >
            Become a Monthly Partner
          </GiveLink>
        </div>
      </section>

      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content max-w-4xl">
          <p className="eyebrow">Where the Money Goes</p>
          <h2 className="h-display mt-2 text-3xl sm:text-4xl">Full transparency</h2>
          <div className="prose-mission mt-6">
            {transparencyIntro.map((text) => (
              <p key={text.slice(0, 32)}>{text}</p>
            ))}
          </div>

          {/* Don's real budget numbers — load-bearing, do not change. */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">One Missionary</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-sea">$1,200</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                <li className="flex justify-between gap-2">
                  <span>Round-trip airfare</span>
                  <span className="font-semibold">$800</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Lodging, meals, and ground transportation in Belize</span>
                  <span className="font-semibold">$400</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-ink/60">
                Each missionary raises approximately $1,200 to serve on this mission. Every member
                of our team serves as an unpaid volunteer. No one receives a salary or financial
                compensation for participating in this ministry.
              </p>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">Ministry Supplies</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-sea">~$2,215</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                <li className="flex justify-between gap-2">
                  <span>300 hygiene kits</span>
                  <span className="font-semibold">$900</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>250 Bibles</span>
                  <span className="font-semibold">$625</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Gospel tracts</span>
                  <span className="font-semibold">$60</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>300 pairs of reading glasses</span>
                  <span className="font-semibold">$180</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>150 pairs of sunglasses</span>
                  <span className="font-semibold">$150</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Special gifts for three pastors and their wives</span>
                  <span className="font-semibold">$300</span>
                </li>
              </ul>
            </div>

            <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
              <h3 className="font-serif text-lg font-bold">Transport &amp; Logistics</h3>
              <p className="mt-1 font-serif text-3xl font-bold text-sea">~$1,725</p>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                <li className="flex justify-between gap-2">
                  <span>Eight heavy-duty ministry trunks (~$25 each)</span>
                  <span className="font-semibold">$200</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Six additional trunk baggage fees (~$200 each)</span>
                  <span className="font-semibold">$1,200</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Customs fees (based on our most recent trip)</span>
                  <span className="font-semibold">$75</span>
                </li>
                <li className="flex justify-between gap-2">
                  <span>Emergency contingency fund</span>
                  <span className="font-semibold">$250</span>
                </li>
              </ul>
              <p className="mt-4 text-xs text-ink/60">
                Transporting these supplies is a ministry in itself. Every item must be purchased,
                sorted, packed, weighed, checked through the airline, transported internationally,
                cleared through Belize customs, and delivered to remote villages.
              </p>
            </div>
          </div>

          <p className="prose-mission mt-8">
            <span className="font-semibold">
              Every gift matters. Every prayer matters. Every sponsor becomes part of every patient
              we treat, every Bible we distribute, every pastor we encourage, every child we bless,
              and every life touched through the love of Jesus Christ. Together, we are not simply
              funding a mission trip&mdash;we are investing in eternal work that will continue long
              after our team has returned home.
            </span>
          </p>
        </div>
      </section>

      <section id="ways-to-give" className="container-content max-w-4xl py-14 sm:py-16">
        <p className="eyebrow">Ways to Give</p>
        <h2 className="h-display mt-2 text-3xl sm:text-4xl">Give the way that works for you</h2>
        <div className="mt-8 space-y-4">
          <div className="rounded-xl border border-ink/10 border-t-2 border-t-gold bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">
              PayPal — Card, Bank, or PayPal Balance
            </h3>
            <p className="mt-2 text-ink/75">
              PayPal giving is being connected right now and will be live here very soon. The
              options below work today — or{" "}
              <Link href="/#newsletter" className="font-semibold text-sea hover:underline">
                join the email list
              </Link>{" "}
              and we&rsquo;ll tell you the moment online giving opens.
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">Tax-Deductible Giving</h3>
            <p className="mt-2 text-ink/75">
              Details for tax-deductible giving through the mission&rsquo;s sponsoring organization
              are being finalized and will be posted here.
            </p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-6 shadow-sm">
            <h3 className="font-serif text-xl font-bold">By Check</h3>
            <p className="mt-2 text-ink/75">
              Mailing instructions will be posted here.{" "}
              <Link href="/contact" className="font-semibold text-sea hover:underline">
                Contact us
              </Link>{" "}
              and we&rsquo;ll send them to you directly.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-sand-dark py-14 sm:py-16">
        <div className="container-content max-w-3xl">
          <p className="eyebrow">A Word From the Mission</p>
          <h2 className="h-display mt-2 text-3xl sm:text-4xl">
            Together, we can change lives for eternity
          </h2>
          <div className="prose-mission mt-6">
            {wordFromTheMission.map((text) => (
              <p key={text.slice(0, 32)}>{text}</p>
            ))}
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#give-now" className="btn-give">
              Give Now
            </a>
            <Link href="/contact" className="btn-outline">
              Commit to Pray
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

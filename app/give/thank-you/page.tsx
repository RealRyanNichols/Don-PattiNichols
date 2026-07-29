import type { Metadata } from "next";
import Link from "next/link";
import JoinForm from "@/components/JoinForm";
import ShareButton from "@/components/ShareButton";
import { photo } from "@/content/albums";

export const metadata: Metadata = {
  title: "Thank You",
  description: "Thank you for partnering with the mission.",
  robots: { index: false },
};

/**
 * THE MOMENT AFTER A GIFT.
 *
 * The most valuable page on the site for list building. Someone who has just
 * given is more willing to say who they are than at any other point, so this
 * is where the full form lives: name, phone, town, and permission to text
 * during a trip. Everything is optional, and the ask is framed as "where
 * should Don and Patti send the thank-you" — which is the literal truth of
 * what the list is for.
 */
export default function ThankYouPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-deep text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo("1fpRWkrIGlztXxtCaS3DPwbFc27ubSrQr", 1200)}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover object-[50%_30%] opacity-35"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(160deg, rgba(10,61,64,0.94) 0%, rgba(10,61,64,0.80) 55%, rgba(10,61,64,0.92) 100%)",
          }}
        />
        <div className="container-content relative max-w-2xl py-16 text-center sm:py-20">
          <p className="text-sm font-bold uppercase tracking-widest text-gold">
            Gift Received
          </p>
          <h1 className="h-display mt-3 text-4xl !text-white sm:text-5xl">
            Thank you.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            Your gift is now part of every patient treated, every Bible placed
            in someone&rsquo;s hands, every pair of reading glasses that
            restores sight, and every pastor encouraged in the villages of
            Belize.
          </p>
          <p className="mt-5 font-serif text-xl italic text-gold">
            &ldquo;Together, we can change lives for eternity.&rdquo;
          </p>
        </div>
      </section>

      <section className="container-content max-w-xl py-14 sm:py-16">
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink/10 sm:p-8">
          <h2 className="h-display text-2xl">
            Where should Don and Patti send the thank-you?
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
            They write to everyone who gives — it matters to them more than
            almost anything else on this site. Tell them where to find you and
            they&rsquo;ll keep you with them: photographs from the field, what
            your gift bought, and word when the team gets home safe.
          </p>
          <div className="mt-6">
            <JoinForm
              source="post_gift"
              interest="gave"
              askName
              askPhone
              askPlace
              offerTexts
              submitLabel="Send me the updates"
              doneTitle="They'll be in touch."
              doneText="Don and Patti write every supporter themselves. Watch for photographs from the field and a note when the team is home."
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-l-4 border-gold bg-sand-dark p-6">
          <p className="font-serif text-lg font-bold text-ink">
            Do one more thing that costs nothing.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
            Most of the people who give to this mission came because someone
            they trust shared it. You are that someone for a few people.
          </p>
          <div className="mt-4">
            <ShareButton
              title="Don & Patti Nichols — Medical Care for the Body. Hope for the Soul."
              text="Free medical clinics, vision care, and the Gospel in the villages of Belize. I just gave — take a look."
              path="/"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/transparency" className="btn-primary">
            See exactly where it goes
          </Link>
          <Link href="/blog" className="btn-outline">
            Read the latest
          </Link>
        </div>
      </section>
    </>
  );
}

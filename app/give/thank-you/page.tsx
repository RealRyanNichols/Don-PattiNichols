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
 * A supporter follow-up page, not a payment receipt. A visit here is never
 * evidence of a completed gift and must not classify someone as a donor.
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
            Standing with the mission
          </p>
          <h1 className="h-display mt-3 text-4xl !text-white sm:text-5xl">
            Thank you.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-white/85">
            If you completed a gift through PayPal, thank you for supporting Don
            and Patti&rsquo;s work. Check your PayPal receipt or transaction
            history for payment confirmation. This page does not confirm that a
            payment was completed.
          </p>
          <p className="mt-5 font-serif text-xl italic text-gold">
            &ldquo;Together, we can change lives for eternity.&rdquo;
          </p>
        </div>
      </section>

      <section className="container-content max-w-xl py-14 sm:py-16">
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-ink/10 sm:p-8">
          <h2 className="h-display text-2xl">
            Stay connected with Don and Patti
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-ink/70">
            Leave your email if you would like mission updates and photographs
            from the field. You can join whether you gave, prayed, shared their
            story, or are just getting to know them.
          </p>
          <div className="mt-6">
            <JoinForm
              source="giving_thank_you"
              interest="mission_updates"
              askName
              askPhone
              askPlace
              offerTexts
              submitLabel="Send me the updates"
              doneTitle="Your signup is saved."
              doneText="Thank you for staying connected with Don and Patti. Your details are saved for mission updates."
            />
          </div>
        </div>

        <div className="mt-8 rounded-2xl border-l-4 border-gold bg-sand-dark p-6">
          <p className="font-serif text-lg font-bold text-ink">
            Do one more thing that costs nothing.
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-ink/70">
            Help someone else get to know Don and Patti and the people they
            serve. Sharing their story is another way to support the work.
          </p>
          <div className="mt-4">
            <ShareButton
              title="Don & Patti Nichols — Medical Care for the Body. Hope for the Soul."
              text="Get to know Don and Patti: their life, faith, and mission work serving people in Belize."
              path="/"
            />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/transparency" className="btn-primary">
            See the mission budget
          </Link>
          <Link href="/blog" className="btn-outline">
            Read the latest
          </Link>
        </div>
      </section>
    </>
  );
}

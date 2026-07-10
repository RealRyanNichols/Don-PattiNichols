import type { Metadata } from "next";
import Link from "next/link";
import SupplyDrive from "@/components/SupplyDrive";
import VerseRotator from "@/components/VerseRotator";
import { mergeLiveFunding } from "@/content/supplies";
import { fetchFundTotals } from "@/lib/donations";

/** Refresh live donation totals every 5 minutes. */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Fill the Trunks — Sponsor Mission Supplies",
  description:
    "Sponsor the actual supplies flying to Belize: $2.50 sends a Bible, $3 a hygiene kit, $25 a ministry trunk, $200 flies a trunk down. Watch the trip fill up, item by item.",
};

export default async function SponsorPage() {
  const { items, raised } = mergeLiveFunding(await fetchFundTotals());
  return (
    <>
      <section className="relative overflow-hidden bg-deep py-14 text-white">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 60% at 80% -10%, rgba(201,150,46,0.25), transparent 60%)",
          }}
        />
        <div className="container-content relative">
          <p className="text-sm font-semibold uppercase tracking-widest text-gold">
            The Supply Drive
          </p>
          <h1 className="h-display mt-2 text-4xl !text-white sm:text-5xl">Fill the Trunks</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/85">
            Every trunk that flies to Belize is packed with things people gave. Pick what your
            gift becomes — a Bible, a hygiene kit, a pair of reading glasses, the trunk itself —
            and watch the trip fill up.
          </p>
          <div className="mt-6 max-w-2xl">
            <VerseRotator />
          </div>
        </div>
      </section>

      <section className="container-content py-12 sm:py-14">
        <SupplyDrive items={items} raised={raised} />

        <div className="mt-10 rounded-2xl bg-sand-dark p-6 text-center sm:p-8">
          <p className="text-ink/75">
            Online checkout is being connected now — sponsor buttons currently walk you to the
            Ways to Give page, where every gift method works today. Progress bars update as
            sponsorships come in.
          </p>
          <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/give" className="btn-primary">
              All Ways to Give
            </Link>
            <Link href="/behind-the-mission" className="btn-outline">
              See Where It All Goes
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

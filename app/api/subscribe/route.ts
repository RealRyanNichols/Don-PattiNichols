import { NextResponse } from "next/server";
import { supabaseRpc } from "@/lib/supabase";

/**
 * JOIN THE LIST — the one endpoint behind every capture form on the site.
 *
 * Writes through the `join_list` database function rather than inserting
 * directly, which buys three things:
 *   • one row per person, no duplicates, no manual tidying
 *   • a returning supporter can add their phone or town later without ever
 *     being able to read or overwrite anyone's record
 *   • detail is only ever added, never blanked, so a short footer form cannot
 *     wipe out what a longer form already collected
 *
 * Everything except the email is optional on purpose. Asking for a phone
 * number is how a list becomes useful; requiring one is how a list stays
 * small.
 */
const str = (v: unknown, max: number) =>
  typeof v === "string" && v.trim() && v.trim().length <= max ? v.trim() : null;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const email = str(body.email, 320);

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "Please check that email address." },
        { status: 400 },
      );
    }

    const res = await supabaseRpc("join_list", {
      p_email: email,
      p_name: str(body.name, 200),
      p_phone: str(body.phone, 40),
      // What they told us they care about — a fund, a supply item, a trip.
      // This is what turns a mailing list into the right message per person.
      p_interest: str(body.interest, 120),
      p_city_state: str(body.cityState, 120),
      p_wants_texts: body.wantsTexts === true,
      p_source: str(body.source, 80) ?? "website",
    });

    if (res.ok) return NextResponse.json({ ok: true });

    // Never lose a supporter to a database hiccup. The signup lands in the
    // Vercel function log where it can be replayed by hand.
    const detail = await res.text().catch(() => "");
    console.log(
      JSON.stringify({
        kind: "LIST_SIGNUP_FALLBACK",
        email,
        name: body.name ?? null,
        phone: body.phone ?? null,
        interest: body.interest ?? null,
        source: body.source ?? null,
        dbStatus: res.status,
        detail: detail.slice(0, 300),
        at: new Date().toISOString(),
      }),
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";
import { clientIp, isBot, rateLimit } from "@/lib/antispam";
import { sendNotification } from "@/lib/notify";

export async function POST(request: Request) {
  let body: { email?: string; name?: string; phone?: string; company?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  // Honeypot: bots fill the hidden field. Pretend success so they don't retry.
  if (isBot(body.company)) {
    return NextResponse.json({ ok: true });
  }

  // Best-effort rate limit per IP.
  const limit = rateLimit(`subscribe:${clientIp(request)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts — please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const email = (body.email || "").trim().toLowerCase();
  if (!email || !email.includes("@") || email.length > 320) {
    return NextResponse.json({ ok: false, error: "A valid email is required" }, { status: 400 });
  }

  const row: Record<string, unknown> = { email, source: "website" };
  if (body.name && typeof body.name === "string") row.name = body.name.trim().slice(0, 200);
  if (body.phone && typeof body.phone === "string") row.phone = body.phone.trim().slice(0, 50);

  const res = await supabaseInsert("subscribers", row);

  // 409 = duplicate email (unique constraint) — already subscribed is a success.
  if (res.ok || res.status === 409) {
    if (res.ok) {
      const extra = [row.name ? `Name: ${row.name}` : "", row.phone ? `Phone: ${row.phone}` : ""]
        .filter(Boolean)
        .join("\n");
      await sendNotification(
        "New newsletter subscriber",
        `Email: ${email}${extra ? `\n${extra}` : ""}`,
      );
    }
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Could not subscribe" }, { status: 500 });
}

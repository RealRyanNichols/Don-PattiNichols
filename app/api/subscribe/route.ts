import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

export async function POST(request: Request) {
  let body: { email?: string; name?: string; phone?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
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
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Could not subscribe" }, { status: 500 });
}

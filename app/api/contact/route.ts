import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

const VALID_TOPICS = ["prayer", "speaking", "giving", "general"] as const;

/**
 * Contact form, prayer requests, speaking invitations → Supabase `messages` table.
 * If the database is ever unreachable, the message is written to Vercel
 * function logs as a fallback so nothing is ever lost.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, name, email, message } = body ?? {};

    if (
      !name || typeof name !== "string" || name.length > 200 ||
      !email || typeof email !== "string" || !email.includes("@") || email.length > 320 ||
      !message || typeof message !== "string" || message.length > 5000
    ) {
      return NextResponse.json({ ok: false, error: "Missing or invalid fields" }, { status: 400 });
    }

    const safeTopic = VALID_TOPICS.includes(topic) ? topic : "general";

    const res = await supabaseInsert("messages", {
      topic: safeTopic,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    });

    if (res.ok) {
      return NextResponse.json({ ok: true });
    }

    console.log(
      JSON.stringify({
        kind: "CONTACT_MESSAGE_FALLBACK",
        topic: safeTopic,
        name,
        email,
        message,
        dbStatus: res.status,
        at: new Date().toISOString(),
      })
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

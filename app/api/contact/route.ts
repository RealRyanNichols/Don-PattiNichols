import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";

const VALID_TOPICS = ["prayer", "speaking", "giving", "general"] as const;

/**
 * Contact form, prayer requests, speaking invitations → Supabase `messages` table.
 * Only acknowledge a message after durable storage succeeds. Never log its contents.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { topic, name, email, message } = body ?? {};

    if (
      !name ||
      typeof name !== "string" ||
      !name.trim() ||
      name.trim().length > 200 ||
      !email ||
      typeof email !== "string" ||
      !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim()) ||
      email.length > 320 ||
      !message ||
      typeof message !== "string" ||
      !message.trim() ||
      message.trim().length > 5000
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing or invalid fields" },
        { status: 400 },
      );
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

    console.error("CONTACT_SAVE_FAILED", { dbStatus: res.status });
    return NextResponse.json(
      {
        ok: false,
        error:
          "Your message was not saved. Please try again; your words are still in the form.",
      },
      { status: 503 },
    );
  } catch {
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

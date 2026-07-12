import { NextResponse } from "next/server";
import { supabaseInsert } from "@/lib/supabase";
import { clientIp, isBot, rateLimit } from "@/lib/antispam";
import { sendNotification } from "@/lib/notify";

const TOPICS = ["prayer", "speaking", "giving", "general"] as const;

export async function POST(request: Request) {
  let body: { topic?: string; name?: string; email?: string; message?: string; company?: string };
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
  const limit = rateLimit(`contact:${clientIp(request)}`, { limit: 5, windowMs: 60_000 });
  if (!limit.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many messages — please try again in a minute." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSec) } },
    );
  }

  const topic = (body.topic || "general").trim();
  const name = (body.name || "").trim();
  const email = (body.email || "").trim();
  const message = (body.message || "").trim();

  if (!TOPICS.includes(topic as (typeof TOPICS)[number])) {
    return NextResponse.json({ ok: false, error: "Invalid topic" }, { status: 400 });
  }
  if (!name || !email || !email.includes("@") || !message) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and message are required" },
      { status: 400 },
    );
  }

  const res = await supabaseInsert("messages", {
    topic,
    name: name.slice(0, 200),
    email: email.slice(0, 320),
    message: message.slice(0, 5000),
  });

  if (res.ok) {
    await sendNotification(
      `New ${topic} message from ${name}`,
      `Topic: ${topic}\nName: ${name}\nEmail: ${email}\n\n${message}`,
    );
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ ok: false, error: "Could not send message" }, { status: 500 });
}

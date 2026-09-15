import { NextRequest, NextResponse } from "next/server";

// No email/CRM service is wired up yet. When ready, set RESEND_API_KEY and
// CONTACT_NOTIFY_EMAIL and send the message on instead of just logging it.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.name) {
    return NextResponse.json({ error: "Name and email are required." }, { status: 400 });
  }

  const { name, email, phone, comment } = body as {
    name: string;
    email: string;
    phone?: string;
    comment?: string;
  };

  const apiKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.CONTACT_NOTIFY_EMAIL;

  if (!apiKey || !notifyEmail) {
    console.log("[contact] (not configured, logging only)", {
      name,
      email,
      phone,
      comment,
    });
    return NextResponse.json({
      ok: true,
      delivered: false,
      message:
        "Received — note: no email service is configured yet, so this was logged server-side only.",
    });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "shift culture <no-reply@shiftcultr.com>",
      to: notifyEmail,
      reply_to: email,
      subject: `New contact form message from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone ?? "—"}\n\n${comment ?? ""}`,
    }),
  });

  if (!res.ok) {
    return NextResponse.json({ ok: false, delivered: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}

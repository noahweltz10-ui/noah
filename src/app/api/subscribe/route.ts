import { NextRequest, NextResponse } from "next/server";

// No email marketing platform (Klaviyo / Shopify Email / Mailchimp) is wired
// up yet. Set KLAVIYO_PRIVATE_KEY + KLAVIYO_LIST_ID to actually enroll
// subscribers; until then this only logs the address server-side.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email as string | undefined;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Valid email required." }, { status: 400 });
  }

  const klaviyoKey = process.env.KLAVIYO_PRIVATE_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!klaviyoKey || !listId) {
    console.log("[subscribe] (not configured, logging only)", email);
    return NextResponse.json({
      ok: true,
      delivered: false,
      message:
        "Received — note: no email marketing platform is connected yet, so this was logged server-side only.",
    });
  }

  const res = await fetch(
    `https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/`,
    {
      method: "POST",
      headers: {
        Authorization: `Klaviyo-API-Key ${klaviyoKey}`,
        "Content-Type": "application/json",
        revision: "2024-10-15",
      },
      body: JSON.stringify({
        data: {
          type: "profile-subscription-bulk-create-job",
          attributes: {
            profiles: {
              data: [
                {
                  type: "profile",
                  attributes: { email, subscriptions: { email: { marketing: { consent: "SUBSCRIBED" } } } },
                },
              ],
            },
          },
          relationships: { list: { data: { type: "list", id: listId } } },
        },
      }),
    }
  );

  if (!res.ok) {
    return NextResponse.json({ ok: false, delivered: false }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}

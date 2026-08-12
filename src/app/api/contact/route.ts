import { NextResponse } from "next/server";

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";

export const dynamic = "force-dynamic";

type ContactPayload = {
  from_name: string;
  reply_to: string;
  subject: string;
  message: string;
};

function isPayload(value: unknown): value is ContactPayload {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.from_name === "string" &&
    typeof v.reply_to === "string" &&
    typeof v.subject === "string" &&
    typeof v.message === "string"
  );
}

export async function POST(request: Request) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return NextResponse.json(
      { error: "Contact form is not configured.", configured: false },
      { status: 503 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  if (!isPayload(body)) {
    return NextResponse.json(
      { error: "Invalid submission." },
      { status: 400 },
    );
  }

  if (
    body.from_name.trim().length < 2 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.reply_to.trim()) ||
    body.subject.trim().length < 3 ||
    body.message.trim().length < 10
  ) {
    return NextResponse.json(
      { error: "Validation failed." },
      { status: 422 },
    );
  }

  try {
    const res = await fetch(EMAILJS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: {
          from_name: body.from_name,
          reply_to: body.reply_to,
          subject: body.subject,
          message: body.message,
        },
      }),
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Email provider rejected the request." },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Could not reach the email provider." },
      { status: 502 },
    );
  }
}

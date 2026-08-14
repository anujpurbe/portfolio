import { NextResponse } from "next/server";
import { clientIp, rateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const EMAILJS_URL = "https://api.emailjs.com/api/v1.0/email/send";
const MAX_MESSAGE = 1200;
const MAX_NAME = 120;
const MAX_SUBJECT = 200;

type ContactPayload = {
  from_name: string;
  reply_to: string;
  subject: string;
  message: string;
  website?: string;
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

function isValid(body: ContactPayload) {
  const email = body.reply_to.trim();
  return (
    body.from_name.trim().length >= 2 &&
    body.from_name.trim().length <= MAX_NAME &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    body.subject.trim().length >= 3 &&
    body.subject.trim().length <= MAX_SUBJECT &&
    body.message.trim().length >= 10 &&
    body.message.trim().length <= MAX_MESSAGE
  );
}

async function deliverViaEmail(body: ContactPayload) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  if (!serviceId || !templateId || !publicKey) return false;

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
    return res.ok;
  } catch {
    return false;
  }
}

async function storeViaSupabase(
  body: ContactPayload,
  request: Request,
  ip: string,
) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return false;

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/messages`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        name: body.from_name.trim(),
        email: body.reply_to.trim(),
        subject: body.subject.trim(),
        message: body.message.trim(),
        status: "new",
        ip,
        user_agent: request.headers.get("user-agent")?.slice(0, 500) ?? null,
      }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (rateLimited(ip, 5, 60 * 60 * 1000, "contact")) {
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      { status: 429 },
    );
  }

  const body: unknown = await request.json().catch(() => null);
  if (!isPayload(body)) {
    return NextResponse.json(
      { error: "Invalid submission." },
      { status: 400 },
    );
  }

  if (body.website) {
    return NextResponse.json({ ok: true });
  }

  if (!isValid(body)) {
    return NextResponse.json(
      { error: "Validation failed." },
      { status: 422 },
    );
  }

  const [emailOk, stored] = await Promise.all([
    deliverViaEmail(body),
    storeViaSupabase(body, request, ip),
  ]);

  const anyDelivered = emailOk || stored;
  const anyConfigured =
    Boolean(
      process.env.EMAILJS_SERVICE_ID &&
        process.env.EMAILJS_TEMPLATE_ID &&
        process.env.EMAILJS_PUBLIC_KEY,
    ) || Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!anyConfigured) {
    return NextResponse.json(
      { error: "Contact form is not configured.", configured: false },
      { status: 503 },
    );
  }

  if (!anyDelivered) {
    return NextResponse.json(
      { error: "Message could not be delivered." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

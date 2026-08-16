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

// The visitor's submitted email is used only as the Reply-To address. EmailJS
// supports `reply_to` as a safe Reply-To override; the From address is always
// the email service's sender, so nothing is spoofed. The email is never
// treated as verified.
async function deliverViaEmail(body: ContactPayload) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const toEmail = process.env.EMAILJS_TO_EMAIL;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY?.trim();
  if (!serviceId || !templateId || !publicKey || !toEmail) {
    console.error(
      "[contact] email not configured",
      JSON.stringify({
        serviceId: Boolean(serviceId),
        templateId: Boolean(templateId),
        publicKey: Boolean(publicKey),
        toEmail: Boolean(toEmail),
      }),
    );
    return false;
  }

  try {
    const res = await fetch(EMAILJS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey || undefined,
        template_params: {
          to_email: toEmail,
          from_name: body.from_name,
          reply_to: body.reply_to,
          subject: body.subject,
          message: body.message,
          submitted_at: new Date().toLocaleString("en-US", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(
        "[contact] emailjs error",
        JSON.stringify({
          status: res.status,
          body: text.slice(0, 300),
          publicKey: publicKey,
          privateKeyPrefix: (privateKey ?? "").slice(0, 4) + "…",
          privateKeyLength: privateKey?.length ?? 0,
        }),
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error(
      "[contact] emailjs network error",
      err instanceof Error ? err.message : String(err),
    );
    return false;
  }
}

async function storeViaSupabase(
  body: ContactPayload,
  request: Request,
  ip: string,
): Promise<string | null> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;

  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
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
    if (!res.ok) return null;
    const rows = (await res.json()) as Array<{ id: string }>;
    return rows[0]?.id ?? null;
  } catch {
    return null;
  }
}

async function setEmailStatus(id: string, status: "pending" | "sent" | "failed") {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return;
  try {
    await fetch(
      `${url.replace(/\/$/, "")}/rest/v1/contact_messages?id=eq.${encodeURIComponent(id)}`,
      {
        method: "PATCH",
        headers: {
          apikey: key,
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({ email_status: status }),
      },
    );
  } catch {
    // Best-effort only; the message is already stored and the failure is
    // surfaced through the admin panel's email_status flag.
  }
}

export async function POST(request: Request) {
  const ip = clientIp(request);
  if (await rateLimited(ip, 5, 60 * 60 * 1000, "contact")) {
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

  // 1. Persist first — the message must be stored before anything else.
  const rowId = await storeViaSupabase(body, request, ip);
  if (!rowId) {
    return NextResponse.json(
      { error: "Message couldn't be stored right now." },
      { status: 502 },
    );
  }

  // 2. Notify the portfolio owner.
  const emailOk = await deliverViaEmail(body);
  if (!emailOk) {
    console.error(
      "[contact] email notification failed",
      JSON.stringify({
        rowId,
        name: body.from_name,
        email: body.reply_to,
        subject: body.subject,
      }),
    );
  }

  // 3. Mark the outcome so the admin panel can flag delivery failures.
  await setEmailStatus(rowId, emailOk ? "sent" : "failed");

  // 4. The message is securely stored, so the visitor gets a success response
  // regardless of the email outcome. Provider errors and keys are never
  // exposed to the client.
  return NextResponse.json({ ok: true });
}

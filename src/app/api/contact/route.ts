import { NextResponse } from "next/server";
import { MESSAGE_MIN_LENGTH, MESSAGE_MAX_LENGTH } from "@/lib/constants";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

export type ContactPayload = {
  name: string;
  phone: string;
  email: string;
  serviceType: string;
  frequency: string;
  address: string;
  message: string;
  // Honeypot: real visitors never fill this in — bots that fill every field do.
  company: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Server-side mirror of the client-side rules in ContactForm — never trust the client alone. */
export function validateContactPayload(body: Partial<ContactPayload>): string | null {
  if (!body.name?.trim()) return "Name is required.";
  if (!body.phone?.trim()) return "Phone is required.";
  if (!body.email?.trim()) return "Email is required.";

  const messageLength = body.message?.trim().length ?? 0;
  if (messageLength < MESSAGE_MIN_LENGTH) {
    return `Please tell us a bit more — at least ${MESSAGE_MIN_LENGTH} characters.`;
  }
  if (messageLength > MESSAGE_MAX_LENGTH) {
    return `Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`;
  }

  return null;
}

export async function POST(request: Request) {
  let body: Partial<ContactPayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { name, phone, email, serviceType, frequency, address, message, company } = body;

  // Bots fill hidden fields; real users leave this blank. Pretend success either way.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validateContactPayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) {
    console.error("[contact] missing RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL");
    return NextResponse.json(
      { error: "The contact form isn't configured yet. Please call or text us instead." },
      { status: 500 }
    );
  }

  const html = `
    <h2>New quote request — Sisters Cleaning Service</h2>
    <p><strong>Name:</strong> ${escapeHtml(name!)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone!)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email!)}</p>
    <p><strong>Service:</strong> ${escapeHtml(serviceType ?? "—")}</p>
    <p><strong>Frequency:</strong> ${escapeHtml(frequency ?? "—")}</p>
    <p><strong>Address / area:</strong> ${escapeHtml(address ?? "—")}</p>
    <p><strong>Message:</strong><br />${escapeHtml(message!).replace(/\n/g, "<br />")}</p>
  `;

  const res = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: toEmail,
      reply_to: email,
      subject: `New quote request from ${name}`,
      html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("[contact] Resend request failed:", res.status, detail);
    return NextResponse.json(
      { error: "Something went wrong sending your message. Please call or text us instead." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

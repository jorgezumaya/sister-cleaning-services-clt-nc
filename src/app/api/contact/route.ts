import { NextResponse } from "next/server";
import {
  MESSAGE_MIN_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
  MIN_SUBMIT_SECONDS,
  SERVICE_TYPES,
  FREQUENCIES,
} from "@/lib/constants";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

// Deliberately permissive (catches "no @", "no domain") rather than a strict
// RFC 5322 pattern — the goal is rejecting obvious garbage, not gatekeeping
// valid-but-unusual addresses. Resend itself rejects anything it can't send to.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const VALID_SERVICE_TYPES = new Set<string>(SERVICE_TYPES.map(s => s.name));
const VALID_FREQUENCIES = new Set<string>(FREQUENCIES.map(f => f.label));

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
  // Set client-side to the form's render time (ms epoch); a submission that
  // arrives too soon after that to be human is treated like the honeypot.
  renderedAt: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Strips control/newline characters from a single-line field and caps its length. */
function sanitizeLine(value: string, maxLength: number): string {
  return value
    .replace(/[\r\n\t\x00-\x1f\x7f]/g, " ")
    .trim()
    .slice(0, maxLength);
}

/** Server-side mirror of the client-side rules in ContactForm — never trust the client alone. */
export function validateContactPayload(body: Partial<ContactPayload>): string | null {
  const name = sanitizeLine(body.name ?? "", NAME_MAX_LENGTH);
  const phone = sanitizeLine(body.phone ?? "", PHONE_MAX_LENGTH);
  const email = sanitizeLine(body.email ?? "", 254);
  const serviceType = sanitizeLine(body.serviceType ?? "", 100);
  const frequency = sanitizeLine(body.frequency ?? "", 100);

  if (!name) return "Name is required.";
  if (!phone) return "Phone is required.";
  if (!email) return "Email is required.";
  if (!EMAIL_RE.test(email)) return "Please enter a valid email address.";
  if (serviceType && !VALID_SERVICE_TYPES.has(serviceType)) return "Invalid service type.";
  if (frequency && !VALID_FREQUENCIES.has(frequency)) return "Invalid frequency.";

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

  const { company, renderedAt } = body;

  // Bots fill hidden fields; real users leave this blank. Pretend success either way.
  if (company) {
    return NextResponse.json({ ok: true });
  }

  // Bots typically submit within milliseconds of loading the page; a real
  // visitor needs at least a few seconds to fill out every field. Missing or
  // malformed timing data is treated the same as failing the check.
  const elapsedMs = Date.now() - Number(renderedAt);
  if (!Number.isFinite(elapsedMs) || elapsedMs < MIN_SUBMIT_SECONDS * 1000) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validateContactPayload(body);
  if (validationError) {
    return NextResponse.json({ error: validationError }, { status: 400 });
  }

  const name = sanitizeLine(body.name!, NAME_MAX_LENGTH);
  const phone = sanitizeLine(body.phone!, PHONE_MAX_LENGTH);
  const email = sanitizeLine(body.email!, 254);
  const serviceType = sanitizeLine(body.serviceType ?? "", 100);
  const frequency = sanitizeLine(body.frequency ?? "", 100);
  const address = sanitizeLine(body.address ?? "", ADDRESS_MAX_LENGTH);
  const message = body.message!.trim().slice(0, MESSAGE_MAX_LENGTH);

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
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Service:</strong> ${escapeHtml(serviceType || "—")}</p>
    <p><strong>Frequency:</strong> ${escapeHtml(frequency || "—")}</p>
    <p><strong>Address / area:</strong> ${escapeHtml(address || "—")}</p>
    <p><strong>Message:</strong><br />${escapeHtml(message).replace(/\n/g, "<br />")}</p>
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

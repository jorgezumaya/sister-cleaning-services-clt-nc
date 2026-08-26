"use client";

import { useState, type FormEvent } from "react";
import {
  SERVICE_TYPES,
  FREQUENCIES,
  MESSAGE_MIN_LENGTH,
  MESSAGE_MAX_LENGTH,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
} from "@/lib/constants";

// The GitHub Pages preview is a static export with no /api/contact route
// (see next.config.ts) — this flag lets the form degrade gracefully there
// instead of silently 404ing.
const IS_STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

type Status = "idle" | "submitting" | "success" | "error" | "preview";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");

  const messageLength = message.trim().length;
  const messageTooShort = messageLength > 0 && messageLength < MESSAGE_MIN_LENGTH;
  const messageTooLong = messageLength > MESSAGE_MAX_LENGTH;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    const email = String(payload.email ?? "").trim();
    if (!email) {
      setStatus("error");
      setErrorMessage("Email is required.");
      return;
    }

    if (messageLength < MESSAGE_MIN_LENGTH) {
      setStatus("error");
      setErrorMessage(`Please tell us a bit more — at least ${MESSAGE_MIN_LENGTH} characters.`);
      return;
    }

    if (messageLength > MESSAGE_MAX_LENGTH) {
      setStatus("error");
      setErrorMessage(`Please keep your message under ${MESSAGE_MAX_LENGTH} characters.`);
      return;
    }

    if (IS_STATIC_PREVIEW) {
      setStatus("preview");
      return;
    }

    setStatus("submitting");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      setMessage("");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-bold text-brand-950">Thanks — message sent!</h3>
        <p className="mt-2 text-sm text-foreground/70">
          We&apos;ll get back to you shortly. For anything urgent, feel free to call or text too.
        </p>
      </div>
    );
  }

  if (status === "preview") {
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-bold text-brand-950">This is a preview site</h3>
        <p className="mt-2 text-sm text-foreground/70">
          The quote form isn&apos;t connected here yet. Please call or text{" "}
          <a href={BUSINESS_PHONE_TEL} className="font-semibold text-brand-800 underline">
            {BUSINESS_PHONE_DISPLAY}
          </a>{" "}
          and we&apos;ll get back to you right away.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-4">
      {/* Honeypot — hidden from real visitors via CSS, bots fill it anyway. */}
      <label className="absolute left-[-9999px]" aria-hidden="true">
        Company
        <input type="text" name="company" tabIndex={-1} autoComplete="off" />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required autoComplete="name" />
        <Field label="Phone" name="phone" type="tel" required autoComplete="tel" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" name="email" type="email" required autoComplete="email" />
        <Field label="Address / area" name="address" autoComplete="address-level2" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Service" name="serviceType" options={SERVICE_TYPES.map(s => s.name)} />
        <SelectField label="Frequency" name="frequency" options={FREQUENCIES} />
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label className="block text-sm font-medium text-brand-900" htmlFor="message">
            Tell us what you need
          </label>
          <span
            className={`text-xs ${
              messageTooShort || messageTooLong ? "font-semibold text-red-600" : "text-foreground/50"
            }`}
          >
            {messageLength} / {MESSAGE_MAX_LENGTH}
          </span>
        </div>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          value={message}
          onChange={e => setMessage(e.target.value)}
          maxLength={MESSAGE_MAX_LENGTH}
          aria-describedby="message-hint"
          className="w-full rounded-xl border border-brand-100 px-4 py-2.5 text-sm outline-none transition-colors duration-150 hover:border-brand-300 focus:border-brand-500"
        />
        <p id="message-hint" className="mt-1 text-xs text-foreground/50">
          Minimum {MESSAGE_MIN_LENGTH} characters.
        </p>
      </div>

      {status === "error" && (
        <p className="text-sm font-medium text-red-600">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md disabled:pointer-events-none disabled:translate-y-0 disabled:opacity-60 disabled:shadow-sm"
      >
        {status === "submitting" ? "Sending…" : "Send Request"}
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-brand-900" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-brand-100 px-4 py-2.5 text-sm outline-none transition-colors duration-150 hover:border-brand-300 focus:border-brand-500"
      />
    </div>
  );
}

function SelectField({ label, name, options }: { label: string; name: string; options: readonly string[] }) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-brand-900" htmlFor={name}>
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue=""
        className="w-full cursor-pointer rounded-xl border border-brand-100 bg-white px-4 py-2.5 text-sm outline-none transition-colors duration-150 hover:border-brand-300 focus:border-brand-500"
      >
        <option value="" disabled>
          Select {label.toLowerCase()}
        </option>
        {options.map(opt => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

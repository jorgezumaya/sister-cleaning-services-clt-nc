"use client";

import { useState, type FormEvent } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  SERVICE_TYPES,
  FREQUENCIES,
  MESSAGE_MIN_LENGTH,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  ADDRESS_MAX_LENGTH,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
} from "@/lib/constants";

// The GitHub Pages preview is a static export with no /api/contact route
// (see next.config.ts) — this flag lets the form degrade gracefully there
// instead of silently 404ing.
const IS_STATIC_PREVIEW = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";

type Status = "idle" | "submitting" | "success" | "error" | "preview";

export default function ContactForm() {
  const { t } = useLanguage();
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [message, setMessage] = useState("");
  // Anti-spam: records when the form first rendered, so the server can
  // reject submissions that arrive too fast to be a real person typing.
  const [renderedAt] = useState(() => Date.now());

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
      setErrorMessage(t("contactForm.errorEmailRequired"));
      return;
    }

    if (messageLength < MESSAGE_MIN_LENGTH) {
      setStatus("error");
      setErrorMessage(t("contactForm.errorMessageTooShort", { min: MESSAGE_MIN_LENGTH }));
      return;
    }

    if (messageLength > MESSAGE_MAX_LENGTH) {
      setStatus("error");
      setErrorMessage(t("contactForm.errorMessageTooLong", { max: MESSAGE_MAX_LENGTH }));
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
        throw new Error(body?.error ?? t("contactForm.errorGeneric"));
      }

      setStatus("success");
      setMessage("");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : t("contactForm.errorGeneric"));
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-bold text-brand-950">{t("contactForm.successTitle")}</h3>
        <p className="mt-2 text-sm text-foreground/70">{t("contactForm.successBody")}</p>
      </div>
    );
  }

  if (status === "preview") {
    return (
      <div className="rounded-2xl bg-brand-50 p-8 text-center">
        <h3 className="text-lg font-bold text-brand-950">{t("contactForm.previewTitle")}</h3>
        <p className="mt-2 text-sm text-foreground/70">
          {t("contactForm.previewBody")}{" "}
          <a href={BUSINESS_PHONE_TEL} className="font-semibold text-brand-800 underline">
            {BUSINESS_PHONE_DISPLAY}
          </a>
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
      <input type="hidden" name="renderedAt" value={renderedAt} />

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label={t("contactForm.name")}
          name="name"
          required
          autoComplete="name"
          maxLength={NAME_MAX_LENGTH}
        />
        <Field
          label={t("contactForm.phone")}
          name="phone"
          type="tel"
          required
          autoComplete="tel"
          maxLength={PHONE_MAX_LENGTH}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label={t("contactForm.email")} name="email" type="email" required autoComplete="email" />
        <Field
          label={t("contactForm.address")}
          name="address"
          autoComplete="address-level2"
          maxLength={ADDRESS_MAX_LENGTH}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label={t("contactForm.service")}
          selectLabel={t("contactForm.selectPrefix")}
          name="serviceType"
          options={SERVICE_TYPES.map(s => ({ value: s.name, label: t(`serviceTypes.${s.key}.name`) }))}
        />
        <SelectField
          label={t("contactForm.frequency")}
          selectLabel={t("contactForm.selectPrefix")}
          name="frequency"
          options={FREQUENCIES.map(f => ({ value: f.label, label: t(`frequencies.${f.key}`) }))}
        />
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between">
          <label className="block text-sm font-medium text-brand-900" htmlFor="message">
            {t("contactForm.message")}
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
          {t("contactForm.messageHint", { min: MESSAGE_MIN_LENGTH })}
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
        {status === "submitting" ? t("contactForm.submitting") : t("contactForm.submit")}
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
  maxLength,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
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
        maxLength={maxLength}
        className="w-full rounded-xl border border-brand-100 px-4 py-2.5 text-sm outline-none transition-colors duration-150 hover:border-brand-300 focus:border-brand-500"
      />
    </div>
  );
}

function SelectField({
  label,
  selectLabel,
  name,
  options,
}: {
  label: string;
  selectLabel: string;
  name: string;
  options: { value: string; label: string }[];
}) {
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
          {selectLabel} {label.toLowerCase()}
        </option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

"use client";

import type { SVGProps } from "react";
import { useLanguage } from "@/lib/i18n";
import {
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_PHONE_SMS,
  BUSINESS_WHATSAPP,
} from "@/lib/constants";

const CONTACT_TO_EMAIL = "info@sisterscleaningservicenc.com";

/**
 * tel: / sms: / wa.me / mailto: links each resolve to the right native app
 * per device (phone dialer or Messages on mobile, WhatsApp Web or the
 * default mail client on desktop) without any user-agent sniffing.
 */
export default function ContactButtons({ compact = false }: { compact?: boolean }) {
  const { t } = useLanguage();

  const actions = [
    { key: "call", label: t("contactButtons.call"), sub: BUSINESS_PHONE_DISPLAY, href: BUSINESS_PHONE_TEL, icon: PhoneIcon },
    { key: "text", label: t("contactButtons.text"), sub: t("contactButtons.textSub"), href: BUSINESS_PHONE_SMS, icon: TextIcon },
    { key: "whatsapp", label: t("contactButtons.whatsapp"), sub: t("contactButtons.whatsappSub"), href: BUSINESS_WHATSAPP, icon: WhatsAppIcon },
    { key: "email", label: t("contactButtons.email"), sub: t("contactButtons.emailSub"), href: `mailto:${CONTACT_TO_EMAIL}`, icon: MailIcon },
  ];

  return (
    <div
      className={`grid gap-3 ${
        compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4"
      }`}
    >
      {actions.map(({ key, label, sub, href, icon: Icon }) => (
        <a
          key={key}
          href={href}
          className="flex flex-col items-center gap-1.5 rounded-xl border border-brand-100 bg-white px-3 py-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-brand-500 hover:shadow-md"
        >
          <Icon className="h-6 w-6 text-brand-700" />
          <span className="text-sm font-semibold text-brand-900">{label}</span>
          {!compact && <span className="text-xs text-foreground/60">{sub}</span>}
        </a>
      ))}
    </div>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 5h16v11H8l-4 4V5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2Zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1 1 12 20Zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1a6.6 6.6 0 0 1-3.3-2.9c-.2-.3.2-.3.5-.9.1-.1.1-.3 0-.4L9.2 8.7c-.2-.4-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 2s.8 2.3 1 2.5c.1.1 1.6 2.5 4 3.5.5.2 1 .4 1.3.5.5.2 1 .1 1.4-.1.4-.2 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z" />
    </svg>
  );
}

function MailIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 5h16v14H4z" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 6 8 7 8-7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

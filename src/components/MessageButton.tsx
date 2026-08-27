"use client";

import { useEffect, useRef, useState, type SVGProps } from "react";
import { useLanguage } from "@/lib/i18n";
import { BUSINESS_PHONE_SMS, BUSINESS_WHATSAPP } from "@/lib/constants";

/**
 * iOS and macOS Messages handles sms: links natively and well, so Apple
 * platforms go straight there with no extra prompt. Android and Windows have
 * no guaranteed default texting app, so we ask: Text (SMS) or WhatsApp.
 */
function isApplePlatform() {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPod|iPad|Macintosh/.test(navigator.userAgent);
}

export default function MessageButton({
  className,
  showLabel = false,
  menuAlign = "right",
}: {
  className?: string;
  showLabel?: boolean;
  menuAlign?: "left" | "right";
}) {
  const { t } = useLanguage();
  const [isApple, setIsApple] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsApple(isApplePlatform());
  }, []);

  useEffect(() => {
    if (!open) return;
    const handlePointer = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setOpen(false);
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  const label = t("contactButtons.text");

  if (isApple) {
    return (
      <a href={BUSINESS_PHONE_SMS} aria-label={label} className={className}>
        <MessageIcon className="h-5 w-5" />
        {showLabel && <span>{label}</span>}
      </a>
    );
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        className={className}
      >
        <MessageIcon className="h-5 w-5" />
        {showLabel && <span>{label}</span>}
      </button>
      {open && (
        <div
          role="menu"
          className={`absolute top-full z-10 mt-2 w-44 overflow-hidden rounded-xl border border-brand-100 bg-white shadow-lg ${
            menuAlign === "right" ? "right-0" : "left-0"
          }`}
        >
          <a
            role="menuitem"
            href={BUSINESS_PHONE_SMS}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-900 hover:bg-brand-50"
          >
            <MessageIcon className="h-4 w-4" />
            {t("contactButtons.text")}
          </a>
          <a
            role="menuitem"
            href={BUSINESS_WHATSAPP}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-brand-900 hover:bg-brand-50"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {t("contactButtons.whatsapp")}
          </a>
        </div>
      )}
    </div>
  );
}

function MessageIcon(props: SVGProps<SVGSVGElement>) {
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

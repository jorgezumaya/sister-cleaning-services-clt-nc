"use client";

import Link from "next/link";
import { useState, type SVGProps } from "react";
import { usePathname } from "next/navigation";
import FacebookIcon from "@/components/FacebookIcon";
import LanguageSwitch from "@/components/LanguageSwitch";
import MessageButton from "@/components/MessageButton";
import { useLanguage } from "@/lib/i18n";
import {
  BUSINESS_NAME,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_FACEBOOK,
  NAV_LINKS,
} from "@/lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-white transition-transform duration-300 group-hover:rotate-12 group-hover:bg-accent-500">
            <SparkleIcon className="h-5 w-5" />
          </span>
          <span className="text-base font-bold leading-tight text-brand-900 sm:text-lg">
            {BUSINESS_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(link => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-medium transition-colors duration-200 hover:text-brand-800 ${
                  active ? "text-brand-800" : "text-foreground/70"
                }`}
              >
                {t(`nav.${link.key}`)}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-accent-500 transition-all duration-300 ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          <LanguageSwitch compact />
          <a
            href={BUSINESS_FACEBOOK}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("header.facebookLabel")}
            className="text-brand-800 transition-colors duration-200 hover:text-accent-600"
          >
            <FacebookIcon className="h-5 w-5" />
          </a>
          <a
            href={BUSINESS_PHONE_TEL}
            aria-label={t("header.callLabel", { phone: BUSINESS_PHONE_DISPLAY })}
            className="text-brand-800 transition-colors duration-200 hover:text-accent-600"
          >
            <PhoneIcon className="h-5 w-5" />
          </a>
          <MessageButton
            menuAlign="right"
            className="text-brand-800 transition-colors duration-200 hover:text-accent-600"
          />
          <Link
            href="/contact"
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md"
          >
            {t("header.getFreeQuote")}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <LanguageSwitch compact />
          <button
            type="button"
            aria-label={t("header.toggleMenu")}
            aria-expanded={open}
            onClick={() => setOpen(v => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-100 text-brand-800 transition-colors duration-150 hover:bg-brand-50"
          >
            <MenuIcon open={open} className="h-5 w-5" />
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  pathname === link.href
                    ? "bg-brand-50 text-brand-800"
                    : "text-foreground/70 hover:bg-brand-50 hover:text-brand-800"
                }`}
              >
                {t(`nav.${link.key}`)}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={BUSINESS_PHONE_TEL}
              aria-label={t("header.callLabel", { phone: BUSINESS_PHONE_DISPLAY })}
              className="flex items-center justify-center gap-2 rounded-lg border border-brand-100 px-3 py-2.5 text-center text-sm font-semibold text-brand-800 transition-colors duration-150 hover:border-brand-500 hover:bg-brand-50"
            >
              <PhoneIcon className="h-4 w-4" />
              {t("contactButtons.call")}
            </a>
            <MessageButton
              showLabel
              menuAlign="left"
              className="flex items-center justify-center gap-2 rounded-lg border border-brand-100 px-3 py-2.5 text-center text-sm font-semibold text-brand-800 transition-colors duration-150 hover:border-brand-500 hover:bg-brand-50"
            />
            <a
              href={BUSINESS_FACEBOOK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-lg border border-brand-100 px-3 py-2.5 text-center text-sm font-semibold text-brand-800 transition-colors duration-150 hover:border-brand-500 hover:bg-brand-50"
            >
              <FacebookIcon className="h-4 w-4" />
              Facebook
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-accent-500 px-3 py-2.5 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-accent-600"
            >
              {t("header.getFreeQuote")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function PhoneIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.5 21 3 14.5 3 6a2 2 0 0 1 2-2Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2 14 9 21 12 14 15 12 22 10 15 3 12 10 9 12 2Z" />
    </svg>
  );
}

function MenuIcon({ open, ...props }: SVGProps<SVGSVGElement> & { open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      {open ? (
        <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
      ) : (
        <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
      )}
    </svg>
  );
}

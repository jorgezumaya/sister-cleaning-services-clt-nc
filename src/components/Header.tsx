"use client";

import Link from "next/link";
import { useState, type SVGProps } from "react";
import { usePathname } from "next/navigation";
import { BUSINESS_NAME, BUSINESS_PHONE_DISPLAY, BUSINESS_PHONE_TEL, NAV_LINKS } from "@/lib/constants";

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-800 text-white">
            <SparkleIcon className="h-5 w-5" />
          </span>
          <span className="text-base font-bold leading-tight text-brand-900 sm:text-lg">
            {BUSINESS_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition hover:text-brand-700 ${
                pathname === link.href ? "text-brand-800" : "text-foreground/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a href={BUSINESS_PHONE_TEL} className="text-sm font-semibold text-brand-800">
            {BUSINESS_PHONE_DISPLAY}
          </a>
          <Link
            href="/contact"
            className="rounded-full bg-accent-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
          >
            Get a Free Quote
          </Link>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-brand-100 text-brand-800 md:hidden"
        >
          <MenuIcon open={open} className="h-5 w-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-brand-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {NAV_LINKS.map(link => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium ${
                  pathname === link.href
                    ? "bg-brand-50 text-brand-800"
                    : "text-foreground/70 hover:bg-brand-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <a
              href={BUSINESS_PHONE_TEL}
              className="rounded-lg border border-brand-100 px-3 py-2.5 text-center text-sm font-semibold text-brand-800"
            >
              Call {BUSINESS_PHONE_DISPLAY}
            </a>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-accent-500 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Get a Free Quote
            </Link>
          </div>
        </div>
      )}
    </header>
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

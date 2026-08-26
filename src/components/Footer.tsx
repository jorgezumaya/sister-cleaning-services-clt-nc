import Link from "next/link";
import type { ReactNode } from "react";
import {
  BUSINESS_NAME,
  BUSINESS_TAGLINE,
  BUSINESS_PHONE_DISPLAY,
  BUSINESS_PHONE_TEL,
  BUSINESS_EMAIL_DISPLAY,
  NAV_LINKS,
  SERVICE_AREAS,
} from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-brand-950 text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="text-lg font-bold">{BUSINESS_NAME}</p>
          <p className="mt-1 text-sm text-white/70">{BUSINESS_TAGLINE}</p>
          <p className="mt-4 text-sm text-white/70">
            <FooterLink href={BUSINESS_PHONE_TEL}>{BUSINESS_PHONE_DISPLAY}</FooterLink>
          </p>
          <p className="text-sm text-white/70">
            <FooterLink href={`mailto:${BUSINESS_EMAIL_DISPLAY}`}>{BUSINESS_EMAIL_DISPLAY}</FooterLink>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Site</p>
          <ul className="mt-3 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <FooterLink href={link.href}>{link.label}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Serving</p>
          <div className="mt-3 flex flex-wrap gap-x-2 gap-y-1.5">
            {SERVICE_AREAS.map(area => (
              <span
                key={area}
                className="cursor-default rounded-full border border-white/10 px-2.5 py-1 text-xs font-medium text-white/70 transition-all duration-200 hover:border-accent-500/60 hover:bg-accent-500/10 hover:text-white"
              >
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:px-6">
        © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

const underlineLink =
  "group relative inline-block text-sm text-white/70 transition-colors duration-200 hover:text-white " +
  "after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-accent-500 " +
  "after:transition-all after:duration-300 hover:after:w-full";

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={underlineLink}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={underlineLink}>
      {children}
    </a>
  );
}

import Link from "next/link";
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
            <a href={BUSINESS_PHONE_TEL} className="hover:text-white">{BUSINESS_PHONE_DISPLAY}</a>
          </p>
          <p className="text-sm text-white/70">
            <a href={`mailto:${BUSINESS_EMAIL_DISPLAY}`} className="hover:text-white">{BUSINESS_EMAIL_DISPLAY}</a>
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Site</p>
          <ul className="mt-3 flex flex-col gap-2">
            {NAV_LINKS.map(link => (
              <li key={link.href}>
                <Link href={link.href} className="text-sm text-white/70 hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/50">Serving</p>
          <p className="mt-3 text-sm text-white/70">
            {SERVICE_AREAS.join(", ")} &amp; nearby areas
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-4 text-center text-xs text-white/50 sm:px-6">
        © {new Date().getFullYear()} {BUSINESS_NAME}. All rights reserved.
      </div>
    </footer>
  );
}

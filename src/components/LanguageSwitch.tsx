"use client";

import type { SVGProps } from "react";
import { useLanguage, type Lang } from "@/lib/i18n";

const options: { lang: Lang; Flag: (props: SVGProps<SVGSVGElement>) => React.JSX.Element }[] = [
  { lang: "en", Flag: USFlagIcon },
  { lang: "es", Flag: MXFlagIcon },
];

export default function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label="Language"
      className="inline-flex items-center gap-0.5 rounded-full border border-brand-100 bg-white p-0.5"
    >
      {options.map(({ lang: optionLang, Flag }) => {
        const active = lang === optionLang;
        return (
          <button
            key={optionLang}
            type="button"
            onClick={() => setLang(optionLang)}
            aria-pressed={active}
            aria-label={optionLang === "en" ? t("language.switchToEnglish") : t("language.switchToSpanish")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold transition-all duration-200 ${
              active
                ? "bg-brand-800 text-white shadow-sm"
                : "text-foreground/60 hover:bg-brand-50 hover:text-brand-800"
            }`}
          >
            <Flag className="h-3.5 w-5 rounded-[2px]" />
            {!compact && <span>{t(`language.${optionLang}`)}</span>}
          </button>
        );
      })}
    </div>
  );
}

function USFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 14" preserveAspectRatio="none" {...props}>
      <rect width="20" height="14" fill="#B22234" />
      {[1, 3, 5, 7, 9, 11, 13].map(y => (
        <rect key={y} y={y} width="20" height="1" fill="white" />
      ))}
      <rect width="9" height="7" fill="#3C3B6E" />
    </svg>
  );
}

function MXFlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 14" preserveAspectRatio="none" {...props}>
      <rect width="20" height="14" fill="#006847" />
      <rect x="6.66" width="6.68" height="14" fill="white" />
      <rect x="13.34" width="6.66" height="14" fill="#CE1126" />
      <circle cx="10" cy="7" r="1.4" fill="#8B5A2B" opacity="0.85" />
    </svg>
  );
}

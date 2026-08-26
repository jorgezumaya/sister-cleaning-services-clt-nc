"use client";

import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { useLanguage } from "@/lib/i18n";
import { SERVICE_TYPES, FREQUENCIES } from "@/lib/constants";

export default function ServicesContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">{t("services.title")}</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("services.intro")}</p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {SERVICE_TYPES.map(s => (
          <ServiceCard
            key={s.key}
            name={t(`serviceTypes.${s.key}.name`)}
            description={t(`serviceTypes.${s.key}.description`)}
          />
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-brand-50 p-8">
        <h2 className="text-xl font-bold text-brand-950">{t("services.chooseFrequency")}</h2>
        <p className="mt-2 text-sm text-foreground/70">{t("services.chooseFrequencyDesc")}</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {FREQUENCIES.map(f => (
            <span
              key={f.key}
              className="cursor-default rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500 hover:bg-accent-500/10 hover:text-accent-600 hover:shadow-sm"
            >
              {t(`frequencies.${f.key}`)}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md"
        >
          {t("services.getFreeQuote")}
        </Link>
      </div>
    </div>
  );
}

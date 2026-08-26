"use client";

import Image from "next/image";
import Link from "next/link";
import { BUSINESS_CITY } from "@/lib/constants";
import { withBasePath } from "@/lib/site";
import { useLanguage } from "@/lib/i18n";
import ContactButtons from "@/components/ContactButtons";

export default function Hero() {
  const { t } = useLanguage();

  return (
    <section className="bg-brand-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            {t("hero.locationBadge", { city: BUSINESS_CITY })}
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-950 sm:text-4xl md:text-5xl">
            {t("hero.tagline")}
          </h1>
          <p className="mt-4 max-w-md text-base text-foreground/70 sm:text-lg">
            {t("hero.description")}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md"
            >
              {t("hero.ctaQuote")}
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-500 hover:text-brand-900 hover:shadow-sm"
            >
              {t("hero.ctaServices")}
            </Link>
          </div>
          <div className="mt-8">
            <ContactButtons compact />
          </div>
        </div>

        <div className="group relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl bg-[#8fd3c9] shadow-lg sm:aspect-[4/5]">
          <Image
            src={withBasePath("/images/hero-illustration.png")}
            alt="Illustrated cartoon of the two Sisters Cleaning Service owners holding cleaning supplies"
            fill
            priority
            sizes="(min-width: 768px) 480px, 90vw"
            className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
}

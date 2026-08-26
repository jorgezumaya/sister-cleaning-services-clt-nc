import Image from "next/image";
import Link from "next/link";
import { BUSINESS_CITY, BUSINESS_TAGLINE } from "@/lib/constants";
import ContactButtons from "@/components/ContactButtons";

export default function Hero() {
  return (
    <section className="bg-brand-50">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <p className="inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-700">
            {BUSINESS_CITY} &amp; the greater Charlotte area
          </p>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-brand-950 sm:text-4xl md:text-5xl">
            {BUSINESS_TAGLINE}
          </h1>
          <p className="mt-4 max-w-md text-base text-foreground/70 sm:text-lg">
            Residential and commercial cleaning — daily, weekly, bi-weekly, monthly, or one time.
            Reliable, detail-oriented, and easy to book.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
            >
              Get a Free Quote
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-brand-200 bg-white px-6 py-3 text-sm font-semibold text-brand-800 transition hover:border-brand-500"
            >
              View Services
            </Link>
          </div>
          <div className="mt-8">
            <ContactButtons compact />
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-3xl shadow-lg sm:aspect-[4/5]">
          <Image
            src="/images/hero-family.png"
            alt="The Sisters Cleaning Service team"
            fill
            priority
            sizes="(min-width: 768px) 480px, 90vw"
            className="object-cover object-[50%_25%]"
          />
        </div>
      </div>
    </section>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import ServiceCard from "@/components/ServiceCard";
import { SERVICE_TYPES, FREQUENCIES } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Services | Sisters Cleaning Service",
  description: "Residential and commercial cleaning services in the greater Charlotte, NC area.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">Our Services</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">
        Whatever the space, whatever the schedule — we tailor the clean to what you need.
      </p>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {SERVICE_TYPES.map(s => (
          <ServiceCard key={s.name} {...s} />
        ))}
      </div>

      <div className="mt-14 rounded-2xl bg-brand-50 p-8">
        <h2 className="text-xl font-bold text-brand-950">Choose your frequency</h2>
        <p className="mt-2 text-sm text-foreground/70">
          Every service can be scheduled the way that works for you.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          {FREQUENCIES.map(f => (
            <span
              key={f}
              className="rounded-full border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-800"
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/contact"
          className="inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600"
        >
          Get a Free Quote
        </Link>
      </div>
    </div>
  );
}

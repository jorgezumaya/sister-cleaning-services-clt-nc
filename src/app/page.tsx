import Link from "next/link";
import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import PhotoGallery from "@/components/PhotoGallery";
import { SERVICE_TYPES, FREQUENCIES, SERVICE_AREAS } from "@/lib/constants";

export default function Home() {
  return (
    <>
      <Hero />

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-brand-950 sm:text-3xl">What we offer</h2>
          <Link
            href="/services"
            className="group inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-colors duration-200 hover:text-accent-600"
          >
            See all services
            <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {SERVICE_TYPES.map(s => (
            <ServiceCard key={s.name} {...s} />
          ))}
        </div>
      </section>

      <section className="bg-brand-900 py-14 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-2xl font-bold sm:text-3xl">Cleaning on your schedule</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {FREQUENCIES.map(f => (
              <span
                key={f}
                className="cursor-default rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-500 hover:bg-accent-500/10 hover:text-accent-500"
              >
                {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-2xl font-bold text-brand-950 sm:text-3xl">Recent work</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          A look at homes and spaces we&apos;ve cleaned recently.
        </p>
        <div className="mt-8 max-w-3xl">
          <PhotoGallery />
        </div>
      </section>

      <section className="border-t border-brand-100 bg-brand-50 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <h2 className="text-2xl font-bold text-brand-950 sm:text-3xl">
            Proudly serving {SERVICE_AREAS[0]} and nearby towns
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-foreground/70">
            {SERVICE_AREAS.join(" · ")}
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-accent-500 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-600 hover:shadow-md"
          >
            Request a Free Quote
          </Link>
        </div>
      </section>
    </>
  );
}

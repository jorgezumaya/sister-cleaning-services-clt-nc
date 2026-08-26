import type { SVGProps } from "react";

export default function ServiceCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
        <SparkleIcon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-950">{name}</h3>
      <p className="mt-2 text-sm text-foreground/70">{description}</p>
    </div>
  );
}

function SparkleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2 14 9 21 12 14 15 12 22 10 15 3 12 10 9 12 2Z" />
    </svg>
  );
}

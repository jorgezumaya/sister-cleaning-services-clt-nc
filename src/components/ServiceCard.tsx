import type { SVGProps } from "react";

export default function ServiceCard({ name, description }: { name: string; description: string }) {
  return (
    <div className="group rounded-2xl border border-brand-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-500/40 hover:shadow-lg">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700 transition-all duration-300 group-hover:scale-110 group-hover:bg-accent-500 group-hover:text-white">
        <SparkleIcon className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
      </div>
      <h3 className="mt-4 text-lg font-bold text-brand-950 transition-colors duration-200 group-hover:text-accent-600">
        {name}
      </h3>
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

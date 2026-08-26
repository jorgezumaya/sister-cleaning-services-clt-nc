import type { Metadata } from "next";
import PhotoGallery from "@/components/PhotoGallery";

export const metadata: Metadata = {
  title: "Gallery | Sisters Cleaning Service",
  description: "Recent cleaning work from Sisters Cleaning Service.",
};

export default function GalleryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">Recent Work</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">
        A look at homes and spaces we&apos;ve cleaned recently. New photos are added regularly.
      </p>
      <div className="mt-10">
        <PhotoGallery />
      </div>
    </div>
  );
}

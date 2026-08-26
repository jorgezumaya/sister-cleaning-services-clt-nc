import type { Metadata } from "next";
import GalleryContent from "./GalleryContent";

export const metadata: Metadata = {
  title: "Cleaning Photo Gallery",
  description:
    "See recent before-and-after house and office cleaning work from Sisters Cleaning Service " +
    "in the greater Charlotte, NC area.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return <GalleryContent />;
}

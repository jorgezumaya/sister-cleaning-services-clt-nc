"use client";

import PhotoGallery from "@/components/PhotoGallery";
import { useLanguage } from "@/lib/i18n";

export default function GalleryContent() {
  const { t } = useLanguage();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-extrabold text-brand-950 sm:text-4xl">{t("gallery.title")}</h1>
      <p className="mt-3 max-w-2xl text-base text-foreground/70">{t("gallery.description")}</p>
      <div className="mt-10">
        <PhotoGallery />
      </div>
    </div>
  );
}

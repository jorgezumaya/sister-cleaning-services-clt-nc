"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { listAll, ref, getDownloadURL } from "firebase/storage";
import { storage, isFirebaseConfigured } from "@/lib/firebase";

const PHOTOS_FOLDER = "gallery";
const INTERVAL_MS = 4500;

type Photo = { id: string; url: string };

function titleFromFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

/**
 * Lists every file in the `gallery/` folder of Firebase Storage — no
 * database needed. Upload a before/after photo from the Firebase console
 * and it shows up here automatically on next page load.
 */
export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(isFirebaseConfigured);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    listAll(ref(storage, PHOTOS_FOLDER))
      .then(async result => {
        const items = await Promise.all(
          result.items.map(async item => ({
            id: item.name,
            url: await getDownloadURL(item),
          }))
        );
        if (!cancelled) setPhotos(items);
      })
      .catch(err => console.error("[PhotoGallery] failed to load photos:", err))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (photos.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % photos.length);
    }, INTERVAL_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [photos.length]);

  const pause = () => {
    if (timerRef.current) clearInterval(timerRef.current);
  };
  const resume = () => {
    if (photos.length > 1) {
      timerRef.current = setInterval(() => setIndex(i => (i + 1) % photos.length), INTERVAL_MS);
    }
  };

  if (loading) {
    return (
      <div className="flex h-72 items-center justify-center rounded-2xl bg-brand-50 text-sm text-foreground/50">
        Loading photos…
      </div>
    );
  }

  if (photos.length === 0) {
    return (
      <div className="flex h-72 flex-col items-center justify-center gap-1 rounded-2xl bg-brand-50 text-center text-sm text-foreground/50">
        <p>Photos coming soon.</p>
        {!isFirebaseConfigured && (
          <p className="text-xs">(Connect Firebase Storage to enable the live gallery.)</p>
        )}
      </div>
    );
  }

  const current = photos[index];

  return (
    <div
      className="relative overflow-hidden rounded-2xl bg-brand-950"
      onMouseEnter={pause}
      onMouseLeave={resume}
    >
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/9]">
        <Image
          src={current.url}
          alt={titleFromFilename(current.id)}
          fill
          sizes="(min-width: 768px) 720px, 100vw"
          className="object-cover"
          unoptimized
        />
      </div>

      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            onClick={() => setIndex(i => (i - 1 + photos.length) % photos.length)}
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next photo"
            onClick={() => setIndex(i => (i + 1) % photos.length)}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white hover:bg-black/60"
          >
            ›
          </button>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {photos.map((p, i) => (
              <button
                key={p.id}
                aria-label={`Go to photo ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 w-2 rounded-full ${i === index ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

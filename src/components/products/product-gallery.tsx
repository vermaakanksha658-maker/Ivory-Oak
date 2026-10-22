"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { ContentImage } from "@/lib/demo-data";

export function ProductGallery({
  images,
  name,
}: {
  images: ContentImage[];
  name: string;
}) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  useEffect(() => {
    if (!lightbox) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setLightbox(false);
      if (event.key === "ArrowRight") {
        setActive((index) => (index + 1) % images.length);
      }
      if (event.key === "ArrowLeft") {
        setActive((index) => (index - 1 + images.length) % images.length);
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, images.length]);

  if (images.length === 0) return null;

  return (
    <div>
      <button
        type="button"
        onClick={() => setLightbox(true)}
        aria-label={`Expand image of ${name}`}
        className="image-reveal group relative block aspect-[4/5] w-full overflow-hidden bg-cream text-left"
      >
        <Image
          src={images[active].url}
          alt={images[active].alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover"
        />
      </button>

      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`View image ${index + 1}: ${image.alt}`}
              aria-current={index === active}
              className={`relative aspect-square w-20 overflow-hidden border transition-opacity ${
                index === active
                  ? "border-charcoal opacity-100"
                  : "border-transparent opacity-55 hover:opacity-100"
              }`}
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${name} image gallery`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal sm:right-7 sm:top-7"
          >
            <X className="size-5" strokeWidth={1.4} />
          </button>
          <div className="relative h-[78vh] w-full max-w-5xl">
            <Image
              src={images[active].url}
              alt={images[active].alt}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={() =>
                  setActive(
                    (index) => (index - 1 + images.length) % images.length,
                  )
                }
                aria-label="Previous image"
                className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal sm:left-6"
              >
                <ArrowLeft className="size-4" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() =>
                  setActive((index) => (index + 1) % images.length)
                }
                aria-label="Next image"
                className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal sm:right-6"
              >
                <ArrowRight className="size-4" strokeWidth={1.5} />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

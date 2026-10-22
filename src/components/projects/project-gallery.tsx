"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Expand, X } from "lucide-react";
import type { ContentImage } from "@/lib/demo-data";

export function ProjectGallery({
  images,
  title,
}: {
  images: ContentImage[];
  title: string;
}) {
  const [active, setActive] = useState<number | null>(null);
  const isOpen = active !== null;

  const close = useCallback(() => setActive(null), []);
  const next = useCallback(
    () =>
      setActive((current) =>
        current === null ? null : (current + 1) % images.length,
      ),
    [images.length],
  );
  const previous = useCallback(
    () =>
      setActive((current) =>
        current === null
          ? null
          : (current - 1 + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowRight") next();
      if (event.key === "ArrowLeft") previous();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, close, next, previous]);

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
        {images.map((image, index) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setActive(index)}
            aria-label={`Open image: ${image.alt}`}
            className={`image-reveal group relative overflow-hidden bg-sand text-left ${
              index === 0 ? "sm:col-span-2 aspect-[16/10]" : "aspect-[4/3]"
            }`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              sizes={
                index === 0
                  ? "(max-width: 640px) 100vw, 90vw"
                  : "(max-width: 640px) 100vw, 45vw"
              }
              className="object-cover"
            />
            <span className="absolute bottom-4 right-4 flex size-9 items-center justify-center bg-ivory/90 text-charcoal opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <Expand className="size-4" strokeWidth={1.5} />
            </span>
          </button>
        ))}
      </div>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${title} image gallery`}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/95 p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close gallery"
            className="absolute right-4 top-4 z-10 flex size-11 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal sm:right-7 sm:top-7"
          >
            <X className="size-5" strokeWidth={1.4} />
          </button>

          <div className="relative h-[75vh] w-full max-w-6xl">
            <Image
              src={images[active].url}
              alt={images[active].alt}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          <button
            type="button"
            onClick={previous}
            aria-label="Previous image"
            className="absolute left-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal sm:left-6"
          >
            <ArrowLeft className="size-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next image"
            className="absolute right-3 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-ivory/25 text-ivory transition-colors hover:bg-ivory hover:text-charcoal sm:right-6"
          >
            <ArrowRight className="size-4" strokeWidth={1.5} />
          </button>

          <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2">
            <p className="text-[0.625rem] tabular-nums tracking-[0.18em] text-ivory/60">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(images.length).padStart(2, "0")}
            </p>
            <p className="max-w-sm text-center text-[0.625rem] text-ivory/40">
              {images[active].alt}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

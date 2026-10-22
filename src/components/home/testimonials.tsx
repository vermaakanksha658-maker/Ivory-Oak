"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import type { Testimonial } from "@/lib/demo-data";

export function Testimonials({
  testimonials,
  image,
}: {
  testimonials: Testimonial[];
  image: string;
}) {
  const [active, setActive] = useState(0);
  const testimonial = testimonials[active];

  if (!testimonial) return null;

  const go = (direction: number) => {
    setActive(
      (current) =>
        (current + direction + testimonials.length) % testimonials.length,
    );
  };

  return (
    <div className="grid gap-0 lg:grid-cols-[0.85fr_1.15fr]">
      <div className="relative min-h-[320px] overflow-hidden bg-sand lg:min-h-[560px]">
        <Image
          src={image}
          alt="A considered interior detail from an Ivory & Oak project"
          fill
          sizes="(max-width: 1024px) 100vw, 40vw"
          className="object-cover"
        />
        <div className="absolute bottom-5 left-5 bg-ivory/95 px-4 py-3 backdrop-blur-sm">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.17em] text-charcoal/45">
            Client stories
          </p>
          <p className="mt-1 font-display text-lg text-charcoal">
            Homes, lived in beautifully
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between bg-cream p-8 sm:p-12 lg:p-16">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex gap-1 text-gold" aria-label="5 out of 5 stars">
              {Array.from({ length: testimonial.rating }).map((_, index) => (
                <Star
                  key={index}
                  className="size-3.5 fill-current"
                  strokeWidth={0}
                />
              ))}
            </div>
            <span className="text-[0.625rem] tabular-nums tracking-[0.18em] text-taupe">
              {String(active + 1).padStart(2, "0")} /{" "}
              {String(testimonials.length).padStart(2, "0")}
            </span>
          </div>

          <div key={testimonial.id} className="hero-image">
            <blockquote className="mt-9">
              <p className="font-display text-[1.8rem] leading-[1.35] tracking-[-0.02em] text-charcoal sm:text-[2.15rem] lg:text-[2.35rem]">
                “{testimonial.quote}”
              </p>
            </blockquote>
            <div className="mt-8 flex items-center gap-4">
              <span className="h-px w-8 bg-taupe" />
              <div>
                <p className="text-[0.8125rem] font-semibold text-charcoal">
                  {testimonial.name}
                </p>
                <p className="mt-0.5 text-[0.6875rem] uppercase tracking-[0.12em] text-charcoal/45">
                  {[testimonial.project, testimonial.location]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-charcoal/10 pt-6">
          <div className="flex gap-2">
            {testimonials.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Read testimonial from ${item.name}`}
                className={`h-px w-8 transition-colors ${
                  index === active ? "bg-charcoal" : "bg-charcoal/20"
                }`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous testimonial"
              className="flex size-10 items-center justify-center border border-charcoal/20 text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
            >
              <ArrowLeft className="size-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next testimonial"
              className="flex size-10 items-center justify-center border border-charcoal/20 text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
            >
              <ArrowRight className="size-4" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

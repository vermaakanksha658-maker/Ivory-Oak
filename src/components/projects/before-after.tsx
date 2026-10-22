"use client";

import { useState } from "react";
import Image from "next/image";
import { MoveHorizontal } from "lucide-react";

export function BeforeAfter({
  before,
  after,
  title,
}: {
  before: string;
  after: string;
  title: string;
}) {
  const [position, setPosition] = useState(52);

  return (
    <div>
      <div className="relative aspect-[16/10] select-none overflow-hidden bg-sand">
        <Image
          src={after}
          alt={`${title} after renovation`}
          fill
          sizes="(max-width: 1024px) 100vw, 70vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <Image
            src={before}
            alt={`${title} before renovation`}
            fill
            sizes="(max-width: 1024px) 100vw, 70vw"
            className="object-cover"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-y-0 z-10 w-px bg-ivory shadow-[0_0_16px_rgba(0,0,0,0.3)]"
          style={{ left: `${position}%` }}
        >
          <span className="absolute left-1/2 top-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-charcoal shadow-lg">
            <MoveHorizontal className="size-4" strokeWidth={1.6} />
          </span>
        </div>
        <span className="pointer-events-none absolute bottom-4 left-4 bg-ink/55 px-3 py-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute bottom-4 right-4 bg-ivory/90 px-3 py-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-charcoal backdrop-blur-sm">
          After
        </span>
        <input
          type="range"
          min={0}
          max={100}
          value={position}
          onChange={(event) => setPosition(Number(event.target.value))}
          aria-label={`Compare before and after images of ${title}`}
          className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
        />
      </div>
      <p className="mt-2 text-center text-[0.5625rem] uppercase tracking-[0.14em] text-charcoal/35">
        Drag to reveal the transformation
      </p>
    </div>
  );
}

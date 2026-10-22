import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Service } from "@/lib/demo-data";

export function ServiceRow({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className="group grid grid-cols-[auto_1fr_auto] items-center gap-5 border-b border-charcoal/12 py-6 transition-colors hover:border-charcoal/35 sm:grid-cols-[3rem_9rem_1fr_auto] sm:gap-7 sm:py-7"
    >
      <span className="text-[0.625rem] tabular-nums tracking-[0.16em] text-taupe">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative hidden aspect-[3/2] overflow-hidden bg-sand sm:block">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="144px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <h3 className="font-display text-[1.6rem] leading-tight text-charcoal transition-colors group-hover:text-olive sm:text-[1.9rem]">
          {service.title}
        </h3>
        <p className="mt-1 max-w-lg text-[0.8125rem] leading-6 text-charcoal/55 line-clamp-2 sm:mt-1.5">
          {service.shortDescription}
        </p>
      </div>
      <span className="flex size-10 items-center justify-center border border-charcoal/20 text-charcoal transition-all duration-300 group-hover:border-charcoal group-hover:bg-charcoal group-hover:text-ivory">
        <ArrowUpRight className="size-4" strokeWidth={1.5} />
      </span>
    </Link>
  );
}

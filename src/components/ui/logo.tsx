import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function Logo({
  theme = "dark",
  compact = false,
  className,
  image,
  name = "Ivory & Oak",
}: {
  theme?: "dark" | "light";
  compact?: boolean;
  className?: string;
  image?: string | null;
  name?: string;
}) {
  return (
    <Link
      href="/"
      aria-label={`${name} — home`}
      className={cn("group inline-flex items-center gap-3", className)}
    >
      {image ? (
        <Image
          src={image}
          alt={name}
          width={220}
          height={56}
          className={cn(
            "w-auto object-contain",
            compact ? "h-9" : "h-10 lg:h-11",
          )}
        />
      ) : (
        <>
          <span
            className={cn(
              "relative flex size-10 items-center justify-center border transition-colors duration-300",
              theme === "light"
                ? "border-ivory/35 text-ivory"
                : "border-charcoal/30 text-charcoal",
            )}
          >
            <span className="font-display text-[1.15rem] leading-none tracking-[-0.08em]">
              I<span className="mx-px text-[0.75em] opacity-60">&</span>O
            </span>
            <span
              className={cn(
                "absolute -right-px -top-px size-1.5",
                theme === "light" ? "bg-ivory" : "bg-charcoal",
              )}
            />
          </span>
          {!compact && (
            <span className="flex flex-col">
              <span
                className={cn(
                  "font-display text-[1.4rem] leading-none tracking-[-0.02em]",
                  theme === "light" ? "text-ivory" : "text-charcoal",
                )}
              >
                {name}
              </span>
              <span
                className={cn(
                  "mt-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.28em]",
                  theme === "light" ? "text-ivory/50" : "text-charcoal/50",
                )}
              >
                Interior Design Studio
              </span>
            </span>
          )}
        </>
      )}
    </Link>
  );
}

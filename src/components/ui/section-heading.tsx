import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  action,
  align = "left",
  theme = "dark",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  theme?: "dark" | "light";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && (
          <p
            className={cn(
              "eyebrow mb-4 flex items-center gap-3",
              theme === "light" ? "text-beige" : "text-olive",
              align === "center" && "justify-center",
            )}
          >
            <span
              className={cn(
                "h-px w-7",
                theme === "light" ? "bg-beige/60" : "bg-taupe",
              )}
            />
            {eyebrow}
          </p>
        )}
        <h2
          className={cn(
            "text-balance text-[2.5rem] leading-[1.03] tracking-[-0.03em] sm:text-5xl lg:text-[3.75rem]",
            theme === "light" ? "text-ivory" : "text-charcoal",
          )}
        >
          {title}
        </h2>
        {intro && (
          <p
            className={cn(
              "text-pretty mt-5 max-w-xl text-[0.9375rem] leading-7",
              theme === "light" ? "text-ivory/65" : "text-charcoal/65",
              align === "center" && "mx-auto",
            )}
          >
            {intro}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "link-underline group inline-flex shrink-0 items-center gap-2 pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.18em]",
            theme === "light" ? "text-ivory" : "text-charcoal",
            align === "center" && "mx-auto",
          )}
        >
          {action.label}
          <ArrowRight
            className="size-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      )}
    </div>
  );
}

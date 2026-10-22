import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";

export function AdminPageHeader({
  title,
  description,
  action,
  backHref,
}: {
  title: string;
  description?: string;
  action?: { label: string; href: string };
  backHref?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-4 sm:mb-9 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {backHref && (
          <Link
            href={backHref}
            className="mb-4 inline-flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/40 transition-colors hover:text-charcoal"
          >
            <ArrowLeft className="size-3.5" strokeWidth={1.5} />
            Back
          </Link>
        )}
        <h1 className="font-display text-[2.2rem] leading-none tracking-[-0.03em] text-charcoal sm:text-[2.7rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-xl text-[0.8125rem] leading-6 text-charcoal/45">
            {description}
          </p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="inline-flex h-11 shrink-0 items-center gap-2 bg-charcoal px-5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-ivory transition-colors hover:bg-ink"
        >
          <Plus className="size-4" strokeWidth={1.6} />
          {action.label}
        </Link>
      )}
    </div>
  );
}

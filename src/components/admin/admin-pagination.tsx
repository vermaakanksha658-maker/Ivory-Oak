import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function AdminPagination({
  basePath,
  page,
  totalPages,
  params = {},
}: {
  basePath: string;
  page: number;
  totalPages: number;
  params?: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) return null;

  const hrefFor = (target: number) => {
    const search = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) search.set(key, value);
    });
    if (target > 1) search.set("page", String(target));
    const query = search.toString();
    return query ? `${basePath}?${query}` : basePath;
  };

  return (
    <nav
      aria-label="Pagination"
      className="mt-5 flex items-center justify-between gap-4"
    >
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page <= 1}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 border border-charcoal/15 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] transition-colors",
          page <= 1
            ? "pointer-events-none opacity-30"
            : "text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal",
        )}
      >
        <ChevronLeft className="size-3.5" strokeWidth={1.5} />
        Previous
      </Link>
      <p className="text-[0.5625rem] tabular-nums uppercase tracking-[0.12em] text-charcoal/35">
        Page {page} of {totalPages}
      </p>
      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page >= totalPages}
        className={cn(
          "inline-flex h-9 items-center gap-1.5 border border-charcoal/15 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] transition-colors",
          page >= totalPages
            ? "pointer-events-none opacity-30"
            : "text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal",
        )}
      >
        Next
        <ChevronRight className="size-3.5" strokeWidth={1.5} />
      </Link>
    </nav>
  );
}

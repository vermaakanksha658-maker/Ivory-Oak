import { Search } from "lucide-react";

export function AdminSearch({
  action,
  defaultValue = "",
  placeholder = "Search…",
  children,
}: {
  action: string;
  defaultValue?: string;
  placeholder?: string;
  children?: React.ReactNode;
}) {
  return (
    <form
      action={action}
      className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center"
    >
      <label className="relative min-w-0 flex-1">
        <span className="sr-only">Search</span>
        <Search
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-charcoal/30"
          strokeWidth={1.5}
        />
        <input
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="h-10 w-full border border-charcoal/15 bg-cream pl-9 pr-3 text-[0.75rem] text-charcoal outline-none transition-colors placeholder:text-charcoal/30 focus:border-charcoal/40"
        />
      </label>
      {children}
      <button
        type="submit"
        className="h-10 shrink-0 bg-charcoal px-4 text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-ivory transition-colors hover:bg-ink"
      >
        Search
      </button>
    </form>
  );
}

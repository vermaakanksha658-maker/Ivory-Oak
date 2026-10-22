"use client";

import { AlertCircle, RefreshCw } from "lucide-react";

export default function AdminError({ reset }: { reset: () => void }) {
  return (
    <div className="mx-auto max-w-xl py-16 text-center">
      <AlertCircle
        className="mx-auto size-7 text-[#9b3d2e]"
        strokeWidth={1.4}
      />
      <h1 className="mt-4 font-display text-3xl text-charcoal">
        This view couldn&apos;t load.
      </h1>
      <p className="mt-2 text-[0.8125rem] leading-6 text-charcoal/50">
        Check that the database is reachable and that your session is still
        valid, then try again.
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center gap-2 bg-charcoal px-5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-ivory transition-colors hover:bg-ink"
      >
        <RefreshCw className="size-4" strokeWidth={1.5} />
        Try again
      </button>
    </div>
  );
}

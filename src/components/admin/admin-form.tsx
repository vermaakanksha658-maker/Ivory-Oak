"use client";

import { useActionState } from "react";
import Link from "next/link";
import { AlertCircle, Loader2 } from "lucide-react";
import type { ActionState } from "@/app/admin/actions";

export function AdminForm({
  action,
  children,
  submitLabel = "Save changes",
  cancelHref,
}: {
  action: (
    state: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  cancelHref: string;
}) {
  const [state, formAction, pending] = useActionState(action, {});

  return (
    <form action={formAction}>
      {state.error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 border border-[#9b3d2e]/25 bg-[#9b3d2e]/5 px-4 py-3 text-[0.8125rem] leading-6 text-[#7a2f23]"
        >
          <AlertCircle className="mt-0.5 size-4 shrink-0" strokeWidth={1.6} />
          {state.error}
        </div>
      )}

      {children}

      <div className="sticky bottom-0 z-10 mt-8 flex flex-col-reverse gap-3 border-t border-charcoal/10 bg-[#f4efe5]/95 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={cancelHref}
          className="inline-flex h-11 items-center justify-center px-4 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal/50 transition-colors hover:text-charcoal"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center justify-center gap-2 bg-charcoal px-6 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-ink disabled:opacity-60"
        >
          {pending && (
            <Loader2 className="size-4 animate-spin" strokeWidth={1.6} />
          )}
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

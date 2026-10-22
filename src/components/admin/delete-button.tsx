"use client";

import { Trash2 } from "lucide-react";

export function DeleteButton({
  action,
  id,
  label = "Delete",
  confirmMessage = "Delete this item permanently? This cannot be undone.",
  compact = false,
}: {
  action: (formData: FormData) => Promise<void>;
  id: string;
  label?: string;
  confirmMessage?: string;
  compact?: boolean;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmMessage)) {
          event.preventDefault();
        }
      }}
      className="inline-flex"
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={
          compact
            ? "flex size-8 items-center justify-center text-charcoal/30 transition-colors hover:text-[#9b3d2e]"
            : "flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-charcoal/40 transition-colors hover:text-[#9b3d2e]"
        }
        aria-label={label}
        title={label}
      >
        <Trash2 className="size-3.5" strokeWidth={1.5} />
        {!compact && label}
      </button>
    </form>
  );
}

import { AlertCircle, Check } from "lucide-react";

export function AdminNotice({
  saved,
  deleted,
  error,
  message = "Changes saved successfully.",
}: {
  saved?: string;
  deleted?: string;
  error?: string;
  message?: string;
}) {
  if (error) {
    return (
      <div className="mb-6 flex items-center gap-2 border border-red-900/20 bg-red-900/5 px-4 py-3 text-[0.75rem] text-red-900/70">
        <AlertCircle className="size-4" strokeWidth={1.6} />
        {error === "in-use"
          ? "This category is still assigned to products. Move those products to another category before deleting it."
          : error}
      </div>
    );
  }

  if (!saved && !deleted) return null;

  return (
    <div className="mb-6 flex items-center gap-2 border border-olive/20 bg-olive/5 px-4 py-3 text-[0.75rem] text-olive">
      <Check className="size-4" strokeWidth={1.6} />
      {deleted ? "Item deleted." : message}
    </div>
  );
}

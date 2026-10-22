"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, X } from "lucide-react";

export function ImageField({
  label,
  name,
  defaultValue = "",
  required = false,
  help,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  required?: boolean;
  help?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setUploading(true);
    setError("");

    try {
      const body = new FormData();
      body.append("file", file);
      const response = await fetch("/api/admin/upload", {
        method: "POST",
        body,
      });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) {
        setError(result.error ?? "Upload failed. Please try again.");
        return;
      }
      setValue(result.url);
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label htmlFor={`${name}-url`} className="admin-label">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden border border-charcoal/15 bg-sand sm:w-32">
          {value ? (
            <>
              <div
                role="img"
                aria-label={`${label} preview`}
                className="h-full w-full bg-cover bg-center"
                style={{ backgroundImage: `url("${value}")` }}
              />
              <button
                type="button"
                onClick={() => setValue("")}
                aria-label="Remove image"
                className="absolute right-1.5 top-1.5 flex size-6 items-center justify-center bg-ink/70 text-ivory hover:bg-ink"
              >
                <X className="size-3" strokeWidth={1.6} />
              </button>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-taupe">
              <ImagePlus className="size-6" strokeWidth={1.2} />
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            id={`${name}-url`}
            name={name}
            type="url"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            required={required}
            placeholder="https://..."
            className="admin-field"
          />
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void upload(file);
              }}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-9 items-center gap-2 border border-charcoal/20 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-charcoal/60 transition-colors hover:border-charcoal/50 hover:text-charcoal disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="size-3.5 animate-spin" strokeWidth={1.6} />
              ) : (
                <ImagePlus className="size-3.5" strokeWidth={1.5} />
              )}
              {uploading ? "Uploading" : "Upload to Cloudinary"}
            </button>
            <span className="text-[0.5625rem] text-charcoal/35">
              JPG, PNG, WebP · max 8 MB
            </span>
          </div>
          {error && (
            <p className="mt-2 text-[0.6875rem] leading-5 text-[#7a2f23]">
              {error}
            </p>
          )}
        </div>
      </div>
      {help && (
        <p className="mt-2 text-[0.625rem] leading-5 text-charcoal/40">{help}</p>
      )}
    </div>
  );
}

"use client";

import { useRef, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Loader2,
  Plus,
  X,
} from "lucide-react";

type GalleryItem = { url: string; alt: string };

function parseValue(value: string): GalleryItem[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [url, ...alt] = line.split("|").map((part) => part.trim());
      return { url, alt: alt.join("|") };
    })
    .filter((item) => item.url);
}

export function GalleryField({
  label,
  name,
  defaultValue = "",
  defaultAlt = "",
  help,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  defaultAlt?: string;
  help?: string;
}) {
  const [items, setItems] = useState<GalleryItem[]>(() =>
    parseValue(defaultValue),
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [urlInput, setUrlInput] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const serialized = items
    .map((item) => `${item.url} | ${item.alt}`)
    .join("\n");

  function update(index: number, patch: Partial<GalleryItem>) {
    setItems((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item,
      ),
    );
  }

  function remove(index: number) {
    setItems((current) => current.filter((_, i) => i !== index));
  }

  function move(index: number, direction: number) {
    setItems((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function uploadFiles(files: FileList) {
    setUploading(true);
    setError("");

    try {
      for (const file of Array.from(files)) {
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
          setError(result.error ?? "One or more images could not be uploaded.");
          break;
        }
        setItems((current) => [
          ...current,
          {
            url: result.url as string,
            alt:
              current.length === 0
                ? defaultAlt
                : `${defaultAlt} — image ${current.length + 1}`,
          },
        ]);
      }
      if (fileRef.current) fileRef.current.value = "";
    } catch {
      setError("Upload failed. Check your connection and try again.");
    } finally {
      setUploading(false);
    }
  }

  function addUrl() {
    if (!urlInput.trim()) return;
    setItems((current) => [
      ...current,
      {
        url: urlInput.trim(),
        alt: defaultAlt
          ? `${defaultAlt} — image ${current.length + 1}`
          : "",
      },
    ]);
    setUrlInput("");
  }

  return (
    <div>
      <label className="admin-label">{label}</label>
      <input type="hidden" name={name} value={serialized} />

      {items.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="border border-charcoal/10 bg-cream p-3"
            >
              <div className="flex gap-3">
                <div
                  role="img"
                  aria-label={item.alt || `Gallery image ${index + 1}`}
                  className="h-20 w-24 shrink-0 bg-sand bg-cover bg-center"
                  style={{ backgroundImage: `url("${item.url}")` }}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-charcoal/35">
                      Image {index + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="text-charcoal/30 hover:text-[#9b3d2e]"
                    >
                      <X className="size-3.5" strokeWidth={1.5} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={item.alt}
                    onChange={(event) =>
                      update(index, { alt: event.target.value })
                    }
                    placeholder="Alt text for accessibility"
                    className="admin-field mt-1.5 px-2 py-1.5 text-[0.75rem]"
                    aria-label={`Alt text for gallery image ${index + 1}`}
                  />
                  <div className="mt-1.5 flex gap-1">
                    <button
                      type="button"
                      onClick={() => move(index, -1)}
                      disabled={index === 0}
                      aria-label="Move image up"
                      className="flex size-7 items-center justify-center border border-charcoal/15 text-charcoal/40 hover:text-charcoal disabled:opacity-25"
                    >
                      <ArrowUp className="size-3" strokeWidth={1.6} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(index, 1)}
                      disabled={index === items.length - 1}
                      aria-label="Move image down"
                      className="flex size-7 items-center justify-center border border-charcoal/15 text-charcoal/40 hover:text-charcoal disabled:opacity-25"
                    >
                      <ArrowDown className="size-3" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          onChange={(event) => {
            if (event.target.files?.length) {
              void uploadFiles(event.target.files);
            }
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
          {uploading ? "Uploading" : "Upload images"}
        </button>
        <div className="flex flex-1 gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(event) => setUrlInput(event.target.value)}
            placeholder="Or paste an image URL"
            className="admin-field h-9 min-w-0 flex-1 py-1.5 text-[0.75rem]"
          />
          <button
            type="button"
            onClick={addUrl}
            className="inline-flex h-9 items-center gap-1 border border-charcoal/20 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-charcoal/50 hover:text-charcoal"
          >
            <Plus className="size-3" strokeWidth={1.6} />
            Add
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-[0.6875rem] leading-5 text-[#7a2f23]">
          {error}
        </p>
      )}
      {help && (
        <p className="mt-2 text-[0.625rem] leading-5 text-charcoal/40">{help}</p>
      )}
    </div>
  );
}

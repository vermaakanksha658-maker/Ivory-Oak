"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm({
  whatsapp,
  businessName = "Ivory & Oak",
  services,
  productName,
  productId,
  serviceName,
  serviceId,
  source = "contact",
}: {
  whatsapp: string;
  businessName?: string;
  services?: { id: string; title: string }[];
  productName?: string;
  productId?: string;
  serviceName?: string;
  serviceId?: string;
  source?: "contact" | "product" | "service" | "portfolio";
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const startedRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (startedRef.current) {
      startedRef.current.value = String(Date.now());
    }
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;

    const form = event.currentTarget;
    const formData = new FormData(form);

    setStatus("submitting");
    setError("");

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          email: formData.get("email"),
          message: formData.get("message"),
          interest: formData.get("interest") || productName || "",
          source,
          productId: productId ?? null,
          serviceId: formData.get("serviceId") || serviceId || null,
          website: formData.get("website"),
          startedAt: Number(formData.get("startedAt")) || undefined,
        }),
      });

      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok) {
        setError(result.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }

      form.reset();
      if (startedRef.current) {
        startedRef.current.value = String(Date.now());
      }
      setStatus("success");
    } catch {
      setError(
        "We couldn't send your enquiry. Please check your connection or message us on WhatsApp.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex min-h-[520px] flex-col items-center justify-center bg-cream p-8 text-center sm:p-12">
        <span className="flex size-14 items-center justify-center rounded-full border border-olive/25 text-olive">
          <Check className="size-6" strokeWidth={1.5} />
        </span>
        <p className="eyebrow mt-7 text-taupe">Enquiry received</p>
        <h2 className="mt-4 font-display text-[2.3rem] leading-[1.08] text-charcoal">
          Thank you for writing to us.
        </h2>
        <p className="mt-4 max-w-sm text-[0.875rem] leading-7 text-charcoal/55">
          A member of our studio will get back to you within two working days.
          If it&apos;s urgent, the quickest way to reach us is WhatsApp.
        </p>
        <a
          href={whatsappUrl(
            whatsapp,
            `Hello ${businessName}, I've just sent an enquiry through your website and would love to chat.`,
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-7 inline-flex h-12 items-center gap-2 bg-[#1f5c45] px-6 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#174936]"
        >
          <MessageCircle className="size-4" strokeWidth={1.6} />
          Continue on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="mt-5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/45 underline underline-offset-4 hover:text-charcoal"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="bg-cream p-6 sm:p-9 lg:p-10"
      noValidate
    >
      {productName && (
        <div className="mb-6 border-l-2 border-gold bg-sand/40 px-4 py-3">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-taupe">
            Enquiring about
          </p>
          <p className="mt-1 font-display text-lg text-charcoal">{productName}</p>
          <input type="hidden" name="interest" value={productName} />
          {productId && <input type="hidden" name="productId" value={productId} />}
        </div>
      )}

      {serviceName && (
        <div className="mb-6 border-l-2 border-gold bg-sand/40 px-4 py-3">
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-taupe">
            Service enquiry
          </p>
          <p className="mt-1 font-display text-lg text-charcoal">{serviceName}</p>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="admin-label">
            Your name <span className="text-gold">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            minLength={2}
            maxLength={100}
            placeholder="Ananya Sharma"
            className="admin-field"
          />
        </div>
        <div>
          <label htmlFor="phone" className="admin-label">
            Phone <span className="text-gold">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            minLength={7}
            maxLength={20}
            placeholder="+91 98765 43210"
            className="admin-field"
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="email" className="admin-label">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={120}
          placeholder="you@example.com"
          className="admin-field"
        />
      </div>

      {services && services.length > 0 && !productName && (
        <div className="mt-5">
          <label htmlFor="serviceId" className="admin-label">
            I&apos;m interested in
          </label>
          <select
            id="serviceId"
            name="serviceId"
            defaultValue={serviceId ?? ""}
            className="admin-field"
          >
            <option value="">Select a service (optional)</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.title}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="message" className="admin-label">
          Tell us about your space <span className="text-gold">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2500}
          rows={6}
          defaultValue={
            productName
              ? `I'd like to know more about the ${productName}.`
              : serviceName
                ? `I'd like to know more about the ${serviceName} service.`
                : ""
          }
          placeholder="A little about the space, your location, what you're hoping to change, and any timelines..."
          className="admin-field resize-y"
        />
      </div>

      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <input ref={startedRef} type="hidden" name="startedAt" />

      {error && (
        <p
          role="alert"
          className="mt-5 border-l-2 border-[#9b3d2e] bg-[#9b3d2e]/5 px-4 py-3 text-[0.75rem] leading-5 text-[#7a2f23]"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[16rem] text-[0.5625rem] leading-4 text-charcoal/35">
          By sending this enquiry, you agree to be contacted about your project.
          We never share your details.
        </p>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex h-12 shrink-0 items-center justify-center gap-2 bg-charcoal px-7 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-ivory transition-colors hover:bg-ink disabled:opacity-60"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="size-4 animate-spin" strokeWidth={1.6} />
              Sending
            </>
          ) : (
            "Send enquiry"
          )}
        </button>
      </div>
    </form>
  );
}

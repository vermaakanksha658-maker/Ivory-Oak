"use client";

import { usePathname } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { whatsappUrl } from "@/lib/utils";

export function FloatingWhatsApp({
  whatsapp,
  phone,
  businessName = "Ivory & Oak",
}: {
  whatsapp: string;
  phone: string;
  businessName?: string;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  return (
    <a
      href={whatsappUrl(
        whatsapp,
        `Hello ${businessName}, I found you online and would love to discuss an interior project.`,
      )}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Chat with ${businessName} on WhatsApp at ${phone}`}
      className="group fixed bottom-5 right-5 z-30 flex size-14 items-center justify-center rounded-full bg-[#1f5c45] text-white shadow-[0_8px_30px_rgba(31,92,69,0.28)] transition-all duration-300 hover:scale-105 hover:bg-[#174936] sm:bottom-7 sm:right-7"
    >
      <MessageCircle className="size-6" strokeWidth={1.6} />
      <span className="pointer-events-none absolute right-[calc(100%+12px)] hidden whitespace-nowrap bg-charcoal px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-ivory opacity-0 transition-opacity duration-300 group-hover:opacity-100 lg:block">
        WhatsApp the studio
      </span>
    </a>
  );
}

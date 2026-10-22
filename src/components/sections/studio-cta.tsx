import Image from "next/image";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { SiteContent } from "@/lib/demo-data";
import { whatsappUrl } from "@/lib/utils";

export function StudioCta({
  settings,
  eyebrow = "Begin a project",
  title = "Let's design a home you'll never want to leave.",
  description = "Tell us about your space, your routines, and what you're dreaming of. We'll take it from there.",
  image,
}: {
  settings: SiteContent;
  eyebrow?: string;
  title?: string;
  description?: string;
  image?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-charcoal py-24 text-ivory sm:py-32">
      <Image
        src={image ?? settings.aboutImage}
        alt="A warm, layered interior by Ivory & Oak"
        fill
        sizes="100vw"
        className="object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-charcoal/55" />
      <div
        className="absolute inset-y-0 left-0 hidden w-px bg-ivory/15 lg:block"
        style={{ left: "max(3rem, calc((100vw - 1360px) / 2 + 3rem))" }}
      />
      <Container className="relative">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-beige/75">
              <span className="h-px w-7 bg-beige/50" />
              {eyebrow}
            </p>
            <h2 className="text-balance mt-6 max-w-3xl text-[2.75rem] leading-[1.02] tracking-[-0.03em] text-ivory sm:text-6xl lg:text-[4.4rem]">
              {title}
            </h2>
            <p className="text-pretty mt-6 max-w-xl text-[0.9375rem] leading-7 text-ivory/60">
              {description}
            </p>
          </Reveal>

          <Reveal delay={120} className="lg:pb-2">
            <div className="flex flex-col gap-3">
              <ButtonLink
                href={whatsappUrl(
                  settings.whatsapp,
                  `Hello ${settings.businessName}, I'd like to start a new interior design project.`,
                )}
                external
                variant="whatsapp"
                whatsapp
                className="w-full"
              >
                WhatsApp the studio
              </ButtonLink>
              <ButtonLink
                href="/contact"
                variant="light"
                arrow
                className="w-full"
              >
                Book a consultation
              </ButtonLink>
            </div>
            <div className="mt-8 border-t border-ivory/15 pt-6">
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="group flex items-center justify-between text-[0.8125rem] text-ivory/60"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="size-4 text-taupe" strokeWidth={1.4} />
                  {settings.phone}
                </span>
                <ArrowUpRight
                  className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.4}
                />
              </a>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

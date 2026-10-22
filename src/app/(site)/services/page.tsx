import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StudioCta } from "@/components/sections/studio-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getServices, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: "Interior Design Services",
    description:
      "Residential interiors, living rooms, bedrooms, modular kitchens, wardrobes, office interiors, commercial spaces, and renovation - designed end to end by Ivory & Oak.",
    path: "/services",
  });
}

const process = [
  {
    step: "01",
    title: "Discovery",
    description:
      "A site visit and a long conversation about how you live, what you love, and what you want to change.",
  },
  {
    step: "02",
    title: "Concept",
    description:
      "Layouts, mood boards, material samples, and a transparent budget that brings the direction into focus.",
  },
  {
    step: "03",
    title: "Detail",
    description:
      "Working drawings, joinery details, lighting plans, and finish schedules — everything specified before site work begins.",
  },
  {
    step: "04",
    title: "Delivery",
    description:
      "Procurement, site coordination, quality checks, styling, and a final handover you can move straight into.",
  },
];

export default async function ServicesPage() {
  const [settings, services] = await Promise.all([
    getSettings(),
    getServices(),
  ]);

  return (
    <>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
            ]}
          />
        }
        eyebrow="Services"
        title={
          <>
            Designed end to end.
            <br />
            <em className="italic text-olive">Made for living.</em>
          </>
        }
        intro="From a single room to a complete home or workspace, we bring planning, design, materials, and execution together under one studio."
      />

      <section className="py-20 sm:py-24 lg:py-32">
        <Container>
          <div className="space-y-16 lg:space-y-28">
            {services.map((service, index) => (
              <Reveal key={service.id}>
                <div
                  className={`grid items-center gap-8 lg:grid-cols-2 lg:gap-16 ${
                    index % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Link
                    href={`/services/${service.slug}`}
                    className="image-reveal group relative block aspect-[4/3] overflow-hidden bg-sand"
                  >
                    <Image
                      src={service.image}
                      alt={`${service.title} by Ivory & Oak`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                    <span className="absolute bottom-5 left-5 bg-ivory/95 px-3 py-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-charcoal/65">
                      {String(index + 1).padStart(2, "0")} / Service
                    </span>
                  </Link>

                  <div className={index % 2 === 1 ? "lg:pr-8" : "lg:pl-8"}>
                    <p className="eyebrow text-taupe">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h2 className="mt-4 text-[2.5rem] leading-[1.03] tracking-[-0.03em] text-charcoal sm:text-5xl">
                      {service.title}
                    </h2>
                    <p className="mt-5 max-w-lg text-[0.9375rem] leading-7 text-charcoal/60">
                      {service.shortDescription}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <Link
                        href={`/services/${service.slug}`}
                        className="group inline-flex h-12 items-center gap-2 border border-charcoal/25 px-5 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal transition-colors hover:bg-charcoal hover:text-ivory"
                      >
                        Explore service
                        <ArrowUpRight
                          className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          strokeWidth={1.5}
                        />
                      </Link>
                      <a
                        href={whatsappUrl(
                          settings.whatsapp,
                          `Hello ${settings.businessName}, I'd like to enquire about ${service.title.toLowerCase()}.`,
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex h-12 items-center px-1 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal/50 transition-colors hover:text-charcoal"
                      >
                        Ask a question
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-charcoal/10 bg-cream py-24 sm:py-28">
        <Container>
          <SectionHeading
            eyebrow="The process"
            title={
              <>
                Clear from the
                <br />
                <em className="italic text-olive">very beginning.</em>
              </>
            }
            intro="No mystery, no hidden costs. Every project follows a considered process with clear decisions and checkpoints along the way."
          />
          <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
            {process.map((item, index) => (
              <Reveal key={item.step} delay={index * 70}>
                <div className="border-t border-charcoal/20 pt-5">
                  <span className="text-[0.625rem] tabular-nums tracking-[0.16em] text-taupe">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-display text-[1.7rem] leading-none text-charcoal">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[0.8125rem] leading-6 text-charcoal/55">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <StudioCta
        settings={settings}
        eyebrow="Not sure where to start?"
        title="Tell us what's not working. We'll help you see what's possible."
        description="Whether it's one room or an entire home, we'll begin with an honest conversation about scope, budget, and timing."
      />
    </>
  );
}

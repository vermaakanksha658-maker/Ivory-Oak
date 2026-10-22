import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectCard } from "@/components/projects/project-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StudioCta } from "@/components/sections/studio-cta";
import {
  getProjects,
  getRedirectForPath,
  getServiceBySlug,
  getServices,
  getSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { siteUrl, whatsappUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [service, settings] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
  ]);
  if (!service) return {};

  return buildMetadata(settings, {
    title: service.seoTitle ?? service.title,
    description: service.seoDescription ?? service.shortDescription,
    path: `/services/${service.slug}`,
    image: service.ogImage ?? service.image,
    imageAlt: service.title,
  });
}

const scope = [
  "Spatial planning & layouts",
  "Bespoke joinery & storage",
  "Materials, finishes & lighting",
  "Furniture & styling",
  "Vendor coordination & site supervision",
  "Transparent budgeting & timelines",
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, settings, projects, allServices] = await Promise.all([
    getServiceBySlug(slug),
    getSettings(),
    getProjects(),
    getServices(),
  ]);

  if (!service) {
    const redirect = await getRedirectForPath(`/services/${slug}`);
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }

  const relatedProjects = projects.slice(0, 3);
  const otherServices = allServices
    .filter((item) => item.id !== service.id)
    .slice(0, 4);
  const message = `Hello ${settings.businessName}, I'd like to enquire about ${service.title}.\n\nPage: ${siteUrl()}/services/${service.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.shortDescription,
    image: service.ogImage ?? service.image,
    provider: {
      "@id": `${siteUrl()}/#business`,
    },
    areaServed: settings.serviceAreas.map((name) => ({
      "@type": "City",
      name,
    })),
    url: `${siteUrl()}/services/${service.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="border-b border-charcoal/10 bg-cream">
        <Container className="pb-14 pt-8 sm:pb-20 sm:pt-10 lg:pb-24">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Services", href: "/services" },
              {
                label: service.title,
                href: `/services/${service.slug}`,
              },
            ]}
          />

          <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end lg:gap-20">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                Our services
              </p>
              <h1 className="text-balance mt-6 text-[3.2rem] leading-[0.94] tracking-[-0.04em] text-charcoal sm:text-[4.6rem] lg:text-[5.3rem]">
                {service.title}
              </h1>
              <p className="text-pretty mt-6 max-w-xl text-[0.9375rem] leading-7 text-charcoal/60">
                {service.shortDescription}
              </p>
            </Reveal>
            <Reveal delay={100} className="lg:pb-2">
              <div className="border-l border-charcoal/15 pl-6">
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-taupe">
                  Begin with a conversation
                </p>
                <p className="mt-3 text-[0.8125rem] leading-6 text-charcoal/55">
                  Tell us about your space and we&apos;ll suggest the right
                  scope, process, and next steps.
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <ButtonLink
                    href={whatsappUrl(settings.whatsapp, message)}
                    external
                    variant="whatsapp"
                    whatsapp
                  >
                    WhatsApp enquiry
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="outline">
                    Contact
                  </ButtonLink>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="pt-10 sm:pt-14 lg:pt-16">
        <Container>
          <div className="relative aspect-[16/10] min-h-[300px] overflow-hidden bg-sand sm:min-h-[430px] lg:min-h-[610px]">
            <Image
              src={service.image}
              alt={`${service.title} designed by Ivory & Oak`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow text-taupe">The approach</p>
              <div className="prose-luxe mt-6 max-w-2xl text-[0.9688rem]">
                {service.description.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/contact" arrow>
                  Start your project
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl(settings.whatsapp, message)}
                  external
                  variant="outline"
                  whatsapp
                >
                  Chat on WhatsApp
                </ButtonLink>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="bg-cream p-7 sm:p-9">
                <p className="eyebrow text-olive">What&apos;s included</p>
                <ul className="mt-6 space-y-4">
                  {scope.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 border-b border-charcoal/10 pb-4 text-[0.8125rem] leading-6 text-charcoal/65 last:border-0 last:pb-0"
                    >
                      <Check
                        className="mt-1 size-3.5 shrink-0 text-gold"
                        strokeWidth={1.8}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-7 border-t border-charcoal/12 pt-6">
                  <p className="text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/40">
                    Studio
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="mt-2 block font-display text-[1.4rem] text-charcoal"
                  >
                    {settings.phone}
                  </a>
                  <a
                    href={`mailto:${settings.email}`}
                    className="mt-1 block text-[0.8125rem] text-charcoal/55 hover:text-charcoal"
                  >
                    {settings.email}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {relatedProjects.length > 0 && (
        <section className="border-y border-charcoal/10 bg-cream py-24 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="Recent work"
              title={
                <>
                  Spaces we&apos;ve
                  <br />
                  <em className="italic text-olive">brought to life.</em>
                </>
              }
              action={{ label: "View all projects", href: "/portfolio" }}
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((project, index) => (
                <Reveal key={project.id} delay={index * 70}>
                  <ProjectCard
                    project={project}
                    imageClassName="aspect-[4/5]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      <section className="py-20 sm:py-24">
        <Container>
          <div className="flex flex-col gap-6 border-b border-charcoal/12 pb-8 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="text-[2.4rem] leading-none text-charcoal sm:text-4xl">
              Other services
            </h2>
            <Link
              href="/services"
              className="group inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal/55 transition-colors hover:text-charcoal"
            >
              All services
              <ArrowRight
                className="size-3.5 transition-transform group-hover:translate-x-1"
                strokeWidth={1.5}
              />
            </Link>
          </div>
          <div className="grid gap-x-8 sm:grid-cols-2">
            {otherServices.map((item) => (
              <Link
                key={item.id}
                href={`/services/${item.slug}`}
                className="group flex items-center justify-between gap-6 border-b border-charcoal/12 py-6"
              >
                <div>
                  <h3 className="font-display text-[1.55rem] leading-tight text-charcoal transition-colors group-hover:text-olive">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-1 text-[0.75rem] text-charcoal/45">
                    {item.shortDescription}
                  </p>
                </div>
                <ArrowUpRight
                  className="size-4 shrink-0 text-charcoal/30 transition-all group-hover:text-charcoal"
                  strokeWidth={1.5}
                />
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <StudioCta settings={settings} />
    </>
  );
}

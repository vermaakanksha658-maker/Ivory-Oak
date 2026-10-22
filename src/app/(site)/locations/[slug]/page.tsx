import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight, ArrowUpRight, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { PageIntro } from "@/components/layout/page-intro";
import { RichText } from "@/components/content/rich-text";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { StudioCta } from "@/components/sections/studio-cta";
import {
  getLocationPageBySlug,
  getProjects,
  getRedirectForPath,
  getServices,
  getSettings,
} from "@/lib/data";
import {
  absoluteUrl,
  buildMetadata,
  webPageJsonLd,
} from "@/lib/seo";
import { formatAddress, siteUrl, whatsappUrl } from "@/lib/utils";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const [location, settings] = await Promise.all([
    getLocationPageBySlug(slug),
    getSettings(),
  ]);
  if (!location) return {};

  const description = location.seoDescription ?? location.intro;

  return buildMetadata(settings, {
    title: location.seoTitle ?? location.title,
    description,
    path: `/locations/${location.slug}`,
    image: location.ogImage ?? location.image,
    imageAlt: `${location.title} by ${settings.businessName}`,
  });
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params;
  const [location, settings, services, projects] = await Promise.all([
    getLocationPageBySlug(slug),
    getSettings(),
    getServices(),
    getProjects(),
  ]);

  if (!location) {
    const redirect = await getRedirectForPath(`/locations/${slug}`);
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }

  const cityProjects = projects
    .filter((project) =>
      project.location.toLowerCase().includes(location.city.toLowerCase()),
    )
    .slice(0, 3);
  const message = `Hello ${settings.businessName}, I'd like to discuss an interior design project in ${location.city}.\n\nArea guide: ${siteUrl()}/locations/${location.slug}`;
  const pageUrl = absoluteUrl(`/locations/${location.slug}`);
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: location.title,
    description: location.intro,
    serviceType: "Interior design",
    areaServed: {
      "@type": "City",
      name: location.city,
    },
    provider: {
      "@id": `${siteUrl()}/#business`,
    },
    url: pageUrl,
  };

  return (
    <>
      <JsonLd data={webPageJsonLd({
        name: location.title,
        description: location.intro,
        path: `/locations/${location.slug}`,
      })} />
      <JsonLd data={serviceJsonLd} />

      <PageIntro
        eyebrow={[location.city, location.region].filter(Boolean).join(" · ")}
        title={location.title}
        intro={location.intro}
      />

      {location.image && (
        <section className="pt-8 sm:pt-12">
          <Container>
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Areas", href: "/locations" },
                { label: location.city, href: `/locations/${location.slug}` },
              ]}
              className="mb-8"
            />
            <div className="relative aspect-[16/9] min-h-[280px] overflow-hidden bg-sand sm:min-h-[420px] lg:min-h-[560px]">
              <Image
                src={location.image}
                alt={`${location.title} by ${settings.businessName}`}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
            </div>
          </Container>
        </section>
      )}

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          {!location.image && (
            <Breadcrumbs
              items={[
                { label: "Home", href: "/" },
                { label: "Areas", href: "/locations" },
                { label: location.city, href: `/locations/${location.slug}` },
              ]}
              className="mb-10"
            />
          )}

          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:gap-24">
            <Reveal>
              <RichText content={location.content} />

              <div className="mt-10 flex flex-wrap gap-3">
                <ButtonLink href="/contact" arrow>
                  Start a project
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
              <aside className="bg-cream p-7 sm:p-9">
                <p className="eyebrow text-olive">Plan your project</p>
                <p className="mt-4 text-[0.875rem] leading-7 text-charcoal/55">
                  Tell us about your home in {location.city} and we will let you
                  know whether we are the right studio for it.
                </p>

                <div className="mt-7 space-y-5 border-t border-charcoal/12 pt-6">
                  <div className="flex gap-3">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-taupe"
                      strokeWidth={1.4}
                    />
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                        Studio
                      </p>
                      <p className="mt-1.5 text-[0.8125rem] leading-6 text-charcoal/60">
                        {formatAddress(settings)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Phone
                      className="mt-0.5 size-4 shrink-0 text-taupe"
                      strokeWidth={1.4}
                    />
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                        Call the studio
                      </p>
                      <a
                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                        className="mt-1.5 block text-[0.8125rem] text-charcoal/60 transition-colors hover:text-charcoal"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                </div>

                <Link
                  href="/contact"
                  className="group mt-7 inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal transition-colors hover:text-olive"
                >
                  Book a conversation
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </Link>
              </aside>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-charcoal/10 bg-sand/40 py-16 sm:py-20">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="eyebrow text-taupe">What we do</p>
              <h2 className="mt-4 text-[2.4rem] leading-[1.05] text-charcoal">
                Design, joinery,
                <br />
                <em className="italic text-olive">light and detail.</em>
              </h2>
            </div>
            <div className="divide-y divide-charcoal/12 border-t border-charcoal/12">
              {services.slice(0, 5).map((service) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group flex items-center justify-between gap-5 py-4"
                >
                  <span className="font-display text-[1.35rem] text-charcoal transition-colors group-hover:text-olive">
                    {service.title}
                  </span>
                  <ArrowRight
                    className="size-3.5 shrink-0 text-charcoal/35 transition-transform group-hover:translate-x-1"
                    strokeWidth={1.5}
                  />
                </Link>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {cityProjects.length > 0 && (
        <section className="py-20 sm:py-24 lg:py-28">
          <Container>
            <SectionHeading
              eyebrow={`${location.city} work`}
              title={
                <>
                  A few homes
                  <br />
                  <em className="italic text-olive">in the city.</em>
                </>
              }
              action={{ label: "View all projects", href: "/portfolio" }}
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {cityProjects.map((project, index) => (
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

      <StudioCta settings={settings} />
    </>
  );
}

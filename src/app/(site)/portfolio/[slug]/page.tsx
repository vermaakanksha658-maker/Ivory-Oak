import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Layers,
  MapPin,
  Palette,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProjectGallery } from "@/components/projects/project-gallery";
import { BeforeAfter } from "@/components/projects/before-after";
import { ProjectCard } from "@/components/projects/project-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StudioCta } from "@/components/sections/studio-cta";
import {
  getProjectBySlug,
  getRedirectForPath,
  getRelatedProjects,
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
  const [project, settings] = await Promise.all([
    getProjectBySlug(slug),
    getSettings(),
  ]);
  if (!project) return {};

  return buildMetadata(settings, {
    title: project.seoTitle ?? project.title,
    description: project.seoDescription ?? project.description,
    path: `/portfolio/${project.slug}`,
    image: project.ogImage ?? project.coverImage,
    imageAlt: project.title,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    const redirect = await getRedirectForPath(`/portfolio/${slug}`);
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }

  const [settings, relatedProjects] = await Promise.all([
    getSettings(),
    getRelatedProjects(project),
  ]);

  const message = `Hello ${settings.businessName}, I love the ${project.title} project. I'd like to discuss something similar for my space.\n\nProject: ${siteUrl()}/portfolio/${project.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    image: [project.coverImage, ...project.images.map((img) => img.url)],
    creator: {
      "@id": `${siteUrl()}/#business`,
    },
    locationCreated: {
      "@type": "Place",
      name: project.location,
    },
    dateCreated: project.year ?? undefined,
    url: `${siteUrl()}/portfolio/${project.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-cream pb-10 pt-8 sm:pb-14 sm:pt-10">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/portfolio" },
              {
                label: project.title,
                href: `/portfolio/${project.slug}`,
              },
            ]}
          />

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end lg:gap-16">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                {project.category} · {project.year}
              </p>
              <h1 className="text-balance mt-5 text-[3.1rem] leading-[0.95] tracking-[-0.04em] text-charcoal sm:text-[4.5rem] lg:text-[5.6rem]">
                {project.title}
              </h1>
              {project.subtitle && (
                <p className="text-pretty mt-6 max-w-2xl text-[1.05rem] leading-8 text-charcoal/60">
                  {project.subtitle}
                </p>
              )}
            </Reveal>
            <Reveal delay={100}>
              <div className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-charcoal/15 pt-6">
                <div>
                  <p className="flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-taupe">
                    <MapPin className="size-3.5" strokeWidth={1.4} />
                    Location
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-charcoal/70">
                    {project.location}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-taupe">
                    <Palette className="size-3.5" strokeWidth={1.4} />
                    Style
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-charcoal/70">
                    {project.style}
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-taupe">
                    <Layers className="size-3.5" strokeWidth={1.4} />
                    Scope
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-charcoal/70">
                    Interior design &amp; delivery
                  </p>
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-taupe">
                    <CalendarDays className="size-3.5" strokeWidth={1.4} />
                    Completed
                  </p>
                  <p className="mt-2 text-[0.8125rem] text-charcoal/70">
                    {project.year ?? "Recent"}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section>
        <Container>
          <div className="relative aspect-[16/10] min-h-[320px] overflow-hidden bg-sand sm:min-h-[460px] lg:min-h-[680px]">
            <Image
              src={project.coverImage}
              alt={`${project.title} — ${project.style} interior in ${project.location}`}
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
          <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow text-taupe">The story</p>
              <div className="prose-luxe mt-6 max-w-2xl text-[0.9688rem]">
                {project.story.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="bg-cream p-7 sm:p-9 lg:sticky lg:top-32">
                <p className="eyebrow text-olive">Imagine something similar</p>
                <h2 className="mt-4 font-display text-[1.9rem] leading-[1.1] text-charcoal">
                  Love this project? Let&apos;s design yours.
                </h2>
                <p className="mt-3 text-[0.8125rem] leading-6 text-charcoal/55">
                  Share your space and we&apos;ll help you find the right
                  direction, scope, and budget.
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  <ButtonLink
                    href={whatsappUrl(settings.whatsapp, message)}
                    external
                    variant="whatsapp"
                    whatsapp
                  >
                    Enquire on WhatsApp
                  </ButtonLink>
                  <ButtonLink href="/contact" variant="outline" arrow>
                    Book a consultation
                  </ButtonLink>
                </div>
                <div className="mt-6 border-t border-charcoal/12 pt-5">
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                    Or call the studio
                  </p>
                  <a
                    href={`tel:${settings.phone.replace(/\s/g, "")}`}
                    className="mt-1.5 block font-display text-xl text-charcoal"
                  >
                    {settings.phone}
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {project.beforeImage && project.afterImage && (
        <section className="border-y border-charcoal/10 bg-cream py-20 sm:py-24">
          <Container>
            <div className="max-w-2xl">
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                Before &amp; after
              </p>
              <h2 className="mt-5 text-[2.5rem] leading-[1.02] text-charcoal sm:text-5xl">
                The transformation,
                <br />
                <em className="italic text-olive">revealed.</em>
              </h2>
            </div>
            <div className="mt-10">
              <BeforeAfter
                before={project.beforeImage}
                after={project.afterImage}
                title={project.title}
              />
            </div>
          </Container>
        </section>
      )}

      {project.images.length > 0 && (
        <section className="py-20 sm:py-24 lg:py-28">
          <Container>
            <div className="mb-9 flex flex-col gap-4 border-b border-charcoal/12 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-taupe">The gallery</p>
                <h2 className="mt-3 text-[2.4rem] leading-none text-charcoal sm:text-4xl">
                  Inside the space
                </h2>
              </div>
              <p className="text-[0.625rem] uppercase tracking-[0.14em] text-charcoal/35">
                {project.images.length} images · Click to expand
              </p>
            </div>
            <ProjectGallery images={project.images} title={project.title} />
          </Container>
        </section>
      )}

      {relatedProjects.length > 0 && (
        <section className="border-t border-charcoal/10 bg-cream py-24 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="More to explore"
              title={
                <>
                  Other spaces,
                  <br />
                  <em className="italic text-olive">same care.</em>
                </>
              }
              action={{ label: "View all projects", href: "/portfolio" }}
            />
            <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProjects.map((related, index) => (
                <Reveal key={related.id} delay={index * 70}>
                  <ProjectCard
                    project={related}
                    imageClassName="aspect-[4/5]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </Reveal>
              ))}
            </div>
            <div className="mt-12">
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal/55 transition-colors hover:text-charcoal"
              >
                Back to all projects
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </Container>
        </section>
      )}

      <StudioCta settings={settings} />
    </>
  );
}

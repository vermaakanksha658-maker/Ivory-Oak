import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  PenTool,
  Ruler,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { ProjectCard } from "@/components/projects/project-card";
import { ProductCard } from "@/components/products/product-card";
import { ServiceRow } from "@/components/services/service-row";
import { Testimonials } from "@/components/home/testimonials";
import { StudioCta } from "@/components/sections/studio-cta";
import {
  getFeaturedProducts,
  getFeaturedProjects,
  getProjects,
  getServices,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { whatsappUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: settings.seoTitle,
    description: settings.seoDescription || settings.heroDescription,
    path: "/",
    absoluteTitle: true,
  });
}

function AccentTitle({ value }: { value: string }) {
  const lines = value.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return null;

  return (
    <>
      {lines.slice(0, -1).map((line, index) => (
        <span key={`${line}-${index}`}>
          {line}
          <br />
        </span>
      ))}
      <em className="italic text-olive">{lines[lines.length - 1]}</em>
    </>
  );
}

const process = [
  {
    icon: PenTool,
    title: "Listen & imagine",
    text: "We begin with your routines, your references, and a conversation about how you want to feel at home.",
  },
  {
    icon: Ruler,
    title: "Draw & refine",
    text: "Layouts, samples, and detailed drawings bring the vision into focus — with clear budgets at every step.",
  },
  {
    icon: Sparkles,
    title: "Make & style",
    text: "Our trusted makers and project team deliver every finish, then we style the final layer.",
  },
];

export default async function HomePage() {
  const [settings, projects, services, products, testimonials] =
    await Promise.all([
      getSettings(),
      getFeaturedProjects(),
      getServices(),
      getFeaturedProducts(),
      getTestimonials(),
    ]);

  const allProjects = await getProjects();
  const heroProject = projects[0] ?? allProjects[0];
  const headlineWords = settings.heroTitle.trim().split(/\s+/);
  const lastWords = headlineWords.slice(-2).join(" ");
  const firstWords = headlineWords.slice(0, -2).join(" ");

  return (
    <>
      <section className="relative overflow-hidden bg-cream">
        <Container className="relative grid gap-0 lg:grid-cols-[0.88fr_1.12fr]">
          <div className="flex flex-col justify-center py-14 sm:py-20 lg:min-h-[690px] lg:py-20 lg:pr-14">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-8 bg-taupe" />
                {settings.heroEyebrow}
              </p>
            </Reveal>
            <Reveal delay={90}>
              <h1 className="text-balance mt-7 text-[3.4rem] leading-[0.92] tracking-[-0.04em] text-charcoal sm:text-[4.8rem] lg:text-[5.05rem] xl:text-[5.7rem]">
                {firstWords}{" "}
                <em className="font-normal italic text-olive">{lastWords}</em>
              </h1>
            </Reveal>
            <Reveal delay={180}>
              <p className="text-pretty mt-7 max-w-md text-[0.9375rem] leading-7 text-charcoal/62">
                {settings.heroDescription}
              </p>
            </Reveal>
            <Reveal delay={260}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <ButtonLink href="/portfolio" arrow>
                  Explore our work
                </ButtonLink>
                <ButtonLink
                  href={whatsappUrl(
                    settings.whatsapp,
                    `Hello ${settings.businessName}, I'd like to discuss an interior design project.`,
                  )}
                  external
                  variant="outline"
                  whatsapp
                >
                  WhatsApp us
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={340}>
              <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-charcoal/15 pt-7">
                {[
                  { value: `${settings.yearsExperience}+`, label: "Years of practice" },
                  { value: `${settings.projectsCompleted}+`, label: "Spaces designed" },
                  { value: `${settings.citiesServed}`, label: "Cities served" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-[1.9rem] leading-none text-charcoal">
                      {stat.value}
                    </p>
                    <p className="mt-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/45">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <div className="relative pb-8 lg:py-10 lg:pl-6">
            <div className="relative h-[420px] overflow-hidden bg-sand sm:h-[560px] lg:h-full lg:min-h-[620px]">
              <Image
                src={settings.heroImage}
                alt={`A warm, light-filled interior designed by ${settings.businessName}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="hero-image object-cover"
              />
              {heroProject && (
                <div className="absolute bottom-0 left-0 max-w-[280px] bg-ivory p-5 sm:bottom-6 sm:left-6 sm:p-6">
                  <p className="eyebrow text-taupe">Selected project</p>
                  <p className="mt-3 font-display text-[1.55rem] leading-tight text-charcoal">
                    {heroProject.title}
                  </p>
                  <p className="mt-1.5 text-[0.625rem] uppercase tracking-[0.12em] text-charcoal/45">
                    {heroProject.location}
                  </p>
                  <Link
                    href={`/portfolio/${heroProject.slug}`}
                    className="mt-4 inline-flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-charcoal"
                  >
                    View project
                    <ArrowUpRight className="size-3.5" strokeWidth={1.6} />
                  </Link>
                </div>
              )}
              <div className="absolute right-5 top-5 hidden items-center gap-2 border border-ivory/50 bg-ink/20 px-3 py-2 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ivory backdrop-blur-sm sm:flex">
                Est. 2013 · Hyderabad
              </div>
            </div>
          </div>
        </Container>

        <div className="border-t border-charcoal/10">
          <Container className="flex flex-wrap items-center justify-between gap-x-10 gap-y-3 py-5 text-[0.625rem] font-medium uppercase tracking-[0.17em] text-charcoal/45">
            <span>Residential interiors</span>
            <span>Bespoke joinery</span>
            <span>Modular kitchens</span>
            <span>Commercial spaces</span>
            <span>Turnkey execution</span>
          </Container>
        </div>
      </section>

      <section className="py-24 sm:py-28 lg:py-36">
        <Container>
          <SectionHeading
            eyebrow={settings.homeProjectsEyebrow}
            title={<AccentTitle value={settings.homeProjectsTitle} />}
            intro={settings.homeProjectsDescription}
            action={{ label: "View all projects", href: "/portfolio" }}
          />
          <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:mt-16 lg:gap-x-8 lg:gap-y-16">
            {projects.slice(0, 4).map((project, index) => (
              <Reveal
                key={project.id}
                delay={index * 80}
                className={index % 2 === 1 ? "sm:mt-16" : ""}
              >
                <ProjectCard
                  project={project}
                  priority={index < 2}
                  imageClassName={index % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/6]"}
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-sand/55 py-24 sm:py-28 lg:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-20">
            <Reveal className="relative">
              <div className="relative ml-0 aspect-[4/5] w-[88%] overflow-hidden bg-cream sm:ml-10">
                <Image
                  src={settings.aboutImage}
                  alt={`An ${settings.businessName} interior layered with natural textures`}
                  fill
                  sizes="(max-width: 1024px) 90vw, 45vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-7 right-0 w-[52%] bg-charcoal p-6 text-ivory sm:bottom-8 sm:right-2 lg:-right-4 lg:p-8">
                <p className="font-display text-[3.2rem] leading-none text-ivory">
                  {settings.yearsExperience}
                </p>
                <p className="mt-2 text-[0.5625rem] font-semibold uppercase leading-4 tracking-[0.16em] text-ivory/55">
                  Years of designing
                  <br />
                  homes with heart
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                The studio
              </p>
              <h2 className="text-balance mt-6 text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-charcoal sm:text-5xl lg:text-[3.6rem]">
                Considered design.
                <br />
                <em className="italic text-olive">Lived-in luxury.</em>
              </h2>
              <div className="prose-luxe mt-7 max-w-lg text-[0.9375rem]">
                <p>
                  {settings.aboutStory.split("\n\n")[0]}
                </p>
                <p>
                  We blend Indian craft with a contemporary, restrained eye —
                  creating rooms that feel personal from the first day and more
                  beautiful with every year.
                </p>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <Link
                  href="/about"
                  className="link-underline inline-flex items-center gap-2 pb-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-charcoal"
                >
                  Our story & philosophy
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </Link>
                <div className="flex items-center gap-3">
                  <span className="h-8 w-px bg-charcoal/20" />
                  <div>
                    <p className="font-display text-lg leading-none text-charcoal">
                      {settings.founderName}
                    </p>
                    <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.13em] text-charcoal/45">
                      {settings.founderRole}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28 lg:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
            <Reveal>
              <div className="lg:sticky lg:top-32">
                <SectionHeading
                  eyebrow={settings.homeServicesEyebrow}
                  title={<AccentTitle value={settings.homeServicesTitle} />}
                  intro={settings.homeServicesDescription}
                />
                <ButtonLink
                  href="/services"
                  variant="outline"
                  arrow
                  className="mt-8"
                >
                  Explore services
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="border-t border-charcoal/12">
                {services.slice(0, 5).map((service, index) => (
                  <ServiceRow key={service.id} service={service} index={index} />
                ))}
              </div>
              <Link
                href="/services"
                className="group mt-8 inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-charcoal/55 transition-colors hover:text-charcoal"
              >
                All services
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-charcoal/10 bg-cream py-24 sm:py-28 lg:py-32">
        <Container>
          <SectionHeading
            eyebrow={settings.homeProductsEyebrow}
            title={<AccentTitle value={settings.homeProductsTitle} />}
            intro={settings.homeProductsDescription}
            action={{ label: "Browse the collection", href: "/products" }}
          />
          <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:mt-16 lg:grid-cols-4 lg:gap-7">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28 lg:py-36">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <Reveal>
              <SectionHeading
                eyebrow={settings.homeWhyEyebrow}
                title={<AccentTitle value={settings.homeWhyTitle} />}
                intro={settings.homeWhyDescription}
              />
              <div className="mt-10 grid gap-6 border-t border-charcoal/12 pt-8 sm:grid-cols-3">
                {process.map((step) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.title}>
                      <Icon
                        className="size-5 text-taupe"
                        strokeWidth={1.3}
                      />
                      <p className="mt-3 font-display text-lg leading-tight text-charcoal">
                        {step.title}
                      </p>
                      <p className="mt-2 text-[0.75rem] leading-5 text-charcoal/50">
                        {step.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="divide-y divide-charcoal/12 border-t border-charcoal/12">
                {settings.whyChooseUs.map((item, index) => (
                  <div
                    key={item.title}
                    className="group grid grid-cols-[2.5rem_1fr] gap-5 py-6 sm:grid-cols-[3rem_1fr] sm:py-7"
                  >
                    <span className="text-[0.625rem] tabular-nums tracking-[0.16em] text-taupe">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="flex items-start justify-between gap-6">
                      <div>
                        <h3 className="font-display text-[1.55rem] leading-tight text-charcoal">
                          {item.title}
                        </h3>
                        <p className="mt-2 max-w-md text-[0.8125rem] leading-6 text-charcoal/55">
                          {item.description}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="mt-1 size-4 shrink-0 text-charcoal/25 transition-all duration-300 group-hover:text-charcoal"
                        strokeWidth={1.4}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-sand/55 py-24 sm:py-28 lg:py-32">
        <Container>
          <SectionHeading
            eyebrow={settings.homeTestimonialsEyebrow}
            title={<AccentTitle value={settings.homeTestimonialsTitle} />}
            align="center"
            className="mb-12"
          />
          <Reveal>
            <Testimonials
              testimonials={testimonials}
              image={settings.aboutImage}
            />
          </Reveal>
        </Container>
      </section>

      <StudioCta
        settings={settings}
        eyebrow={settings.homeCtaEyebrow}
        title={settings.homeCtaTitle}
        description={settings.homeCtaDescription}
        image={settings.homeCtaImage ?? settings.heroImage}
      />
    </>
  );
}

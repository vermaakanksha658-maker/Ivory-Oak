import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { ProjectCard } from "@/components/projects/project-card";
import { Reveal } from "@/components/ui/reveal";
import { StudioCta } from "@/components/sections/studio-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getProjectCategories, getProjects, getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: "Projects & Portfolio",
    description: `Explore ${settings.businessName}'s portfolio of residential interiors, apartments, kitchens, bedrooms, and commercial spaces across Hyderabad and South India.`,
    path: "/portfolio",
  });
}

export default async function PortfolioPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [settings, allProjects, categories] = await Promise.all([
    getSettings(),
    getProjects(),
    getProjectCategories(),
  ]);

  const selectedCategory =
    category && categories.includes(category) ? category : undefined;
  const projects = selectedCategory
    ? allProjects.filter((project) => project.category === selectedCategory)
    : allProjects;

  return (
    <>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Projects", href: "/portfolio" },
            ]}
          />
        }
        eyebrow="Portfolio"
        title={
          <>
            Spaces that tell
            <br />
            <em className="italic text-olive">someone&apos;s story.</em>
          </>
        }
        intro="Homes, kitchens, bedrooms, and workspaces — each one shaped around the people who use it. Browse a selection of our recent projects."
        aside={
          <div className="flex items-baseline gap-3 lg:justify-end">
            <span className="font-display text-[3.4rem] leading-none text-charcoal">
              {String(allProjects.length).padStart(2, "0")}
            </span>
            <span className="max-w-[5rem] text-[0.5625rem] font-semibold uppercase leading-4 tracking-[0.14em] text-charcoal/40">
              Projects in our portfolio
            </span>
          </div>
        }
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mb-10 flex flex-col gap-6 border-b border-charcoal/12 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2" aria-label="Project categories">
              <Link
                href="/portfolio"
                className={`px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                  !selectedCategory
                    ? "bg-charcoal text-ivory"
                    : "border border-charcoal/15 text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                All work
              </Link>
              {categories.map((item) => (
                <Link
                  key={item}
                  href={`/portfolio?category=${encodeURIComponent(item)}`}
                  className={`px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    selectedCategory === item
                      ? "bg-charcoal text-ivory"
                      : "border border-charcoal/15 text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
            <p className="shrink-0 text-[0.625rem] uppercase tracking-[0.13em] text-charcoal/35">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </p>
          </div>

          {projects.length === 0 ? (
            <div className="border border-charcoal/10 bg-cream px-6 py-20 text-center">
              <p className="font-display text-3xl text-charcoal">
                No projects in this category yet.
              </p>
              <Link
                href="/portfolio"
                className="mt-5 inline-block text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal underline underline-offset-4"
              >
                View all projects
              </Link>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:gap-x-8 lg:gap-y-20">
              {projects.map((project, index) => (
                <Reveal
                  key={project.id}
                  delay={(index % 2) * 90}
                  className={index % 2 === 1 ? "sm:mt-20" : ""}
                >
                  <ProjectCard
                    project={project}
                    priority={index < 2}
                    imageClassName={index % 3 === 0 ? "aspect-[4/5]" : "aspect-[5/6]"}
                  />
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <StudioCta
        settings={settings}
        eyebrow="Your project next"
        title="Every home has a story worth designing for."
        description="Share a few details about your space and we'll be in touch within two working days."
      />
    </>
  );
}

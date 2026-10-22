import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { StudioCta } from "@/components/sections/studio-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { getSettings } from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: "About the Studio",
    description: `Meet ${settings.businessName} - a Hyderabad-based interior design studio blending Indian craft, contemporary restraint, and a deeply personal design process.`,
    path: "/about",
  });
}

export default async function AboutPage() {
  const settings = await getSettings();
  const paragraphs = settings.aboutStory.split("\n\n");

  return (
    <>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
            ]}
          />
        }
        eyebrow="About Ivory & Oak"
        title={
          <>
            A studio for homes
            <br />
            with a <em className="italic text-olive">point of view.</em>
          </>
        }
        intro="We are designers, listeners, and detail-obsessives. For over a decade, we have been creating interiors that feel personal, generous, and quietly beautiful."
      />

      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="relative aspect-[16/9] min-h-[320px] overflow-hidden bg-sand sm:min-h-[460px] lg:min-h-[610px]">
            <Image
              src={settings.aboutImage}
              alt="Warm, layered interior with natural materials by Ivory & Oak"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute bottom-0 left-0 max-w-md bg-ivory p-6 sm:bottom-8 sm:left-8 sm:p-8">
              <p className="eyebrow text-taupe">Our philosophy</p>
              <p className="mt-4 font-display text-[1.5rem] leading-[1.35] text-charcoal sm:text-[1.75rem]">
                “{settings.philosophy}”
              </p>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-20 sm:pb-24 lg:pb-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                Our story
              </p>
              <h2 className="mt-6 text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-charcoal sm:text-5xl">
                Built slowly,
                <br />
                <em className="italic text-olive">on purpose.</em>
              </h2>
              <div className="mt-8 flex items-center gap-4 border-t border-charcoal/15 pt-6">
                {settings.founderImage && (
                  <div className="relative size-14 overflow-hidden rounded-full bg-sand">
                    <Image
                      src={settings.founderImage}
                      alt={settings.founderName}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-display text-xl leading-none text-charcoal">
                    {settings.founderName}
                  </p>
                  <p className="mt-1.5 text-[0.625rem] uppercase tracking-[0.13em] text-charcoal/45">
                    {settings.founderRole}
                  </p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="prose-luxe max-w-2xl text-[0.9375rem]">
                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className={
                      index === 0
                        ? "first-letter:float-left first-letter:mr-3 first-letter:font-display first-letter:text-[4.4rem] first-letter:leading-[0.75] first-letter:text-olive"
                        : ""
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
              <div className="mt-10 grid grid-cols-3 gap-4 border-t border-charcoal/15 pt-7">
                {[
                  { value: settings.yearsExperience, label: "Years in practice" },
                  { value: settings.projectsCompleted, label: "Projects completed" },
                  { value: settings.citiesServed, label: "Cities served" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-[2.2rem] leading-none text-charcoal">
                      {stat.value}
                      <span className="text-taupe">+</span>
                    </p>
                    <p className="mt-2 text-[0.5625rem] font-semibold uppercase leading-4 tracking-[0.13em] text-charcoal/45">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="bg-charcoal py-24 text-ivory sm:py-28 lg:py-32">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-beige/70">
                <span className="h-px w-7 bg-beige/50" />
                What we believe
              </p>
              <h2 className="mt-6 text-[2.7rem] leading-[1.02] tracking-[-0.03em] text-ivory sm:text-5xl">
                Our values are
                <br />
                <em className="italic text-beige">in the details.</em>
              </h2>
            </Reveal>
            <div className="border-t border-ivory/15">
              {settings.values.map((value, index) => (
                <Reveal key={value.title} delay={index * 70}>
                  <div className="grid grid-cols-[2.5rem_1fr] gap-5 border-b border-ivory/15 py-6 sm:grid-cols-[4rem_1fr] sm:py-7">
                    <span className="text-[0.625rem] tabular-nums tracking-[0.16em] text-beige/40">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="font-display text-[1.6rem] leading-tight text-ivory">
                        {value.title}
                      </h3>
                      <p className="mt-2 max-w-lg text-[0.8125rem] leading-6 text-ivory/55">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-24 sm:py-28 lg:py-36">
        <Container>
          <SectionHeading
            eyebrow="The people"
            title={
              <>
                Small team.
                <br />
                <em className="italic text-olive">Senior attention.</em>
              </>
            }
            intro="You will work directly with the people designing your home. We keep our project list deliberately short so that every space gets the care it deserves."
          />
          <div className="mt-12 grid gap-8 sm:grid-cols-3 lg:mt-16">
            {settings.team.map((member, index) => (
              <Reveal key={member.name} delay={index * 80}>
                <div className="group">
                  <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                    <Image
                      src={member.image}
                      alt={`${member.name}, ${member.role} at Ivory & Oak`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-[1.6rem] leading-tight text-charcoal">
                          {member.name}
                        </h3>
                        <p className="mt-1 text-[0.625rem] uppercase tracking-[0.14em] text-taupe">
                          {member.role}
                        </p>
                      </div>
                      <span className="pt-2 text-[0.625rem] tabular-nums text-charcoal/30">
                        0{index + 1}
                      </span>
                    </div>
                    <p className="mt-4 text-[0.8125rem] leading-6 text-charcoal/55">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-charcoal/10 bg-cream py-20 sm:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-20">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-olive">
                <span className="h-px w-7 bg-taupe" />
                Where we work
              </p>
              <h2 className="mt-6 text-[2.6rem] leading-[1.03] tracking-[-0.03em] text-charcoal sm:text-5xl">
                South India,
                <br />
                <em className="italic text-olive">close at hand.</em>
              </h2>
              <p className="mt-5 max-w-md text-[0.875rem] leading-7 text-charcoal/55">
                Our studio is based in Hyderabad, with projects across
                Bengaluru, Vijayawada, Visakhapatnam, and beyond. For larger
                homes and commercial spaces, we travel wherever the work takes
                us.
              </p>
              <ButtonLink href="/contact" variant="outline" arrow className="mt-7">
                Discuss your location
              </ButtonLink>
            </Reveal>
            <Reveal delay={100}>
              <div className="border-t border-charcoal/15">
                {settings.serviceAreas.map((area, index) => (
                  <div
                    key={area}
                    className="flex items-center justify-between border-b border-charcoal/15 py-5"
                  >
                    <div className="flex items-center gap-4">
                      <MapPin className="size-4 text-taupe" strokeWidth={1.4} />
                      <span className="font-display text-[1.5rem] text-charcoal">
                        {area}
                      </span>
                    </div>
                    <span className="text-[0.625rem] tabular-nums tracking-[0.14em] text-charcoal/30">
                      0{index + 1}
                    </span>
                  </div>
                ))}
              </div>
              <a
                href={settings.googleMapsEmbedUrl ?? "https://maps.google.com"}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-7 inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal/55 transition-colors hover:text-charcoal"
              >
                Find the Hyderabad studio
                <ArrowUpRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                />
              </a>
            </Reveal>
          </div>
        </Container>
      </section>

      <StudioCta settings={settings} />
    </>
  );
}

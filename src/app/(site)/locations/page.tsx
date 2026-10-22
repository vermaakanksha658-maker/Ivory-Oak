import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { Reveal } from "@/components/ui/reveal";
import { StudioCta } from "@/components/sections/studio-cta";
import { getLocationPages, getSettings } from "@/lib/data";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: "Areas We Design",
    description: `Explore the cities and regions where ${settings.businessName} designs homes, apartments, kitchens, and workspaces.`,
    path: "/locations",
  });
}

export default async function LocationsPage() {
  const [settings, locations] = await Promise.all([
    getSettings(),
    getLocationPages(),
  ]);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: "Areas We Design",
          description: `Explore the cities and regions where ${settings.businessName} designs homes, apartments, kitchens, and workspaces.`,
          path: "/locations",
        })}
      />
      <PageIntro
        eyebrow="Where we work"
        title={
          <>
            Homes across
            <br />
            <em className="italic text-olive">South India.</em>
          </>
        }
        intro={`We are based in ${settings.addressLocality} and take on a limited number of projects in other cities. These guides explain how we work in each place.`}
      />

      <section className="py-16 sm:py-20 lg:py-24">
        <Container>
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Areas", href: "/locations" },
            ]}
            className="mb-10"
          />

          {locations.length === 0 ? (
            <p className="max-w-xl text-[0.9375rem] leading-7 text-charcoal/55">
              Our location guides are being prepared. In the meantime, contact
              the studio to ask whether we work in your city.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2">
              {locations.map((location, index) => (
                <Reveal key={location.id} delay={index * 70}>
                  <Link
                    href={`/locations/${location.slug}`}
                    className="group block"
                  >
                    {location.image && (
                      <div className="relative aspect-[16/11] overflow-hidden bg-sand">
                        <Image
                          src={location.image}
                          alt={`${location.title} by ${settings.businessName}`}
                          fill
                          sizes="(max-width: 640px) 100vw, 50vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      </div>
                    )}
                    <div className="flex items-start justify-between gap-6 border-b border-charcoal/12 py-5">
                      <div>
                        <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-taupe">
                          {[location.region, "India"].filter(Boolean).join(" · ")}
                        </p>
                        <h2 className="mt-2 font-display text-[2rem] leading-none text-charcoal transition-colors group-hover:text-olive">
                          {location.city}
                        </h2>
                        <p className="mt-3 max-w-md text-[0.8125rem] leading-6 text-charcoal/50">
                          {location.intro}
                        </p>
                      </div>
                      <ArrowUpRight
                        className="mt-7 size-4 shrink-0 text-charcoal/30 transition-all group-hover:text-charcoal"
                        strokeWidth={1.5}
                      />
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </Container>
      </section>

      <StudioCta settings={settings} />
    </>
  );
}

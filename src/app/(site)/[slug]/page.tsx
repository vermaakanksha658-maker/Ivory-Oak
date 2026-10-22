import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { RichText } from "@/components/content/rich-text";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { StudioCta } from "@/components/sections/studio-cta";
import {
  getPageBySlug,
  getRedirectForPath,
  getSettings,
} from "@/lib/data";
import { buildMetadata, webPageJsonLd } from "@/lib/seo";

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page) return {};

  const settings = await getSettings();
  const description = page.seoDescription ?? page.excerpt ?? undefined;

  return buildMetadata(settings, {
    title: page.seoTitle ?? page.title,
    description:
      description ?? `${page.title} from ${settings.businessName}.`,
    path: `/${page.slug}`,
    image: page.ogImage,
    imageAlt: page.title,
  });
}

export default async function ContentPage({ params }: PageProps) {
  const { slug } = await params;
  const [page, settings] = await Promise.all([
    getPageBySlug(slug),
    getSettings(),
  ]);

  if (!page) {
    const redirect = await getRedirectForPath(`/${slug}`);
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }

  const updated = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(page.updatedAt);

  return (
    <>
      <JsonLd
        data={webPageJsonLd({
          name: page.title,
          description: page.excerpt,
          path: `/${page.slug}`,
        })}
      />
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: page.title, href: `/${page.slug}` },
            ]}
          />
        }
        eyebrow="Studio policies"
        title={page.title}
        intro={page.excerpt ?? undefined}
      />

      <section className="py-16 sm:py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.35fr_0.65fr] lg:gap-20">
            <aside>
              <div className="border-t border-charcoal/15 pt-5">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                  Last updated
                </p>
                <p className="mt-2 text-[0.8125rem] text-charcoal/55">{updated}</p>
              </div>
              <div className="mt-6 border-t border-charcoal/15 pt-5">
                <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                  Questions
                </p>
                <Link
                  href="/contact"
                  className="link-underline mt-3 inline-flex items-center gap-2 pb-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal"
                >
                  Ask the studio
                  <ArrowRight className="size-3.5" strokeWidth={1.5} />
                </Link>
              </div>
            </aside>

            <article>
              <RichText content={page.content} />
            </article>
          </div>
        </Container>
      </section>

      <StudioCta settings={settings} />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import {
  ArrowRight,
  Check,
  Package,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { StudioCta } from "@/components/sections/studio-cta";
import {
  getProductBySlug,
  getRedirectForPath,
  getRelatedProducts,
  getSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatPrice, siteUrl, whatsappUrl } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ]);
  if (!product) return {};

  return buildMetadata(settings, {
    title: product.seoTitle ?? product.name,
    description:
      product.seoDescription ?? product.description.slice(0, 160),
    path: `/products/${product.slug}`,
    image: product.ogImage ?? product.coverImage,
    imageAlt: product.name,
  });
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    const redirect = await getRedirectForPath(`/products/${slug}`);
    if (redirect) permanentRedirect(redirect.toPath);
    notFound();
  }

  const [settings, relatedProducts] = await Promise.all([
    getSettings(),
    getRelatedProducts(product),
  ]);

  const pageUrl = `${siteUrl()}/products/${product.slug}`;
  const priceLabel =
    product.priceOnRequest || product.price === null
      ? "Price on request"
      : formatPrice(product.price);
  const message = `Hello ${settings.businessName}, I'm interested in the ${product.name} (${priceLabel}). Could you share more details?\n\nProduct page: ${pageUrl}`;

  const specs = [
    { label: "Material", value: product.material },
    { label: "Dimensions", value: product.dimensions },
    { label: "Colour / Finish", value: product.color },
    { label: "Lead time", value: product.leadTime },
  ].filter((spec) => Boolean(spec.value));

  const images =
    product.images.length > 0
      ? product.images
      : [
          {
            id: `${product.id}-cover`,
            url: product.coverImage,
            alt: product.name,
            sortOrder: 0,
          },
        ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.map((image) => image.url),
    category: product.category,
    material: product.material ?? undefined,
    color: product.color ?? undefined,
    brand: {
      "@type": "Brand",
      name: settings.businessName,
    },
    url: pageUrl,
    ...(!product.priceOnRequest && product.price !== null
      ? {
          offers: {
            "@type": "Offer",
            price: product.price,
            priceCurrency: "INR",
            availability: "https://schema.org/InStoreOnly",
            url: pageUrl,
            seller: {
              "@id": `${siteUrl()}/#business`,
            },
          },
        }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="bg-cream">
        <Container className="pb-8 pt-8 sm:pt-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collection", href: "/products" },
              {
                label: product.name,
                href: `/products/${product.slug}`,
              },
            ]}
          />
        </Container>
      </section>

      <section className="pb-16 pt-6 sm:pb-20 lg:pb-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
            <Reveal>
              <ProductGallery images={images} name={product.name} />
            </Reveal>

            <Reveal delay={100}>
              <div className="lg:sticky lg:top-32">
                <p className="eyebrow text-taupe">{product.category}</p>
                <h1 className="text-balance mt-4 text-[2.9rem] leading-[0.98] tracking-[-0.035em] text-charcoal sm:text-[3.7rem]">
                  {product.name}
                </h1>
                <p className="mt-4 text-[1.05rem] font-medium text-charcoal/70">
                  {priceLabel}
                </p>
                <p className="mt-6 text-[0.9375rem] leading-7 text-charcoal/60">
                  {product.description}
                </p>

                <div className="mt-7 flex flex-col gap-3">
                  <ButtonLink
                    href={whatsappUrl(settings.whatsapp, message)}
                    external
                    variant="whatsapp"
                    whatsapp
                    className="w-full"
                  >
                    WhatsApp inquiry
                  </ButtonLink>
                  <ButtonLink
                    href={`/contact?product=${product.slug}`}
                    variant="outline"
                    arrow
                    className="w-full"
                  >
                    {product.priceOnRequest
                      ? "Contact for price"
                      : "Request pricing & availability"}
                  </ButtonLink>
                </div>
                <p className="mt-3 text-center text-[0.5625rem] uppercase tracking-[0.13em] text-charcoal/35">
                  Catalog only · No online payment or checkout
                </p>

                {specs.length > 0 && (
                  <div className="mt-8 border-t border-charcoal/15">
                    {specs.map((spec) => (
                      <div
                        key={spec.label}
                        className="grid grid-cols-[5.5rem_1fr] gap-4 border-b border-charcoal/10 py-3.5 text-[0.8125rem]"
                      >
                        <span className="text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-charcoal/40">
                          {spec.label}
                        </span>
                        <span className="text-charcoal/70">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {product.specifications && (
                  <div className="mt-6">
                    <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-charcoal/40">
                      Additional specifications
                    </p>
                    <dl className="mt-3 space-y-2">
                      {product.specifications
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean)
                        .map((line) => {
                          const [label, ...rest] = line.split(":");
                          return (
                            <div
                              key={line}
                              className="grid grid-cols-[6.5rem_1fr] gap-3 text-[0.75rem] leading-5"
                            >
                              <dt className="text-charcoal/40">
                                {rest.length > 0 ? label.trim() : "Detail"}
                              </dt>
                              <dd className="text-charcoal/65">
                                {rest.length > 0 ? rest.join(":").trim() : line}
                              </dd>
                            </div>
                          );
                        })}
                    </dl>
                  </div>
                )}

                <div className="mt-7 bg-cream p-5">
                  <p className="flex items-center gap-2 text-[0.75rem] font-semibold text-charcoal">
                    <Sparkles className="size-4 text-gold" strokeWidth={1.5} />
                    Made to order, made for you
                  </p>
                  <p className="mt-2 text-[0.75rem] leading-6 text-charcoal/50">
                    Custom sizes and finishes are often possible. Our team will
                    confirm current lead times and delivery when you enquire.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="border-y border-charcoal/10 bg-cream py-16 sm:py-20">
        <Container>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Carefully delivered",
                text: "White-glove delivery and installation across our service cities, with careful handling from our team.",
              },
              {
                icon: ShieldCheck,
                title: "Made to last",
                text: "Solid materials and honest construction, finished by makers we work with closely.",
              },
              {
                icon: Check,
                title: "Personal guidance",
                text: "Unsure about size, fabric, or placement? Share a photo and we'll help you decide.",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <Reveal key={item.title} delay={index * 60}>
                  <Icon className="size-5 text-taupe" strokeWidth={1.3} />
                  <h2 className="mt-4 font-display text-[1.45rem] leading-none text-charcoal">
                    {item.title}
                  </h2>
                  <p className="mt-2.5 text-[0.8125rem] leading-6 text-charcoal/50">
                    {item.text}
                  </p>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {relatedProducts.length > 0 && (
        <section className="py-24 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow="You may also like"
              title="Pieces that sit well together."
              action={{ label: "View the collection", href: "/products" }}
            />
            <div className="mt-12 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-7">
              {relatedProducts.map((related, index) => (
                <Reveal key={related.id} delay={index * 60}>
                  <ProductCard product={related} />
                </Reveal>
              ))}
            </div>
            <div className="mt-10">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal/55 transition-colors hover:text-charcoal"
              >
                Back to the collection
                <ArrowRight
                  className="size-3.5 transition-transform group-hover:translate-x-1"
                  strokeWidth={1.5}
                />
              </Link>
            </div>
          </Container>
        </section>
      )}

      <StudioCta
        settings={settings}
        eyebrow="See it in person"
        title="The best way to choose a piece is to experience it."
        description="Visit our Hyderabad studio by appointment to see finishes, test comfort, and talk through your space with our team."
      />
    </>
  );
}

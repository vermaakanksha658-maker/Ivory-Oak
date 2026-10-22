import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Plus,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { ContactForm } from "@/components/contact/contact-form";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import { Reveal } from "@/components/ui/reveal";
import {
  getFaqs,
  getLocationPages,
  getProductBySlug,
  getServiceBySlug,
  getServices,
  getSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";
import { formatAddress, whatsappUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: "Contact & Studio Visits",
    description: `Talk to ${settings.businessName} about your interior design project in ${settings.addressLocality} or ${settings.serviceAreas.slice(0, 2).join(" and ")}. Call, WhatsApp, or send an enquiry - we reply within two working days.`,
    path: "/contact",
  });
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ product?: string; service?: string }>;
}) {
  const { product: productSlug, service: serviceSlug } = await searchParams;

  const [settings, services, product, service, faqs, locations] =
    await Promise.all([
      getSettings(),
      getServices(),
      productSlug ? getProductBySlug(productSlug) : Promise.resolve(null),
      serviceSlug ? getServiceBySlug(serviceSlug) : Promise.resolve(null),
      getFaqs(),
      getLocationPages(),
    ]);

  const referrerName = product?.name ?? service?.title;
  const source = product ? "product" : service ? "service" : "contact";
  const faqJsonLd =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: faq.answer,
            },
          })),
        }
      : null;

  return (
    <>
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Contact", href: "/contact" },
            ]}
          />
        }
        eyebrow="Contact"
        title={
          <>
            Let&apos;s begin with
            <br />
            <em className="italic text-olive">a conversation.</em>
          </>
        }
        intro="Tell us a little about your space and what you have in mind. We'll be in touch within two working days — usually sooner."
      />

      <section className="py-14 sm:py-20 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[0.78fr_1.22fr] lg:gap-20">
            <Reveal>
              <div>
                <p className="eyebrow text-taupe">The studio</p>
                <h2 className="mt-4 text-[2.4rem] leading-[1.05] tracking-[-0.03em] text-charcoal">
                  Come see us in
                  <br />
                  <em className="italic text-olive">
                    {settings.addressLocality}.
                  </em>
                </h2>

                <address className="mt-8 space-y-5 not-italic">
                  <div className="flex gap-4">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-taupe"
                      strokeWidth={1.4}
                    />
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                        Address
                      </p>
                      <p className="mt-1.5 max-w-xs text-[0.875rem] leading-6 text-charcoal/65">
                        {formatAddress(settings)}
                      </p>
                      {settings.googleMapsUrl && (
                        <a
                          href={settings.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/45 transition-colors hover:text-charcoal"
                        >
                          Get directions
                          <ArrowUpRight
                            className="size-3"
                            strokeWidth={1.5}
                          />
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Phone
                      className="mt-0.5 size-4 shrink-0 text-taupe"
                      strokeWidth={1.4}
                    />
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                        Phone
                      </p>
                      <a
                        href={`tel:${settings.phone.replace(/\s/g, "")}`}
                        className="mt-1.5 block text-[0.875rem] text-charcoal/65 transition-colors hover:text-charcoal"
                      >
                        {settings.phone}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Mail
                      className="mt-0.5 size-4 shrink-0 text-taupe"
                      strokeWidth={1.4}
                    />
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                        Email
                      </p>
                      <a
                        href={`mailto:${settings.email}`}
                        className="mt-1.5 block text-[0.875rem] text-charcoal/65 transition-colors hover:text-charcoal"
                      >
                        {settings.email}
                      </a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Clock
                      className="mt-0.5 size-4 shrink-0 text-taupe"
                      strokeWidth={1.4}
                    />
                    <div>
                      <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                        Studio hours
                      </p>
                      <div className="mt-1.5 space-y-1 text-[0.875rem] leading-6 text-charcoal/65">
                        {settings.openingHours.map((entry) => {
                          const [days, hours] = entry.split("|");
                          return (
                            <p key={entry}>
                              {days.trim()}
                              {hours ? ` · ${hours.trim()}` : ""}
                            </p>
                          );
                        })}
                        <p>Visits by appointment</p>
                      </div>
                    </div>
                  </div>
                </address>

                <a
                  href={whatsappUrl(
                    settings.whatsapp,
                    referrerName
                      ? `Hello ${settings.businessName}, I'd like to enquire about ${referrerName}.`
                      : `Hello ${settings.businessName}, I'd like to discuss an interior design project.`,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 bg-[#1f5c45] px-6 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-white transition-colors hover:bg-[#174936] sm:w-auto"
                >
                  <MessageCircle className="size-4" strokeWidth={1.6} />
                  Message on WhatsApp
                </a>

                <div className="mt-8 border-t border-charcoal/12 pt-6">
                  <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/35">
                    We design across
                  </p>
                  <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[0.8125rem] leading-6 text-charcoal/55">
                    {settings.serviceAreas.map((area) => {
                      const location = locations.find(
                        (entry) =>
                          entry.city.toLowerCase() === area.toLowerCase(),
                      );
                      return location ? (
                        <Link
                          key={area}
                          href={`/locations/${location.slug}`}
                          className="transition-colors hover:text-charcoal"
                        >
                          {area}
                        </Link>
                      ) : (
                        <span key={area}>{area}</span>
                      );
                    })}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <ContactForm
                whatsapp={settings.whatsapp}
                businessName={settings.businessName}
                services={services}
                productName={product?.name}
                productId={product?.id}
                serviceName={service?.title}
                serviceId={service?.id}
                source={source}
              />
            </Reveal>
          </div>
        </Container>
      </section>

      {faqs.length > 0 && (
        <section className="border-t border-charcoal/10 bg-sand/45 py-20 sm:py-24">
          <Container>
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
              <Reveal>
                <p className="eyebrow text-taupe">Before you write</p>
                <h2 className="mt-4 text-[2.4rem] leading-[1.05] tracking-[-0.03em] text-charcoal">
                  A few things
                  <br />
                  <em className="italic text-olive">worth knowing.</em>
                </h2>
                <p className="mt-5 max-w-sm text-[0.875rem] leading-7 text-charcoal/55">
                  Still curious about timelines, budgets, or how we work? Start
                  here, or send us your question directly.
                </p>
              </Reveal>
              <Reveal delay={100}>
                <div className="divide-y divide-charcoal/12 border-t border-charcoal/12">
                  {faqs.map((faq) => (
                    <details key={faq.id} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-left [&::-webkit-details-marker]:hidden">
                        <span className="font-display text-[1.25rem] leading-snug text-charcoal">
                          {faq.question}
                        </span>
                        <Plus
                          className="mt-1 size-4 shrink-0 text-taupe transition-transform duration-300 group-open:rotate-45"
                          strokeWidth={1.5}
                        />
                      </summary>
                      <p className="mt-3 max-w-2xl whitespace-pre-line text-[0.875rem] leading-7 text-charcoal/58">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </Reveal>
            </div>
          </Container>
        </section>
      )}

      {settings.googleMapsEmbedUrl && (
        <section className="border-t border-charcoal/10 bg-cream pb-0">
          <Container className="py-14 sm:py-16">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="eyebrow text-taupe">Find us</p>
                <h2 className="mt-3 text-[2.2rem] leading-none text-charcoal sm:text-4xl">
                  The {settings.addressLocality} studio
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-5">
                <a
                  href={
                    settings.googleMapsUrl ??
                    settings.googleMapsEmbedUrl
                      .replace("&output=embed", "")
                      .replace("?output=embed", "")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal/50 transition-colors hover:text-charcoal"
                >
                  Open in Google Maps
                  <ArrowUpRight
                    className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.5}
                  />
                </a>
                {settings.googleBusinessProfileUrl && (
                  <a
                    href={settings.googleBusinessProfileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal/50 transition-colors hover:text-charcoal"
                  >
                    Google Business Profile
                    <ArrowUpRight
                      className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.5}
                    />
                  </a>
                )}
              </div>
            </div>
            <div className="h-[340px] overflow-hidden bg-sand sm:h-[440px]">
              <iframe
                title={`${settings.businessName} studio location on Google Maps`}
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: "grayscale(1) contrast(0.9)" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Container>
        </section>
      )}
    </>
  );
}

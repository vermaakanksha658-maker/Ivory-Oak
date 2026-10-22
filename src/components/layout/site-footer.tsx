import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Logo } from "@/components/ui/logo";
import { InstagramIcon } from "@/components/ui/social-icons";
import type {
  ContentPage,
  LocationPage,
  Service,
  SiteContent,
} from "@/lib/demo-data";
import { formatAddress, whatsappUrl } from "@/lib/utils";

const explore = [
  { label: "About the studio", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Our projects", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Areas we design", href: "/locations" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter({
  settings,
  pages = [],
  locations = [],
  services = [],
}: {
  settings: SiteContent;
  pages?: ContentPage[];
  locations?: LocationPage[];
  services?: Service[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-ivory">
      <Container>
        <div className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.3fr] lg:py-20">
          <div>
            <Logo
              theme="light"
              image={settings.logoImage}
              name={settings.businessName}
            />
            <p className="mt-7 max-w-xs text-[0.875rem] leading-7 text-ivory/55">
              {settings.footerDescription}
            </p>
            <div className="mt-7 flex items-center gap-3">
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex size-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory"
                >
                  <InstagramIcon className="size-4" strokeWidth={1.5} />
                </a>
              )}
              <a
                href={whatsappUrl(
                  settings.whatsapp,
                  `Hello ${settings.businessName}, I would like to discuss a project.`,
                )}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="flex size-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory"
              >
                <MessageCircle className="size-4" strokeWidth={1.5} />
              </a>
              <a
                href={`mailto:${settings.email}`}
                aria-label="Email the studio"
                className="flex size-10 items-center justify-center border border-ivory/20 text-ivory/70 transition-colors hover:border-ivory hover:text-ivory"
              >
                <Mail className="size-4" strokeWidth={1.5} />
              </a>
            </div>
          </div>

          <div>
            <p className="eyebrow text-beige/70">Explore</p>
            <ul className="mt-6 space-y-3.5">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[0.8125rem] text-ivory/60 transition-colors hover:text-ivory"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-beige/70">Services</p>
            <ul className="mt-6 space-y-3.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="text-[0.8125rem] text-ivory/60 transition-colors hover:text-ivory"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
              {services.length === 0 && (
                <li>
                  <Link
                    href="/services"
                    className="text-[0.8125rem] text-ivory/60 transition-colors hover:text-ivory"
                  >
                    View our services
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div>
            <p className="eyebrow text-beige/70">Visit the studio</p>
            <address className="mt-6 space-y-5 not-italic">
              <p className="flex gap-3 text-[0.8125rem] leading-6 text-ivory/60">
                <MapPin
                  className="mt-0.5 size-4 shrink-0 text-taupe"
                  strokeWidth={1.4}
                />
                {formatAddress(settings)}
              </p>
              <a
                href={`tel:${settings.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-3 text-[0.8125rem] text-ivory/60 transition-colors hover:text-ivory"
              >
                <Phone className="size-4 text-taupe" strokeWidth={1.4} />
                {settings.phone}
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-3 text-[0.8125rem] text-ivory/60 transition-colors hover:text-ivory"
              >
                <Mail className="size-4 text-taupe" strokeWidth={1.4} />
                {settings.email}
              </a>
            </address>
            <Link
              href="/contact"
              className="group mt-7 inline-flex items-center gap-2 border-b border-ivory/30 pb-1 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-ivory transition-colors hover:border-ivory"
            >
              Start a conversation
              <ArrowUpRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-ivory/10 py-7 text-[0.625rem] uppercase tracking-[0.13em] text-ivory/35 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.businessName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {settings.serviceAreas.map((area) => {
                const location = locations.find(
                  (entry) => entry.city.toLowerCase() === area.toLowerCase(),
                );
                return location ? (
                  <Link
                    key={area}
                    href={`/locations/${location.slug}`}
                    className="transition-colors hover:text-ivory/70"
                  >
                    {area}
                  </Link>
                ) : (
                  <span key={area}>{area}</span>
                );
              })}
            </span>
            {pages.map((page) => (
              <Link
                key={page.id}
                href={`/${page.slug}`}
                className="transition-colors hover:text-ivory/70"
              >
                {page.title}
              </Link>
            ))}
            <Link
              href="/admin/login"
              className="transition-colors hover:text-ivory/70"
            >
              Studio login
            </Link>
          </div>
        </div>
        {settings.footerNote && (
          <p className="border-t border-ivory/10 py-4 text-[0.5625rem] uppercase tracking-[0.13em] text-ivory/25">
            {settings.footerNote}
          </p>
        )}
      </Container>
    </footer>
  );
}

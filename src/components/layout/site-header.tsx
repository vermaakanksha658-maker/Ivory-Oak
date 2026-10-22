"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowUpRight,
  Menu,
  MessageCircle,
  Phone,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { Container } from "@/components/ui/container";
import { InstagramIcon } from "@/components/ui/social-icons";
import { cn, whatsappUrl } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/portfolio" },
  { label: "Products", href: "/products" },
  { label: "Contact", href: "/contact" },
];

export function SiteHeader({
  phone,
  whatsapp,
  serviceAreas,
  instagram,
  logoImage,
  businessName,
  announcementEnabled,
  announcementText,
  announcementHref,
}: {
  phone: string;
  whatsapp: string;
  serviceAreas: string[];
  instagram?: string | null;
  logoImage?: string | null;
  businessName?: string;
  announcementEnabled?: boolean;
  announcementText?: string | null;
  announcementHref?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {announcementEnabled && announcementText && (
        <Link
          href={announcementHref || "/contact"}
          className="flex min-h-9 items-center justify-center bg-charcoal px-4 py-2 text-center text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-ivory/80 transition-colors hover:text-ivory"
        >
          {announcementText}
        </Link>
      )}

      <div className="hidden border-b border-charcoal/10 bg-ivory md:block">
        <Container className="flex h-9 items-center justify-between text-[0.625rem] font-medium uppercase tracking-[0.16em] text-charcoal/60">
          <p>Designing soulful spaces across {serviceAreas.slice(0, 3).join(" · ")}</p>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2 transition-colors hover:text-charcoal"
            >
              <Phone className="size-3" strokeWidth={1.6} />
              {phone}
            </a>
            {instagram && (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow Ivory & Oak on Instagram"
                className="transition-colors hover:text-charcoal"
              >
                <InstagramIcon className="size-3.5" strokeWidth={1.6} />
              </a>
            )}
          </div>
        </Container>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-ivory/95 backdrop-blur-md transition-all duration-300",
          scrolled
            ? "border-charcoal/10 shadow-[0_1px_20px_rgba(43,40,36,0.06)]"
            : "border-transparent",
        )}
      >
        <Container className="flex h-[4.5rem] items-center justify-between gap-8 lg:h-20">
          <Logo image={logoImage} name={businessName} />

          <nav
            aria-label="Primary navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                data-active={isActive(item.href)}
                className={cn(
                  "link-underline pb-1 text-[0.6875rem] font-semibold uppercase tracking-[0.16em] transition-colors duration-300",
                  isActive(item.href)
                    ? "text-charcoal"
                    : "text-charcoal/55 hover:text-charcoal",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              href="/contact"
              className="group inline-flex h-11 items-center gap-2 border border-charcoal/25 px-5 text-[0.625rem] font-semibold uppercase tracking-[0.17em] text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-ivory"
            >
              Book a consultation
              <ArrowUpRight
                className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.6}
              />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex size-11 items-center justify-center border border-charcoal/25 text-charcoal transition-colors hover:bg-charcoal hover:text-ivory lg:hidden"
          >
            {open ? (
              <X className="size-5" strokeWidth={1.5} />
            ) : (
              <Menu className="size-5" strokeWidth={1.5} />
            )}
          </button>
        </Container>
      </header>

      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={cn(
          "fixed inset-0 z-30 bg-ivory px-5 pb-8 pt-[6.5rem] transition-all duration-500 lg:hidden",
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none invisible opacity-0",
        )}
      >
        <div className="flex h-full flex-col justify-between">
          <nav aria-label="Mobile navigation" className="flex flex-col">
            {navigation.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-baseline justify-between border-b border-charcoal/10 py-4 transition-colors",
                  isActive(item.href) ? "text-gold" : "text-charcoal",
                )}
              >
                <span className="font-display text-[2.15rem] leading-none">
                  {item.label}
                </span>
                <span className="text-[0.625rem] tabular-nums tracking-[0.2em] text-taupe">
                  0{index + 1}
                </span>
              </Link>
            ))}
          </nav>

          <div className="mt-8 space-y-4">
            <a
              href={whatsappUrl(
                whatsapp,
                `Hello ${businessName ?? "Ivory & Oak"}, I would like to discuss an interior design project.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 w-full items-center justify-center gap-2 bg-[#1f5c45] px-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white"
            >
              <MessageCircle className="size-4" strokeWidth={1.7} />
              WhatsApp the studio
            </a>
            <div className="flex items-center justify-between text-[0.6875rem] uppercase tracking-[0.14em] text-charcoal/55">
              <a href={`tel:${phone.replace(/\s/g, "")}`}>{phone}</a>
              <span>{serviceAreas[0]}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Armchair,
  ExternalLink,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  MessageSquare,
  Quote,
  Settings,
  Sparkles,
  Tags,
  X,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Services", href: "/admin/services", icon: Sparkles },
  { label: "Products", href: "/admin/products", icon: Armchair },
  { label: "Categories", href: "/admin/categories", icon: Tags },
  { label: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { label: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { label: "Enquiries", href: "/admin/inquiries", icon: MessageSquare },
  { label: "Pages", href: "/admin/pages", icon: FileText },
  { label: "Locations", href: "/admin/locations", icon: MapPin },
  { label: "Site content", href: "/admin/settings", icon: Settings },
];

function pageTitle(pathname: string) {
  if (pathname === "/admin") return "Overview";
  if (pathname.startsWith("/admin/projects/new")) return "New project";
  if (pathname.startsWith("/admin/projects")) return "Projects";
  if (pathname.startsWith("/admin/services/new")) return "New service";
  if (pathname.startsWith("/admin/services")) return "Services";
  if (pathname.startsWith("/admin/products/new")) return "New product";
  if (pathname.startsWith("/admin/products")) return "Products";
  if (pathname.startsWith("/admin/categories")) return "Categories";
  if (pathname.startsWith("/admin/testimonials")) return "Testimonials";
  if (pathname.startsWith("/admin/faqs")) return "FAQs";
  if (pathname.startsWith("/admin/inquiries")) return "Enquiries";
  if (pathname.startsWith("/admin/pages")) return "Pages";
  if (pathname.startsWith("/admin/locations/new")) return "New location";
  if (pathname.startsWith("/admin/locations")) return "Locations";
  if (pathname.startsWith("/admin/settings")) return "Site content";
  return "Studio";
}

export function AdminShell({
  children,
  user,
}: {
  children: React.ReactNode;
  user: { name: string; email: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPathname, setLastPathname] = useState(pathname);

  if (lastPathname !== pathname) {
    setLastPathname(pathname);
    setOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

  return (
    <div className="min-h-screen bg-[#f4efe5]">
      {open && (
        <button
          type="button"
          aria-label="Close navigation overlay"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col bg-charcoal text-ivory transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-20 items-center justify-between border-b border-ivory/10 px-6">
          <Logo theme="light" />
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex size-8 items-center justify-center text-ivory/50 hover:text-ivory lg:hidden"
          >
            <X className="size-5" strokeWidth={1.5} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-6" aria-label="Admin">
          <p className="px-3 text-[0.5rem] font-semibold uppercase tracking-[0.2em] text-ivory/30">
            Studio manager
          </p>
          <ul className="mt-4 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 text-[0.75rem] transition-colors",
                      isActive(item.href)
                        ? "bg-ivory/10 text-ivory"
                        : "text-ivory/50 hover:bg-ivory/5 hover:text-ivory",
                    )}
                  >
                    <Icon className="size-4" strokeWidth={1.5} />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-8 border-t border-ivory/10 pt-6">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-3 py-2.5 text-[0.75rem] text-ivory/50 transition-colors hover:text-ivory"
            >
              <ExternalLink className="size-4" strokeWidth={1.5} />
              View website
            </a>
          </div>
        </nav>

        <div className="border-t border-ivory/10 p-4">
          <div className="flex items-center gap-3 px-2">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-ivory/20 font-display text-sm text-ivory/70">
              {user.name
                .split(" ")
                .slice(0, 2)
                .map((part) => part.charAt(0))
                .join("")}
            </span>
            <div className="min-w-0">
              <p className="truncate text-[0.75rem] font-medium text-ivory/80">
                {user.name}
              </p>
              <p className="truncate text-[0.625rem] text-ivory/35">
                {user.email}
              </p>
            </div>
          </div>
          <form action={logoutAction} className="mt-3">
            <button
              type="submit"
              className="flex w-full items-center gap-3 px-3 py-2.5 text-[0.6875rem] text-ivory/40 transition-colors hover:text-ivory"
            >
              <LogOut className="size-4" strokeWidth={1.5} />
              Sign out
            </button>
          </form>
        </div>
      </aside>

      <div className="lg:pl-[272px]">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-charcoal/10 bg-[#f4efe5]/95 px-5 backdrop-blur sm:px-8 lg:h-20 lg:px-10">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              className="flex size-10 items-center justify-center border border-charcoal/20 text-charcoal lg:hidden"
            >
              <Menu className="size-5" strokeWidth={1.5} />
            </button>
            <div>
              <p className="text-[0.5rem] font-semibold uppercase tracking-[0.16em] text-charcoal/35">
                Ivory &amp; Oak
              </p>
              <p className="mt-0.5 text-[0.8125rem] font-medium text-charcoal">
                {pageTitle(pathname)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-charcoal/40 transition-colors hover:text-charcoal sm:flex"
            >
              View site
              <ExternalLink className="size-3.5" strokeWidth={1.5} />
            </a>
            <span className="hidden h-6 w-px bg-charcoal/15 sm:block" />
            <span className="text-[0.6875rem] text-charcoal/50">
              {user.name}
            </span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] px-5 py-7 sm:px-8 sm:py-9 lg:px-10 lg:py-11">
          {children}
        </main>
      </div>
    </div>
  );
}

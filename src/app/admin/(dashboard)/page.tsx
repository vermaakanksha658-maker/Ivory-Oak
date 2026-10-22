import Link from "next/link";
import {
  Armchair,
  ArrowUpRight,
  FolderOpen,
  MessageSquare,
  Plus,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  NEW: "bg-gold/15 text-[#7a5d2f]",
  CONTACTED: "bg-olive/10 text-olive",
  RESOLVED: "bg-charcoal/8 text-charcoal/45",
};

export default async function AdminDashboardPage() {
  const [
    projects,
    publishedProjects,
    services,
    products,
    newInquiries,
    testimonials,
    recentInquiries,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { published: true } }),
    prisma.service.count(),
    prisma.product.count(),
    prisma.inquiry.count({ where: { status: "NEW" } }),
    prisma.testimonial.count(),
    prisma.inquiry.findMany({
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        product: { select: { name: true } },
        service: { select: { title: true } },
      },
    }),
  ]);

  const publishedServices = await prisma.service.count({
    where: { published: true },
  });
  const publishedProducts = await prisma.product.count({
    where: { published: true },
  });

  const stats = [
    {
      label: "Published projects",
      value: publishedProjects,
      detail: `${projects} total`,
      icon: FolderOpen,
      href: "/admin/projects",
    },
    {
      label: "Published services",
      value: publishedServices,
      detail: `${services} total`,
      icon: Sparkles,
      href: "/admin/services",
    },
    {
      label: "Published products",
      value: publishedProducts,
      detail: `${products} total`,
      icon: Armchair,
      href: "/admin/products",
    },
    {
      label: "New enquiries",
      value: newInquiries,
      detail: "Awaiting response",
      icon: MessageSquare,
      href: "/admin/inquiries",
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-charcoal/35">
            {new Intl.DateTimeFormat("en-IN", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }).format(new Date())}
          </p>
          <h1 className="mt-2 font-display text-[2.5rem] leading-none tracking-[-0.03em] text-charcoal sm:text-[3rem]">
            The studio, at a glance.
          </h1>
          <p className="mt-2 text-[0.8125rem] text-charcoal/45">
            Here&apos;s what&apos;s happening across your website.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/projects/new"
            className="inline-flex h-11 items-center gap-2 bg-charcoal px-5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-ivory transition-colors hover:bg-ink"
          >
            <Plus className="size-4" strokeWidth={1.6} />
            New project
          </Link>
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center gap-2 border border-charcoal/20 px-5 text-[0.625rem] font-semibold uppercase tracking-[0.15em] text-charcoal/60 transition-colors hover:border-charcoal hover:text-charcoal"
          >
            Add product
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group border border-charcoal/10 bg-cream p-5 transition-colors hover:border-charcoal/25 sm:p-6"
            >
              <div className="flex items-start justify-between">
                <Icon
                  className="size-5 text-taupe transition-colors group-hover:text-charcoal"
                  strokeWidth={1.3}
                />
                <ArrowUpRight
                  className="size-4 text-charcoal/20 transition-colors group-hover:text-charcoal"
                  strokeWidth={1.4}
                />
              </div>
              <p className="mt-6 font-display text-[2.6rem] leading-none text-charcoal">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="mt-2 text-[0.6875rem] font-semibold uppercase tracking-[0.13em] text-charcoal/55">
                {stat.label}
              </p>
              <p className="mt-1 text-[0.625rem] text-charcoal/35">
                {stat.detail}
              </p>
            </Link>
          );
        })}
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.45fr_0.55fr]">
        <section className="border border-charcoal/10 bg-cream">
          <div className="flex items-center justify-between border-b border-charcoal/10 px-5 py-4 sm:px-6">
            <div>
              <h2 className="font-display text-xl leading-none text-charcoal">
                Recent enquiries
              </h2>
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                The latest messages from your website
              </p>
            </div>
            <Link
              href="/admin/inquiries"
              className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/40 transition-colors hover:text-charcoal"
            >
              View all
            </Link>
          </div>

          {recentInquiries.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <MessageSquare
                className="mx-auto size-6 text-taupe"
                strokeWidth={1.2}
              />
              <p className="mt-3 font-display text-xl text-charcoal">
                No enquiries yet.
              </p>
              <p className="mt-1 text-[0.75rem] text-charcoal/40">
                Messages sent through the contact form will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-charcoal/8">
              {recentInquiries.map((inquiry) => (
                <Link
                  key={inquiry.id}
                  href="/admin/inquiries"
                  className="flex items-start justify-between gap-4 px-5 py-4 transition-colors hover:bg-sand/25 sm:px-6"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[0.8125rem] font-semibold text-charcoal">
                        {inquiry.name}
                      </p>
                      <span
                        className={`px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                          statusStyles[inquiry.status] ?? statusStyles.RESOLVED
                        }`}
                      >
                        {inquiry.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 line-clamp-1 max-w-md text-[0.75rem] text-charcoal/45">
                      {inquiry.message}
                    </p>
                    <p className="mt-1.5 text-[0.5625rem] uppercase tracking-[0.1em] text-charcoal/30">
                      {inquiry.product?.name ??
                        inquiry.service?.title ??
                        inquiry.source.replace("_", " ")}{" "}
                      · {inquiry.phone}
                    </p>
                  </div>
                  <span className="shrink-0 pt-1 text-[0.5625rem] tabular-nums text-charcoal/30">
                    {formatDate(inquiry.createdAt)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <div className="flex flex-col gap-6">
          <section className="border border-charcoal/10 bg-charcoal p-6 text-ivory">
            <p className="eyebrow text-beige/60">Studio content</p>
            <p className="mt-4 font-display text-[1.8rem] leading-[1.12] text-ivory">
              Keep the story current.
            </p>
            <p className="mt-3 text-[0.75rem] leading-6 text-ivory/50">
              Update your hero, homepage sections, logo, footer, contact
              details, and search metadata from one place.
            </p>
            <Link
              href="/admin/settings"
              className="group mt-5 inline-flex items-center gap-2 text-[0.5625rem] font-semibold uppercase tracking-[0.15em] text-ivory/70 transition-colors hover:text-ivory"
            >
              Edit site content
              <ArrowUpRight
                className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.5}
              />
            </Link>
          </section>

          <section className="border border-charcoal/10 bg-cream p-6">
            <div className="flex items-center justify-between">
              <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
                Testimonials
              </p>
              <span className="font-display text-2xl leading-none text-charcoal">
                {testimonials}
              </span>
            </div>
            <div className="mt-4 h-px w-full bg-charcoal/10">
              <div
                className="h-px bg-gold"
                style={{
                  width: `${Math.min(100, testimonials * 30)}%`,
                }}
              />
            </div>
            <p className="mt-3 text-[0.6875rem] leading-5 text-charcoal/40">
              Published client stories add trust to the home page.
            </p>
            <Link
              href="/admin/testimonials/new"
              className="mt-4 inline-flex items-center gap-1.5 text-[0.5625rem] font-semibold uppercase tracking-[0.13em] text-charcoal/50 transition-colors hover:text-charcoal"
            >
              <Plus className="size-3" strokeWidth={1.6} />
              Add testimonial
            </Link>
          </section>

          <section className="border border-charcoal/10 bg-cream p-6">
            <p className="text-[0.5625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/40">
              Quick links
            </p>
            <div className="mt-4 space-y-3">
              {[
                { label: "Add a service", href: "/admin/services/new" },
                { label: "Add a project", href: "/admin/projects/new" },
                { label: "Add a product", href: "/admin/products/new" },
                { label: "Add a category", href: "/admin/categories/new" },
                { label: "Add an FAQ", href: "/admin/faqs/new" },
                { label: "Add a page", href: "/admin/pages/new" },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center justify-between border-b border-charcoal/8 pb-3 text-[0.75rem] text-charcoal/60 transition-colors hover:text-charcoal"
                >
                  {item.label}
                  <Plus className="size-3.5" strokeWidth={1.5} />
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

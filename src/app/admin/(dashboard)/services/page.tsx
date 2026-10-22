import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteService,
  moveService,
  toggleService,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminServicesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    saved?: string;
    deleted?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = q
    ? {
        OR: [
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
          { shortDescription: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const total = await prisma.service.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const services = await prisma.service.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Describe what the studio offers. These entries power the services page and enquiry dropdowns."
        action={{ label: "New service", href: "/admin/services/new" }}
      />

      <AdminNotice saved={params.saved} deleted={params.deleted} />

      <AdminSearch
        action="/admin/services"
        defaultValue={q}
        placeholder="Search services or summaries…"
      />

      <div className="border border-charcoal/10 bg-cream">
        <div className="hidden grid-cols-[3.5rem_1.8fr_1fr_0.8fr_auto] items-center gap-4 border-b border-charcoal/10 px-5 py-3 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-charcoal/35 lg:grid">
          <span>Order</span>
          <span>Service</span>
          <span>Summary</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {services.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-2xl text-charcoal">
              {q ? "No matching services." : "No services yet."}
            </p>
            <p className="mt-1 text-[0.75rem] text-charcoal/40">
              {q
                ? "Try a different search or clear the query."
                : "Add your first service to get started."}
            </p>
          </div>
        ) : (
          services.map((service, index) => (
            <div
              key={service.id}
              className="grid gap-4 border-b border-charcoal/8 px-4 py-4 last:border-0 lg:grid-cols-[3.5rem_1.8fr_1fr_0.8fr_auto] lg:items-center lg:px-5"
            >
              <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                <span className="text-[0.5625rem] tabular-nums text-charcoal/35">
                  {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                </span>
                <div className="flex lg:mt-1">
                  <form action={moveService}>
                    <input type="hidden" name="id" value={service.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      aria-label={`Move ${service.title} up`}
                      disabled={index === 0 || Boolean(q)}
                      className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                    >
                      <ChevronUp className="size-3.5" strokeWidth={1.6} />
                    </button>
                  </form>
                  <form action={moveService}>
                    <input type="hidden" name="id" value={service.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      aria-label={`Move ${service.title} down`}
                      disabled={index === services.length - 1 || Boolean(q)}
                      className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                    >
                      <ChevronDown className="size-3.5" strokeWidth={1.6} />
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-14 shrink-0 bg-sand bg-cover bg-center"
                  style={{ backgroundImage: `url("${service.image}")` }}
                  role="img"
                  aria-label={service.title}
                />
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-semibold text-charcoal">
                    {service.title}
                  </p>
                  <p className="mt-0.5 truncate text-[0.625rem] text-charcoal/40">
                    /{service.slug}
                  </p>
                </div>
              </div>

              <p className="line-clamp-2 text-[0.75rem] leading-5 text-charcoal/50">
                {service.shortDescription}
              </p>

              <div>
                <span
                  className={`inline-flex px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                    service.published
                      ? "bg-olive/10 text-olive"
                      : "bg-charcoal/8 text-charcoal/40"
                  }`}
                >
                  {service.published ? "Published" : "Draft"}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                <Link
                  href={`/admin/services/${service.id}`}
                  aria-label={`Edit ${service.title}`}
                  title="Edit"
                  className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                >
                  <Pencil className="size-3.5" strokeWidth={1.5} />
                </Link>
                <form action={toggleService}>
                  <input type="hidden" name="id" value={service.id} />
                  <button
                    type="submit"
                    aria-label={
                      service.published ? "Unpublish service" : "Publish service"
                    }
                    title={service.published ? "Unpublish" : "Publish"}
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    {service.published ? (
                      <EyeOff className="size-3.5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="size-3.5" strokeWidth={1.5} />
                    )}
                  </button>
                </form>
                <Link
                  href={`/services/${service.slug}`}
                  target="_blank"
                  aria-label={`View ${service.title} on the website`}
                  title="View live"
                  className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                >
                  <ExternalLink className="size-3.5" strokeWidth={1.5} />
                </Link>
                <DeleteButton
                  action={deleteService}
                  id={service.id}
                  confirmMessage={`Delete “${service.title}”? This cannot be undone.`}
                  compact
                />
              </div>
            </div>
          ))
        )}
      </div>

      <AdminPagination
        basePath="/admin/services"
        page={page}
        totalPages={totalPages}
        params={{ q }}
      />
    </div>
  );
}

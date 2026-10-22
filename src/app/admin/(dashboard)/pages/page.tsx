import Link from "next/link";
import {
  ExternalLink,
  Eye,
  EyeOff,
  FileText,
  Pencil,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import { deletePage, togglePage } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminPagesPage({
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
          { content: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const total = await prisma.page.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const pages = await prisma.page.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { title: "asc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <AdminPageHeader
        title="Pages"
        description="Publish policy pages and studio information without touching code."
        action={{ label: "New page", href: "/admin/pages/new" }}
      />

      <AdminNotice saved={params.saved} deleted={params.deleted} />

      <AdminSearch
        action="/admin/pages"
        defaultValue={q}
        placeholder="Search pages…"
      />

      <div className="border border-charcoal/10 bg-cream">
        <div className="hidden grid-cols-[1.7fr_0.8fr_0.7fr_0.7fr_auto] items-center gap-4 border-b border-charcoal/10 px-5 py-3 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-charcoal/35 lg:grid">
          <span>Page</span>
          <span>Footer</span>
          <span>Status</span>
          <span>Order</span>
          <span className="text-right">Actions</span>
        </div>

        {pages.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <FileText
              className="mx-auto size-6 text-taupe"
              strokeWidth={1.2}
            />
            <p className="mt-3 font-display text-2xl text-charcoal">
              {q ? "No matching pages." : "No pages yet."}
            </p>
            <p className="mt-1 text-[0.75rem] text-charcoal/40">
              Add a privacy policy or terms page to get started.
            </p>
          </div>
        ) : (
          pages.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 border-b border-charcoal/8 px-4 py-4 last:border-0 lg:grid-cols-[1.7fr_0.8fr_0.7fr_0.7fr_auto] lg:items-center lg:px-5"
            >
              <div className="min-w-0">
                <p className="truncate text-[0.8125rem] font-semibold text-charcoal">
                  {item.title}
                </p>
                <p className="mt-0.5 truncate text-[0.625rem] text-charcoal/40">
                  /{item.slug}
                </p>
              </div>

              <p className="text-[0.6875rem] text-charcoal/55">
                {item.showInFooter ? "Linked" : "—"}
              </p>

              <div>
                <span
                  className={`inline-flex px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                    item.published
                      ? "bg-olive/10 text-olive"
                      : "bg-charcoal/8 text-charcoal/40"
                  }`}
                >
                  {item.published ? "Published" : "Draft"}
                </span>
              </div>

              <p className="text-[0.6875rem] tabular-nums text-charcoal/40">
                {String(item.sortOrder).padStart(2, "0")}
              </p>

              <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                <Link
                  href={`/admin/pages/${item.id}`}
                  aria-label={`Edit ${item.title}`}
                  title="Edit"
                  className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                >
                  <Pencil className="size-3.5" strokeWidth={1.5} />
                </Link>
                <form action={togglePage}>
                  <input type="hidden" name="id" value={item.id} />
                  <button
                    type="submit"
                    aria-label={
                      item.published ? "Unpublish page" : "Publish page"
                    }
                    title={item.published ? "Unpublish" : "Publish"}
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    {item.published ? (
                      <EyeOff className="size-3.5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="size-3.5" strokeWidth={1.5} />
                    )}
                  </button>
                </form>
                <Link
                  href={`/${item.slug}`}
                  target="_blank"
                  aria-label={`View ${item.title} on the website`}
                  title="View live"
                  className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                >
                  <ExternalLink className="size-3.5" strokeWidth={1.5} />
                </Link>
                <DeleteButton
                  action={deletePage}
                  id={item.id}
                  confirmMessage={`Delete “${item.title}”? This cannot be undone.`}
                  compact
                />
              </div>
            </div>
          ))
        )}
      </div>

      <AdminPagination
        basePath="/admin/pages"
        page={page}
        totalPages={totalPages}
        params={{ q }}
      />
    </div>
  );
}

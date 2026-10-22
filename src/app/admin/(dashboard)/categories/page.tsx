import Link from "next/link";
import {
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Pencil,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteCategory,
  moveCategory,
  toggleCategory,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    saved?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const total = await prisma.category.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const categories = await prisma.category.findMany({
    where,
    include: { _count: { select: { products: true } } },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <AdminPageHeader
        title="Categories"
        description="Group products so clients can browse the catalog by type."
        action={{ label: "New category", href: "/admin/categories/new" }}
      />

      <AdminNotice
        saved={params.saved}
        deleted={params.deleted}
        error={params.error}
      />

      <AdminSearch
        action="/admin/categories"
        defaultValue={q}
        placeholder="Search categories…"
      />

      <div className="border border-charcoal/10 bg-cream">
        <div className="hidden grid-cols-[3.5rem_1.7fr_0.8fr_0.7fr_auto] items-center gap-4 border-b border-charcoal/10 px-5 py-3 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-charcoal/35 lg:grid">
          <span>Order</span>
          <span>Category</span>
          <span>Products</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {categories.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-2xl text-charcoal">
              {q ? "No matching categories." : "No categories yet."}
            </p>
            <p className="mt-1 text-[0.75rem] text-charcoal/40">
              Create a category before adding products.
            </p>
          </div>
        ) : (
          categories.map((category, index) => {
            const orderIndex = (page - 1) * PAGE_SIZE + index;
            return (
              <div
                key={category.id}
                className="grid gap-4 border-b border-charcoal/8 px-4 py-4 last:border-0 lg:grid-cols-[3.5rem_1.7fr_0.8fr_0.7fr_auto] lg:items-center lg:px-5"
              >
                <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                  <span className="text-[0.5625rem] tabular-nums text-charcoal/35">
                    {String(orderIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="flex lg:mt-1">
                    <form action={moveCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        aria-label={`Move ${category.name} up`}
                        disabled={orderIndex === 0}
                        className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                      >
                        <ChevronUp className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </form>
                    <form action={moveCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        aria-label={`Move ${category.name} down`}
                        disabled={orderIndex >= total - 1}
                        className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                      >
                        <ChevronDown className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </form>
                  </div>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-semibold text-charcoal">
                    {category.name}
                  </p>
                  <p className="mt-0.5 truncate text-[0.625rem] text-charcoal/40">
                    /{category.slug}
                  </p>
                </div>

                <p className="text-[0.75rem] tabular-nums text-charcoal/60">
                  {category._count.products}
                </p>

                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                      category.published
                        ? "bg-olive/10 text-olive"
                        : "bg-charcoal/8 text-charcoal/40"
                    }`}
                  >
                    {category.published ? "Published" : "Hidden"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                  <Link
                    href={`/admin/categories/${category.id}`}
                    aria-label={`Edit ${category.name}`}
                    title="Edit"
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    <Pencil className="size-3.5" strokeWidth={1.5} />
                  </Link>
                  <form action={toggleCategory}>
                    <input type="hidden" name="id" value={category.id} />
                    <button
                      type="submit"
                      aria-label={
                        category.published
                          ? "Hide category"
                          : "Publish category"
                      }
                      title={category.published ? "Hide" : "Publish"}
                      className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                    >
                      {category.published ? (
                        <EyeOff className="size-3.5" strokeWidth={1.5} />
                      ) : (
                        <Eye className="size-3.5" strokeWidth={1.5} />
                      )}
                    </button>
                  </form>
                  <Link
                    href={`/products?category=${encodeURIComponent(category.name)}`}
                    target="_blank"
                    aria-label={`View ${category.name} on the website`}
                    title="View live"
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    <ArrowUpRight className="size-3.5" strokeWidth={1.5} />
                  </Link>
                  <DeleteButton
                    action={deleteCategory}
                    id={category.id}
                    confirmMessage={`Delete “${category.name}”? Categories with products cannot be removed.`}
                    compact
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdminPagination
        basePath="/admin/categories"
        page={page}
        totalPages={totalPages}
        params={{ q }}
      />
    </div>
  );
}

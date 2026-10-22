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
import { formatPrice } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteProduct,
  moveProduct,
  toggleProduct,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    page?: string;
    saved?: string;
    deleted?: string;
    error?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const categoryId = params.category?.trim() ?? "";
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = {
    ...(categoryId ? { categoryId } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { slug: { contains: q, mode: "insensitive" as const } },
            {
              category: {
                name: { contains: q, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const total = await prisma.product.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        category: true,
        _count: { select: { images: true } },
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  return (
    <div>
      <AdminPageHeader
        title="Products"
        description="Manage the enquiry-only catalog. Clients contact you through WhatsApp or the contact form."
        action={{ label: "New product", href: "/admin/products/new" }}
      />

      <AdminNotice
        saved={params.saved}
        deleted={params.deleted}
        error={
          params.error === "in-use"
            ? "in-use"
            : params.error
              ? "That action could not be completed."
              : undefined
        }
      />

      <AdminSearch
        action="/admin/products"
        defaultValue={q}
        placeholder="Search products, slugs, or categories…"
      >
        <select
          name="category"
          defaultValue={categoryId}
          aria-label="Filter by category"
          className="h-10 border border-charcoal/15 bg-cream px-3 text-[0.6875rem] text-charcoal outline-none focus:border-charcoal/40"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </AdminSearch>

      <div className="border border-charcoal/10 bg-cream">
        <div className="hidden grid-cols-[3.5rem_1.7fr_0.9fr_0.8fr_0.7fr_auto] items-center gap-4 border-b border-charcoal/10 px-5 py-3 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-charcoal/35 lg:grid">
          <span>Order</span>
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {products.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-2xl text-charcoal">
              {q || categoryId ? "No matching products." : "No products yet."}
            </p>
            <p className="mt-1 text-[0.75rem] text-charcoal/40">
              {q || categoryId
                ? "Try a different search or category."
                : "Add your first piece to start the catalog."}
            </p>
            {categories.length === 0 && (
              <Link
                href="/admin/categories"
                className="mt-4 inline-flex h-9 items-center bg-charcoal px-4 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ivory"
              >
                Create a category first
              </Link>
            )}
          </div>
        ) : (
          products.map((product, index) => {
            const orderIndex = (page - 1) * PAGE_SIZE + index;
            return (
              <div
                key={product.id}
                className="grid gap-4 border-b border-charcoal/8 px-4 py-4 last:border-0 lg:grid-cols-[3.5rem_1.7fr_0.9fr_0.8fr_0.7fr_auto] lg:items-center lg:px-5"
              >
                <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                  <span className="text-[0.5625rem] tabular-nums text-charcoal/35">
                    {String(orderIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="flex lg:mt-1">
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        aria-label={`Move ${product.name} up`}
                        disabled={orderIndex === 0}
                        className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                      >
                        <ChevronUp className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </form>
                    <form action={moveProduct}>
                      <input type="hidden" name="id" value={product.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        aria-label={`Move ${product.name} down`}
                        disabled={orderIndex >= total - 1}
                        className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                      >
                        <ChevronDown className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </form>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className="h-14 w-14 shrink-0 bg-sand bg-cover bg-center"
                    style={{ backgroundImage: `url("${product.coverImage}")` }}
                    role="img"
                    aria-label={product.name}
                  />
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 truncate text-[0.8125rem] font-semibold text-charcoal">
                      {product.name}
                      {product.featured && (
                        <span className="shrink-0 bg-gold/15 px-1.5 py-0.5 text-[0.4375rem] font-semibold uppercase tracking-[0.08em] text-[#7a5d2f]">
                          Featured
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 truncate text-[0.625rem] text-charcoal/40">
                      /{product.slug} · {product._count.images} gallery images
                    </p>
                  </div>
                </div>

                <p className="text-[0.75rem] text-charcoal/60">
                  {product.category.name}
                </p>

                <p className="text-[0.75rem] tabular-nums text-charcoal/60">
                  {product.priceOnRequest
                    ? "On request"
                    : product.price !== null
                      ? formatPrice(product.price)
                      : "—"}
                </p>

                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                      product.published
                        ? "bg-olive/10 text-olive"
                        : "bg-charcoal/8 text-charcoal/40"
                    }`}
                  >
                    {product.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                  <Link
                    href={`/admin/products/${product.id}`}
                    aria-label={`Edit ${product.name}`}
                    title="Edit"
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    <Pencil className="size-3.5" strokeWidth={1.5} />
                  </Link>
                  <form action={toggleProduct}>
                    <input type="hidden" name="id" value={product.id} />
                    <button
                      type="submit"
                      aria-label={
                        product.published
                          ? "Unpublish product"
                          : "Publish product"
                      }
                      title={product.published ? "Unpublish" : "Publish"}
                      className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                    >
                      {product.published ? (
                        <EyeOff className="size-3.5" strokeWidth={1.5} />
                      ) : (
                        <Eye className="size-3.5" strokeWidth={1.5} />
                      )}
                    </button>
                  </form>
                  <Link
                    href={`/products/${product.slug}`}
                    target="_blank"
                    aria-label={`View ${product.name} on the website`}
                    title="View live"
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    <ExternalLink className="size-3.5" strokeWidth={1.5} />
                  </Link>
                  <DeleteButton
                    action={deleteProduct}
                    id={product.id}
                    confirmMessage={`Delete “${product.name}”? This cannot be undone.`}
                    compact
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdminPagination
        basePath="/admin/products"
        page={page}
        totalPages={totalPages}
        params={{ q, category: categoryId }}
      />
    </div>
  );
}

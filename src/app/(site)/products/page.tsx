import type { Metadata } from "next";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { PageIntro } from "@/components/layout/page-intro";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/ui/reveal";
import { StudioCta } from "@/components/sections/studio-cta";
import { Breadcrumbs } from "@/components/seo/breadcrumbs";
import {
  getProductCategories,
  getProducts,
  getSettings,
} from "@/lib/data";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return buildMetadata(settings, {
    title: "Furniture, Lighting & Home Decor",
    description:
      "Browse the Ivory & Oak collection of furniture, lighting, rugs, textiles, and handmade objects. Enquire on WhatsApp or request pricing - no online checkout.",
    path: "/products",
  });
}

type SortOption = "featured" | "price-low" | "price-high";

function sortProducts(
  products: Awaited<ReturnType<typeof getProducts>>,
  sort: SortOption,
) {
  const sorted = [...products];
  if (sort === "price-low") {
    sorted.sort(
      (a, b) =>
        (a.price ?? Number.MAX_SAFE_INTEGER) -
        (b.price ?? Number.MAX_SAFE_INTEGER),
    );
  } else if (sort === "price-high") {
    sorted.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
  }
  return sorted;
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const sort: SortOption =
    params.sort === "price-low" || params.sort === "price-high"
      ? params.sort
      : "featured";

  const [settings, categories, result] = await Promise.all([
    getSettings(),
    getProductCategories(),
    getProducts({ q, category }),
  ]);
  const products = sortProducts(result, sort);

  const hrefFor = (nextCategory?: string) => {
    const search = new URLSearchParams();
    if (q) search.set("q", q);
    if (nextCategory) search.set("category", nextCategory);
    if (sort !== "featured") search.set("sort", sort);
    const query = search.toString();
    return query ? `/products?${query}` : "/products";
  };

  return (
    <>
      <PageIntro
        breadcrumbs={
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Collection", href: "/products" },
            ]}
          />
        }
        eyebrow="The collection"
        title={
          <>
            Made to be
            <br />
            <em className="italic text-olive">lived with.</em>
          </>
        }
        intro="A considered edit of furniture, lighting, textiles, and objects. Browse the collection, then speak with us about finishes, sizes, and lead times."
        aside={
          <div className="flex flex-col gap-3 text-[0.75rem] leading-6 text-charcoal/55 lg:pb-2">
            <p>
              <span className="font-semibold text-charcoal">Catalog only.</span>{" "}
              Every piece is available to view at the studio and made to order.
            </p>
            <p className="text-[0.625rem] uppercase tracking-[0.13em] text-charcoal/35">
              No online checkout · Personal enquiries only
            </p>
          </div>
        }
      />

      <section className="py-12 sm:py-16 lg:py-20">
        <Container>
          <div className="mb-10 border-b border-charcoal/12 pb-7">
            <form
              action="/products"
              method="get"
              className="flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <label htmlFor="product-search" className="sr-only">
                Search products
              </label>
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-charcoal/35"
                  strokeWidth={1.5}
                />
                <input
                  id="product-search"
                  name="q"
                  type="search"
                  defaultValue={q}
                  placeholder="Search by name, material, or category..."
                  className="h-12 w-full border border-charcoal/20 bg-cream pl-11 pr-10 text-[0.8125rem] text-charcoal placeholder:text-charcoal/35 focus:border-charcoal/50 focus:outline-none"
                />
                {q && (
                  <Link
                    href={hrefFor(category)}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center text-charcoal/40 hover:text-charcoal"
                  >
                    <X className="size-3.5" strokeWidth={1.5} />
                  </Link>
                )}
              </div>
              {category && (
                <input type="hidden" name="category" value={category} />
              )}
              <div className="flex gap-3">
                <label htmlFor="sort" className="sr-only">
                  Sort products
                </label>
                <select
                  id="sort"
                  name="sort"
                  defaultValue={sort}
                  className="h-12 flex-1 border border-charcoal/20 bg-cream px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.1em] text-charcoal/65 focus:border-charcoal/50 focus:outline-none sm:flex-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: low to high</option>
                  <option value="price-high">Price: high to low</option>
                </select>
                <button
                  type="submit"
                  className="h-12 bg-charcoal px-6 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-ivory transition-colors hover:bg-ink"
                >
                  Search
                </button>
              </div>
            </form>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link
                href={hrefFor()}
                className={`px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.13em] transition-colors ${
                  !category
                    ? "bg-charcoal text-ivory"
                    : "border border-charcoal/15 text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal"
                }`}
              >
                All pieces
              </Link>
              {categories.map((item) => (
                <Link
                  key={item}
                  href={hrefFor(item)}
                  className={`px-3 py-2 text-[0.625rem] font-semibold uppercase tracking-[0.13em] transition-colors ${
                    category === item
                      ? "bg-charcoal text-ivory"
                      : "border border-charcoal/15 text-charcoal/55 hover:border-charcoal/40 hover:text-charcoal"
                  }`}
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

          <div className="mb-7 flex items-center justify-between gap-4">
            <p className="text-[0.625rem] uppercase tracking-[0.14em] text-charcoal/40">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
              {q && ` for “${q}”`}
              {category && ` in ${category}`}
            </p>
            {(q || category || sort !== "featured") && (
              <Link
                href="/products"
                className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-charcoal/45 underline underline-offset-4 hover:text-charcoal"
              >
                Clear filters
              </Link>
            )}
          </div>

          {products.length === 0 ? (
            <div className="border border-charcoal/10 bg-cream px-6 py-20 text-center">
              <p className="font-display text-3xl text-charcoal">
                We couldn&apos;t find that piece.
              </p>
              <p className="mx-auto mt-3 max-w-md text-[0.8125rem] leading-6 text-charcoal/50">
                Try a different search, or tell us what you&apos;re looking for
                — we source and commission custom pieces too.
              </p>
              <Link
                href="/products"
                className="mt-6 inline-block text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal underline underline-offset-4"
              >
                Browse everything
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-4 lg:gap-7">
              {products.map((product, index) => (
                <Reveal key={product.id} delay={(index % 4) * 60}>
                  <ProductCard product={product} priority={index < 4} />
                </Reveal>
              ))}
            </div>
          )}

          <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-charcoal/12 pt-8 sm:flex-row sm:items-center">
            <p className="max-w-xl text-[0.8125rem] leading-6 text-charcoal/50">
              Looking for a specific size, finish, or fabric? Many of our pieces
              can be customised. Speak with the studio before you decide.
            </p>
            <Link
              href="/contact"
              className="shrink-0 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-charcoal underline underline-offset-4"
            >
              Ask about a piece
            </Link>
          </div>
        </Container>
      </section>

      <StudioCta
        settings={settings}
        eyebrow="A more personal way to shop"
        title="See the pieces in person, in real light."
        description="Our Hyderabad studio is open by appointment. Come feel the fabrics, test the chairs, and talk through finishes with our team."
      />
    </>
  );
}

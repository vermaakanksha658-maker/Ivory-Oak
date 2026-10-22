import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { GalleryField } from "@/components/admin/gallery-field";
import { saveProduct } from "@/app/admin/actions";
import type { Product } from "@/lib/demo-data";

export function ProductForm({
  product,
  categories,
}: {
  product: Product | null;
  categories: Array<{ id: string; name: string }>;
}) {
  const gallery = (product?.images ?? [])
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((image) => `${image.url} | ${image.alt}`)
    .join("\n");

  return (
    <AdminForm
      action={saveProduct}
      cancelHref="/admin/products"
      submitLabel={product ? "Save product" : "Create product"}
    >
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="space-y-6">
        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Product details
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Products are showcased for enquiry only — there is no checkout.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="admin-label">
                Product name <span className="text-gold">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                defaultValue={product?.name ?? ""}
                placeholder="e.g. The Aranya Lounge Chair"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="slug" className="admin-label">
                URL slug
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                defaultValue={product?.slug ?? ""}
                placeholder="auto-generated-from-name"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="categoryId" className="admin-label">
                Category <span className="text-gold">*</span>
              </label>
              <select
                id="categoryId"
                name="categoryId"
                required
                defaultValue={product?.categoryId ?? ""}
                className="admin-field"
              >
                <option value="" disabled>
                  Choose a category
                </option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="mt-1.5 text-[0.625rem] text-red-900/60">
                  Create a category before saving this product.
                </p>
              )}
            </div>
            <div>
              <label htmlFor="sortOrder" className="admin-label">
                Sort order
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                min={0}
                defaultValue={product?.sortOrder ?? 0}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="price" className="admin-label">
                Price (INR)
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min={0}
                step={1}
                defaultValue={product?.price ?? ""}
                placeholder="e.g. 48500"
                className="admin-field"
              />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
                <input
                  type="checkbox"
                  name="priceOnRequest"
                  defaultChecked={product?.priceOnRequest ?? true}
                  className="size-4 accent-charcoal"
                />
                Price on request
              </label>
              <p className="text-[0.625rem] text-charcoal/35">
                When ticked, the price field is ignored.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="admin-label">
                Description <span className="text-gold">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={5}
                defaultValue={product?.description ?? ""}
                placeholder="Describe the piece, its character, and how it is made..."
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="specifications" className="admin-label">
                Specifications
              </label>
              <textarea
                id="specifications"
                name="specifications"
                rows={4}
                defaultValue={product?.specifications ?? ""}
                placeholder={"One per line, e.g.\nFrame: solid teak\nUpholstery: washed linen\nFinish: natural oil"}
                className="admin-field resize-y"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                A short specification list shown beside the product description.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-5 border-t border-charcoal/8 pt-5">
            <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="published"
                defaultChecked={product?.published ?? true}
                className="size-4 accent-charcoal"
              />
              Published on the website
            </label>
            <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="featured"
                defaultChecked={product?.featured ?? false}
                className="size-4 accent-charcoal"
              />
              Feature on the home page
            </label>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Materials & dimensions
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Helpful specifics for clients considering the piece.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="material" className="admin-label">
                Material
              </label>
              <input
                id="material"
                name="material"
                type="text"
                defaultValue={product?.material ?? ""}
                placeholder="Teak, cane, linen"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="dimensions" className="admin-label">
                Dimensions
              </label>
              <input
                id="dimensions"
                name="dimensions"
                type="text"
                defaultValue={product?.dimensions ?? ""}
                placeholder="W 72 × D 78 × H 82 cm"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="color" className="admin-label">
                Colour / finish
              </label>
              <input
                id="color"
                name="color"
                type="text"
                defaultValue={product?.color ?? ""}
                placeholder="Natural teak"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="leadTime" className="admin-label">
                Lead time
              </label>
              <input
                id="leadTime"
                name="leadTime"
                type="text"
                defaultValue={product?.leadTime ?? ""}
                placeholder="6–8 weeks"
                className="admin-field"
              />
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Search appearance
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Leave blank to use the product name and description.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <label htmlFor="seoTitle" className="admin-label">
                SEO title
              </label>
              <input
                id="seoTitle"
                name="seoTitle"
                type="text"
                maxLength={160}
                defaultValue={product?.seoTitle ?? ""}
                placeholder={`${product?.name ?? "Product"} | Ivory & Oak`}
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="seoDescription" className="admin-label">
                Meta description
              </label>
              <textarea
                id="seoDescription"
                name="seoDescription"
                rows={3}
                maxLength={320}
                defaultValue={product?.seoDescription ?? ""}
                placeholder="A short, specific description for search results…"
                className="admin-field resize-y"
              />
            </div>
            <ImageField
              label="Social sharing image"
              name="ogImage"
              defaultValue={product?.ogImage ?? ""}
              help="Optional. Leave blank to use the cover image."
            />
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Imagery</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Product images look best on a soft, uncluttered background.
            </p>
          </div>

          <ImageField
            label="Cover image"
            name="coverImage"
            defaultValue={product?.coverImage ?? ""}
            required
            help="Used on product cards and at the top of the product page."
          />

          <div className="mt-6 border-t border-charcoal/8 pt-6">
            <GalleryField
              label="Product gallery"
              name="images"
              defaultValue={gallery}
              defaultAlt={product?.name ?? ""}
              help="Add multiple angles and detail shots. Use the arrows to set their order."
            />
          </div>
        </section>
      </div>
    </AdminForm>
  );
}

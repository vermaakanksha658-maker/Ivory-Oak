import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { saveLocationPage } from "@/app/admin/actions";

type LocationFormPage = {
  id: string;
  city: string;
  region: string | null;
  title: string;
  slug: string;
  intro: string;
  content: string;
  image: string | null;
  ogImage: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  sortOrder: number;
};

export function LocationForm({
  location,
}: {
  location: LocationFormPage | null;
}) {
  return (
    <AdminForm
      action={saveLocationPage}
      cancelHref="/admin/locations"
      submitLabel={location ? "Save location" : "Create location"}
    >
      {location && <input type="hidden" name="id" value={location.id} />}

      <div className="space-y-6">
        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Location details
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Publish a local landing page only for an area you genuinely
              serve.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="city" className="admin-label">
                City <span className="text-gold">*</span>
              </label>
              <input
                id="city"
                name="city"
                type="text"
                required
                maxLength={120}
                defaultValue={location?.city ?? ""}
                placeholder="e.g. Hyderabad"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="region" className="admin-label">
                State or region
              </label>
              <input
                id="region"
                name="region"
                type="text"
                defaultValue={location?.region ?? ""}
                placeholder="e.g. Telangana"
                className="admin-field"
              />
            </div>
            <div>
              <label htmlFor="title" className="admin-label">
                Page title <span className="text-gold">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={160}
                defaultValue={location?.title ?? ""}
                placeholder="Interior Design in Hyderabad"
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
                defaultValue={location?.slug ?? ""}
                placeholder="hyderabad"
                className="admin-field"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                The page will live at /locations/your-slug.
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="intro" className="admin-label">
                Introduction <span className="text-gold">*</span>
              </label>
              <textarea
                id="intro"
                name="intro"
                required
                rows={3}
                maxLength={600}
                defaultValue={location?.intro ?? ""}
                placeholder="A specific, honest summary of how you work in this city."
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="content" className="admin-label">
                Main content <span className="text-gold">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                required
                rows={12}
                maxLength={40000}
                defaultValue={location?.content ?? ""}
                placeholder={
                  "Write local content in short paragraphs.\n\nSeparate paragraphs with a blank line.\n\nStart headings with ## "
                }
                className="admin-field resize-y"
              />
              <p className="mt-1.5 text-[0.625rem] text-charcoal/35">
                Separate paragraphs with a blank line. Start a heading with
                ## and a list item with -.
              </p>
            </div>
            <ImageField
              label="Location image"
              name="image"
              defaultValue={location?.image ?? ""}
              help="Optional. Shown on the location page and card."
            />
            <ImageField
              label="Social sharing image"
              name="ogImage"
              defaultValue={location?.ogImage ?? ""}
              help="Optional. Leave blank to use the location image."
            />
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Publishing</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Drafts are hidden from the website and sitemap.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="sortOrder" className="admin-label">
                Sort order
              </label>
              <input
                id="sortOrder"
                name="sortOrder"
                type="number"
                defaultValue={location?.sortOrder ?? 0}
                className="admin-field"
              />
            </div>
            <label className="flex items-center gap-2 self-end pb-3 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="published"
                defaultChecked={location?.published ?? true}
                className="size-4 accent-charcoal"
              />
              Published
            </label>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Search metadata
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Leave these blank to use the page title and introduction.
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
                defaultValue={location?.seoTitle ?? ""}
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
                defaultValue={location?.seoDescription ?? ""}
                className="admin-field resize-y"
              />
            </div>
          </div>
        </section>
      </div>
    </AdminForm>
  );
}

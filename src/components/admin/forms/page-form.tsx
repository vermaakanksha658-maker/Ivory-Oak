import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { savePage } from "@/app/admin/actions";

export function PageForm({
  page,
}: {
  page: {
    id: string;
    slug: string;
    title: string;
    excerpt: string | null;
    content: string;
    ogImage?: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
    showInFooter: boolean;
    sortOrder: number;
    published: boolean;
  } | null;
}) {
  return (
    <AdminForm
      action={savePage}
      cancelHref="/admin/pages"
      submitLabel={page ? "Save page" : "Create page"}
    >
      {page && <input type="hidden" name="id" value={page.id} />}

      <div className="space-y-6">
        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Page details
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Use pages for privacy, terms, care guides, or other studio
              information.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="admin-label">
                Title <span className="text-gold">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                maxLength={160}
                defaultValue={page?.title ?? ""}
                placeholder="e.g. Privacy Policy"
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
                defaultValue={page?.slug ?? ""}
                placeholder="privacy-policy"
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="excerpt" className="admin-label">
                Short introduction
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                maxLength={500}
                defaultValue={page?.excerpt ?? ""}
                placeholder="A one-line summary shown beneath the title."
                className="admin-field resize-y"
              />
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
                defaultValue={page?.sortOrder ?? 0}
                className="admin-field"
              />
            </div>
            <div className="flex flex-col justify-end gap-2 pb-1">
              <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={page?.published ?? true}
                  className="size-4 accent-charcoal"
                />
                Published
              </label>
              <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
                <input
                  type="checkbox"
                  name="showInFooter"
                  defaultChecked={page?.showInFooter ?? false}
                  className="size-4 accent-charcoal"
                />
                Link in the footer
              </label>
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Content</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Start a line with <code>## </code> for a heading, and use blank
              lines between paragraphs.
            </p>
          </div>
          <textarea
            id="content"
            name="content"
            required
            rows={18}
            maxLength={40000}
            defaultValue={page?.content ?? ""}
            placeholder={"## Overview\nWrite your page content here.\n\n## Another section\nMore information…"}
            className="admin-field resize-y font-mono text-[0.75rem] leading-6"
          />
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Search appearance
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Leave blank to use the page title and excerpt.
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
                defaultValue={page?.seoTitle ?? ""}
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
                defaultValue={page?.seoDescription ?? ""}
                className="admin-field resize-y"
              />
            </div>
            <ImageField
              label="Social sharing image"
              name="ogImage"
              defaultValue={page?.ogImage ?? ""}
              help="Optional. Shown when this page is shared on social media."
            />
          </div>
        </section>
      </div>
    </AdminForm>
  );
}

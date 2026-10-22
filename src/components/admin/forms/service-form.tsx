import { AdminForm } from "@/components/admin/admin-form";
import { ImageField } from "@/components/admin/image-field";
import { saveService } from "@/app/admin/actions";
import type { Service } from "@/lib/demo-data";

export function ServiceForm({ service }: { service: Service | null }) {
  return (
    <AdminForm
      action={saveService}
      cancelHref="/admin/services"
      submitLabel={service ? "Save service" : "Create service"}
    >
      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="space-y-6">
        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Service details
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Keep titles descriptive and summaries benefit-led.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="admin-label">
                Service title <span className="text-gold">*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                defaultValue={service?.title ?? ""}
                placeholder="e.g. Full Home Interiors"
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
                defaultValue={service?.slug ?? ""}
                placeholder="auto-generated-from-title"
                className="admin-field"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="shortDescription" className="admin-label">
                Short description <span className="text-gold">*</span>
              </label>
              <textarea
                id="shortDescription"
                name="shortDescription"
                required
                rows={2}
                defaultValue={service?.shortDescription ?? ""}
                placeholder="One sentence shown on the services list..."
                className="admin-field resize-y"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="description" className="admin-label">
                Full description <span className="text-gold">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={8}
                defaultValue={service?.description ?? ""}
                placeholder="Explain the process, scope, and what makes this service distinct..."
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
                defaultValue={service?.sortOrder ?? 0}
                className="admin-field"
              />
            </div>
            <div className="flex items-end pb-3">
              <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={service?.published ?? true}
                  className="size-4 accent-charcoal"
                />
                Published on the website
              </label>
            </div>
          </div>
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">Service image</h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              A calm, characterful image works best — landscape orientation.
            </p>
          </div>
          <ImageField
            label="Cover image"
            name="image"
            defaultValue={service?.image ?? ""}
            required
          />
        </section>

        <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display text-xl text-charcoal">
              Search appearance
            </h2>
            <p className="mt-1 text-[0.6875rem] text-charcoal/40">
              Leave blank to use the service title and description.
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
                defaultValue={service?.seoTitle ?? ""}
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
                defaultValue={service?.seoDescription ?? ""}
                className="admin-field resize-y"
              />
            </div>
            <ImageField
              label="Social sharing image"
              name="ogImage"
              defaultValue={service?.ogImage ?? ""}
              help="Optional. Leave blank to use the service image."
            />
          </div>
        </section>
      </div>
    </AdminForm>
  );
}

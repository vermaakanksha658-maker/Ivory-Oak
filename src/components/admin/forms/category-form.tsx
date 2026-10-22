import { AdminForm } from "@/components/admin/admin-form";
import { saveCategory } from "@/app/admin/actions";

export function CategoryForm({
  category,
}: {
  category: { id: string; name: string; slug: string; sortOrder: number; published: boolean } | null;
}) {
  return (
    <AdminForm
      action={saveCategory}
      cancelHref="/admin/categories"
      submitLabel={category ? "Save category" : "Create category"}
    >
      {category && <input type="hidden" name="id" value={category.id} />}

      <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-display text-xl text-charcoal">
            Category details
          </h2>
          <p className="mt-1 text-[0.6875rem] text-charcoal/40">
            Categories group products in the catalog and filter menu.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="admin-label">
              Name <span className="text-gold">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              maxLength={100}
              defaultValue={category?.name ?? ""}
              placeholder="e.g. Furniture"
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
              defaultValue={category?.slug ?? ""}
              placeholder="auto-generated-from-name"
              className="admin-field"
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
              defaultValue={category?.sortOrder ?? 0}
              className="admin-field"
            />
          </div>
          <div className="flex items-end pb-1">
            <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="published"
                defaultChecked={category?.published ?? true}
                className="size-4 accent-charcoal"
              />
              Published on the website
            </label>
          </div>
        </div>
      </section>
    </AdminForm>
  );
}

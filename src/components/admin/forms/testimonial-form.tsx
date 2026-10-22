import { AdminForm } from "@/components/admin/admin-form";
import { saveTestimonial } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/demo-data";

export function TestimonialForm({
  testimonial,
}: {
  testimonial: Testimonial | null;
}) {
  return (
    <AdminForm
      action={saveTestimonial}
      cancelHref="/admin/testimonials"
      submitLabel={testimonial ? "Save testimonial" : "Create testimonial"}
    >
      {testimonial && (
        <input type="hidden" name="id" value={testimonial.id} />
      )}

      <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-display text-xl text-charcoal">
            Client testimonial
          </h2>
          <p className="mt-1 text-[0.6875rem] text-charcoal/40">
            Use a direct quote in the client&apos;s own words.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="admin-label">
              Client name <span className="text-gold">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              defaultValue={testimonial?.name ?? ""}
              placeholder="e.g. Meera & Arjun"
              className="admin-field"
            />
          </div>
          <div>
            <label htmlFor="location" className="admin-label">
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              defaultValue={testimonial?.location ?? ""}
              placeholder="Jubilee Hills, Hyderabad"
              className="admin-field"
            />
          </div>
          <div>
            <label htmlFor="project" className="admin-label">
              Project name
            </label>
            <input
              id="project"
              name="project"
              type="text"
              defaultValue={testimonial?.project ?? ""}
              placeholder="The Quiet House"
              className="admin-field"
            />
          </div>
          <div>
            <label htmlFor="rating" className="admin-label">
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              defaultValue={String(testimonial?.rating ?? 5)}
              className="admin-field"
            >
              {[5, 4, 3, 2, 1].map((rating) => (
                <option key={rating} value={rating}>
                  {rating} star{rating === 1 ? "" : "s"}
                </option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="quote" className="admin-label">
              Quote <span className="text-gold">*</span>
            </label>
            <textarea
              id="quote"
              name="quote"
              required
              rows={6}
              defaultValue={testimonial?.quote ?? ""}
              placeholder="“Working with Ivory & Oak felt effortless...”"
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
              defaultValue={testimonial?.sortOrder ?? 0}
              className="admin-field"
            />
          </div>
          <div className="flex items-end pb-3">
            <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
              <input
                type="checkbox"
                name="published"
                defaultChecked={testimonial?.published ?? true}
                className="size-4 accent-charcoal"
              />
              Published on the home page
            </label>
          </div>
        </div>
      </section>
    </AdminForm>
  );
}

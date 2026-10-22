import { AdminForm } from "@/components/admin/admin-form";
import { saveFaq } from "@/app/admin/actions";

export function FaqForm({
  faq,
}: {
  faq: {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    sortOrder: number;
    published: boolean;
  } | null;
}) {
  return (
    <AdminForm
      action={saveFaq}
      cancelHref="/admin/faqs"
      submitLabel={faq ? "Save FAQ" : "Create FAQ"}
    >
      {faq && <input type="hidden" name="id" value={faq.id} />}

      <section className="border border-charcoal/10 bg-cream p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-display text-xl text-charcoal">FAQ entry</h2>
          <p className="mt-1 text-[0.6875rem] text-charcoal/40">
            Published FAQs appear on the contact page.
          </p>
        </div>

        <div className="grid gap-5">
          <div>
            <label htmlFor="question" className="admin-label">
              Question <span className="text-gold">*</span>
            </label>
            <input
              id="question"
              name="question"
              type="text"
              required
              maxLength={500}
              defaultValue={faq?.question ?? ""}
              placeholder="e.g. How long does a project take?"
              className="admin-field"
            />
          </div>
          <div>
            <label htmlFor="answer" className="admin-label">
              Answer <span className="text-gold">*</span>
            </label>
            <textarea
              id="answer"
              name="answer"
              required
              rows={6}
              maxLength={10000}
              defaultValue={faq?.answer ?? ""}
              placeholder="Write a clear, helpful answer…"
              className="admin-field resize-y"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="category" className="admin-label">
                Group
              </label>
              <input
                id="category"
                name="category"
                type="text"
                defaultValue={faq?.category ?? ""}
                placeholder="Process, Fees, Products…"
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
                defaultValue={faq?.sortOrder ?? 0}
                className="admin-field"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-[0.75rem] text-charcoal/70">
            <input
              type="checkbox"
              name="published"
              defaultChecked={faq?.published ?? true}
              className="size-4 accent-charcoal"
            />
            Published on the website
          </label>
        </div>
      </section>
    </AdminForm>
  );
}

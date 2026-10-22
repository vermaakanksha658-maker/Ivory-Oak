import Link from "next/link";
import {
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
import { deleteFaq, moveFaq, toggleFaq } from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminFaqsPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    page?: string;
    saved?: string;
    deleted?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = q
    ? {
        OR: [
          { question: { contains: q, mode: "insensitive" as const } },
          { answer: { contains: q, mode: "insensitive" as const } },
          { category: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : undefined;

  const total = await prisma.faq.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const faqs = await prisma.faq.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <AdminPageHeader
        title="FAQs"
        description="Answer common questions about process, fees, products, and working with the studio."
        action={{ label: "New FAQ", href: "/admin/faqs/new" }}
      />

      <AdminNotice saved={params.saved} deleted={params.deleted} />

      <AdminSearch
        action="/admin/faqs"
        defaultValue={q}
        placeholder="Search questions and answers…"
      />

      <div className="border border-charcoal/10 bg-cream">
        <div className="hidden grid-cols-[3.5rem_1.9fr_0.8fr_0.7fr_auto] items-center gap-4 border-b border-charcoal/10 px-5 py-3 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-charcoal/35 lg:grid">
          <span>Order</span>
          <span>Question</span>
          <span>Group</span>
          <span>Status</span>
          <span className="text-right">Actions</span>
        </div>

        {faqs.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-2xl text-charcoal">
              {q ? "No matching FAQs." : "No FAQs yet."}
            </p>
            <p className="mt-1 text-[0.75rem] text-charcoal/40">
              Add the questions clients ask most often.
            </p>
          </div>
        ) : (
          faqs.map((faq, index) => {
            const orderIndex = (page - 1) * PAGE_SIZE + index;
            return (
              <div
                key={faq.id}
                className="grid gap-4 border-b border-charcoal/8 px-4 py-4 last:border-0 lg:grid-cols-[3.5rem_1.9fr_0.8fr_0.7fr_auto] lg:items-center lg:px-5"
              >
                <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                  <span className="text-[0.5625rem] tabular-nums text-charcoal/35">
                    {String(orderIndex + 1).padStart(2, "0")}
                  </span>
                  <div className="flex lg:mt-1">
                    <form action={moveFaq}>
                      <input type="hidden" name="id" value={faq.id} />
                      <input type="hidden" name="direction" value="up" />
                      <button
                        type="submit"
                        aria-label={`Move ${faq.question} up`}
                        disabled={orderIndex === 0}
                        className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                      >
                        <ChevronUp className="size-3.5" strokeWidth={1.6} />
                      </button>
                    </form>
                    <form action={moveFaq}>
                      <input type="hidden" name="id" value={faq.id} />
                      <input type="hidden" name="direction" value="down" />
                      <button
                        type="submit"
                        aria-label={`Move ${faq.question} down`}
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
                    {faq.question}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[0.625rem] text-charcoal/40">
                    {faq.answer}
                  </p>
                </div>

                <p className="text-[0.75rem] text-charcoal/60">
                  {faq.category ?? "General"}
                </p>

                <div>
                  <span
                    className={`inline-flex px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                      faq.published
                        ? "bg-olive/10 text-olive"
                        : "bg-charcoal/8 text-charcoal/40"
                    }`}
                  >
                    {faq.published ? "Published" : "Draft"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                  <Link
                    href={`/admin/faqs/${faq.id}`}
                    aria-label={`Edit ${faq.question}`}
                    title="Edit"
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    <Pencil className="size-3.5" strokeWidth={1.5} />
                  </Link>
                  <form action={toggleFaq}>
                    <input type="hidden" name="id" value={faq.id} />
                    <button
                      type="submit"
                      aria-label={faq.published ? "Unpublish FAQ" : "Publish FAQ"}
                      title={faq.published ? "Unpublish" : "Publish"}
                      className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                    >
                      {faq.published ? (
                        <EyeOff className="size-3.5" strokeWidth={1.5} />
                      ) : (
                        <Eye className="size-3.5" strokeWidth={1.5} />
                      )}
                    </button>
                  </form>
                  <DeleteButton
                    action={deleteFaq}
                    id={faq.id}
                    confirmMessage={`Delete “${faq.question}”?`}
                    compact
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      <AdminPagination
        basePath="/admin/faqs"
        page={page}
        totalPages={totalPages}
        params={{ q }}
      />
    </div>
  );
}

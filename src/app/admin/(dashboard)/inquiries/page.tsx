import Link from "next/link";
import {
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteInquiry,
  saveInquiryNotes,
  updateInquiryStatus,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 15;

const statusStyles: Record<string, string> = {
  NEW: "bg-gold/15 text-[#7a5d2f]",
  CONTACTED: "bg-olive/10 text-olive",
  RESOLVED: "bg-charcoal/8 text-charcoal/45",
};

const filters = [
  { label: "All", value: "" },
  { label: "New", value: "NEW" },
  { label: "Contacted", value: "CONTACTED" },
  { label: "Resolved", value: "RESOLVED" },
];

function filterHref(status: string, q: string) {
  const search = new URLSearchParams();
  if (status) search.set("status", status);
  if (q) search.set("q", q);
  const query = search.toString();
  return query ? `/admin/inquiries?${query}` : "/admin/inquiries";
}

export default async function AdminInquiriesPage({
  searchParams,
}: {
  searchParams: Promise<{
    status?: string;
    q?: string;
    page?: string;
    saved?: string;
    deleted?: string;
  }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const activeStatus = ["NEW", "CONTACTED", "RESOLVED"].includes(
    params.status ?? "",
  )
    ? (params.status as string)
    : "";
  const requestedPage = Math.max(1, Number(params.page) || 1);

  const where = {
    ...(activeStatus ? { status: activeStatus } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { message: { contains: q, mode: "insensitive" as const } },
            {
              product: {
                name: { contains: q, mode: "insensitive" as const },
              },
            },
            {
              service: {
                title: { contains: q, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  };

  const total = await prisma.inquiry.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const [inquiries, counts] = await Promise.all([
    prisma.inquiry.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: {
        product: { select: { name: true, slug: true } },
        service: { select: { title: true, slug: true } },
      },
    }),
    prisma.inquiry.groupBy({
      by: ["status"],
      _count: { _all: true },
    }),
  ]);

  const countMap = Object.fromEntries(
    counts.map((entry) => [entry.status, entry._count._all]),
  );
  const allCount = counts.reduce((sum, entry) => sum + entry._count._all, 0);
  const newCount = countMap.NEW ?? 0;

  return (
    <div>
      <AdminPageHeader
        title="Enquiries"
        description="Every message from the contact form and product pages, in one calm inbox."
      />

      <AdminNotice
        saved={params.saved}
        deleted={params.deleted}
        message="Internal notes saved."
      />

      <div className="mb-4 flex flex-wrap items-center gap-1 border-b border-charcoal/10 pb-3">
        {filters.map((filter) => {
          const count =
            filter.value === "" ? allCount : (countMap[filter.value] ?? 0);
          const active = activeStatus === filter.value;
          return (
            <Link
              key={filter.label}
              href={filterHref(filter.value, q)}
              className={`inline-flex items-center gap-2 px-3 py-2 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] transition-colors ${
                active
                  ? "bg-charcoal text-ivory"
                  : "text-charcoal/45 hover:bg-sand/50 hover:text-charcoal"
              }`}
            >
              {filter.label}
              <span
                className={`tabular-nums ${
                  active ? "text-ivory/50" : "text-charcoal/30"
                }`}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <AdminSearch
        action="/admin/inquiries"
        defaultValue={q}
        placeholder="Search names, phone, email, message, product or service…"
      >
        {activeStatus && (
          <input type="hidden" name="status" value={activeStatus} />
        )}
      </AdminSearch>

      {newCount > 0 && (
        <div className="mb-5 flex items-center gap-2 border border-gold/30 bg-gold/8 px-4 py-3 text-[0.75rem] text-[#6f542b]">
          <MessageSquare className="size-4" strokeWidth={1.5} />
          {newCount} new {newCount === 1 ? "enquiry is" : "enquiries are"}{" "}
          waiting for a reply.
        </div>
      )}

      {inquiries.length === 0 ? (
        <div className="border border-charcoal/10 bg-cream px-6 py-16 text-center">
          <MessageSquare className="mx-auto size-6 text-taupe" strokeWidth={1.2} />
          <p className="mt-3 font-display text-2xl text-charcoal">
            {q
              ? "No matching enquiries."
              : activeStatus
                ? "Nothing in this view."
                : "No enquiries yet."}
          </p>
          <p className="mt-1 text-[0.75rem] text-charcoal/40">
            {q
              ? "Try a different search or clear the status filter."
              : activeStatus
                ? "Try another status filter."
                : "New messages will appear here automatically."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {inquiries.map((inquiry) => {
            const phone = inquiry.phone.replace(/\D/g, "");
            const whatsappText = encodeURIComponent(
              `Hello ${inquiry.name}, this is Ivory & Oak. Thank you for your enquiry — we'd love to help.`,
            );
            const related =
              inquiry.product?.name ??
              inquiry.service?.title ??
              inquiry.source.replace("_", " ");
            return (
              <details
                key={inquiry.id}
                className="group border border-charcoal/10 bg-cream open:border-charcoal/20"
              >
                <summary className="flex cursor-pointer list-none flex-col gap-3 p-4 marker:hidden sm:flex-row sm:items-center sm:justify-between sm:p-5 [&::-webkit-details-marker]:hidden">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center bg-sand text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-charcoal/60">
                      {inquiry.name.slice(0, 2)}
                    </span>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[0.8125rem] font-semibold text-charcoal">
                          {inquiry.name}
                        </p>
                        <span
                          className={`px-2 py-0.5 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                            statusStyles[inquiry.status] ?? statusStyles.RESOLVED
                          }`}
                        >
                          {inquiry.status.replace("_", " ")}
                        </span>
                        <span className="text-[0.5rem] uppercase tracking-[0.1em] text-charcoal/30">
                          {related}
                        </span>
                        {inquiry.notes && (
                          <span className="text-[0.5rem] uppercase tracking-[0.1em] text-olive/70">
                            Note
                          </span>
                        )}
                      </div>
                      <p className="mt-1 line-clamp-1 max-w-xl text-[0.75rem] text-charcoal/45">
                        {inquiry.message}
                      </p>
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-4 pl-12 sm:pl-0">
                    <span className="text-[0.5625rem] tabular-nums text-charcoal/35">
                      {formatDate(inquiry.createdAt)}
                    </span>
                    <span className="text-[0.5rem] font-semibold uppercase tracking-[0.12em] text-charcoal/30 group-open:text-charcoal/60">
                      Details
                    </span>
                  </div>
                </summary>

                <div className="border-t border-charcoal/8 px-4 py-5 sm:px-5">
                  <p className="whitespace-pre-line text-[0.8125rem] leading-7 text-charcoal/70">
                    {inquiry.message}
                  </p>

                  {(inquiry.product || inquiry.service) && (
                    <p className="mt-3 text-[0.6875rem] text-charcoal/45">
                      About:{" "}
                      {inquiry.product && (
                        <Link
                          href={`/products/${inquiry.product.slug}`}
                          target="_blank"
                          className="text-charcoal/70 underline decoration-charcoal/20 underline-offset-2 hover:text-charcoal"
                        >
                          {inquiry.product.name}
                        </Link>
                      )}
                      {inquiry.service && (
                        <Link
                          href={`/services/${inquiry.service.slug}`}
                          target="_blank"
                          className="text-charcoal/70 underline decoration-charcoal/20 underline-offset-2 hover:text-charcoal"
                        >
                          {inquiry.service.title}
                        </Link>
                      )}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <a
                      href={`tel:${inquiry.phone.replace(/\s/g, "")}`}
                      className="inline-flex h-9 items-center gap-2 border border-charcoal/15 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-charcoal/55 transition-colors hover:border-charcoal/40 hover:text-charcoal"
                    >
                      <Phone className="size-3.5" strokeWidth={1.5} />
                      {inquiry.phone}
                    </a>
                    <a
                      href={`https://wa.me/${phone}?text=${whatsappText}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-9 items-center gap-2 border border-olive/25 bg-olive/5 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-olive transition-colors hover:bg-olive/10"
                    >
                      <MessageCircle className="size-3.5" strokeWidth={1.5} />
                      WhatsApp
                    </a>
                    {inquiry.email && (
                      <a
                        href={`mailto:${inquiry.email}?subject=${encodeURIComponent(
                          "Your enquiry with Ivory & Oak",
                        )}`}
                        className="inline-flex h-9 items-center gap-2 border border-charcoal/15 px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.1em] text-charcoal/55 transition-colors hover:border-charcoal/40 hover:text-charcoal"
                      >
                        <Mail className="size-3.5" strokeWidth={1.5} />
                        {inquiry.email}
                      </a>
                    )}
                  </div>

                  <div className="mt-5 grid gap-5 border-t border-charcoal/8 pt-4 lg:grid-cols-[0.55fr_1.45fr]">
                    <div className="flex flex-col gap-4">
                      <form action={updateInquiryStatus}>
                        <input type="hidden" name="id" value={inquiry.id} />
                        <label
                          htmlFor={`status-${inquiry.id}`}
                          className="admin-label"
                        >
                          Status
                        </label>
                        <div className="flex gap-2">
                          <select
                            id={`status-${inquiry.id}`}
                            name="status"
                            defaultValue={inquiry.status}
                            className="admin-field h-9 min-w-0 flex-1 py-1.5 text-[0.75rem]"
                          >
                            <option value="NEW">New</option>
                            <option value="CONTACTED">Contacted</option>
                            <option value="RESOLVED">Resolved</option>
                          </select>
                          <button
                            type="submit"
                            className="h-9 shrink-0 bg-charcoal px-3 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-ink"
                          >
                            Update
                          </button>
                        </div>
                      </form>

                      <div>
                        <p className="text-[0.5625rem] text-charcoal/30">
                          Received{" "}
                          {new Intl.DateTimeFormat("en-IN", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }).format(inquiry.createdAt)}
                        </p>
                        <div className="mt-3">
                          <DeleteButton
                            action={deleteInquiry}
                            id={inquiry.id}
                            confirmMessage={`Delete the enquiry from ${inquiry.name}?`}
                          />
                        </div>
                      </div>
                    </div>

                    <form action={saveInquiryNotes}>
                      <input type="hidden" name="id" value={inquiry.id} />
                      <label
                        htmlFor={`notes-${inquiry.id}`}
                        className="admin-label"
                      >
                        Internal notes
                      </label>
                      <textarea
                        id={`notes-${inquiry.id}`}
                        name="notes"
                        rows={4}
                        maxLength={10000}
                        defaultValue={inquiry.notes ?? ""}
                        placeholder="Call summary, budget notes, next steps — visible only to the studio team."
                        className="admin-field resize-y text-[0.75rem]"
                      />
                      <button
                        type="submit"
                        className="mt-2 h-9 bg-charcoal px-4 text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-ivory transition-colors hover:bg-ink"
                      >
                        Save notes
                      </button>
                    </form>
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      )}

      <AdminPagination
        basePath="/admin/inquiries"
        page={page}
        totalPages={totalPages}
        params={{ q, status: activeStatus }}
      />
    </div>
  );
}

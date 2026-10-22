import Link from "next/link";
import { Eye, EyeOff, Pencil, Star } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteTestimonial,
  toggleTestimonial,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function AdminTestimonialsPage({
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
          { name: { contains: q, mode: "insensitive" as const } },
          { quote: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
          { project: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const total = await prisma.testimonial.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const testimonials = await prisma.testimonial.findMany({
    where,
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <AdminPageHeader
        title="Testimonials"
        description="Kind words from clients, shown as a carousel on the home page."
        action={{ label: "New testimonial", href: "/admin/testimonials/new" }}
      />

      <AdminNotice saved={params.saved} deleted={params.deleted} />

      <AdminSearch
        action="/admin/testimonials"
        defaultValue={q}
        placeholder="Search clients, quotes, or projects…"
      />

      {testimonials.length === 0 ? (
        <div className="border border-charcoal/10 bg-cream px-6 py-16 text-center">
          <p className="font-display text-2xl text-charcoal">
            {q ? "No matching testimonials." : "No testimonials yet."}
          </p>
          <p className="mt-1 text-[0.75rem] text-charcoal/40">
            {q
              ? "Try a different search or clear the query."
              : "Add a client quote to build trust on the home page."}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.id}
              className="flex flex-col border border-charcoal/10 bg-cream p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-0.5 text-gold">
                  {Array.from({ length: testimonial.rating }).map((_, index) => (
                    <Star
                      key={index}
                      className="size-3 fill-current"
                      strokeWidth={0}
                    />
                  ))}
                </div>
                <span
                  className={`px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                    testimonial.published
                      ? "bg-olive/10 text-olive"
                      : "bg-charcoal/8 text-charcoal/40"
                  }`}
                >
                  {testimonial.published ? "Published" : "Draft"}
                </span>
              </div>

              <blockquote className="mt-4 flex-1 font-display text-[1.35rem] leading-[1.4] text-charcoal">
                “{testimonial.quote}”
              </blockquote>

              <div className="mt-5 flex items-end justify-between gap-4 border-t border-charcoal/8 pt-4">
                <div>
                  <p className="text-[0.75rem] font-semibold text-charcoal">
                    {testimonial.name}
                  </p>
                  <p className="mt-0.5 text-[0.625rem] text-charcoal/40">
                    {[testimonial.location, testimonial.project]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Link
                    href={`/admin/testimonials/${testimonial.id}`}
                    aria-label={`Edit testimonial from ${testimonial.name}`}
                    title="Edit"
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    <Pencil className="size-3.5" strokeWidth={1.5} />
                  </Link>
                  <form action={toggleTestimonial}>
                    <input type="hidden" name="id" value={testimonial.id} />
                    <button
                      type="submit"
                      aria-label={
                        testimonial.published
                          ? "Unpublish testimonial"
                          : "Publish testimonial"
                      }
                      title={testimonial.published ? "Unpublish" : "Publish"}
                      className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                    >
                      {testimonial.published ? (
                        <EyeOff className="size-3.5" strokeWidth={1.5} />
                      ) : (
                        <Eye className="size-3.5" strokeWidth={1.5} />
                      )}
                    </button>
                  </form>
                  <DeleteButton
                    action={deleteTestimonial}
                    id={testimonial.id}
                    confirmMessage={`Delete the testimonial from ${testimonial.name}?`}
                    compact
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <AdminPagination
        basePath="/admin/testimonials"
        page={page}
        totalPages={totalPages}
        params={{ q }}
      />
    </div>
  );
}

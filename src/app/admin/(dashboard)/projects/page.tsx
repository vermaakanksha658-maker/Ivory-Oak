import Link from "next/link";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  ExternalLink,
  Pencil,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { AdminNotice } from "@/components/admin/admin-notice";
import { AdminPagination } from "@/components/admin/admin-pagination";
import { AdminSearch } from "@/components/admin/admin-search";
import { DeleteButton } from "@/components/admin/delete-button";
import {
  deleteProject,
  moveProject,
  toggleProject,
} from "@/app/admin/actions";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

export default async function AdminProjectsPage({
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
          { title: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
          { category: { contains: q, mode: "insensitive" as const } },
          { location: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const total = await prisma.project.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(requestedPage, totalPages);

  const projects = await prisma.project.findMany({
    where,
    include: { _count: { select: { images: true } } },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  });

  return (
    <div>
      <AdminPageHeader
        title="Projects"
        description="Upload projects, curate galleries, reorder work, and control what appears in the public portfolio."
        action={{ label: "New project", href: "/admin/projects/new" }}
      />

      <AdminNotice saved={params.saved} deleted={params.deleted} />

      <AdminSearch
        action="/admin/projects"
        defaultValue={q}
        placeholder="Search projects, categories, or locations…"
      />

      <div className="border border-charcoal/10 bg-cream">
        <div className="hidden grid-cols-[3.5rem_1.5fr_0.8fr_0.7fr_0.7fr_auto] items-center gap-4 border-b border-charcoal/10 px-5 py-3 text-[0.5rem] font-semibold uppercase tracking-[0.14em] text-charcoal/35 lg:grid">
          <span>Order</span>
          <span>Project</span>
          <span>Category</span>
          <span>Status</span>
          <span>Gallery</span>
          <span className="text-right">Actions</span>
        </div>

        {projects.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-display text-2xl text-charcoal">
              {q ? "No matching projects." : "No projects yet."}
            </p>
            <p className="mt-1 text-[0.75rem] text-charcoal/40">
              {q
                ? "Try a different search or clear the query."
                : "Add your first project to start building the portfolio."}
            </p>
          </div>
        ) : (
          projects.map((project, index) => (
            <div
              key={project.id}
              className="grid gap-4 border-b border-charcoal/8 px-4 py-4 last:border-0 lg:grid-cols-[3.5rem_1.5fr_0.8fr_0.7fr_0.7fr_auto] lg:items-center lg:px-5"
            >
              <div className="flex items-center gap-2 lg:flex-col lg:gap-1">
                <span className="text-[0.5625rem] tabular-nums text-charcoal/35">
                  {String((page - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                </span>
                <div className="flex lg:mt-1">
                  <form action={moveProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="direction" value="up" />
                    <button
                      type="submit"
                      aria-label={`Move ${project.title} up`}
                      disabled={index === 0 || Boolean(q)}
                      className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                    >
                      <ChevronUp className="size-3.5" strokeWidth={1.6} />
                    </button>
                  </form>
                  <form action={moveProject}>
                    <input type="hidden" name="id" value={project.id} />
                    <input type="hidden" name="direction" value="down" />
                    <button
                      type="submit"
                      aria-label={`Move ${project.title} down`}
                      disabled={index === projects.length - 1 || Boolean(q)}
                      className="flex size-6 items-center justify-center text-charcoal/30 transition-colors hover:text-charcoal disabled:opacity-20"
                    >
                      <ChevronDown className="size-3.5" strokeWidth={1.6} />
                    </button>
                  </form>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div
                  className="h-14 w-16 shrink-0 bg-sand bg-cover bg-center"
                  style={{ backgroundImage: `url("${project.coverImage}")` }}
                  role="img"
                  aria-label={project.title}
                />
                <div className="min-w-0">
                  <p className="truncate text-[0.8125rem] font-semibold text-charcoal">
                    {project.title}
                  </p>
                  <p className="mt-0.5 truncate text-[0.625rem] text-charcoal/40">
                    /{project.slug}
                  </p>
                  <p className="mt-1 text-[0.5625rem] uppercase tracking-[0.08em] text-charcoal/30">
                    {project.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 lg:block">
                <span className="text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-charcoal/30 lg:hidden">
                  Category
                </span>
                <span className="text-[0.75rem] text-charcoal/60">
                  {project.category}
                </span>
              </div>

              <div className="flex items-center gap-3 lg:block">
                <span className="text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-charcoal/30 lg:hidden">
                  Status
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] ${
                    project.published
                      ? "bg-olive/10 text-olive"
                      : "bg-charcoal/8 text-charcoal/40"
                  }`}
                >
                  {project.published ? "Published" : "Draft"}
                </span>
                {project.featured && (
                  <span className="ml-1.5 inline-flex bg-gold/15 px-2 py-1 text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-[#7a5d2f]">
                    Featured
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 lg:block">
                <span className="text-[0.5rem] font-semibold uppercase tracking-[0.1em] text-charcoal/30 lg:hidden">
                  Gallery
                </span>
                <span className="text-[0.75rem] text-charcoal/50">
                  {project._count.images} images
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-1 lg:justify-end">
                <Link
                  href={`/admin/projects/${project.id}`}
                  aria-label={`Edit ${project.title}`}
                  title="Edit"
                  className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                >
                  <Pencil className="size-3.5" strokeWidth={1.5} />
                </Link>
                <form action={toggleProject}>
                  <input type="hidden" name="id" value={project.id} />
                  <button
                    type="submit"
                    aria-label={
                      project.published ? "Unpublish project" : "Publish project"
                    }
                    title={project.published ? "Unpublish" : "Publish"}
                    className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                  >
                    {project.published ? (
                      <EyeOff className="size-3.5" strokeWidth={1.5} />
                    ) : (
                      <Eye className="size-3.5" strokeWidth={1.5} />
                    )}
                  </button>
                </form>
                <Link
                  href={`/portfolio/${project.slug}`}
                  target="_blank"
                  aria-label={`View ${project.title} on the website`}
                  title="View live"
                  className="flex size-8 items-center justify-center text-charcoal/40 transition-colors hover:bg-sand/50 hover:text-charcoal"
                >
                  <ExternalLink className="size-3.5" strokeWidth={1.5} />
                </Link>
                <DeleteButton
                  action={deleteProject}
                  id={project.id}
                  confirmMessage={`Delete “${project.title}”? This cannot be undone.`}
                  compact
                />
              </div>
            </div>
          ))
        )}
      </div>

      <AdminPagination
        basePath="/admin/projects"
        page={page}
        totalPages={totalPages}
        params={{ q }}
      />
    </div>
  );
}

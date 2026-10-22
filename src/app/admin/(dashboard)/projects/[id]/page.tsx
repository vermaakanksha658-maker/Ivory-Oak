import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProjectForm } from "@/components/admin/forms/project-form";

export const dynamic = "force-dynamic";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
    },
  });

  if (!project) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit project"
        description={`Editing “${project.title}”.`}
        backHref="/admin/projects"
      />
      <ProjectForm project={project} />
    </div>
  );
}

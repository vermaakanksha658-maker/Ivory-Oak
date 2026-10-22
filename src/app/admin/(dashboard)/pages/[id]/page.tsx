import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PageForm } from "@/components/admin/forms/page-form";

export const dynamic = "force-dynamic";

export default async function EditPagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const page = await prisma.page.findUnique({ where: { id } });
  if (!page) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit page"
        description={`Editing “${page.title}”.`}
        backHref="/admin/pages"
      />
      <PageForm page={page} />
    </div>
  );
}

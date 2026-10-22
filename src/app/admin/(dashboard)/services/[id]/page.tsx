import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/forms/service-form";

export const dynamic = "force-dynamic";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await prisma.service.findUnique({ where: { id } });

  if (!service) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit service"
        description={`Editing “${service.title}”.`}
        backHref="/admin/services"
      />
      <ServiceForm service={service} />
    </div>
  );
}

import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LocationForm } from "@/components/admin/forms/location-form";

export const dynamic = "force-dynamic";

export default async function EditLocationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const location = await prisma.locationPage.findUnique({ where: { id } });
  if (!location) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit location"
        description={`Editing "${location.title}".`}
        backHref="/admin/locations"
      />
      <LocationForm location={location} />
    </div>
  );
}

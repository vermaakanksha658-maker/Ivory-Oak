import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export const dynamic = "force-dynamic";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await prisma.testimonial.findUnique({ where: { id } });

  if (!testimonial) notFound();

  return (
    <div>
      <AdminPageHeader
        title="Edit testimonial"
        description={`Editing the testimonial from ${testimonial.name}.`}
        backHref="/admin/testimonials"
      />
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}

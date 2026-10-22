import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { TestimonialForm } from "@/components/admin/forms/testimonial-form";

export default function NewTestimonialPage() {
  return (
    <div>
      <AdminPageHeader
        title="New testimonial"
        description="Add a client quote to the home page."
        backHref="/admin/testimonials"
      />
      <TestimonialForm testimonial={null} />
    </div>
  );
}

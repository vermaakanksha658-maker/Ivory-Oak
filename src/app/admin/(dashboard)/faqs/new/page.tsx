import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { FaqForm } from "@/components/admin/forms/faq-form";

export default function NewFaqPage() {
  return (
    <div>
      <AdminPageHeader
        title="New FAQ"
        description="Add a helpful answer to a common client question."
        backHref="/admin/faqs"
      />
      <FaqForm faq={null} />
    </div>
  );
}

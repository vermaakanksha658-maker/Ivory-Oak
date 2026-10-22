import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { PageForm } from "@/components/admin/forms/page-form";

export default function NewPagePage() {
  return (
    <div>
      <AdminPageHeader
        title="New page"
        description="Create a policy or information page for the website."
        backHref="/admin/pages"
      />
      <PageForm page={null} />
    </div>
  );
}

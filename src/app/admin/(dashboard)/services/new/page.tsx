import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ServiceForm } from "@/components/admin/forms/service-form";

export default function NewServicePage() {
  return (
    <div>
      <AdminPageHeader
        title="New service"
        description="Add a service offering to the website."
        backHref="/admin/services"
      />
      <ServiceForm service={null} />
    </div>
  );
}

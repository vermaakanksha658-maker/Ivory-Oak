import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { LocationForm } from "@/components/admin/forms/location-form";

export default function NewLocationPage() {
  return (
    <div>
      <AdminPageHeader
        title="New location"
        description="Create a genuine local landing page for a city you serve."
        backHref="/admin/locations"
      />
      <LocationForm location={null} />
    </div>
  );
}

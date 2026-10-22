import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { CategoryForm } from "@/components/admin/forms/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <AdminPageHeader
        title="New category"
        description="Create a group for the product catalog."
        backHref="/admin/categories"
      />
      <CategoryForm category={null} />
    </div>
  );
}

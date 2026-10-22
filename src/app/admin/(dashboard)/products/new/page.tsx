import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/forms/product-form";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    select: { id: true, name: true },
  });

  return (
    <div>
      <AdminPageHeader
        title="New product"
        description="Add a piece to the enquiry-only catalog."
        backHref="/admin/products"
      />
      <ProductForm product={null} categories={categories} />
    </div>
  );
}

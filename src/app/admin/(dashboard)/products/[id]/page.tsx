import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminPageHeader } from "@/components/admin/admin-page-header";
import { ProductForm } from "@/components/admin/forms/product-form";
import type { Product } from "@/lib/demo-data";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [record, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        category: true,
      },
    }),
    prisma.category.findMany({
      orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
      select: { id: true, name: true },
    }),
  ]);

  if (!record) notFound();

  const product: Product = {
    ...record,
    category: record.category.name,
    categoryId: record.categoryId,
    images: record.images,
  };

  return (
    <div>
      <AdminPageHeader
        title="Edit product"
        description={`Editing “${product.name}”.`}
        backHref="/admin/products"
      />
      <ProductForm product={product} categories={categories} />
    </div>
  );
}

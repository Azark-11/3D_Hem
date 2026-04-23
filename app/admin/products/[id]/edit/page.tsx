import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { parseImages } from "@/lib/images";
import { AdminProductForm } from "@/components/AdminProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id } });
  if (!product) notFound();

  const defaultValues = {
    ...product,
    images: parseImages(product.images),
    weightGrams: product.weightGrams ?? undefined,
    nameEn: product.nameEn ?? undefined,
    descriptionEn: product.descriptionEn ?? undefined,
    category: product.category as "figurer" | "lampor" | "funktionellt" | "ovrigt",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        Edit Product
      </h1>
      <AdminProductForm productId={id} defaultValues={defaultValues} />
    </div>
  );
}

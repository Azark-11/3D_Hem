import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { formatSek } from "@/lib/currency";
import { parseImages, getImageUrl } from "@/lib/images";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { AddToCartButton } from "@/components/AddToCartButton";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await db.product.findMany({
    where: { active: true },
    select: { slug: true },
  });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return {};

  const images = parseImages(product.images);
  return {
    title: product.name,
    description: `${product.name} – ${formatSek(product.priceOre)}. ${product.material}, ${product.dimensionsMm}.`,
    openGraph: {
      images: images[0] ? [getImageUrl(images[0], 1200)] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("product");
  const tCat = await getTranslations("categories");

  const product = await db.product.findUnique({ where: { slug, active: true } });
  if (!product) notFound();

  const related = await db.product.findMany({
    where: {
      category: product.category,
      active: true,
      id: { not: product.id },
    },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  const images = parseImages(product.images);
  const outOfStock = product.stock === 0;

  const categoryLabel = tCat(product.category as "figurer" | "lampor" | "funktionellt" | "ovrigt");

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Gallery */}
        <ProductGallery images={images} productName={product.name} />

        {/* Info */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#ff6b1a] mb-2">
            {categoryLabel}
          </p>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#f5f1e8] mb-4"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {product.name}
          </h1>

          <p className="text-3xl font-bold text-[#ff6b1a] mb-1">
            {formatSek(product.priceOre)}
          </p>
          <p className="text-xs text-[#f5f1e8]/40 mb-6">{t("price_includes_vat")}</p>

          {/* Stock */}
          <div className="mb-6">
            {outOfStock ? (
              <Badge variant="destructive">{t("out_of_stock")}</Badge>
            ) : (
              <Badge variant="secondary">
                {t("in_stock")}: {product.stock}
              </Badge>
            )}
          </div>

          {/* Add to cart */}
          <AddToCartButton product={product} disabled={outOfStock} />

          {/* Specs */}
          <div className="mt-8 border border-[#2a2a2a] divide-y divide-[#2a2a2a]">
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-[#f5f1e8]/50">{t("material")}</span>
              <span className="font-medium">{product.material}</span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-[#f5f1e8]/50">{t("dimensions")}</span>
              <span className="font-medium">{product.dimensionsMm}</span>
            </div>
            {product.weightGrams && (
              <div className="flex justify-between px-4 py-3 text-sm">
                <span className="text-[#f5f1e8]/50">{t("weight")}</span>
                <span className="font-medium">{product.weightGrams} {t("weight_unit")}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="mt-8 prose prose-sm prose-invert max-w-none prose-p:text-[#f5f1e8]/70 prose-headings:text-[#f5f1e8] prose-strong:text-[#f5f1e8] prose-li:text-[#f5f1e8]/70">
            <ReactMarkdown>{product.description}</ReactMarkdown>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20 border-t border-[#2a2a2a] pt-12">
          <h2
            className="text-2xl font-bold text-[#f5f1e8] mb-8"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            {t("related")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

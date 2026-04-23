import { getTranslations } from "next-intl/server";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import type { Metadata } from "next";
import type { Prisma } from "@prisma/client";

export const metadata: Metadata = {
  title: "Butik",
  description: "Bläddra bland våra 3D-utskrifter — figurer, lampor och funktionella föremål.",
};

const CATEGORIES = ["figurer", "lampor", "funktionellt", "ovrigt"] as const;
const PAGE_SIZE = 12;

interface SearchParams {
  sida?: string;
  kategori?: string;
  sortera?: string;
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const t = await getTranslations("shop");
  const tCat = await getTranslations("categories");
  const params = await searchParams;

  const page = Math.max(1, parseInt(params.sida ?? "1", 10));
  const category = CATEGORIES.includes(params.kategori as (typeof CATEGORIES)[number])
    ? params.kategori
    : undefined;
  const sort = params.sortera ?? "newest";

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sort === "cheapest"
      ? { priceOre: "asc" }
      : sort === "expensive"
      ? { priceOre: "desc" }
      : { createdAt: "desc" };

  const where: Prisma.ProductWhereInput = {
    active: true,
    ...(category ? { category } : {}),
  };

  const [products, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.product.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const categoryLabels: Record<string, string> = {
    figurer: tCat("figurer"),
    lampor: tCat("lampor"),
    funktionellt: tCat("funktionellt"),
    ovrigt: tCat("ovrigt"),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1
          className="text-3xl md:text-4xl font-bold text-[#f5f1e8]"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {t("title")}
        </h1>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar / filters */}
        <aside className="w-full md:w-48 flex-shrink-0">
          <ShopFilters
            categories={CATEGORIES as unknown as string[]}
            categoryLabels={categoryLabels}
            activeCategory={category}
            activeSort={sort}
          />
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          {products.length === 0 ? (
            <div className="flex items-center justify-center py-24 border border-[#2a2a2a]">
              <p className="text-[#f5f1e8]/40">{t("empty")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-10">
                  {page > 1 && (
                    <a
                      href={`?sida=${page - 1}${category ? `&kategori=${category}` : ""}${sort !== "newest" ? `&sortera=${sort}` : ""}`}
                      className="px-4 py-2 border border-[#2a2a2a] text-sm text-[#f5f1e8]/70 hover:border-[#ff6b1a] hover:text-[#ff6b1a] transition-colors"
                    >
                      {t("prev")}
                    </a>
                  )}
                  <span className="text-sm text-[#f5f1e8]/40">
                    {t("page_label")} {page} / {totalPages}
                  </span>
                  {page < totalPages && (
                    <a
                      href={`?sida=${page + 1}${category ? `&kategori=${category}` : ""}${sort !== "newest" ? `&sortera=${sort}` : ""}`}
                      className="px-4 py-2 border border-[#2a2a2a] text-sm text-[#f5f1e8]/70 hover:border-[#ff6b1a] hover:text-[#ff6b1a] transition-colors"
                    >
                      {t("next")}
                    </a>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

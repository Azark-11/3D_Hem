"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface ShopFiltersProps {
  categories: string[];
  categoryLabels: Record<string, string>;
  activeCategory?: string;
  activeSort: string;
}

export function ShopFilters({
  categories,
  categoryLabels,
  activeCategory,
  activeSort,
}: ShopFiltersProps) {
  const t = useTranslations("shop");
  const router = useRouter();
  const searchParams = useSearchParams();

  function navigate(updates: Record<string, string | undefined>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    }
    params.delete("sida"); // reset page on filter change
    router.push(`/butik?${params.toString()}`);
  }

  const sortOptions = [
    { value: "newest", label: t("sort_newest") },
    { value: "cheapest", label: t("sort_cheapest") },
    { value: "expensive", label: t("sort_expensive") },
  ];

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5f1e8]/40 mb-3">
          {t("sort_label")}
        </p>
        <div className="flex flex-col gap-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => navigate({ sortera: opt.value === "newest" ? undefined : opt.value })}
              className={cn(
                "text-sm text-left py-1 transition-colors",
                activeSort === opt.value || (opt.value === "newest" && activeSort === "newest")
                  ? "text-[#ff6b1a] font-semibold"
                  : "text-[#f5f1e8]/60 hover:text-[#f5f1e8]"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-[#f5f1e8]/40 mb-3">
          {t("filter_label")}
        </p>
        <div className="flex flex-col gap-1">
          <button
            onClick={() => navigate({ kategori: undefined })}
            className={cn(
              "text-sm text-left py-1 transition-colors",
              !activeCategory
                ? "text-[#ff6b1a] font-semibold"
                : "text-[#f5f1e8]/60 hover:text-[#f5f1e8]"
            )}
          >
            {t("all_categories")}
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => navigate({ kategori: cat })}
              className={cn(
                "text-sm text-left py-1 transition-colors",
                activeCategory === cat
                  ? "text-[#ff6b1a] font-semibold"
                  : "text-[#f5f1e8]/60 hover:text-[#f5f1e8]"
              )}
            >
              {categoryLabels[cat] ?? cat}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

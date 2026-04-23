import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

export default async function HomePage() {
  const t = await getTranslations();

  const featured = await db.product.findMany({
    where: { featured: true, active: true },
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[#2a2a2a] py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff6b1a] mb-4">
              Made in Sweden
            </p>
            <h1
              className="text-5xl md:text-7xl font-bold leading-[1.05] text-[#f5f1e8] mb-6"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {t("home.hero_tagline")}
            </h1>
            <p className="text-lg text-[#f5f1e8]/60 mb-8 max-w-lg">
              {t("home.hero_subtitle")}
            </p>
            <Button asChild size="lg">
              <Link href="/butik">{t("home.hero_cta")}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured products */}
      {featured.length > 0 && (
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex items-baseline justify-between mb-10">
              <h2
                className="text-2xl md:text-3xl font-bold text-[#f5f1e8]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                {t("home.featured_heading")}
              </h2>
              <Link
                href="/butik"
                className="text-sm font-medium text-[#ff6b1a] hover:underline uppercase tracking-wide"
              >
                Se alla →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About blurb */}
      <section className="border-t border-[#2a2a2a] py-16 md:py-24 bg-[#0f0f0f]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff6b1a] mb-3">
              Om oss
            </p>
            <h2
              className="text-2xl md:text-3xl font-bold text-[#f5f1e8] mb-4"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              {t("home.about_heading")}
            </h2>
            <p className="text-[#f5f1e8]/60 leading-relaxed mb-6">
              {t("home.about_text")}
            </p>
            <Button asChild variant="secondary">
              <Link href="/om-oss">Läs mer</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

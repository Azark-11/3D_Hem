import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Om oss" };

export default async function OmOssPage() {
  const t = await getTranslations("about");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff6b1a] mb-3">
        Om oss
      </p>
      <h1
        className="text-3xl md:text-4xl font-bold text-[#f5f1e8] mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {t("heading")}
      </h1>
      <div className="prose prose-invert max-w-none prose-p:text-[#f5f1e8]/70 prose-headings:text-[#f5f1e8]">
        {t("text").split("\n\n").map((paragraph, i) => (
          <p key={i} className="text-[#f5f1e8]/70 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}

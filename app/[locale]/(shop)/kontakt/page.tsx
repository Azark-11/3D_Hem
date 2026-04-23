import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Kontakt" };

export default async function KontaktPage() {
  const t = await getTranslations("contact");

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#ff6b1a] mb-3">
        Kontakt
      </p>
      <h1
        className="text-3xl md:text-4xl font-bold text-[#f5f1e8] mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {t("heading")}
      </h1>
      <p className="text-[#f5f1e8]/60 mb-8">
        Har du frågor om en produkt, leverans eller vill beställa något speciellt?
        Hör av dig till oss på e-post nedan.
      </p>
      <a
        href="mailto:info@3dhem.se"
        className="text-[#ff6b1a] hover:underline font-semibold text-lg"
      >
        info@3dhem.se
      </a>
    </div>
  );
}

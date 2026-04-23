import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Köpvillkor" };

export default async function KopvillkorPage() {
  const t = await getTranslations("terms");

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-16">
      <h1
        className="text-3xl md:text-4xl font-bold text-[#f5f1e8] mb-8"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        {t("heading")}
      </h1>
      <div className="prose prose-invert max-w-none text-[#f5f1e8]/70 space-y-6">
        <p><strong className="text-[#f5f1e8]">Senast uppdaterad:</strong> [Datum]</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">1. Allmänt</h2>
        <p>Dessa köpvillkor gäller för köp gjorda på 3D Hem ([3dhem.se]). Säljare är [Företagsnamn], org.nr [ORG-NR].</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">2. Priser och betalning</h2>
        <p>Alla priser anges i svenska kronor (SEK) inklusive 25 % moms. Betalning sker via Stripe med kort, Swish eller Klarna.</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">3. Ångerrätt (14 dagar)</h2>
        <p>Som konsument har du rätt att ångra ditt köp inom 14 dagar från mottagandet av varan, i enlighet med distansavtalslagen (2005:59). Kontakta oss på [info@dittforetag.se] för att initiera ett ångrande. Varan ska returneras i originalskick.</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">4. Leverans</h2>
        <p>Leverans sker med PostNord inom 2–5 arbetsdagar efter bekräftad betalning. Fraktkostnad visas vid kassan.</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">5. Reklamation</h2>
        <p>Fel på vara ska reklameras inom skälig tid (normalt 2 månader) från det att du upptäckte felet. Kontakta oss på [info@dittforetag.se].</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">6. Tvist</h2>
        <p>Tvist avgörs i första hand genom överenskommelse. I andra hand kan du vända dig till Allmänna reklamationsnämnden (ARN), www.arn.se.</p>

        <p className="text-sm text-[#f5f1e8]/40 mt-8 italic">
          [Fyll i brackettexten ovan med verklig information innan lansering.]
        </p>
      </div>
    </div>
  );
}

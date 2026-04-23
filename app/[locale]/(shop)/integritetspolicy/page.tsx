import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Integritetspolicy" };

export default async function IntegritetspolicyPage() {
  const t = await getTranslations("privacy");

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

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">1. Personuppgiftsansvarig</h2>
        <p>[Företagsnamn], organisationsnummer [ORG-NR], [Adress], [Postort], Sverige. E-post: [info@dittforetag.se]</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">2. Vilka uppgifter samlar vi in?</h2>
        <p>Vi samlar in de uppgifter du anger vid köp: namn, e-postadress och leveransadress. Betalningsinformation hanteras av Stripe och lagras aldrig hos oss.</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">3. Hur använder vi dina uppgifter?</h2>
        <p>Dina uppgifter används för att behandla din beställning, leverera din order och kommunicera med dig angående köpet.</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">4. Cookies</h2>
        <p>Vi använder strikt nödvändiga cookies för kundvagn och session. Inga spårningscookies används utan ditt samtycke.</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">5. Dina rättigheter (GDPR)</h2>
        <p>Du har rätt att begära tillgång till, rättelse av eller radering av dina personuppgifter. Kontakta oss på [info@dittforetag.se].</p>

        <h2 className="text-xl font-bold text-[#f5f1e8] mt-8">6. Tredjeparter</h2>
        <p>Betalning hanteras av Stripe (stripe.com). Leverans kan ske via PostNord eller liknande. Dessa parter har egna integritetspolicyer.</p>

        <p className="text-sm text-[#f5f1e8]/40 mt-8 italic">
          [Fyll i brackettexten ovan med verklig information innan lansering.]
        </p>
      </div>
    </div>
  );
}

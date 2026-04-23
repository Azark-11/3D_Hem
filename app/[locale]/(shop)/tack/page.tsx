import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { stripe } from "@/lib/stripe";
import { formatSek } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { ClearCart } from "@/components/ClearCart";

export const dynamic = "force-dynamic";

export default async function TackPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const t = await getTranslations("success");
  const { session_id } = await searchParams;

  if (!session_id) notFound();

  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch {
    notFound();
  }

  if (session.payment_status !== "paid") notFound();

  const lineItems = session.line_items?.data ?? [];
  const email = session.customer_details?.email ?? "";
  const shippingOre = session.shipping_cost?.amount_total ?? 0;
  const subtotalOre = (session.amount_total ?? 0) - shippingOre;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 py-16">
      <ClearCart />

      <div className="text-center mb-10">
        <CheckCircle className="h-12 w-12 text-[#ff6b1a] mx-auto mb-4" />
        <h1
          className="text-3xl md:text-4xl font-bold text-[#f5f1e8] mb-2"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          {t("heading")}
        </h1>
        <p className="text-[#f5f1e8]/60">{t("subheading")}</p>
        {email && (
          <p className="text-sm text-[#f5f1e8]/40 mt-1">
            {t("email_sent", { email })}
          </p>
        )}
      </div>

      {/* Order summary */}
      <div className="border border-[#2a2a2a] mb-8">
        <div className="px-6 py-4 border-b border-[#2a2a2a]">
          <h2 className="font-semibold text-[#f5f1e8]">{t("order_summary")}</h2>
          <p className="text-xs text-[#f5f1e8]/40 mt-0.5">
            {t("order_number")}: {session_id.slice(-12).toUpperCase()}
          </p>
        </div>

        {/* Line items */}
        <div className="divide-y divide-[#2a2a2a]">
          {lineItems.map((item) => (
            <div key={item.id} className="flex justify-between px-6 py-3 text-sm">
              <span className="text-[#f5f1e8]/80">
                {item.description} × {item.quantity}
              </span>
              <span className="font-medium">
                {formatSek(item.amount_total ?? 0)}
              </span>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="border-t border-[#2a2a2a] divide-y divide-[#2a2a2a]">
          <div className="flex justify-between px-6 py-3 text-sm">
            <span className="text-[#f5f1e8]/60">{t("subtotal")}</span>
            <span>{formatSek(subtotalOre)}</span>
          </div>
          <div className="flex justify-between px-6 py-3 text-sm">
            <span className="text-[#f5f1e8]/60">{t("shipping")}</span>
            <span>{formatSek(shippingOre)}</span>
          </div>
          <div className="flex justify-between px-6 py-4 font-bold">
            <span>{t("total")}</span>
            <span className="text-[#ff6b1a]">
              {formatSek(session.amount_total ?? 0)}
            </span>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button asChild size="lg">
          <Link href="/butik">{t("continue")}</Link>
        </Button>
      </div>
    </div>
  );
}

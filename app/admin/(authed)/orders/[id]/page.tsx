import { notFound } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { formatSek } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id } });
  if (!order) notFound();

  const items = JSON.parse(order.items) as Array<{
    productId: string;
    name: string;
    priceOre: number;
    quantity: number;
  }>;

  const shippingAddress = order.shippingAddress
    ? (JSON.parse(order.shippingAddress) as Record<string, string>)
    : null;

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/orders" className="text-xs text-[#f5f1e8]/40 hover:text-[#ff6b1a]">
          ← Orders
        </Link>
        <h1 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Order {order.id.slice(-8).toUpperCase()}
        </h1>
        <Badge>{order.status}</Badge>
      </div>

      <div className="space-y-4">
        {/* Meta */}
        <div className="border border-[#2a2a2a] divide-y divide-[#2a2a2a]">
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-[#f5f1e8]/50">Email</span>
            <span>{order.email}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-[#f5f1e8]/50">Payment method</span>
            <span>{order.paymentMethod ?? "—"}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-[#f5f1e8]/50">Date</span>
            <span>{order.createdAt.toLocaleString("sv-SE")}</span>
          </div>
          <div className="flex justify-between px-4 py-3 text-sm">
            <span className="text-[#f5f1e8]/50">Stripe session</span>
            <a
              href={`https://dashboard.stripe.com/test/checkout/${order.stripeSessionId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ff6b1a] hover:underline font-mono text-xs"
            >
              {order.stripeSessionId.slice(0, 24)}…
            </a>
          </div>
        </div>

        {/* Items */}
        <div className="border border-[#2a2a2a]">
          <div className="px-4 py-3 border-b border-[#2a2a2a] text-xs font-bold uppercase tracking-widest text-[#f5f1e8]/40">
            Line Items
          </div>
          <div className="divide-y divide-[#2a2a2a]">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between px-4 py-3 text-sm">
                <span>
                  {item.name}{" "}
                  <span className="text-[#f5f1e8]/40">× {item.quantity}</span>
                </span>
                <span className="font-semibold">
                  {formatSek(item.priceOre * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-[#2a2a2a] divide-y divide-[#2a2a2a]">
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-[#f5f1e8]/50">Subtotal</span>
              <span>{formatSek(order.subtotalOre)}</span>
            </div>
            <div className="flex justify-between px-4 py-3 text-sm">
              <span className="text-[#f5f1e8]/50">Shipping</span>
              <span>{formatSek(order.shippingOre)}</span>
            </div>
            <div className="flex justify-between px-4 py-4 font-bold">
              <span>Total</span>
              <span className="text-[#ff6b1a]">{formatSek(order.totalOre)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        {shippingAddress && (
          <div className="border border-[#2a2a2a]">
            <div className="px-4 py-3 border-b border-[#2a2a2a] text-xs font-bold uppercase tracking-widest text-[#f5f1e8]/40">
              Shipping Address
            </div>
            <div className="px-4 py-3 text-sm text-[#f5f1e8]/70 space-y-0.5">
              {shippingAddress.line1 && <p>{shippingAddress.line1}</p>}
              {shippingAddress.line2 && <p>{shippingAddress.line2}</p>}
              <p>
                {shippingAddress.postal_code} {shippingAddress.city}
              </p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

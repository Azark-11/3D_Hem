import Link from "next/link";
import { db } from "@/lib/db";
import { Prisma } from "@prisma/client";
import { formatSek } from "@/lib/currency";
import { Badge } from "@/components/ui/badge";
import { OrderFilters } from "@/components/OrderFilters";

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  paid: "default",
  pending: "secondary",
  expired: "destructive",
  refunded: "outline",
};

interface SearchParams {
  status?: string;
  from?: string;
  to?: string;
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.OrderWhereInput = {};
  if (params.status) where.status = params.status;
  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: new Date(params.from) } : {}),
      ...(params.to ? { lte: new Date(params.to + "T23:59:59Z") } : {}),
    };
  }

  const orders = await db.order.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6" style={{ fontFamily: "var(--font-space-grotesk)" }}>
        Orders
      </h1>

      <OrderFilters activeStatus={params.status} />

      <div className="border border-[#2a2a2a] overflow-hidden mt-4">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium">Order</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium hidden sm:table-cell">Email</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium">Total</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium">Status</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium hidden md:table-cell">Date</th>
              <th className="text-right px-4 py-3 text-[#f5f1e8]/50 font-medium">View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-[#0f0f0f] transition-colors">
                <td className="px-4 py-3 font-mono text-xs text-[#f5f1e8]/70">
                  {order.id.slice(-8).toUpperCase()}
                </td>
                <td className="px-4 py-3 text-[#f5f1e8]/60 hidden sm:table-cell">
                  {order.email}
                </td>
                <td className="px-4 py-3 font-semibold text-[#ff6b1a]">
                  {formatSek(order.totalOre)}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={STATUS_COLORS[order.status] ?? "outline"}>
                    {order.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-[#f5f1e8]/40 text-xs hidden md:table-cell">
                  {order.createdAt.toLocaleDateString("sv-SE")}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-[#ff6b1a] hover:underline"
                  >
                    Details
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <div className="py-12 text-center text-[#f5f1e8]/30 text-sm">
            No orders found.
          </div>
        )}
      </div>
    </div>
  );
}

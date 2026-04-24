import Link from "next/link";
import { db } from "@/lib/db";
import { formatSek } from "@/lib/currency";
import { AdminStockToggle } from "@/components/AdminStockToggle";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>
          Products
        </h1>
        <Link
          href="/admin/products/new"
          className="px-4 py-2 bg-[#ff6b1a] text-[#0a0a0a] text-sm font-bold uppercase tracking-wide hover:bg-[#e55a0a] transition-colors"
        >
          + New Product
        </Link>
      </div>

      <div className="border border-[#2a2a2a] overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] bg-[#0f0f0f]">
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium">Name</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium hidden md:table-cell">Category</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium">Price</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium">Stock</th>
              <th className="text-left px-4 py-3 text-[#f5f1e8]/50 font-medium hidden sm:table-cell">Status</th>
              <th className="text-right px-4 py-3 text-[#f5f1e8]/50 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-[#0f0f0f] transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-[#f5f1e8]">{product.name}</p>
                  <p className="text-[#f5f1e8]/40 text-xs">{product.slug}</p>
                </td>
                <td className="px-4 py-3 hidden md:table-cell text-[#f5f1e8]/60 capitalize">
                  {product.category}
                </td>
                <td className="px-4 py-3 text-[#ff6b1a] font-semibold">
                  {formatSek(product.priceOre)}
                </td>
                <td className="px-4 py-3">
                  <AdminStockToggle productId={product.id} stock={product.stock} />
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  <div className="flex gap-1 flex-wrap">
                    {product.active ? (
                      <Badge variant="default">Active</Badge>
                    ) : (
                      <Badge variant="secondary">Inactive</Badge>
                    )}
                    {product.featured && <Badge variant="outline">Featured</Badge>}
                  </div>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/products/${product.id}/edit`}
                    className="text-xs text-[#ff6b1a] hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <div className="py-12 text-center text-[#f5f1e8]/30 text-sm">
            No products yet.{" "}
            <Link href="/admin/products/new" className="text-[#ff6b1a] hover:underline">
              Add one
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

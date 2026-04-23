"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AdminStockToggleProps {
  productId: string;
  stock: number;
}

export function AdminStockToggle({ productId, stock: initialStock }: AdminStockToggleProps) {
  const [stock, setStock] = useState(initialStock);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleBlur() {
    setSaving(true);
    try {
      await fetch(`/api/admin/products/${productId}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <input
      type="number"
      min={0}
      value={stock}
      onChange={(e) => setStock(parseInt(e.target.value, 10) || 0)}
      onBlur={handleBlur}
      className="w-16 h-7 px-2 text-sm border border-[#2a2a2a] bg-[#0a0a0a] text-[#f5f1e8] focus:border-[#ff6b1a] focus:outline-none transition-colors"
      disabled={saving}
    />
  );
}

"use client";

import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { cn } from "@/lib/utils";

interface CartButtonProps {
  onClick: () => void;
}

export function CartButton({ onClick }: CartButtonProps) {
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <button
      onClick={onClick}
      className="relative text-[#f5f1e8] hover:text-[#ff6b1a] transition-colors"
      aria-label="Kundvagn"
    >
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span
          className={cn(
            "absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center",
            "bg-[#ff6b1a] text-[#0a0a0a] text-[10px] font-bold"
          )}
        >
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </button>
  );
}

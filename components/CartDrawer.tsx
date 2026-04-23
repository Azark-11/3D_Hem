"use client";

import { useState } from "react";
import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/lib/cart-store";
import { formatSek } from "@/lib/currency";
import { getImageUrl } from "@/lib/images";
import { useToast } from "@/components/ui/toast";

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export function CartDrawer({ open, onClose }: CartDrawerProps) {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, subtotalOre } = useCartStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error ?? "Checkout failed");
      }

      const { url } = (await res.json()) as { url: string };
      window.location.href = url;
    } catch (err) {
      toast({
        title: t("error"),
        variant: "destructive",
        description: err instanceof Error ? err.message : t("error"),
      });
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent side="right" className="flex flex-col w-full max-w-sm">
        <SheetHeader>
          <SheetTitle>{t("title")}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <p className="text-[#f5f1e8]/50 text-sm">{t("empty")}</p>
          </div>
        ) : (
          <>
            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4 px-6 space-y-4">
              {items.map((item) => (
                <div key={item.productId} className="flex gap-3">
                  <div className="relative h-16 w-16 flex-shrink-0 border border-[#2a2a2a] overflow-hidden">
                    <Image
                      src={getImageUrl(item.image, 64)}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#f5f1e8] truncate">{item.name}</p>
                    <p className="text-sm text-[#ff6b1a] font-semibold">
                      {formatSek(item.priceOre)}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() =>
                          item.quantity > 1
                            ? updateQuantity(item.productId, item.quantity - 1)
                            : removeItem(item.productId)
                        }
                        className="h-6 w-6 flex items-center justify-center border border-[#2a2a2a] text-[#f5f1e8] hover:border-[#ff6b1a] hover:text-[#ff6b1a] transition-colors"
                        aria-label="Minska antal"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-4 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-6 w-6 flex items-center justify-center border border-[#2a2a2a] text-[#f5f1e8] hover:border-[#ff6b1a] hover:text-[#ff6b1a] transition-colors"
                        aria-label="Öka antal"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="ml-auto text-[#f5f1e8]/30 hover:text-red-400 transition-colors"
                        aria-label={t("remove")}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Summary */}
            <div className="px-6 py-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#f5f1e8]/70">{t("subtotal")}</span>
                <span className="font-semibold">{formatSek(subtotalOre())}</span>
              </div>
              <p className="text-xs text-[#f5f1e8]/40">{t("shipping")}</p>
              <p className="text-xs text-[#f5f1e8]/40">{t("vat")}</p>
              <Button
                className="w-full mt-2"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? t("loading") : t("checkout")}
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

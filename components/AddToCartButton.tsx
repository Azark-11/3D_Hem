"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/cart-store";
import { parseImages } from "@/lib/images";
import { useToast } from "@/components/ui/toast";

interface Product {
  id: string;
  slug: string;
  name: string;
  priceOre: number;
  images: string;
  stock: number;
}

interface AddToCartButtonProps {
  product: Product;
  disabled?: boolean;
}

export function AddToCartButton({ product, disabled }: AddToCartButtonProps) {
  const t = useTranslations("product");
  const { toast } = useToast();
  const addItem = useCartStore((s) => s.addItem);
  const [quantity, setQuantity] = useState(1);

  function decrement() {
    setQuantity((q) => Math.max(1, q - 1));
  }

  function increment() {
    setQuantity((q) => Math.min(product.stock, q + 1));
  }

  function handleAdd() {
    const images = parseImages(product.images);
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      priceOre: product.priceOre,
      image: images[0] ?? "/products/placeholder.jpg",
      quantity,
    });
    toast({
      title: product.name,
      description: t("add_to_cart"),
      variant: "success",
    });
    setQuantity(1);
  }

  if (disabled) {
    return (
      <Button disabled className="w-full" size="lg">
        {t("out_of_stock")}
      </Button>
    );
  }

  return (
    <div className="flex gap-3">
      {/* Quantity stepper */}
      <div className="flex items-center border border-[#2a2a2a]">
        <button
          onClick={decrement}
          disabled={quantity <= 1}
          className="h-12 w-10 flex items-center justify-center text-[#f5f1e8] hover:text-[#ff6b1a] disabled:opacity-30 transition-colors"
          aria-label="Minska antal"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="h-12 w-10 flex items-center justify-center text-sm font-semibold">
          {quantity}
        </span>
        <button
          onClick={increment}
          disabled={quantity >= product.stock}
          className="h-12 w-10 flex items-center justify-center text-[#f5f1e8] hover:text-[#ff6b1a] disabled:opacity-30 transition-colors"
          aria-label="Öka antal"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Add to cart */}
      <Button className="flex-1" size="lg" onClick={handleAdd}>
        <ShoppingBag className="h-4 w-4 mr-1" />
        {t("add_to_cart")}
      </Button>
    </div>
  );
}

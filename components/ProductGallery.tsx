"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getImageUrl } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [active, setActive] = useState(0);

  function prev() {
    setActive((i) => (i === 0 ? images.length - 1 : i - 1));
  }

  function next() {
    setActive((i) => (i === images.length - 1 ? 0 : i + 1));
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowLeft") prev();
    if (e.key === "ArrowRight") next();
  }

  const safeImages = images.length > 0 ? images : ["/products/placeholder.jpg"];

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative aspect-square border border-[#2a2a2a] overflow-hidden bg-[#0f0f0f] focus:outline-none"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        aria-label={`Produktbild av ${productName}`}
      >
        <Image
          src={getImageUrl(safeImages[active], 800)}
          alt={`${productName} – bild ${active + 1}`}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority={active === 0}
        />
        {safeImages.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-[#0a0a0a]/70 border border-[#2a2a2a] text-[#f5f1e8] hover:border-[#ff6b1a] hover:text-[#ff6b1a] transition-colors"
              aria-label="Föregående bild"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center bg-[#0a0a0a]/70 border border-[#2a2a2a] text-[#f5f1e8] hover:border-[#ff6b1a] hover:text-[#ff6b1a] transition-colors"
              aria-label="Nästa bild"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto">
          {safeImages.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={cn(
                "relative h-16 w-16 flex-shrink-0 border overflow-hidden transition-colors",
                i === active ? "border-[#ff6b1a]" : "border-[#2a2a2a] hover:border-[#f5f1e8]/40"
              )}
              aria-label={`Visa bild ${i + 1}`}
            >
              <Image
                src={getImageUrl(img, 128)}
                alt={`${productName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

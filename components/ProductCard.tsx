import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { formatSek } from "@/lib/currency";
import { getImageUrl, parseImages } from "@/lib/images";

interface Product {
  id: string;
  slug: string;
  name: string;
  priceOre: number;
  images: string;
  category: string;
  stock: number;
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const t = useTranslations("product");
  const images = parseImages(product.images);
  const firstImage = images[0] ?? "/products/placeholder.jpg";
  const outOfStock = product.stock === 0;

  return (
    <Link href={`/produkter/${product.slug}`} className="group block">
      <div className="card-hover border border-[#2a2a2a] bg-[#0f0f0f] overflow-hidden">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={getImageUrl(firstImage, 600)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {outOfStock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-xs font-bold uppercase tracking-widest text-[#f5f1e8]/70 border border-[#f5f1e8]/30 px-3 py-1">
                {t("out_of_stock")}
              </span>
            </div>
          )}
          {product.featured && !outOfStock && (
            <div className="absolute top-2 left-2">
              <Badge>Utvalda</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-xs uppercase tracking-widest text-[#f5f1e8]/40 mb-1">
            {product.category}
          </p>
          <h3 className="font-semibold text-[#f5f1e8] text-sm leading-tight mb-2 group-hover:text-[#ff6b1a] transition-colors">
            {product.name}
          </h3>
          <p className="text-[#ff6b1a] font-bold">{formatSek(product.priceOre)}</p>
        </div>
      </div>
    </Link>
  );
}

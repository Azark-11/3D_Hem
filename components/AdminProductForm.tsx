"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormSchema, type ProductFormValues } from "@/lib/validations";
import { slugify } from "@/lib/slugify";
import { formatSek } from "@/lib/currency";
import ReactMarkdown from "react-markdown";

interface AdminProductFormProps {
  productId?: string;
  defaultValues?: Partial<ProductFormValues>;
}

export function AdminProductForm({ productId, defaultValues }: AdminProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMd, setPreviewMd] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(ProductFormSchema) as unknown as Resolver<ProductFormValues>,
    defaultValues: {
      name: "",
      nameEn: "",
      slug: "",
      description: "",
      descriptionEn: "",
      priceOre: 9900,
      category: "figurer",
      stock: 0,
      material: "PLA",
      dimensionsMm: "",
      weightGrams: undefined,
      featured: false,
      active: true,
      images: ["/products/placeholder.jpg"],
      ...defaultValues,
    },
  });

  const name = watch("name");
  const description = watch("description");
  const priceOre = watch("priceOre");
  const images = watch("images");

  // eslint-disable-next-line react-hooks/incompatible-library
  function handleNameBlur() {
    if (!productId) {
      // Auto-generate slug only on new products
      const currentSlug = watch("slug");
      if (!currentSlug) {
        setValue("slug", slugify(name));
      }
    }
  }

  async function onSubmit(data: ProductFormValues) {
    setLoading(true);
    setError(null);

    try {
      const url = productId
        ? `/api/admin/products/${productId}`
        : "/api/admin/products";
      const method = productId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = (await res.json()) as { error?: string };
        throw new Error(body.error ?? "Failed to save product");
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
      {/* Name */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Name (Swedish) *</Label>
          <Input
            id="name"
            {...register("name")}
            onBlur={handleNameBlur}
            placeholder="Produktnamn på svenska"
          />
          {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nameEn">Name (English)</Label>
          <Input id="nameEn" {...register("nameEn")} placeholder="Product name in English" />
        </div>
      </div>

      {/* Slug */}
      <div className="space-y-1.5">
        <Label htmlFor="slug">Slug *</Label>
        <Input
          id="slug"
          {...register("slug")}
          placeholder="auto-generated-from-name"
          className="font-mono text-sm"
        />
        {errors.slug && <p className="text-xs text-red-400">{errors.slug.message}</p>}
      </div>

      {/* Price */}
      <div className="space-y-1.5">
        <Label htmlFor="priceOre">Price (öre) * — {formatSek(priceOre || 0)}</Label>
        <Input
          id="priceOre"
          type="number"
          min={100}
          step={100}
          {...register("priceOre", { valueAsNumber: true })}
          placeholder="24900"
        />
        <p className="text-xs text-[#f5f1e8]/40">Enter in öre: 24900 = 249 kr</p>
        {errors.priceOre && <p className="text-xs text-red-400">{errors.priceOre.message}</p>}
      </div>

      {/* Category + Stock */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>Category *</Label>
          <Select
            defaultValue={defaultValues?.category ?? "figurer"}
            onValueChange={(v) => setValue("category", v as ProductFormValues["category"])}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="figurer">Figurer</SelectItem>
              <SelectItem value="lampor">Lampor</SelectItem>
              <SelectItem value="funktionellt">Funktionellt</SelectItem>
              <SelectItem value="ovrigt">Övrigt</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Stock *</Label>
          <Input
            id="stock"
            type="number"
            min={0}
            {...register("stock", { valueAsNumber: true })}
          />
          {errors.stock && <p className="text-xs text-red-400">{errors.stock.message}</p>}
        </div>
      </div>

      {/* Material + Dimensions + Weight */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="material">Material *</Label>
          <Input id="material" {...register("material")} placeholder="PLA" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="dimensionsMm">Dimensions *</Label>
          <Input id="dimensionsMm" {...register("dimensionsMm")} placeholder="120 × 80 × 45 mm" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="weightGrams">Weight (g)</Label>
          <Input
            id="weightGrams"
            type="number"
            min={1}
            {...register("weightGrams", { valueAsNumber: true })}
          />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <Label htmlFor="description">Description (Swedish, Markdown) *</Label>
          <button
            type="button"
            onClick={() => setPreviewMd((v) => !v)}
            className="text-xs text-[#ff6b1a] hover:underline"
          >
            {previewMd ? "Edit" : "Preview"}
          </button>
        </div>
        {previewMd ? (
          <div className="min-h-[150px] border border-[#2a2a2a] p-3 prose prose-sm prose-invert max-w-none">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ) : (
          <Textarea
            id="description"
            {...register("description")}
            rows={6}
            placeholder="**Produktbeskrivning** på svenska med markdown-stöd..."
          />
        )}
        {errors.description && <p className="text-xs text-red-400">{errors.description.message}</p>}
      </div>

      {/* Description EN */}
      <div className="space-y-1.5">
        <Label htmlFor="descriptionEn">Description (English, optional)</Label>
        <Textarea
          id="descriptionEn"
          {...register("descriptionEn")}
          rows={4}
          placeholder="Optional English description..."
        />
      </div>

      {/* Images */}
      <div className="space-y-1.5">
        <Label>Images (URLs, one per line) *</Label>
        <Textarea
          value={images.join("\n")}
          onChange={(e) => setValue("images", e.target.value.split("\n").filter(Boolean))}
          rows={3}
          placeholder="/products/my-product-1.jpg&#10;/products/my-product-2.jpg"
          className="font-mono text-sm"
        />
        <p className="text-xs text-[#f5f1e8]/40">
          In dev: paths relative to /public. In production: Cloudinary public_ids.
        </p>
        {errors.images && <p className="text-xs text-red-400">{errors.images.message}</p>}
      </div>

      {/* Toggles */}
      <div className="flex gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("active")} className="accent-[#ff6b1a]" />
          <span className="text-sm">Active (visible in shop)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" {...register("featured")} className="accent-[#ff6b1a]" />
          <span className="text-sm">Featured (homepage)</span>
        </label>
      </div>

      {error && (
        <div className="border border-red-600 p-3 text-sm text-red-400">{error}</div>
      )}

      <div className="flex gap-3">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving…" : productId ? "Save Changes" : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => router.push("/admin")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

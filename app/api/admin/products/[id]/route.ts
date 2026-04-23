import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductFormSchema } from "@/lib/validations";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: unknown = await request.json();
  const parsed = ProductFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Check slug uniqueness (excluding current product)
  const existing = await db.product.findFirst({
    where: { slug: data.slug, id: { not: id } },
  });
  if (existing) {
    return NextResponse.json({ error: "Slug already in use" }, { status: 409 });
  }

  const product = await db.product.update({
    where: { id },
    data: {
      ...data,
      images: JSON.stringify(data.images),
      weightGrams: data.weightGrams ?? null,
      nameEn: data.nameEn ?? null,
      descriptionEn: data.descriptionEn ?? null,
    },
  });

  return NextResponse.json(product);
}

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductFormSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: unknown = await request.json();
  const parsed = ProductFormSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation error", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = parsed.data;

  // Ensure slug uniqueness
  const existing = await db.product.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const product = await db.product.create({
    data: {
      ...data,
      images: JSON.stringify(data.images),
      weightGrams: data.weightGrams ?? null,
      nameEn: data.nameEn ?? null,
      descriptionEn: data.descriptionEn ?? null,
    },
  });

  return NextResponse.json(product, { status: 201 });
}

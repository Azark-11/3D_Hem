import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const StockSchema = z.object({ stock: z.number().int().min(0) });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body: unknown = await request.json();
  const parsed = StockSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid stock value" }, { status: 400 });
  }

  const product = await db.product.update({
    where: { id },
    data: { stock: parsed.data.stock },
  });

  return NextResponse.json({ id: product.id, stock: product.stock });
}

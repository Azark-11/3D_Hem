import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { CheckoutRequestSchema } from "@/lib/validations";
import { parseImages } from "@/lib/images";

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const parsed = CheckoutRequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ogiltig förfrågan", code: "INVALID_REQUEST" },
        { status: 400 }
      );
    }

    const { items } = parsed.data;

    // Always re-fetch prices and stock from DB — never trust client
    const productIds = items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, active: true },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    // Validate each item
    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Produkt hittades inte: ${item.productId}`, code: "PRODUCT_NOT_FOUND" },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Slut i lager: ${product.name}`, code: "OUT_OF_STOCK" },
          { status: 400 }
        );
      }
    }

    const shippingOre = parseInt(process.env.SHIPPING_FLAT_ORE ?? "4900", 10);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    // Build line items from DB data
    const lineItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const images = parseImages(product.images);
      const imageUrls = images
        .filter((img) => img.startsWith("https://"))
        .slice(0, 1);

      return {
        price_data: {
          currency: "sek",
          unit_amount: product.priceOre,
          product_data: {
            name: product.name,
            ...(imageUrls.length > 0 ? { images: imageUrls } : {}),
          },
        },
        quantity: item.quantity,
      };
    });

    // Create a pending order first
    const subtotalOre = items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + product.priceOre * item.quantity;
    }, 0);

    const order = await db.order.create({
      data: {
        stripeSessionId: `pending_${Date.now()}`,
        email: "pending",
        items: JSON.stringify(
          items.map((item) => {
            const product = productMap.get(item.productId)!;
            return {
              productId: product.id,
              name: product.name,
              priceOre: product.priceOre,
              quantity: item.quantity,
            };
          })
        ),
        subtotalOre,
        shippingOre,
        totalOre: subtotalOre + shippingOre,
        status: "pending",
      },
    });

    // Session config
    // Payment methods ordered: card, swish, klarna (legal requirement: direct methods before BNPL)
    const paymentMethodConfig = process.env.STRIPE_PAYMENT_METHOD_CONFIGURATION;

    const sessionParams: Parameters<typeof stripe.checkout.sessions.create>[0] = {
      mode: "payment",
      currency: "sek",
      locale: "sv",
      line_items: lineItems,
      shipping_address_collection: { allowed_countries: ["SE"] },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: { amount: shippingOre, currency: "sek" },
            display_name: "PostNord – Standardleverans",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 2 },
              maximum: { unit: "business_day", value: 5 },
            },
          },
        },
      ],
      automatic_tax: { enabled: false },
      metadata: { internalOrderId: order.id },
      success_url: `${siteUrl}/tack?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/butik`,
    };

    if (paymentMethodConfig) {
      sessionParams.payment_method_configuration = paymentMethodConfig;
    } else {
      // Hardcoded order: direct payment methods before BNPL (Swedish law, 1 July 2020)
      (sessionParams as Record<string, unknown>).payment_method_types = ["card", "swish", "klarna"];
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Update order with real Stripe session ID
    await db.order.update({
      where: { id: order.id },
      data: { stripeSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[checkout] Error:", err);
    return NextResponse.json(
      { error: "Intern serverfel", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}

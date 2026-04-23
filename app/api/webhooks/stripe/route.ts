import { NextResponse } from "next/server";
import { headers } from "next/headers";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("[webhook] STRIPE_WEBHOOK_SECRET not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error("[webhook] Signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSessionCompleted(session);
        break;
      }
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleSessionExpired(session);
        break;
      }
      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        await handleChargeRefunded(charge);
        break;
      }
      default:
        // Ignore unhandled events
        break;
    }
  } catch (err) {
    console.error(`[webhook] Error handling ${event.type}:`, err);
    // Still return 200 to prevent Stripe from retrying
  }

  return NextResponse.json({ received: true });
}

async function handleSessionCompleted(session: Stripe.Checkout.Session) {
  const order = await db.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!order) {
    console.error(`[webhook] Order not found for session: ${session.id}`);
    return;
  }

  // Idempotency: skip if already processed
  if (order.status !== "pending") {
    console.log(`[webhook] Order ${order.id} already processed, skipping`);
    return;
  }

  // Parse items for stock decrement
  const items = JSON.parse(order.items) as Array<{
    productId: string;
    quantity: number;
    name: string;
    priceOre: number;
  }>;

  // Determine payment method
  let paymentMethod: string | null = null;
  if (session.payment_method_types && session.payment_method_types.length > 0) {
    paymentMethod = session.payment_method_types[0];
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const sessionAny = session as any;
  const shippingAddress = sessionAny.shipping_details?.address
    ? JSON.stringify(sessionAny.shipping_details.address)
    : null;

  // Atomic: update order + decrement stock in one transaction
  await db.$transaction(async (tx) => {
    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        email: session.customer_details?.email ?? "unknown",
        paymentMethod,
        shippingAddress,
        totalOre: session.amount_total ?? order.totalOre,
      },
    });

    for (const item of items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  });

  console.log(`[webhook] Order ${order.id} marked paid, stock decremented`);
}

async function handleSessionExpired(session: Stripe.Checkout.Session) {
  const order = await db.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!order || order.status !== "pending") return;

  await db.order.update({
    where: { id: order.id },
    data: { status: "expired" },
  });

  console.log(`[webhook] Order ${order.id} marked expired (session expired)`);
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  if (!charge.payment_intent) return;

  // Find the session by payment_intent
  const sessions = await stripe.checkout.sessions.list({
    payment_intent: charge.payment_intent as string,
    limit: 1,
  });

  const session = sessions.data[0];
  if (!session) return;

  const order = await db.order.findUnique({
    where: { stripeSessionId: session.id },
  });

  if (!order) return;

  await db.order.update({
    where: { id: order.id },
    data: { status: "refunded" },
  });

  console.log(`[webhook] Order ${order.id} marked refunded`);
}

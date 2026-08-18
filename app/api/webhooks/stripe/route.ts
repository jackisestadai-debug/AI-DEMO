import { NextRequest, NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";
import { createCJOrder, isCJConfigured } from "@/lib/cjdropshipping";
import { getProductBySlug } from "@/lib/products";

interface StoredOrder {
  id: string;
  customer_name: string;
  customer_email: string;
  address: string;
  postal_code: string;
  city: string;
  phone: string | null;
  items: { slug: string; name: string; price: number; quantity: number }[];
}

// Order creation with the supplier only ever happens from here, after Stripe
// confirms real payment — never from /api/checkout directly. CJdropshipping
// orders spend real money out of the store's prepaid CJ wallet, so pushing
// one for an unconfirmed or test transaction would be a real financial mistake.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!process.env.STRIPE_SECRET_KEY || !webhookSecret || !signature) {
    return NextResponse.json({ error: "Stripe webhook not configured." }, { status: 400 });
  }

  const Stripe = (await import("stripe")).default;
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const rawBody = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    console.error("[stripe webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as { id: string };
  const supabase = getSupabaseAdmin();
  if (!supabase) {
    console.error("[stripe webhook] Supabase not configured, cannot mark order paid");
    return NextResponse.json({ received: true });
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("*")
    .eq("stripe_session_id", session.id)
    .single();

  if (error || !order) {
    console.error("[stripe webhook] no matching order for session", session.id, error);
    return NextResponse.json({ received: true });
  }

  await supabase.from("orders").update({ status: "paid" }).eq("id", order.id);
  await fulfillOrder(order as StoredOrder);

  return NextResponse.json({ received: true });
}

async function fulfillOrder(order: StoredOrder) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return;

  if (!isCJConfigured()) {
    await supabase
      .from("orders")
      .update({ status: "paid_awaiting_manual_fulfillment" })
      .eq("id", order.id);
    return;
  }

  const lines = order.items.map((item) => {
    const product = getProductBySlug(item.slug);
    return product?.cjVariantId
      ? { cjVariantId: product.cjVariantId, quantity: item.quantity }
      : null;
  });

  if (lines.some((line) => line === null)) {
    console.error(
      "[fulfillment] order",
      order.id,
      "has a product without a mapped cjVariantId — placing it on CJ manually is required"
    );
    await supabase.from("orders").update({ status: "awaiting_supplier_mapping" }).eq("id", order.id);
    return;
  }

  try {
    const cjOrder = await createCJOrder(
      order.id,
      {
        name: order.customer_name,
        countryCode: "SE",
        province: order.city,
        city: order.city,
        address: order.address,
        zip: order.postal_code,
        phone: order.phone || "",
        email: order.customer_email,
      },
      lines as { cjVariantId: string; quantity: number }[]
    );

    await supabase
      .from("orders")
      .update({ status: "sent_to_supplier", cj_order_id: cjOrder?.orderId ?? null })
      .eq("id", order.id);
  } catch (err) {
    console.error("[fulfillment] CJ order push failed for order", order.id, err);
    await supabase.from("orders").update({ status: "supplier_push_failed" }).eq("id", order.id);
  }
}

import { NextRequest, NextResponse } from "next/server";
import { products, type Product } from "@/lib/products";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

interface CartItem {
  slug: string;
  quantity: number;
}

interface Customer {
  name: string;
  email: string;
  address: string;
  postalCode: string;
  city: string;
}

interface LineItem {
  product: Product;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    const { items, customer } = (await req.json()) as {
      items: CartItem[];
      customer: Customer;
    };

    if (!items?.length) {
      return NextResponse.json({ error: "Varukorgen är tom." }, { status: 400 });
    }
    if (!customer?.name || !customer?.email || !customer?.address) {
      return NextResponse.json({ error: "Fyll i alla fält." }, { status: 400 });
    }

    const lineItems: LineItem[] = items
      .map((item) => {
        const product = products.find((p) => p.slug === item.slug);
        return product ? { product, quantity: item.quantity } : null;
      })
      .filter((i): i is LineItem => i !== null);

    if (!lineItems.length) {
      return NextResponse.json({ error: "Varukorgen är tom." }, { status: 400 });
    }

    const total = lineItems.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

    // Real payment only kicks in once STRIPE_SECRET_KEY is set — until then we
    // fall through to test mode below so nothing blocks development.
    if (process.env.STRIPE_SECRET_KEY) {
      const Stripe = (await import("stripe")).default;
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || req.nextUrl.origin;

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        customer_email: customer.email,
        line_items: lineItems.map((i) => ({
          quantity: i.quantity,
          price_data: {
            currency: "sek",
            unit_amount: i.product.price * 100,
            product_data: { name: i.product.name },
          },
        })),
        success_url: `${siteUrl}/order-bekraftad?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/checkout`,
      });

      await saveOrder(lineItems, customer, total, "pending_payment", session.id);

      return NextResponse.json({ checkoutUrl: session.url });
    }

    const orderId = await saveOrder(lineItems, customer, total, "test_order_no_payment");

    return NextResponse.json({ orderId: orderId ?? "test" });
  } catch (err) {
    console.error("[checkout] error:", err);
    return NextResponse.json({ error: "Kunde inte skapa order." }, { status: 500 });
  }
}

async function saveOrder(
  lineItems: LineItem[],
  customer: Customer,
  total: number,
  status: string,
  stripeSessionId?: string
) {
  const supabase = getSupabaseAdmin();
  if (!supabase) return undefined;

  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_name: customer.name,
      customer_email: customer.email,
      address: customer.address,
      postal_code: customer.postalCode,
      city: customer.city,
      total_sek: total,
      status,
      stripe_session_id: stripeSessionId,
      items: lineItems.map((i) => ({
        slug: i.product.slug,
        name: i.product.name,
        price: i.product.price,
        quantity: i.quantity,
      })),
    })
    .select("id")
    .single();

  if (error) {
    console.error("[checkout] failed to save order:", error);
    return undefined;
  }
  return data?.id as string | undefined;
}

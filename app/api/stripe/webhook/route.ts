import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";
import { createServiceClient } from "@/lib/supabase/server";
import type Stripe from "stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const supabase = await createServiceClient();

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.supabase_user_id;
      const plan = session.metadata?.plan as "pro" | "premium";
      const referralCode = session.metadata?.referral_code;

      if (!userId || !plan) break;

      const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

      await supabase.from("subscriptions").upsert({
        id: subscription.id,
        user_id: userId,
        status: subscription.status,
        plan,
        stripe_customer_id: session.customer as string,
        stripe_price_id: subscription.items.data[0]?.price.id,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
      });

      // 紹介コード処理
      if (referralCode) {
        const { data: referrer } = await supabase
          .from("profiles")
          .select("id")
          .eq("referral_code", referralCode)
          .single();

        if (referrer) {
          await supabase.from("referrals").upsert({
            referrer_id: referrer.id,
            referred_id: userId,
            referral_code: referralCode,
            redeemed_at: new Date().toISOString(),
          });
        }
      }

      // Free サブスクを削除
      await supabase.from("subscriptions").delete().eq("id", `free_${userId}`);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const userId = subscription.metadata?.supabase_user_id;
      if (!userId) break;

      await supabase.from("subscriptions").update({
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end,
        updated_at: new Date().toISOString(),
      }).eq("id", subscription.id);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      await supabase.from("subscriptions").update({
        status: "canceled",
        plan: "free",
        updated_at: new Date().toISOString(),
      }).eq("id", subscription.id);
      break;
    }
  }

  return NextResponse.json({ received: true });
}

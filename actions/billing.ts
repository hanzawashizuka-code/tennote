"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { stripe } from "@/lib/stripe/client";
import { PLANS, type PlanKey } from "@/lib/stripe/config";

export async function validateReferralCode(code: string) {
  const supabase = await createClient();
  const { data } = await (supabase as any)
    .from("profiles")
    .select("id, display_name")
    .eq("referral_code", code.trim().toUpperCase())
    .single();

  if (!data) return { valid: false };
  return { valid: true, referrerName: (data as any).display_name ?? "ユーザー" };
}

export async function createCheckoutSession(plan: PlanKey, referralCode?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const planConfig = PLANS[plan];
  if (!planConfig.priceId) return { error: "無効なプランです" };

  // 既存のStripe CustomerIDを取得
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let customerId = sub?.stripe_customer_id ?? undefined;

  if (!customerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { supabase_user_id: user.id },
    });
    customerId = customer.id;
  }

  // 紹介コード割引クーポン
  const discounts: { coupon?: string }[] = [];
  if (referralCode) {
    const { valid } = await validateReferralCode(referralCode);
    if (valid) {
      const coupon = await stripe.coupons.create({
        percent_off: 10,
        duration: "once",
        name: "紹介コード割引",
        metadata: { referral_code: referralCode },
      });
      discounts.push({ coupon: coupon.id });
    }
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    line_items: [{ price: planConfig.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    metadata: {
      supabase_user_id: user.id,
      plan,
      referral_code: referralCode ?? "",
    },
    ...(discounts.length > 0 ? { discounts } : {}),
  });

  if (!session.url) return { error: "チェックアウトセッションの作成に失敗しました" };

  redirect(session.url);
}

export async function createPortalSession() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  if (!sub?.stripe_customer_id) return { error: "サブスクリプションが見つかりません" };

  const session = await stripe.billingPortal.sessions.create({
    customer: sub.stripe_customer_id,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
  });

  redirect(session.url);
}

export async function createEventCheckout(eventId: string, priceId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/events/${eventId}?entry=success`,
      cancel_url: `${appUrl}/events/${eventId}`,
      metadata: { event_id: eventId, user_id: user.id },
    });
    return { url: session.url };
  } catch (err: any) {
    return { error: err.message };
  }
}

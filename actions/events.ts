"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export async function searchEvents({
  query,
  type,
  skillLevel,
}: {
  query?: string;
  type?: "tournament" | "practice" | "clinic";
  skillLevel?: string;
}) {
  const supabase = await createClient();

  let q = supabase
    .from("events")
    .select("*")
    .gte("starts_at", new Date().toISOString())
    .order("starts_at", { ascending: true });

  if (query) q = q.ilike("title", `%${query}%`);
  if (type) q = q.eq("event_type", type);
  if (skillLevel) q = q.contains("skill_levels", [skillLevel]);

  const { data, error } = await q.limit(50);
  if (error) return { error: error.message, data: null };
  return { data, error: null };
}

export async function enterEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  // 既にエントリー済みか確認
  const { data: existing } = await supabase
    .from("event_entries")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single();

  if (existing) return { error: "既にエントリー済みです" };

  const { data: event } = await supabase
    .from("events")
    .select("entry_fee_jpy, stripe_price_id")
    .eq("id", eventId)
    .single();

  if (!event) return { error: "イベントが見つかりません" };

  // 有料イベントは Stripe チェックアウトへ
  if (event.entry_fee_jpy > 0 && event.stripe_price_id) {
    return { requiresPayment: true, priceId: event.stripe_price_id };
  }

  const { error } = await supabase
    .from("event_entries")
    .insert({ event_id: eventId, user_id: user.id });

  if (error) return { error: error.message };

  revalidatePath(`/events/${eventId}`);
  return { success: true };
}

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const event_type = formData.get("event_type") as string;
  const location = formData.get("location") as string;
  const starts_at = formData.get("starts_at") as string;
  const ends_at = formData.get("ends_at") as string;
  const max_participants = Number(formData.get("max_participants") ?? 16);
  const entry_fee_jpy = Number(formData.get("entry_fee_jpy") ?? 0);
  const skill_levels = (formData.get("skill_levels") as string ?? "").split(",").map(s => s.trim()).filter(Boolean);
  const court_surface = formData.get("court_surface") as string | null;

  if (!title || !event_type || !location || !starts_at) {
    return { error: "必須項目を入力してください" };
  }

  const { data, error } = await supabase
    .from("events")
    .insert({
      organizer_id: user.id,
      title,
      description,
      event_type,
      location,
      starts_at,
      ends_at: ends_at || null,
      max_participants,
      entry_fee_jpy,
      skill_levels,
      court_surface: court_surface || null,
    })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/events");
  redirect(`/events/${data.id}`);
}

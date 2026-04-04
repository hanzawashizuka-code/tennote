"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function sendMatchRequest(toUserId: string, message?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };
  if (user.id === toUserId) return { error: "自分自身には申請できません" };

  const { error } = await supabase
    .from("match_requests")
    .insert({ from_user_id: user.id, to_user_id: toUserId, message });

  if (error) {
    if (error.code === "23505") return { error: "既にリクエスト送信済みです" };
    return { error: error.message };
  }

  // Fetch sender profile to personalise the notification
  const { data: senderProfile } = await supabase
    .from("profiles")
    .select("display_name, username")
    .eq("user_id", user.id)
    .single();

  await (supabase as any)
    .from("notifications")
    .insert({
      user_id: toUserId,
      type: "match_request",
      title: "マッチングリクエストが届きました",
      body: `${(senderProfile as any)?.display_name ?? (senderProfile as any)?.username ?? "ユーザー"} さんからリクエストが届いています`,
      link: "/matching",
    });

  revalidatePath("/matching");
  return { success: true };
}

export async function respondMatchRequest(requestId: string, status: "accepted" | "declined") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  // Fetch the request before updating so we know the requester's user_id
  const { data: request } = await (supabase as any)
    .from("match_requests")
    .select("from_user_id")
    .eq("id", requestId)
    .eq("to_user_id", user.id)
    .single();

  const { error } = await supabase
    .from("match_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId)
    .eq("to_user_id", user.id);

  if (error) return { error: error.message };

  if (status === "accepted" && request) {
    // notify the requester
    await (supabase as any)
      .from("notifications")
      .insert({
        user_id: request.from_user_id,
        type: "match_accepted",
        title: "マッチングリクエストが承認されました！",
        body: "相手からマッチングが承認されました。メッセージを送ってみましょう！",
        link: "/matching",
      });
  }

  revalidatePath("/matching");
  return { success: true };
}

export async function updateMatchProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const lookingFor = formData.getAll("looking_for") as string[];
  const preferredDays = formData.getAll("preferred_days") as string[];

  const data = {
    user_id: user.id,
    looking_for: lookingFor,
    preferred_days: preferredDays,
    preferred_time: formData.get("preferred_time") as string,
    preferred_area: formData.get("preferred_area") as string,
    gender: formData.get("gender") as string,
    message: formData.get("message") as string,
    is_visible: true,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("match_profiles")
    .upsert(data, { onConflict: "user_id" });

  if (error) return { error: error.message };

  revalidatePath("/matching");
  return { success: true };
}

export async function getMatchProfiles({
  skillLevel,
  lookingFor,
  area,
}: {
  skillLevel?: string;
  lookingFor?: string;
  area?: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "未認証です" };

  let q = supabase
    .from("match_profiles")
    .select(`
      *,
      profiles!inner(display_name, username, avatar_url, skill_level)
    `)
    .eq("is_visible", true)
    .neq("user_id", user.id)
    .limit(30);

  if (lookingFor) q = q.contains("looking_for", [lookingFor]);
  if (area) q = q.ilike("preferred_area", `%${area}%`);

  const { data, error } = await q;
  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

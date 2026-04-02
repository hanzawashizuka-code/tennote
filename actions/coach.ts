"use server";

import { createClient } from "@/lib/supabase/server";
import type { ChatMessage } from "@/types/coach";

export async function saveCoachSession(messages: ChatMessage[], sessionId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const title = messages[0]?.content.slice(0, 40) ?? "新しいセッション";

  if (sessionId) {
    const { error } = await supabase
      .from("coach_sessions")
      .update({ messages: messages as unknown as import("@/types/database").Json, updated_at: new Date().toISOString() })
      .eq("id", sessionId)
      .eq("user_id", user.id);
    return error ? { error: error.message } : { success: true };
  }

  const { data, error } = await supabase
    .from("coach_sessions")
    .insert({ user_id: user.id, messages: messages as unknown as import("@/types/database").Json, title })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { success: true, sessionId: data.id };
}

export async function getDailyMessageCount(userId: string): Promise<number> {
  const supabase = await createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data } = await supabase
    .from("coach_sessions")
    .select("messages")
    .eq("user_id", userId)
    .gte("created_at", today.toISOString());

  if (!data) return 0;

  return data.reduce((total, session) => {
    const msgs = session.messages as ChatMessage[];
    return total + msgs.filter((m) => m.role === "user").length;
  }, 0);
}

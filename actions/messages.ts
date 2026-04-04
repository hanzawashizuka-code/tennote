"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function startConversation(otherUserId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  // Make sure participant1 < participant2 (unique constraint)
  const [p1, p2] = [user.id, otherUserId].sort();

  // Check if conversation already exists
  const { data: existing } = await (supabase as any)
    .from("conversations")
    .select("id")
    .eq("participant1", p1)
    .eq("participant2", p2)
    .single();

  if (existing) {
    redirect(`/messages/${existing.id}`);
  }

  // Create new conversation
  const { data: conv, error } = await (supabase as any)
    .from("conversations")
    .insert({ participant1: p1, participant2: p2 })
    .select("id")
    .single();

  if (error) return { error: error.message };
  redirect(`/messages/${conv.id}`);
}

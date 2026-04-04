"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getNotifications() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: [], unreadCount: 0 };

  const { data } = await (supabase as any)
    .from("notifications")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  const unreadCount = (data ?? []).filter((n: any) => !n.is_read).length;
  return { data: data ?? [], unreadCount };
}

export async function markAllRead() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as any)
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", user.id)
    .eq("is_read", false);

  revalidatePath("/notifications");
}

export async function markRead(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await (supabase as any)
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id)
    .eq("user_id", user.id);
}

// Helper to create a notification (called from other server actions)
export async function createNotification({
  userId, type, title, body, link
}: {
  userId: string;
  type: string;
  title: string;
  body?: string;
  link?: string;
}) {
  const supabase = await createClient();
  await (supabase as any)
    .from("notifications")
    .insert({ user_id: userId, type, title, body, link });
}

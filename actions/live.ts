"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface LivestreamRow {
  id: string;
  host_id: string;
  title: string;
  description: string | null;
  status: "waiting" | "live" | "ended";
  viewer_count: number;
  started_at: string | null;
  ended_at: string | null;
  created_at: string;
  // joined from profiles
  host_name?: string;
  host_avatar?: string;
}

export async function createStream(title: string, description?: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "ログインが必要です" };

  const { data, error } = await (supabase as any)
    .from("livestreams")
    .insert({
      host_id: user.id,
      title: title.trim(),
      description: description?.trim() || null,
      status: "waiting",
    })
    .select("id")
    .single();

  if (error) return { error: error.message };
  revalidatePath("/live");
  return { data: data as { id: string } };
}

export async function goLive(streamId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "ログインが必要です" };

  const { error } = await (supabase as any)
    .from("livestreams")
    .update({ status: "live", started_at: new Date().toISOString() })
    .eq("id", streamId)
    .eq("host_id", user.id);

  if (error) return { error: error.message };
  revalidatePath(`/live/${streamId}`);
  return { data: true };
}

export async function endStream(streamId: string) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "ログインが必要です" };

  const { error } = await (supabase as any)
    .from("livestreams")
    .update({ status: "ended", ended_at: new Date().toISOString() })
    .eq("id", streamId)
    .eq("host_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/live");
  revalidatePath(`/live/${streamId}`);
  return { data: true };
}

export async function listStreams(): Promise<{ data?: LivestreamRow[]; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("livestreams")
    .select(`
      *,
      profiles!host_id (
        display_name,
        avatar_url
      )
    `)
    .in("status", ["waiting", "live"])
    .order("status", { ascending: false }) // 'live' before 'waiting'
    .order("created_at", { ascending: false })
    .limit(30);

  if (error) return { error: error.message };

  const rows: LivestreamRow[] = (data ?? []).map((r: any) => ({
    ...r,
    host_name: r.profiles?.display_name ?? "Unknown",
    host_avatar: r.profiles?.avatar_url ?? null,
  }));

  return { data: rows };
}

export async function getStream(streamId: string): Promise<{ data?: LivestreamRow; error?: string }> {
  const supabase = await createClient();

  const { data, error } = await (supabase as any)
    .from("livestreams")
    .select(`
      *,
      profiles!host_id (
        display_name,
        avatar_url
      )
    `)
    .eq("id", streamId)
    .single();

  if (error) return { error: error.message };

  const row: LivestreamRow = {
    ...data,
    host_name: data.profiles?.display_name ?? "Unknown",
    host_avatar: data.profiles?.avatar_url ?? null,
  };

  return { data: row };
}

export async function getMyActiveStream(): Promise<{ data?: LivestreamRow | null; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null };

  const { data, error } = await (supabase as any)
    .from("livestreams")
    .select("*")
    .eq("host_id", user.id)
    .in("status", ["waiting", "live"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) return { error: error.message };
  return { data };
}

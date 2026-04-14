"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface TrainingLogInput {
  category: "technical" | "physical" | "match" | "mental";
  title: string;
  duration_min?: number;
  intensity?: number;
  notes?: string;
  score_serve?: number;
  score_forehand?: number;
  score_backhand?: number;
  score_volley?: number;
  score_footwork?: number;
  score_physical?: number;
  score_mental?: number;
}

export async function createTrainingLog(input: TrainingLogInput) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const { error } = await (supabase as any)
    .from("training_logs")
    .insert({ ...input, user_id: user.id });

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { success: true };
}

export async function getTrainingLogs(limit = 30) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: "未認証です" };

  const { data, error } = await (supabase as any)
    .from("training_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("logged_at", { ascending: false })
    .limit(limit) as { data: TrainingLogRow[] | null; error: { message: string } | null };

  if (error) return { data: null, error: error.message };
  return { data, error: null };
}

export async function deleteTrainingLog(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const { error } = await (supabase as any)
    .from("training_logs")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  revalidatePath("/profile");
  return { success: true };
}

export interface TrainingLogRow {
  id: string;
  user_id: string;
  logged_at: string;
  category: "technical" | "physical" | "match" | "mental";
  title: string;
  duration_min: number | null;
  intensity: number | null;
  notes: string | null;
  score_serve: number | null;
  score_forehand: number | null;
  score_backhand: number | null;
  score_volley: number | null;
  score_footwork: number | null;
  score_physical: number | null;
  score_mental: number | null;
  created_at: string;
}

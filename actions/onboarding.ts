"use server";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export interface OnboardingData {
  display_name: string;
  height_cm: number | null;
  weight_kg: number | null;
  dominant_hand: "right" | "left";
  years_playing: string;
  location: string;
  score_serve: number;      // 1-5
  score_forehand: number;
  score_backhand: number;
  score_volley: number;
  score_footwork: number;
  score_physical: number;
  score_mental: number;
  strengths: string[];
  weaknesses: string[];
  goal_short: string;
  goal_long: string;
}

export async function completeOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return { error: "ログインが必要です" };

  // Convert 1-5 score to 0-100
  const toScore = (v: number) => Math.round((v / 5) * 100);

  // Update profile
  const { error: profileError } = await (supabase as any)
    .from("profiles")
    .update({
      display_name: data.display_name || null,
      location: data.location || null,
      height_cm: data.height_cm,
      weight_kg: data.weight_kg,
      dominant_hand: data.dominant_hand,
      years_playing: data.years_playing,
      strengths: data.strengths,
      weaknesses: data.weaknesses,
      goal_short: data.goal_short || null,
      goal_long: data.goal_long || null,
      initial_serve: toScore(data.score_serve),
      initial_forehand: toScore(data.score_forehand),
      initial_backhand: toScore(data.score_backhand),
      initial_volley: toScore(data.score_volley),
      initial_footwork: toScore(data.score_footwork),
      initial_physical: toScore(data.score_physical),
      initial_mental: toScore(data.score_mental),
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) return { error: profileError.message };

  // Create initial training log with assessment scores
  const { error: logError } = await (supabase as any)
    .from("training_logs")
    .insert({
      user_id: user.id,
      logged_at: new Date().toISOString().split("T")[0],
      category: "technical",
      title: "初回自己診断",
      notes: `得意: ${data.strengths.join(", ")} / 課題: ${data.weaknesses.join(", ")}`,
      score_serve: toScore(data.score_serve),
      score_forehand: toScore(data.score_forehand),
      score_backhand: toScore(data.score_backhand),
      score_volley: toScore(data.score_volley),
      score_footwork: toScore(data.score_footwork),
      score_physical: toScore(data.score_physical),
      score_mental: toScore(data.score_mental),
    });

  if (logError) return { error: logError.message };

  redirect("/feed");
}

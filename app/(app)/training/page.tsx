export const dynamic = "force-dynamic";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { TrendingUp, Shuffle } from "lucide-react";
import { GrowthDashboard } from "@/components/training/growth-dashboard";

export default async function TrainingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Get training logs (last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const { data: logs } = await (supabase as any)
    .from("training_logs")
    .select("*")
    .eq("user_id", user!.id)
    .gte("logged_at", ninetyDaysAgo.toISOString().split("T")[0])
    .order("logged_at", { ascending: true });

  // Get profile for initial scores
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("initial_serve,initial_forehand,initial_backhand,initial_volley,initial_footwork,initial_physical,initial_mental,onboarding_completed,display_name,created_at")
    .eq("id", user!.id)
    .single();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp size={22} className="text-[#1B4FD8]" />
          <h1 className="text-2xl font-black text-gray-900">成長記録</h1>
        </div>
        <Link
          href="/doubles"
          className="flex items-center gap-1.5 text-xs font-bold bg-[#EEF6FF] text-[#1B4FD8] px-3 py-2 rounded-xl hover:bg-[#1B4FD8] hover:text-white transition-all"
        >
          <Shuffle size={13} />
          ダブルス乱数表
        </Link>
      </div>
      <GrowthDashboard logs={logs ?? []} profile={profile} />
    </div>
  );
}

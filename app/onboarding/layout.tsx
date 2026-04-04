import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function OnboardingLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // If already completed onboarding, go to feed
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (profile?.onboarding_completed) redirect("/feed");

  return (
    <div className="min-h-dvh bg-[#EEF6FF]">
      {children}
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("display_name, location")
    .eq("id", user!.id)
    .single();

  return (
    <OnboardingWizard
      userId={user!.id}
      initialName={profile?.display_name ?? ""}
      initialLocation={profile?.location ?? ""}
    />
  );
}

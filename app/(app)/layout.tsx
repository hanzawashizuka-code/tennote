import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
import { AppHeader } from "@/components/layout/app-header";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Check onboarding completion
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <>
      <AppHeader userId={user.id} />
      <main className="min-h-dvh pt-14 pb-24 bg-[#EEF6FF]">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

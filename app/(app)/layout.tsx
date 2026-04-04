import { redirect } from "next/navigation";
import { BottomNav } from "@/components/layout/bottom-nav";
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
      <main className="min-h-dvh pb-24 bg-[#EEF6FF]">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

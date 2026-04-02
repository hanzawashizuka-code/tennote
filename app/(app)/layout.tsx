import { redirect } from "next/navigation";
import { TennisBackground } from "@/components/layout/tennis-background";
import { Sidebar } from "@/components/layout/sidebar";
import { BottomNav } from "@/components/layout/bottom-nav";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      <Sidebar />
      <main className="md:ml-60 min-h-dvh pb-24 md:pb-0 bg-[#FAFAF8]">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>
      <BottomNav />
    </>
  );
}

import Link from "next/link";
import { Bell } from "lucide-react";
import { TennisBallLogo } from "@/components/ui/tennis-ball-logo";
import { createClient } from "@/lib/supabase/server";

async function getUnreadCount(userId: string): Promise<number> {
  try {
    const supabase = await createClient();
    const { count } = await (supabase as any)
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    return count ?? 0;
  } catch {
    return 0;
  }
}

export async function AppHeader({ userId }: { userId: string }) {
  const unreadCount = await getUnreadCount(userId);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-blue-100">
      <div className="flex items-center justify-between h-14 max-w-2xl mx-auto px-4">
        {/* Logo + Name */}
        <Link href="/feed" className="flex items-center gap-2">
          <TennisBallLogo size={32} />
          <span
            className="text-xl font-bold text-[#1B4FD8] tracking-wide"
            style={{ fontFamily: "'Dancing Script', cursive" }}
          >
            Tennote
          </span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-1">
          {/* Notification Bell */}
          <Link
            href="/notifications"
            className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-blue-50 transition-all"
          >
            <Bell size={20} className="text-gray-500" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

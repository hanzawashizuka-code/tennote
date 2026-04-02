"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageSquare, Trophy, User, Bot, Users } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/feed",     icon: Home,           label: "ホーム",   center: false },
  { href: "/matching", icon: Users,          label: "マッチ",   center: false },
  { href: "/coach",    icon: Bot,            label: "AI",       center: true  },
  { href: "/events",   icon: Trophy,         label: "大会",     center: false },
  { href: "/messages", icon: MessageSquare,  label: "DM",       center: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100">
      <div className="flex items-end justify-around h-[62px] px-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label, center }) => {
          const active = pathname.startsWith(href);

          if (center) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 -translate-y-3"
              >
                <div className={cn(
                  "w-[52px] h-[52px] rounded-2xl flex items-center justify-center shadow-md shadow-[#C8F400]/40 transition-all active:scale-95",
                  active ? "bg-[#DFFF5A]" : "bg-[#C8F400]"
                )}>
                  <Icon size={24} color="#111110" strokeWidth={2.2} />
                </div>
                <span className="text-[9px] font-semibold text-gray-400 mt-0.5">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-1 py-2 px-3 transition-all"
            >
              <div className="relative">
                <Icon
                  size={24}
                  strokeWidth={active ? 2.5 : 1.7}
                  color={active ? "#111110" : "#9CA3AF"}
                />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#C8F400]" />
                )}
              </div>
              <span className={cn(
                "text-[9px] font-medium",
                active ? "text-gray-900 font-semibold" : "text-gray-400"
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
      <div className="h-[env(safe-area-inset-bottom)]" />
    </nav>
  );
}

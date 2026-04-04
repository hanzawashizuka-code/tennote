"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, User, Bot, Users, Trophy } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "/feed",    icon: Home,   label: "ホーム",   center: false },
  { href: "/events",  icon: Trophy, label: "大会",     center: false },
  { href: "/coach",   icon: Bot,    label: "AI",       center: true  },
  { href: "/matching",icon: Users,  label: "マッチング",center: false },
  { href: "/profile", icon: User,   label: "マイページ",center: false },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-blue-100">
      <div className="flex items-end justify-around h-[62px] max-w-lg mx-auto px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label, center }) => {
          const active = pathname === href || pathname.startsWith(href + "/");

          if (center) {
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-col items-center gap-0.5 -translate-y-3"
              >
                <div className={cn(
                  "w-[54px] h-[54px] rounded-2xl flex items-center justify-center shadow-lg transition-all active:scale-95",
                  active
                    ? "bg-[#DFFF5A] shadow-[#C8F400]/40"
                    : "bg-[#C8F400] shadow-[#C8F400]/40"
                )}>
                  <Icon size={26} color="#111110" strokeWidth={2.2} />
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
                  size={23}
                  strokeWidth={active ? 2.5 : 1.7}
                  color={active ? "#1B4FD8" : "#9CA3AF"}
                />
                {active && (
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full bg-[#C8F400]" />
                )}
              </div>
              <span className={cn(
                "text-[9px] font-medium",
                active ? "text-[#1B4FD8] font-semibold" : "text-gray-400"
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

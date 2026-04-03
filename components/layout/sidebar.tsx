"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home, MessageSquare, Trophy, User, Bot, CreditCard,
  LogOut, Users, Sparkles, Brain, Video, Radio
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { logout } from "@/actions/auth";
import { TennisBallLogo } from "@/components/ui/tennis-ball-logo";

const NAV_ITEMS = [
  { href: "/feed",            icon: Home,          label: "フィード" },
  { href: "/coach",           icon: Bot,           label: "AIコーチ" },
  { href: "/coach/video",     icon: Video,         label: "動画AI分析" },
  { href: "/live",            icon: Radio,         label: "ライブ配信" },
  { href: "/matching",        icon: Users,         label: "練習相手を探す" },
  { href: "/diagnosis/mbti",  icon: Brain,         label: "MBTI診断" },
  { href: "/diagnosis/style", icon: Sparkles,      label: "ウェア診断" },
  { href: "/events",          icon: Trophy,        label: "大会・練習会" },
  { href: "/messages",        icon: MessageSquare, label: "メッセージ" },
  { href: "/profile",         icon: User,          label: "プロフィール" },
  { href: "/billing",         icon: CreditCard,    label: "プラン" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-60 h-screen fixed left-0 top-0 z-40 bg-white border-r border-blue-100 py-5 px-3">

      {/* Logo + Wordmark */}
      <div className="flex items-center gap-2.5 px-3 mb-6">
        <TennisBallLogo size={36} />
        <span
          className="text-[#1B4FD8] text-2xl leading-none"
          style={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700 }}
        >
          Tennote
        </span>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm",
                active
                  ? "bg-[#1B4FD8] text-white font-semibold"
                  : "text-gray-500 hover:text-gray-900 hover:bg-blue-50 font-normal"
              )}
            >
              <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
              {label}
              {href === "/live" && !active && (
                <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#C8F400]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <form action={logout} className="mt-2">
        <button
          type="submit"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl w-full text-gray-400 hover:text-gray-900 hover:bg-blue-50 transition-all text-sm"
        >
          <LogOut size={20} strokeWidth={1.8} />
          ログアウト
        </button>
      </form>
    </aside>
  );
}

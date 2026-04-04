"use client";
import Link from "next/link";
import { Heart, Users, Trophy, MessageCircle, UserPlus, Bell } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatRelativeTime } from "@/lib/utils/format";

const TYPE_ICONS: Record<string, { icon: any; color: string; bg: string }> = {
  match_request:  { icon: Users,         color: "text-[#1B4FD8]", bg: "bg-blue-50" },
  match_accepted: { icon: Users,         color: "text-emerald-600", bg: "bg-emerald-50" },
  post_liked:     { icon: Heart,         color: "text-red-500",  bg: "bg-red-50" },
  event_entry:    { icon: Trophy,        color: "text-amber-600", bg: "bg-amber-50" },
  new_message:    { icon: MessageCircle, color: "text-purple-600", bg: "bg-purple-50" },
  new_follower:   { icon: UserPlus,      color: "text-teal-600",  bg: "bg-teal-50" },
};

interface Notification {
  id: string;
  type: string;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  created_at: string;
}

export function NotificationList({ notifications }: { notifications: Notification[] }) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-300">
        <Bell size={40} className="mb-3 opacity-30" />
        <p className="text-sm">まだ通知がありません</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {notifications.map((notif) => {
        const meta = TYPE_ICONS[notif.type] ?? { icon: Bell, color: "text-gray-500", bg: "bg-gray-50" };
        const Icon = meta.icon;

        const content = (
          <div className={cn(
            "flex items-start gap-3 p-4 rounded-2xl border transition-all",
            notif.is_read
              ? "bg-white border-blue-50"
              : "bg-[#EEF6FF] border-[#1B4FD8]/20"
          )}>
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", meta.bg)}>
              <Icon size={18} className={meta.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className={cn("text-sm font-semibold", notif.is_read ? "text-gray-700" : "text-gray-900")}>
                  {notif.title}
                </p>
                {!notif.is_read && (
                  <span className="w-2 h-2 rounded-full bg-[#1B4FD8] flex-shrink-0 mt-1.5" />
                )}
              </div>
              {notif.body && (
                <p className="text-xs text-gray-400 mt-0.5">{notif.body}</p>
              )}
              <p className="text-[10px] text-gray-300 mt-1">{formatRelativeTime(notif.created_at)}</p>
            </div>
          </div>
        );

        if (notif.link) {
          return <Link key={notif.id} href={notif.link}>{content}</Link>;
        }
        return <div key={notif.id}>{content}</div>;
      })}
    </div>
  );
}

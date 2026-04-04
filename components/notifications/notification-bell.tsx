"use client";
import Link from "next/link";
import { Bell } from "lucide-react";

export function NotificationBell({ unreadCount }: { unreadCount: number }) {
  return (
    <Link href="/notifications" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-blue-50 transition-all">
      <Bell size={20} className="text-gray-500" />
      {unreadCount > 0 && (
        <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </Link>
  );
}

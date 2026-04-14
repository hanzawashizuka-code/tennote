export const dynamic = "force-dynamic";
import { Bell, CheckCheck } from "lucide-react";
import { getNotifications, markAllRead } from "@/actions/notifications";
import { NotificationList } from "@/components/notifications/notification-list";

export default async function NotificationsPage() {
  const { data: notifications, unreadCount } = await getNotifications();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Bell size={22} className="text-[#1B4FD8]" />
          通知
          {unreadCount > 0 && (
            <span className="text-sm font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h1>
        {unreadCount > 0 && (
          <form action={markAllRead}>
            <button type="submit" className="flex items-center gap-1.5 text-xs text-[#1B4FD8] font-semibold">
              <CheckCheck size={14} />
              すべて既読
            </button>
          </form>
        )}
      </div>
      <NotificationList notifications={notifications} />
    </div>
  );
}

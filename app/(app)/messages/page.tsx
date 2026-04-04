import Link from "next/link";
import { MessageCircle, Info } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { formatRelativeTime } from "@/lib/utils/format";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: conversations } = await (supabase as any)
    .from("conversations")
    .select(`
      id, last_message_at, participant1, participant2,
      messages(content, created_at, sender_id)
    `)
    .or(`participant1.eq.${user!.id},participant2.eq.${user!.id}`)
    .order("last_message_at", { ascending: false });

  const otherUserIds = (conversations ?? []).map((c: any) =>
    c.participant1 === user!.id ? c.participant2 : c.participant1
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", otherUserIds.length > 0 ? otherUserIds : ["none"]);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
        <MessageCircle size={22} className="text-[#1B4FD8]" />
        メッセージ
      </h1>

      {/* Hint */}
      <div className="flex items-start gap-2 bg-blue-50 rounded-xl p-3">
        <Info size={14} className="text-[#1B4FD8] mt-0.5 flex-shrink-0" />
        <p className="text-xs text-[#1B4FD8]">
          マッチングページからプレーヤーにDMを送れます
        </p>
      </div>

      {!conversations || conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-300">
          <MessageCircle size={40} className="mb-3 opacity-30" />
          <p className="text-sm">まだメッセージがありません</p>
          <p className="text-xs mt-1">マッチングページで相手を見つけましょう</p>
          <Link href="/matching" className="mt-4 text-xs font-semibold text-[#1B4FD8] underline underline-offset-2">
            マッチングへ →
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {(conversations as any[]).map((conv) => {
            const otherId = conv.participant1 === user!.id ? conv.participant2 : conv.participant1;
            const other = profileMap.get(otherId);
            const msgs = Array.isArray(conv.messages) ? conv.messages : [];
            const lastMsg = msgs[msgs.length - 1] ?? null;
            const isUnread = lastMsg && lastMsg.sender_id !== user!.id; // simplified unread check

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`}>
                <div className={`flex items-center gap-3 p-4 rounded-2xl border transition-all hover:border-[#1B4FD8] hover:shadow-sm ${
                  isUnread ? "bg-[#EEF6FF] border-[#1B4FD8]/20" : "bg-white border-blue-100"
                }`}>
                  <Avatar src={other?.avatar_url} name={other?.display_name ?? other?.username} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isUnread ? "font-bold text-gray-900" : "font-semibold text-gray-800"}`}>
                        {other?.display_name ?? other?.username ?? "ユーザー"}
                      </span>
                      {conv.last_message_at && (
                        <span className="text-gray-300 text-[10px]">{formatRelativeTime(conv.last_message_at)}</span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className={`text-xs truncate mt-0.5 ${isUnread ? "text-gray-600 font-medium" : "text-gray-400"}`}>
                        {lastMsg.content}
                      </p>
                    )}
                  </div>
                  {isUnread && (
                    <span className="w-2.5 h-2.5 rounded-full bg-[#1B4FD8] flex-shrink-0" />
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

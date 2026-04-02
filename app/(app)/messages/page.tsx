import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/format";

export default async function MessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: conversations } = await supabase
    .from("conversations")
    .select(`
      id, last_message_at, participant1, participant2,
      messages(content, created_at, sender_id)
    `)
    .or(`participant1.eq.${user!.id},participant2.eq.${user!.id}`)
    .order("last_message_at", { ascending: false });

  // 相手のプロフィールを取得
  const otherUserIds = (conversations ?? []).map((c) =>
    c.participant1 === user!.id ? c.participant2 : c.participant1
  );

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, display_name, username, avatar_url")
    .in("id", otherUserIds.length > 0 ? otherUserIds : ["none"]);

  const profileMap = new Map(profiles?.map((p) => [p.id, p]) ?? []);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900 mb-4">メッセージ</h1>
      {!conversations || conversations.length === 0 ? (
        <div className="text-center text-gray-300 py-12 text-sm">
          まだメッセージがありません
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {conversations.map((conv) => {
            const otherId = conv.participant1 === user!.id ? conv.participant2 : conv.participant1;
            const other = profileMap.get(otherId);
            const lastMsg = Array.isArray(conv.messages)
              ? conv.messages[conv.messages.length - 1]
              : null;

            return (
              <Link key={conv.id} href={`/messages/${conv.id}`}>
                <Card className="flex items-center gap-3 hover:bg-gray-100 transition-all cursor-pointer">
                  <Avatar src={other?.avatar_url} name={other?.display_name ?? other?.username} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-900 font-semibold text-sm">
                        {other?.display_name ?? other?.username ?? "ユーザー"}
                      </span>
                      {conv.last_message_at && (
                        <span className="text-gray-300 text-xs">{formatRelativeTime(conv.last_message_at)}</span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="text-gray-400 text-xs truncate mt-0.5">{lastMsg.content}</p>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

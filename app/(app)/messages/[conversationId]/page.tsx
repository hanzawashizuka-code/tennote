import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/messages/message-thread";

export const dynamic = "force-dynamic";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: conv } = await (supabase as any)
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (!conv || ((conv as any).participant1 !== user!.id && (conv as any).participant2 !== user!.id)) {
    notFound();
  }

  const otherId = (conv as any).participant1 === user!.id ? (conv as any).participant2 : (conv as any).participant1;

  const [{ data: otherUser }, { data: messages }] = await Promise.all([
    (supabase as any)
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .eq("id", otherId)
      .single(),
    (supabase as any)
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true })
      .limit(100),
  ]);

  if (!otherUser) notFound();

  return (
    <MessageThread
      conversationId={conversationId}
      initialMessages={messages ?? []}
      currentUserId={user!.id}
      otherUser={otherUser}
    />
  );
}

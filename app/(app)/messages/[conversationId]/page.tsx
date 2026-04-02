import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageThread } from "@/components/messages/message-thread";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ conversationId: string }>;
}) {
  const { conversationId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: conv } = await supabase
    .from("conversations")
    .select("*")
    .eq("id", conversationId)
    .single();

  if (!conv || (conv.participant1 !== user!.id && conv.participant2 !== user!.id)) {
    notFound();
  }

  const otherId = conv.participant1 === user!.id ? conv.participant2 : conv.participant1;

  const [{ data: otherUser }, { data: messages }] = await Promise.all([
    supabase
      .from("profiles")
      .select("id, display_name, username, avatar_url")
      .eq("id", otherId)
      .single(),
    supabase
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

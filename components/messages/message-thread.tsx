"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Paperclip, X, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { useRealtimeMessages } from "@/hooks/use-realtime-messages";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Message, Profile } from "@/types";

interface MessageThreadProps {
  conversationId: string;
  initialMessages: Message[];
  currentUserId: string;
  otherUser: Pick<Profile, "id" | "display_name" | "username" | "avatar_url">;
}

interface MediaAttachment {
  url: string;
  type: "image" | "video";
  preview?: string;
}

function MediaBubble({ url, type }: { url: string; type: string }) {
  const [playing, setPlaying] = useState(false);
  if (type === "image") {
    return (
      <img
        src={url}
        alt=""
        className="max-w-[220px] rounded-xl object-cover mt-1"
        loading="lazy"
      />
    );
  }
  return playing ? (
    <video src={url} controls autoPlay className="max-w-[220px] rounded-xl mt-1" />
  ) : (
    <button
      onClick={() => setPlaying(true)}
      className="relative max-w-[220px] w-44 aspect-video rounded-xl bg-gray-800 flex items-center justify-center mt-1 group"
    >
      <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center shadow group-hover:scale-105 transition-transform">
        <Play size={18} className="text-gray-900 ml-0.5" fill="currentColor" />
      </div>
    </button>
  );
}

export function MessageThread({ conversationId, initialMessages, currentUserId, otherUser }: MessageThreadProps) {
  const [messages] = useRealtimeMessages(conversationId, initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [attachment, setAttachment] = useState<MediaAttachment | null>(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const uploadFile = async (file: File) => {
    setUploading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUploading(false); return; }

    const isVideo = file.type.startsWith("video/");
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("dm-media").upload(path, file);
    if (error) { toast.error("ファイルのアップロードに失敗しました"); setUploading(false); return; }
    const { data } = supabase.storage.from("dm-media").getPublicUrl(path);
    const preview = !isVideo ? URL.createObjectURL(file) : undefined;
    setAttachment({ url: data.publicUrl, type: isVideo ? "video" : "image", preview });
    setUploading(false);
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() && !attachment) return;
    setSending(true);

    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      sender_id: currentUserId,
      content: input.trim() || (attachment ? "📎 メディアを送信" : ""),
      media_url: attachment?.url ?? null,
      media_type: attachment?.type ?? null,
    } as never);

    setSending(false);
    if (error) {
      toast.error("送信に失敗しました");
    } else {
      setInput("");
      setAttachment(null);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100dvh-4rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
        <Avatar src={otherUser.avatar_url} name={otherUser.display_name ?? otherUser.username} size="sm" />
        <span className="text-gray-900 font-semibold">{otherUser.display_name ?? otherUser.username}</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 pb-2">
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId;
          const hasMedia = (msg as any).media_url;
          return (
            <div key={msg.id} className={cn("flex gap-2", isMe ? "justify-end" : "justify-start")}>
              {!isMe && (
                <Avatar src={otherUser.avatar_url} name={otherUser.display_name} size="sm" className="mt-1 flex-shrink-0" />
              )}
              <div className="max-w-[75%]">
                {hasMedia && (
                  <div className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                    <MediaBubble url={(msg as any).media_url} type={(msg as any).media_type} />
                  </div>
                )}
                {msg.content && !(hasMedia && msg.content === "📎 メディアを送信") && (
                  <div
                    className={cn(
                      "rounded-2xl px-3 py-2 text-sm",
                      isMe
                        ? "bg-[#C8F400] text-[#0E1100] rounded-tr-sm"
                        : "bg-gray-100 text-gray-800 rounded-tl-sm"
                    )}
                  >
                    {msg.content}
                  </div>
                )}
                <p className={cn("text-xs text-gray-300 mt-0.5 px-1", isMe && "text-right")}>
                  {formatRelativeTime(msg.created_at)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Attachment preview */}
      {attachment && (
        <div className="relative inline-flex mb-2 self-start">
          {attachment.type === "image" && attachment.preview ? (
            <img src={attachment.preview} alt="" className="h-16 w-16 rounded-xl object-cover" />
          ) : (
            <div className="h-16 w-16 rounded-xl bg-gray-100 flex items-center justify-center">
              <Play size={20} className="text-gray-500" />
            </div>
          )}
          <button
            onClick={() => setAttachment(null)}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-800 rounded-full flex items-center justify-center"
          >
            <X size={10} className="text-white" />
          </button>
        </div>
      )}

      {/* Input */}
      <form onSubmit={sendMessage} className="flex gap-2 pt-3 border-t border-gray-100">
        <input
          ref={fileRef}
          type="file"
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition-all flex-shrink-0"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Paperclip size={16} />}
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力..."
          className="flex-1 h-10 rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C8F400] text-sm"
        />
        <Button
          type="submit"
          size="sm"
          disabled={!input.trim() && !attachment}
          loading={sending}
          className="px-3"
        >
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

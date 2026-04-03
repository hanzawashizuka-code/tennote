"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Send } from "lucide-react";

interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  at: number;
}

interface LiveChatProps {
  streamId: string;
  userName: string;
  userId: string;
}

export function LiveChat({ streamId, userName, userId }: LiveChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<ReturnType<typeof createClient>["channel"] extends (...args: any[]) => infer R ? R : never | null>(null as any);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(`live-chat:${streamId}`, {
      config: { broadcast: { self: true } },
    });

    channel
      .on("broadcast", { event: "chat" }, ({ payload }: { payload: ChatMessage }) => {
        setMessages((prev) => [...prev.slice(-199), payload]);
      })
      .subscribe();

    channelRef.current = channel;

    return () => {
      supabase.removeChannel(channel);
    };
  }, [streamId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    const text = input.trim();
    if (!text || !channelRef.current) return;
    setInput("");

    const msg: ChatMessage = {
      id: crypto.randomUUID(),
      userId,
      userName,
      text,
      at: Date.now(),
    };

    channelRef.current.send({
      type: "broadcast",
      event: "chat",
      payload: msg,
    });
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-2xl border border-blue-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-blue-50 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-live-pulse" />
        <span className="text-sm font-bold text-gray-900">ライブチャット</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5 min-h-0">
        {messages.length === 0 ? (
          <p className="text-center text-gray-300 text-xs mt-8">
            チャットを始めましょう 🎾
          </p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.userId === userId ? "items-end" : "items-start"}`}>
              <span className="text-[10px] text-gray-400 mb-0.5">{m.userName}</span>
              <div className={`px-3 py-1.5 rounded-2xl text-sm max-w-[85%] break-words ${
                m.userId === userId
                  ? "bg-[#1B4FD8] text-white rounded-br-sm"
                  : "bg-blue-50 text-gray-900 rounded-bl-sm"
              }`}>
                {m.text}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-blue-50">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            placeholder="メッセージを送る..."
            className="flex-1 h-9 bg-blue-50 rounded-xl px-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/30"
          />
          <button
            onClick={send}
            disabled={!input.trim()}
            className="w-9 h-9 rounded-xl bg-[#1B4FD8] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#1E40AF] transition-colors"
          >
            <Send size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useRef, useEffect } from "react";
import { useChat } from "ai/react";
import { Send } from "lucide-react";
import { MessageBubble } from "./message-bubble";
import { TypingIndicator } from "./typing-indicator";
import { Button } from "@/components/ui/button";

const SUGGESTED_QUESTIONS = [
  "フォアハンドの打ち方を教えて",
  "週3回の練習メニューを作って",
  "サーブを安定させるコツは？",
  "試合前のウォームアップ方法は？",
];

export function ChatWindow() {
  const bottomRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/coach",
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex flex-col h-[calc(100dvh-8rem)] md:h-[calc(100dvh-4rem)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-3 py-4 pr-1">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 rounded-full bg-[#4A5C00] flex items-center justify-center">
              <span className="text-gray-900 text-2xl">🎾</span>
            </div>
            <div className="text-center">
              <h2 className="text-gray-900 font-bold text-lg">AIテニスコーチ</h2>
              <p className="text-gray-400 text-sm mt-1">テニスに関する質問をなんでも聞いてください</p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center max-w-sm">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => {
                    const fd = new FormData();
                    fd.set("input", q);
                    const syntheticEvent = {
                      preventDefault: () => {},
                    } as React.FormEvent<HTMLFormElement>;
                    handleInputChange({ target: { value: q } } as React.ChangeEvent<HTMLInputElement>);
                    setTimeout(() => handleSubmit(syntheticEvent), 50);
                  }}
                  className="glass text-gray-700 text-xs px-3 py-1.5 rounded-full hover:bg-gray-200/60 transition-all"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}

        {isLoading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2 pt-3 border-t border-gray-200">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="メッセージを入力..."
          className="flex-1 h-10 rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C8F400] text-sm"
        />
        <Button type="submit" size="sm" disabled={!input.trim() || isLoading} className="px-3">
          <Send size={16} />
        </Button>
      </form>
    </div>
  );
}

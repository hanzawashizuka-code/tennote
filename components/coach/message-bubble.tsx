import { cn } from "@/lib/utils/cn";
import type { Message } from "ai";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === "user";

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#4A5C00] flex items-center justify-center mr-2 flex-shrink-0 mt-1">
          <span className="text-gray-900 text-xs font-bold">AI</span>
        </div>
      )}
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-wrap",
          isUser
            ? "bg-[#C8F400] text-[#0E1100] rounded-tr-sm"
            : "glass text-gray-900/90 rounded-tl-sm"
        )}
      >
        {message.content}
      </div>
    </div>
  );
}

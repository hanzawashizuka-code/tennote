export const dynamic = "force-dynamic";
import Link from "next/link";
import { Video } from "lucide-react";
import { ChatWindow } from "@/components/coach/chat-window";

export default function CoachPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">AIコーチ</h1>
        <Link
          href="/coach/video"
          className="flex items-center gap-1.5 bg-gray-900 text-[#C8F400] text-sm font-semibold px-3 py-2 rounded-xl hover:bg-gray-800 transition-colors"
        >
          <Video size={15} />
          動画分析
        </Link>
      </div>
      <ChatWindow />
    </div>
  );
}

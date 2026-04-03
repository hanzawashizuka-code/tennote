import { getStream } from "@/actions/live";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StreamBroadcaster } from "@/components/live/stream-broadcaster";
import { StreamViewer } from "@/components/live/stream-viewer";
import { LiveChat } from "@/components/live/live-chat";
import { ArrowLeft, Radio, Users } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function StreamPage({ params }: { params: Promise<{ streamId: string }> }) {
  const { streamId } = await params;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: stream, error } = await getStream(streamId);
  if (error || !stream) notFound();

  // Get user's profile for chat
  const { data: profile } = await (supabase as any)
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user!.id)
    .single();

  const isHost = stream.host_id === user!.id;
  const userName = profile?.display_name ?? "ゲスト";
  const hasEnded = stream.status === "ended";

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto">
      {/* Back link + title */}
      <div className="flex items-start gap-3">
        <Link href="/live" className="text-gray-400 hover:text-gray-900 transition-colors mt-0.5">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg font-black text-gray-900 truncate">{stream.title}</h1>
            {stream.status === "live" && (
              <span className="flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-pulse" />
                LIVE
              </span>
            )}
            {stream.status === "waiting" && (
              <span className="text-xs bg-blue-100 text-[#1B4FD8] font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                準備中
              </span>
            )}
            {hasEnded && (
              <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                終了
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-5 h-5 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
              {stream.host_avatar ? (
                <img src={stream.host_avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#1B4FD8]">
                  {stream.host_name?.[0] ?? "?"}
                </div>
              )}
            </div>
            <span className="text-sm text-gray-500">{stream.host_name}</span>
            {stream.viewer_count > 0 && (
              <span className="text-xs text-gray-400 flex items-center gap-1 ml-2">
                <Users size={11} />
                {stream.viewer_count}人視聴
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Ended state */}
      {hasEnded ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center">
            <Radio size={36} className="text-gray-400" />
          </div>
          <div>
            <p className="font-bold text-gray-900">この配信は終了しました</p>
            <p className="text-sm text-gray-400 mt-1">他のライブをチェックしてみましょう</p>
          </div>
          <Link
            href="/live"
            className="bg-[#1B4FD8] text-white font-bold px-6 py-3 rounded-xl hover:bg-[#1E40AF] transition-all"
          >
            ライブ一覧へ
          </Link>
        </div>
      ) : (
        /* Main layout: video + chat */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Video area — 2/3 width on large screens */}
          <div className="lg:col-span-2">
            {isHost ? (
              <StreamBroadcaster streamId={streamId} />
            ) : (
              <StreamViewer streamId={streamId} viewerCount={stream.viewer_count} />
            )}

            {/* Description */}
            {stream.description && (
              <div className="mt-3 bg-white rounded-xl border border-blue-100 p-3">
                <p className="text-sm text-gray-700">{stream.description}</p>
              </div>
            )}
          </div>

          {/* Chat — 1/3 width on large screens, full width below */}
          <div className="h-[480px] lg:h-auto">
            <LiveChat
              streamId={streamId}
              userName={userName}
              userId={user!.id}
            />
          </div>
        </div>
      )}
    </div>
  );
}

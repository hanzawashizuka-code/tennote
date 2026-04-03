import { listStreams, getMyActiveStream } from "@/actions/live";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Radio, Users, Clock, Plus } from "lucide-react";
import { CreateStreamModal } from "@/components/live/create-stream-modal";

export const dynamic = "force-dynamic";

function timeAgo(iso: string) {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "たった今";
  if (mins < 60) return `${mins}分前`;
  return `${Math.floor(mins / 60)}時間前`;
}

export default async function LivePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ data: streams }, { data: myStream }] = await Promise.all([
    listStreams(),
    getMyActiveStream(),
  ]);

  const liveStreams = (streams ?? []).filter((s) => s.status === "live");
  const waitingStreams = (streams ?? []).filter((s) => s.status === "waiting");

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Radio size={24} className="text-[#1B4FD8]" />
            ライブ配信
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">テニスをリアルタイムで共有しよう</p>
        </div>
        {!myStream && (
          <CreateStreamModal userId={user!.id} />
        )}
        {myStream && (
          <Link
            href={`/live/${myStream.id}`}
            className="flex items-center gap-2 bg-red-600 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
          >
            <span className="w-2 h-2 rounded-full bg-white animate-live-pulse" />
            配信中
          </Link>
        )}
      </div>

      {/* Live now */}
      {liveStreams.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-live-pulse" />
            配信中
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {liveStreams.map((stream) => (
              <Link
                key={stream.id}
                href={`/live/${stream.id}`}
                className="group block bg-white rounded-2xl border border-blue-100 hover:border-[#1B4FD8] hover:shadow-lg hover:shadow-blue-100 transition-all overflow-hidden"
              >
                {/* Thumbnail placeholder */}
                <div className="aspect-video bg-gradient-to-br from-[#1B4FD8] to-[#3B82F6] relative flex items-center justify-center">
                  <Radio size={32} className="text-white/60" />
                  <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-live-pulse" />
                    LIVE
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                    <Users size={10} />
                    {stream.viewer_count}
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-semibold text-gray-900 text-sm line-clamp-1">{stream.title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-5 h-5 rounded-full bg-blue-100 overflow-hidden flex-shrink-0">
                      {stream.host_avatar ? (
                        <img src={stream.host_avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#1B4FD8]">
                          {stream.host_name?.[0] ?? "?"}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">{stream.host_name}</span>
                    <span className="text-xs text-gray-300 ml-auto flex items-center gap-1">
                      <Clock size={10} />
                      {stream.started_at ? timeAgo(stream.started_at) : ""}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Waiting / upcoming */}
      {waitingStreams.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <Clock size={14} />
            配信準備中
          </h2>
          <div className="flex flex-col gap-2">
            {waitingStreams.map((stream) => (
              <Link
                key={stream.id}
                href={`/live/${stream.id}`}
                className="flex items-center gap-3 bg-white rounded-2xl border border-blue-100 hover:border-[#1B4FD8] p-3 transition-all group"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                  <Radio size={20} className="text-[#1B4FD8]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm truncate">{stream.title}</p>
                  <p className="text-xs text-gray-400">{stream.host_name} · {timeAgo(stream.created_at)}</p>
                </div>
                <span className="text-xs bg-blue-50 text-[#1B4FD8] font-semibold px-2.5 py-1 rounded-full flex-shrink-0">
                  準備中
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {liveStreams.length === 0 && waitingStreams.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
          <div className="w-20 h-20 rounded-3xl bg-blue-50 flex items-center justify-center">
            <Radio size={36} className="text-[#1B4FD8]" />
          </div>
          <div>
            <p className="font-bold text-gray-900">配信中のライブはありません</p>
            <p className="text-sm text-gray-400 mt-1">最初の配信者になりましょう 🎾</p>
          </div>
          {!myStream && (
            <CreateStreamModal userId={user!.id} />
          )}
        </div>
      )}
    </div>
  );
}

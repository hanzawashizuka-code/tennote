export const dynamic = "force-dynamic";
import Link from "next/link";
import { Plus, Calendar, Trophy, Search } from "lucide-react";
import { searchEvents } from "@/actions/events";
import { EventCard } from "@/components/events/event-card";

interface SearchParams {
  q?: string;
  type?: string;
  level?: string;
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const { data: events, error } = await searchEvents({
    query: params.q,
    type: params.type as "tournament" | "practice" | "clinic" | undefined,
    skillLevel: params.level,
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Trophy size={22} className="text-[#1B4FD8]" />
            大会・練習会
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">テニスイベントを探す・作る</p>
        </div>
        <Link
          href="/events/create"
          className="flex items-center gap-1.5 bg-[#1B4FD8] hover:bg-[#1E40AF] text-white text-sm font-bold px-4 py-2 rounded-xl transition-colors shadow-lg shadow-[#1B4FD8]/25"
        >
          <Plus size={16} />
          作成
        </Link>
      </div>

      {/* 検索フォーム */}
      <form className="flex flex-col gap-2.5">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            name="q"
            defaultValue={params.q}
            placeholder="キーワードで検索..."
            className="h-11 w-full rounded-xl bg-white border border-blue-100 pl-9 pr-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#1B4FD8] text-sm shadow-sm"
          />
        </div>
        <div className="flex gap-2">
          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="flex-1 h-10 rounded-xl bg-white border border-blue-100 px-3 text-gray-700 focus:outline-none focus:border-[#1B4FD8] text-sm"
          >
            <option value="">すべての種類</option>
            <option value="tournament">大会</option>
            <option value="practice">練習会</option>
            <option value="clinic">クリニック</option>
          </select>
          <select
            name="level"
            defaultValue={params.level ?? ""}
            className="flex-1 h-10 rounded-xl bg-white border border-blue-100 px-3 text-gray-700 focus:outline-none focus:border-[#1B4FD8] text-sm"
          >
            <option value="">すべてのレベル</option>
            <option value="beginner">初心者</option>
            <option value="intermediate">中級者</option>
            <option value="advanced">上級者</option>
          </select>
          <button
            type="submit"
            className="h-10 px-4 rounded-xl bg-[#1B4FD8] text-white text-sm font-bold hover:bg-[#1E40AF] transition-colors"
          >
            検索
          </button>
        </div>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!events || events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Calendar size={28} className="text-[#1B4FD8]" />
          </div>
          <p className="text-gray-900 font-semibold">イベントが見つかりませんでした</p>
          <p className="text-sm text-gray-400">最初のイベントを作成してみましょう</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event: any) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

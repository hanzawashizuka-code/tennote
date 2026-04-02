import Link from "next/link";
import { Plus } from "lucide-react";
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
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-gray-900">大会・練習会</h1>
        <Link
          href="/events/create"
          className="flex items-center gap-1.5 bg-[#C8F400] hover:bg-[#DFFF5A] text-[#0E1100] text-sm font-bold px-3 py-2 rounded-xl transition-colors"
        >
          <Plus size={16} />
          作成
        </Link>
      </div>
      <form className="flex flex-col gap-3 mb-5">
        <input
          name="q"
          defaultValue={params.q}
          placeholder="キーワードで検索..."
          className="h-10 w-full rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C8F400] text-sm"
        />
        <div className="flex gap-2">
          <select
            name="type"
            defaultValue={params.type ?? ""}
            className="flex-1 h-10 rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 focus:outline-none text-sm"
          >
            <option value="" className="bg-white">すべての種類</option>
            <option value="tournament" className="bg-white">大会</option>
            <option value="practice" className="bg-white">練習会</option>
            <option value="clinic" className="bg-white">クリニック</option>
          </select>
          <select
            name="level"
            defaultValue={params.level ?? ""}
            className="flex-1 h-10 rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 focus:outline-none text-sm"
          >
            <option value="" className="bg-white">すべてのレベル</option>
            <option value="beginner" className="bg-white">初心者</option>
            <option value="intermediate" className="bg-white">中級者</option>
            <option value="advanced" className="bg-white">上級者</option>
          </select>
        </div>
        <button
          type="submit"
          className="h-10 rounded-xl bg-[#C8F400] text-[#0E1100] text-sm font-bold hover:bg-[#DFFF5A] transition-colors"
        >
          検索
        </button>
      </form>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {!events || events.length === 0 ? (
        <div className="text-center text-gray-300 py-12 text-sm">
          イベントが見つかりませんでした
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Trophy, ArrowLeft, Clock, Layers, CreditCard } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { EntryButton } from "@/components/events/entry-button";
import { formatJPY } from "@/lib/utils/format";

const TYPE_LABELS: Record<string, string> = {
  tournament: "大会",
  practice: "練習会",
  clinic: "クリニック",
};

const TYPE_COLORS: Record<string, string> = {
  tournament: "bg-[#1B4FD8] text-white",
  practice: "bg-[#EEF6FF] text-[#1B4FD8]",
  clinic: "bg-[#C8F400]/20 text-[#4A5C00]",
};

const SURFACE_LABELS: Record<string, string> = {
  hard: "ハードコート", clay: "クレー", grass: "グラス",
  carpet: "カーペット", indoor: "インドア",
};

const SKILL_LABELS: Record<string, string> = {
  beginner: "初級", intermediate: "中級", advanced: "上級", all: "全レベル",
};

export default async function EventDetailPage({ params }: { params: Promise<{ eventId: string }> }) {
  const { eventId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: event } = await (supabase as any).from("events").select("*").eq("id", eventId).single();
  if (!event) notFound();

  const { data: entry } = await (supabase as any).from("event_entries")
    .select("id, status").eq("event_id", eventId).eq("user_id", user!.id).single();

  const { count } = await (supabase as any).from("event_entries")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId).eq("status", "confirmed");

  const isFull = event.max_participants && (count ?? 0) >= event.max_participants;
  const isOrganizer = event.organizer_id === user!.id;

  function fmtDate(d: string) {
    const dt = new Date(d);
    return dt.toLocaleDateString("ja-JP", { month: "long", day: "numeric", weekday: "short", hour: "2-digit", minute: "2-digit" });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Back */}
      <Link href="/events" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1B4FD8] transition-colors w-fit">
        <ArrowLeft size={16} />
        イベント一覧
      </Link>

      {/* Color bar header card */}
      <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className={`h-2 ${event.event_type === "tournament" ? "bg-[#1B4FD8]" : event.event_type === "practice" ? "bg-[#C8F400]" : "bg-blue-200"}`} />
        <div className="p-5">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${TYPE_COLORS[event.event_type] ?? "bg-gray-100 text-gray-600"}`}>
              {TYPE_LABELS[event.event_type]}
            </span>
            {event.entry_fee_jpy > 0 ? (
              <span className="text-xs font-semibold text-gray-600 bg-gray-100 border border-gray-200 px-3 py-1 rounded-full flex items-center gap-1">
                <CreditCard size={11} />
                {formatJPY(event.entry_fee_jpy)}
              </span>
            ) : (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">無料</span>
            )}
            {isFull && (
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full">満員</span>
            )}
          </div>
          <h1 className="text-xl font-black text-gray-900 leading-snug">{event.title}</h1>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-[#1B4FD8] mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-900">{fmtDate(event.starts_at)}</p>
            {event.ends_at && (
              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                <Clock size={11} />
                終了: {fmtDate(event.ends_at)}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin size={16} className="text-[#1B4FD8] flex-shrink-0" />
          <p className="text-sm text-gray-700">{event.location}</p>
        </div>
        <div className="flex items-center gap-3">
          <Users size={16} className="text-[#1B4FD8] flex-shrink-0" />
          <p className="text-sm text-gray-700">
            <span className="font-bold text-[#1B4FD8]">{count ?? 0}</span>
            {event.max_participants ? ` / ${event.max_participants} 名` : " 名参加中"}
          </p>
        </div>
        {event.court_surface && (
          <div className="flex items-center gap-3">
            <Layers size={16} className="text-[#1B4FD8] flex-shrink-0" />
            <p className="text-sm text-gray-700">{SURFACE_LABELS[event.court_surface] ?? event.court_surface}</p>
          </div>
        )}
        {event.skill_levels?.length > 0 && (
          <div className="flex items-center gap-3">
            <Trophy size={16} className="text-[#1B4FD8] flex-shrink-0" />
            <div className="flex flex-wrap gap-1.5">
              {event.skill_levels.map((lv: string) => (
                <span key={lv} className="text-xs bg-blue-50 text-[#1B4FD8] px-2.5 py-1 rounded-full font-medium">
                  {SKILL_LABELS[lv] ?? lv}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Description */}
      {event.description && (
        <div className="bg-white rounded-2xl border border-blue-100 p-5">
          <h2 className="text-sm font-bold text-gray-700 mb-2">詳細・説明</h2>
          <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{event.description}</p>
        </div>
      )}

      {/* Participation count bar */}
      {event.max_participants && (
        <div className="bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-gray-700">参加者</span>
            <span className="text-xs text-gray-500">{count ?? 0} / {event.max_participants} 名</span>
          </div>
          <div className="h-2 bg-blue-50 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B4FD8] rounded-full transition-all"
              style={{ width: `${Math.min(100, ((count ?? 0) / event.max_participants) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Entry section */}
      {!isOrganizer && (
        <EntryButton
          eventId={event.id}
          isEntered={!!entry}
          entryStatus={entry?.status ?? null}
          entryFee={event.entry_fee_jpy}
          isFull={!!isFull}
        />
      )}
      {isOrganizer && (
        <div className="bg-[#EEF6FF] rounded-2xl border border-[#1B4FD8]/20 p-4 text-center">
          <p className="text-sm text-[#1B4FD8] font-semibold">あなたが主催するイベントです</p>
        </div>
      )}
    </div>
  );
}

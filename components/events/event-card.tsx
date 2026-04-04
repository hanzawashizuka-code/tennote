import Link from "next/link";
import { Calendar, MapPin, Users, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatJPY } from "@/lib/utils/format";
import type { Event } from "@/types";

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

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <div className="group bg-white rounded-2xl border border-blue-100 hover:border-[#1B4FD8] hover:shadow-lg hover:shadow-blue-100 transition-all overflow-hidden">
        {/* カラーバー */}
        <div className={`h-1.5 ${event.event_type === "tournament" ? "bg-[#1B4FD8]" : event.event_type === "practice" ? "bg-[#C8F400]" : "bg-blue-200"}`} />

        <div className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* バッジ */}
              <div className="flex items-center gap-2 mb-2">
                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${TYPE_COLORS[event.event_type] ?? "bg-gray-100 text-gray-600"}`}>
                  {TYPE_LABELS[event.event_type]}
                </span>
                {event.entry_fee_jpy > 0 ? (
                  <span className="text-[11px] font-semibold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-full">
                    {formatJPY(event.entry_fee_jpy)}
                  </span>
                ) : (
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                    無料
                  </span>
                )}
              </div>

              <h3 className="text-gray-900 font-bold text-sm leading-snug">{event.title}</h3>
              {event.description && (
                <p className="text-gray-400 text-xs mt-1 line-clamp-2">{event.description}</p>
              )}
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-[#1B4FD8] flex-shrink-0 mt-0.5 transition-colors" />
          </div>

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-3">
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <Calendar size={12} className="text-[#1B4FD8]" />
              {formatDate(event.starts_at)}
            </span>
            <span className="flex items-center gap-1.5 text-xs text-gray-400">
              <MapPin size={12} className="text-[#1B4FD8]" />
              {event.location}
            </span>
            {event.max_entrants && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400">
                <Users size={12} className="text-[#1B4FD8]" />
                最大 {event.max_entrants} 名
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

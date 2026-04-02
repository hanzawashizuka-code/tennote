import Link from "next/link";
import { Calendar, MapPin, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatJPY } from "@/lib/utils/format";
import type { Event } from "@/types";

const TYPE_LABELS: Record<string, string> = {
  tournament: "大会",
  practice: "練習会",
  clinic: "クリニック",
};

export function EventCard({ event }: { event: Event }) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="hover:bg-gray-100 transition-all cursor-pointer">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge>{TYPE_LABELS[event.event_type]}</Badge>
              {event.entry_fee_jpy > 0 ? (
                <Badge variant="warning">{formatJPY(event.entry_fee_jpy)}</Badge>
              ) : (
                <Badge variant="success">無料</Badge>
              )}
            </div>
            <h3 className="text-gray-900 font-semibold text-sm">{event.title}</h3>
            {event.description && (
              <p className="text-gray-400 text-xs mt-1 line-clamp-2">{event.description}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-3 text-xs text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {formatDate(event.starts_at)}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {event.location}
          </span>
          {event.max_entrants && (
            <span className="flex items-center gap-1">
              <Users size={12} />
              最大 {event.max_entrants} 名
            </span>
          )}
        </div>
      </Card>
    </Link>
  );
}

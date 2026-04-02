import { notFound } from "next/navigation";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EntryButton } from "@/components/events/entry-button";
import { formatDateTime, formatJPY } from "@/lib/utils/format";

const TYPE_LABELS: Record<string, string> = {
  tournament: "大会",
  practice: "練習会",
  clinic: "クリニック",
};

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", eventId)
    .single();

  if (!event) notFound();

  const { data: entry } = await supabase
    .from("event_entries")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user!.id)
    .single();

  const { count } = await supabase
    .from("event_entries")
    .select("id", { count: "exact", head: true })
    .eq("event_id", eventId)
    .eq("status", "confirmed");

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Badge>{TYPE_LABELS[event.event_type]}</Badge>
        {event.entry_fee_jpy > 0 ? (
          <Badge variant="warning">{formatJPY(event.entry_fee_jpy)}</Badge>
        ) : (
          <Badge variant="success">無料</Badge>
        )}
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{event.title}</h1>

      <Card variant="strong" className="flex flex-col gap-3 mb-4">
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <Calendar size={16} className="text-[#74C69D]" />
          <span>{formatDateTime(event.starts_at)}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600 text-sm">
          <MapPin size={16} className="text-[#74C69D]" />
          <span>{event.location}</span>
        </div>
        {event.max_entrants && (
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Users size={16} className="text-[#74C69D]" />
            <span>
              {count ?? 0} / {event.max_entrants} 名
            </span>
          </div>
        )}
        {event.skill_levels.length > 0 && (
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-[#74C69D]" />
            <div className="flex flex-wrap gap-1">
              {event.skill_levels.map((level) => (
                <Badge key={level} variant="outline">{level}</Badge>
              ))}
            </div>
          </div>
        )}
      </Card>

      {event.description && (
        <Card className="mb-4">
          <p className="text-gray-700 text-sm whitespace-pre-wrap">{event.description}</p>
        </Card>
      )}

      <EntryButton eventId={event.id} isEntered={!!entry} />
    </div>
  );
}

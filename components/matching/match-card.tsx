"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Heart, MapPin, Clock, MessageCircle, UserPlus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { sendMatchRequest } from "@/actions/matching";
import { startConversation } from "@/actions/messages";

interface MatchProfile {
  user_id: string;
  preferred_area: string | null;
  preferred_time: string | null;
  looking_for: string[];
  message: string | null;
  profiles: {
    display_name: string | null;
    username: string;
    avatar_url: string | null;
    skill_level: string | null;
  };
}

const LOOKING_FOR_LABELS: Record<string, string> = {
  singles: "シングルス",
  doubles: "ダブルス",
  practice: "練習相手",
  coach: "コーチ希望",
};

const TIME_LABELS: Record<string, string> = {
  morning: "朝",
  afternoon: "昼",
  evening: "夜",
  any: "いつでも",
};

const SKILL_LABELS: Record<string, string> = {
  beginner: "初心者",
  intermediate: "中級",
  advanced: "上級",
  pro: "プロ",
};

interface MatchCardProps {
  profile: MatchProfile;
  requestSent?: boolean;
}

export function MatchCard({ profile, requestSent: initialSent = false }: MatchCardProps) {
  const [sent, setSent] = useState(initialSent);
  const [loading, setLoading] = useState(false);

  const handleRequest = async () => {
    setLoading(true);
    const result = await sendMatchRequest(profile.user_id);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      setSent(true);
      toast.success("マッチングリクエストを送りました！");
    }
  };

  return (
    <Card className="p-4 flex flex-col gap-3">
      <div className="flex items-start gap-3">
        <Avatar
          src={profile.profiles.avatar_url}
          name={profile.profiles.display_name ?? profile.profiles.username}
          size="lg"
        />
        <div className="flex-1 min-w-0">
          <p className="text-gray-900 font-bold">
            {profile.profiles.display_name ?? profile.profiles.username}
          </p>
          <p className="text-gray-400 text-xs">@{profile.profiles.username}</p>
          {profile.profiles.skill_level && (
            <Badge className="mt-1 text-xs">
              {SKILL_LABELS[profile.profiles.skill_level] ?? profile.profiles.skill_level}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <form action={async () => { await startConversation(profile.user_id); }}>
            <button type="submit" className="flex items-center gap-1.5 text-xs font-semibold text-[#1B4FD8] bg-blue-50 hover:bg-blue-100 px-3 py-2 rounded-xl transition-all">
              <MessageCircle size={13} />
              DM
            </button>
          </form>
          <Button
            size="sm"
            variant={sent ? "ghost" : "primary"}
            onClick={handleRequest}
            loading={loading}
            disabled={sent}
            className={sent ? "text-[#C8F400]" : ""}
          >
            {sent ? (
              <><Heart size={14} className="fill-current" /> 送信済み</>
            ) : (
              <><Heart size={14} /> 申請</>
            )}
          </Button>
        </div>
      </div>

      {profile.message && (
        <p className="text-gray-600 text-sm bg-gray-100/50 rounded-xl px-3 py-2 leading-relaxed">
          "{profile.message}"
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {profile.looking_for.map((lf) => (
          <Badge key={lf} variant="default" className="text-xs">
            {LOOKING_FOR_LABELS[lf] ?? lf}
          </Badge>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 text-gray-400 text-xs">
        {profile.preferred_area && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />{profile.preferred_area}
          </span>
        )}
        {profile.preferred_time && (
          <span className="flex items-center gap-1">
            <Clock size={12} />{TIME_LABELS[profile.preferred_time] ?? profile.preferred_time}
          </span>
        )}
      </div>
    </Card>
  );
}

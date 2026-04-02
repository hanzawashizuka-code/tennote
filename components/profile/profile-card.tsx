import { MapPin, Award } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import type { Profile } from "@/types";

const SKILL_LABELS: Record<string, string> = {
  beginner: "初心者",
  intermediate: "中級者",
  advanced: "上級者",
  pro: "プロ",
};

export function ProfileCard({ profile }: { profile: Profile }) {
  return (
    <Card variant="strong">
      <div className="flex items-start gap-4">
        <Avatar src={profile.avatar_url} name={profile.display_name ?? profile.username} size="lg" />
        <div className="flex-1 min-w-0">
          <h2 className="text-gray-900 font-bold text-lg">{profile.display_name ?? profile.username}</h2>
          <p className="text-gray-400 text-sm">@{profile.username}</p>
          {profile.bio && <p className="text-gray-600 text-sm mt-2">{profile.bio}</p>}
          <div className="flex flex-wrap gap-2 mt-3">
            {profile.location && (
              <span className="flex items-center gap-1 text-gray-400 text-xs">
                <MapPin size={12} /> {profile.location}
              </span>
            )}
            {profile.skill_level && (
              <Badge>
                <Award size={10} className="mr-1" />
                {SKILL_LABELS[profile.skill_level]}
              </Badge>
            )}
            {profile.play_style && (
              <Badge variant="outline">{profile.play_style}</Badge>
            )}
          </div>
          {profile.referral_code && (
            <div className="mt-3 text-xs text-gray-300">
              紹介コード: <span className="text-[#C8F400] font-mono font-bold">{profile.referral_code}</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

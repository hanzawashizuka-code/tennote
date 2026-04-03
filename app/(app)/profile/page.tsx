import Link from "next/link";
import { Settings } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ProfileCard } from "@/components/profile/profile-card";
import { TennisBarometer } from "@/components/profile/tennis-barometer";
import { TrainingLogPanel } from "@/components/profile/training-log-panel";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getTrainingLogs } from "@/actions/training";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileResult, logsResult] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user!.id).single(),
    getTrainingLogs(50),
  ]);

  const profile = profileResult.data;
  const logs = logsResult.data ?? [];

  if (!profile) return <div className="text-gray-400">プロフィールが見つかりません</div>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-900">プロフィール</h1>
        <Link href="/profile/settings">
          <Button variant="ghost" size="sm">
            <Settings size={16} />
            編集
          </Button>
        </Link>
      </div>

      {/* プロフィールカード */}
      <ProfileCard profile={profile} />

      {/* テニスバロメーター */}
      <Card className="p-5">
        <h2 className="text-sm font-bold text-gray-900 mb-4">🎾 テニスバロメーター</h2>
        <TennisBarometer logs={logs} />
      </Card>

      {/* トレーニングログ */}
      <Card className="p-5">
        <TrainingLogPanel initialLogs={logs} />
      </Card>
    </div>
  );
}

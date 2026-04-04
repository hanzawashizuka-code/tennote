import Link from "next/link";
import { Settings, Brain, Shirt, TrendingUp, ChevronRight } from "lucide-react";
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

      {/* 診断カード */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/diagnosis/mbti">
          <div className="bg-white rounded-2xl border border-blue-100 p-4 flex items-center gap-3 hover:border-[#1B4FD8] transition-colors active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6FF] flex items-center justify-center flex-shrink-0">
              <Brain size={20} className="text-[#1B4FD8]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">プレースタイル</p>
              <p className="text-[10px] text-gray-400">MBTI診断</p>
            </div>
          </div>
        </Link>
        <Link href="/diagnosis/style">
          <div className="bg-white rounded-2xl border border-blue-100 p-4 flex items-center gap-3 hover:border-[#1B4FD8] transition-colors active:scale-95">
            <div className="w-10 h-10 rounded-xl bg-[#EEF6FF] flex items-center justify-center flex-shrink-0">
              <Shirt size={20} className="text-[#1B4FD8]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">テニスタイプ</p>
              <p className="text-[10px] text-gray-400">スタイル診断</p>
            </div>
          </div>
        </Link>
      </div>

      {/* 成長記録リンク */}
      <Link href="/training" className="flex items-center justify-between bg-white rounded-2xl border border-blue-100 p-4 hover:border-[#1B4FD8] transition-all">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EEF6FF] flex items-center justify-center">
            <TrendingUp size={20} className="text-[#1B4FD8]" />
          </div>
          <div>
            <p className="text-gray-900 font-bold text-sm">成長記録</p>
            <p className="text-gray-400 text-xs">スキル推移・練習カレンダー</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-300" />
      </Link>

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

import Link from "next/link";
import { Brain, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function DiagnosisPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">🔍 診断メニュー</h1>
        <p className="text-gray-400 text-sm mt-1">あなたに合ったテニスライフを見つけよう</p>
      </div>

      <div className="flex flex-col gap-4">
        <Link href="/diagnosis/mbti">
          <Card className="p-5 hover:bg-gray-100 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4A5C00]/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                🧠
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-lg">MBTIプレースタイル診断</h2>
                <p className="text-gray-500 text-sm">あなたの性格から最適なプレースタイルを診断</p>
                <p className="text-[#C8F400] text-xs mt-1">20問 · 約5分</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/diagnosis/style">
          <Card className="p-5 hover:bg-gray-100 transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#4A5C00]/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                👗
              </div>
              <div>
                <h2 className="text-gray-900 font-bold text-lg">テニスウェア診断</h2>
                <p className="text-gray-500 text-sm">骨格診断×パーソナルカラーでウェアを提案</p>
                <p className="text-[#C8F400] text-xs mt-1">12問 · 約3分</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}

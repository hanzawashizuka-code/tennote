import { VideoAnalyzer } from "@/components/coach/video-analyzer";

export default function VideoAnalysisPage() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-xl font-bold text-gray-900">🎬 動画AI分析</h1>
        <p className="text-gray-400 text-sm mt-1">
          練習・試合動画をアップロードするとAIコーチが詳細なフィードバックを提供します
        </p>
      </div>

      {/* ステップ説明 */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { step: "1", label: "動画を選択", icon: "📁" },
          { step: "2", label: "ショット種類を設定", icon: "🎾" },
          { step: "3", label: "AI分析を受け取る", icon: "🤖" },
        ].map(({ step, label, icon }) => (
          <div key={step} className="bg-white border border-gray-100 rounded-2xl p-3 text-center shadow-sm">
            <div className="text-2xl mb-1">{icon}</div>
            <p className="text-[10px] text-gray-400 font-medium">STEP {step}</p>
            <p className="text-xs text-gray-700 font-semibold leading-tight mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <VideoAnalyzer />
    </div>
  );
}

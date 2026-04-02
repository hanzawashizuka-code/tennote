import { Sparkles } from "lucide-react";
import { StyleQuiz } from "@/components/diagnosis/style-quiz";

export default function StyleDiagnosisPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles size={22} className="text-[#C8F400]" />
          テニスウェア診断
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          骨格診断 × パーソナルカラー診断で、あなたに似合うテニスウェアを提案します
        </p>
      </div>
      <StyleQuiz />
    </div>
  );
}

import { Brain } from "lucide-react";
import { MBTIQuiz } from "@/components/diagnosis/mbti-quiz";

export default function MBTIDiagnosisPage() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Brain size={22} className="text-[#C8F400]" />
          MBTIプレースタイル診断
        </h1>
        <p className="text-gray-400 text-sm mt-1">
          4つの質問であなたのテニスプレースタイルを診断します
        </p>
      </div>
      <MBTIQuiz />
    </div>
  );
}

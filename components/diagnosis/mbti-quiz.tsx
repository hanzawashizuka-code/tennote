"use client";

import { useState } from "react";
import { MBTI_QUESTIONS, MBTI_RESULTS, calcMBTIType, getMBTIScorePercent } from "@/lib/data/mbti";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft } from "lucide-react";

type AnswerValue = "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P";

const AXIS_LABELS: Record<string, { a: string; b: string; label: string }> = {
  EI: { a: "外向型 (E)", b: "内向型 (I)", label: "社交性" },
  SN: { a: "感覚型 (S)", b: "直感型 (N)", label: "情報処理" },
  TF: { a: "思考型 (T)", b: "感情型 (F)", label: "判断基準" },
  JP: { a: "計画型 (J)", b: "柔軟型 (P)", label: "行動スタイル" },
};

export function MBTIQuiz() {
  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({});
  const [result, setResult] = useState<string | null>(null);
  const [step, setStep] = useState(0);

  const currentQ = MBTI_QUESTIONS[step];

  const handleAnswer = (value: AnswerValue) => {
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    if (step < MBTI_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      setResult(calcMBTIType(newAnswers));
    }
  };

  const reset = () => {
    setAnswers({});
    setResult(null);
    setStep(0);
  };

  if (result) {
    const mbtiResult = MBTI_RESULTS[result];
    const axes = ["EI", "SN", "TF", "JP"];

    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        {/* メイン結果カード */}
        <Card variant="strong" className="text-center p-6">
          <div className="text-5xl mb-3">{mbtiResult.emoji}</div>
          <Badge className="mb-2 text-sm px-3 py-1">{mbtiResult.type}</Badge>
          <h2 className="text-2xl font-bold text-gray-900 mt-2">{mbtiResult.playStyle}</h2>
          <p className="text-gray-600 mt-2 text-sm leading-relaxed">{mbtiResult.description}</p>
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
            <span>📍 コートポジション：</span>
            <span className="text-[#C8F400] font-medium">{mbtiResult.courtPosition}</span>
          </div>
        </Card>

        {/* 軸スコアバー */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">📊 あなたの傾向スコア</h3>
          <div className="flex flex-col gap-3">
            {axes.map((axis) => {
              const score = getMBTIScorePercent(answers as Record<string, string>, axis);
              const info = AXIS_LABELS[axis];
              return (
                <div key={axis}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{info.a}</span>
                    <span className="text-gray-300">{info.label}</span>
                    <span>{info.b}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C8F400] rounded-full transition-all"
                      style={{ width: `${score.first}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-300 mt-0.5">
                    <span>{score.first}%</span>
                    <span>{score.second}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* 強み・課題 */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="p-4">
            <h3 className="text-sm font-bold text-[#C8F400] mb-2">💪 強み</h3>
            <ul className="flex flex-col gap-1">
              {mbtiResult.strengths.map((s) => (
                <li key={s} className="text-gray-600 text-xs flex items-start gap-1">
                  <span className="text-[#C8F400] mt-0.5">✓</span>{s}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="p-4">
            <h3 className="text-sm font-bold text-yellow-400 mb-2">⚠️ 課題</h3>
            <ul className="flex flex-col gap-1">
              {mbtiResult.weaknesses.map((w) => (
                <li key={w} className="text-gray-600 text-xs flex items-start gap-1">
                  <span className="text-yellow-400 mt-0.5">△</span>{w}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* メンタルTips */}
        <Card className="p-4 border border-[#C8F400]/30">
          <h3 className="text-sm font-bold text-[#C8F400] mb-2">🧠 メンタルアドバイス</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{mbtiResult.mentalTip}</p>
        </Card>

        {/* おすすめ練習メニュー */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">🎾 おすすめ練習メニュー</h3>
          <ul className="flex flex-col gap-1.5">
            {mbtiResult.recommendedDrills.map((d) => (
              <li key={d} className="text-gray-600 text-sm flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C8F400] flex-shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </Card>

        {/* 有名選手 */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">🌟 同タイプの有名選手</h3>
          <div className="flex flex-wrap gap-2">
            {mbtiResult.famousPlayers.map((p) => (
              <Badge key={p} variant="outline">{p}</Badge>
            ))}
          </div>
        </Card>

        <Button onClick={reset} variant="outline" className="w-full">
          もう一度診断する
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* プログレスバー */}
      <div className="flex gap-0.5">
        {MBTI_QUESTIONS.map((_, i) => (
          <div
            key={i}
            className={cn(
              "h-1 flex-1 rounded-full transition-all",
              i < step ? "bg-[#C8F400]" : i === step ? "bg-[#C8F400]/70" : "bg-gray-200/60"
            )}
          />
        ))}
      </div>

      {/* 軸インジケーター */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {step > 0 && (
            <button
              onClick={() => {
                const prevQ = MBTI_QUESTIONS[step - 1];
                const newAnswers = { ...answers };
                delete newAnswers[prevQ.id];
                setAnswers(newAnswers);
                setStep(step - 1);
              }}
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1B4FD8] transition-colors"
            >
              <ChevronLeft size={14} />
              戻る
            </button>
          )}
          <div className="text-gray-400 text-sm">
            質問 {step + 1} / {MBTI_QUESTIONS.length}
          </div>
        </div>
        <Badge variant="outline" className="text-xs">
          {currentQ.axis === "EI" && "社交性"}
          {currentQ.axis === "SN" && "情報処理"}
          {currentQ.axis === "TF" && "判断基準"}
          {currentQ.axis === "JP" && "行動スタイル"}
        </Badge>
      </div>

      <Card variant="strong" className="p-6">
        <p className="text-gray-900 text-lg font-semibold text-center leading-relaxed mb-6">
          {currentQ.question}
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={() => handleAnswer(currentQ.optionA.value)}
            className="glass hover:bg-gray-200/60 text-gray-700 hover:text-gray-900 rounded-xl px-4 py-4 text-sm text-left transition-all hover:scale-[1.01] active:scale-[0.99] leading-relaxed"
          >
            <span className="text-[#C8F400] font-bold mr-2">A.</span>
            {currentQ.optionA.label}
          </button>
          <button
            onClick={() => handleAnswer(currentQ.optionB.value)}
            className="glass hover:bg-gray-200/60 text-gray-700 hover:text-gray-900 rounded-xl px-4 py-4 text-sm text-left transition-all hover:scale-[1.01] active:scale-[0.99] leading-relaxed"
          >
            <span className="text-[#C8F400] font-bold mr-2">B.</span>
            {currentQ.optionB.label}
          </button>
        </div>
      </Card>
    </div>
  );
}

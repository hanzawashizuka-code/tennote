"use client";

import { useState } from "react";
import {
  BODY_TYPE_QUESTIONS, COLOR_SEASON_QUESTIONS,
  BODY_TYPE_INFO, COLOR_SEASON_INFO, getWearRecommendations,
  type BodyType, type ColorSeason,
} from "@/lib/data/style-diagnosis";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";
import { ChevronLeft } from "lucide-react";

type Phase = "body" | "color" | "result";

export function StyleQuiz() {
  const [phase, setPhase] = useState<Phase>("body");
  const [bodyStep, setBodyStep] = useState(0);
  const [colorStep, setColorStep] = useState(0);
  const [bodyAnswers, setBodyAnswers] = useState<string[]>([]);
  const [colorAnswers, setColorAnswers] = useState<string[]>([]);
  const [bodyType, setBodyType] = useState<BodyType | null>(null);
  const [colorSeason, setColorSeason] = useState<ColorSeason | null>(null);

  const calcMajority = (answers: string[]): string => {
    const counts: Record<string, number> = {};
    answers.forEach((a) => { counts[a] = (counts[a] ?? 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const handleBodyAnswer = (value: string) => {
    const newAnswers = [...bodyAnswers, value];
    setBodyAnswers(newAnswers);
    if (bodyStep < BODY_TYPE_QUESTIONS.length - 1) {
      setBodyStep(bodyStep + 1);
    } else {
      setBodyType(calcMajority(newAnswers) as BodyType);
      setPhase("color");
    }
  };

  const handleColorAnswer = (value: string) => {
    const newAnswers = [...colorAnswers, value];
    setColorAnswers(newAnswers);
    if (colorStep < COLOR_SEASON_QUESTIONS.length - 1) {
      setColorStep(colorStep + 1);
    } else {
      setColorSeason(calcMajority(newAnswers) as ColorSeason);
      setPhase("result");
    }
  };

  const reset = () => {
    setPhase("body");
    setBodyStep(0);
    setColorStep(0);
    setBodyAnswers([]);
    setColorAnswers([]);
    setBodyType(null);
    setColorSeason(null);
  };

  // ─── 結果画面 ───
  if (phase === "result" && bodyType && colorSeason) {
    const bodyInfo = BODY_TYPE_INFO[bodyType];
    const colorInfo = COLOR_SEASON_INFO[colorSeason];
    const recs = getWearRecommendations(bodyType, colorSeason);

    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        {/* 診断結果バッジ */}
        <div className="flex gap-3">
          <Card variant="strong" className="flex-1 text-center p-4">
            <div className="text-3xl mb-1">{bodyInfo.emoji}</div>
            <Badge className="mb-1">骨格</Badge>
            <p className="text-gray-900 font-bold text-lg">{bodyInfo.name}</p>
            <p className="text-gray-500 text-xs mt-1">{bodyInfo.description}</p>
          </Card>
          <Card variant="strong" className="flex-1 text-center p-4">
            <div className="text-3xl mb-1">{colorInfo.emoji}</div>
            <Badge className="mb-1">カラー</Badge>
            <p className="text-gray-900 font-bold text-lg">{colorInfo.name}</p>
            <p className="text-gray-500 text-xs mt-1">{colorInfo.description}</p>
          </Card>
        </div>

        {/* おすすめカラー */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">🎨 あなたに似合うテニスウェアカラー</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {colorInfo.bestColors.map((color, i) => (
              <div key={color} className="flex items-center gap-1.5">
                <div
                  className="w-5 h-5 rounded-full border border-gray-200"
                  style={{ backgroundColor: colorInfo.bestColorHexes[i] }}
                />
                <span className="text-gray-600 text-xs">{color}</span>
              </div>
            ))}
          </div>
          <p className="text-gray-400 text-xs">
            ⚠️ 避けたい色: {colorInfo.avoidColors.join("・")}
          </p>
        </Card>

        {/* おすすめシルエット */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">👗 似合うシルエット</h3>
          <p className="text-gray-600 text-sm">{recs.silhouette}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {recs.fabricTips.map((tip) => (
              <Badge key={tip} variant="outline" className="text-xs">{tip}</Badge>
            ))}
          </div>
        </Card>

        {/* ウェア提案TOP3 */}
        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">🛍️ あなたへのおすすめウェアTOP3</h3>
          <div className="flex flex-col gap-3">
            {recs.topPicks.map((pick, i) => (
              <div key={i} className="glass p-3 rounded-xl">
                <div className="flex items-start gap-2">
                  <span className="text-[#C8F400] font-bold text-lg leading-none">{i + 1}</span>
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">{pick.item}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{pick.description}</p>
                    <p className="text-[#C8F400] text-xs mt-1">💡 {pick.colorTip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Button onClick={reset} variant="outline" className="w-full">
          もう一度診断する
        </Button>
      </div>
    );
  }

  // ─── 骨格診断 ───
  if (phase === "body") {
    const q = BODY_TYPE_QUESTIONS[bodyStep];
    const total = BODY_TYPE_QUESTIONS.length + COLOR_SEASON_QUESTIONS.length;
    const current = bodyStep;

    return (
      <div className="flex flex-col gap-6 animate-fade-in">
        <div className="flex gap-1.5">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= current ? "bg-[#C8F400]" : "bg-gray-200/60")} />
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div>
            {bodyStep > 0 && (
              <button
                onClick={() => {
                  setBodyAnswers(bodyAnswers.slice(0, -1));
                  setBodyStep(bodyStep - 1);
                }}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1B4FD8] transition-colors"
              >
                <ChevronLeft size={14} />戻る
              </button>
            )}
          </div>
          <div className="text-center">
            <Badge variant="outline" className="mb-1">STEP 1 骨格診断</Badge>
            <p className="text-gray-400 text-sm">質問 {bodyStep + 1} / {BODY_TYPE_QUESTIONS.length}</p>
          </div>
          <div className="w-12" />
        </div>
        <Card variant="strong" className="p-6">
          <p className="text-gray-900 text-lg font-semibold text-center mb-6">{q.question}</p>
          <div className="flex flex-col gap-3">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleBodyAnswer(opt.value)}
                className="glass hover:bg-gray-200/60 text-gray-700 hover:text-gray-900 rounded-xl px-4 py-3 text-sm text-left flex items-center gap-3 transition-all"
              >
                <span className="text-xl">{opt.image}</span>
                {opt.label}
              </button>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  // ─── カラー診断 ───
  const q = COLOR_SEASON_QUESTIONS[colorStep];
  const total = BODY_TYPE_QUESTIONS.length + COLOR_SEASON_QUESTIONS.length;
  const current = BODY_TYPE_QUESTIONS.length + colorStep;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <div className="flex gap-1.5">
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} className={cn("h-1 flex-1 rounded-full transition-all", i <= current ? "bg-[#C8F400]" : "bg-gray-200/60")} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() => {
              if (colorStep > 0) {
                setColorAnswers(colorAnswers.slice(0, -1));
                setColorStep(colorStep - 1);
              } else {
                setPhase("body");
                setBodyStep(BODY_TYPE_QUESTIONS.length - 1);
                setBodyAnswers(bodyAnswers.slice(0, -1));
              }
            }}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-[#1B4FD8] transition-colors"
          >
            <ChevronLeft size={14} />戻る
          </button>
        </div>
        <div className="text-center">
          <Badge variant="outline" className="mb-1">STEP 2 カラー診断</Badge>
          <p className="text-gray-400 text-sm">質問 {colorStep + 1} / {COLOR_SEASON_QUESTIONS.length}</p>
        </div>
        <div className="w-12" />
      </div>
      <Card variant="strong" className="p-6">
        <p className="text-gray-900 text-lg font-semibold text-center mb-6">{q.question}</p>
        <div className="flex flex-col gap-3">
          {q.options.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleColorAnswer(opt.value)}
              className="glass hover:bg-gray-200/60 text-gray-700 hover:text-gray-900 rounded-xl px-4 py-3 text-sm text-left flex items-center gap-3 transition-all"
            >
              <div className="w-6 h-6 rounded-full border border-gray-300 flex-shrink-0" style={{ backgroundColor: opt.color }} />
              {opt.label}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
}

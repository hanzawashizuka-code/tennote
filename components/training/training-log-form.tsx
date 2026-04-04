"use client";

import { useState, useTransition } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { createTrainingLog } from "@/actions/training";

const CATEGORIES = [
  { value: "technical", label: "技術練習", emoji: "🎾" },
  { value: "physical",  label: "フィジカル", emoji: "💪" },
  { value: "match",     label: "試合",       emoji: "🏆" },
  { value: "mental",    label: "メンタル",   emoji: "🧠" },
] as const;

const SCORE_ITEMS = [
  { key: "score_serve",     label: "サーブ" },
  { key: "score_forehand",  label: "フォアハンド" },
  { key: "score_backhand",  label: "バックハンド" },
  { key: "score_volley",    label: "ボレー" },
  { key: "score_footwork",  label: "フットワーク" },
  { key: "score_physical",  label: "フィジカル" },
  { key: "score_mental",    label: "メンタル" },
] as const;

const INTENSITIES = [1, 2, 3, 4, 5];
const INTENSITY_LABELS = ["", "軽め", "やや軽め", "普通", "きつめ", "ハード"];

export function TrainingLogForm() {
  const [isPending, startTransition] = useTransition();

  const [category, setCategory] = useState<"technical" | "physical" | "match" | "mental">("technical");
  const [title, setTitle]       = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes]       = useState("");
  const [showScores, setShowScores] = useState(false);
  const [scores, setScores]     = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("タイトルを入力してください"); return; }

    const scoreData: Record<string, number | undefined> = {};
    SCORE_ITEMS.forEach(({ key }) => {
      const v = Number(scores[key]);
      if (v > 0) scoreData[key] = Math.min(100, Math.max(0, v));
    });

    startTransition(async () => {
      const result = await createTrainingLog({
        category,
        title: title.trim(),
        duration_min: duration ? Number(duration) : undefined,
        intensity,
        notes: notes.trim() || undefined,
        score_serve:     scoreData.score_serve,
        score_forehand:  scoreData.score_forehand,
        score_backhand:  scoreData.score_backhand,
        score_volley:    scoreData.score_volley,
        score_footwork:  scoreData.score_footwork,
        score_physical:  scoreData.score_physical,
        score_mental:    scoreData.score_mental,
      });

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success("ログを記録しました！");
        window.location.reload();
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* カテゴリ */}
      <div>
        <label className="text-xs text-gray-400 mb-2 block">カテゴリ</label>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setCategory(c.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                category === c.value
                  ? "bg-[#1B4FD8] text-white"
                  : "bg-gray-100 text-gray-500 hover:text-gray-900"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* タイトル */}
      <div>
        <label className="text-xs text-gray-400 mb-1 block">タイトル <span className="text-red-400">*</span></label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="例：バックハンド練習・ランニング30分・練習試合"
          className="h-10 w-full rounded-xl bg-gray-50 border border-gray-200 px-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#1B4FD8]"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 練習時間 */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">練習時間（分）</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            min={1} max={480}
            placeholder="90"
            className="h-10 w-full rounded-xl bg-gray-50 border border-gray-200 px-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#1B4FD8]"
          />
        </div>
        {/* 強度 */}
        <div>
          <label className="text-xs text-gray-400 mb-1 block">
            強度: <span className="text-gray-600">{INTENSITY_LABELS[intensity]}</span>
          </label>
          <div className="flex gap-1 h-10 items-center">
            {INTENSITIES.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setIntensity(v)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                  intensity >= v
                    ? "bg-[#1B4FD8] text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* メモ */}
      <div>
        <label className="text-xs text-gray-400 mb-1 block">メモ（任意）</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="今日の感想・気づき・改善点"
          rows={2}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#1B4FD8]"
        />
      </div>

      {/* スコア（折りたたみ） */}
      <button
        type="button"
        onClick={() => setShowScores(!showScores)}
        className="flex items-center gap-1.5 text-xs text-[#1B4FD8] hover:text-blue-800 font-medium"
      >
        {showScores ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        スキルスコアを入力（任意）
      </button>

      {showScores && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-[#EEF6FF] rounded-xl">
          {SCORE_ITEMS.map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <label className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</label>
              <input
                type="number"
                min={0} max={100}
                value={scores[key] ?? ""}
                onChange={(e) => setScores(p => ({ ...p, [key]: e.target.value }))}
                placeholder="0-100"
                className="flex-1 h-8 rounded-lg bg-white border border-blue-100 px-2 text-xs text-gray-900 focus:outline-none focus:border-[#1B4FD8]"
              />
            </div>
          ))}
        </div>
      )}

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl bg-[#1B4FD8] text-white font-bold text-sm hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "記録中..." : "記録する"}
      </button>
    </form>
  );
}

"use client";

import { useState, useTransition } from "react";
import { Plus, ChevronDown, ChevronUp, Trash2, Clock, Zap } from "lucide-react";
import { toast } from "sonner";
import { createTrainingLog, deleteTrainingLog } from "@/actions/training";
import type { TrainingLogRow } from "@/actions/training";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
  { value: "technical", label: "技術練習", emoji: "🎾", color: "bg-green-100 text-green-700" },
  { value: "physical",  label: "フィジカル", emoji: "💪", color: "bg-purple-100 text-purple-700" },
  { value: "match",     label: "試合",     emoji: "🏆", color: "bg-yellow-100 text-yellow-700" },
  { value: "mental",    label: "メンタル", emoji: "🧠", color: "bg-blue-100 text-blue-700" },
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

interface TrainingLogPanelProps {
  initialLogs: TrainingLogRow[];
}

function formatDate(d: string) {
  const date = new Date(d);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function TrainingLogPanel({ initialLogs }: TrainingLogPanelProps) {
  const [logs, setLogs] = useState<TrainingLogRow[]>(initialLogs);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [category, setCategory] = useState<"technical" | "physical" | "match" | "mental">("technical");
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [intensity, setIntensity] = useState(3);
  const [notes, setNotes] = useState("");
  const [showScores, setShowScores] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({});

  const resetForm = () => {
    setTitle(""); setDuration(""); setIntensity(3); setNotes("");
    setScores({}); setShowScores(false); setShowForm(false);
  };

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
        // Optimistic UI — reload page to get fresh barometer
        window.location.reload();
      }
    });
  };

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteTrainingLog(id);
      if (result.error) { toast.error(result.error); return; }
      setLogs(prev => prev.filter(l => l.id !== id));
      toast.success("削除しました");
    });
  };

  const catInfo = (cat: string) => CATEGORIES.find(c => c.value === cat)!;

  return (
    <div className="flex flex-col gap-3">
      {/* Add button */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-gray-900">📋 トレーニングログ</h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-[#C8F400] px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-all"
        >
          <Plus size={13} />
          記録する
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <Card className="p-4 animate-fade-in border border-gray-100">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* カテゴリ */}
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => setCategory(c.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    category === c.value
                      ? "bg-gray-900 text-[#C8F400]"
                      : "bg-gray-100 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {c.emoji} {c.label}
                </button>
              ))}
            </div>

            {/* タイトル */}
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例：バックハンド練習・ランニング30分・練習試合"
              className="h-10 w-full rounded-xl bg-gray-50 border border-gray-200 px-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C8F400]"
              required
            />

            <div className="grid grid-cols-2 gap-2">
              {/* 時間 */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">練習時間（分）</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  min={1} max={480}
                  placeholder="90"
                  className="h-10 w-full rounded-xl bg-gray-50 border border-gray-200 px-3 text-gray-900 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#C8F400]"
                />
              </div>
              {/* 強度 */}
              <div>
                <label className="text-xs text-gray-400 mb-1 block">強度: {INTENSITY_LABELS[intensity]}</label>
                <div className="flex gap-1 h-10 items-center">
                  {INTENSITIES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setIntensity(v)}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all ${
                        intensity >= v ? "bg-[#C8F400] text-[#111110]" : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* メモ */}
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="今日の感想・気づき・改善点（任意）"
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:border-[#C8F400]"
            />

            {/* スコア（折りたたみ） */}
            <button
              type="button"
              onClick={() => setShowScores(!showScores)}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-900"
            >
              {showScores ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              バロメータースコアを入力（任意）
            </button>

            {showScores && (
              <div className="grid grid-cols-2 gap-2">
                {SCORE_ITEMS.map(({ key, label }) => (
                  <div key={key} className="flex items-center gap-2">
                    <label className="text-xs text-gray-500 w-24 flex-shrink-0">{label}</label>
                    <input
                      type="number"
                      min={0} max={100}
                      value={scores[key] ?? ""}
                      onChange={(e) => setScores(p => ({ ...p, [key]: e.target.value }))}
                      placeholder="0-100"
                      className="flex-1 h-8 rounded-lg bg-gray-50 border border-gray-200 px-2 text-xs text-gray-900 focus:outline-none focus:border-[#C8F400]"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button type="button" variant="outline" size="sm" onClick={resetForm} className="flex-1">
                キャンセル
              </Button>
              <Button type="submit" size="sm" loading={isPending} className="flex-1">
                記録する
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Log list */}
      {logs.length === 0 ? (
        <p className="text-center text-gray-300 text-sm py-6">
          まだログがありません。最初のトレーニングを記録しましょう！
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {logs.map((log) => {
            const cat = catInfo(log.category);
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-white border border-gray-100 hover:border-gray-200 transition-all"
              >
                <div className="text-xl mt-0.5">{cat.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900 truncate">{log.title}</span>
                    <span className="text-xs text-gray-300">{formatDate(log.logged_at)}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
                      {cat.label}
                    </span>
                    {log.duration_min && (
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Clock size={11} />{log.duration_min}分
                      </span>
                    )}
                    {log.intensity && (
                      <span className="text-xs text-gray-400 flex items-center gap-0.5">
                        <Zap size={11} />強度{log.intensity}
                      </span>
                    )}
                  </div>
                  {log.notes && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{log.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(log.id)}
                  className="text-gray-200 hover:text-red-400 transition-colors flex-shrink-0 mt-0.5"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

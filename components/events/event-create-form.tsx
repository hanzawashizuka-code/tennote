"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/events";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const EVENT_TYPES = [
  { value: "tournament", label: "🏆 大会・トーナメント" },
  { value: "practice", label: "🎾 練習会・オープン練習" },
  { value: "clinic", label: "📚 クリニック・講習会" },
];

const SKILL_LEVELS = [
  { value: "beginner", label: "初級" },
  { value: "intermediate", label: "中級" },
  { value: "advanced", label: "上級" },
  { value: "all", label: "全レベル" },
];

const SURFACES = [
  { value: "hard", label: "ハードコート" },
  { value: "clay", label: "クレーコート" },
  { value: "grass", label: "グラスコート" },
  { value: "carpet", label: "カーペット" },
  { value: "indoor", label: "インドア" },
];

export function EventCreateForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [eventType, setEventType] = useState("practice");
  const [surface, setSurface] = useState("");

  const toggleSkill = (value: string) => {
    setSelectedSkills((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("skill_levels", selectedSkills.join(","));
    formData.set("event_type", eventType);
    formData.set("court_surface", surface);

    startTransition(async () => {
      const result = await createEvent(formData);
      if (result?.error) {
        toast.error(result.error);
      }
      // redirect happens inside the action on success
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* イベント種類 */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">イベント種類 *</h3>
        <div className="flex flex-col gap-2">
          {EVENT_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setEventType(t.value)}
              className={`text-left px-4 py-3 rounded-xl text-sm transition-all ${
                eventType === t.value
                  ? "bg-gray-900 text-[#C8F400] border border-gray-700"
                  : "glass text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 基本情報 */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">基本情報</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">タイトル *</label>
            <Input
              name="title"
              placeholder="例: 初中級者向け練習会 in 代々木公園"
              required
              className="bg-gray-100/50 border-gray-200 text-gray-900 placeholder:text-gray-200"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">詳細・説明</label>
            <textarea
              name="description"
              placeholder="イベントの詳細、ルール、持ち物など..."
              rows={4}
              className="w-full bg-gray-100/50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-200 resize-none focus:outline-none focus:ring-1 focus:ring-[#C8F400]/50"
            />
          </div>
        </div>
      </Card>

      {/* 日時・場所 */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">日時・場所</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">開催場所 *</label>
            <Input
              name="location"
              placeholder="例: 代々木公園テニスコート（東京都渋谷区）"
              required
              className="bg-gray-100/50 border-gray-200 text-gray-900 placeholder:text-gray-200"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">開始日時 *</label>
              <input
                type="datetime-local"
                name="starts_at"
                required
                className="w-full bg-gray-100/50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8F400]/50 [color-scheme:light]"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">終了日時</label>
              <input
                type="datetime-local"
                name="ends_at"
                className="w-full bg-gray-100/50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8F400]/50 [color-scheme:light]"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1 block">コートサーフェス</label>
            <div className="flex flex-wrap gap-2">
              {SURFACES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSurface(s.value === surface ? "" : s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    surface === s.value
                      ? "bg-gray-900 text-[#C8F400] border border-gray-700"
                      : "glass text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* 参加条件 */}
      <Card className="p-4">
        <h3 className="text-sm font-bold text-gray-900 mb-3">参加条件</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1 block">対象レベル（複数選択可）</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSkill(s.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                    selectedSkills.includes(s.value)
                      ? "bg-gray-900 text-[#C8F400] border border-gray-700"
                      : "glass text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1 block">定員 *</label>
              <Input
                name="max_participants"
                type="number"
                min={2}
                max={500}
                defaultValue={16}
                required
                className="bg-gray-100/50 border-gray-200 text-gray-900"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1 block">参加費（円）</label>
              <Input
                name="entry_fee_jpy"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="0 = 無料"
                className="bg-gray-100/50 border-gray-200 text-gray-900 placeholder:text-gray-200"
              />
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={() => router.back()}
        >
          キャンセル
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-[#C8F400] hover:bg-[#DFFF5A] text-[#0E1100] font-bold"
          disabled={isPending}
        >
          {isPending ? "作成中..." : "イベントを作成"}
        </Button>
      </div>
    </form>
  );
}

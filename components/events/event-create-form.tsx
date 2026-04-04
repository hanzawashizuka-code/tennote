"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/actions/events";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trophy, Users, BookOpen } from "lucide-react";

const EVENT_TYPES = [
  { value: "tournament", label: "大会・トーナメント",    icon: Trophy,   desc: "公式・非公式の試合形式" },
  { value: "practice",   label: "練習会・オープン練習",  icon: Users,    desc: "気軽に参加できる練習" },
  { value: "clinic",     label: "クリニック・講習会",    icon: BookOpen, desc: "コーチ指導によるレッスン" },
];

const SKILL_LEVELS = [
  { value: "beginner",     label: "初級" },
  { value: "intermediate", label: "中級" },
  { value: "advanced",     label: "上級" },
  { value: "all",          label: "全レベル" },
];

const SURFACES = [
  { value: "hard",    label: "ハードコート" },
  { value: "clay",    label: "クレーコート" },
  { value: "grass",   label: "グラスコート" },
  { value: "carpet",  label: "カーペット" },
  { value: "indoor",  label: "インドア" },
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
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">

      {/* イベント種類 */}
      <div>
        <h3 className="text-sm font-bold text-gray-700 mb-3">イベント種類 <span className="text-red-400">*</span></h3>
        <div className="flex flex-col gap-2">
          {EVENT_TYPES.map((t) => {
            const Icon = t.icon;
            const active = eventType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setEventType(t.value)}
                className={`flex items-center gap-3 text-left px-4 py-3.5 rounded-2xl text-sm transition-all border ${
                  active
                    ? "bg-[#1B4FD8] text-white border-[#1B4FD8] shadow-lg shadow-[#1B4FD8]/20"
                    : "bg-white text-gray-600 border-blue-100 hover:border-[#1B4FD8] hover:text-gray-900"
                }`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${active ? "bg-white/20" : "bg-blue-50"}`}>
                  <Icon size={18} className={active ? "text-white" : "text-[#1B4FD8]"} />
                </div>
                <div>
                  <p className="font-semibold">{t.label}</p>
                  <p className={`text-xs mt-0.5 ${active ? "text-blue-200" : "text-gray-400"}`}>{t.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 基本情報 */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">基本情報</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">タイトル <span className="text-red-400">*</span></label>
            <Input
              name="title"
              placeholder="例: 初中級者向け練習会 in 代々木公園"
              required
              className="bg-blue-50/50 border-blue-100 focus:border-[#1B4FD8] text-gray-900 placeholder:text-gray-300"
            />
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">詳細・説明</label>
            <textarea
              name="description"
              placeholder="イベントの詳細、ルール、持ち物など..."
              rows={4}
              className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-300 resize-none focus:outline-none focus:border-[#1B4FD8]"
            />
          </div>
        </div>
      </div>

      {/* 日時・場所 */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">日時・場所</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">開催場所 <span className="text-red-400">*</span></label>
            <Input
              name="location"
              placeholder="例: 代々木公園テニスコート（東京都渋谷区）"
              required
              className="bg-blue-50/50 border-blue-100 focus:border-[#1B4FD8] text-gray-900 placeholder:text-gray-300"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1.5 block">開始日時 <span className="text-red-400">*</span></label>
              <input
                type="datetime-local"
                name="starts_at"
                required
                className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#1B4FD8] [color-scheme:light]"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1.5 block">終了日時</label>
              <input
                type="datetime-local"
                name="ends_at"
                className="w-full bg-blue-50/50 border border-blue-100 rounded-xl px-3 py-2.5 text-gray-900 text-sm focus:outline-none focus:border-[#1B4FD8] [color-scheme:light]"
              />
            </div>
          </div>
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">コートサーフェス</label>
            <div className="flex flex-wrap gap-2">
              {SURFACES.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSurface(s.value === surface ? "" : s.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    surface === s.value
                      ? "bg-[#1B4FD8] text-white"
                      : "bg-blue-50 text-gray-600 hover:text-[#1B4FD8]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 参加条件 */}
      <div className="bg-white rounded-2xl border border-blue-100 p-4">
        <h3 className="text-sm font-bold text-gray-700 mb-3">参加条件</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-gray-500 text-xs mb-1.5 block">対象レベル（複数選択可）</label>
            <div className="flex flex-wrap gap-2">
              {SKILL_LEVELS.map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSkill(s.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                    selectedSkills.includes(s.value)
                      ? "bg-[#1B4FD8] text-white"
                      : "bg-blue-50 text-gray-600 hover:text-[#1B4FD8]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs mb-1.5 block">定員 <span className="text-red-400">*</span></label>
              <Input
                name="max_participants"
                type="number"
                min={2}
                max={500}
                defaultValue={16}
                required
                className="bg-blue-50/50 border-blue-100 focus:border-[#1B4FD8] text-gray-900"
              />
            </div>
            <div>
              <label className="text-gray-500 text-xs mb-1.5 block">参加費（円）</label>
              <Input
                name="entry_fee_jpy"
                type="number"
                min={0}
                defaultValue={0}
                placeholder="0 = 無料"
                className="bg-blue-50/50 border-blue-100 focus:border-[#1B4FD8] text-gray-900 placeholder:text-gray-300"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
          キャンセル
        </Button>
        <Button type="submit" className="flex-1" disabled={isPending}>
          {isPending ? "作成中..." : "イベントを作成"}
        </Button>
      </div>
    </form>
  );
}

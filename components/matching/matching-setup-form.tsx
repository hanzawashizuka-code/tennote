"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateMatchProfile } from "@/actions/matching";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

const LOOKING_FOR_OPTIONS = [
  { value: "singles", label: "🎾 シングルス" },
  { value: "doubles", label: "🤝 ダブルス" },
  { value: "practice", label: "🏃 練習相手" },
  { value: "coach", label: "📚 コーチ希望" },
];

const TIME_OPTIONS = [
  { value: "morning", label: "朝" },
  { value: "afternoon", label: "昼" },
  { value: "evening", label: "夜" },
  { value: "any", label: "いつでも" },
];

interface Existing {
  looking_for: string[];
  preferred_time: string | null;
  preferred_area: string | null;
  message: string | null;
  is_visible: boolean;
}

export function MatchingSetupForm({ existing }: { existing: Existing | null }) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(!existing);
  const [selected, setSelected] = useState<string[]>(existing?.looking_for ?? []);

  if (!open && existing) {
    return (
      <Card className="p-3 flex items-center justify-between">
        <div className="text-gray-600 text-sm">
          {existing.is_visible ? "✅ マッチング公開中" : "非公開"} · {existing.looking_for.map((lf) => ({ singles: "シングルス", doubles: "ダブルス", practice: "練習", coach: "コーチ" }[lf] ?? lf)).join("・")}
        </div>
        <Button size="sm" variant="ghost" onClick={() => setOpen(true)}>編集</Button>
      </Card>
    );
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    selected.forEach((s) => fd.append("looking_for", s));
    const result = await updateMatchProfile(fd);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else { toast.success("マッチング設定を保存しました"); setOpen(false); }
  };

  return (
    <Card variant="strong" className="p-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <p className="text-gray-600 text-sm mb-2">何を探していますか？（複数選択可）</p>
          <div className="flex flex-wrap gap-2">
            {LOOKING_FOR_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSelected((prev) =>
                  prev.includes(opt.value) ? prev.filter((s) => s !== opt.value) : [...prev, opt.value]
                )}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm transition-all",
                  selected.includes(opt.value)
                    ? "bg-[#C8F400] text-[#0E1100]"
                    : "glass text-gray-500 hover:text-gray-900"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-600 text-sm mb-2">希望時間帯</p>
          <div className="flex gap-2 flex-wrap">
            {TIME_OPTIONS.map((opt) => (
              <label key={opt.value} className="flex items-center gap-1.5 cursor-pointer">
                <input type="radio" name="preferred_time" value={opt.value} defaultChecked={existing?.preferred_time === opt.value} className="accent-[#4A5C00]" />
                <span className="text-gray-600 text-sm">{opt.label}</span>
              </label>
            ))}
          </div>
        </div>

        <Input
          id="preferred_area"
          name="preferred_area"
          label="活動エリア（例：渋谷区、横浜市）"
          placeholder="東京都渋谷区"
          defaultValue={existing?.preferred_area ?? ""}
        />

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">自己PR</label>
          <textarea
            name="message"
            rows={3}
            placeholder="テニス歴・レベル・希望などをご記入ください"
            defaultValue={existing?.message ?? ""}
            className="w-full rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C8F400] text-sm resize-none"
          />
        </div>

        <div className="flex gap-2">
          <Button type="submit" loading={loading} className="flex-1">保存する</Button>
          {existing && <Button type="button" variant="ghost" onClick={() => setOpen(false)}>キャンセル</Button>}
        </div>
      </form>
    </Card>
  );
}

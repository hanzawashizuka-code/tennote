"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { updateProfile } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Profile } from "@/types";

const schema = z.object({
  display_name: z.string().min(1, "表示名を入力してください").max(50),
  bio: z.string().max(200, "200文字以内で入力してください").optional(),
  location: z.string().max(50).optional(),
  skill_level: z.enum(["beginner", "intermediate", "advanced", "pro"]).optional(),
  play_style: z.string().max(50).optional(),
});

type FormData = z.infer<typeof schema>;

const SKILL_LEVELS = [
  { value: "beginner", label: "初心者" },
  { value: "intermediate", label: "中級者" },
  { value: "advanced", label: "上級者" },
  { value: "pro", label: "プロ" },
];

export function SettingsForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: profile.display_name ?? "",
      bio: profile.bio ?? "",
      location: profile.location ?? "",
      skill_level: profile.skill_level ?? undefined,
      play_style: profile.play_style ?? "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const fd = new FormData();
    Object.entries(data).forEach(([k, v]) => { if (v) fd.set(k, v); });
    const result = await updateProfile(fd);
    setLoading(false);
    if (result.error) toast.error(result.error);
    else toast.success(result.success);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        id="display_name"
        label="表示名"
        error={errors.display_name?.message}
        {...register("display_name")}
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">自己紹介</label>
        <textarea
          {...register("bio")}
          rows={3}
          maxLength={200}
          className="w-full rounded-xl bg-gray-100 border border-gray-200 px-3 py-2 text-gray-900 placeholder:text-gray-300 focus:outline-none focus:border-[#C8F400] text-sm resize-none"
          placeholder="テニスへの思いや経歴を書いてください..."
        />
        {errors.bio && <p className="text-xs text-red-400">{errors.bio.message}</p>}
      </div>
      <Input id="location" label="活動エリア" placeholder="東京都渋谷区" {...register("location")} />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">レベル</label>
        <select
          {...register("skill_level")}
          className="h-10 rounded-xl bg-gray-100 border border-gray-200 px-3 text-gray-900 focus:outline-none focus:border-[#C8F400] text-sm"
        >
          <option value="" className="bg-white">選択してください</option>
          {SKILL_LEVELS.map((l) => (
            <option key={l.value} value={l.value} className="bg-white">{l.label}</option>
          ))}
        </select>
      </div>
      <Input id="play_style" label="プレースタイル" placeholder="ストローカー、サーブ＆ボレー など" {...register("play_style")} />
      <Button type="submit" loading={loading}>プロフィールを保存</Button>
    </form>
  );
}

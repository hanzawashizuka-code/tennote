"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const updates = {
    display_name: formData.get("display_name") as string,
    bio: formData.get("bio") as string,
    location: formData.get("location") as string,
    skill_level: formData.get("skill_level") as "beginner" | "intermediate" | "advanced" | "pro" | null,
    play_style: formData.get("play_style") as string,
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/profile");
  revalidatePath("/profile/settings");
  return { success: "プロフィールを更新しました" };
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const file = formData.get("avatar") as File;
  if (!file || file.size === 0) return { error: "ファイルが選択されていません" };
  if (file.size > 5 * 1024 * 1024) return { error: "ファイルサイズは5MB以下にしてください" };

  const ext = file.name.split(".").pop();
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true });

  if (uploadError) return { error: uploadError.message };

  const { data: { publicUrl } } = supabase.storage
    .from("avatars")
    .getPublicUrl(path);

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: publicUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) return { error: updateError.message };

  revalidatePath("/profile");
  revalidatePath("/profile/settings");
  return { success: "アバターを更新しました", url: publicUrl };
}

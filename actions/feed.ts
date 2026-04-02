"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createPost(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const content = ((formData.get("content") as string) ?? "").trim();
  const mediaUrlsRaw = formData.get("media_urls") as string;
  const mediaType = (formData.get("media_type") as string) || null;
  const media_urls: string[] = mediaUrlsRaw ? JSON.parse(mediaUrlsRaw) : [];

  if (!content && media_urls.length === 0) return { error: "投稿内容またはメディアを追加してください" };
  if (content.length > 1000) return { error: "1000文字以内で入力してください" };

  const { error } = await supabase
    .from("posts")
    .insert({ user_id: user.id, content, media_urls, media_type: mediaType || null } as never);

  if (error) return { error: error.message };

  revalidatePath("/feed");
  return { success: true };
}

export async function toggleLike(postId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "未認証です" };

  const { data: existing } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    await supabase.rpc("decrement_likes", { post_id: postId });
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
    await supabase.rpc("increment_likes", { post_id: postId });
  }

  revalidatePath("/feed");
  return { success: true };
}

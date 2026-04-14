"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Post, Profile } from "@/types";

type PostWithProfile = Post & {
  profiles: Pick<Profile, "display_name" | "username" | "avatar_url">;
};

export function useRealtimeFeed(initialPosts: PostWithProfile[]) {
  const [posts, setPosts] = useState<PostWithProfile[]>(initialPosts);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel("realtime-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          // 新しい投稿のプロフィールを取得
          const { data: profile } = await (supabase as any)
            .from("profiles")
            .select("display_name, username, avatar_url")
            .eq("id", payload.new.user_id)
            .single();

          if (profile) {
            const newPost = { ...payload.new, profiles: profile } as PostWithProfile;
            setPosts((prev) => [newPost, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return posts;
}

"use client";

import { useRealtimeFeed } from "@/hooks/use-realtime-feed";
import { PostCard } from "./post-card";
import type { Post, Profile } from "@/types";

type PostWithProfile = Post & {
  profiles: Pick<Profile, "display_name" | "username" | "avatar_url">;
};

interface FeedListProps {
  initialPosts: PostWithProfile[];
  currentUserId: string;
  likedPostIds: string[];
}

export function FeedList({ initialPosts, currentUserId, likedPostIds }: FeedListProps) {
  const posts = useRealtimeFeed(initialPosts);

  if (posts.length === 0) {
    return (
      <div className="text-center text-gray-300 py-12 text-sm">
        まだ投稿がありません。最初の投稿をしてみましょう！
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
          liked={likedPostIds.includes(post.id)}
        />
      ))}
    </div>
  );
}

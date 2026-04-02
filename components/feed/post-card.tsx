"use client";

import { useState } from "react";
import { Heart, Play } from "lucide-react";
import { toggleLike } from "@/actions/feed";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";
import type { Post, Profile } from "@/types";

interface PostCardProps {
  post: Post & {
    profiles: Pick<Profile, "display_name" | "username" | "avatar_url">;
    media_urls?: string[];
    media_type?: string | null;
  };
  currentUserId: string;
  liked: boolean;
}

function MediaGrid({ urls, type }: { urls: string[]; type: string | null | undefined }) {
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  if (!urls || urls.length === 0) return null;

  const gridClass =
    urls.length === 1
      ? "grid-cols-1"
      : urls.length === 2
      ? "grid-cols-2"
      : "grid-cols-2";

  return (
    <div className={`grid gap-1.5 mt-2 rounded-2xl overflow-hidden ${gridClass}`}>
      {urls.slice(0, 4).map((url, i) => {
        if (type === "video") {
          return activeVideo === i ? (
            <video
              key={i}
              src={url}
              controls
              autoPlay
              className={cn("w-full object-cover bg-black", urls.length === 1 ? "max-h-80" : "aspect-video")}
            />
          ) : (
            <button
              key={i}
              onClick={() => setActiveVideo(i)}
              className={cn(
                "relative w-full bg-gray-900 flex items-center justify-center group",
                urls.length === 1 ? "aspect-video max-h-80" : "aspect-video"
              )}
            >
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-all" />
              <div className="relative z-10 w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                <Play size={22} className="text-gray-900 ml-0.5" fill="currentColor" />
              </div>
              {urls.length > 4 && i === 3 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                  <span className="text-white font-bold text-xl">+{urls.length - 4}</span>
                </div>
              )}
            </button>
          );
        }

        // image
        return (
          <div key={i} className={cn("relative overflow-hidden", urls.length === 1 ? "max-h-80" : "aspect-square")}>
            <img
              src={url}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
            {urls.length > 4 && i === 3 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-xl">+{urls.length - 4}</span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function PostCard({ post, currentUserId: _currentUserId, liked: initialLiked }: PostCardProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count);

  const handleLike = async () => {
    setLiked(!liked);
    setLikesCount(liked ? likesCount - 1 : likesCount + 1);
    await toggleLike(post.id);
  };

  return (
    <Card className="animate-fade-in">
      <div className="flex items-start gap-3">
        <Avatar
          src={post.profiles.avatar_url}
          name={post.profiles.display_name ?? post.profiles.username}
          size="md"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900 text-sm">
              {post.profiles.display_name ?? post.profiles.username}
            </span>
            <span className="text-gray-300 text-xs">
              {formatRelativeTime(post.created_at)}
            </span>
          </div>

          {post.content && (
            <p className="text-gray-700 text-sm mt-1 whitespace-pre-wrap">{post.content}</p>
          )}

          <MediaGrid urls={post.media_urls ?? []} type={post.media_type} />

          <button
            onClick={handleLike}
            className={cn(
              "flex items-center gap-1 mt-3 text-xs transition-colors",
              liked ? "text-red-400" : "text-gray-300 hover:text-red-400"
            )}
          >
            <Heart size={14} fill={liked ? "currentColor" : "none"} />
            {likesCount}
          </button>
        </div>
      </div>
    </Card>
  );
}

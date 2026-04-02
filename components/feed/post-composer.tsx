"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createPost } from "@/actions/feed";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MediaUploader } from "./media-uploader";

interface MediaItem {
  url: string;
  type: "image" | "video";
  name: string;
}

export function PostComposer() {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;
    setLoading(true);
    const fd = new FormData();
    fd.set("content", content);
    fd.set("media_urls", JSON.stringify(media.map((m) => m.url)));
    fd.set("media_type", media.length > 0 ? media[0].type : "");
    const result = await createPost(fd);
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      setContent("");
      setMedia([]);
      toast.success("投稿しました！");
    }
  };

  const canPost = content.trim().length > 0 || media.length > 0;

  return (
    <Card className="mb-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="練習・試合の様子を投稿しましょう…"
          maxLength={1000}
          rows={3}
          className="w-full bg-transparent text-gray-900 placeholder:text-gray-300 resize-none focus:outline-none text-sm"
        />

        <MediaUploader onUpload={setMedia} maxFiles={4} />

        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-300">{content.length}/1000</span>
          <Button type="submit" loading={loading} size="sm" disabled={!canPost}>
            投稿
          </Button>
        </div>
      </form>
    </Card>
  );
}

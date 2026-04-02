"use client";

import { useRef, useState } from "react";
import { Image, Video, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface UploadedMedia {
  url: string;
  type: "image" | "video";
  name: string;
}

interface MediaUploaderProps {
  onUpload: (media: UploadedMedia[]) => void;
  maxFiles?: number;
}

const MAX_IMAGE_MB = 10;
const MAX_VIDEO_MB = 50;

export function MediaUploader({ onUpload, maxFiles = 4 }: MediaUploaderProps) {
  const [items, setItems] = useState<(UploadedMedia & { preview?: string })[]>([]);
  const [uploading, setUploading] = useState(false);
  const imgRef = useRef<HTMLInputElement>(null);
  const vidRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File, type: "image" | "video") => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("未認証");

    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("post-media").upload(path, file);
    if (error) throw error;

    const { data } = supabase.storage.from("post-media").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleFiles = async (files: FileList, type: "image" | "video") => {
    if (items.length >= maxFiles) return;
    const remaining = maxFiles - items.length;
    const toProcess = Array.from(files).slice(0, remaining);
    setUploading(true);

    const newItems: (UploadedMedia & { preview?: string })[] = [];

    for (const file of toProcess) {
      const limitMB = type === "image" ? MAX_IMAGE_MB : MAX_VIDEO_MB;
      if (file.size > limitMB * 1024 * 1024) {
        alert(`${file.name} は${limitMB}MBを超えています`);
        continue;
      }
      try {
        const url = await upload(file, type);
        const preview = type === "image" ? URL.createObjectURL(file) : undefined;
        newItems.push({ url, type, name: file.name, preview });
      } catch (e) {
        alert(`${file.name} のアップロードに失敗しました`);
      }
    }

    const updated = [...items, ...newItems];
    setItems(updated);
    onUpload(updated.map(({ url, type, name }) => ({ url, type, name })));
    setUploading(false);
  };

  const remove = (i: number) => {
    const updated = items.filter((_, idx) => idx !== i);
    setItems(updated);
    onUpload(updated.map(({ url, type, name }) => ({ url, type, name })));
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Previews */}
      {items.length > 0 && (
        <div className={`grid gap-2 ${items.length === 1 ? "grid-cols-1" : "grid-cols-2"}`}>
          {items.map((item, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden aspect-video bg-gray-100">
              {item.type === "image" && item.preview ? (
                <img src={item.preview} alt="" className="w-full h-full object-cover" />
              ) : item.type === "video" ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-900/10">
                  <Video size={28} className="text-gray-500" />
                  <span className="text-xs text-gray-500 ml-2 truncate max-w-[80px]">{item.name}</span>
                </div>
              ) : null}
              <button
                onClick={() => remove(i)}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 flex items-center justify-center hover:bg-black/80"
              >
                <X size={12} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload buttons */}
      {items.length < maxFiles && (
        <div className="flex items-center gap-2">
          <input
            ref={imgRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files, "image")}
          />
          <input
            ref={vidRef}
            type="file"
            accept="video/*"
            multiple
            className="hidden"
            onChange={(e) => e.target.files && handleFiles(e.target.files, "video")}
          />

          {uploading ? (
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Loader2 size={16} className="animate-spin" />
              アップロード中...
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => imgRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 text-sm transition-all"
              >
                <Image size={16} />
                写真
              </button>
              <button
                type="button"
                onClick={() => vidRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 text-gray-500 hover:text-gray-900 hover:bg-gray-200 text-sm transition-all"
              >
                <Video size={16} />
                動画
              </button>
              {items.length > 0 && (
                <span className="text-xs text-gray-300 ml-auto">{items.length}/{maxFiles}</span>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

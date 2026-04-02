"use client";

import { useState } from "react";
import { toast } from "sonner";
import { uploadAvatar } from "@/actions/profile";

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (file: File) => {
    if (!file) return;

    // Preview
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    const fd = new FormData();
    fd.set("avatar", file);
    const result = await uploadAvatar(fd);
    setUploading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("アバターを更新しました");
    }
  };

  return { uploading, previewUrl, handleFileChange };
}

"use client";

import { useRef } from "react";
import { Camera } from "lucide-react";
import { useAvatarUpload } from "@/hooks/use-avatar-upload";
import { Avatar } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";

interface AvatarUploadProps {
  currentUrl?: string | null;
  name?: string | null;
}

export function AvatarUpload({ currentUrl, name }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { uploading, previewUrl, handleFileChange } = useAvatarUpload();

  return (
    <div className="relative inline-block">
      <Avatar src={previewUrl ?? currentUrl} name={name} size="xl" />
      <button
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#4A5C00] flex items-center justify-center border-2 border-[#0E1100] hover:bg-[#6B7F00] transition-colors"
        disabled={uploading}
      >
        {uploading ? <Spinner size="sm" /> : <Camera size={12} className="text-gray-900" />}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFileChange(file);
        }}
      />
    </div>
  );
}

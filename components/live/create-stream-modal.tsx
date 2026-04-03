"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Radio } from "lucide-react";
import { toast } from "sonner";
import { createStream } from "@/actions/live";

interface CreateStreamModalProps {
  userId: string;
}

export function CreateStreamModal({ userId }: CreateStreamModalProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) { toast.error("タイトルを入力してください"); return; }
    setLoading(true);

    const result = await createStream(title, description || undefined);
    setLoading(false);

    if (result.error) { toast.error(result.error); return; }
    toast.success("配信ルームを作成しました！");
    router.push(`/live/${result.data!.id}`);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-[#1B4FD8] text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-[#1E40AF] transition-all shadow-lg shadow-[#1B4FD8]/25"
      >
        <Plus size={16} />
        配信を始める
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Radio size={18} className="text-[#1B4FD8]" />
                </div>
                <h2 className="text-lg font-black text-gray-900">ライブ配信を作成</h2>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-900 transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  タイトル <span className="text-red-400">*</span>
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例：サーブ練習ライブ・練習試合を配信します"
                  className="w-full h-11 bg-blue-50 rounded-xl px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/30"
                  required
                  maxLength={60}
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">
                  説明（任意）
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="どんな内容を配信するか教えてください"
                  rows={3}
                  className="w-full bg-blue-50 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-[#1B4FD8]/30"
                  maxLength={200}
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                📸 配信を開始するには、カメラとマイクへのアクセスを許可してください
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 h-11 rounded-xl border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  disabled={loading || !title.trim()}
                  className="flex-1 h-11 rounded-xl bg-[#1B4FD8] text-white font-bold text-sm hover:bg-[#1E40AF] transition-colors disabled:opacity-50 shadow-lg shadow-[#1B4FD8]/25"
                >
                  {loading ? "作成中..." : "配信ルームを作成"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

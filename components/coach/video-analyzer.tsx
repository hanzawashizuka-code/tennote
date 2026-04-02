"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, Video, Loader2, ChevronDown, ChevronUp, Play } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

const SHOT_TYPES = ["フォアハンド", "バックハンド", "サーブ", "ボレー", "スマッシュ", "その他"];
const MAX_FRAMES = 10;
const MAX_SIZE_MB = 100;

async function extractFrames(file: File, count: number): Promise<string[]> {
  return new Promise((resolve, reject) => {
    const video = document.createElement("video");
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    const url = URL.createObjectURL(file);
    video.src = url;
    video.muted = true;
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const W = Math.min(video.videoWidth, 960);
      const H = Math.round(W * (video.videoHeight / video.videoWidth));
      canvas.width = W;
      canvas.height = H;

      const duration = video.duration;
      const frames: string[] = [];
      let idx = 0;

      const next = () => {
        if (idx >= count) { URL.revokeObjectURL(url); resolve(frames); return; }
        const t = (duration / (count + 1)) * (idx + 1);
        video.currentTime = Math.min(t, duration - 0.05);
      };

      video.onseeked = () => {
        ctx.drawImage(video, 0, 0, W, H);
        frames.push(canvas.toDataURL("image/jpeg", 0.72));
        idx++;
        next();
      };

      video.onerror = reject;
      next();
    };

    video.onerror = reject;
    video.load();
  });
}

export function VideoAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [shotType, setShotType] = useState("");
  const [context, setContext] = useState("");
  const [step, setStep] = useState<"upload" | "options" | "extracting" | "analyzing" | "result">("upload");
  const [progress, setProgress] = useState(0);
  const [analysis, setAnalysis] = useState("");
  const [expandedSections, setExpandedSections] = useState<Record<number, boolean>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`ファイルサイズは${MAX_SIZE_MB}MB以内にしてください`);
      return;
    }
    if (!f.type.startsWith("video/")) {
      alert("動画ファイルを選択してください");
      return;
    }
    setFile(f);
    setVideoUrl(URL.createObjectURL(f));
    setStep("options");
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const analyze = async () => {
    if (!file) return;
    setStep("extracting");
    setProgress(10);

    let frames: string[];
    try {
      frames = await extractFrames(file, MAX_FRAMES);
      setProgress(50);
    } catch {
      alert("フレーム抽出に失敗しました");
      setStep("options");
      return;
    }

    setStep("analyzing");
    setProgress(70);

    try {
      const res = await fetch("/api/coach/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames, context, shotType }),
      });
      const data = await res.json();
      setProgress(100);
      if (data.analysis) {
        setAnalysis(data.analysis);
        setStep("result");
      } else {
        throw new Error(data.error || "Unknown error");
      }
    } catch (err) {
      alert("分析に失敗しました。もう一度お試しください。");
      setStep("options");
    }
  };

  const reset = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setFile(null); setVideoUrl(null); setShotType(""); setContext("");
    setAnalysis(""); setStep("upload"); setProgress(0);
  };

  // 分析結果をセクション分け（---区切り or 改行2行）
  const sections = analysis
    .split(/\n(?=#{1,3}\s|[①-⑩]|\d+\.|■|【)/)
    .filter(Boolean);

  // ── UPLOAD ──
  if (step === "upload") {
    return (
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center cursor-pointer hover:border-[#C8F400] hover:bg-[#C8F400]/5 transition-all"
      >
        <input
          ref={fileRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        <div className="w-16 h-16 rounded-2xl bg-[#C8F400]/15 flex items-center justify-center mx-auto mb-4">
          <Video size={32} className="text-[#4A5C00]" />
        </div>
        <p className="text-gray-700 font-semibold mb-1">動画をドラッグ＆ドロップ</p>
        <p className="text-gray-400 text-sm">または クリックしてファイルを選択</p>
        <p className="text-gray-300 text-xs mt-3">MP4・MOV・AVI 対応 ／ 最大{MAX_SIZE_MB}MB</p>
      </div>
    );
  }

  // ── OPTIONS ──
  if (step === "options") {
    return (
      <div className="flex flex-col gap-4 animate-fade-in">
        {videoUrl && (
          <div className="rounded-2xl overflow-hidden bg-black">
            <video src={videoUrl} controls className="w-full max-h-64 object-contain" />
          </div>
        )}

        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-3">ショットの種類</h3>
          <div className="flex flex-wrap gap-2">
            {SHOT_TYPES.map((s) => (
              <button
                key={s}
                onClick={() => setShotType(s === shotType ? "" : s)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-sm transition-all",
                  shotType === s
                    ? "bg-gray-900 text-[#C8F400] font-semibold"
                    : "bg-gray-100 text-gray-500 hover:text-gray-900"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-2">コーチへのメモ（任意）</h3>
          <textarea
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="気になる点や改善したいポイントを入力（例：バックハンドの打点が安定しない）"
            rows={3}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-gray-900 text-sm placeholder:text-gray-400 resize-none focus:outline-none focus:ring-1 focus:ring-[#C8F400]"
          />
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" onClick={reset} className="flex-1">
            やり直す
          </Button>
          <Button onClick={analyze} className="flex-2 flex-grow">
            🎾 AI分析スタート
          </Button>
        </div>
      </div>
    );
  }

  // ── EXTRACTING / ANALYZING ──
  if (step === "extracting" || step === "analyzing") {
    return (
      <div className="flex flex-col items-center gap-6 py-12 animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-[#C8F400]/15 flex items-center justify-center">
          <Loader2 size={40} className="text-[#4A5C00] animate-spin" />
        </div>
        <div className="text-center">
          <p className="text-gray-900 font-semibold text-lg">
            {step === "extracting" ? "📽️ フレームを抽出中..." : "🤖 AIが分析中..."}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            {step === "extracting"
              ? "動画からキーフレームを取得しています"
              : "プロコーチAIがフォームを詳細分析しています"}
          </p>
        </div>
        <div className="w-64 bg-gray-100 rounded-full h-2">
          <div
            className="h-2 bg-[#C8F400] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs">{progress}%</p>
      </div>
    );
  }

  // ── RESULT ──
  return (
    <div className="flex flex-col gap-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge>AI分析完了</Badge>
          {shotType && <Badge variant="outline">{shotType}</Badge>}
        </div>
        <button onClick={reset} className="text-xs text-gray-400 hover:text-gray-700 underline">
          新しい動画を分析
        </button>
      </div>

      {videoUrl && (
        <div className="rounded-2xl overflow-hidden bg-black">
          <video src={videoUrl} controls className="w-full max-h-52 object-contain" />
        </div>
      )}

      <Card variant="strong" className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#C8F400] flex items-center justify-center flex-shrink-0">
            <span className="text-[#111110] font-black text-base">T</span>
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">AIコーチからのフィードバック</p>
            <p className="text-gray-400 text-xs">{MAX_FRAMES}フレームを分析しました</p>
          </div>
        </div>

        {sections.length > 1 ? (
          <div className="flex flex-col gap-2">
            {sections.map((section, i) => {
              const firstLine = section.split("\n")[0].replace(/^#{1,3}\s/, "").trim();
              const rest = section.split("\n").slice(1).join("\n").trim();
              const isOpen = expandedSections[i] !== false;
              return (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden">
                  <button
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-sm font-semibold text-gray-800 hover:bg-gray-50"
                    onClick={() => setExpandedSections(p => ({ ...p, [i]: !isOpen }))}
                  >
                    {firstLine}
                    {isOpen ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </button>
                  {isOpen && rest && (
                    <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap border-t border-gray-100">
                      {rest}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {analysis}
          </div>
        )}
      </Card>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { completeOnboarding } from "@/actions/onboarding";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

// --- Types ---
interface WizardData {
  display_name: string;
  height_cm: string;
  weight_kg: string;
  dominant_hand: "right" | "left";
  years_playing: string;
  location: string;
  score_serve: number;
  score_forehand: number;
  score_backhand: number;
  score_volley: number;
  score_footwork: number;
  score_physical: number;
  score_mental: number;
  strengths: string[];
  weaknesses: string[];
  goal_short: string;
  goal_long: string;
}

const SKILLS = [
  { key: "score_serve",     label: "サーブ",           emoji: "🎯" },
  { key: "score_forehand",  label: "フォアハンド",      emoji: "💪" },
  { key: "score_backhand",  label: "バックハンド",      emoji: "🔄" },
  { key: "score_volley",    label: "ボレー・ネット",     emoji: "🏃" },
  { key: "score_footwork",  label: "フットワーク",      emoji: "👟" },
  { key: "score_physical",  label: "フィジカル・体力",  emoji: "💪" },
  { key: "score_mental",    label: "メンタル",          emoji: "🧠" },
] as const;

const PLAY_ATTRIBUTES = [
  "サーブ", "フォアハンド", "バックハンド", "ボレー",
  "スマッシュ", "フットワーク", "スタミナ", "メンタル",
  "スピン", "スライス", "ロブ", "ドロップショット",
];

const YEARS_OPTIONS = [
  { value: "under1",  label: "1年未満" },
  { value: "1to3",    label: "1〜3年" },
  { value: "3to7",    label: "3〜7年" },
  { value: "over7",   label: "7年以上" },
];

const GOAL_SHORT_OPTIONS = [
  "サーブを安定させる", "バックハンドを強化する", "試合で勝てるようになる",
  "ボレーを上達させる", "フットワークを改善する", "スタミナをつける",
  "大会に初出場する", "週3回練習習慣をつける",
];

const GOAL_LONG_OPTIONS = [
  "市民大会で優勝する", "中級クラスに上がる", "上級者と打ち合えるようになる",
  "テニスを生涯スポーツにする", "コーチ資格を取る", "ダブルスで活躍する",
];

// --- Mini Radar Chart for result step ---
function MiniRadar({ scores }: { scores: Record<string, number> }) {
  const SIZE = 160;
  const CX = SIZE / 2;
  const CY = SIZE / 2;
  const R = 60;
  const keys = ["score_serve","score_forehand","score_backhand","score_volley","score_footwork","score_physical","score_mental"];
  const labels = ["サーブ","FH","BH","ボレー","走力","体力","心"];
  const n = keys.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, r: number) => ({
    x: CX + r * Math.cos(angle(i)),
    y: CY + r * Math.sin(angle(i)),
  });
  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];
  const dataPoints = keys.map((k, i) => {
    const ratio = (scores[k] ?? 3) / 5;
    return point(i, R * ratio);
  });
  const polygon = dataPoints.map((p) => `${p.x},${p.y}`).join(" ");

  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {gridLevels.map((lv) => {
        const pts = keys.map((_, i) => point(i, R * lv));
        return (
          <polygon
            key={lv}
            points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
            fill="none"
            stroke="#BFDBFE"
            strokeWidth="1"
          />
        );
      })}
      {keys.map((_, i) => {
        const p = point(i, R);
        return <line key={i} x1={CX} y1={CY} x2={p.x} y2={p.y} stroke="#BFDBFE" strokeWidth="1" />;
      })}
      <polygon points={polygon} fill="#1B4FD8" fillOpacity="0.25" stroke="#1B4FD8" strokeWidth="2" />
      {labels.map((lb, i) => {
        const p = point(i, R + 14);
        return (
          <text key={i} x={p.x} y={p.y} textAnchor="middle" dominantBaseline="middle"
            fontSize="8" fill="#64748B" fontWeight="600">{lb}</text>
        );
      })}
    </svg>
  );
}

// --- Level badge computed from average score ---
function getLevel(scores: Record<string, number>) {
  const keys = ["score_serve","score_forehand","score_backhand","score_volley","score_footwork","score_physical","score_mental"];
  const avg = keys.reduce((s, k) => s + (scores[k] ?? 3), 0) / keys.length;
  if (avg < 2) return { label: "初心者", color: "bg-green-100 text-green-700", desc: "これからテニスの基礎を身につけましょう！" };
  if (avg < 3) return { label: "初中級", color: "bg-blue-100 text-blue-700", desc: "基礎が固まってきました。安定感を磨きましょう！" };
  if (avg < 4) return { label: "中級者", color: "bg-[#1B4FD8]/10 text-[#1B4FD8]", desc: "テニスの楽しさを存分に味わえるレベルです！" };
  return { label: "上級者", color: "bg-[#C8F400]/30 text-[#4A5C00]", desc: "高いレベルで安定したプレーができています！" };
}

// --- Main Wizard ---
export function OnboardingWizard({
  userId,
  initialName,
  initialLocation,
}: {
  userId: string;
  initialName: string;
  initialLocation: string;
}) {
  const [step, setStep] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<WizardData>({
    display_name: initialName,
    height_cm: "",
    weight_kg: "",
    dominant_hand: "right",
    years_playing: "",
    location: initialLocation,
    score_serve: 3,
    score_forehand: 3,
    score_backhand: 3,
    score_volley: 3,
    score_footwork: 3,
    score_physical: 3,
    score_mental: 3,
    strengths: [],
    weaknesses: [],
    goal_short: "",
    goal_long: "",
  });

  const TOTAL_STEPS = 5; // 0=welcome,1=basic,2=skills,3=style,4=goals  (result is step 5 after submit)
  const [submitted, setSubmitted] = useState(false);

  const set = (key: keyof WizardData, value: any) =>
    setData((prev) => ({ ...prev, [key]: value }));

  const toggleAttr = (arr: string[], key: "strengths" | "weaknesses", val: string) => {
    const cur = data[key];
    if (cur.includes(val)) {
      set(key, cur.filter((x) => x !== val));
    } else if (cur.length < 3) {
      set(key, [...cur, val]);
    }
  };

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await completeOnboarding({
        ...data,
        height_cm: data.height_cm ? parseInt(data.height_cm) : null,
        weight_kg: data.weight_kg ? parseFloat(data.weight_kg) : null,
      });
      if (result?.error) {
        toast.error(result.error);
      } else {
        setSubmitted(true);
        setStep(5);
      }
    });
  };

  // Progress bar
  const progress = submitted ? 100 : Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Header */}
      <div className="px-5 pt-safe-top pt-6 pb-4 bg-white border-b border-blue-100">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Logo inline */}
              <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                <rect x="2.5" y="2.5" width="35" height="35" rx="11" fill="white" stroke="#1B4FD8" strokeWidth="2.5"/>
                <text x="20" y="29" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" fill="#1B4FD8" fontStyle="italic">Tn</text>
                <circle cx="33" cy="7" r="4.5" fill="#C8F400"/>
              </svg>
              <span className="text-[#1B4FD8] font-bold text-lg" style={{ fontFamily: "'Dancing Script', cursive" }}>Tennote</span>
            </div>
            <span className="text-xs text-gray-400">
              {step < 5 ? `${step + 1} / ${TOTAL_STEPS + 1}` : "完了"}
            </span>
          </div>
          {/* Progress bar */}
          <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#1B4FD8] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-5 py-8">

          {/* Step 0: Welcome */}
          {step === 0 && (
            <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
              <div className="w-24 h-24 rounded-3xl bg-[#EEF6FF] border-2 border-blue-200 flex items-center justify-center">
                <svg width="56" height="56" viewBox="0 0 40 40" fill="none">
                  <rect x="2.5" y="2.5" width="35" height="35" rx="11" fill="white" stroke="#1B4FD8" strokeWidth="2.5"/>
                  <text x="20" y="29" textAnchor="middle" fontFamily="Georgia,serif" fontSize="22" fontWeight="700" fill="#1B4FD8" fontStyle="italic">Tn</text>
                  <circle cx="33" cy="7" r="4.5" fill="#C8F400"/>
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-black text-gray-900 mb-3">
                  Tennoteへようこそ！🎾
                </h1>
                <p className="text-gray-500 text-base leading-relaxed">
                  あなた専用のテニス成長日記を始めましょう。<br />
                  いくつか質問に答えるだけで、<br />
                  <strong className="text-gray-900">今の自分のレベルと成長ロードマップ</strong>がわかります。
                </p>
              </div>
              <div className="flex flex-col gap-2 w-full text-left">
                {[
                  { icon: "👤", text: "基本プロフィールを設定" },
                  { icon: "🎯", text: "7つのスキルを自己評価" },
                  { icon: "💪", text: "得意・苦手を把握" },
                  { icon: "📈", text: "現在地と目標を可視化" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-blue-100">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm text-gray-700 font-medium">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-gray-900">基本情報</h2>
                <p className="text-gray-500 text-sm mt-1">AIコーチがあなたに合ったアドバイスをするために使います</p>
              </div>

              <div className="flex flex-col gap-4">
                <Field label="表示名" required>
                  <input
                    value={data.display_name}
                    onChange={(e) => set("display_name", e.target.value)}
                    placeholder="ニックネームでもOK"
                    className="field-input"
                  />
                </Field>

                <Field label="居住地">
                  <input
                    value={data.location}
                    onChange={(e) => set("location", e.target.value)}
                    placeholder="例：東京都、大阪府"
                    className="field-input"
                  />
                </Field>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="身長 (cm)">
                    <input
                      type="number"
                      value={data.height_cm}
                      onChange={(e) => set("height_cm", e.target.value)}
                      placeholder="170"
                      min={100} max={220}
                      className="field-input"
                    />
                  </Field>
                  <Field label="体重 (kg)">
                    <input
                      type="number"
                      value={data.weight_kg}
                      onChange={(e) => set("weight_kg", e.target.value)}
                      placeholder="65"
                      min={30} max={200}
                      className="field-input"
                    />
                  </Field>
                </div>

                <Field label="利き手">
                  <div className="flex gap-3">
                    {[{ value: "right", label: "右利き" }, { value: "left", label: "左利き" }].map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("dominant_hand", value)}
                        className={`flex-1 h-11 rounded-xl font-semibold text-sm transition-all ${
                          data.dominant_hand === value
                            ? "bg-[#1B4FD8] text-white shadow-lg shadow-[#1B4FD8]/25"
                            : "bg-blue-50 text-gray-600 hover:text-[#1B4FD8]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="テニス歴" required>
                  <div className="grid grid-cols-2 gap-2">
                    {YEARS_OPTIONS.map(({ value, label }) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => set("years_playing", value)}
                        className={`h-11 rounded-xl font-semibold text-sm transition-all ${
                          data.years_playing === value
                            ? "bg-[#1B4FD8] text-white shadow-lg shadow-[#1B4FD8]/25"
                            : "bg-blue-50 text-gray-600 hover:text-[#1B4FD8]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </div>
          )}

          {/* Step 2: Skills */}
          {step === 2 && (
            <div className="flex flex-col gap-5 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-gray-900">スキル自己評価</h2>
                <p className="text-gray-500 text-sm mt-1">今の自分を正直に評価してください。1=かなり苦手 / 5=とても得意</p>
              </div>

              <div className="flex flex-col gap-4">
                {SKILLS.map(({ key, label, emoji }) => (
                  <div key={key} className="bg-white rounded-2xl border border-blue-100 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-gray-900">{emoji} {label}</span>
                      <span className="text-sm font-black text-[#1B4FD8]">{(data as any)[key]} / 5</span>
                    </div>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((v) => (
                        <button
                          key={v}
                          type="button"
                          onClick={() => set(key as keyof WizardData, v)}
                          className={`flex-1 h-10 rounded-xl font-bold text-sm transition-all ${
                            (data as any)[key] >= v
                              ? "bg-[#1B4FD8] text-white shadow-sm"
                              : "bg-blue-50 text-gray-400"
                          }`}
                        >
                          {v}
                        </button>
                      ))}
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                      <span>かなり苦手</span><span>とても得意</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Strengths & Weaknesses */}
          {step === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-gray-900">得意・苦手</h2>
                <p className="text-gray-500 text-sm mt-1">それぞれ最大3つまで選択</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-[#1B4FD8] mb-2">💪 自分の武器（最大3つ）</h3>
                <div className="flex flex-wrap gap-2">
                  {PLAY_ATTRIBUTES.map((attr) => {
                    const selected = data.strengths.includes(attr);
                    return (
                      <button
                        key={attr}
                        type="button"
                        onClick={() => toggleAttr(data.strengths, "strengths", attr)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selected
                            ? "bg-[#1B4FD8] text-white shadow-sm"
                            : "bg-white border border-blue-100 text-gray-600 hover:border-[#1B4FD8]"
                        } ${!selected && data.strengths.length >= 3 ? "opacity-40 cursor-not-allowed" : ""}`}
                        disabled={!selected && data.strengths.length >= 3}
                      >
                        {attr}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-orange-500 mb-2">🎯 克服したいこと（最大3つ）</h3>
                <div className="flex flex-wrap gap-2">
                  {PLAY_ATTRIBUTES.map((attr) => {
                    const selected = data.weaknesses.includes(attr);
                    return (
                      <button
                        key={attr}
                        type="button"
                        onClick={() => toggleAttr(data.weaknesses, "weaknesses", attr)}
                        className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                          selected
                            ? "bg-orange-500 text-white shadow-sm"
                            : "bg-white border border-blue-100 text-gray-600 hover:border-orange-300"
                        } ${!selected && data.weaknesses.length >= 3 ? "opacity-40 cursor-not-allowed" : ""}`}
                        disabled={!selected && data.weaknesses.length >= 3}
                      >
                        {attr}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="flex flex-col gap-6 animate-fade-in">
              <div>
                <h2 className="text-2xl font-black text-gray-900">目標を設定しよう</h2>
                <p className="text-gray-500 text-sm mt-1">AIコーチがあなたの目標に合わせたアドバイスをします</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">🎯 短期目標（3ヶ月以内）</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {GOAL_SHORT_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set("goal_short", g)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        data.goal_short === g
                          ? "bg-[#1B4FD8] text-white"
                          : "bg-white border border-blue-100 text-gray-600 hover:border-[#1B4FD8]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <input
                  value={GOAL_SHORT_OPTIONS.includes(data.goal_short) ? "" : data.goal_short}
                  onChange={(e) => set("goal_short", e.target.value)}
                  placeholder="または自由に入力..."
                  className="field-input"
                />
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-700 mb-2">🏆 長期目標（1年後）</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {GOAL_LONG_OPTIONS.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => set("goal_long", g)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                        data.goal_long === g
                          ? "bg-[#1B4FD8] text-white"
                          : "bg-white border border-blue-100 text-gray-600 hover:border-[#1B4FD8]"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
                <input
                  value={GOAL_LONG_OPTIONS.includes(data.goal_long) ? "" : data.goal_long}
                  onChange={(e) => set("goal_long", e.target.value)}
                  placeholder="または自由に入力..."
                  className="field-input"
                />
              </div>
            </div>
          )}

          {/* Step 5: Result */}
          {step === 5 && (
            <div className="flex flex-col items-center gap-6 text-center animate-fade-in">
              <div className="w-16 h-16 rounded-full bg-[#1B4FD8] flex items-center justify-center shadow-lg shadow-[#1B4FD8]/30">
                <Check size={32} className="text-white" strokeWidth={3} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">診断完了！</h2>
                <p className="text-gray-500 text-sm mt-1">あなたの現在のテニスレベルです</p>
              </div>

              {/* Level badge */}
              {(() => {
                const level = getLevel(data as any);
                return (
                  <div className={`px-6 py-3 rounded-2xl font-black text-xl ${level.color}`}>
                    {level.label}
                  </div>
                );
              })()}

              {/* Radar chart */}
              <MiniRadar scores={data as any} />

              {/* Strengths & Weaknesses summary */}
              <div className="w-full grid grid-cols-2 gap-3 text-left">
                <div className="bg-blue-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#1B4FD8] mb-2">💪 あなたの武器</p>
                  {data.strengths.length > 0
                    ? data.strengths.map((s) => (
                        <p key={s} className="text-sm text-gray-700">• {s}</p>
                      ))
                    : <p className="text-sm text-gray-400">未設定</p>}
                </div>
                <div className="bg-orange-50 rounded-2xl p-4">
                  <p className="text-xs font-bold text-orange-500 mb-2">🎯 克服したいこと</p>
                  {data.weaknesses.length > 0
                    ? data.weaknesses.map((w) => (
                        <p key={w} className="text-sm text-gray-700">• {w}</p>
                      ))
                    : <p className="text-sm text-gray-400">未設定</p>}
                </div>
              </div>

              {/* AI message */}
              {(() => {
                const level = getLevel(data as any);
                return (
                  <div className="w-full bg-white rounded-2xl border border-blue-100 p-4 text-left">
                    <p className="text-xs font-bold text-[#1B4FD8] mb-1">🤖 AIコーチより</p>
                    <p className="text-sm text-gray-700">{level.desc} Tennoteでの練習記録を続けることで、あなたの成長をリアルタイムで可視化していきます！</p>
                  </div>
                );
              })()}

              <a
                href="/feed"
                className="w-full h-13 rounded-2xl bg-[#1B4FD8] text-white font-bold text-base flex items-center justify-center shadow-lg shadow-[#1B4FD8]/25 hover:bg-[#1E40AF] transition-colors"
              >
                Tennoteを始める 🎾
              </a>
            </div>
          )}

        </div>
      </div>

      {/* Footer buttons */}
      {step < 5 && (
        <div className="bg-white border-t border-blue-100 px-5 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <div className="max-w-lg mx-auto flex gap-3">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="h-13 px-5 rounded-2xl border border-blue-200 text-gray-600 font-semibold flex items-center gap-1.5 hover:bg-blue-50 transition-colors"
              >
                <ChevronLeft size={18} />
                戻る
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (step === TOTAL_STEPS - 1) {
                  handleSubmit();
                } else {
                  setStep((s) => s + 1);
                }
              }}
              disabled={
                isPending ||
                (step === 1 && (!data.display_name || !data.years_playing))
              }
              className="flex-1 h-13 rounded-2xl bg-[#1B4FD8] text-white font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-[#1B4FD8]/25 hover:bg-[#1E40AF] transition-colors disabled:opacity-50"
            >
              {isPending ? "保存中..." : step === TOTAL_STEPS - 1 ? "診断結果を見る" : (
                <>次へ <ChevronRight size={18} /></>
              )}
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .field-input {
          width: 100%;
          height: 44px;
          background: #EEF6FF;
          border: 1.5px solid #BFDBFE;
          border-radius: 12px;
          padding: 0 12px;
          font-size: 14px;
          color: #0F172A;
          outline: none;
          transition: border-color 0.2s;
        }
        .field-input:focus {
          border-color: #1B4FD8;
        }
        .field-input::placeholder {
          color: #94A3B8;
        }
        .h-13 {
          height: 52px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {children}
    </div>
  );
}

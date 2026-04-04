"use client";

import { useState } from "react";
import { Calendar, BarChart2, List, Plus, Clock, Zap } from "lucide-react";
import { SkillLineChart, type SkillPoint } from "./skill-line-chart";
import { TrainingCalendar } from "./training-calendar";
import { TrainingLogForm } from "./training-log-form";

interface TrainingLog {
  id: string;
  user_id: string;
  logged_at: string;
  category: "technical" | "physical" | "match" | "mental";
  title: string;
  duration_min: number | null;
  intensity: number | null;
  notes: string | null;
  score_serve: number | null;
  score_forehand: number | null;
  score_backhand: number | null;
  score_volley: number | null;
  score_footwork: number | null;
  score_physical: number | null;
  score_mental: number | null;
  created_at: string;
}

interface Profile {
  initial_serve: number | null;
  initial_forehand: number | null;
  initial_backhand: number | null;
  initial_volley: number | null;
  initial_footwork: number | null;
  initial_physical: number | null;
  initial_mental: number | null;
  onboarding_completed: boolean | null;
  display_name: string | null;
  created_at: string;
}

interface GrowthDashboardProps {
  logs: TrainingLog[];
  profile: Profile | null;
}

const CATEGORIES = [
  { value: "technical", label: "技術練習", emoji: "🎾", color: "bg-green-100 text-green-700" },
  { value: "physical",  label: "フィジカル", emoji: "💪", color: "bg-purple-100 text-purple-700" },
  { value: "match",     label: "試合",       emoji: "🏆", color: "bg-yellow-100 text-yellow-700" },
  { value: "mental",    label: "メンタル",   emoji: "🧠", color: "bg-blue-100 text-blue-700" },
] as const;

const TABS = [
  { id: "chart",    label: "スキル推移",     icon: BarChart2 },
  { id: "calendar", label: "練習カレンダー", icon: Calendar },
  { id: "logs",     label: "ログ一覧",       icon: List },
] as const;

type TabId = typeof TABS[number]["id"];

function formatDate(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

function buildSkillPoints(
  logs: TrainingLog[],
  key: keyof Pick<TrainingLog, "score_serve" | "score_forehand" | "score_backhand" | "score_volley" | "score_footwork" | "score_physical" | "score_mental">,
  profile: Profile | null,
  profileKey: keyof Pick<Profile, "initial_serve" | "initial_forehand" | "initial_backhand" | "initial_volley" | "initial_footwork" | "initial_physical" | "initial_mental">
): SkillPoint[] {
  const points: SkillPoint[] = [];

  // Add initial score from profile as first data point
  if (profile && profile[profileKey] != null) {
    const profileDate = profile.created_at.split("T")[0];
    points.push({ date: profileDate, value: profile[profileKey] as number });
  }

  for (const log of logs) {
    const v = log[key];
    if (v != null) {
      points.push({ date: log.logged_at.split("T")[0], value: v });
    }
  }

  return points;
}

// Consecutive training days
function calcConsecutiveDays(logs: TrainingLog[]): number {
  if (logs.length === 0) return 0;
  const dates = Array.from(new Set(logs.map(l => l.logged_at.split("T")[0]))).sort().reverse();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = 0;
  let cursor = new Date(today);

  for (const d of dates) {
    const dt = new Date(d);
    dt.setHours(0, 0, 0, 0);
    const diff = Math.round((cursor.getTime() - dt.getTime()) / 86400000);
    if (diff === 0 || diff === 1) {
      streak++;
      cursor = dt;
    } else {
      break;
    }
  }
  return streak;
}

export function GrowthDashboard({ logs, profile }: GrowthDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>("chart");
  const [showForm, setShowForm] = useState(false);

  // Stats
  const totalSessions = logs.length;
  const totalMinutes = logs.reduce((sum, l) => sum + (l.duration_min ?? 0), 0);
  const consecutiveDays = calcConsecutiveDays(logs);
  const avgIntensity =
    logs.filter(l => l.intensity != null).length > 0
      ? (
          logs.reduce((sum, l) => sum + (l.intensity ?? 0), 0) /
          logs.filter(l => l.intensity != null).length
        ).toFixed(1)
      : "—";

  // Build skill data for chart
  const skills = {
    serve:     buildSkillPoints(logs, "score_serve",     profile, "initial_serve"),
    forehand:  buildSkillPoints(logs, "score_forehand",  profile, "initial_forehand"),
    backhand:  buildSkillPoints(logs, "score_backhand",  profile, "initial_backhand"),
    volley:    buildSkillPoints(logs, "score_volley",    profile, "initial_volley"),
    footwork:  buildSkillPoints(logs, "score_footwork",  profile, "initial_footwork"),
    physical:  buildSkillPoints(logs, "score_physical",  profile, "initial_physical"),
    mental:    buildSkillPoints(logs, "score_mental",    profile, "initial_mental"),
  };

  const catInfo = (cat: string) => CATEGORIES.find(c => c.value === cat)!;

  return (
    <div className="flex flex-col gap-4">
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { label: "セッション", value: totalSessions, unit: "回" },
          { label: "練習時間", value: totalMinutes, unit: "分" },
          { label: "連続日数", value: consecutiveDays, unit: "日" },
          { label: "平均強度", value: avgIntensity, unit: "" },
        ].map(({ label, value, unit }) => (
          <div
            key={label}
            className="bg-white rounded-2xl border border-blue-100 p-3 flex flex-col items-center text-center"
          >
            <span className="text-xl font-black text-[#1B4FD8]">
              {value}
              <span className="text-xs font-semibold text-gray-400 ml-0.5">{unit}</span>
            </span>
            <span className="text-[10px] text-gray-400 mt-0.5 leading-tight">{label}</span>
          </div>
        ))}
      </div>

      {/* Tab bar */}
      <div className="bg-white rounded-2xl border border-blue-100 overflow-hidden">
        <div className="flex border-b border-blue-50">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all ${
                activeTab === id
                  ? "text-[#1B4FD8] border-b-2 border-[#1B4FD8] bg-[#EEF6FF]"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <Icon size={13} />
              {label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Tab 1: スキル推移 */}
          {activeTab === "chart" && (
            <SkillLineChart skills={skills} />
          )}

          {/* Tab 2: 練習カレンダー */}
          {activeTab === "calendar" && (
            <TrainingCalendar logs={logs.map(l => ({ logged_at: l.logged_at, category: l.category }))} />
          )}

          {/* Tab 3: ログ一覧 */}
          {activeTab === "logs" && (
            <div className="flex flex-col gap-3">
              {/* Add button */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">練習ログ</span>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-[#C8F400] px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-all"
                >
                  <Plus size={13} />
                  記録する
                </button>
              </div>

              {/* Inline form */}
              {showForm && (
                <div className="bg-[#EEF6FF] rounded-2xl p-4 border border-blue-100">
                  <TrainingLogForm />
                </div>
              )}

              {/* Log list */}
              {logs.length === 0 ? (
                <p className="text-center text-gray-300 text-sm py-8">
                  まだデータがありません。トレーニングを記録しましょう！
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {[...logs].reverse().map((log) => {
                    const cat = catInfo(log.category);
                    return (
                      <div
                        key={log.id}
                        className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-100 transition-all"
                      >
                        <div className="text-xl mt-0.5">{cat?.emoji ?? "📝"}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900 truncate">{log.title}</span>
                            <span className="text-xs text-gray-300">{formatDate(log.logged_at)}</span>
                          </div>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            {cat && (
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cat.color}`}>
                                {cat.label}
                              </span>
                            )}
                            {log.duration_min != null && (
                              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <Clock size={11} />{log.duration_min}分
                              </span>
                            )}
                            {log.intensity != null && (
                              <span className="text-xs text-gray-400 flex items-center gap-0.5">
                                <Zap size={11} />強度{log.intensity}
                              </span>
                            )}
                          </div>
                          {log.notes && (
                            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{log.notes}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Quick-add CTA (always visible on chart/calendar tabs) */}
      {activeTab !== "logs" && (
        <div className="bg-white rounded-2xl border border-blue-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-900">トレーニングを記録</span>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 text-xs font-semibold bg-gray-900 text-[#C8F400] px-3 py-1.5 rounded-xl hover:bg-gray-800 transition-all"
            >
              <Plus size={13} />
              記録する
            </button>
          </div>
          {showForm && <TrainingLogForm />}
        </div>
      )}
    </div>
  );
}

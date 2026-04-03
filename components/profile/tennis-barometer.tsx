"use client";

import { useMemo } from "react";
import type { TrainingLogRow } from "@/actions/training";

interface TennisBarometerProps {
  logs: TrainingLogRow[];
}

const AXES = [
  { key: "score_serve",     label: "サーブ",     emoji: "🎯", color: "#C8F400" },
  { key: "score_forehand",  label: "フォア",     emoji: "🔥", color: "#86efac" },
  { key: "score_backhand",  label: "バック",     emoji: "⚡", color: "#67e8f9" },
  { key: "score_volley",    label: "ボレー",     emoji: "🎾", color: "#fbbf24" },
  { key: "score_footwork",  label: "フットワーク", emoji: "🏃", color: "#f472b6" },
  { key: "score_physical",  label: "フィジカル", emoji: "💪", color: "#a78bfa" },
  { key: "score_mental",    label: "メンタル",   emoji: "🧠", color: "#fb923c" },
] as const;

type AxisKey = typeof AXES[number]["key"];

// SVG レーダーチャート（純粋計算、外部ライブラリ不要）
function RadarChart({ scores }: { scores: Record<AxisKey, number> }) {
  const size = 240;
  const cx = size / 2;
  const cy = size / 2;
  const r = 90;
  const n = AXES.length;

  const angleOf = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const gridLevels = [20, 40, 60, 80, 100];

  const pointAt = (level: number, i: number) => {
    const ratio = level / 100;
    return {
      x: cx + r * ratio * Math.cos(angleOf(i)),
      y: cy + r * ratio * Math.sin(angleOf(i)),
    };
  };

  const gridPoly = (level: number) =>
    AXES.map((_, i) => {
      const p = pointAt(level, i);
      return `${p.x},${p.y}`;
    }).join(" ");

  const scorePoly = AXES.map((ax, i) => {
    const p = pointAt(scores[ax.key] ?? 0, i);
    return `${p.x},${p.y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[260px] mx-auto">
      {/* Grid */}
      {gridLevels.map((lv) => (
        <polygon
          key={lv}
          points={gridPoly(lv)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="1"
        />
      ))}
      {/* Axis lines */}
      {AXES.map((_, i) => {
        const end = pointAt(100, i);
        return (
          <line
            key={i}
            x1={cx} y1={cy}
            x2={end.x} y2={end.y}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
        );
      })}
      {/* Score area */}
      <polygon
        points={scorePoly}
        fill="#C8F400"
        fillOpacity="0.25"
        stroke="#C8F400"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Score dots */}
      {AXES.map((ax, i) => {
        const p = pointAt(scores[ax.key] ?? 0, i);
        return (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill="#C8F400" stroke="white" strokeWidth="1.5" />
        );
      })}
      {/* Labels */}
      {AXES.map((ax, i) => {
        const labelR = r + 22;
        const x = cx + labelR * Math.cos(angleOf(i));
        const y = cy + labelR * Math.sin(angleOf(i));
        return (
          <text
            key={i}
            x={x} y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fill="#6b7280"
            fontFamily="system-ui"
          >
            {ax.label}
          </text>
        );
      })}
    </svg>
  );
}

export function TennisBarometer({ logs }: TennisBarometerProps) {
  // 直近ログからスコア平均を計算
  const scores = useMemo(() => {
    const totals: Record<string, { sum: number; count: number }> = {};
    AXES.forEach(ax => { totals[ax.key] = { sum: 0, count: 0 }; });

    logs.forEach(log => {
      AXES.forEach(ax => {
        const v = log[ax.key as keyof TrainingLogRow] as number | null;
        if (v != null && v > 0) {
          totals[ax.key].sum += v;
          totals[ax.key].count += 1;
        }
      });
    });

    const result: Record<AxisKey, number> = {} as Record<AxisKey, number>;
    AXES.forEach(ax => {
      const { sum, count } = totals[ax.key];
      result[ax.key] = count > 0 ? Math.round(sum / count) : 0;
    });
    return result;
  }, [logs]);

  const overall = useMemo(() => {
    const vals = Object.values(scores).filter(v => v > 0);
    return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [scores]);

  const hasData = Object.values(scores).some(v => v > 0);

  if (!hasData) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm">
        <div className="text-3xl mb-2">📊</div>
        <p>トレーニングログを入力すると</p>
        <p>バロメーターが表示されます</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4">
      {/* 総合スコア */}
      <div className="text-center">
        <div className="text-4xl font-black text-gray-900">{overall}</div>
        <div className="text-xs text-gray-400 mt-0.5">総合スコア / 100</div>
      </div>

      {/* レーダーチャート */}
      <RadarChart scores={scores} />

      {/* 各スコアバー */}
      <div className="w-full flex flex-col gap-2">
        {AXES.map((ax) => {
          const val = scores[ax.key];
          return (
            <div key={ax.key} className="flex items-center gap-2">
              <span className="text-sm w-5">{ax.emoji}</span>
              <span className="text-xs text-gray-500 w-20 flex-shrink-0">{ax.label}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${val}%`, backgroundColor: ax.color }}
                />
              </div>
              <span className="text-xs font-semibold text-gray-700 w-8 text-right">{val > 0 ? val : "—"}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

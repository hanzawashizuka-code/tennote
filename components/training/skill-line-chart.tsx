"use client";

import { useState, useCallback } from "react";

export interface SkillPoint {
  date: string;
  value: number;
}

export interface SkillLineChartProps {
  skills: {
    serve: SkillPoint[];
    forehand: SkillPoint[];
    backhand: SkillPoint[];
    volley: SkillPoint[];
    footwork: SkillPoint[];
    physical: SkillPoint[];
    mental: SkillPoint[];
  };
}

const SKILL_CONFIG = [
  { key: "serve",     label: "サーブ",         color: "#1B4FD8" },
  { key: "forehand",  label: "フォアハンド",   color: "#C8F400" },
  { key: "backhand",  label: "バックハンド",   color: "#F97316" },
  { key: "volley",    label: "ボレー",          color: "#8B5CF6" },
  { key: "footwork",  label: "フットワーク",   color: "#10B981" },
  { key: "physical",  label: "フィジカル",      color: "#EF4444" },
  { key: "mental",    label: "メンタル",        color: "#F59E0B" },
] as const;

type SkillKey = typeof SKILL_CONFIG[number]["key"];

// Chart dimensions
const CHART_WIDTH  = 400;
const CHART_HEIGHT = 200;
const PAD_LEFT     = 32;
const PAD_RIGHT    = 10;
const PAD_TOP      = 10;
const PAD_BOTTOM   = 32;

const PLOT_W = CHART_WIDTH  - PAD_LEFT - PAD_RIGHT;
const PLOT_H = CHART_HEIGHT - PAD_TOP  - PAD_BOTTOM;

function dateToNum(d: string) {
  return new Date(d).getTime();
}

function formatDateLabel(d: string) {
  const dt = new Date(d);
  return `${dt.getMonth() + 1}/${dt.getDate()}`;
}

export function SkillLineChart({ skills }: SkillLineChartProps) {
  const [hidden, setHidden] = useState<Set<SkillKey>>(new Set());
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  const toggleSkill = useCallback((key: SkillKey) => {
    setHidden(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  // Collect all dates across all skills
  const allDates = Array.from(
    new Set(
      SKILL_CONFIG.flatMap(s => skills[s.key].map(p => p.date))
    )
  ).sort();

  const hasData = allDates.length > 0;

  if (!hasData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-gray-400 text-sm">まだデータがありません。</p>
        <p className="text-gray-300 text-xs mt-1">トレーニングを記録しましょう！</p>
      </div>
    );
  }

  const minTime = dateToNum(allDates[0]);
  const maxTime = dateToNum(allDates[allDates.length - 1]);
  const timeRange = maxTime - minTime || 1;

  function xForDate(d: string) {
    return PAD_LEFT + ((dateToNum(d) - minTime) / timeRange) * PLOT_W;
  }

  function yForValue(v: number) {
    return PAD_TOP + PLOT_H - (v / 100) * PLOT_H;
  }

  // X axis tick dates (up to 6)
  const tickCount = Math.min(6, allDates.length);
  const tickDates: string[] = [];
  if (tickCount === 1) {
    tickDates.push(allDates[0]);
  } else {
    for (let i = 0; i < tickCount; i++) {
      const idx = Math.round((i / (tickCount - 1)) * (allDates.length - 1));
      tickDates.push(allDates[idx]);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {/* SVG Chart */}
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ height: 220 }}
          onMouseLeave={() => setTooltip(null)}
        >
          {/* Y-axis gridlines + labels */}
          {[0, 25, 50, 75, 100].map(v => {
            const y = yForValue(v);
            return (
              <g key={v}>
                <line
                  x1={PAD_LEFT} y1={y}
                  x2={CHART_WIDTH - PAD_RIGHT} y2={y}
                  stroke="#E5E7EB" strokeWidth={1}
                  strokeDasharray={v === 0 ? "0" : "3 3"}
                />
                <text
                  x={PAD_LEFT - 4} y={y + 4}
                  textAnchor="end"
                  fontSize={9}
                  fill="#9CA3AF"
                >
                  {v}
                </text>
              </g>
            );
          })}

          {/* X-axis tick labels */}
          {tickDates.map(d => (
            <text
              key={d}
              x={xForDate(d)}
              y={CHART_HEIGHT - PAD_BOTTOM + 14}
              textAnchor="middle"
              fontSize={9}
              fill="#9CA3AF"
            >
              {formatDateLabel(d)}
            </text>
          ))}

          {/* Skill lines */}
          {SKILL_CONFIG.map(({ key, color }) => {
            if (hidden.has(key)) return null;
            const pts = skills[key];
            if (pts.length === 0) return null;
            const points = pts.map(p => `${xForDate(p.date)},${yForValue(p.value)}`).join(" ");
            return (
              <g key={key}>
                <polyline
                  points={points}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={xForDate(p.date)}
                    cy={yForValue(p.value)}
                    r={3}
                    fill={color}
                    stroke="white"
                    strokeWidth={1.5}
                    style={{ cursor: "pointer" }}
                    onMouseEnter={(e) => {
                      const svgEl = (e.currentTarget as SVGCircleElement).closest("svg")!;
                      const rect = svgEl.getBoundingClientRect();
                      const cx = xForDate(p.date);
                      const cy = yForValue(p.value);
                      const label = `${formatDateLabel(p.date)}: ${p.value}`;
                      setTooltip({ x: cx, y: cy, label });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <title>{`${formatDateLabel(p.date)}: ${p.value}`}</title>
                  </circle>
                ))}
              </g>
            );
          })}

          {/* SVG Tooltip */}
          {tooltip && (() => {
            const tw = 80;
            const th = 18;
            const tx = Math.min(Math.max(tooltip.x - tw / 2, PAD_LEFT), CHART_WIDTH - PAD_RIGHT - tw);
            const ty = tooltip.y - th - 8;
            return (
              <g pointerEvents="none">
                <rect
                  x={tx} y={ty}
                  width={tw} height={th}
                  rx={4}
                  fill="#111827"
                  opacity={0.85}
                />
                <text
                  x={tx + tw / 2}
                  y={ty + 12}
                  textAnchor="middle"
                  fontSize={10}
                  fill="white"
                >
                  {tooltip.label}
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-2">
        {SKILL_CONFIG.map(({ key, label, color }) => {
          const isHidden = hidden.has(key);
          return (
            <button
              key={key}
              onClick={() => toggleSkill(key)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                isHidden
                  ? "border-gray-200 text-gray-300 bg-white"
                  : "border-transparent text-gray-700 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: isHidden ? "#D1D5DB" : color }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

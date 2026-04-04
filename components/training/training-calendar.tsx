"use client";

interface TrainingCalendarProps {
  logs: Array<{ logged_at: string; category: string }>;
}

function getDayColor(count: number): string {
  if (count === 0) return "#F3F4F6";
  if (count === 1) return "#BFDBFE";
  if (count === 2) return "#60A5FA";
  return "#1B4FD8";
}

function formatMonthLabel(year: number, month: number): string {
  const MONTHS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];
  return MONTHS[month];
}

export function TrainingCalendar({ logs }: TrainingCalendarProps) {
  // Count sessions per date
  const countByDate: Record<string, number> = {};
  for (const log of logs) {
    const d = log.logged_at.split("T")[0];
    countByDate[d] = (countByDate[d] ?? 0) + 1;
  }

  // Build last 90 days grid
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Find start: go back 90 days, then round back to Sunday
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - 89);
  // Go back to the previous Sunday (day 0)
  const startDow = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDow);

  // Build weeks (each week = array of 7 days)
  const weeks: Array<Array<{ dateStr: string | null; count: number }>> = [];
  const cursor = new Date(startDate);

  while (cursor <= today) {
    const week: Array<{ dateStr: string | null; count: number }> = [];
    for (let d = 0; d < 7; d++) {
      const ds = cursor.toISOString().split("T")[0];
      const isInRange = cursor <= today;
      week.push({
        dateStr: isInRange ? ds : null,
        count: isInRange ? (countByDate[ds] ?? 0) : 0,
      });
      cursor.setDate(cursor.getDate() + 1);
    }
    weeks.push(week);
  }

  // Month labels: track which week column each month starts at
  const monthLabels: Array<{ weekIdx: number; label: string }> = [];
  let lastMonth = -1;
  for (let wi = 0; wi < weeks.length; wi++) {
    const week = weeks[wi];
    for (const cell of week) {
      if (cell.dateStr) {
        const dt = new Date(cell.dateStr);
        const m = dt.getMonth();
        const y = dt.getFullYear();
        if (m !== lastMonth) {
          monthLabels.push({ weekIdx: wi, label: formatMonthLabel(y, m) });
          lastMonth = m;
        }
        break;
      }
    }
  }

  const CELL = 11; // px including gap
  const GAP  = 2;
  const BOX  = CELL - GAP; // 9px

  const DAY_LABELS = ["日", "月", "火", "水", "木", "金", "土"];

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-x-auto pb-1">
        <div className="inline-flex flex-col gap-1 min-w-0">
          {/* Month labels */}
          <div className="flex gap-0" style={{ paddingLeft: 20 }}>
            {weeks.map((_, wi) => {
              const ml = monthLabels.find(m => m.weekIdx === wi);
              return (
                <div
                  key={wi}
                  style={{ width: CELL, flexShrink: 0 }}
                  className="text-[9px] text-gray-400 text-center overflow-hidden"
                >
                  {ml ? ml.label : ""}
                </div>
              );
            })}
          </div>

          {/* Grid rows = days of week */}
          {DAY_LABELS.map((dayLabel, dow) => (
            <div key={dow} className="flex items-center gap-0">
              {/* Day label */}
              <div className="text-[9px] text-gray-300 w-5 text-right pr-1 flex-shrink-0">
                {dow % 2 === 0 ? dayLabel : ""}
              </div>
              {/* Week cells */}
              {weeks.map((week, wi) => {
                const cell = week[dow];
                if (!cell.dateStr) {
                  return (
                    <div
                      key={wi}
                      style={{
                        width: BOX,
                        height: BOX,
                        marginRight: GAP,
                        flexShrink: 0,
                      }}
                    />
                  );
                }
                return (
                  <div
                    key={wi}
                    title={`${cell.dateStr}: ${cell.count}回`}
                    style={{
                      width: BOX,
                      height: BOX,
                      marginRight: GAP,
                      marginBottom: 0,
                      borderRadius: 2,
                      backgroundColor: getDayColor(cell.count),
                      flexShrink: 0,
                      cursor: cell.count > 0 ? "pointer" : "default",
                    }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <span>少ない</span>
        {[0, 1, 2, 3].map(n => (
          <div
            key={n}
            style={{
              width: 10,
              height: 10,
              borderRadius: 2,
              backgroundColor: getDayColor(n),
              border: n === 0 ? "1px solid #E5E7EB" : "none",
            }}
          />
        ))}
        <span>多い</span>
      </div>
    </div>
  );
}

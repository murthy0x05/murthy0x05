import { motion } from "framer-motion";
import { useMemo, useState, useEffect } from "react";
import SiLeetcode from "./icons/SiLeetcode";
import { format, startOfDay, subDays } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface DayData {
  date: Date;
  count: number;
}

const LEETCODE_USERNAME = "murthy0x05";

const intensityColors = [
  "bg-secondary",
  "bg-primary/20",
  "bg-primary/40",
  "bg-primary/60",
  "bg-primary/80",
];

const getIntensityClass = (count: number): string => {
  if (count === 0) return intensityColors[0];
  if (count === 1) return intensityColors[1];
  if (count <= 3) return intensityColors[2];
  if (count <= 5) return intensityColors[3];
  return intensityColors[4];
};

const LeetcodeHeatmap = () => {
  const [days, setDays] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: DayData } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("leetcode-activity", {
          body: { username: LEETCODE_USERNAME },
        });

        if (fnError) throw fnError;

        const calendarStr = data?.data?.matchedUser?.userCalendar?.submissionCalendar;
        if (!calendarStr) throw new Error("No calendar data");

        const calendar: Record<string, number> = JSON.parse(calendarStr);

        // Build a lookup from UTC date string to count for fast matching
        const calendarByDate: Record<string, number> = {};
        for (const [ts, count] of Object.entries(calendar)) {
          const d = new Date(Number(ts) * 1000);
          const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
          calendarByDate[key] = (calendarByDate[key] || 0) + count;
        }

        const today = startOfDay(new Date());
        const todayDow = today.getDay(); // 0=Sun
        // Go back enough to fill complete weeks: 52 full weeks + days in current partial week
        const totalDays = 52 * 7 + todayDow + 1;
        const result: DayData[] = [];

        for (let i = totalDays - 1; i >= 0; i--) {
          const date = subDays(today, i);
          const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
          result.push({ date, count: calendarByDate[key] || 0 });
        }

        setDays(result);
      } catch (e) {
        console.error("Failed to fetch LeetCode data:", e);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalSubmissions = useMemo(() => days.reduce((sum, d) => sum + d.count, 0), [days]);

  const weeks: DayData[][] = useMemo(() => {
    const w: DayData[][] = [];
    for (let i = 0; i < days.length; i += 7) {
      w.push(days.slice(i, i + 7));
    }
    return w;
  }, [days]);

  // Derive month labels from actual data
  const monthLabels = useMemo(() => {
    if (weeks.length === 0) return [];
    const labels: { label: string; index: number }[] = [];
    let lastMonth = -1;
    weeks.forEach((week, wi) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ label: format(firstDay.date, "MMM"), index: wi });
          lastMonth = month;
        }
      }
    });
    return labels;
  }, [weeks]);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border border-border rounded-xl p-5 bg-card"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground">LeetCode Activity</h4>
          <a href="https://leetcode.com/u/murthy0x05" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <SiLeetcode size={16} />
            murthy0x05
          </a>
        </div>
        <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">
          Loading LeetCode activity...
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="border border-border rounded-xl p-5 bg-card"
      >
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-semibold text-foreground">LeetCode Activity</h4>
          <a href="https://leetcode.com/u/murthy0x05" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <SiLeetcode size={16} />
            murthy0x05
          </a>
        </div>
        <div className="h-[120px] flex items-center justify-center text-muted-foreground text-sm">
          Unable to load LeetCode activity.
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-border rounded-xl p-5 bg-card relative"
    >
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-sm font-semibold text-foreground">LeetCode Activity</h4>
        <a href="https://leetcode.com/u/murthy0x05" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <SiLeetcode size={16} />
          murthy0x05
        </a>
      </div>

      {/* Scrollable wrapper for mobile only */}
      <div ref={(el) => { if (el) el.scrollLeft = el.scrollWidth; }} className="md:overflow-visible overflow-x-auto pb-2">
        <div className="min-w-max">
          {/* Month labels */}
          <div className="flex mb-1 relative" style={{ height: 16 }}>
            {monthLabels.map(({ label, index }) => (
              <span
                key={`${label}-${index}`}
                className="absolute text-[10px] text-muted-foreground"
                style={{ left: `${(index / weeks.length) * 100}%` }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex gap-[2px]">
            {weeks.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-[2px]">
                {week.map((day, di) => (
                  <div
                    key={di}
                    className={`w-[10px] h-[10px] rounded-[2px] ${getIntensityClass(day.count)} cursor-pointer`}
                    onMouseEnter={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setTooltip({ x: rect.left, y: rect.top - 40, data: day });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
        <span>{totalSubmissions.toLocaleString()} submissions in the last year</span>
        <div className="flex items-center gap-1">
          <span>Less</span>
          {intensityColors.map((c, i) => (
            <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
          ))}
          <span>More</span>
        </div>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 px-2 py-1 rounded bg-popover border border-border text-[11px] text-foreground shadow-lg pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <div>{format(tooltip.data.date, "MMMM d, yyyy")}</div>
          <div>{tooltip.data.count} submission{tooltip.data.count !== 1 ? "s" : ""}</div>
        </div>
      )}
    </motion.div>
  );
};

export default LeetcodeHeatmap;

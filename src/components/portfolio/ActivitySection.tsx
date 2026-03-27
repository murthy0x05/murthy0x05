import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Github } from "lucide-react";
import LeetcodeHeatmap from "./LeetcodeHeatmap";
import { supabase } from "@/integrations/supabase/client";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface ContributionDay {
  contributionCount: number;
  date: string;
}

interface GitHubCalendar {
  totalContributions: number;
  weeks: { contributionDays: ContributionDay[] }[];
}

const intensityColors = ["bg-muted", "bg-primary/20", "bg-primary/40", "bg-primary/60", "bg-primary/80"];

const getIntensity = (count: number): number => {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 8) return 3;
  return 4;
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const ActivitySection = () => {
  const [calendar, setCalendar] = useState<GitHubCalendar | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const { data, error } = await supabase.functions.invoke("github-activity", {
          body: { username: "murthy0x05" },
        });
        if (error) throw error;
        setCalendar(data);
      } catch (e) {
        console.error("GitHub activity fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchGitHub();
  }, []);

  const monthLabels = (() => {
    if (!calendar) return [];
    const labels: { label: string; index: number }[] = [];
    let weekIndex = 0;
    for (const week of calendar.weeks) {
      const firstDay = week.contributionDays[0];
      if (firstDay) {
        const d = new Date(firstDay.date);
        const monthStr = d.toLocaleString("default", { month: "short" });
        if (labels.length === 0 || labels[labels.length - 1].label !== monthStr) {
          labels.push({ label: monthStr, index: weekIndex });
        }
      }
      weekIndex++;
    }
    return labels;
  })();

  return (
    <section id="activity" className="py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-lg font-bold text-center mb-6"
        >
          Developer Activity
        </motion.h3>

        <div>
          <LeetcodeHeatmap />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border border-border rounded-xl p-5 bg-card mt-4"
        >
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">GitHub Activity</h4>
            <a
              href="https://github.com/murthy0x05"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github size={16} />
              murthy0x05
            </a>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8 text-muted-foreground text-sm">
              Loading GitHub activity...
            </div>
          ) : calendar ? (
            <>
              {/* Scrollable wrapper for mobile only */}
              <div ref={(el) => { if (el) el.scrollLeft = el.scrollWidth; }} className="md:overflow-visible overflow-x-auto pb-2">
                <div className="min-w-max">
                  {/* Month labels */}
                  <div className="relative mb-1" style={{ height: 14 }}>
                    {monthLabels.map((m, i) => (
                      <span
                        key={i}
                        className="absolute text-[10px] text-muted-foreground"
                        style={{ left: `${(m.index / calendar.weeks.length) * 100}%` }}
                      >
                        {m.label}
                      </span>
                    ))}
                  </div>

                  {/* Heatmap grid */}
                  <div className="flex gap-[2px]">
                    {calendar.weeks.map((week, wi) => (
                      <div key={wi} className="flex flex-col gap-[2px]">
                        {week.contributionDays.map((day, di) => (
                          <Tooltip key={di} delayDuration={0}>
                            <TooltipTrigger asChild>
                              <div
                                className={`w-[10px] h-[10px] rounded-[2px] ${intensityColors[getIntensity(day.contributionCount)]} cursor-default`}
                              />
                            </TooltipTrigger>
                            <TooltipContent side="top" className="text-xs font-medium px-2.5 py-1.5">
                              <strong>
                                {day.contributionCount} contribution{day.contributionCount !== 1 ? "s" : ""}
                              </strong>{" "}
                              on {formatDate(day.date)}
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground">
                <span>{calendar.totalContributions.toLocaleString()} contributions in the last year</span>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  {intensityColors.map((c, i) => (
                    <div key={i} className={`w-[10px] h-[10px] rounded-[2px] ${c}`} />
                  ))}
                  <span>More</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-muted-foreground text-sm text-center py-8">Failed to load GitHub activity</div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default ActivitySection;

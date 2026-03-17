import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { Principal } from "@icp-sdk/core/principal";
import { Ban, Loader2, Scale, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import { useWeightLogs } from "../hooks/useQueries";

interface WeightLogProps {
  principal: Principal;
}

function getDatesInRange(start: string, end: string): string[] {
  const dates: string[] = [];
  const cur = new Date(start);
  const last = new Date(end);
  while (cur <= last) {
    dates.push(cur.toISOString().split("T")[0]);
    cur.setDate(cur.getDate() + 1);
  }
  return dates;
}

const chartConfig = {
  weight: { label: "Weight", color: "hsl(var(--primary))" },
};

export default function WeightLog({ principal }: WeightLogProps) {
  const today = new Date().toISOString().split("T")[0];
  const [unit] = useState<"kg" | "lbs">("kg");

  const { data: logs = [], isLoading } = useWeightLogs(principal);

  const realLogs = logs.filter((l) => !l.absent);
  const firstDate =
    realLogs.length > 0
      ? [...realLogs].sort((a, b) => a.date.localeCompare(b.date))[0].date
      : null;
  const allDates = firstDate ? getDatesInRange(firstDate, today) : [];
  const loggedDates = new Set(logs.map((l) => l.date));
  const fullLogs = allDates.map((date) => {
    const found = logs.find((l) => l.date === date);
    if (found) return found;
    if (!loggedDates.has(date)) {
      return { date, weight: 0, absent: true };
    }
    return { date, weight: 0, absent: true };
  });
  const sortedLogs = [...fullLogs].sort((a, b) => b.date.localeCompare(a.date));

  const chartData = fullLogs
    .filter((l) => !l.absent)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((l) => ({
      date: l.date.slice(5),
      weight: l.weight,
    }));

  const weightLogs = sortedLogs.filter((l) => !l.absent);
  const latestWeight = weightLogs[0]?.weight;
  const prevWeight = weightLogs[1]?.weight;
  const trend = latestWeight && prevWeight ? latestWeight - prevWeight : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {latestWeight && (
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-body mb-1">
                  Current Weight
                </p>
                <p className="font-display font-bold text-3xl text-primary">
                  {latestWeight}{" "}
                  <span className="text-lg font-body text-muted-foreground">
                    {unit}
                  </span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
          {trend !== null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="bg-card border-border">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-xs uppercase tracking-widest font-body mb-1">
                    Change
                  </p>
                  <div className="flex items-center gap-2">
                    {trend < 0 ? (
                      <TrendingDown className="w-5 h-5 text-violet-400" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    )}
                    <p
                      className={`font-display font-bold text-2xl ${
                        trend < 0 ? "text-violet-400" : "text-primary"
                      }`}
                    >
                      {trend > 0 ? "+" : ""}
                      {trend.toFixed(1)} {unit}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <p className="text-muted-foreground text-xs uppercase tracking-widest font-body mb-1">
                  Total Entries
                </p>
                <p className="font-display font-bold text-3xl text-foreground">
                  {weightLogs.length}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Weight chart */}
      {chartData.length > 1 && (
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="font-display text-xl">
                Weight Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer config={chartConfig} className="h-52 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 4, right: 12, left: -16, bottom: 4 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      className="stroke-border"
                    />
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                    />
                    <YAxis
                      tick={{ fontSize: 11 }}
                      className="fill-muted-foreground"
                      domain={["auto", "auto"]}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--primary))", r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Weight History */}
      <motion.div
        className="lg:col-span-3"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Weight History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div
                className="flex items-center justify-center py-12"
                data-ocid="weight.history.loading_state"
              >
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : sortedLogs.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="weight.history.empty_state"
              >
                <Scale className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body">
                  No weight entries yet.
                </p>
                <p className="text-muted-foreground/60 text-sm font-body">
                  Log your weight from the Home tab!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedLogs.map((log, i) => (
                  <div
                    key={`${log.date}-${i}`}
                    className={`flex items-center justify-between p-3 rounded-md transition-colors ${
                      log.absent
                        ? "bg-muted/50 opacity-60"
                        : "bg-muted hover:bg-secondary"
                    }`}
                    data-ocid={`weight.item.${i + 1}`}
                  >
                    <span className="font-body text-sm text-muted-foreground">
                      {log.date}
                    </span>
                    <div className="flex items-center gap-2">
                      {log.absent ? (
                        <Badge
                          variant="outline"
                          className="text-xs text-muted-foreground border-muted-foreground/30 gap-1"
                        >
                          <Ban className="w-3 h-3" /> Absent
                        </Badge>
                      ) : (
                        <>
                          <span className="font-display font-semibold text-lg text-foreground">
                            {log.weight}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {unit}
                          </Badge>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

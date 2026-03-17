import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Ban,
  CheckCircle2,
  Loader2,
  Plus,
  Scale,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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
import { toast } from "sonner";
import { useLogWeight, useWeightLogs } from "../hooks/useQueries";

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
  const [weight, setWeight] = useState("");
  const [unit, setUnit] = useState<"kg" | "lbs">("kg");

  const { data: logs = [], isLoading } = useWeightLogs(principal);
  const logWeight = useLogWeight();

  const todayEntry = logs.find((l) => l.date === today);
  const alreadyLogged = !!todayEntry && !todayEntry.absent;

  // Build full log list with auto-absent for missing days
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
    // auto-absent for missing dates
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
      date: l.date.slice(5), // show MM-DD
      weight: l.weight,
    }));

  const weightLogs = sortedLogs.filter((l) => !l.absent);
  const latestWeight = weightLogs[0]?.weight;
  const prevWeight = weightLogs[1]?.weight;
  const trend = latestWeight && prevWeight ? latestWeight - prevWeight : null;

  const handleSubmit = async () => {
    if (!weight || Number.isNaN(Number.parseFloat(weight))) {
      toast.error("Please enter a valid weight");
      return;
    }
    try {
      await logWeight.mutateAsync({
        date: today,
        weight: Number.parseFloat(weight),
      });
      toast.success("Weight logged!");
      setWeight("");
    } catch {
      toast.error("Failed to log weight");
    }
  };

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
                      <TrendingDown className="w-5 h-5 text-green-400" />
                    ) : (
                      <TrendingUp className="w-5 h-5 text-primary" />
                    )}
                    <p
                      className={`font-display font-bold text-2xl ${
                        trend < 0 ? "text-green-400" : "text-primary"
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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="font-display text-xl">
                  Today's Weight
                </CardTitle>
                <p className="text-sm text-muted-foreground font-body mt-0.5">
                  {today}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {alreadyLogged ? (
              <div
                className="flex flex-col items-center gap-3 py-6 text-center"
                data-ocid="weight.already_logged.success_state"
              >
                <CheckCircle2 className="w-10 h-10 text-green-400" />
                <p className="font-display font-semibold text-lg text-foreground">
                  Already logged today!
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  Come back tomorrow to log your next entry.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>Weight</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="70.5"
                      step="0.1"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      data-ocid="weight.value.input"
                      className="flex-1"
                    />
                    <div className="flex rounded-md border border-border overflow-hidden">
                      {(["kg", "lbs"] as const).map((u) => (
                        <button
                          type="button"
                          key={u}
                          onClick={() => setUnit(u)}
                          data-ocid={`weight.${u}.toggle`}
                          className={`px-3 py-2 text-sm font-body font-medium transition-colors ${
                            unit === u
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  className="w-full gap-2"
                  onClick={handleSubmit}
                  disabled={logWeight.isPending}
                  data-ocid="weight.log.button"
                >
                  {logWeight.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Logging...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" /> Log Weight
                    </>
                  )}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        className="lg:col-span-2"
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
                  Log your first weight above!
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

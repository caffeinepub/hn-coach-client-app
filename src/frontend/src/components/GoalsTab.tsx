import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import type { Principal } from "@icp-sdk/core/principal";
import { Ruler, Save, Scale, Target } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { BodyMeasurement } from "../backend";
import { useMeasurementLogs, useWeightLogs } from "../hooks/useQueries";

export const GOALS_STORAGE_KEY = "hn_coach_goals";

export interface Goals {
  targetWeight: string;
  chest: string;
  waist: string;
  hips: string;
}

export const DEFAULT_GOALS: Goals = {
  targetWeight: "",
  chest: "",
  waist: "",
  hips: "",
};

export function loadGoals(): Goals {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (raw) return { ...DEFAULT_GOALS, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_GOALS };
}

function calcProgress(current: number, goal: number): number {
  if (!goal || !current) return 0;
  const start = current * 1.15;
  const progress = ((start - current) / (start - goal)) * 100;
  return Math.min(100, Math.max(0, Math.round(progress)));
}

interface GoalsTabProps {
  principal: Principal;
  onSaved?: () => void;
}

type MeasureKey = keyof Omit<BodyMeasurement, "date">;

export default function GoalsTab({ principal, onSaved }: GoalsTabProps) {
  const [goals, setGoals] = useState<Goals>(loadGoals);
  const { data: weightLogs } = useWeightLogs(principal);
  const { data: measurementLogs } = useMeasurementLogs(principal);

  const latestWeight =
    weightLogs?.filter((l) => !l.absent).at(-1)?.weight ?? null;
  const latestMeasure: BodyMeasurement | null =
    (measurementLogs?.at(-1) as BodyMeasurement | undefined) ?? null;

  useEffect(() => {
    setGoals(loadGoals());
  }, []);

  function update(field: keyof Goals, value: string) {
    setGoals((prev) => ({ ...prev, [field]: value }));
  }

  function handleSave() {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    toast.success("Goals saved! Keep pushing! 🎯");
    onSaved?.();
  }

  const weightGoalNum = Number.parseFloat(goals.targetWeight);
  const currentWeightNum = latestWeight ? Number(latestWeight) : 0;
  const weightProgress =
    weightGoalNum && currentWeightNum
      ? calcProgress(currentWeightNum, weightGoalNum)
      : 0;

  const measureFields: {
    key: keyof Goals;
    label: string;
    measureKey: MeasureKey;
  }[] = [
    { key: "chest", label: "Chest / Breast", measureKey: "chest" },
    { key: "waist", label: "Waist", measureKey: "waist" },
    { key: "hips", label: "Hips", measureKey: "hips" },
  ];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Weight Goal */}
      <Card style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 font-display"
            style={{ color: "oklch(0.65 0.22 48)" }}
          >
            <Scale className="w-5 h-5" />
            Weight Goal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {latestWeight !== null && (
            <div
              className="flex items-center justify-between p-3 rounded-lg"
              style={{ background: "oklch(0.95 0.01 80)" }}
            >
              <span className="text-sm font-body text-muted-foreground">
                Current Weight
              </span>
              <Badge
                style={{ background: "oklch(0.65 0.22 48)", color: "white" }}
              >
                {Number(latestWeight).toFixed(1)} kg
              </Badge>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="goal-weight" className="font-body font-medium">
              Target Weight (kg)
            </Label>
            <Input
              id="goal-weight"
              type="number"
              min="1"
              value={goals.targetWeight}
              onChange={(e) => update("targetWeight", e.target.value)}
              placeholder="e.g. 60"
              data-ocid="goals.weight.input"
            />
          </div>

          {weightProgress > 0 && (
            <div className="space-y-1.5">
              <div className="flex justify-between text-sm font-body">
                <span className="text-muted-foreground">
                  Progress toward goal
                </span>
                <span
                  className="font-semibold"
                  style={{ color: "oklch(0.65 0.22 48)" }}
                >
                  {weightProgress}%
                </span>
              </div>
              <Progress value={weightProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Measurement Goals */}
      <Card style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 font-display"
            style={{ color: "oklch(0.65 0.22 48)" }}
          >
            <Ruler className="w-5 h-5" />
            Measurement Goals (cm)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {measureFields.map(({ key, label, measureKey }) => {
            const currentVal = latestMeasure
              ? Number(latestMeasure[measureKey] ?? 0)
              : 0;
            const goalNum = Number.parseFloat(goals[key] || "0");
            const prog =
              goalNum && currentVal ? calcProgress(currentVal, goalNum) : 0;

            return (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label className="font-body font-medium">{label}</Label>
                  {currentVal > 0 && (
                    <span className="text-xs text-muted-foreground font-body">
                      Current: {currentVal} cm
                    </span>
                  )}
                </div>
                <Input
                  type="number"
                  min="1"
                  value={goals[key]}
                  onChange={(e) => update(key, e.target.value)}
                  placeholder="Goal in cm"
                  data-ocid={`goals.${key}.input`}
                />
                {prog > 0 && (
                  <div className="flex items-center gap-2">
                    <Progress value={prog} className="h-1.5 flex-1" />
                    <span
                      className="text-xs font-semibold"
                      style={{ color: "oklch(0.65 0.22 48)" }}
                    >
                      {prog}%
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save */}
      <Card style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        <CardContent className="pt-4">
          <Button
            onClick={handleSave}
            className="w-full font-body font-semibold"
            style={{ background: "oklch(0.65 0.22 48)", color: "white" }}
            data-ocid="goals.save.button"
          >
            <Target className="w-4 h-4 mr-2" />
            <Save className="w-4 h-4 mr-2" />
            Save Goals
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

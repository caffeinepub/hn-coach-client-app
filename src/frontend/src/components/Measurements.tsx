import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import { ChevronDown, Loader2, Plus, Ruler } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { BodyMeasurement } from "../backend";
import { useLogMeasurements, useMeasurementLogs } from "../hooks/useQueries";

interface MeasurementsProps {
  principal: Principal;
}

type MeasurementField = {
  key: keyof Omit<BodyMeasurement, "date">;
  label: string;
};

const FIELDS: MeasurementField[] = [
  { key: "leftBicep", label: "Left Bicep" },
  { key: "rightBicep", label: "Right Bicep" },
  { key: "chest", label: "Chest / Breast" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
  { key: "leftThigh", label: "Left Thigh" },
  { key: "rightThigh", label: "Right Thigh" },
];

type FormValues = Record<keyof Omit<BodyMeasurement, "date">, string>;

const emptyForm = (): FormValues =>
  Object.fromEntries(FIELDS.map((f) => [f.key, ""])) as FormValues;

export default function Measurements({ principal }: MeasurementsProps) {
  const today = new Date().toISOString().split("T")[0];
  const [date, setDate] = useState(today);
  const [form, setForm] = useState<FormValues>(emptyForm());
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const { data: logs = [], isLoading } = useMeasurementLogs(principal);
  const logMeasurements = useLogMeasurements();

  const handleSubmit = async () => {
    const parsed = Object.fromEntries(
      FIELDS.map((f) => [f.key, Number.parseFloat(form[f.key])]),
    ) as Record<keyof Omit<BodyMeasurement, "date">, number>;

    if (Object.values(parsed).some((v) => Number.isNaN(v))) {
      toast.error("Please fill in all measurement fields");
      return;
    }
    try {
      await logMeasurements.mutateAsync({ date, ...parsed });
      toast.success("Measurements logged!");
      setForm(emptyForm());
    } catch {
      toast.error("Failed to log measurements");
    }
  };

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center">
                  <Ruler className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="font-display text-xl">
                  Log Measurements
                </CardTitle>
              </div>
              <div className="flex rounded-md border border-border overflow-hidden">
                {(["cm", "in"] as const).map((u) => (
                  <button
                    type="button"
                    key={u}
                    onClick={() => setUnit(u)}
                    data-ocid={`measurements.${u}.toggle`}
                    className={`px-3 py-1.5 text-xs font-body font-medium transition-colors ${unit === u ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}
                  >
                    {u}
                  </button>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                data-ocid="measurements.date.input"
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {FIELDS.map((field) => (
                <div key={field.key} className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    {field.label}{" "}
                    <span className="text-primary/60">({unit})</span>
                  </Label>
                  <Input
                    type="number"
                    placeholder="0.0"
                    step="0.1"
                    value={form[field.key]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [field.key]: e.target.value }))
                    }
                    data-ocid={`measurements.${field.key}.input`}
                  />
                </div>
              ))}
            </div>
            <Button
              className="w-full gap-2 mt-2"
              onClick={handleSubmit}
              disabled={logMeasurements.isPending}
              data-ocid="measurements.log.button"
            >
              {logMeasurements.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Logging...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" /> Log Measurements
                </>
              )}
            </Button>
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
              Measurement History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div
                className="flex items-center justify-center py-12"
                data-ocid="measurements.history.loading_state"
              >
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
              </div>
            ) : sortedLogs.length === 0 ? (
              <div
                className="text-center py-12"
                data-ocid="measurements.history.empty_state"
              >
                <Ruler className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-muted-foreground font-body">
                  No measurement entries yet.
                </p>
                <p className="text-muted-foreground/60 text-sm font-body">
                  Log your first measurements!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {sortedLogs.map((log, i) => (
                  <div
                    key={`${log.date}-${i}`}
                    className="rounded-md border border-border overflow-hidden"
                    data-ocid={`measurements.item.${i + 1}`}
                  >
                    <button
                      type="button"
                      className="w-full flex items-center justify-between p-3 bg-muted hover:bg-secondary transition-colors text-left"
                      onClick={() =>
                        setExpandedIdx(expandedIdx === i ? null : i)
                      }
                      data-ocid="measurements.expand.toggle"
                    >
                      <span className="font-body font-medium text-sm">
                        {log.date}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          7 measurements
                        </Badge>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform ${expandedIdx === i ? "rotate-180" : ""}`}
                        />
                      </div>
                    </button>
                    {expandedIdx === i && (
                      <div className="p-3 grid grid-cols-2 gap-2 bg-background/40">
                        {FIELDS.map((f) => (
                          <div
                            key={f.key}
                            className="flex justify-between items-center"
                          >
                            <span className="text-xs text-muted-foreground font-body">
                              {f.label}
                            </span>
                            <span className="text-sm font-semibold font-body">
                              {
                                (log as unknown as Record<string, number>)[
                                  f.key
                                ]
                              }{" "}
                              {unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
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

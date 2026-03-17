import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import { CalendarCheck, ChevronDown, Loader2, Plus, Ruler } from "lucide-react";
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

// Removed: leftBicep, rightBicep, leftThigh, rightThigh
const FIELDS: MeasurementField[] = [
  { key: "chest", label: "Chest / Breast" },
  { key: "waist", label: "Waist" },
  { key: "hips", label: "Hips" },
];

type FormValues = Record<keyof Omit<BodyMeasurement, "date">, string>;

const emptyForm = (): FormValues => ({
  leftBicep: "0",
  rightBicep: "0",
  chest: "",
  waist: "",
  hips: "",
  leftThigh: "0",
  rightThigh: "0",
});

function getMostRecentSunday(): string {
  const d = new Date();
  const day = d.getDay(); // 0 = Sunday
  d.setDate(d.getDate() - day);
  return d.toISOString().split("T")[0];
}

function getNextSunday(thisSunday: string): string {
  const d = new Date(thisSunday);
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

export default function Measurements({ principal }: MeasurementsProps) {
  const [form, setForm] = useState<FormValues>(emptyForm());
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const thisSunday = getMostRecentSunday();
  const nextSunday = getNextSunday(thisSunday);

  const { data: logs = [], isLoading } = useMeasurementLogs(principal);
  const logMeasurements = useLogMeasurements();

  const alreadyLoggedThisWeek = logs.some((l) => l.date === thisSunday);

  const handleSubmit = async () => {
    const parsed = {
      leftBicep: 0,
      rightBicep: 0,
      chest: Number.parseFloat(form.chest),
      waist: Number.parseFloat(form.waist),
      hips: Number.parseFloat(form.hips),
      leftThigh: 0,
      rightThigh: 0,
    };

    if (
      Number.isNaN(parsed.chest) ||
      Number.isNaN(parsed.waist) ||
      Number.isNaN(parsed.hips)
    ) {
      toast.error("Please fill in all measurement fields");
      return;
    }
    try {
      await logMeasurements.mutateAsync({ date: thisSunday, ...parsed });
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
                  Weekly Check-in
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
            {/* Weekly check-in info */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-primary/10 border border-primary/20">
              <CalendarCheck className="w-4 h-4 text-primary flex-shrink-0" />
              <p className="text-xs font-body text-primary">
                <span className="font-semibold">Sunday check-in:</span>{" "}
                {thisSunday}
              </p>
            </div>

            {alreadyLoggedThisWeek ? (
              <div
                className="flex flex-col items-center gap-3 py-8 text-center"
                data-ocid="measurements.already_logged.success_state"
              >
                <CalendarCheck className="w-10 h-10 text-green-400" />
                <p className="font-display font-semibold text-lg text-foreground">
                  Already logged this week!
                </p>
                <p className="text-sm text-muted-foreground font-body">
                  Next check-in:{" "}
                  <span className="font-semibold text-primary">
                    {nextSunday}
                  </span>
                </p>
              </div>
            ) : (
              <>
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
                          setForm((p) => ({
                            ...p,
                            [field.key]: e.target.value,
                          }))
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
                  Log your first measurements on Sunday!
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
                          3 measurements
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

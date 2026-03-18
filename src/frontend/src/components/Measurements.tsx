import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CalendarCheck,
  Camera,
  ChevronDown,
  Loader2,
  Plus,
  Ruler,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import type { BodyMeasurement } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useLogMeasurements, useMeasurementLogs } from "../hooks/useQueries";
import { awardPoints } from "../utils/points";

interface MeasurementsProps {
  principal: Principal;
}

type MeasurementField = {
  key: keyof Omit<BodyMeasurement, "date">;
  label: string;
};

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
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  return d.toISOString().split("T")[0];
}

function getNextSunday(thisSunday: string): string {
  const d = new Date(thisSunday);
  d.setDate(d.getDate() + 7);
  return d.toISOString().split("T")[0];
}

function MeasurePhotoCard({
  label,
  // storageKey kept for API compatibility
  ocidPrefix,
  required = false,
  onFileChange,
}: {
  label: string;
  storageKey: string;
  ocidPrefix: string;
  required?: boolean;
  onFileChange?: (file: File | null) => void;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setImageUrl(objectUrl);
    onFileChange?.(file);
  }

  function handleRemove() {
    if (imageUrl) URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
    onFileChange?.(null);
  }

  return (
    <div
      className="flex flex-col items-center gap-2 p-3 rounded-xl"
      style={{
        background: "oklch(0.97 0.03 290)",
        border: "1px solid oklch(0.88 0.04 290)",
      }}
    >
      <p className="text-xs font-body font-semibold text-foreground">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </p>
      {imageUrl ? (
        <div className="relative">
          <img
            src={imageUrl}
            alt={label}
            className="w-20 h-28 object-cover rounded-lg border-2"
            style={{ borderColor: "oklch(0.68 0.16 290 / 0.4)" }}
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center rounded-full bg-black/70 text-white hover:bg-black/90"
            data-ocid={`${ocidPrefix}.delete_button`}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-20 h-28 flex flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed hover:opacity-80 transition-opacity"
          style={{
            borderColor: required
              ? "oklch(0.65 0.16 290)"
              : "oklch(0.68 0.16 290 / 0.4)",
          }}
          data-ocid={`${ocidPrefix}.upload_button`}
        >
          <Camera
            className="w-5 h-5"
            style={{ color: "oklch(0.68 0.16 290)" }}
          />
          <span
            className="text-xs font-body text-center leading-tight"
            style={{ color: "oklch(0.62 0.14 290)" }}
          >
            Tap to upload
          </span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  );
}

const CHART_LINE_COLOR = "#e07b39";

function MiniChart({
  data,
  label,
  unit,
}: {
  data: { date: string; value: number }[];
  label: string;
  unit: "cm" | "in";
}) {
  if (data.length < 2) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-xl p-4 text-center"
        style={{
          background: "oklch(0.97 0.03 290)",
          border: "1px solid oklch(0.88 0.04 290)",
          height: 130,
        }}
      >
        <p className="text-xs font-body font-semibold text-foreground mb-1">
          {label}
        </p>
        <p className="text-xs text-muted-foreground font-body">
          Log 2+ weeks to see your progress
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl p-3"
      style={{
        background: "oklch(0.97 0.03 290)",
        border: "1px solid oklch(0.88 0.04 290)",
      }}
    >
      <p className="text-xs font-body font-semibold text-foreground mb-2">
        {label}{" "}
        <span className="text-muted-foreground font-normal">({unit})</span>
      </p>
      <ResponsiveContainer width="100%" height={110}>
        <LineChart
          data={data}
          margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.01 80)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 9, fill: "oklch(0.6 0.01 260)" }}
            tickFormatter={(v: string) => v.slice(5)}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fill: "oklch(0.6 0.01 260)" }}
            tickLine={false}
            axisLine={false}
            width={32}
          />
          <Tooltip
            contentStyle={{
              fontSize: 11,
              background: "white",
              border: "1px solid oklch(0.88 0.01 80)",
              borderRadius: 8,
            }}
            formatter={(value: number) => [`${value} ${unit}`, label]}
            labelFormatter={(lbl: string) => `Week: ${lbl}`}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke={CHART_LINE_COLOR}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_LINE_COLOR, strokeWidth: 0 }}
            activeDot={{ r: 5, fill: CHART_LINE_COLOR }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function Measurements({ principal }: MeasurementsProps) {
  const [form, setForm] = useState<FormValues>(emptyForm());
  const [unit, setUnit] = useState<"cm" | "in">("cm");
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  const thisSunday = getMostRecentSunday();
  const nextSunday = getNextSunday(thisSunday);

  const { identity } = useInternetIdentity();
  const { data: logs = [], isLoading } = useMeasurementLogs(principal);
  const logMeasurements = useLogMeasurements();

  const alreadyLoggedThisWeek = logs.some((l) => l.date === thisSunday);
  const [frontPhotoFile, setFrontPhotoFile] = useState<File | null>(null);
  const [sidePhotoFile, setSidePhotoFile] = useState<File | null>(null);

  const handleSubmit = async () => {
    if (!frontPhotoFile || !sidePhotoFile) {
      toast.error(
        "Please upload both Front View and Side View photos for your weekly check-in",
      );
      return;
    }

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
      if (identity) {
        awardPoints(
          identity.getPrincipal().toText(),
          50,
          "Weekly measurements",
        );
      }
      toast.success("Measurements logged! +50 pts 🪙");
      setForm(emptyForm());
    } catch {
      toast.error("Failed to log measurements");
    }
  };

  const sortedLogs = [...logs].sort((a, b) => b.date.localeCompare(a.date));

  // Build chart data (chronological order for display)
  const chartLogs = [...sortedLogs].reverse();
  const chestData = chartLogs.map((l) => ({
    date: l.date,
    value: Number(l.chest),
  }));
  const waistData = chartLogs.map((l) => ({
    date: l.date,
    value: Number(l.waist),
  }));
  const hipsData = chartLogs.map((l) => ({
    date: l.date,
    value: Number(l.hips),
  }));

  return (
    <div className="space-y-6">
      {/* Prominent Weekly Check-In Banner */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.68 0.16 290), oklch(0.58 0.18 290), oklch(0.62 0.16 290))",
          boxShadow: "0 6px 28px oklch(0.68 0.16 290 / 0.35)",
        }}
        data-ocid="measurements.weekly_checkin.card"
      >
        <div className="px-6 py-5 flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
            style={{ background: "oklch(1 0 0 / 0.2)" }}
          >
            📅
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display font-extrabold text-xl text-white flex items-center gap-2 flex-wrap">
                Weekly Check-In
                <span
                  className="text-sm font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "oklch(1 0 0 / 0.2)", color: "white" }}
                >
                  +50 pts
                </span>
              </h2>
              <span
                className="px-2.5 py-0.5 rounded-full text-xs font-bold animate-pulse"
                style={{
                  background: "oklch(1 0 0 / 0.25)",
                  color: "white",
                  border: "1px solid oklch(1 0 0 / 0.4)",
                }}
              >
                ✨ Weekly Habit
              </span>
            </div>
            <p className="text-white/85 font-body text-sm mt-1">
              Submit your measurements every <strong>Sunday</strong> to track
              your body progress
            </p>
            <p className="text-white/65 font-body text-xs mt-1">
              📍 Next check-in:{" "}
              <span className="font-bold text-white/90">
                {alreadyLoggedThisWeek ? nextSunday : thisSunday}
              </span>
            </p>
          </div>
        </div>
        {/* Decorative glow line */}
        <div className="h-1" style={{ background: "oklch(1 0 0 / 0.25)" }} />
      </motion.div>

      {/* Progress Charts */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        data-ocid="measurements.progress_charts.card"
      >
        <Card className="bg-card border-border">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center text-base">
                📈
              </div>
              <CardTitle className="font-display text-lg">
                Progress Charts
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <MiniChart data={chestData} label="Chest / Breast" unit={unit} />
              <MiniChart data={waistData} label="Waist" unit={unit} />
              <MiniChart data={hipsData} label="Hips" unit={unit} />
            </div>
            {sortedLogs.length === 0 && (
              <p className="text-xs text-muted-foreground font-body text-center mt-2">
                Log your measurements every Sunday to start tracking your
                progress!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

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
                  <div>
                    <CardTitle className="font-display text-xl">
                      Weekly Check-in
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span
                        className="w-2 h-2 rounded-full animate-pulse"
                        style={{ background: "oklch(0.68 0.16 290)" }}
                      />
                      <span
                        className="text-xs font-body"
                        style={{ color: "oklch(0.68 0.16 290)" }}
                      >
                        Every Sunday
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex rounded-md border border-border overflow-hidden">
                  {(["cm", "in"] as const).map((u) => (
                    <button
                      type="button"
                      key={u}
                      onClick={() => setUnit(u)}
                      data-ocid={`measurements.${u}.toggle`}
                      className={`px-3 py-1.5 text-xs font-body font-medium transition-colors ${
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
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Weekly check-in info */}
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 290 / 0.1), oklch(0.68 0.16 290 / 0.08))",
                  border: "1px solid oklch(0.68 0.16 290 / 0.25)",
                }}
              >
                <CalendarCheck
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: "oklch(0.68 0.16 290)" }}
                />
                <p
                  className="text-xs font-body"
                  style={{ color: "oklch(0.68 0.16 290)" }}
                >
                  <span className="font-semibold">Sunday check-in:</span>{" "}
                  {thisSunday}
                </p>
              </div>

              {alreadyLoggedThisWeek ? (
                <div
                  className="flex flex-col items-center gap-3 py-8 text-center"
                  data-ocid="measurements.already_logged.success_state"
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-2xl"
                    style={{ background: "oklch(0.68 0.16 290 / 0.12)" }}
                  >
                    ✅
                  </div>
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
                  {/* Progress Photos for weekly check-in */}
                  <div>
                    <p className="text-xs font-body font-semibold text-muted-foreground mb-2 flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Weekly Progress Photos
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <MeasurePhotoCard
                        label="Front View"
                        storageKey={`hn_measure_front_${thisSunday}`}
                        ocidPrefix="measurements.front_view"
                        required
                        onFileChange={setFrontPhotoFile}
                      />
                      <MeasurePhotoCard
                        label="Side View"
                        storageKey={`hn_measure_side_${thisSunday}`}
                        ocidPrefix="measurements.side_view"
                        required
                        onFileChange={setSidePhotoFile}
                      />
                    </div>
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
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.68 0.16 290), oklch(0.58 0.18 290))",
                      color: "white",
                    }}
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
                            className={`w-4 h-4 text-muted-foreground transition-transform ${
                              expandedIdx === i ? "rotate-180" : ""
                            }`}
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
    </div>
  );
}

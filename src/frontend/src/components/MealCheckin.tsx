import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Camera, CheckCircle, Loader2, Save, Utensils, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface MealItem {
  key: string;
  label: string;
  emoji: string;
  color: string;
  lightBg: string;
}

const MEALS: MealItem[] = [
  {
    key: "breakfast",
    label: "Breakfast",
    emoji: "🍳",
    color: "oklch(0.68 0.16 290)",
    lightBg: "oklch(0.97 0.02 70)",
  },
  {
    key: "mid_morning_snacks",
    label: "Mid Morning Snacks",
    emoji: "🥪",
    color: "oklch(0.62 0.16 140)",
    lightBg: "oklch(0.97 0.02 140)",
  },
  {
    key: "lunch",
    label: "Lunch",
    emoji: "🍱",
    color: "oklch(0.55 0.18 200)",
    lightBg: "oklch(0.97 0.02 200)",
  },
  {
    key: "evening_snacks",
    label: "Evening Snacks",
    emoji: "🍎",
    color: "oklch(0.55 0.22 25)",
    lightBg: "oklch(0.97 0.02 25)",
  },
  {
    key: "dinner",
    label: "Dinner",
    emoji: "🍽️",
    color: "oklch(0.5 0.18 280)",
    lightBg: "oklch(0.97 0.015 280)",
  },
  {
    key: "footsteps",
    label: "Footsteps Count",
    emoji: "👣",
    color: "oklch(0.55 0.16 160)",
    lightBg: "oklch(0.97 0.02 160)",
  },
];

const TODAY = new Date().toISOString().split("T")[0];

function getMealMotivation(count: number): string {
  if (count === 0) return "Start your day! 🌅";
  if (count <= 2) return "Great start! Keep going 💪";
  if (count <= 4) return "Halfway there! You're doing great 🔥";
  if (count === 5) return "Almost done! One more to go ⭐";
  return "Perfect day! 🏆 All meals logged!";
}

function getMealProgressColor(count: number): string {
  if (count === 0) return "oklch(0.7 0.01 260)";
  if (count <= 2) return "oklch(0.55 0.22 25)";
  if (count <= 4) return "oklch(0.68 0.16 290)";
  return "oklch(0.68 0.16 290)";
}

export default function MealCheckin() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [mealImages, setMealImages] = useState<Record<string, string>>({});
  const mealImageRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { data: todayLogs = [], isLoading } = useQuery({
    queryKey: ["mealLogs", TODAY],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTodayMealLogs(TODAY);
    },
    enabled: !!actor && !isFetching,
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      mealType,
      note,
    }: { mealType: string; note: string }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveMealLog(mealType, note, null, TODAY);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mealLogs"] });
    },
  });

  const handleImageSelect = (
    e: React.ChangeEvent<HTMLInputElement>,
    mealKey: string,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setMealImages((prev) => ({ ...prev, [mealKey]: dataUrl }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (meal: MealItem) => {
    if (!mealImages[meal.key]) {
      toast.error(`📸 Please upload a photo for ${meal.label} first`);
      return;
    }
    setSavingKey(meal.key);
    try {
      const note = notes[meal.key] ?? "";
      await saveMutation.mutateAsync({ mealType: meal.key, note });
      toast.success(`${meal.emoji} ${meal.label} logged!`);
      setNotes((prev) => ({ ...prev, [meal.key]: "" }));
    } catch {
      toast.error(`Failed to save ${meal.label}. Try again.`);
    } finally {
      setSavingKey(null);
    }
  };

  const getLogForMeal = (key: string) =>
    todayLogs.find((l) => l.mealType === key);

  const loggedCount = MEALS.filter((m) => !!getLogForMeal(m.key)).length;
  const progressPct = (loggedCount / MEALS.length) * 100;
  const progressColor = getMealProgressColor(loggedCount);
  const motivation = getMealMotivation(loggedCount);

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        data-ocid="meals.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <div>
        <h2 className="font-display font-bold text-2xl text-foreground">
          Today's Meal Check-in
        </h2>
        <p className="text-muted-foreground font-body mt-1">
          Log your meals with photos for {TODAY} 📸
        </p>
      </div>

      {/* Today's Meal Progress Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 4px 24px oklch(0.68 0.16 290 / 0.12)",
          border: "1px solid oklch(0.88 0.01 80)",
        }}
        data-ocid="meals.progress.card"
      >
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.68 0.16 290) 0%, oklch(0.58 0.18 290) 100%)",
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "oklch(1 0 0 / 0.18)" }}
          >
            <Utensils className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-tight">
              Today's Meal Progress
            </h3>
            <p className="text-white/75 text-sm font-body">{TODAY}</p>
          </div>
          <div className="ml-auto text-right">
            <span className="font-display font-extrabold text-3xl text-white">
              {loggedCount}
            </span>
            <span className="font-body text-white/70 text-lg">
              /{MEALS.length}
            </span>
          </div>
        </div>

        <div
          className="px-6 py-5 space-y-4"
          style={{ background: "oklch(0.99 0.01 70)" }}
        >
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span
                className="font-body font-semibold"
                style={{ color: progressColor }}
              >
                {loggedCount} of {MEALS.length} meals logged
              </span>
              <span
                className="font-body font-bold text-base"
                style={{ color: progressColor }}
              >
                {Math.round(progressPct)}%
              </span>
            </div>
            <div
              className="w-full h-3 rounded-full overflow-hidden"
              style={{ background: "oklch(0.92 0.01 80)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="h-full rounded-full"
                style={{ background: progressColor }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {MEALS.map((meal) => {
              const logged = !!getLogForMeal(meal.key);
              return (
                <div
                  key={meal.key}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all"
                  style={{
                    background: logged
                      ? `${meal.color.replace(")", " / 0.12)")}`
                      : "oklch(0.93 0.005 80)",
                    color: logged ? meal.color : "oklch(0.6 0.01 260)",
                    border: logged
                      ? `1px solid ${meal.color.replace(")", " / 0.3)")}`
                      : "1px solid oklch(0.88 0.005 80)",
                  }}
                >
                  <span>{meal.emoji}</span>
                  <span>{meal.label}</span>
                  {logged && <CheckCircle className="w-3 h-3" />}
                </div>
              );
            })}
          </div>

          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: `${progressColor.replace(")", " / 0.08)")}` }}
          >
            <span className="text-xl">
              {loggedCount === 6
                ? "🏆"
                : loggedCount >= 4
                  ? "🔥"
                  : loggedCount >= 2
                    ? "💪"
                    : "🌅"}
            </span>
            <p
              className="font-body font-semibold text-sm"
              style={{ color: progressColor }}
            >
              {motivation}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {MEALS.map((meal, i) => {
          const existingLog = getLogForMeal(meal.key);
          const isLogged = !!existingLog;
          const isSaving = savingKey === meal.key;
          const hasMealImage = !!mealImages[meal.key];

          return (
            <motion.div
              key={meal.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              data-ocid={`meals.item.${i + 1}`}
            >
              <div
                className="rounded-2xl overflow-hidden h-full flex flex-col"
                style={{
                  background: "oklch(1 0 0)",
                  border: "1px solid oklch(0.88 0.01 80)",
                  borderTop: `3px solid ${meal.color}`,
                  boxShadow: "0 2px 12px oklch(0.15 0.02 260 / 0.05)",
                }}
              >
                <div
                  className="px-5 pt-5 pb-3 flex items-center justify-between"
                  style={{ background: meal.lightBg }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{meal.emoji}</span>
                    <span
                      className="font-display font-bold text-base"
                      style={{ color: meal.color }}
                    >
                      {meal.label}
                    </span>
                  </div>
                  {isLogged && (
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        background: "oklch(0.68 0.16 290 / 0.12)",
                        color: "oklch(0.62 0.18 290)",
                      }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Logged
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col gap-4">
                  {isLogged ? (
                    <div className="space-y-3">
                      {existingLog.note && (
                        <p className="text-sm font-body text-muted-foreground leading-relaxed">
                          {existingLog.note}
                        </p>
                      )}
                      {!existingLog.note && (
                        <p className="text-sm text-muted-foreground font-body italic">
                          No note added.
                        </p>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full gap-2 text-xs"
                        onClick={() => {
                          setNotes((prev) => ({
                            ...prev,
                            [meal.key]: existingLog.note ?? "",
                          }));
                          qc.setQueryData(
                            ["mealLogs", TODAY],
                            (old: typeof todayLogs) =>
                              old?.filter((l) => l.mealType !== meal.key) ?? [],
                          );
                        }}
                        style={{
                          color: meal.color,
                          borderColor: `${meal.color}40`,
                        }}
                        data-ocid={`meals.edit_button.${i + 1}`}
                      >
                        ✏️ Edit log
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Image upload area */}
                      <div>
                        {hasMealImage ? (
                          <div className="relative">
                            <img
                              src={mealImages[meal.key]}
                              alt={meal.label}
                              className="w-full h-32 object-cover rounded-xl border"
                              style={{
                                borderColor: `${meal.color.replace(")", " / 0.3)")}`,
                              }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                setMealImages((prev) => {
                                  const next = { ...prev };
                                  delete next[meal.key];
                                  return next;
                                })
                              }
                              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                              data-ocid={`meals.close_button.${i + 1}`}
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              mealImageRefs.current[meal.key]?.click()
                            }
                            className="w-full border-2 border-dashed rounded-xl py-4 flex flex-col items-center gap-1.5 hover:opacity-80 transition-opacity"
                            style={{
                              borderColor: `${meal.color.replace(")", " / 0.35)")}`,
                            }}
                            data-ocid={`meals.upload_button.${i + 1}`}
                          >
                            <Camera
                              className="w-5 h-5"
                              style={{ color: meal.color }}
                            />
                            <span
                              className="text-xs font-body font-semibold"
                              style={{ color: meal.color }}
                            >
                              📸 Upload photo (required)
                            </span>
                          </button>
                        )}
                        <input
                          ref={(el) => {
                            mealImageRefs.current[meal.key] = el;
                          }}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageSelect(e, meal.key)}
                        />
                      </div>

                      <Textarea
                        placeholder={
                          meal.key === "footsteps"
                            ? "Enter today's step count..."
                            : "Add a note..."
                        }
                        value={notes[meal.key] ?? ""}
                        onChange={(e) =>
                          setNotes((prev) => ({
                            ...prev,
                            [meal.key]: e.target.value.slice(0, 200),
                          }))
                        }
                        className="resize-none text-sm font-body min-h-[80px]"
                        maxLength={200}
                        data-ocid={`meals.textarea.${i + 1}`}
                      />

                      {!hasMealImage && (
                        <p
                          className="text-xs font-body -mt-2"
                          style={{ color: "oklch(0.55 0.2 25)" }}
                        >
                          📸 A photo is required to save
                        </p>
                      )}

                      <Button
                        className="w-full gap-2 mt-auto disabled:opacity-50"
                        onClick={() => handleSave(meal)}
                        disabled={isSaving || !hasMealImage}
                        style={{ background: meal.color, color: "white" }}
                        data-ocid={`meals.save_button.${i + 1}`}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />{" "}
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4" /> Log {meal.label}
                          </>
                        )}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

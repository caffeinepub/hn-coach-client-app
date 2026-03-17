import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle, ImagePlus, Loader2, Save, Utensils } from "lucide-react";
import { motion } from "motion/react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import { useBlobStorage } from "../hooks/useBlobStorage";

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
    color: "oklch(0.65 0.22 48)",
    lightBg: "oklch(0.97 0.02 70)",
  },
  {
    key: "mid_morning_snacks",
    label: "Mid Morning Snacks",
    emoji: "🥪",
    color: "oklch(0.6 0.18 140)",
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
    label: "Footsteps",
    emoji: "👟",
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
  if (count <= 4) return "oklch(0.65 0.22 48)";
  return "oklch(0.55 0.18 145)";
}

export default function MealCheckin() {
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();
  const { uploadFile, isUploading } = useBlobStorage();

  const [notes, setNotes] = useState<Record<string, string>>({});
  const [images, setImages] = useState<Record<string, File | null>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});

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
      imageUrl,
    }: { mealType: string; note: string; imageUrl: string | null }) => {
      if (!actor) throw new Error("No actor");
      return actor.saveMealLog(mealType, note, imageUrl, TODAY);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["mealLogs"] });
    },
  });

  const handleImageChange = (key: string, file: File | null) => {
    setImages((prev) => ({ ...prev, [key]: file }));
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviews((prev) => ({ ...prev, [key]: url }));
    } else {
      setPreviews((prev) => ({ ...prev, [key]: "" }));
    }
  };

  const handleSave = async (meal: MealItem) => {
    setSavingKey(meal.key);
    try {
      const note = notes[meal.key] ?? "";
      const imageFile = images[meal.key];
      let imageUrl: string | null = null;
      if (imageFile) {
        imageUrl = await uploadFile(imageFile);
      }
      await saveMutation.mutateAsync({ mealType: meal.key, note, imageUrl });
      toast.success(`${meal.emoji} ${meal.label} logged!`);
      setImages((prev) => ({ ...prev, [meal.key]: null }));
      setPreviews((prev) => ({ ...prev, [meal.key]: "" }));
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
          Log your meals, snacks, and daily footsteps for {TODAY} 🥗
        </p>
      </div>

      {/* Today's Meal Progress Summary Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="rounded-2xl overflow-hidden"
        style={{
          boxShadow: "0 4px 24px oklch(0.65 0.22 48 / 0.12)",
          border: "1px solid oklch(0.88 0.01 80)",
        }}
        data-ocid="meals.progress.card"
      >
        {/* Gradient Header */}
        <div
          className="px-6 py-5 flex items-center gap-3"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.65 0.22 48) 0%, oklch(0.55 0.2 38) 100%)",
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

        {/* Progress Body */}
        <div
          className="px-6 py-5 space-y-4"
          style={{ background: "oklch(0.99 0.01 70)" }}
        >
          {/* Progress bar */}
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

          {/* Meal pills */}
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

          {/* Motivation message */}
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
          const preview = previews[meal.key];

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
                {/* Card Header */}
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
                        background: "oklch(0.55 0.18 145 / 0.12)",
                        color: "oklch(0.4 0.15 145)",
                      }}
                    >
                      <CheckCircle className="w-3 h-3" />
                      Logged
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col gap-4">
                  {/* Show existing log if saved */}
                  {isLogged ? (
                    <div className="space-y-3">
                      {existingLog.imageUrl && (
                        <img
                          src={existingLog.imageUrl}
                          alt={meal.label}
                          className="w-full h-36 object-cover rounded-lg"
                        />
                      )}
                      {existingLog.note && (
                        <p className="text-sm font-body text-muted-foreground leading-relaxed">
                          {existingLog.note}
                        </p>
                      )}
                      {!existingLog.imageUrl && !existingLog.note && (
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
                      {/* Image Upload */}
                      <div>
                        <input
                          type="file"
                          accept="image/*"
                          ref={(el) => {
                            fileRefs.current[meal.key] = el;
                          }}
                          className="hidden"
                          onChange={(e) =>
                            handleImageChange(
                              meal.key,
                              e.target.files?.[0] ?? null,
                            )
                          }
                          data-ocid={`meals.upload_button.${i + 1}`}
                        />
                        {preview ? (
                          <div className="relative">
                            <img
                              src={preview}
                              alt="Preview"
                              className="w-full h-36 object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              className="absolute top-2 right-2 bg-white/90 hover:bg-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow"
                              onClick={() => handleImageChange(meal.key, null)}
                            >
                              ✕
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="w-full h-24 rounded-lg flex flex-col items-center justify-center gap-2 border-2 border-dashed transition-colors hover:opacity-80"
                            style={{
                              borderColor: `${meal.color}50`,
                              background: meal.lightBg,
                              color: meal.color,
                            }}
                            onClick={() => fileRefs.current[meal.key]?.click()}
                          >
                            <ImagePlus className="w-5 h-5" />
                            <span className="text-xs font-body font-medium">
                              Upload photo
                            </span>
                          </button>
                        )}
                      </div>

                      {/* Note */}
                      <Textarea
                        placeholder={
                          meal.key === "footsteps"
                            ? "How many steps today?"
                            : "Add a note..."
                        }
                        value={notes[meal.key] ?? ""}
                        onChange={(e) =>
                          setNotes((prev) => ({
                            ...prev,
                            [meal.key]: e.target.value.slice(0, 200),
                          }))
                        }
                        className="resize-none text-sm font-body min-h-[72px]"
                        maxLength={200}
                        data-ocid={`meals.textarea.${i + 1}`}
                      />

                      {/* Save Button */}
                      <Button
                        className="w-full gap-2 mt-auto"
                        onClick={() => handleSave(meal)}
                        disabled={isSaving || isUploading}
                        style={{
                          background: meal.color,
                          color: "white",
                        }}
                        data-ocid={`meals.save_button.${i + 1}`}
                      >
                        {isSaving || isUploading ? (
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

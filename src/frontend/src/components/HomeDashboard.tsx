import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CalendarDays,
  Camera,
  CheckCircle,
  Loader2,
  Plus,
  Save,
  Scale,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";
import {
  useAllPromotions,
  useLogWeight,
  useUpcomingClasses,
  useWeightLogs,
} from "../hooks/useQueries";
import {
  awardPoints,
  getBonusStreak,
  getMilestoneCount,
  getPoints,
  getPointsHistory,
  recordDailyBonus,
} from "../utils/points";
import MotivationPanel from "./MotivationPanel";
import NutritionPanel from "./NutritionPanel";

interface HomeDashboardProps {
  principal: Principal;
}

const MEALS = [
  {
    key: "breakfast",
    label: "Breakfast",
    emoji: "🍳",
    number: 1,
    color: "oklch(0.45 0.12 152)",
    lightBg: "oklch(0.97 0.02 70)",
  },
  {
    key: "mid_morning_snacks",
    label: "Morning Snack",
    emoji: "🥪",
    number: 2,
    color: "oklch(0.6 0.18 140)",
    lightBg: "oklch(0.97 0.02 140)",
  },
  {
    key: "lunch",
    label: "Lunch",
    emoji: "🍱",
    number: 3,
    color: "oklch(0.55 0.18 200)",
    lightBg: "oklch(0.97 0.02 200)",
  },
  {
    key: "evening_snacks",
    label: "Evening Snacks",
    emoji: "🍎",
    number: 4,
    color: "oklch(0.55 0.22 25)",
    lightBg: "oklch(0.97 0.02 25)",
  },
  {
    key: "dinner",
    label: "Dinner",
    emoji: "🍽️",
    number: 5,
    color: "oklch(0.5 0.18 280)",
    lightBg: "oklch(0.97 0.015 280)",
  },
  {
    key: "footsteps",
    label: "Footsteps Count",
    emoji: "👣",
    number: 6,
    color: "oklch(0.55 0.16 160)",
    lightBg: "oklch(0.97 0.02 160)",
  },
];

const MOTIVATIONAL_QUOTES = [
  "Every rep, every step, every drop of sweat is building the best version of you. 💪",
  "You didn't come this far to only come this far. Keep pushing! 🔥",
  "The only bad workout is the one that didn't happen. Show up today! 🌟",
  "Your body achieves what your mind believes. Trust the process. ✨",
  "Champions aren't made in gyms. Champions are made from something deep inside them. 🏆",
  "Fitness is not about being better than someone else — it's about being better than you used to be. 💥",
  "Small daily improvements over time lead to stunning results. Stay consistent! 🎯",
  "The pain you feel today will be the strength you feel tomorrow. 🦁",
  "Don't wish for it, work for it. You've got this! 🚀",
  "Eat clean, train hard, stay humble. You're on the right path! 🥗",
];

function getDailyQuote(): string {
  const start = new Date(new Date().getFullYear(), 0, 0);
  const diff = Number(new Date()) - Number(start);
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

function getPast7Days(): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split("T")[0]);
  }
  return days;
}

function WeeklyMealSummary() {
  const { actor, isFetching } = useActor();
  const past7Days = getPast7Days();

  const queries = useQueries({
    queries: past7Days.map((date) => ({
      queryKey: ["mealLogs", date],
      queryFn: async () => {
        if (!actor) return [] as import("../backend").MealLog[];
        return actor.getTodayMealLogs(date);
      },
      enabled: !!actor && !isFetching,
    })),
  });

  const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      data-ocid="home.weekly_summary.card"
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid oklch(0.9 0.01 80)",
        boxShadow: "0 2px 12px oklch(0.45 0.12 152 / 0.07)",
      }}
    >
      {/* Orange header strip */}
      <div
        className="px-4 py-2.5 flex items-center gap-2"
        style={{
          background:
            "linear-gradient(90deg, oklch(0.45 0.12 152), oklch(0.32 0.09 152))",
        }}
      >
        <span className="text-white text-sm">📅</span>
        <h3 className="font-display font-bold text-sm text-white">
          Weekly Meal Summary
        </h3>
        <span className="ml-auto text-white/60 text-xs font-body">
          Last 7 days
        </span>
      </div>

      {/* Meal key row */}
      <div
        className="px-4 pt-2 pb-1 flex items-center gap-2"
        style={{ background: "oklch(0.98 0.005 70)" }}
      >
        <span className="text-xs font-body text-muted-foreground w-20 shrink-0">
          Day
        </span>
        <div className="flex gap-1.5 flex-1">
          {MEALS.map((m) => (
            <span
              key={m.key}
              className="text-xs"
              title={m.label}
              style={{ width: "22px", textAlign: "center" }}
            >
              {m.emoji}
            </span>
          ))}
        </div>
      </div>

      {/* Day rows */}
      <div className="divide-y divide-muted" style={{ background: "white" }}>
        {past7Days.map((date, idx) => {
          const logs = queries[idx]?.data ?? [];
          const isLoading = queries[idx]?.isLoading;
          const dayDate = new Date(`${date}T00:00:00`);
          const dayName = DAY_NAMES[dayDate.getDay()];
          const dayNum = dayDate.getDate();
          const isToday = idx === 6;

          return (
            <div
              key={date}
              className="px-4 py-2 flex items-center gap-2"
              style={{
                background: isToday ? "oklch(0.97 0.02 70)" : "white",
              }}
            >
              <div className="w-20 shrink-0 flex items-center gap-1.5">
                <span
                  className="text-xs font-display font-bold"
                  style={{
                    color: isToday
                      ? "oklch(0.42 0.12 152)"
                      : "oklch(0.5 0.01 260)",
                  }}
                >
                  {dayName}
                </span>
                <span
                  className="text-xs font-body"
                  style={{ color: "oklch(0.65 0.01 260)" }}
                >
                  {dayNum}
                </span>
                {isToday && (
                  <span
                    className="text-xs px-1 py-0.5 rounded font-bold"
                    style={{
                      background: "oklch(0.45 0.12 152 / 0.15)",
                      color: "oklch(0.42 0.12 152)",
                      fontSize: "9px",
                    }}
                  >
                    NOW
                  </span>
                )}
              </div>
              <div className="flex gap-1.5 flex-1">
                {isLoading ? (
                  <div
                    className="h-4 w-full rounded animate-pulse"
                    style={{ background: "oklch(0.93 0.01 80)" }}
                  />
                ) : (
                  MEALS.map((meal) => {
                    const logged = logs.some((l) => l.mealType === meal.key);
                    return (
                      <div
                        key={meal.key}
                        title={`${meal.label}: ${logged ? "Logged" : "Not logged"}`}
                        style={{ width: "22px", textAlign: "center" }}
                      >
                        {logged ? (
                          <CheckCircle
                            className="inline-block w-4 h-4"
                            style={{ color: meal.color }}
                          />
                        ) : (
                          <div
                            className="inline-block w-4 h-4 rounded-full border-2"
                            style={{
                              borderColor: "oklch(0.85 0.01 80)",
                            }}
                          />
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

const TODAY = new Date().toISOString().split("T")[0];
const WEIGHT_IMAGE_KEY = `hn_weight_image_${TODAY}`;

export default function HomeDashboard({ principal }: HomeDashboardProps) {
  const { data: promotions = [], isLoading: promoLoading } = useAllPromotions();
  const { data: classes = [], isLoading: classLoading } = useUpcomingClasses();
  const { actor, isFetching } = useActor();
  const qc = useQueryClient();

  const { data: weightLogs = [] } = useWeightLogs(principal);
  const logWeight = useLogWeight();
  const [weightInput, setWeightInput] = useState("");
  const [weightUnit, setWeightUnit] = useState<"kg" | "lbs">("kg");
  const [weightImage, setWeightImage] = useState<string | null>(() =>
    localStorage.getItem(WEIGHT_IMAGE_KEY),
  );
  const weightFileRef = useRef<HTMLInputElement>(null);

  const todayWeightEntry = weightLogs.find((l) => l.date === TODAY);
  const alreadyLoggedWeight = !!todayWeightEntry && !todayWeightEntry.absent;

  const [mealNotes, setMealNotes] = useState<Record<string, string>>({});
  const [mealImages, setMealImages] = useState<Record<string, string>>({});
  const mealImageRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [savingMeal, setSavingMeal] = useState<string | null>(null);
  const [rewardChartOpen, setRewardChartOpen] = useState(false);
  const [promoSlide, setPromoSlide] = useState(0);
  const [classSlide, setClassSlide] = useState(0);
  const principalStr = principal.toText();
  const [pointsTotal, setPointsTotal] = useState(() =>
    getPoints(principal.toText()),
  );
  const [activityCount, setActivityCount] = useState(0);
  const onActivity = () => setActivityCount((c) => c + 1);

  const { data: todayMealLogs = [] } = useQuery({
    queryKey: ["mealLogs", TODAY],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTodayMealLogs(TODAY);
    },
    enabled: !!actor && !isFetching,
  });

  const saveMealMutation = useMutation({
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

  const handleWeightImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large. Max 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      setWeightImage(dataUrl);
      localStorage.setItem(WEIGHT_IMAGE_KEY, dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleMealImageSelect = (
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

  const handleWeightLog = async () => {
    if (!weightInput || Number.isNaN(Number.parseFloat(weightInput))) {
      toast.error("Please enter a valid weight");
      return;
    }
    if (!weightImage) {
      toast.error("Please upload a progress photo to log your weight");
      return;
    }
    try {
      await logWeight.mutateAsync({
        date: TODAY,
        weight: Number.parseFloat(weightInput),
      });
      awardPoints(principalStr, 20, "Weight logged");
      setPointsTotal(getPoints(principalStr));
      toast.success("Weight logged! +20 pts 🪙");
      onActivity();
      setWeightInput("");
    } catch {
      toast.error("Failed to log weight");
    }
  };

  const handleMealSave = async (meal: (typeof MEALS)[0]) => {
    if (!mealImages[meal.key]) {
      toast.error(`📸 Please upload a meal photo for ${meal.label} first`);
      return;
    }
    setSavingMeal(meal.key);
    try {
      const note = mealNotes[meal.key] ?? "";
      await saveMealMutation.mutateAsync({
        mealType: meal.key,
        note,
        imageUrl: mealImages[meal.key] ?? null,
      });
      const mealPts = meal.key === "footsteps" ? 20 : 10;
      const mealPtsLabel =
        meal.key === "footsteps"
          ? "Footsteps logged"
          : `${meal.label} checked in`;
      awardPoints(principalStr, mealPts, mealPtsLabel);

      // Check daily all-check-in bonus
      const allMealKeys = [
        "breakfast",
        "morning_snack",
        "lunch",
        "evening_snacks",
        "dinner",
        "footsteps",
      ];
      const bonusDateKey = `hn_daily_bonus_date_${principalStr}`;
      const alreadyBonusToday = localStorage.getItem(bonusDateKey) === TODAY;
      if (!alreadyBonusToday) {
        const savedMealKey = meal.key;
        const currentMealLogs = await (async () => {
          try {
            return actor ? await actor.getTodayMealLogs(TODAY) : [];
          } catch {
            return [];
          }
        })();
        const loggedKeys = new Set(
          currentMealLogs.map((l: { mealType: string }) => l.mealType),
        );
        loggedKeys.add(savedMealKey);
        const weightDoneToday = !!weightLogs.find(
          (l: { date: string; absent: boolean }) =>
            l.date === TODAY && !l.absent,
        );
        const allMealsDone = allMealKeys.every((k) => loggedKeys.has(k));
        if (allMealsDone && weightDoneToday) {
          awardPoints(principalStr, 50, "Daily all-check-in bonus!");
          localStorage.setItem(bonusDateKey, TODAY);
          const result = recordDailyBonus(principalStr);
          toast.success("🎉 Daily bonus! +50 pts");
          if (result.streakBonus) {
            toast.success("🔥 7-day streak! +500 milestone pts!");
          }
          if (result.extraBonus > 0) {
            toast.success(
              `🏆 Milestone x${result.milestoneCount}! +${result.extraBonus} bonus pts!`,
            );
          }
        }
      }

      setPointsTotal(getPoints(principalStr));
      toast.success(`${meal.emoji} ${meal.label} logged! +${mealPts} pts 🪙`);
      onActivity();
      setMealNotes((prev) => ({ ...prev, [meal.key]: "" }));
    } catch {
      toast.error(`Failed to save ${meal.label}. Try again.`);
    } finally {
      setSavingMeal(null);
    }
  };

  const getMealLog = (key: string) =>
    todayMealLogs.find((l) => l.mealType === key);
  const loggedMealCount = MEALS.filter((m) => !!getMealLog(m.key)).length;

  const sortedPromos = [...promotions].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  // Auto-advance slideshows
  useEffect(() => {
    if (sortedPromos.length < 2) return;
    const t = setInterval(
      () => setPromoSlide((s) => (s + 1) % sortedPromos.length),
      3000,
    );
    return () => clearInterval(t);
  }, [sortedPromos.length]);

  useEffect(() => {
    if (classes.length < 2) return;
    const t = setInterval(
      () => setClassSlide((s) => (s + 1) % classes.length),
      3000,
    );
    return () => clearInterval(t);
  }, [classes.length]);

  const dailyQuote = getDailyQuote();

  const containerVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
    },
  };

  const PROMO_PILL_COLORS = [
    "linear-gradient(135deg, oklch(0.45 0.12 152), oklch(0.32 0.09 152))",
    "linear-gradient(135deg, oklch(0.5 0.2 30), oklch(0.42 0.18 20))",
    "linear-gradient(135deg, oklch(0.48 0.18 280), oklch(0.4 0.16 300))",
    "linear-gradient(135deg, oklch(0.5 0.18 150), oklch(0.42 0.15 160))",
  ];

  const CLASS_PILL_COLORS = [
    "linear-gradient(135deg, oklch(0.55 0.18 200), oklch(0.45 0.16 210))",
    "linear-gradient(135deg, oklch(0.5 0.16 260), oklch(0.42 0.14 270))",
    "linear-gradient(135deg, oklch(0.52 0.18 140), oklch(0.44 0.16 150))",
    "linear-gradient(135deg, oklch(0.38 0.1 152), oklch(0.30 0.09 152))",
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start">
      {/* Left column: all main content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="flex-1 min-w-0 space-y-4"
      >
        {/* ── 2. TOP STRIP: Hot Promotions + Classes slideshows ── */}
        <motion.div variants={itemVariants} className="space-y-2">
          {/* Hot Promotions Slideshow */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">🔥</span>
              <span className="font-display font-bold text-xs text-foreground">
                Hot Promotions
              </span>
              {!promoLoading && sortedPromos.length > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: "oklch(0.45 0.12 152 / 0.12)",
                    color: "oklch(0.42 0.12 152)",
                  }}
                >
                  {sortedPromos.length}
                </span>
              )}
            </div>
            {promoLoading ? (
              <div
                className="w-full h-14 rounded-xl animate-pulse"
                style={{ background: "oklch(0.92 0.01 80)" }}
              />
            ) : sortedPromos.length === 0 ? (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "oklch(0.97 0.01 80)",
                  border: "1px dashed oklch(0.45 0.12 152 / 0.25)",
                }}
              >
                <Sparkles className="w-3.5 h-3.5 text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground font-body">
                  No promotions yet
                </span>
              </div>
            ) : (
              <div>
                <div
                  className="relative w-full h-14 rounded-xl overflow-hidden"
                  data-ocid="home.promotions.item.1"
                  style={{
                    background:
                      PROMO_PILL_COLORS[promoSlide % PROMO_PILL_COLORS.length],
                  }}
                >
                  <div className="w-full h-full px-3 py-2 flex flex-col justify-between">
                    <span className="text-white/70 text-xs font-body">
                      Promo ✨
                    </span>
                    <p className="text-white font-display font-bold text-xs leading-tight line-clamp-1">
                      {sortedPromos[promoSlide]?.title}
                    </p>
                  </div>
                </div>
                {sortedPromos.length > 1 && (
                  <div className="flex justify-center gap-1 mt-1">
                    {sortedPromos.map((promo, i) => (
                      <button
                        key={promo.id.toString()}
                        type="button"
                        onClick={() => setPromoSlide(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{
                          background:
                            i === promoSlide
                              ? "oklch(0.45 0.12 152)"
                              : "oklch(0.45 0.12 152 / 0.3)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Ongoing Classes Slideshow */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-sm">📅</span>
              <span className="font-display font-bold text-xs text-foreground">
                Ongoing Classes
              </span>
              {!classLoading && classes.length > 0 && (
                <span
                  className="px-1.5 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    background: "oklch(0.55 0.18 200 / 0.12)",
                    color: "oklch(0.45 0.16 200)",
                  }}
                >
                  {classes.length}
                </span>
              )}
            </div>
            {classLoading ? (
              <div
                className="w-full h-14 rounded-xl animate-pulse"
                style={{ background: "oklch(0.92 0.01 80)" }}
              />
            ) : classes.length === 0 ? (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: "oklch(0.97 0.01 80)",
                  border: "1px dashed oklch(0.55 0.18 200 / 0.25)",
                }}
              >
                <CalendarDays className="w-3.5 h-3.5 text-muted-foreground/40" />
                <span className="text-xs text-muted-foreground font-body">
                  No classes scheduled
                </span>
              </div>
            ) : (
              <div>
                <div
                  className="relative w-full h-14 rounded-xl overflow-hidden"
                  data-ocid="home.classes.chip.1"
                  style={{
                    background:
                      CLASS_PILL_COLORS[classSlide % CLASS_PILL_COLORS.length],
                  }}
                >
                  <div className="w-full h-full px-3 py-2 flex flex-col justify-between">
                    <span className="text-white/70 text-xs font-body">
                      {classes[classSlide]?.date}
                    </span>
                    <p className="text-white font-display font-bold text-xs leading-tight line-clamp-1">
                      {classes[classSlide]?.name}
                    </p>
                  </div>
                </div>
                {classes.length > 1 && (
                  <div className="flex justify-center gap-1 mt-1">
                    {classes.map((cls, i) => (
                      <button
                        key={cls.id.toString()}
                        type="button"
                        onClick={() => setClassSlide(i)}
                        className="w-1.5 h-1.5 rounded-full transition-all"
                        style={{
                          background:
                            i === classSlide
                              ? "oklch(0.45 0.16 200)"
                              : "oklch(0.45 0.16 200 / 0.3)",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── 1. MOTIVATIONAL DAILY UPDATE (TOP) ── */}
        <motion.div variants={itemVariants} data-ocid="home.motivation.card">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.45 0.12 152) 0%, oklch(0.5 0.22 30) 60%, oklch(0.45 0.18 15) 100%)",
              boxShadow: "0 3px 16px oklch(0.45 0.12 152 / 0.22)",
            }}
          >
            <div className="px-4 py-3 flex items-center gap-3">
              <span className="text-2xl shrink-0">💪</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-display font-bold text-sm leading-snug">
                  {dailyQuote}
                </p>
                <p className="text-white/55 text-xs font-body mt-0.5">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 1.5 POINTS CARD ── */}
        <motion.div variants={itemVariants} data-ocid="home.points.card">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.2 0.04 260), oklch(0.16 0.03 260))",
              border: "1.5px solid oklch(0.52 0.14 152 / 0.35)",
              boxShadow: "0 4px 20px oklch(0.52 0.14 152 / 0.12)",
            }}
          >
            {/* Top strip */}
            <div
              className="h-0.5 w-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.52 0.14 152), oklch(0.38 0.1 152))",
              }}
            />
            <div className="px-4 py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "oklch(0.52 0.14 152 / 0.2)",
                    border: "1px solid oklch(0.52 0.14 152 / 0.3)",
                  }}
                >
                  <span className="text-xl">🪙</span>
                </div>
                <div>
                  <p
                    className="font-display font-extrabold text-2xl leading-none"
                    style={{ color: "oklch(0.82 0.18 60)" }}
                  >
                    {pointsTotal.toLocaleString()}
                  </p>
                  <p
                    className="text-xs font-body font-semibold"
                    style={{ color: "oklch(0.65 0.1 60)" }}
                  >
                    HN Reward Points
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0" />
            </div>
            {/* Last 3 earned */}
            {getPointsHistory(principalStr).slice(0, 3).length > 0 && (
              <div
                className="px-4 pb-3 space-y-0.5"
                style={{ borderTop: "1px solid oklch(0.52 0.14 152 / 0.1)" }}
              >
                <p
                  className="text-xs font-body pt-2"
                  style={{ color: "oklch(0.55 0.06 260)" }}
                >
                  Recent activity
                </p>
                {getPointsHistory(principalStr)
                  .slice(0, 3)
                  .map((entry) => (
                    <div
                      key={`${entry.timestamp}-${entry.label}`}
                      className="flex items-center justify-between"
                    >
                      <span
                        className="text-xs font-body"
                        style={{ color: "oklch(0.7 0.05 260)" }}
                      >
                        {entry.label}
                      </span>
                      <span
                        className="text-xs font-bold font-display"
                        style={{
                          color:
                            entry.amount > 0
                              ? "oklch(0.6 0.18 145)"
                              : "oklch(0.6 0.18 25)",
                        }}
                      >
                        {entry.amount > 0 ? "+" : ""}
                        {entry.amount} pts
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* ── MILESTONE REWARD CHART ── */}
        <motion.div variants={itemVariants} data-ocid="home.milestone.card">
          {(() => {
            const streak = getBonusStreak(principalStr);
            const milestones = getMilestoneCount(principalStr);
            const tiers = [
              {
                label: "Complete all check-ins daily",
                sub: "(6 meals + weight)",
                pts: "+50 pts",
                req: 0,
                achieved: false,
                daily: true,
              },
              {
                label: "7-Day streak",
                sub: "Consecutive daily bonuses",
                pts: "+500 pts",
                req: 1,
                achieved: milestones >= 1,
              },
              {
                label: "2nd milestone",
                sub: "Earn 7-day streak again",
                pts: "+500 extra",
                req: 2,
                achieved: milestones >= 2,
              },
              {
                label: "3rd milestone",
                sub: "Keep the streak going!",
                pts: "+1,000 extra",
                req: 3,
                achieved: milestones >= 3,
              },
              {
                label: "4th milestone",
                sub: "Ultimate achievement",
                pts: "+2,000 extra",
                req: 4,
                achieved: milestones >= 4,
              },
            ];
            return (
              <div
                className="rounded-xl overflow-hidden"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.18 0.04 260), oklch(0.15 0.03 260))",
                  border: "1.5px solid oklch(0.52 0.14 152 / 0.25)",
                }}
              >
                <div
                  className="h-0.5 w-full"
                  style={{
                    background:
                      "linear-gradient(90deg, oklch(0.52 0.14 152), oklch(0.38 0.1 152))",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setRewardChartOpen((o) => !o)}
                  className="w-full px-4 pt-3 pb-1 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">🏆</span>
                    <span className="font-display font-bold text-sm text-foreground">
                      Milestone Reward Chart
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-xs font-body px-2 py-0.5 rounded-full"
                      style={{
                        background: "oklch(0.52 0.14 152 / 0.15)",
                        color: "oklch(0.52 0.14 152)",
                      }}
                    >
                      {milestones} milestone{milestones !== 1 ? "s" : ""}
                    </span>
                    <svg
                      role="img"
                      aria-label="toggle rewards chart"
                      className="w-4 h-4 transition-transform duration-300"
                      style={{
                        color: "oklch(0.52 0.14 152)",
                        transform: rewardChartOpen
                          ? "rotate(180deg)"
                          : "rotate(0deg)",
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </button>
                {!rewardChartOpen && (
                  <p
                    className="px-4 pb-2 text-xs font-body"
                    style={{ color: "oklch(0.55 0.06 260)" }}
                  >
                    Tap to see your rewards chart
                  </p>
                )}
                {rewardChartOpen && (
                  <div>
                    {/* collapsible content start */}
                    {/* Streak bar */}
                    <div className="px-4 pb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="text-xs font-body"
                          style={{ color: "oklch(0.6 0.08 60)" }}
                        >
                          🔥 Daily streak: {streak}/7 days
                        </span>
                        <span
                          className="text-xs font-body"
                          style={{ color: "oklch(0.52 0.14 152)" }}
                        >
                          {streak >= 7
                            ? "Milestone earned!"
                            : `${7 - streak} days to go`}
                        </span>
                      </div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: "oklch(0.25 0.03 260)" }}
                      >
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, (streak / 7) * 100)}%`,
                            background:
                              "linear-gradient(90deg, oklch(0.52 0.14 152), oklch(0.38 0.1 152))",
                          }}
                        />
                      </div>
                    </div>
                    {/* Tiers */}
                    <div className="px-3 pb-3 space-y-1.5">
                      {tiers.map((tier) => (
                        <div
                          key={tier.label}
                          className="flex items-center justify-between px-3 py-2 rounded-lg"
                          style={{
                            background:
                              tier.achieved || tier.daily
                                ? "oklch(0.52 0.14 152 / 0.1)"
                                : "oklch(0.22 0.03 260)",
                            border: `1px solid ${tier.achieved || tier.daily ? "oklch(0.52 0.14 152 / 0.35)" : "oklch(0.3 0.02 260)"}`,
                            opacity: !tier.achieved && !tier.daily ? 0.6 : 1,
                          }}
                        >
                          <div>
                            <p
                              className="text-xs font-body font-semibold"
                              style={{
                                color:
                                  tier.achieved || tier.daily
                                    ? "oklch(0.85 0.12 60)"
                                    : "oklch(0.65 0.05 260)",
                              }}
                            >
                              {tier.label}
                            </p>
                            <p
                              className="text-xs font-body"
                              style={{ color: "oklch(0.55 0.05 260)" }}
                            >
                              {tier.sub}
                            </p>
                          </div>
                          <span
                            className="text-xs font-display font-bold px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              background:
                                tier.achieved || tier.daily
                                  ? "oklch(0.52 0.14 152 / 0.2)"
                                  : "oklch(0.28 0.02 260)",
                              color:
                                tier.achieved || tier.daily
                                  ? "oklch(0.52 0.14 152)"
                                  : "oklch(0.5 0.03 260)",
                            }}
                          >
                            {tier.pts}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}{" "}
                {/* collapsible content end */}
              </div>
            );
          })()}
        </motion.div>

        {/* ── 3. QUICK WEIGHT LOG ── */}
        <motion.div variants={itemVariants} data-ocid="home.weight.card">
          <div
            className="rounded-xl overflow-hidden"
            style={{
              background: alreadyLoggedWeight
                ? "linear-gradient(135deg, oklch(0.55 0.18 145), oklch(0.45 0.15 145))"
                : "linear-gradient(135deg, oklch(0.45 0.12 152), oklch(0.32 0.09 152))",
              boxShadow: "0 3px 16px oklch(0.45 0.12 152 / 0.18)",
            }}
          >
            <div className="px-4 py-3">
              {alreadyLoggedWeight ? (
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0">
                    <Scale className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-display font-bold text-sm">
                      Weight logged today ✓
                    </p>
                    <p className="text-white/70 text-xs font-body">
                      {todayWeightEntry?.weight} {weightUnit} — {TODAY}
                    </p>
                  </div>
                  {weightImage && (
                    <div className="ml-auto relative shrink-0">
                      <img
                        src={weightImage}
                        alt="Progress"
                        className="h-12 w-12 object-cover rounded-lg border-2 border-white/30"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Scale className="w-4 h-4 text-white shrink-0" />
                    <p className="text-white font-display font-bold text-sm">
                      Log today's weight
                    </p>
                    <span
                      className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full"
                      style={{
                        background: "oklch(1 0 0 / 0.2)",
                        color: "white",
                      }}
                    >
                      +20 pts
                    </span>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="number"
                      placeholder="e.g. 70.5"
                      step="0.1"
                      value={weightInput}
                      onChange={(e) => setWeightInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleWeightLog()}
                      data-ocid="home.weight.input"
                      className="h-8 text-sm bg-white/20 border-white/30 text-white placeholder:text-white/50 flex-1"
                    />
                    <div className="flex rounded-lg overflow-hidden border border-white/30">
                      {(["kg", "lbs"] as const).map((u) => (
                        <button
                          type="button"
                          key={u}
                          onClick={() => setWeightUnit(u)}
                          className={`px-2 py-1 text-xs font-body font-semibold transition-colors ${
                            weightUnit === u
                              ? "bg-white text-green-700"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => weightFileRef.current?.click()}
                      data-ocid="home.weight.upload_button"
                      className={`h-8 w-8 flex items-center justify-center rounded-lg border transition-colors shrink-0 ${
                        weightImage
                          ? "bg-green-500/30 border-green-300/50"
                          : "bg-white/20 hover:bg-white/30 border-white/30"
                      }`}
                      title="Upload progress photo (required)"
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </button>
                    <input
                      ref={weightFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleWeightImageSelect}
                    />
                    <Button
                      size="sm"
                      onClick={handleWeightLog}
                      disabled={logWeight.isPending || !weightImage}
                      data-ocid="home.weight.log.button"
                      className="h-8 bg-white text-green-700 hover:bg-white/90 font-bold px-3 disabled:opacity-50"
                    >
                      {logWeight.isPending ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Plus className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                  {weightImage && (
                    <div className="flex items-center gap-2 mt-2">
                      <div className="relative shrink-0">
                        <img
                          src={weightImage}
                          alt="Progress"
                          className="h-12 w-12 object-cover rounded-lg border-2 border-white/30"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setWeightImage(null);
                            localStorage.removeItem(WEIGHT_IMAGE_KEY);
                          }}
                          className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                          data-ocid="home.weight.remove_image.button"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      </div>
                      <span className="text-white/70 text-xs font-body">
                        Progress photo ready ✓
                      </span>
                    </div>
                  )}
                  {!weightImage && (
                    <p className="text-red-200 text-xs mt-1.5 font-body flex items-center gap-1">
                      <Camera className="w-3 h-3" /> Tap camera icon to add a
                      progress photo (required)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <NutritionPanel activityCount={activityCount} />
        {/* ── 4. TODAY'S MEALS ── */}
        <motion.section variants={itemVariants} data-ocid="home.meals.section">
          <div className="flex items-center gap-2 mb-3">
            <Utensils className="w-4 h-4 text-primary" />
            <h2 className="font-display font-bold text-base gradient-fire-text">
              Today's Meals
            </h2>
            <span
              className="text-xs font-body ml-1"
              style={{ color: "oklch(0.45 0.12 152)" }}
            >
              +10 pts each
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold ml-1"
              style={{
                background: "oklch(0.45 0.12 152 / 0.12)",
                color: "oklch(0.42 0.12 152)",
                border: "1px solid oklch(0.45 0.12 152 / 0.3)",
              }}
            >
              {loggedMealCount}/{MEALS.length}
            </span>
          </div>

          <div className="mb-3">
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{
                  width: `${(loggedMealCount / MEALS.length) * 100}%`,
                }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ background: "oklch(0.45 0.12 152)" }}
              />
            </div>
          </div>

          <div className="space-y-2">
            {MEALS.map((meal, i) => {
              const existingLog = getMealLog(meal.key);
              const isLogged = !!existingLog;
              const isSaving = savingMeal === meal.key;
              const hasMealImage = !!mealImages[meal.key];

              return (
                <motion.div
                  key={meal.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  data-ocid={`home.meals.item.${i + 1}`}
                >
                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "oklch(1 0 0)",
                      border: isLogged
                        ? `1.5px solid ${meal.color.replace(")", " / 0.35)")}`
                        : "1px solid oklch(0.9 0.01 80)",
                      borderLeft: `3px solid ${meal.color}`,
                      boxShadow: isLogged
                        ? `0 1px 8px ${meal.color.replace(")", " / 0.08)")}`
                        : "none",
                    }}
                  >
                    <div
                      className="px-3 py-2 flex items-center justify-between"
                      style={{ background: meal.lightBg }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base">{meal.emoji}</span>
                        <div>
                          <p
                            className="font-display font-bold text-xs"
                            style={{ color: meal.color }}
                          >
                            {meal.label}
                          </p>
                          <p
                            className="text-xs font-body"
                            style={{ color: "oklch(0.6 0.01 80)" }}
                          >
                            Meal {meal.number} ·{" "}
                            <span
                              style={{
                                color: "oklch(0.55 0.16 145)",
                                fontWeight: 700,
                              }}
                            >
                              {meal.key === "footsteps" ? "+20 pts" : "+10 pts"}
                            </span>
                          </p>
                        </div>
                      </div>
                      {isLogged ? (
                        <div
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold"
                          style={{
                            background: "oklch(0.55 0.18 145 / 0.12)",
                            color: "oklch(0.38 0.14 145)",
                          }}
                        >
                          <CheckCircle className="w-3 h-3" /> Done
                        </div>
                      ) : (
                        <Badge
                          className="text-xs"
                          style={{
                            background: `${meal.color.replace(")", " / 0.1)")}`,
                            color: meal.color,
                            border: `1px solid ${meal.color.replace(")", " / 0.25)")}`,
                          }}
                        >
                          Log
                        </Badge>
                      )}
                    </div>

                    <div className="px-3 py-2">
                      {isLogged ? (
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-xs text-muted-foreground font-body flex-1 truncate">
                            {existingLog.note
                              ? `"${existingLog.note}"`
                              : "Logged — no note added."}
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              setMealNotes((prev) => ({
                                ...prev,
                                [meal.key]: existingLog.note ?? "",
                              }));
                              qc.setQueryData(
                                ["mealLogs", TODAY],
                                (old: typeof todayMealLogs) =>
                                  old?.filter((l) => l.mealType !== meal.key) ??
                                  [],
                              );
                            }}
                            className="text-xs font-body font-semibold shrink-0 px-1.5 py-0.5 rounded hover:bg-muted transition-colors"
                            style={{ color: meal.color }}
                            data-ocid={`home.meals.edit_button.${i + 1}`}
                          >
                            ✏️
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2 items-start">
                          <Textarea
                            placeholder={
                              meal.key === "footsteps"
                                ? "Enter today's step count..."
                                : `Note for ${meal.label}...`
                            }
                            value={mealNotes[meal.key] ?? ""}
                            onChange={(e) =>
                              setMealNotes((prev) => ({
                                ...prev,
                                [meal.key]: e.target.value.slice(0, 200),
                              }))
                            }
                            className="resize-none text-xs font-body min-h-[44px] flex-1"
                            maxLength={200}
                            data-ocid={`home.meals.textarea.${i + 1}`}
                          />
                          <div className="flex flex-col gap-1.5 items-center shrink-0">
                            {hasMealImage ? (
                              <div className="relative">
                                <img
                                  src={mealImages[meal.key]}
                                  alt={meal.label}
                                  className="h-11 w-11 object-cover rounded-lg border"
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
                                  className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                                  data-ocid={`home.meals.remove_image.${i + 1}`}
                                >
                                  <X className="w-2.5 h-2.5" />
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() =>
                                  mealImageRefs.current[meal.key]?.click()
                                }
                                className="w-8 h-8 flex items-center justify-center rounded-lg border-2 border-dashed hover:opacity-80 transition-opacity"
                                style={{
                                  borderColor: `${meal.color.replace(")", " / 0.4)")}`,
                                }}
                                title="Upload meal photo (required)"
                                data-ocid={`home.meals.upload_button.${i + 1}`}
                              >
                                <Camera
                                  className="w-4 h-4"
                                  style={{ color: meal.color }}
                                />
                              </button>
                            )}
                            <input
                              ref={(el) => {
                                mealImageRefs.current[meal.key] = el;
                              }}
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleMealImageSelect(e, meal.key)
                              }
                            />
                            <Button
                              onClick={() => handleMealSave(meal)}
                              disabled={isSaving || !hasMealImage}
                              size="sm"
                              className="h-7 px-2 gap-1 disabled:opacity-50 text-xs"
                              style={{ background: meal.color, color: "white" }}
                              data-ocid={`home.meals.save_button.${i + 1}`}
                            >
                              {isSaving ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <Save className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* ── 4b. DAILY MOTIVATION ── */}
        <motion.div variants={itemVariants}>
          <MotivationPanel activityCount={activityCount} />
        </motion.div>

        {/* ── 5. WEEKLY MEAL SUMMARY ── */}
        <motion.div variants={itemVariants}>
          <WeeklyMealSummary />
        </motion.div>
      </motion.div>

      {/* Right column: Empty (Nutrition panel is inline) */}
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CalendarDays,
  CheckCircle,
  ExternalLink,
  Flame,
  Link,
  Loader2,
  Quote,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  useAllPromotions,
  useEnrollInClass,
  useUpcomingClasses,
  useUserProfile,
} from "../hooks/useQueries";

interface HomeDashboardProps {
  principal: Principal;
}

const MOTIVATIONAL_QUOTES = [
  "Push yourself, because no one else is going to do it for you.",
  "Success starts with self-discipline.",
  "The body achieves what the mind believes.",
  "Your only limit is you.",
  "Don't wish for it. Work for it.",
  "Be stronger than your excuses.",
  "Fall in love with taking care of your body.",
  "It always seems impossible until it's done.",
  "Train insane or remain the same.",
  "Your health is an investment, not an expense.",
  "Small steps every day lead to big results.",
  "Believe in yourself and your journey.",
  "Sweat now, shine later.",
  "You didn't come this far to only come this far.",
  "Consistency is the key to results.",
  "Make yourself proud.",
  "Every workout is progress.",
  "A healthy outside starts from the inside.",
  "Do something today that your future self will thank you for.",
  "Champions keep going when they don't feel like it.",
  "Strive for progress, not perfection.",
  "Your body can stand almost anything. It's your mind you have to convince.",
];

const PROMO_BG_LIST = [
  "linear-gradient(145deg, oklch(0.48 0.18 48), oklch(0.38 0.16 35))",
  "linear-gradient(145deg, oklch(0.45 0.2 30), oklch(0.38 0.18 20))",
  "linear-gradient(145deg, oklch(0.42 0.16 280), oklch(0.35 0.18 300))",
  "linear-gradient(145deg, oklch(0.45 0.18 150), oklch(0.38 0.15 160))",
];

const FLOATY_EMOJIS = [
  { emoji: "🔥", top: "15%", left: "5%", delay: 0, duration: 3 },
  { emoji: "💪", top: "28%", left: "88%", delay: 0.4, duration: 4 },
  { emoji: "⚡", top: "60%", left: "92%", delay: 0.8, duration: 3 },
  { emoji: "🏋️", top: "75%", left: "8%", delay: 1.2, duration: 4 },
  { emoji: "✨", top: "45%", left: "50%", delay: 0.6, duration: 3 },
  { emoji: "🎯", top: "10%", left: "70%", delay: 1.0, duration: 4 },
];

function getDailyQuote() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];
}

export default function HomeDashboard({ principal }: HomeDashboardProps) {
  const { data: profile } = useUserProfile();
  const { data: promotions = [], isLoading: promoLoading } = useAllPromotions();
  const { data: classes = [], isLoading: classLoading } = useUpcomingClasses();
  const enrollMutation = useEnrollInClass();

  const handleEnroll = async (classId: bigint, className: string) => {
    try {
      await enrollMutation.mutateAsync(classId);
      toast.success(`🎉 You're enrolled in ${className}!`);
    } catch {
      toast.error("Failed to enroll. You may already be enrolled.");
    }
  };

  const isEnrolled = (enrolledList: Principal[]) =>
    enrolledList.some((p) => p.toString() === principal.toString());

  const sortedPromos = [...promotions].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const userName = profile?.name?.trim() ? profile.name : "Champion";

  const dailyQuote = getDailyQuote();
  const todayStr = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

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

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Hero Banner */}
      <motion.div
        variants={itemVariants}
        className="relative rounded-2xl overflow-hidden shimmer"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.97 0.02 80) 0%, oklch(0.95 0.03 60) 100%)",
          border: "1px solid oklch(0.88 0.01 80)",
          boxShadow: "0 4px 24px oklch(0.65 0.22 48 / 0.1)",
        }}
      >
        <div
          className="absolute top-0 right-0 w-72 h-72 rounded-full blur-3xl opacity-20"
          style={{ background: "oklch(0.65 0.22 48)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 w-56 h-56 rounded-full blur-3xl opacity-10"
          style={{ background: "oklch(0.6 0.2 38)" }}
        />

        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
          {FLOATY_EMOJIS.map(({ emoji, top, left, delay, duration }) => (
            <span
              key={`${top}-${left}`}
              className="absolute text-2xl opacity-50"
              style={{
                top,
                left,
                animationDelay: `${delay}s`,
                animation: `float ${duration}s ease-in-out infinite`,
              }}
            >
              {emoji}
            </span>
          ))}
        </div>

        <div className="relative z-10 px-8 py-8 sm:px-12 sm:py-10">
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-5 h-5 text-primary" />
            <span className="text-primary font-body text-sm font-semibold tracking-wide uppercase">
              Welcome back
            </span>
          </div>
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl leading-tight mb-3 text-foreground">
            Ready to crush it,{" "}
            <span className="gradient-fire-text glow-text-intense">
              {userName}!
            </span>
          </h1>
          <p className="text-muted-foreground font-body text-base max-w-xl leading-relaxed">
            Your classes and latest promotions are waiting below. Keep pushing —
            every rep counts! 💥
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {["🏆 Stay Consistent", "📈 Track Progress", "🤝 Join Classes"].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full text-xs font-body font-semibold"
                  style={{
                    background: "oklch(0.65 0.22 48 / 0.1)",
                    border: "1px solid oklch(0.65 0.22 48 / 0.25)",
                    color: "oklch(0.5 0.18 48)",
                  }}
                >
                  {tag}
                </span>
              ),
            )}
          </div>
        </div>
      </motion.div>

      {/* Daily Motivational Quote */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-5 sm:p-6"
        style={{
          background: "oklch(0.97 0.03 70)",
          borderLeft: "4px solid oklch(0.65 0.22 48)",
          border: "1px solid oklch(0.88 0.02 75)",
          borderLeftWidth: "4px",
          boxShadow: "0 2px 16px oklch(0.65 0.22 48 / 0.07)",
        }}
        data-ocid="home.quote.card"
      >
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: "oklch(0.65 0.22 48 / 0.12)" }}
          >
            <Quote
              className="w-5 h-5"
              style={{ color: "oklch(0.65 0.22 48)" }}
            />
          </div>
          <div className="flex-1">
            <p
              className="font-display font-semibold text-base sm:text-lg leading-relaxed"
              style={{ color: "oklch(0.22 0.04 260)" }}
            >
              "{dailyQuote}"
            </p>
            <p
              className="mt-2 text-sm font-body"
              style={{ color: "oklch(0.55 0.01 260)" }}
            >
              ✨ Daily Motivation · {todayStr}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Hot Promotions */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-primary animate-pulse" />
            <h2 className="font-display font-bold text-xl sm:text-2xl gradient-fire-text">
              Hot Promotions
            </h2>
            <span className="text-xl">🔥</span>
          </div>
          {promotions.length > 0 && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: "oklch(0.65 0.22 48 / 0.12)",
                color: "oklch(0.5 0.18 48)",
                border: "1px solid oklch(0.65 0.22 48 / 0.3)",
              }}
            >
              {promotions.length} active
            </span>
          )}
        </div>

        {promoLoading ? (
          <div
            className="flex items-center gap-3 py-8 px-4 rounded-xl"
            style={{
              background: "oklch(0.97 0.01 80)",
              border: "1px solid oklch(0.9 0.01 80)",
            }}
            data-ocid="home.promotions.loading_state"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground font-body">
              Loading promotions...
            </span>
          </div>
        ) : sortedPromos.length === 0 ? (
          <div
            className="text-center py-8 rounded-xl"
            style={{
              background: "oklch(1 0 0)",
              border: "1px dashed oklch(0.65 0.22 48 / 0.25)",
            }}
            data-ocid="home.promotions.empty_state"
          >
            <Sparkles className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-body">
              No promotions right now. Check back soon!
            </p>
          </div>
        ) : (
          <ScrollArea className="w-full">
            <div className="flex gap-4 pb-3">
              {sortedPromos.map((promo, i) => (
                <motion.div
                  key={promo.id.toString()}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="shrink-0 w-68 sm:w-76"
                  data-ocid={`home.promotions.item.${i + 1}`}
                >
                  <div
                    className="rounded-2xl overflow-hidden card-glow-intense h-full"
                    style={{
                      background: PROMO_BG_LIST[i % PROMO_BG_LIST.length],
                    }}
                  >
                    {promo.imageUrl && (
                      <div className="w-full" style={{ maxHeight: "160px" }}>
                        <img
                          src={promo.imageUrl}
                          alt={promo.title}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="font-display font-bold text-base text-white leading-tight">
                          {promo.title}
                        </h3>
                        <Badge
                          className="shrink-0 text-xs font-bold"
                          style={{
                            background: "oklch(0.65 0.22 48 / 0.3)",
                            color: "oklch(0.96 0.1 65)",
                            border: "1px solid oklch(0.65 0.22 48 / 0.5)",
                            animation: "badge-pulse 2s ease-in-out infinite",
                          }}
                        >
                          ✨ Active
                        </Badge>
                      </div>
                      <p className="text-white/80 font-body text-sm leading-relaxed">
                        {promo.body}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        )}
      </motion.section>

      {/* Upcoming Classes */}
      <motion.section variants={itemVariants}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="font-display font-bold text-xl sm:text-2xl gradient-fire-text">
              Upcoming Classes
            </h2>
            <span className="text-xl">💪</span>
          </div>
          {classes.length > 0 && (
            <span
              className="px-2.5 py-0.5 rounded-full text-xs font-bold"
              style={{
                background: "oklch(0.65 0.22 48 / 0.12)",
                color: "oklch(0.5 0.18 48)",
                border: "1px solid oklch(0.65 0.22 48 / 0.3)",
              }}
            >
              {classes.length} available
            </span>
          )}
        </div>

        {classLoading ? (
          <div
            className="flex items-center gap-3 py-8 px-4 rounded-xl"
            style={{
              background: "oklch(0.97 0.01 80)",
              border: "1px solid oklch(0.9 0.01 80)",
            }}
            data-ocid="home.classes.loading_state"
          >
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground font-body">
              Loading classes...
            </span>
          </div>
        ) : classes.length === 0 ? (
          <div
            className="text-center py-8 rounded-xl"
            style={{
              background: "oklch(1 0 0)",
              border: "1px dashed oklch(0.65 0.22 48 / 0.25)",
            }}
            data-ocid="home.classes.empty_state"
          >
            <CalendarDays className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground font-body">
              No classes yet. Your coach will schedule sessions soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls, i) => {
              const enrolled = Number(cls.enrolled.length);
              const capacity = Number(cls.capacity);
              const spotsLeft = capacity - enrolled;
              const fillPct = capacity > 0 ? (enrolled / capacity) * 100 : 0;
              const alreadyEnrolled = isEnrolled(cls.enrolled);
              const isFull = spotsLeft <= 0;
              const almostFull = spotsLeft > 0 && spotsLeft < 3;

              const leftBorderColor = alreadyEnrolled
                ? "oklch(0.55 0.18 145)"
                : almostFull
                  ? "oklch(0.6 0.22 25)"
                  : "oklch(0.65 0.22 48)";

              return (
                <motion.div
                  key={cls.id.toString()}
                  whileHover={{ scale: 1.02, y: -3 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  data-ocid={`home.classes.item.${i + 1}`}
                >
                  <div
                    className="rounded-2xl overflow-hidden h-full flex flex-col"
                    style={{
                      background: "oklch(1 0 0)",
                      borderLeft: `4px solid ${leftBorderColor}`,
                      border: "1px solid oklch(0.88 0.01 80)",
                      borderLeftWidth: "4px",
                      boxShadow: "0 2px 12px oklch(0.15 0.02 260 / 0.06)",
                    }}
                  >
                    <div className="p-4 flex-1 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display font-bold text-base text-foreground leading-tight">
                          {cls.name}
                        </h3>
                        {alreadyEnrolled && (
                          <Badge
                            className="shrink-0 text-xs font-bold"
                            style={{
                              background: "oklch(0.55 0.18 145 / 0.1)",
                              color: "oklch(0.4 0.15 145)",
                              border: "1px solid oklch(0.55 0.18 145 / 0.3)",
                            }}
                          >
                            ✓ Enrolled
                          </Badge>
                        )}
                        {almostFull && !alreadyEnrolled && (
                          <Badge
                            className="shrink-0 text-xs font-bold"
                            style={{
                              background: "oklch(0.6 0.22 25 / 0.1)",
                              color: "oklch(0.45 0.2 25)",
                              border: "1px solid oklch(0.6 0.22 25 / 0.3)",
                              animation:
                                "badge-pulse 1.8s ease-in-out infinite",
                            }}
                          >
                            🔥 Almost Full!
                          </Badge>
                        )}
                        {isFull && !alreadyEnrolled && (
                          <Badge
                            className="shrink-0 text-xs"
                            style={{
                              background: "oklch(0.55 0.22 25 / 0.1)",
                              color: "oklch(0.45 0.2 25)",
                              border: "1px solid oklch(0.55 0.22 25 / 0.3)",
                            }}
                          >
                            Full
                          </Badge>
                        )}
                      </div>

                      {cls.description && (
                        <p className="text-muted-foreground font-body text-sm leading-relaxed line-clamp-2">
                          {cls.description}
                        </p>
                      )}

                      <div
                        className="flex items-center gap-2 text-sm font-semibold"
                        style={{ color: "oklch(0.65 0.22 48)" }}
                      >
                        <CalendarDays className="w-4 h-4" />
                        <span className="font-body">{cls.date}</span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>
                              {enrolled}/{capacity} enrolled
                            </span>
                          </div>
                          <span
                            className="font-semibold"
                            style={{
                              color: almostFull
                                ? "oklch(0.45 0.2 25)"
                                : alreadyEnrolled
                                  ? "oklch(0.4 0.15 145)"
                                  : "oklch(0.65 0.22 48)",
                            }}
                          >
                            {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                          </span>
                        </div>
                        <Progress value={fillPct} className="h-2" />
                      </div>
                    </div>

                    <div className="px-4 pb-4 flex flex-col gap-2">
                      {alreadyEnrolled ? (
                        <Button
                          variant="outline"
                          className="w-full gap-2"
                          disabled
                          style={{
                            borderColor: "oklch(0.55 0.18 145 / 0.3)",
                            color: "oklch(0.4 0.15 145)",
                          }}
                        >
                          <CheckCircle className="w-4 h-4" />
                          You're Enrolled!
                        </Button>
                      ) : (
                        <Button
                          className="w-full gap-2 font-display font-semibold"
                          onClick={() => handleEnroll(cls.id, cls.name)}
                          disabled={isFull || enrollMutation.isPending}
                          data-ocid={`home.classes.join.button.${i + 1}`}
                          style={{
                            background: isFull
                              ? undefined
                              : "linear-gradient(135deg, oklch(0.65 0.22 48), oklch(0.58 0.2 38))",
                            color: "white",
                          }}
                        >
                          {enrollMutation.isPending ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />{" "}
                              Joining...
                            </>
                          ) : isFull ? (
                            "Class Full"
                          ) : (
                            <>🎯 Join Class</>
                          )}
                        </Button>
                      )}
                      {alreadyEnrolled && cls.zoomLink && (
                        <a
                          href={cls.zoomLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full"
                          data-ocid={`home.classes.zoom.button.${i + 1}`}
                        >
                          <Button
                            variant="secondary"
                            className="w-full gap-2"
                            style={{ color: "oklch(0.65 0.22 48)" }}
                          >
                            <Link className="w-4 h-4" />
                            Join Zoom
                            <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.section>
    </motion.div>
  );
}

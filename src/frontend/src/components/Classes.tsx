import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Principal } from "@icp-sdk/core/principal";
import {
  CalendarDays,
  CheckCircle,
  ExternalLink,
  Link,
  Loader2,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { useEnrollInClass, useUpcomingClasses } from "../hooks/useQueries";

interface ClassesProps {
  principal: Principal;
}

export default function Classes({ principal }: ClassesProps) {
  const { data: classes = [], isLoading } = useUpcomingClasses();
  const enrollMutation = useEnrollInClass();

  const handleEnroll = async (classId: bigint, className: string) => {
    try {
      await enrollMutation.mutateAsync(classId);
      toast.success(`Enrolled in ${className}!`);
    } catch {
      toast.error("Failed to enroll. You may already be enrolled.");
    }
  };

  const isEnrolled = (enrolledList: Principal[]) =>
    enrolledList.some((p) => p.toString() === principal.toString());

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        data-ocid="classes.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (classes.length === 0) {
    return (
      <div className="text-center py-24" data-ocid="classes.empty_state">
        <CalendarDays className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-muted-foreground mb-2">
          No Classes Scheduled
        </h3>
        <p className="text-muted-foreground/60 font-body">
          Check back soon — your coach will post upcoming sessions.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="text-muted-foreground font-body mb-6">
        {classes.length} upcoming class{classes.length !== 1 ? "es" : ""}{" "}
        available
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((cls, i) => {
          const enrolled = Number(cls.enrolled.length);
          const capacity = Number(cls.capacity);
          const spotsLeft = capacity - enrolled;
          const fillPct = capacity > 0 ? (enrolled / capacity) * 100 : 0;
          const alreadyEnrolled = isEnrolled(cls.enrolled);
          const isFull = spotsLeft <= 0;
          const almostFull = spotsLeft > 0 && spotsLeft < 3;

          const accentColor = alreadyEnrolled
            ? "oklch(0.72 0.16 290)"
            : almostFull
              ? "oklch(0.6 0.22 25)"
              : "oklch(0.68 0.16 290)";

          const glowShadow = `0 0 20px ${accentColor.replace(")", " / 0.12)")}, inset 0 1px 0 oklch(1 0 0 / 0.04)`;

          return (
            <motion.div
              key={cls.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.02, y: -3 }}
            >
              <Card
                className="h-full flex flex-col overflow-hidden"
                style={{
                  background: "oklch(1 0 0)",
                  borderLeft: `4px solid ${accentColor}`,
                  borderTop: "1px solid oklch(0.88 0.04 290)",
                  borderRight: "1px solid oklch(0.88 0.04 290)",
                  borderBottom: "1px solid oklch(0.88 0.04 290)",
                  boxShadow: glowShadow,
                }}
                data-ocid={`classes.item.${i + 1}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-lg leading-tight">
                      {cls.name}
                    </CardTitle>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {alreadyEnrolled && (
                        <Badge
                          className="shrink-0 text-xs font-bold"
                          style={{
                            background: "oklch(0.72 0.16 290 / 0.2)",
                            color: "oklch(0.75 0.16 290)",
                            border: "1px solid oklch(0.72 0.16 290 / 0.4)",
                          }}
                        >
                          ✓ Enrolled
                        </Badge>
                      )}
                      {almostFull && !alreadyEnrolled && (
                        <Badge
                          className="shrink-0 text-xs font-bold"
                          style={{
                            background: "oklch(0.6 0.22 25 / 0.2)",
                            color: "oklch(0.75 0.2 25)",
                            border: "1px solid oklch(0.6 0.22 25 / 0.4)",
                            animation: "badge-pulse 1.8s ease-in-out infinite",
                          }}
                        >
                          🔥 Almost Full!
                        </Badge>
                      )}
                      {isFull && !alreadyEnrolled && (
                        <Badge
                          variant="destructive"
                          className="shrink-0 text-xs"
                        >
                          Full
                        </Badge>
                      )}
                    </div>
                  </div>
                  <CardDescription className="font-body text-sm">
                    {cls.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                  <div
                    className="flex items-center gap-2 text-sm font-semibold"
                    style={{ color: accentColor }}
                  >
                    <CalendarDays className="w-4 h-4" />
                    <span className="font-body text-base">{cls.date}</span>
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
                            ? "oklch(0.75 0.2 25)"
                            : alreadyEnrolled
                              ? "oklch(0.75 0.16 290)"
                              : "oklch(0.68 0.16 290)",
                        }}
                      >
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                      </span>
                    </div>
                    <Progress value={fillPct} className="h-2" />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2">
                  {alreadyEnrolled ? (
                    <Button
                      variant="outline"
                      className="w-full gap-2"
                      disabled
                      style={{
                        borderColor: "oklch(0.72 0.16 290 / 0.4)",
                        color: "oklch(0.75 0.16 290)",
                      }}
                    >
                      <CheckCircle className="w-4 h-4" />
                      You're Enrolled!
                    </Button>
                  ) : (
                    <Button
                      className="w-full gap-2 font-display font-semibold glow-orange"
                      onClick={() => handleEnroll(cls.id, cls.name)}
                      disabled={isFull || enrollMutation.isPending}
                      data-ocid={`classes.join.button.${i + 1}`}
                      style={{
                        background: isFull
                          ? undefined
                          : "linear-gradient(135deg, oklch(0.68 0.16 290), oklch(0.68 0.16 290))",
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
                        "🎯 Join Class"
                      )}
                    </Button>
                  )}
                  {alreadyEnrolled && cls.zoomLink && (
                    <a
                      href={cls.zoomLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                      data-ocid={`classes.zoom.button.${i + 1}`}
                    >
                      <Button
                        variant="secondary"
                        className="w-full gap-2 text-primary hover:text-primary"
                      >
                        <Link className="w-4 h-4" />
                        Join Zoom
                        <ExternalLink className="w-3 h-3 ml-auto opacity-60" />
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

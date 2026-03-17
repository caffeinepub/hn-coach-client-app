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
import { CalendarDays, CheckCircle, Loader2, Users } from "lucide-react";
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

          return (
            <motion.div
              key={cls.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <Card
                className="bg-card border-border h-full flex flex-col"
                data-ocid={`classes.item.${i + 1}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="font-display text-lg leading-tight">
                      {cls.name}
                    </CardTitle>
                    {alreadyEnrolled && (
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 shrink-0 text-xs">
                        Enrolled
                      </Badge>
                    )}
                    {isFull && !alreadyEnrolled && (
                      <Badge variant="destructive" className="shrink-0 text-xs">
                        Full
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="font-body text-sm">
                    {cls.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="w-4 h-4 text-primary" />
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
                      <span>
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                      </span>
                    </div>
                    <Progress value={fillPct} className="h-1.5" />
                  </div>
                </CardContent>
                <CardFooter>
                  {alreadyEnrolled ? (
                    <Button variant="outline" className="w-full gap-2" disabled>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      You're Enrolled
                    </Button>
                  ) : (
                    <Button
                      className="w-full gap-2"
                      onClick={() => handleEnroll(cls.id, cls.name)}
                      disabled={isFull || enrollMutation.isPending}
                      data-ocid={`classes.join.button.${i + 1}`}
                    >
                      {enrollMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />{" "}
                          Joining...
                        </>
                      ) : isFull ? (
                        "Class Full"
                      ) : (
                        "Join Class"
                      )}
                    </Button>
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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Lock,
  Megaphone,
  Plus,
  RefreshCw,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { backendInterface as FullBackendInterface } from "../backend.d";
import { useActor } from "../hooks/useActor";
import { useBlobStorage } from "../hooks/useBlobStorage";
import {
  useAllPromotions,
  useCreateClass,
  useCreatePromotion,
  useDeleteClass,
  useDeletePromotion,
  useUpcomingClasses,
} from "../hooks/useQueries";
import { getPoints } from "../utils/points";

const ADMIN_PASSWORD = "hncoach2024";
const TODAY = new Date().toISOString().split("T")[0];

// ---- Password Gate ----
function PasswordGate({
  onUnlock,
  onBackToApp,
}: {
  onUnlock: () => void;
  onBackToApp: () => void;
}) {
  const [password, setPassword] = useState("");
  const [shaking, setShaking] = useState(false);

  const handleUnlock = () => {
    if (password === ADMIN_PASSWORD) {
      onUnlock();
    } else {
      toast.error("Incorrect password");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPassword("");
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.10 0.025 260) 0%, oklch(0.14 0.02 255) 100%)",
      }}
    >
      {/* Top bar */}
      <div
        className="px-6 py-4 flex items-center justify-between"
        style={{ borderBottom: "1px solid oklch(0.22 0.03 260)" }}
      >
        <div className="flex items-center gap-3">
          <img
            src="/assets/uploads/file_00000000a43071fa8c0038574783daf9-1.png"
            alt="HN Coach"
            className="h-9 w-9 object-contain rounded-xl"
          />
          <span
            className="font-display font-extrabold text-lg tracking-tight"
            style={{ color: "oklch(0.95 0.01 260)" }}
          >
            HN <span style={{ color: "oklch(0.68 0.16 290)" }}>Coach</span>
          </span>
        </div>
        <button
          type="button"
          onClick={onBackToApp}
          className="flex items-center gap-2 text-sm font-body transition-colors"
          style={{ color: "oklch(0.6 0.04 260)" }}
          data-ocid="admin.back_to_app.button"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to App
        </button>
      </div>

      {/* Gate card */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={
            shaking ? { x: [0, -10, 10, -8, 8, 0] } : { opacity: 1, y: 0 }
          }
          transition={shaking ? { duration: 0.4 } : { duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.13 0.025 260)",
              border: "1px solid oklch(0.25 0.03 260)",
              boxShadow: "0 24px 64px oklch(0.05 0.02 260 / 0.6)",
            }}
          >
            <div
              className="px-8 pt-10 pb-6 flex flex-col items-center gap-3"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.17 0.04 260) 0%, oklch(0.13 0.025 260) 100%)",
              }}
            >
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-1"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 290) 0%, oklch(0.58 0.18 290) 100%)",
                  boxShadow: "0 8px 24px oklch(0.68 0.16 290 / 0.35)",
                }}
              >
                <Lock className="w-7 h-7 text-white" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white text-center">
                Coach Admin Panel
              </h2>
              <p
                className="text-sm font-body text-center"
                style={{ color: "oklch(0.65 0.04 260)" }}
              >
                Enter admin password to continue
              </p>
            </div>

            <div
              className="px-8 pb-8 pt-4 space-y-4"
              style={{ background: "oklch(0.13 0.025 260)" }}
            >
              <div className="space-y-2">
                <Label
                  className="text-sm"
                  style={{ color: "oklch(0.75 0.04 260)" }}
                >
                  Password
                </Label>
                <Input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
                  className="font-body"
                  style={{
                    background: "oklch(0.18 0.03 260)",
                    border: "1px solid oklch(0.28 0.04 260)",
                    color: "oklch(0.95 0.01 260)",
                  }}
                  data-ocid="admin.password.input"
                />
              </div>
              <Button
                className="w-full gap-2 font-body font-semibold"
                onClick={handleUnlock}
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 290) 0%, oklch(0.58 0.18 290) 100%)",
                  color: "white",
                  boxShadow: "0 4px 16px oklch(0.68 0.16 290 / 0.3)",
                }}
                data-ocid="admin.unlock.button"
              >
                <Lock className="w-4 h-4" /> Unlock Panel
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// ---- Client Tracking Tab ----
function ClientCard({ principal }: { principal: Principal }) {
  const { actor } = useActor();
  const [expanded, setExpanded] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const principalStr = principal.toString();
  const shortPrincipal = `${principalStr.slice(0, 8)}...`;
  const userPoints = getPoints(principalStr);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["adminUserProfile", principalStr],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getUserProfile(principal);
      } catch {
        return null;
      }
    },
    enabled: !!actor,
    refetchOnMount: "always",
  });

  const { data: weightLogs = [], isLoading: weightLoading } = useQuery({
    queryKey: ["adminWeightLogs", principalStr],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getWeightLogs(principal);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && expanded,
    refetchOnMount: "always",
  });

  const { data: mealLogs = [], isLoading: mealsLoading } = useQuery({
    queryKey: ["adminMealLogs", principalStr, TODAY],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllUserMealLogs(principal, TODAY);
      } catch {
        return [];
      }
    },
    enabled: !!actor && expanded,
    refetchOnMount: "always",
  });

  const { data: measurements = [], isLoading: measLoading } = useQuery({
    queryKey: ["adminMeasurements", principalStr],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getMeasurementLogs(principal);
        return result ?? [];
      } catch {
        return [];
      }
    },
    enabled: !!actor && expanded,
    refetchOnMount: "always",
  });

  const sortedMeasurements = [...measurements].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const latestMeasurement = sortedMeasurements[0] ?? null;
  const recentWeightLogs = [...weightLogs]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 7);

  // ---- Coach Comments ----
  const qc = useQueryClient();
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const { data: activityComments = [] } = useQuery<
    Array<{ activityKey: string; comment: string; createdAt: bigint }>
  >({
    queryKey: ["adminComments", principalStr],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await (
          actor as unknown as FullBackendInterface
        ).getActivityComments(principal);
        if (!Array.isArray(result)) return [];
        return result;
      } catch {
        return [];
      }
    },
    enabled: !!actor && expanded,
    refetchOnMount: "always",
  });

  const commentMap: Record<string, string> = {};
  if (Array.isArray(activityComments)) {
    for (const c of activityComments) {
      if (
        c &&
        typeof c.activityKey === "string" &&
        typeof c.comment === "string"
      ) {
        commentMap[c.activityKey] = c.comment;
      }
    }
  }

  const saveComment = useMutation({
    mutationFn: async ({
      activityKey,
      comment,
    }: { activityKey: string; comment: string }) => {
      if (!actor) throw new Error("No actor");
      return (actor as unknown as FullBackendInterface).saveActivityComment(
        principal,
        activityKey,
        comment,
      );
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["adminComments", principalStr] });
      // Also notify the user's dashboard comment cache
      qc.invalidateQueries({ queryKey: ["coachComments", principalStr] });
      toast.success("Comment saved ✓");
      setCommentInputs((prev) => ({ ...prev, [variables.activityKey]: "" }));
    },
    onError: () => toast.error("Failed to save comment"),
  });

  // Safe gender display — profile.gender is a TypeScript enum string ("female"/"male")
  function getGenderLabel(gender: unknown): string {
    if (!gender) return "";
    const g = String(gender).toLowerCase();
    if (g === "female") return "Female";
    if (g === "male") return "Male";
    // Fallback: handle object variant { female: null } or { male: null }
    if (typeof gender === "object") {
      if ("female" in (gender as object)) return "Female";
      if ("male" in (gender as object)) return "Male";
    }
    return String(gender);
  }

  const initials = profileLoading
    ? "?"
    : (profile?.name
        ?.split(" ")
        .map((n: string) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase() ?? "U");

  function getCommentValue(key: string): string {
    return commentInputs[key] ?? commentMap[key] ?? "";
  }

  function renderCommentBox(activityKey: string) {
    return (
      <div
        className="mt-2 pt-2"
        style={{ borderTop: "1px solid oklch(0.92 0.02 290)" }}
      >
        <p
          className="text-xs font-body font-semibold mb-1"
          style={{ color: "oklch(0.55 0.18 290)" }}
        >
          HN Coach
        </p>
        <div className="flex gap-1.5">
          <input
            type="text"
            placeholder="Add coach comment..."
            value={getCommentValue(activityKey)}
            onChange={(e) =>
              setCommentInputs((prev) => ({
                ...prev,
                [activityKey]: e.target.value,
              }))
            }
            className="flex-1 text-xs rounded-lg px-2 py-1 border font-body"
            style={{
              border: "1px solid oklch(0.88 0.02 290)",
              background: "oklch(0.98 0.01 290)",
              color: "oklch(0.2 0.02 260)",
            }}
            data-ocid="admin.comment.input"
          />
          <button
            type="button"
            onClick={() =>
              saveComment.mutate({
                activityKey,
                comment: getCommentValue(activityKey),
              })
            }
            disabled={saveComment.isPending}
            className="px-2 py-1 text-xs rounded-full font-body font-semibold transition-all disabled:opacity-50"
            style={{
              background: "oklch(0.68 0.16 290)",
              color: "white",
            }}
            data-ocid="admin.comment.save_button"
          >
            Save
          </button>
        </div>
        {commentMap[activityKey] && !commentInputs[activityKey] && (
          <p
            className="text-xs mt-0.5 font-body"
            style={{ color: "oklch(0.55 0.12 290)" }}
          >
            💬 {commentMap[activityKey]}
          </p>
        )}
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-xl overflow-hidden"
        style={{
          background: "oklch(1 0 0)",
          border: "1px solid oklch(0.91 0.01 260)",
          boxShadow: "0 2px 10px oklch(0.15 0.02 260 / 0.06)",
        }}
      >
        {/* Card Header / Toggle */}
        <button
          type="button"
          className="w-full px-5 py-4 flex items-center justify-between gap-3 hover:bg-muted/40 transition-colors"
          onClick={() => setExpanded((p) => !p)}
          data-ocid="admin.client.toggle"
        >
          <div className="flex items-center gap-4">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white text-sm flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.68 0.16 290) 0%, oklch(0.58 0.18 290) 100%)",
                boxShadow: "0 3px 10px oklch(0.68 0.16 290 / 0.3)",
              }}
            >
              {initials}
            </div>
            <div className="text-left">
              <p className="font-body font-semibold text-foreground text-sm">
                {profileLoading
                  ? "Loading..."
                  : (profile?.name ?? "Unknown User")}
              </p>
              <p
                className="font-mono text-xs mt-0.5"
                style={{ color: "oklch(0.62 0.04 260)" }}
              >
                {shortPrincipal}
              </p>
              <div
                className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold mt-1 w-fit"
                style={{
                  background: "oklch(0.68 0.16 290 / 0.12)",
                  border: "1px solid oklch(0.68 0.16 290 / 0.25)",
                  color: "oklch(0.58 0.18 290)",
                }}
              >
                <span>🪙</span>
                <span>{userPoints} pts</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {expanded ? (
              <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            ) : (
              <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            )}
          </div>
        </button>

        {/* Expanded Content */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              style={{ overflow: "hidden" }}
            >
              <div
                className="px-5 pb-6 space-y-5"
                style={{
                  borderTop: "1px solid oklch(0.93 0.01 260)",
                  paddingTop: "1.25rem",
                }}
              >
                {/* Profile Details */}
                {profile ? (
                  <div
                    className="rounded-xl p-4"
                    style={{ background: "oklch(0.975 0.005 260)" }}
                  >
                    <p
                      className="text-xs font-body uppercase tracking-wider mb-2 font-semibold"
                      style={{ color: "oklch(0.6 0.03 260)" }}
                    >
                      Profile
                    </p>
                    <p
                      className="text-sm font-body font-semibold"
                      style={{ color: "oklch(0.2 0.02 260)" }}
                    >
                      {profile.name}
                    </p>
                    {profile.gender != null && (
                      <p
                        className="text-xs font-body mt-0.5"
                        style={{ color: "oklch(0.5 0.03 260)" }}
                      >
                        {getGenderLabel(profile.gender)}
                      </p>
                    )}
                  </div>
                ) : (
                  !profileLoading && (
                    <p className="text-xs text-muted-foreground font-body italic">
                      No profile saved yet
                    </p>
                  )
                )}

                {/* Weight Logs */}
                <div>
                  <h4
                    className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                    style={{ color: "oklch(0.45 0.18 220)" }}
                  >
                    ⚖️ Weight Log +30 pts (Last 7 entries)
                  </h4>
                  {weightLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </div>
                  ) : recentWeightLogs.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-body italic">
                      No weight logs yet
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {recentWeightLogs.map((log) => (
                        <div
                          key={`weight-${log.date}`}
                          className="rounded-lg px-3 py-2"
                          style={{ background: "oklch(0.97 0.008 220)" }}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <p
                              className="text-xs font-body"
                              style={{ color: "oklch(0.55 0.03 260)" }}
                            >
                              {log.date}
                            </p>
                            <p
                              className="font-display font-bold text-sm"
                              style={{
                                color: log.absent
                                  ? "oklch(0.6 0.1 25)"
                                  : "oklch(0.38 0.16 220)",
                              }}
                            >
                              {log.absent
                                ? "Absent"
                                : `${Number(log.weight)}kg`}
                            </p>
                          </div>
                          {renderCommentBox(`weight-${log.date}`)}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Today's Meals */}
                <div>
                  <h4
                    className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                    style={{ color: "oklch(0.58 0.18 290)" }}
                  >
                    🍽️ Today's Meals +10 pts each ({TODAY})
                  </h4>
                  {mealsLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </div>
                  ) : mealLogs.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-body italic">
                      No meals logged today
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {mealLogs.map((log) => (
                        <div
                          key={`meal-${log.mealType}`}
                          className="rounded-lg overflow-hidden"
                          style={{ background: "oklch(0.97 0.03 290)" }}
                        >
                          <div className="px-3 py-2 flex items-start gap-3">
                            <div className="flex-1 min-w-0">
                              <p
                                className="text-xs font-body font-semibold capitalize"
                                style={{ color: "oklch(0.68 0.16 290)" }}
                              >
                                {String(log.mealType ?? "").replace(/_/g, " ")}
                              </p>
                              {log.note && (
                                <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                  {log.note}
                                </p>
                              )}
                            </div>
                            {log.imageUrl && (
                              <button
                                type="button"
                                className="flex-shrink-0 bg-transparent border-0 p-0"
                                onClick={() => setLightboxUrl(log.imageUrl!)}
                                aria-label="View full image"
                              >
                                <img
                                  src={log.imageUrl}
                                  alt={String(log.mealType ?? "")}
                                  className="w-20 h-20 object-cover rounded-lg border border-border hover:opacity-90 transition-opacity"
                                  onError={(e) => {
                                    (
                                      e.target as HTMLImageElement
                                    ).style.display = "none";
                                  }}
                                />
                              </button>
                            )}
                          </div>
                          <div className="px-3 pb-2">
                            {renderCommentBox(`meal-${TODAY}-${log.mealType}`)}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Measurements */}
                <div>
                  <h4
                    className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                    style={{ color: "oklch(0.68 0.16 290)" }}
                  >
                    📏 Latest Measurements +50 pts
                  </h4>
                  {measLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="w-3 h-3 animate-spin" /> Loading...
                    </div>
                  ) : !latestMeasurement ? (
                    <p className="text-xs text-muted-foreground font-body italic">
                      No measurements yet
                    </p>
                  ) : (
                    <div
                      className="rounded-xl px-4 py-3"
                      style={{ background: "oklch(0.97 0.03 290)" }}
                    >
                      <p
                        className="text-xs font-body mb-3"
                        style={{ color: "oklch(0.55 0.04 260)" }}
                      >
                        Logged on {latestMeasurement.date}
                      </p>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { label: "Chest", value: latestMeasurement.chest },
                          { label: "Waist", value: latestMeasurement.waist },
                          { label: "Hips", value: latestMeasurement.hips },
                        ].map((m) => (
                          <div
                            key={m.label}
                            className="text-center rounded-lg py-2"
                            style={{ background: "oklch(0.94 0.04 290)" }}
                          >
                            <p
                              className="text-xs font-body"
                              style={{ color: "oklch(0.62 0.12 290)" }}
                            >
                              {m.label}
                            </p>
                            <p
                              className="font-display font-bold text-base mt-0.5"
                              style={{ color: "oklch(0.58 0.18 290)" }}
                            >
                              {Number(m.value ?? 0)}
                              <span className="text-xs font-normal ml-0.5">
                                cm
                              </span>
                            </p>
                          </div>
                        ))}
                      </div>
                      {renderCommentBox(
                        `measurement-${latestMeasurement.date}`,
                      )}
                    </div>
                  )}
                </div>

                {/* All Coach Comments Summary */}
                {activityComments.length > 0 && (
                  <div>
                    <h4
                      className="font-display font-bold text-xs uppercase tracking-widest mb-2"
                      style={{ color: "oklch(0.55 0.18 290)" }}
                    >
                      💬 All Comments ({activityComments.length})
                    </h4>
                    <div className="space-y-1.5">
                      {activityComments.map((c, idx) => (
                        <div
                          key={`${c.activityKey}-${idx}`}
                          className="rounded-lg px-3 py-2 text-xs font-body"
                          style={{ background: "oklch(0.96 0.03 290)" }}
                        >
                          <span
                            className="font-semibold"
                            style={{ color: "oklch(0.55 0.18 290)" }}
                          >
                            {String(c.activityKey ?? "").replace(/-/g, " ")}:
                          </span>{" "}
                          <span style={{ color: "oklch(0.3 0.02 260)" }}>
                            {c.comment}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(0,0,0,0.85)" }}
        >
          <button
            type="button"
            className="absolute inset-0 w-full h-full cursor-default opacity-0"
            aria-label="Close lightbox"
            onClick={() => setLightboxUrl(null)}
          />
          <div className="relative max-w-screen-md w-full px-4 z-10">
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute -top-10 right-4 text-white text-2xl font-bold"
              aria-label="Close"
            >
              ✕
            </button>
            <img
              src={lightboxUrl}
              alt="Full view"
              className="w-full max-h-screen object-contain rounded-xl"
            />
          </div>
        </div>
      )}
    </>
  );
}

function ClientTrackingTab() {
  const { actor, isFetching: actorFetching } = useActor();
  const [readyToFetch, setReadyToFetch] = useState(false);

  // Add 1-second delay before first fetch to allow ICP actor to settle
  useEffect(() => {
    const timer = setTimeout(() => setReadyToFetch(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const {
    data: allUsers,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["adminAllUsers"],
    queryFn: async () => {
      if (!actor) return [];
      const users = await actor.getAllUsers();
      return users;
    },
    enabled: !!actor && !actorFetching && readyToFetch,
    refetchOnMount: "always",
    retry: 3,
    retryDelay: 2000,
  });

  const refreshBtn = (
    <button
      type="button"
      onClick={() => refetch()}
      disabled={isFetching}
      className="flex items-center gap-1.5 text-xs font-body font-semibold px-3 py-1.5 rounded-lg transition-all"
      style={{
        background: "oklch(0.68 0.16 290 / 0.12)",
        border: "1px solid oklch(0.68 0.16 290 / 0.25)",
        color: "oklch(0.55 0.18 290)",
      }}
      data-ocid="admin.clients.refresh_button"
    >
      <RefreshCw
        className={`w-3.5 h-3.5${isFetching ? " animate-spin" : ""}`}
      />
      {isFetching ? "Refreshing..." : "Refresh"}
    </button>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">{refreshBtn}</div>
        <div
          className="flex items-center justify-center py-16"
          data-ocid="admin.clients.loading_state"
        >
          <Loader2
            className="w-6 h-6 animate-spin"
            style={{ color: "oklch(0.68 0.16 290)" }}
          />
          <span className="ml-2 font-body text-muted-foreground">
            Loading clients...
          </span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        data-ocid="admin.clients.error_state"
      >
        <p className="font-body text-muted-foreground text-center">
          Unable to load clients. Please ensure you are logged in and try
          refreshing.
        </p>
        {refreshBtn}
      </div>
    );
  }

  if (!allUsers || allUsers.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center py-20 gap-4"
        data-ocid="admin.clients.empty_state"
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{ background: "oklch(0.95 0.01 260)" }}
        >
          <Users className="w-8 h-8" style={{ color: "oklch(0.6 0.04 260)" }} />
        </div>
        <p className="font-body text-muted-foreground text-center">
          No clients yet. Ask clients to log in and save their data, then tap
          Refresh.
        </p>
        {refreshBtn}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-body text-sm text-muted-foreground">
          {allUsers.length} registered client{allUsers.length !== 1 ? "s" : ""}
        </p>
        {refreshBtn}
      </div>
      {allUsers.map((principal, i) => (
        <div
          key={principal.toString()}
          data-ocid={`admin.client.item.${i + 1}`}
        >
          <ClientCard principal={principal} />
        </div>
      ))}
    </div>
  );
}

// ---- Classes Tab ----
function ClassesTab() {
  const [classForm, setClassForm] = useState({
    name: "",
    description: "",
    date: "",
    capacity: "",
    zoomLink: "",
  });

  const createClass = useCreateClass();
  const deleteClass = useDeleteClass();
  const { data: classes = [] } = useUpcomingClasses();

  const handleCreateClass = async () => {
    if (
      !classForm.name ||
      !classForm.description ||
      !classForm.date ||
      !classForm.capacity
    ) {
      toast.error("Please fill in all class fields");
      return;
    }
    try {
      await createClass.mutateAsync({
        name: classForm.name,
        description: classForm.description,
        date: classForm.date,
        capacity: BigInt(classForm.capacity),
        zoomLink: classForm.zoomLink.trim() || null,
      });
      toast.success("Class created successfully!");
      setClassForm({
        name: "",
        description: "",
        date: "",
        capacity: "",
        zoomLink: "",
      });
    } catch {
      toast.error("Failed to create class");
    }
  };

  const handleDeleteClass = async (id: bigint) => {
    try {
      await deleteClass.mutateAsync(id);
      toast.success("Class deleted");
    } catch {
      toast.error("Failed to delete class");
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">
              Create New Class
            </CardTitle>
            <CardDescription className="font-body text-sm">
              Schedule a fitness session
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Class Name</Label>
          <Input
            placeholder="e.g. Morning HIIT Bootcamp"
            value={classForm.name}
            onChange={(e) =>
              setClassForm((p) => ({ ...p, name: e.target.value }))
            }
            data-ocid="admin.class_name.input"
          />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="What will clients expect?"
            value={classForm.description}
            onChange={(e) =>
              setClassForm((p) => ({ ...p, description: e.target.value }))
            }
            data-ocid="admin.class_description.textarea"
            rows={3}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              value={classForm.date}
              onChange={(e) =>
                setClassForm((p) => ({ ...p, date: e.target.value }))
              }
              data-ocid="admin.class_date.input"
            />
          </div>
          <div className="space-y-2">
            <Label>Capacity</Label>
            <Input
              type="number"
              placeholder="20"
              min="1"
              value={classForm.capacity}
              onChange={(e) =>
                setClassForm((p) => ({ ...p, capacity: e.target.value }))
              }
              data-ocid="admin.class_capacity.input"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Video className="w-4 h-4 text-muted-foreground" />
            Zoom Link{" "}
            <span className="text-muted-foreground/60 text-xs font-normal">
              (optional)
            </span>
          </Label>
          <Input
            placeholder="https://zoom.us/j/..."
            value={classForm.zoomLink}
            onChange={(e) =>
              setClassForm((p) => ({ ...p, zoomLink: e.target.value }))
            }
            data-ocid="admin.class_zoom.input"
          />
        </div>
        <Button
          className="w-full gap-2"
          onClick={handleCreateClass}
          disabled={createClass.isPending}
          data-ocid="admin.create_class.button"
        >
          {createClass.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Creating...
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" /> Create Class
            </>
          )}
        </Button>

        <Separator />

        <div>
          <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Scheduled Classes ({classes.length})
          </h4>
          {classes.length === 0 ? (
            <p
              className="text-muted-foreground text-sm font-body text-center py-4"
              data-ocid="admin.classes.empty_state"
            >
              No classes scheduled yet
            </p>
          ) : (
            <div className="space-y-2">
              {classes.map((cls, i) => (
                <div
                  key={cls.id.toString()}
                  className="flex items-center justify-between p-3 rounded-md bg-muted"
                  data-ocid={`admin.class.item.${i + 1}`}
                >
                  <div>
                    <p className="font-body font-medium text-sm">{cls.name}</p>
                    <p className="text-xs text-muted-foreground">{cls.date}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {cls.zoomLink && (
                      <Badge
                        variant="outline"
                        className="text-xs text-primary border-primary/30"
                      >
                        Zoom
                      </Badge>
                    )}
                    <Users className="w-3 h-3 text-muted-foreground" />
                    <Badge variant="secondary" className="text-xs">
                      {cls.enrolled.length}/{cls.capacity.toString()}
                    </Badge>
                    <button
                      type="button"
                      onClick={() => handleDeleteClass(cls.id)}
                      disabled={deleteClass.isPending}
                      data-ocid={`admin.class.delete_button.${i + 1}`}
                      className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Promotions Tab ----
function PromotionsTab() {
  const [promoForm, setPromoForm] = useState({
    title: "",
    body: "",
    imageUrl: "",
  });
  const [promoImagePreview, setPromoImagePreview] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createPromo = useCreatePromotion();
  const deletePromotion = useDeletePromotion();
  const { data: promotions = [] } = useAllPromotions();
  const { uploadFile, isUploading, uploadProgress } = useBlobStorage();

  const handleImageUpload = async (file: File) => {
    try {
      const url = await uploadFile(file);
      setPromoForm((p) => ({ ...p, imageUrl: url }));
      setPromoImagePreview(URL.createObjectURL(file));
      toast.success("Image uploaded!");
    } catch {
      toast.error("Failed to upload image");
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleRemoveImage = () => {
    setPromoForm((p) => ({ ...p, imageUrl: "" }));
    setPromoImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCreatePromo = async () => {
    if (!promoForm.title || !promoForm.body) {
      toast.error("Please fill in all promotion fields");
      return;
    }
    try {
      await createPromo.mutateAsync({
        title: promoForm.title,
        body: promoForm.body,
        imageUrl: promoForm.imageUrl || null,
      });
      toast.success("Promotion published!");
      setPromoForm({ title: "", body: "", imageUrl: "" });
      setPromoImagePreview("");
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      toast.error("Failed to create promotion");
    }
  };

  const handleDeletePromotion = async (id: bigint) => {
    try {
      await deletePromotion.mutateAsync(id);
      toast.success("Promotion deleted");
    } catch {
      toast.error("Failed to delete promotion");
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center">
            <Megaphone className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="font-display text-xl">
              Create Promotion
            </CardTitle>
            <CardDescription className="font-body text-sm">
              Announce offers and updates
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            placeholder="e.g. 20% Off Monthly Package"
            value={promoForm.title}
            onChange={(e) =>
              setPromoForm((p) => ({ ...p, title: e.target.value }))
            }
            data-ocid="admin.promo_title.input"
          />
        </div>
        <div className="space-y-2">
          <Label>Message</Label>
          <Textarea
            placeholder="Details of your promotion..."
            value={promoForm.body}
            onChange={(e) =>
              setPromoForm((p) => ({ ...p, body: e.target.value }))
            }
            data-ocid="admin.promo_body.textarea"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <ImagePlus className="w-4 h-4 text-muted-foreground" />
            Promo Image{" "}
            <span className="text-muted-foreground/60 text-xs font-normal">
              (optional)
            </span>
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageFileChange}
          />
          {promoImagePreview ? (
            <div className="relative rounded-lg overflow-hidden border border-border">
              <img
                src={promoImagePreview}
                alt="Preview"
                className="w-full object-cover"
                style={{ maxHeight: "180px" }}
              />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors"
                data-ocid="admin.promo_image.close_button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full border-2 border-dashed border-border rounded-lg py-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="admin.promo_image.dropzone"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-6 h-6 animate-spin" />
                  <span className="text-sm font-body">
                    Uploading... {uploadProgress}%
                  </span>
                </>
              ) : (
                <>
                  <ImagePlus className="w-6 h-6" />
                  <span className="text-sm font-body">
                    Click to upload an image
                  </span>
                  <span className="text-xs opacity-60">
                    JPG, PNG, GIF up to 10MB
                  </span>
                </>
              )}
            </button>
          )}
        </div>
        <Button
          className="w-full gap-2"
          onClick={handleCreatePromo}
          disabled={createPromo.isPending || isUploading}
          data-ocid="admin.create_promo.button"
        >
          {createPromo.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Publishing...
            </>
          ) : (
            <>
              <Megaphone className="w-4 h-4" /> Publish Promotion
            </>
          )}
        </Button>

        <Separator />

        <div>
          <h4 className="font-display font-semibold text-sm text-muted-foreground uppercase tracking-wide mb-3">
            Active Promotions ({promotions.length})
          </h4>
          {promotions.length === 0 ? (
            <p
              className="text-muted-foreground text-sm font-body text-center py-4"
              data-ocid="admin.promos.empty_state"
            >
              No promotions published yet
            </p>
          ) : (
            <div className="space-y-2">
              {promotions.map((promo, i) => (
                <div
                  key={promo.id.toString()}
                  className="flex items-start justify-between gap-2 p-3 rounded-md bg-muted"
                  data-ocid={`admin.promo.item.${i + 1}`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-body font-semibold text-sm">
                      {promo.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {promo.body}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeletePromotion(promo.id)}
                    disabled={deletePromotion.isPending}
                    data-ocid={`admin.promo.delete_button.${i + 1}`}
                    className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ---- Stats Row ----
function AdminStatsRow() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: allUsers } = useQuery({
    queryKey: ["adminAllUsers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllUsers();
    },
    enabled: !!actor && !actorFetching,
    refetchOnMount: "always",
  });
  const { data: classes = [] } = useUpcomingClasses();
  const { data: promotions = [] } = useAllPromotions();

  return (
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div
        className="rounded-xl p-4 flex flex-col items-center gap-1 text-center"
        style={{
          background: "oklch(0.22 0.06 290)",
          border: "1px solid oklch(0.25 0.04 260)",
        }}
      >
        <p
          className="font-display font-extrabold text-3xl"
          style={{ color: "oklch(0.68 0.16 290)" }}
        >
          {allUsers?.length ?? "—"}
        </p>
        <p
          className="font-body text-xs"
          style={{ color: "oklch(0.62 0.04 260)" }}
        >
          Total Clients
        </p>
      </div>
      <div
        className="rounded-xl p-4 flex flex-col items-center gap-1 text-center"
        style={{
          background: "oklch(0.22 0.06 290)",
          border: "1px solid oklch(0.25 0.04 260)",
        }}
      >
        <p
          className="font-display font-extrabold text-3xl"
          style={{ color: "oklch(0.72 0.18 180)" }}
        >
          {classes.length}
        </p>
        <p
          className="font-body text-xs"
          style={{ color: "oklch(0.62 0.04 260)" }}
        >
          Active Classes
        </p>
      </div>
      <div
        className="rounded-xl p-4 flex flex-col items-center gap-1 text-center"
        style={{
          background: "oklch(0.22 0.06 290)",
          border: "1px solid oklch(0.25 0.04 260)",
        }}
      >
        <p
          className="font-display font-extrabold text-3xl"
          style={{ color: "oklch(0.78 0.16 290)" }}
        >
          {promotions.length}
        </p>
        <p
          className="font-body text-xs"
          style={{ color: "oklch(0.62 0.04 260)" }}
        >
          Promotions
        </p>
      </div>
    </div>
  );
}

// ---- Main Page ----
export default function CoachAdminPage({
  onBackToApp,
}: {
  onBackToApp: () => void;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "clients" | "classes" | "promotions"
  >("clients");

  if (!unlocked) {
    return (
      <PasswordGate
        onUnlock={() => setUnlocked(true)}
        onBackToApp={onBackToApp}
      />
    );
  }

  const tabs = [
    { id: "clients" as const, label: "Client Tracking", icon: Users },
    { id: "classes" as const, label: "Classes", icon: Calendar },
    { id: "promotions" as const, label: "Promotions", icon: Megaphone },
  ];

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "linear-gradient(160deg, oklch(0.10 0.025 260) 0%, oklch(0.14 0.02 255) 100%)",
      }}
    >
      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          background:
            "linear-gradient(135deg, oklch(0.12 0.03 260) 0%, oklch(0.16 0.04 255) 60%, oklch(0.13 0.025 250) 100%)",
          borderBottom: "1px solid oklch(0.22 0.04 260)",
        }}
      >
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, oklch(0.68 0.16 290) 0%, oklch(0.58 0.18 290) 100%)",
                boxShadow: "0 8px 24px oklch(0.68 0.16 290 / 0.35)",
              }}
            >
              <img
                src="/assets/uploads/file_00000000a43071fa8c0038574783daf9-1.png"
                alt="HN Coach"
                className="w-9 h-9 object-contain"
              />
            </div>
            <div>
              <h1
                className="font-display font-extrabold text-2xl sm:text-3xl"
                style={{ color: "oklch(0.97 0.01 260)" }}
              >
                HN Coach{" "}
                <span style={{ color: "oklch(0.68 0.16 290)" }}>Admin</span>
              </h1>
              <p
                className="font-body text-sm mt-0.5"
                style={{ color: "oklch(0.6 0.04 260)" }}
              >
                Coach Management Panel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onBackToApp}
            className="flex items-center gap-2 px-4 py-2 rounded-xl font-body text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "oklch(0.2 0.03 260)",
              border: "1px solid oklch(0.3 0.04 260)",
              color: "oklch(0.8 0.04 260)",
            }}
            data-ocid="admin.back_to_app.button"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to App</span>
          </button>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Stats Row */}
        <AdminStatsRow />

        {/* Tab Bar */}
        <div
          className="flex rounded-xl p-1 mb-6 gap-1"
          style={{
            background: "oklch(0.15 0.025 260)",
            border: "1px solid oklch(0.22 0.03 260)",
          }}
          data-ocid="admin.tab"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-body font-semibold transition-all"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, oklch(0.68 0.16 290) 0%, oklch(0.58 0.18 290) 100%)"
                    : "transparent",
                  color: isActive ? "white" : "oklch(0.6 0.04 260)",
                  boxShadow: isActive
                    ? "0 2px 8px oklch(0.68 0.16 290 / 0.3)"
                    : "none",
                }}
                data-ocid={`admin.${tab.id}.tab`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "clients" && <ClientTrackingTab />}
            {activeTab === "classes" && <ClassesTab />}
            {activeTab === "promotions" && <PromotionsTab />}
          </motion.div>
        </AnimatePresence>

        {/* Watermark */}
        <div className="mt-10 text-center">
          <p
            className="font-body text-xs"
            style={{ color: "oklch(0.4 0.02 260)" }}
          >
            © {new Date().getFullYear()} HN Coach — All Rights Reserved
          </p>
        </div>
      </div>
    </div>
  );
}

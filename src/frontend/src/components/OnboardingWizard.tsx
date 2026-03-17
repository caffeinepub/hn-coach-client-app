import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowRight,
  CheckCircle,
  Loader2,
  Ruler,
  Scale,
  Target,
  User,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";
import { DEFAULT_GOALS, GOALS_STORAGE_KEY, type Goals } from "./GoalsTab";

const ONBOARDING_KEY = "hn_coach_onboarding_done";

export function isOnboardingDone(): boolean {
  return localStorage.getItem(ONBOARDING_KEY) === "true";
}

const PROFILE_STORAGE_KEY = "hn_coach_profile_ext";

interface ExtProfile {
  age: string;
  height: string;
  heightUnit: "cm" | "ft";
  weight: string;
  weightUnit: "kg" | "lbs";
  whatsapp: string;
}

const DEFAULT_EXT: ExtProfile = {
  age: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  whatsapp: "",
};

interface OnboardingWizardProps {
  onComplete: () => void;
}

export default function OnboardingWizard({
  onComplete,
}: OnboardingWizardProps) {
  const [step, setStep] = useState(1);
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveProfile();

  const [name, setName] = useState("");
  const [ext, setExt] = useState<ExtProfile>(DEFAULT_EXT);
  const [goals, setGoals] = useState<Goals>(DEFAULT_GOALS);

  useEffect(() => {
    if (profile?.name) setName(profile.name);
  }, [profile?.name]);

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  function updateExt(field: keyof ExtProfile, value: string) {
    setExt((prev) => ({ ...prev, [field]: value }));
  }

  function updateGoal(field: keyof Goals, value: string) {
    setGoals((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveProfile() {
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    // Always save locally first so nothing is lost
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(ext));
    // Try backend save but don't block on failure
    try {
      await saveProfile.mutateAsync(name.trim());
    } catch (err) {
      console.warn(
        "Backend profile save failed, continuing with local save",
        err,
      );
    }
    setStep(2);
  }

  function handleSaveGoals() {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
    localStorage.setItem(ONBOARDING_KEY, "true");
    toast.success("All set! Welcome to HN Coach! 🎯");
    onComplete();
  }

  function handleSkipGoals() {
    localStorage.setItem(ONBOARDING_KEY, "true");
    onComplete();
  }

  const measureFields: {
    key: keyof Goals;
    label: string;
    placeholder: string;
  }[] = [
    { key: "chest", label: "Chest / Breast Goal", placeholder: "e.g. 88" },
    { key: "waist", label: "Waist Goal", placeholder: "e.g. 72" },
    { key: "hips", label: "Hips Goal", placeholder: "e.g. 90" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: "oklch(0.1 0.02 260 / 0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.97 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl"
          style={{
            background: "white",
            border: "1px solid oklch(0.88 0.015 80)",
          }}
        >
          {/* Header */}
          <div
            className="px-8 pt-8 pb-6"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.97 0.02 80), oklch(0.95 0.04 65))",
              borderBottom: "1px solid oklch(0.88 0.02 80)",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {[1, 2].map((s) => (
                  <div key={s} className="flex items-center gap-1">
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                      style={{
                        background:
                          s <= step
                            ? "oklch(0.65 0.22 48)"
                            : "oklch(0.88 0.01 80)",
                        color: s <= step ? "white" : "oklch(0.55 0.01 80)",
                      }}
                    >
                      {s < step ? <CheckCircle className="w-4 h-4" /> : s}
                    </div>
                    {s < 2 && (
                      <div
                        className="w-8 h-0.5 rounded"
                        style={{
                          background:
                            step > s
                              ? "oklch(0.65 0.22 48)"
                              : "oklch(0.88 0.01 80)",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs font-body text-muted-foreground">
                Step {step} of 2
              </span>
            </div>
            <Progress value={step === 1 ? 50 : 100} className="h-1.5 mb-4" />
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "oklch(0.65 0.22 48 / 0.12)" }}
              >
                {step === 1 ? (
                  <User
                    className="w-5 h-5"
                    style={{ color: "oklch(0.65 0.22 48)" }}
                  />
                ) : (
                  <Target
                    className="w-5 h-5"
                    style={{ color: "oklch(0.65 0.22 48)" }}
                  />
                )}
              </div>
              <div>
                <h2
                  className="font-display font-bold text-xl"
                  style={{ color: "oklch(0.25 0.03 80)" }}
                >
                  {step === 1 ? "Complete Your Profile" : "Set Your Goals"}
                </h2>
                <p className="text-sm font-body text-muted-foreground">
                  {step === 1
                    ? "Tell us a little about yourself"
                    : "Define your weight & measurement targets"}
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {step === 1 ? (
              <>
                {/* Avatar preview */}
                <div className="flex justify-center mb-2">
                  <Avatar
                    className="w-16 h-16 text-xl"
                    style={{ background: "oklch(0.65 0.22 48)" }}
                  >
                    <AvatarFallback
                      style={{
                        background: "oklch(0.65 0.22 48)",
                        color: "white",
                        fontSize: "1.25rem",
                        fontWeight: 700,
                      }}
                    >
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body font-medium">Full Name *</Label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    data-ocid="onboarding.name.input"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body font-medium">Age</Label>
                  <Input
                    type="number"
                    min="1"
                    max="120"
                    value={ext.age}
                    onChange={(e) => updateExt("age", e.target.value)}
                    placeholder="e.g. 28"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body font-medium">Height</Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={ext.height}
                      onChange={(e) => updateExt("height", e.target.value)}
                      placeholder={
                        ext.heightUnit === "cm" ? "e.g. 170" : "e.g. 5.7"
                      }
                      className="flex-1"
                    />
                    <div
                      className="flex rounded-md border overflow-hidden"
                      style={{ borderColor: "oklch(0.88 0.015 80)" }}
                    >
                      {(["cm", "ft"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => updateExt("heightUnit", u)}
                          className="px-3 py-2 text-sm font-body transition-colors"
                          style={
                            ext.heightUnit === u
                              ? {
                                  background: "oklch(0.65 0.22 48)",
                                  color: "white",
                                }
                              : {
                                  background: "white",
                                  color: "oklch(0.4 0.02 80)",
                                }
                          }
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body font-medium">
                    Current Weight
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="1"
                      value={ext.weight}
                      onChange={(e) => updateExt("weight", e.target.value)}
                      placeholder={
                        ext.weightUnit === "kg" ? "e.g. 65" : "e.g. 143"
                      }
                      className="flex-1"
                    />
                    <div
                      className="flex rounded-md border overflow-hidden"
                      style={{ borderColor: "oklch(0.88 0.015 80)" }}
                    >
                      {(["kg", "lbs"] as const).map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => updateExt("weightUnit", u)}
                          className="px-3 py-2 text-sm font-body transition-colors"
                          style={
                            ext.weightUnit === u
                              ? {
                                  background: "oklch(0.65 0.22 48)",
                                  color: "white",
                                }
                              : {
                                  background: "white",
                                  color: "oklch(0.4 0.02 80)",
                                }
                          }
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body font-medium">
                    WhatsApp Contact
                  </Label>
                  <Input
                    type="tel"
                    value={ext.whatsapp}
                    onChange={(e) => updateExt("whatsapp", e.target.value)}
                    placeholder="e.g. +60123456789"
                  />
                </div>
              </>
            ) : (
              <>
                {/* Weight Goal */}
                <div
                  className="rounded-xl p-4 space-y-3"
                  style={{
                    background: "oklch(0.97 0.015 80)",
                    border: "1px solid oklch(0.9 0.01 80)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Scale
                      className="w-4 h-4"
                      style={{ color: "oklch(0.65 0.22 48)" }}
                    />
                    <span
                      className="font-display font-semibold"
                      style={{ color: "oklch(0.65 0.22 48)" }}
                    >
                      Weight Goal
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="font-body font-medium text-sm">
                      Target Weight (kg)
                    </Label>
                    <Input
                      type="number"
                      min="1"
                      value={goals.targetWeight}
                      onChange={(e) =>
                        updateGoal("targetWeight", e.target.value)
                      }
                      placeholder="e.g. 60"
                      data-ocid="onboarding.goals.weight.input"
                    />
                  </div>
                </div>

                {/* Measurement Goals */}
                <div
                  className="rounded-xl p-4 space-y-3"
                  style={{
                    background: "oklch(0.97 0.015 80)",
                    border: "1px solid oklch(0.9 0.01 80)",
                  }}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Ruler
                      className="w-4 h-4"
                      style={{ color: "oklch(0.65 0.22 48)" }}
                    />
                    <span
                      className="font-display font-semibold"
                      style={{ color: "oklch(0.65 0.22 48)" }}
                    >
                      Measurement Goals (cm)
                    </span>
                  </div>
                  {measureFields.map(({ key, label, placeholder }) => (
                    <div key={key} className="space-y-1.5">
                      <Label className="font-body font-medium text-sm">
                        {label}
                      </Label>
                      <Input
                        type="number"
                        min="1"
                        value={goals[key]}
                        onChange={(e) => updateGoal(key, e.target.value)}
                        placeholder={placeholder}
                        data-ocid={`onboarding.goals.${key}.input`}
                      />
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-8 py-5 flex gap-3"
            style={{ borderTop: "1px solid oklch(0.92 0.01 80)" }}
          >
            {step === 1 ? (
              <Button
                onClick={handleSaveProfile}
                disabled={saveProfile.isPending || !name.trim()}
                className="flex-1 gap-2 font-body font-semibold"
                style={{ background: "oklch(0.65 0.22 48)", color: "white" }}
                data-ocid="onboarding.next.button"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  <>
                    Next: Set Goals <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleSkipGoals}
                  className="font-body"
                  data-ocid="onboarding.skip.button"
                >
                  Skip for now
                </Button>
                <Button
                  onClick={handleSaveGoals}
                  className="flex-1 gap-2 font-body font-semibold"
                  style={{ background: "oklch(0.65 0.22 48)", color: "white" }}
                  data-ocid="onboarding.finish.button"
                >
                  <CheckCircle className="w-4 h-4" />
                  Finish Setup
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

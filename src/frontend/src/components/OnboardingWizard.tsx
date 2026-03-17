import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  gender: string;
}

const DEFAULT_EXT: ExtProfile = {
  age: "",
  height: "",
  heightUnit: "cm",
  weight: "",
  weightUnit: "kg",
  whatsapp: "",
  gender: "",
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
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(ext));
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
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <span
                className="text-xs font-body font-semibold px-2.5 py-1 rounded-full"
                style={{
                  background: "oklch(0.45 0.12 152 / 0.12)",
                  color: "oklch(0.5 0.12 152)",
                }}
              >
                Step {step} of 2
              </span>
              <div className="flex gap-2">
                {[1, 2].map((s) => (
                  <div
                    key={s}
                    className="w-2 h-2 rounded-full transition-all"
                    style={{
                      background:
                        s <= step
                          ? "oklch(0.45 0.12 152)"
                          : "oklch(0.88 0.01 80)",
                      width: s === step ? "20px" : "8px",
                    }}
                  />
                ))}
              </div>
            </div>
            <Progress value={step === 1 ? 50 : 100} className="h-1.5 mb-5" />
            {step === 1 ? (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.45 0.12 152 / 0.15)" }}
                >
                  <User
                    className="w-5 h-5"
                    style={{ color: "oklch(0.45 0.12 152)" }}
                  />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Build your profile
                  </h2>
                  <p className="text-muted-foreground text-sm font-body">
                    Tell us a bit about yourself
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "oklch(0.45 0.12 152 / 0.15)" }}
                >
                  <Target
                    className="w-5 h-5"
                    style={{ color: "oklch(0.45 0.12 152)" }}
                  />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-foreground">
                    Set your goals
                  </h2>
                  <p className="text-muted-foreground text-sm font-body">
                    What do you want to achieve?
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="px-8 py-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {step === 1 ? (
              <>
                {/* Avatar preview */}
                <div className="flex justify-center mb-2">
                  <Avatar
                    className="w-16 h-16"
                    style={{ background: "oklch(0.45 0.12 152)" }}
                  >
                    <AvatarFallback
                      style={{
                        background: "oklch(0.45 0.12 152)",
                        color: "white",
                        fontSize: "1.2rem",
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

                {/* Gender */}
                <div className="space-y-1.5">
                  <Label className="font-body font-medium">Gender</Label>
                  <Select
                    value={ext.gender}
                    onValueChange={(val) => updateExt("gender", val)}
                  >
                    <SelectTrigger data-ocid="onboarding.gender.select">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                      <SelectItem value="Prefer not to say">
                        Prefer not to say
                      </SelectItem>
                    </SelectContent>
                  </Select>
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
                    data-ocid="onboarding.age.input"
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
                      data-ocid="onboarding.height.input"
                    />
                    <div className="flex rounded-md border overflow-hidden">
                      {(["cm", "ft"] as const).map((u) => (
                        <button
                          type="button"
                          key={u}
                          onClick={() => updateExt("heightUnit", u)}
                          className="px-3 py-2 text-sm font-body transition-colors"
                          style={
                            ext.heightUnit === u
                              ? {
                                  background: "oklch(0.45 0.12 152)",
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
                      data-ocid="onboarding.weight.input"
                    />
                    <div className="flex rounded-md border overflow-hidden">
                      {(["kg", "lbs"] as const).map((u) => (
                        <button
                          type="button"
                          key={u}
                          onClick={() => updateExt("weightUnit", u)}
                          className="px-3 py-2 text-sm font-body transition-colors"
                          style={
                            ext.weightUnit === u
                              ? {
                                  background: "oklch(0.45 0.12 152)",
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
                  <Label className="font-body font-medium">WhatsApp</Label>
                  <Input
                    type="tel"
                    value={ext.whatsapp}
                    onChange={(e) => updateExt("whatsapp", e.target.value)}
                    placeholder="e.g. +60123456789"
                    data-ocid="onboarding.whatsapp.input"
                  />
                </div>
              </>
            ) : (
              <>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-xl mb-2"
                  style={{
                    background: "oklch(0.45 0.12 152 / 0.08)",
                    border: "1px solid oklch(0.45 0.12 152 / 0.2)",
                  }}
                >
                  <CheckCircle
                    className="w-4 h-4 shrink-0"
                    style={{ color: "oklch(0.45 0.12 152)" }}
                  />
                  <p
                    className="text-xs font-body"
                    style={{ color: "oklch(0.45 0.12 152)" }}
                  >
                    Profile saved! Now set your targets.
                  </p>
                </div>

                <div className="space-y-1.5">
                  <Label className="font-body font-medium flex items-center gap-2">
                    <Scale
                      className="w-4 h-4"
                      style={{ color: "oklch(0.45 0.12 152)" }}
                    />
                    Target Weight (kg)
                  </Label>
                  <Input
                    type="number"
                    value={goals.targetWeight}
                    onChange={(e) => updateGoal("targetWeight", e.target.value)}
                    placeholder="e.g. 60"
                    data-ocid="onboarding.target_weight.input"
                  />
                </div>

                <div
                  className="pt-1 pb-1"
                  style={{ borderTop: "1px solid oklch(0.92 0.01 80)" }}
                >
                  <p
                    className="text-xs font-body font-semibold mb-3"
                    style={{ color: "oklch(0.5 0.18 280)" }}
                  >
                    <Ruler
                      className="w-3.5 h-3.5 inline mr-1"
                      style={{ color: "oklch(0.5 0.18 280)" }}
                    />
                    Measurement Goals
                  </p>
                  <div className="space-y-3">
                    {measureFields.map((f) => (
                      <div key={f.key} className="space-y-1">
                        <Label className="text-xs font-body text-muted-foreground">
                          {f.label}
                        </Label>
                        <Input
                          type="number"
                          value={goals[f.key]}
                          onChange={(e) => updateGoal(f.key, e.target.value)}
                          placeholder={f.placeholder}
                          data-ocid={`onboarding.${f.key}_goal.input`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-8 pb-8 flex flex-col gap-2"
            style={{ borderTop: "1px solid oklch(0.93 0.01 80)" }}
          >
            <div className="h-4" />
            {step === 1 ? (
              <Button
                onClick={handleSaveProfile}
                disabled={saveProfile.isPending}
                className="w-full h-11 font-display font-semibold gap-2"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.45 0.12 152), oklch(0.38 0.1 152))",
                  color: "white",
                }}
                data-ocid="onboarding.next.button"
              >
                {saveProfile.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Continue to Goals
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleSaveGoals}
                  className="w-full h-11 font-display font-semibold gap-2"
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.45 0.12 152), oklch(0.38 0.1 152))",
                    color: "white",
                  }}
                  data-ocid="onboarding.save_goals.button"
                >
                  <CheckCircle className="w-4 h-4" />
                  Save Goals & Get Started
                </Button>
                <Button
                  variant="ghost"
                  onClick={handleSkipGoals}
                  className="w-full text-muted-foreground"
                  data-ocid="onboarding.skip.button"
                >
                  Skip for now
                </Button>
              </>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

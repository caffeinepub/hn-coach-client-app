import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Save, User } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSaveProfile, useUserProfile } from "../hooks/useQueries";

const STORAGE_KEY = "hn_coach_profile_ext";

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

function loadExt(): ExtProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return { ...DEFAULT_EXT, ...JSON.parse(raw) };
  } catch {}
  return { ...DEFAULT_EXT };
}

export default function ProfileTab() {
  const { data: profile } = useUserProfile();
  const saveProfile = useSaveProfile();

  const [name, setName] = useState("");
  const [ext, setExt] = useState<ExtProfile>(loadExt);

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
    : "U";

  function updateExt(field: keyof ExtProfile, value: string) {
    setExt((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    try {
      await saveProfile.mutateAsync(name);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ext));
      toast.success("Profile saved successfully! 💪");
    } catch {
      toast.error("Failed to save profile. Please try again.");
    }
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      {/* Avatar card */}
      <Card
        className="text-center"
        style={{
          background: "oklch(0.97 0.015 80)",
          border: "1px solid oklch(0.88 0.015 80)",
        }}
      >
        <CardContent className="pt-8 pb-6">
          <div className="flex flex-col items-center gap-3">
            <Avatar
              className="w-20 h-20 text-2xl"
              style={{ background: "oklch(0.65 0.22 48)", color: "white" }}
            >
              <AvatarFallback
                style={{
                  background: "oklch(0.65 0.22 48)",
                  color: "white",
                  fontSize: "1.5rem",
                  fontWeight: 700,
                }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
            <div>
              <p
                className="font-display font-bold text-xl"
                style={{ color: "oklch(0.25 0.02 80)" }}
              >
                {name || "Your Name"}
              </p>
              <p className="text-sm text-muted-foreground font-body">
                HN Coach Client
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form card */}
      <Card style={{ border: "1px solid oklch(0.88 0.015 80)" }}>
        <CardHeader>
          <CardTitle
            className="flex items-center gap-2 font-display"
            style={{ color: "oklch(0.65 0.22 48)" }}
          >
            <User className="w-5 h-5" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-name" className="font-body font-medium">
              Full Name
            </Label>
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              data-ocid="profile.name.input"
            />
          </div>

          {/* Age */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-age" className="font-body font-medium">
              Age
            </Label>
            <Input
              id="profile-age"
              type="number"
              min="1"
              max="120"
              value={ext.age}
              onChange={(e) => updateExt("age", e.target.value)}
              placeholder="e.g. 28"
              data-ocid="profile.age.input"
            />
          </div>

          {/* Height */}
          <div className="space-y-1.5">
            <Label className="font-body font-medium">Height</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={ext.height}
                onChange={(e) => updateExt("height", e.target.value)}
                placeholder={ext.heightUnit === "cm" ? "e.g. 170" : "e.g. 5.7"}
                className="flex-1"
                data-ocid="profile.height.input"
              />
              <div
                className="flex rounded-md border overflow-hidden"
                style={{ borderColor: "oklch(0.88 0.015 80)" }}
              >
                <button
                  type="button"
                  onClick={() => updateExt("heightUnit", "cm")}
                  className="px-3 py-2 text-sm font-body transition-colors"
                  style={
                    ext.heightUnit === "cm"
                      ? { background: "oklch(0.65 0.22 48)", color: "white" }
                      : { background: "white", color: "oklch(0.4 0.02 80)" }
                  }
                >
                  cm
                </button>
                <button
                  type="button"
                  onClick={() => updateExt("heightUnit", "ft")}
                  className="px-3 py-2 text-sm font-body transition-colors"
                  style={
                    ext.heightUnit === "ft"
                      ? { background: "oklch(0.65 0.22 48)", color: "white" }
                      : { background: "white", color: "oklch(0.4 0.02 80)" }
                  }
                >
                  ft
                </button>
              </div>
            </div>
          </div>

          {/* Weight */}
          <div className="space-y-1.5">
            <Label className="font-body font-medium">Weight</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                min="1"
                value={ext.weight}
                onChange={(e) => updateExt("weight", e.target.value)}
                placeholder={ext.weightUnit === "kg" ? "e.g. 65" : "e.g. 143"}
                className="flex-1"
                data-ocid="profile.weight.input"
              />
              <div
                className="flex rounded-md border overflow-hidden"
                style={{ borderColor: "oklch(0.88 0.015 80)" }}
              >
                <button
                  type="button"
                  onClick={() => updateExt("weightUnit", "kg")}
                  className="px-3 py-2 text-sm font-body transition-colors"
                  style={
                    ext.weightUnit === "kg"
                      ? { background: "oklch(0.65 0.22 48)", color: "white" }
                      : { background: "white", color: "oklch(0.4 0.02 80)" }
                  }
                >
                  kg
                </button>
                <button
                  type="button"
                  onClick={() => updateExt("weightUnit", "lbs")}
                  className="px-3 py-2 text-sm font-body transition-colors"
                  style={
                    ext.weightUnit === "lbs"
                      ? { background: "oklch(0.65 0.22 48)", color: "white" }
                      : { background: "white", color: "oklch(0.4 0.02 80)" }
                  }
                >
                  lbs
                </button>
              </div>
            </div>
          </div>

          {/* WhatsApp */}
          <div className="space-y-1.5">
            <Label htmlFor="profile-whatsapp" className="font-body font-medium">
              WhatsApp Contact
            </Label>
            <Input
              id="profile-whatsapp"
              type="tel"
              value={ext.whatsapp}
              onChange={(e) => updateExt("whatsapp", e.target.value)}
              placeholder="e.g. +60123456789"
              data-ocid="profile.whatsapp.input"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={saveProfile.isPending}
            className="w-full mt-2 font-body font-semibold"
            style={{ background: "oklch(0.65 0.22 48)", color: "white" }}
            data-ocid="profile.save.button"
          >
            {saveProfile.isPending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {saveProfile.isPending ? "Saving..." : "Save Profile"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

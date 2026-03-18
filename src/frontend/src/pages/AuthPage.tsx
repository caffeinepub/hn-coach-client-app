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
import { Loader2, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile } from "../hooks/useQueries";

function FitnessIllustration() {
  return (
    <div className="relative w-full flex items-center justify-center py-2">
      <svg
        viewBox="0 0 200 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative w-40 h-24 drop-shadow-lg"
        aria-hidden="true"
      >
        {/* Barbell */}
        <rect
          x="40"
          y="55"
          width="120"
          height="6"
          rx="3"
          fill="oklch(0.75 0.08 290 / 0.7)"
        />
        <rect x="28" y="44" width="16" height="28" rx="6" fill="url(#pG)" />
        <rect x="156" y="44" width="16" height="28" rx="6" fill="url(#pG)" />
        {/* Body */}
        <rect x="88" y="62" width="24" height="36" rx="8" fill="url(#tG)" />
        {/* Head */}
        <circle cx="100" cy="52" r="12" fill="url(#hG)" />
        {/* Arms */}
        <rect
          x="58"
          y="52"
          width="32"
          height="10"
          rx="5"
          transform="rotate(-10 58 52)"
          fill="oklch(0.68 0.16 290 / 0.85)"
        />
        <rect
          x="112"
          y="52"
          width="32"
          height="10"
          rx="5"
          transform="rotate(10 112 52)"
          fill="oklch(0.68 0.16 290 / 0.85)"
        />
        {/* Legs */}
        <rect
          x="88"
          y="96"
          width="10"
          height="18"
          rx="5"
          fill="oklch(0.60 0.16 290)"
        />
        <rect
          x="102"
          y="96"
          width="10"
          height="18"
          rx="5"
          fill="oklch(0.56 0.16 290)"
        />
        {/* Sparkles */}
        <circle cx="34" cy="30" r="3" fill="oklch(0.72 0.18 290 / 0.7)" />
        <circle cx="166" cy="28" r="2.5" fill="oklch(0.72 0.18 290 / 0.6)" />
        <defs>
          <linearGradient
            id="tG"
            x1="88"
            y1="62"
            x2="112"
            y2="98"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="oklch(0.75 0.16 290)" />
            <stop offset="100%" stopColor="oklch(0.60 0.16 290)" />
          </linearGradient>
          <linearGradient
            id="hG"
            x1="90"
            y1="42"
            x2="110"
            y2="64"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="oklch(0.78 0.14 290)" />
            <stop offset="100%" stopColor="oklch(0.68 0.16 290)" />
          </linearGradient>
          <linearGradient
            id="pG"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
            gradientUnits="objectBoundingBox"
          >
            <stop offset="0%" stopColor="oklch(0.75 0.16 290)" />
            <stop offset="100%" stopColor="oklch(0.60 0.16 290)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export default function AuthPage() {
  const { login, isLoggingIn, identity } = useInternetIdentity();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");
  const [showProfileForm, setShowProfileForm] = useState(false);

  const handleLogin = async () => {
    try {
      await login();
      setShowProfileForm(true);
    } catch {
      toast.error("Login failed. Please try again.");
    }
  };

  const handleSaveProfile = async () => {
    if (!name.trim()) {
      toast.error("Please enter your name");
      return;
    }
    try {
      await saveProfile.mutateAsync({ name: name.trim(), gender: "male" });
      toast.success("Welcome to HN Coach!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  if (identity && showProfileForm) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.96 0.04 290) 0%, oklch(0.99 0.02 290) 50%, oklch(0.94 0.06 290) 100%)",
        }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 40%, oklch(0.68 0.16 290 / 0.1), transparent 70%)",
          }}
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card
            className="backdrop-blur-md overflow-hidden"
            style={{
              background:
                "linear-gradient(145deg, oklch(1 0 0) 0%, oklch(0.97 0.03 290) 100%)",
              border: "1px solid oklch(0.85 0.08 290)",
              boxShadow:
                "0 20px 60px oklch(0.55 0.15 290 / 0.25), 0 4px 16px oklch(0.55 0.15 290 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.9)",
            }}
          >
            <div
              className="h-1 w-full"
              style={{
                background:
                  "linear-gradient(90deg, oklch(0.68 0.16 290), oklch(0.58 0.18 290), oklch(0.52 0.16 290))",
              }}
            />
            <CardHeader className="text-center">
              <div
                className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.72 0.16 290), oklch(0.58 0.18 290))",
                  boxShadow:
                    "0 4px 14px oklch(0.55 0.18 290 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.25)",
                }}
              >
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="font-display text-3xl gradient-fire-text glow-text-intense">
                Set Up Your Profile
              </CardTitle>
              <CardDescription className="text-foreground/70">
                Tell us your name to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Your Name</Label>
                <Input
                  id="name"
                  placeholder="e.g. Sarah Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveProfile()}
                  data-ocid="auth.name.input"
                  className="bg-input border-border focus:border-primary"
                />
              </div>
              <Button
                className="w-full btn-3d font-display font-semibold"
                onClick={handleSaveProfile}
                disabled={saveProfile.isPending}
                data-ocid="auth.save_profile.button"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Continue to Dashboard →"
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.96 0.04 290) 0%, oklch(0.99 0.02 290) 50%, oklch(0.94 0.06 290) 100%)",
      }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 60% at 50% 50%, oklch(0.68 0.16 290 / 0.1), transparent 70%)",
        }}
      />
      {/* Decorative circles */}
      <div
        className="absolute top-10 left-10 w-32 h-32 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.88 0.08 290 / 0.3)",
          filter: "blur(40px)",
        }}
      />
      <div
        className="absolute bottom-10 right-10 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "oklch(0.80 0.12 290 / 0.2)",
          filter: "blur(60px)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full"
        style={{ maxWidth: 380 }}
      >
        <Card
          className="backdrop-blur-md overflow-hidden"
          style={{
            background:
              "linear-gradient(145deg, oklch(1 0 0) 0%, oklch(0.97 0.03 290) 100%)",
            border: "1px solid oklch(0.85 0.08 290)",
            boxShadow:
              "0 20px 60px oklch(0.55 0.15 290 / 0.25), 0 4px 16px oklch(0.55 0.15 290 / 0.12), inset 0 1px 0 oklch(1 0 0 / 0.9)",
          }}
        >
          {/* Lavender top accent strip */}
          <div
            className="h-1 w-full"
            style={{
              background:
                "linear-gradient(90deg, oklch(0.68 0.16 290), oklch(0.58 0.18 290), oklch(0.52 0.16 290))",
            }}
          />
          {/* Gloss overlay */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "40%",
              background:
                "linear-gradient(180deg, oklch(1 0 0 / 0.12) 0%, oklch(1 0 0 / 0) 100%)",
              borderRadius: "inherit",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <CardHeader className="text-center pb-2 pt-5 relative z-10">
            {/* Logo + brand name */}
            <div className="flex items-center justify-center gap-2 mb-2">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden shrink-0"
                style={{
                  background:
                    "linear-gradient(145deg, oklch(0.72 0.16 290), oklch(0.58 0.18 290))",
                  boxShadow:
                    "0 4px 14px oklch(0.55 0.18 290 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.25)",
                }}
              >
                <img
                  src="/assets/uploads/file_00000000a43071fa8c0038574783daf9-1.png"
                  alt="HN Coach"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight">
                <span style={{ color: "oklch(0.68 0.16 290)" }}>HN</span>{" "}
                <span className="text-foreground">Coach</span>
              </span>
            </div>

            {/* Compact illustration */}
            <FitnessIllustration />

            <CardTitle className="font-display text-xl gradient-fire-text glow-text-intense mt-1">
              Welcome Back ✨
            </CardTitle>
            <CardDescription className="font-body text-foreground/70 text-xs">
              <span
                className="text-white font-semibold"
                style={{
                  color: "white",
                  textShadow: "0 1px 4px oklch(0.55 0.18 290 / 0.5)",
                }}
              >
                HN Coach and fitness journey start here
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 pt-3 pb-5 relative z-10">
            <Button
              className="w-full h-11 text-sm font-display font-semibold btn-3d"
              onClick={handleLogin}
              disabled={isLoggingIn}
              data-ocid="auth.login.button"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing
                  In...
                </>
              ) : (
                "Sign In / Register →"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground font-body leading-relaxed">
              New here? Your account is created automatically.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

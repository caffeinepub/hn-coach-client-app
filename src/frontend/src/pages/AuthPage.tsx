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
import { Dumbbell, Flame, Loader2, User, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile } from "../hooks/useQueries";

const FLOATING_ICONS = [
  { Icon: Dumbbell, top: "10%", left: "8%", delay: 0, duration: 3.2 },
  { Icon: Flame, top: "20%", left: "85%", delay: 0.5, duration: 2.8 },
  { Icon: Zap, top: "65%", left: "5%", delay: 1.0, duration: 3.5 },
  { Icon: Dumbbell, top: "75%", left: "90%", delay: 1.5, duration: 2.6 },
  { Icon: Flame, top: "45%", left: "92%", delay: 0.8, duration: 3.0 },
  { Icon: Zap, top: "85%", left: "40%", delay: 0.3, duration: 3.3 },
  { Icon: Dumbbell, top: "30%", left: "3%", delay: 1.2, duration: 2.9 },
  { Icon: Flame, top: "55%", left: "78%", delay: 0.6, duration: 3.1 },
];

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
      await saveProfile.mutateAsync(name.trim());
      toast.success("Welcome to HN Coach!");
    } catch {
      toast.error("Failed to save profile");
    }
  };

  if (identity && showProfileForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 50%, oklch(0.22 0.06 48 / 0.3), transparent)",
          }}
        />

        {FLOATING_ICONS.map(({ Icon, top, left, delay, duration }) => (
          <div
            key={`${top}-${left}`}
            className="absolute opacity-10 text-primary pointer-events-none"
            style={{
              top,
              left,
              animationDelay: `${delay}s`,
              animation: `float ${duration}s ease-in-out infinite`,
            }}
          >
            <Icon className="w-8 h-8" />
          </div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card
            className="backdrop-blur-md"
            style={{
              background: "oklch(0.16 0.014 260 / 0.95)",
              border: "1px solid oklch(0.74 0.21 48 / 0.25)",
              boxShadow: "0 0 60px oklch(0.74 0.21 48 / 0.12)",
            }}
          >
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-fire mx-auto flex items-center justify-center mb-4 glow-orange-intense">
                <User className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="font-display text-2xl">
                Set Up Your Profile
              </CardTitle>
              <CardDescription>
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
                className="w-full glow-orange gradient-fire text-white font-display font-semibold"
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
    <div className="min-h-screen bg-background flex relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 70% at 30% 50%, oklch(0.74 0.21 48 / 0.12), transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: "url('/assets/generated/auth-bg.dim_1200x900.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />

      {FLOATING_ICONS.map(({ Icon, top, left, delay, duration }) => (
        <div
          key={`${top}-${left}`}
          className="absolute opacity-[0.07] text-primary pointer-events-none"
          style={{
            top,
            left,
            animationDelay: `${delay}s`,
            animation: `float ${duration}s ease-in-out infinite`,
          }}
        >
          <Icon className="w-10 h-10" />
        </div>
      ))}

      <div className="absolute left-0 top-0 bottom-0 w-1 gradient-fire opacity-60" />

      <div className="relative z-10 flex flex-col lg:flex-row w-full">
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-60" />
                <div className="relative w-12 h-12 rounded-xl gradient-fire flex items-center justify-center">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight">
                HN{" "}
                <span className="gradient-fire-text glow-text-intense">
                  Coach
                </span>
              </span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-none mb-6">
              Track Your
              <br />
              <span className="gradient-fire-text glow-text-intense">
                Progress.
              </span>
              <br />
              Transform Your
              <br />
              <span className="gradient-fire-text">Body.</span>
            </h1>

            <p className="text-muted-foreground text-lg font-body leading-relaxed max-w-sm">
              Log daily weight, weekly measurements, join fitness classes, and
              stay motivated with coach promotions.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-6">
              {[
                { label: "Weight Tracking", icon: "⚖️" },
                { label: "Body Measurements", icon: "📏" },
                { label: "Group Classes", icon: "🏋️" },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div
                    className="w-12 h-12 rounded-xl mx-auto mb-2 flex items-center justify-center text-2xl"
                    style={{
                      background: "oklch(0.74 0.21 48 / 0.12)",
                      border: "1px solid oklch(0.74 0.21 48 / 0.25)",
                    }}
                  >
                    {item.icon}
                  </div>
                  <div className="text-xs text-muted-foreground font-body font-medium">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="flex items-center justify-center px-8 py-16 lg:w-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <Card
              className="backdrop-blur-md"
              style={{
                background: "oklch(0.16 0.014 260 / 0.92)",
                border: "1px solid oklch(0.74 0.21 48 / 0.22)",
                boxShadow:
                  "0 0 50px oklch(0.74 0.21 48 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.05)",
              }}
            >
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-display text-2xl">
                  Welcome Back 🔥
                </CardTitle>
                <CardDescription className="font-body">
                  Sign in to access your fitness dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Button
                  className="w-full h-12 text-base font-display font-semibold gradient-fire text-white glow-orange-intense"
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

                <div className="text-center text-xs text-muted-foreground font-body leading-relaxed">
                  New here? Your account is created automatically on first
                  sign-in.
                  <br />
                  The first member becomes the coach.
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

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
import { Dumbbell, Loader2, User } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useSaveProfile } from "../hooks/useQueries";

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

  // If already logged in and has identity, show profile setup
  if (identity && showProfileForm) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-10"
          style={{
            backgroundImage:
              "url('/assets/generated/auth-bg.dim_1200x900.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card className="bg-card border-border">
            <CardHeader className="text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary mx-auto flex items-center justify-center mb-4 glow-orange">
                <User className="w-8 h-8 text-primary-foreground" />
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
                className="w-full glow-orange"
                onClick={handleSaveProfile}
                disabled={saveProfile.isPending}
                data-ocid="auth.save_profile.button"
              >
                {saveProfile.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                  </>
                ) : (
                  "Continue to Dashboard"
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
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-15"
        style={{
          backgroundImage: "url('/assets/generated/auth-bg.dim_1200x900.jpg')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />

      {/* Decorative accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-primary to-transparent" />

      <div className="relative z-10 flex flex-col lg:flex-row w-full">
        {/* Left: Branding */}
        <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 py-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="max-w-lg"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center glow-orange">
                <Dumbbell className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="font-display font-extrabold text-2xl tracking-tight">
                HN <span className="text-primary">Coach</span>
              </span>
            </div>

            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-7xl leading-none mb-6">
              Track Your
              <br />
              <span className="text-primary glow-text">Progress.</span>
              <br />
              Transform Your
              <br />
              Body.
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
                  <div className="text-2xl mb-1">{item.icon}</div>
                  <div className="text-xs text-muted-foreground font-body">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right: Auth card */}
        <div className="flex items-center justify-center px-8 py-16 lg:w-[480px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-sm"
          >
            <Card className="bg-card/90 backdrop-blur-md border-border">
              <CardHeader className="text-center pb-2">
                <CardTitle className="font-display text-2xl">
                  Welcome Back
                </CardTitle>
                <CardDescription className="font-body">
                  Sign in to access your fitness dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                <Button
                  className="w-full h-12 text-base font-display font-semibold glow-orange"
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
                    "Sign In / Register"
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

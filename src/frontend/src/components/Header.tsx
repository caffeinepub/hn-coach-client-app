import { Button } from "@/components/ui/button";
import { Dumbbell, LayoutDashboard, LogOut, Shield } from "lucide-react";
import type { AppView } from "../App";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

interface HeaderProps {
  isAdmin: boolean;
  currentView: AppView;
  onViewChange: (view: AppView) => void;
}

export default function Header({
  isAdmin,
  currentView,
  onViewChange,
}: HeaderProps) {
  const { clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Animated logo ring */}
          <div className="relative">
            <div className="absolute inset-0 rounded-xl animate-pulse-glow opacity-70" />
            <div className="relative w-10 h-10 rounded-xl gradient-fire flex items-center justify-center">
              <Dumbbell className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-foreground">
              HN{" "}
              <span className="gradient-fire-text glow-text-intense">
                Coach
              </span>
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("dashboard")}
            data-ocid="nav.dashboard.link"
            className={`gap-2 ${currentView === "dashboard" ? "glow-orange" : ""}`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          {isAdmin && (
            <Button
              variant={currentView === "admin" ? "default" : "ghost"}
              size="sm"
              onClick={() => onViewChange("admin")}
              data-ocid="nav.admin.link"
              className={`gap-2 ${currentView === "admin" ? "glow-orange" : ""}`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Coach Panel</span>
            </Button>
          )}

          <div className="w-px h-6 bg-border mx-1" />

          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-8 h-8 rounded-full gradient-fire flex items-center justify-center text-xs font-display font-bold text-white">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <span className="font-body">{profile?.name ?? "Member"}</span>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => clear()}
            data-ocid="nav.logout.button"
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </nav>
      </div>
      {/* Animated gradient border at bottom */}
      <div className="header-gradient-border" />
    </header>
  );
}

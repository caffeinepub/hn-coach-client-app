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
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-md bg-primary flex items-center justify-center glow-orange">
            <Dumbbell className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <span className="font-display font-800 text-xl tracking-tight text-foreground">
              HN <span className="text-primary">Coach</span>
            </span>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <Button
            variant={currentView === "dashboard" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewChange("dashboard")}
            data-ocid="nav.dashboard.link"
            className="gap-2"
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
              className="gap-2"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Coach Panel</span>
            </Button>
          )}

          <div className="w-px h-6 bg-border mx-1" />

          <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-display font-semibold text-foreground">
              {profile?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <span>{profile?.name ?? "Member"}</span>
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
    </header>
  );
}

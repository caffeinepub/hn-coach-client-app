import { Button } from "@/components/ui/button";
import { LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

interface HeaderProps {
  onProfileClick: () => void;
  onGoalsClick: () => void;
  onDashboardClick: () => void;
}

export default function Header({
  onProfileClick,
  onGoalsClick,
  onDashboardClick,
}: HeaderProps) {
  const { clear } = useInternetIdentity();
  const { data: profile } = useUserProfile();

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <button
          type="button"
          className="flex items-center gap-2 cursor-pointer bg-transparent border-none p-0"
          onClick={onDashboardClick}
          data-ocid="nav.home.link"
        >
          <img
            src="/assets/uploads/file_00000000a43071fa8c0038574783daf9-1.png"
            alt="HN Coach"
            className="h-10 w-10 object-contain rounded-xl"
          />
          <span className="font-display font-extrabold text-xl tracking-tight text-foreground hidden sm:block">
            HN <span className="gradient-fire-text">Coach</span>
          </span>
        </button>

        <nav className="flex items-center gap-1">
          {/* Goals BEFORE Dashboard */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoalsClick}
            title="My Goals"
            data-ocid="nav.goals.button"
            className="gap-1.5 font-body text-sm hover:text-primary"
          >
            <span className="text-base">🎯</span>
            <span className="hidden sm:inline">Goals</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onDashboardClick}
            data-ocid="nav.dashboard.link"
            className="gap-2"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </Button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Profile button - highlighted */}
          <Button
            size="sm"
            onClick={onProfileClick}
            data-ocid="nav.profile.button"
            className="gap-2 font-body text-sm"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.65 0.22 48), oklch(0.58 0.2 38))",
              color: "white",
              borderRadius: "20px",
              padding: "0 14px",
            }}
          >
            <UserCircle className="w-4 h-4" />
            <span className="hidden sm:inline">
              {profile?.name ?? "Profile"}
            </span>
          </Button>

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
      <div className="header-gradient-border" />
    </header>
  );
}

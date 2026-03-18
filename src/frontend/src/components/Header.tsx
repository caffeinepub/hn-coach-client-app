import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";
import { Bell, LayoutDashboard, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useUserProfile } from "../hooks/useQueries";

const LAST_SEEN_KEY = "hncoach_comments_last_seen";

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
  const { clear, identity } = useInternetIdentity();
  const { data: profile } = useUserProfile();
  const { actor, isFetching } = useActor();
  const [bellOpen, setBellOpen] = useState(false);

  const principal = identity?.getPrincipal();
  const principalStr = principal?.toString();

  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["coachComments", principalStr],
    queryFn: async () => {
      if (!actor || !principal) return [];
      try {
        return (actor as any).getActivityComments(principal) as Promise<
          Array<{ activityKey: string; comment: string; createdAt: bigint }>
        >;
      } catch {
        return [];
      }
    },
    enabled: !!actor && !isFetching && !!principal,
    refetchInterval: 30000,
  });

  const lastSeen = Number(localStorage.getItem(LAST_SEEN_KEY) ?? "0");
  const unreadComments = comments.filter(
    (c) => Number(c.createdAt) / 1_000_000 > lastSeen,
  );
  const unreadCount = unreadComments.length;

  const handleBellOpen = (open: boolean) => {
    setBellOpen(open);
    if (open && unreadCount > 0) {
      // Mark all as read
      localStorage.setItem(LAST_SEEN_KEY, Date.now().toString());
      refetchComments();
    }
  };

  const recentComments = [...comments]
    .sort((a, b) => Number(b.createdAt) - Number(a.createdAt))
    .slice(0, 5);

  return (
    <header
      className="sticky top-0 z-50 bg-background/90 backdrop-blur-md"
      style={{ boxShadow: "0 2px 12px oklch(0.68 0.16 290 / 0.15)" }}
    >
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
          {/* Goals */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onGoalsClick}
            title="My Goals"
            data-ocid="nav.goals.button"
            className="gap-1.5 font-body text-sm hover:text-primary"
          >
            <span className="text-base">🎯</span>
            <span className="hidden sm:inline">My Goals</span>
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

          {/* Coach Comments Bell */}
          <Popover open={bellOpen} onOpenChange={handleBellOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-colors hover:bg-accent"
                data-ocid="nav.notifications.button"
                title="Coach Comments"
              >
                <Bell className="w-4 h-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 flex items-center justify-center text-white font-bold rounded-full"
                    style={{
                      background: "oklch(0.55 0.22 25)",
                      fontSize: "10px",
                      minWidth: "16px",
                      height: "16px",
                      padding: "0 3px",
                    }}
                    data-ocid="nav.notifications.badge"
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent
              align="end"
              className="w-80 p-0 overflow-hidden"
              style={{
                border: "1px solid oklch(0.88 0.04 290)",
                boxShadow: "0 8px 32px oklch(0.55 0.15 290 / 0.15)",
              }}
              data-ocid="nav.notifications.popover"
            >
              <div
                className="px-4 py-3 flex items-center justify-between"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.68 0.16 290), oklch(0.58 0.18 290))",
                }}
              >
                <span className="font-display font-bold text-white text-sm">
                  🏋️ Coach Messages
                </span>
                {unreadCount > 0 && (
                  <Badge
                    className="font-body text-xs"
                    style={{
                      background: "oklch(1 0 0 / 0.2)",
                      color: "white",
                      border: "none",
                    }}
                  >
                    {unreadCount} new
                  </Badge>
                )}
              </div>

              {recentComments.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground font-body text-sm">
                    No coach comments yet
                  </p>
                  <p className="text-muted-foreground font-body text-xs mt-1">
                    Your coach's feedback will appear here
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {recentComments.map((c) => {
                    const ts = Number(c.createdAt) / 1_000_000;
                    const date = new Date(ts);
                    const isUnread = ts > lastSeen;
                    return (
                      <li
                        key={c.activityKey}
                        className="px-4 py-3"
                        style={{
                          background: isUnread
                            ? "oklch(0.96 0.03 290)"
                            : "white",
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <span className="text-base mt-0.5">💬</span>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-body font-semibold mb-0.5"
                              style={{ color: "oklch(0.55 0.18 290)" }}
                            >
                              HN Coach
                              <span
                                className="ml-1 font-normal"
                                style={{ color: "oklch(0.65 0.03 290)" }}
                              >
                                · {c.activityKey.replace(/_/g, " ")}
                              </span>
                            </p>
                            <p className="font-body text-sm text-foreground leading-snug">
                              {c.comment}
                            </p>
                            <p
                              className="font-body text-xs mt-1"
                              style={{ color: "oklch(0.65 0.04 260)" }}
                            >
                              {date.toLocaleDateString()}{" "}
                              {date.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                          {isUnread && (
                            <span
                              className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5"
                              style={{ background: "oklch(0.55 0.22 25)" }}
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </PopoverContent>
          </Popover>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Profile button */}
          <Button
            size="sm"
            onClick={onProfileClick}
            data-ocid="nav.profile.button"
            className="gap-2 font-body text-sm"
            style={{
              background:
                "linear-gradient(145deg, oklch(0.72 0.16 290) 0%, oklch(0.58 0.18 290) 100%)",
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

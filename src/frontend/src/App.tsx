import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Header from "./components/Header";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useIsAdmin } from "./hooks/useQueries";
import AuthPage from "./pages/AuthPage";
import CoachAdminPage from "./pages/CoachAdminPage";
import DashboardPage from "./pages/DashboardPage";

export type AppView = "dashboard" | "admin";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [view, setView] = useState<AppView>("dashboard");
  const { data: isAdmin } = useIsAdmin();

  if (isInitializing) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="app.loading_state"
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-body">Loading HN Coach...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return (
      <>
        <AuthPage />
        <Toaster richColors theme="dark" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header isAdmin={!!isAdmin} currentView={view} onViewChange={setView} />
      <main className="flex-1">
        {view === "admin" && isAdmin ? (
          <CoachAdminPage />
        ) : (
          <DashboardPage principal={identity.getPrincipal()} />
        )}
      </main>
      <footer className="border-t border-border py-4 px-6 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()}. Built with{" "}
        <span className="text-primary">♥</span> using{" "}
        <a
          href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          caffeine.ai
        </a>
      </footer>
      <Toaster richColors theme="dark" />
    </div>
  );
}

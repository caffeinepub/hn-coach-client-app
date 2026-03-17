import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import Header from "./components/Header";
import OnboardingWizard, {
  isOnboardingDone,
} from "./components/OnboardingWizard";
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
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(
    isOnboardingDone(),
  );

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
        <Toaster richColors theme="light" />
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
        © {new Date().getFullYear()} HN Coach. All rights reserved.
      </footer>
      <Toaster richColors theme="light" />

      {/* Onboarding wizard — shown once after first login */}
      {!onboardingComplete && identity && (
        <OnboardingWizard onComplete={() => setOnboardingComplete(true)} />
      )}
    </div>
  );
}

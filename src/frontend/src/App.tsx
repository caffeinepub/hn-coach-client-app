import { Toaster } from "@/components/ui/sonner";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import OnboardingWizard, {
  isOnboardingDone,
} from "./components/OnboardingWizard";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AuthPage from "./pages/AuthPage";
import CoachAdminPage from "./pages/CoachAdminPage";
import DashboardPage from "./pages/DashboardPage";

export type AppView = "dashboard" | "admin";

function isAdminHash(hash: string) {
  return hash === "#admin" || hash === "#/admin";
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const [view, setView] = useState<AppView>(() =>
    isAdminHash(window.location.hash) ? "admin" : "dashboard",
  );
  const [onboardingComplete, setOnboardingComplete] = useState<boolean>(
    isOnboardingDone(),
  );
  const [dashboardTab, setDashboardTab] = useState<string>("home");

  useEffect(() => {
    const handleHashChange = () => {
      if (isAdminHash(window.location.hash)) {
        setView("admin");
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const handleViewChange = (newView: AppView) => {
    setView(newView);
    window.location.hash = newView === "admin" ? "/admin" : "";
  };

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

  if (view === "admin") {
    return (
      <>
        <CoachAdminPage onBackToApp={() => handleViewChange("dashboard")} />
        <Toaster richColors theme="light" />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        onProfileClick={() => {
          handleViewChange("dashboard");
          setDashboardTab("profile");
        }}
        onGoalsClick={() => {
          handleViewChange("dashboard");
          setDashboardTab("goals");
        }}
        onDashboardClick={() => handleViewChange("dashboard")}
      />
      <main className="flex-1 pb-8">
        <DashboardPage
          principal={identity.getPrincipal()}
          activeTab={dashboardTab}
          onTabChange={setDashboardTab}
        />
      </main>
      <Toaster richColors theme="light" />

      <div
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center"
        style={{
          height: "22px",
          background: "oklch(0.12 0.03 290)",
          borderTop: "1px solid oklch(0.22 0.05 290)",
        }}
        data-ocid="app.watermark.panel"
      >
        <p
          className="text-center font-body"
          style={{
            fontSize: "10px",
            color: "oklch(0.65 0.05 290)",
            letterSpacing: "0.04em",
          }}
        >
          © {new Date().getFullYear()} HN Coach — All Rights Reserved
        </p>
      </div>

      {!onboardingComplete && identity && (
        <OnboardingWizard onComplete={() => setOnboardingComplete(true)} />
      )}
    </div>
  );
}

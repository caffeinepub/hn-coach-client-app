import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import { Home, Ruler, Scale, Target, UserCircle } from "lucide-react";
import GoalsTab from "../components/GoalsTab";
import HomeDashboard from "../components/HomeDashboard";
import Measurements from "../components/Measurements";
import ProfileTab from "../components/ProfileTab";
import WeightLog from "../components/WeightLog";

interface DashboardPageProps {
  principal: Principal;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export default function DashboardPage({
  principal,
  activeTab,
  onTabChange,
}: DashboardPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="mb-6">
        <h2 className="font-display font-bold text-3xl">
          <span className="gradient-fire-text">My Dashboard</span>
        </h2>
      </div>

      <Tabs
        value={activeTab ?? "home"}
        onValueChange={onTabChange}
        className="w-full"
      >
        <TabsList
          className="grid grid-cols-3 mb-8 h-12"
          style={{
            background: "oklch(0.18 0.02 260)",
            border: "none",
            borderRadius: "14px",
            padding: "4px",
          }}
          data-ocid="dashboard.tab"
        >
          <TabsTrigger
            value="home"
            className="flex items-center gap-1.5 font-body text-white/70 data-[state=active]:text-white data-[state=active]:bg-[oklch(0.65_0.22_48)] data-[state=active]:shadow-md rounded-xl px-3 h-9"
            data-ocid="dashboard.home.tab"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="text-xs">Home</span>
          </TabsTrigger>
          <TabsTrigger
            value="weight"
            className="flex items-center gap-1.5 font-body text-white/70 data-[state=active]:text-white data-[state=active]:bg-[oklch(0.65_0.22_48)] data-[state=active]:shadow-md rounded-xl px-3 h-9"
            data-ocid="dashboard.weight.tab"
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span className="text-xs">Weight</span>
          </TabsTrigger>
          <TabsTrigger
            value="measurements"
            className="flex items-center gap-1.5 font-body text-white/70 data-[state=active]:text-white data-[state=active]:bg-[oklch(0.65_0.22_48)] data-[state=active]:shadow-md rounded-xl px-3 h-9"
            data-ocid="dashboard.measurements.tab"
          >
            <Ruler className="w-4 h-4 shrink-0" />
            <span className="text-xs">Measure</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <HomeDashboard principal={principal} />
        </TabsContent>
        <TabsContent value="weight">
          <WeightLog principal={principal} />
        </TabsContent>
        <TabsContent value="measurements">
          <Measurements principal={principal} />
        </TabsContent>
        <TabsContent value="profile">
          <ProfileTab />
        </TabsContent>
        <TabsContent value="goals">
          <GoalsTab principal={principal} />
        </TabsContent>
      </Tabs>

      {/* Hidden tab triggers for Profile & Goals (activated via header) */}
      <div className="hidden">
        <span data-ocid="dashboard.profile.tab">
          <UserCircle />
        </span>
        <span data-ocid="dashboard.goals.tab">
          <Target />
        </span>
      </div>
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import {
  Home,
  Ruler,
  Scale,
  Target,
  UserCircle,
  UtensilsCrossed,
} from "lucide-react";
import GoalsTab from "../components/GoalsTab";
import HomeDashboard from "../components/HomeDashboard";
import MealCheckin from "../components/MealCheckin";
import Measurements from "../components/Measurements";
import ProfileTab from "../components/ProfileTab";
import WeightLog from "../components/WeightLog";

interface DashboardPageProps {
  principal: Principal;
}

export default function DashboardPage({ principal }: DashboardPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl">
          <span className="gradient-fire-text">My Dashboard</span>
        </h2>
        <p className="text-muted-foreground font-body mt-1">
          Track your fitness journey — every day counts! 🔥
        </p>
      </div>

      <Tabs defaultValue="home" className="w-full">
        <TabsList
          className="grid grid-cols-6 mb-8 h-12"
          style={{
            background: "oklch(0.95 0.008 80)",
            border: "1px solid oklch(0.88 0.01 80)",
          }}
          data-ocid="dashboard.tab"
        >
          <TabsTrigger
            value="home"
            className="flex items-center gap-1 font-body px-1"
            data-ocid="dashboard.home.tab"
          >
            <Home className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Home</span>
          </TabsTrigger>
          <TabsTrigger
            value="weight"
            className="flex items-center gap-1 font-body px-1"
            data-ocid="dashboard.weight.tab"
          >
            <Scale className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Weight</span>
          </TabsTrigger>
          <TabsTrigger
            value="meals"
            className="flex items-center gap-1 font-body px-1"
            data-ocid="dashboard.meals.tab"
          >
            <UtensilsCrossed className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Meals</span>
          </TabsTrigger>
          <TabsTrigger
            value="measurements"
            className="flex items-center gap-1 font-body px-1"
            data-ocid="dashboard.measurements.tab"
          >
            <Ruler className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Measure</span>
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="flex items-center gap-1 font-body px-1"
            data-ocid="dashboard.profile.tab"
          >
            <UserCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Profile</span>
          </TabsTrigger>
          <TabsTrigger
            value="goals"
            className="flex items-center gap-1 font-body px-1"
            data-ocid="dashboard.goals.tab"
          >
            <Target className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline text-xs">Goals</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <HomeDashboard principal={principal} />
        </TabsContent>
        <TabsContent value="weight">
          <WeightLog principal={principal} />
        </TabsContent>
        <TabsContent value="meals">
          <MealCheckin />
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
    </div>
  );
}

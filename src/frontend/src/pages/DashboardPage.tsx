import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Principal } from "@icp-sdk/core/principal";
import { CalendarDays, Megaphone, Ruler, Scale } from "lucide-react";
import Classes from "../components/Classes";
import Measurements from "../components/Measurements";
import Promotions from "../components/Promotions";
import WeightLog from "../components/WeightLog";

interface DashboardPageProps {
  principal: Principal;
}

export default function DashboardPage({ principal }: DashboardPageProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h2 className="font-display font-bold text-3xl text-foreground">
          My Dashboard
        </h2>
        <p className="text-muted-foreground font-body mt-1">
          Track your fitness journey
        </p>
      </div>

      <Tabs defaultValue="weight" className="w-full">
        <TabsList
          className="grid grid-cols-4 mb-8 bg-muted h-12"
          data-ocid="dashboard.tab"
        >
          <TabsTrigger
            value="weight"
            className="gap-2 font-body"
            data-ocid="dashboard.weight.tab"
          >
            <Scale className="w-4 h-4" />
            <span className="hidden sm:inline">Weight</span>
          </TabsTrigger>
          <TabsTrigger
            value="measurements"
            className="gap-2 font-body"
            data-ocid="dashboard.measurements.tab"
          >
            <Ruler className="w-4 h-4" />
            <span className="hidden sm:inline">Measurements</span>
          </TabsTrigger>
          <TabsTrigger
            value="classes"
            className="gap-2 font-body"
            data-ocid="dashboard.classes.tab"
          >
            <CalendarDays className="w-4 h-4" />
            <span className="hidden sm:inline">Classes</span>
          </TabsTrigger>
          <TabsTrigger
            value="promotions"
            className="gap-2 font-body"
            data-ocid="dashboard.promotions.tab"
          >
            <Megaphone className="w-4 h-4" />
            <span className="hidden sm:inline">Promos</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="weight">
          <WeightLog principal={principal} />
        </TabsContent>
        <TabsContent value="measurements">
          <Measurements principal={principal} />
        </TabsContent>
        <TabsContent value="classes">
          <Classes principal={principal} />
        </TabsContent>
        <TabsContent value="promotions">
          <Promotions />
        </TabsContent>
      </Tabs>
    </div>
  );
}

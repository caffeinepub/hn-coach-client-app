import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Megaphone, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAllPromotions } from "../hooks/useQueries";

export default function Promotions() {
  const { data: promotions = [], isLoading } = useAllPromotions();

  if (isLoading) {
    return (
      <div
        className="flex items-center justify-center py-24"
        data-ocid="promotions.loading_state"
      >
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (promotions.length === 0) {
    return (
      <div className="text-center py-24" data-ocid="promotions.empty_state">
        <Megaphone className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h3 className="font-display text-xl font-semibold text-muted-foreground mb-2">
          No Promotions Yet
        </h3>
        <p className="text-muted-foreground/60 font-body">
          Your coach hasn't posted any offers yet. Stay tuned!
        </p>
      </div>
    );
  }

  const sorted = [...promotions].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  return (
    <div>
      <p className="text-muted-foreground font-body mb-6">
        {promotions.length} active promotion{promotions.length !== 1 ? "s" : ""}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sorted.map((promo, i) => (
          <motion.div
            key={promo.id.toString()}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card
              className="bg-card border-primary/20 h-full relative overflow-hidden"
              data-ocid={`promotions.item.${i + 1}`}
            >
              {/* Subtle glow background */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl" />
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-primary/20 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-primary" />
                    </div>
                    <CardTitle className="font-display text-xl leading-tight">
                      {promo.title}
                    </CardTitle>
                  </div>
                  <Badge className="bg-primary/20 text-primary border-primary/30 shrink-0 text-xs">
                    Active
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="font-body text-muted-foreground leading-relaxed">
                  {promo.body}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

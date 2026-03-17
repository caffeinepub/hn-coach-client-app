import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Megaphone, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useAllPromotions } from "../hooks/useQueries";

const PROMO_BG = [
  "linear-gradient(145deg, oklch(0.35 0.14 290), oklch(0.35 0.14 290))",
  "linear-gradient(145deg, oklch(0.35 0.14 290), oklch(0.35 0.14 290))",
  "linear-gradient(145deg, oklch(0.28 0.06 290), oklch(0.22 0.05 290))",
  "linear-gradient(145deg, oklch(0.28 0.06 290), oklch(0.22 0.05 290))",
];

const BADGE_COLORS = [
  {
    bg: "oklch(0.68 0.16 290 / 0.25)",
    text: "oklch(0.88 0.15 60)",
    border: "oklch(0.68 0.16 290 / 0.5)",
  },
  {
    bg: "oklch(0.65 0.22 30 / 0.25)",
    text: "oklch(0.75 0.14 290)",
    border: "oklch(0.65 0.22 30 / 0.5)",
  },
  {
    bg: "oklch(0.6 0.18 280 / 0.25)",
    text: "oklch(0.78 0.14 290)",
    border: "oklch(0.6 0.18 280 / 0.5)",
  },
  {
    bg: "oklch(0.62 0.17 150 / 0.25)",
    text: "oklch(0.78 0.14 155)",
    border: "oklch(0.62 0.17 150 / 0.5)",
  },
];

const GLOW_COLORS = [
  "oklch(0.68 0.16 290)",
  "oklch(0.7 0.21 63)",
  "oklch(0.7 0.2 78)",
  "oklch(0.72 0.19 93)",
];

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
        {sorted.map((promo, i) => {
          const bg = PROMO_BG[i % PROMO_BG.length];
          const badge = BADGE_COLORS[i % BADGE_COLORS.length];
          const glowColor = GLOW_COLORS[i % GLOW_COLORS.length];
          const borderAlpha = 0.2 + (i % 3) * 0.05;
          return (
            <motion.div
              key={promo.id.toString()}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -4 }}
            >
              <Card
                className="h-full relative overflow-hidden shimmer"
                style={{
                  background: bg,
                  border: `1px solid oklch(0.52 0.14 152 / ${borderAlpha})`,
                  boxShadow:
                    "0 0 30px oklch(0.68 0.16 290 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.05)",
                }}
                data-ocid={`promotions.item.${i + 1}`}
              >
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: glowColor }}
                />

                {promo.imageUrl && (
                  <div
                    className="w-full overflow-hidden rounded-t-lg"
                    style={{ maxHeight: "250px" }}
                  >
                    <img
                      src={promo.imageUrl}
                      alt={promo.title}
                      className="w-full object-cover rounded-t-lg"
                      style={{ maxHeight: "250px" }}
                    />
                  </div>
                )}

                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                        style={{ background: "oklch(0.68 0.16 290 / 0.2)" }}
                      >
                        <Sparkles
                          className="w-4 h-4"
                          style={{ color: "oklch(0.85 0.15 60)" }}
                        />
                      </div>
                      <CardTitle className="font-display text-xl leading-tight text-white">
                        {promo.title}
                      </CardTitle>
                    </div>
                    <Badge
                      className="shrink-0 text-xs font-bold"
                      style={{
                        background: badge.bg,
                        color: badge.text,
                        border: `1px solid ${badge.border}`,
                        animation: "badge-pulse 2.2s ease-in-out infinite",
                      }}
                    >
                      ✨ Active
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  <p className="font-body text-white/75 leading-relaxed">
                    {promo.body}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

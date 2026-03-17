import { useEffect, useState } from "react";
import { nutrients } from "../data/nutrients";

interface NutritionPanelProps {
  activityCount: number;
}

export default function NutritionPanel({ activityCount }: NutritionPanelProps) {
  const [displayed, setDisplayed] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const idx = (dayOfYear + activityCount) % nutrients.length;
    if (idx !== displayed) {
      setAnimating(true);
      setTimeout(() => {
        setDisplayed(idx);
        setAnimating(false);
      }, 350);
    }
  }, [activityCount, displayed]);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    setDisplayed(dayOfYear % nutrients.length);
  }, []);

  const nutrient = nutrients[displayed];

  return (
    <div
      className={`rounded-2xl shadow-md p-4 transition-all duration-350 relative overflow-hidden ${
        animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          "linear-gradient(145deg, oklch(1 0 0) 0%, oklch(0.96 0.04 290) 100%)",
        border: "1px solid oklch(0.85 0.08 290)",
        boxShadow:
          "0 4px 20px oklch(0.55 0.15 290 / 0.12), 0 1px 4px oklch(0.55 0.15 290 / 0.08), inset 0 1px 0 oklch(1 0 0 / 0.8)",
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🧬</span>
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: "oklch(0.58 0.18 290)" }}
        >
          Nutrition Tip
        </span>
        <span className="ml-auto text-xs text-muted-foreground">
          {displayed + 1}/{nutrients.length}
        </span>
      </div>
      <p className="text-sm font-bold text-foreground mb-1">
        Do you know about{" "}
        <span style={{ color: "oklch(0.58 0.18 290)" }}>{nutrient.name}</span>?
      </p>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
        {nutrient.fact}
      </p>
      <div
        className="flex items-center gap-2 rounded-xl px-3 py-2"
        style={{ background: "oklch(0.92 0.06 290)" }}
      >
        <span className="text-base">📊</span>
        <div>
          <span
            className="text-xs font-semibold"
            style={{ color: "oklch(0.45 0.16 290)" }}
          >
            RDA:{" "}
          </span>
          <span className="text-xs text-foreground">{nutrient.rda}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mt-2 text-center">
        Updates after every activity ✨
      </p>
    </div>
  );
}

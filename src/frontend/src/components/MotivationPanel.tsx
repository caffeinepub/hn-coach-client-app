import { useEffect, useState } from "react";
import { motivations } from "../data/motivations";

interface MotivationPanelProps {
  activityCount: number;
}

export default function MotivationPanel({
  activityCount,
}: MotivationPanelProps) {
  const [displayed, setDisplayed] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
        86400000,
    );
    const idx = (dayOfYear + activityCount) % motivations.length;
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
    setDisplayed(dayOfYear % motivations.length);
  }, []);

  return (
    <div
      className={`rounded-2xl shadow-md p-4 transition-all duration-350 relative overflow-hidden ${
        animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        background:
          "linear-gradient(135deg, oklch(0.62 0.16 290) 0%, oklch(0.52 0.18 290) 100%)",
        border: "1px solid oklch(0.68 0.16 290 / 0.3)",
        boxShadow:
          "0 4px 20px oklch(0.55 0.15 290 / 0.18), 0 1px 4px oklch(0.55 0.15 290 / 0.1), inset 0 1px 0 oklch(1 0 0 / 0.15)",
      }}
    >
      {/* Gloss overlay */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "50%",
          background:
            "linear-gradient(180deg, oklch(1 0 0 / 0.12) 0%, oklch(1 0 0 / 0) 100%)",
          borderRadius: "inherit",
          pointerEvents: "none",
        }}
      />
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🔥</span>
          <span className="text-xs font-bold uppercase tracking-widest text-violet-200">
            Daily Motivation
          </span>
        </div>
        <p className="text-sm font-semibold text-white leading-relaxed mb-4">
          &ldquo;{motivations[displayed]}&rdquo;
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs bg-violet-300/20 text-violet-100 px-2 py-1 rounded-full">
            💪 Exercise
          </span>
          <span className="text-xs bg-white/15 text-violet-100 px-2 py-1 rounded-full">
            🎓 Discipline
          </span>
          <span className="text-xs bg-violet-300/20 text-violet-100 px-2 py-1 rounded-full">
            🤝 Respect your coach
          </span>
        </div>
      </div>
    </div>
  );
}

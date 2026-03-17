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
      className={`rounded-2xl bg-gradient-to-br from-navy-50 to-blue-50 border border-blue-200 shadow-md p-4 transition-all duration-350 ${
        animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
      style={{
        background: "linear-gradient(135deg, #1B4332 0%, #2D6A4F 100%)",
      }}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🔥</span>
        <span className="text-xs font-bold uppercase tracking-widest text-green-600">
          Daily Motivation
        </span>
      </div>
      <p className="text-sm font-semibold text-white leading-relaxed mb-4">
        &ldquo;{motivations[displayed]}&rdquo;
      </p>
      <div className="flex gap-2 flex-wrap">
        <span className="text-xs bg-green-700 bg-opacity-20 text-green-400 px-2 py-1 rounded-full">
          💪 Exercise
        </span>
        <span className="text-xs bg-blue-500 bg-opacity-20 text-blue-300 px-2 py-1 rounded-full">
          🎓 Discipline
        </span>
        <span className="text-xs bg-green-500 bg-opacity-20 text-green-300 px-2 py-1 rounded-full">
          🤝 Coach Respect
        </span>
      </div>
    </div>
  );
}

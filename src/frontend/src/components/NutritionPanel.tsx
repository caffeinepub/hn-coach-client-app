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
      className={`rounded-2xl bg-gradient-to-br from-green-50 to-green-50 border border-green-200 shadow-md p-4 transition-all duration-350 ${
        animating ? "opacity-0 scale-95" : "opacity-100 scale-100"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-2xl">🧬</span>
        <span className="text-xs font-bold uppercase tracking-widest text-green-700">
          Nutrition Tip
        </span>
        <span className="ml-auto text-xs text-gray-400">
          {displayed + 1}/{nutrients.length}
        </span>
      </div>
      <p className="text-sm font-bold text-gray-800 mb-1">
        Do you know about{" "}
        <span className="text-green-700">{nutrient.name}</span>?
      </p>
      <p className="text-xs text-gray-600 leading-relaxed mb-3">
        {nutrient.fact}
      </p>
      <div className="flex items-center gap-2 bg-green-100 rounded-xl px-3 py-2">
        <span className="text-base">📊</span>
        <div>
          <span className="text-xs font-semibold text-green-800">RDA: </span>
          <span className="text-xs text-gray-700">{nutrient.rda}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2 text-center">
        Updates after every activity ✨
      </p>
    </div>
  );
}

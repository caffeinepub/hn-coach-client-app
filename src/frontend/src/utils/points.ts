export const POINTS_CONFIG = {
  weight: 20,
  meal: 10,
  footsteps: 20,
  measurements: 50,
};

export interface PointsHistoryEntry {
  label: string;
  amount: number;
  timestamp: number;
}

function storageKey(principalStr: string) {
  return `hn_points_${principalStr}`;
}

function historyKey(principalStr: string) {
  return `hn_points_history_${principalStr}`;
}

export function getPoints(principalStr: string): number {
  const raw = localStorage.getItem(storageKey(principalStr));
  return raw ? Number(raw) : 0;
}

export function getPointsHistory(principalStr: string): PointsHistoryEntry[] {
  const raw = localStorage.getItem(historyKey(principalStr));
  if (!raw) return [];
  try {
    return JSON.parse(raw) as PointsHistoryEntry[];
  } catch {
    return [];
  }
}

export function awardPoints(
  principalStr: string,
  amount: number,
  label: string,
): void {
  const current = getPoints(principalStr);
  localStorage.setItem(storageKey(principalStr), String(current + amount));

  const history = getPointsHistory(principalStr);
  history.unshift({ label, amount, timestamp: Date.now() });
  // Keep last 50 entries
  localStorage.setItem(
    historyKey(principalStr),
    JSON.stringify(history.slice(0, 50)),
  );
}

export function redeemPoints(principalStr: string, amount: number): void {
  const current = getPoints(principalStr);
  const newTotal = Math.max(0, current - amount);
  localStorage.setItem(storageKey(principalStr), String(newTotal));

  const history = getPointsHistory(principalStr);
  history.unshift({
    label: `Cashback redeemed ($${(amount / 100).toFixed(2)})`,
    amount: -amount,
    timestamp: Date.now(),
  });
  localStorage.setItem(
    historyKey(principalStr),
    JSON.stringify(history.slice(0, 50)),
  );
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

function getBonusDates(principalStr: string): string[] {
  const raw = localStorage.getItem(`hn_bonus_dates_${principalStr}`);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

function saveBonusDates(principalStr: string, dates: string[]): void {
  localStorage.setItem(`hn_bonus_dates_${principalStr}`, JSON.stringify(dates));
}

export function getBonusStreak(principalStr: string): number {
  const dates = getBonusDates(principalStr);
  const sorted = [...new Set(dates)].sort().reverse();
  if (sorted.length === 0) return 0;

  let streak = 0;
  let expected = new Date(todayStr());

  for (const d of sorted) {
    const expectedStr = expected.toISOString().split("T")[0];
    if (d === expectedStr) {
      streak++;
      expected.setDate(expected.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function getMilestoneCount(principalStr: string): number {
  const raw = localStorage.getItem(`hn_milestones_${principalStr}`);
  return raw ? Number(raw) : 0;
}

export function recordDailyBonus(principalStr: string): {
  streakBonus: boolean;
  milestoneCount: number;
  extraBonus: number;
} {
  const today = todayStr();
  const dates = getBonusDates(principalStr);
  const set = new Set(dates);
  if (!set.has(today)) {
    set.add(today);
    saveBonusDates(principalStr, [...set]);
  }

  const streak = getBonusStreak(principalStr);

  if (streak > 0 && streak % 7 === 0) {
    // 7-day streak achieved!
    let milestones = getMilestoneCount(principalStr);
    milestones += 1;
    localStorage.setItem(`hn_milestones_${principalStr}`, String(milestones));

    // Milestone points
    awardPoints(principalStr, 500, "7-day streak milestone!");

    // Progressive bonus
    let extraBonus = 0;
    if (milestones === 2) extraBonus = 500;
    else if (milestones === 3) extraBonus = 1000;
    else if (milestones >= 4) extraBonus = 2000;

    if (extraBonus > 0) {
      awardPoints(principalStr, extraBonus, `Milestone x${milestones} bonus!`);
    }

    return { streakBonus: true, milestoneCount: milestones, extraBonus };
  }

  return {
    streakBonus: false,
    milestoneCount: getMilestoneCount(principalStr),
    extraBonus: 0,
  };
}

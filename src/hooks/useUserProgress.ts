import { useMemo } from "react";

// Example structure for Nessie transactions API response
type Transaction = {
  amount: number;
  date: string; // ISO string
  description: string;
};

type Account = {
  balance: number;
};

export function useUserProgress(
  account: Account | null,
  transactions: Transaction[] = []
) {
  // Streak: count of consecutive days user made any transaction
  const streak = useMemo(() => {
    if (transactions.length === 0) return 0;

    // Get unique transaction dates
    const dates = Array.from(
      new Set(transactions.map((tx) => tx.date.substring(0, 10)))
    ).sort(); // Ascending order

    let maxStreak = 1, currentStreak = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const current = new Date(dates[i]);
      if ((current.getTime() - prev.getTime()) / (1000 * 3600 * 24) === 1) {
        currentStreak++;
        maxStreak = Math.max(maxStreak, currentStreak);
      } else {
        currentStreak = 1;
      }
    }
    return maxStreak;
  }, [transactions]);

  // Milestones: achieved if spent or saved certain amounts
  const milestones = useMemo(() => {
    const totalSaved = transactions
      .filter((tx) => tx.amount > 0)
      .reduce((acc, tx) => acc + tx.amount, 0);

    const ms = [];
    if (totalSaved >= 100) ms.push("Saved $100!");
    if (totalSaved >= 500) ms.push("Saved $500!");
    if (streak >= 5) ms.push("5-day streak!");
    return ms;
  }, [transactions, streak]);

  // Completion percent: e.g. percent toward Toyota RAV4 $25,000 down payment
  const rav4Price = 25000;
  const goalProgress = account
    ? Math.min(100, Math.round((account.balance / rav4Price) * 100))
    : 0;

  return {
    streak,
    milestones,
    goalProgress
  };
}

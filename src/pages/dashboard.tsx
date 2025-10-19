// src/pages/dashboard.tsx
import React, { useEffect, useState, useCallback } from "react";
import { createClientBrowser } from "@/lib/supabase";
import Layout from "../components/Layout";
import NebulaOverlay from "../components/NebulaOverlay";
import CelestialCanvas from "../components/CelestialCanvas";
import DailyGoals from "../components/DailyGoals";
import FinancialProgress from "../components/FinancialProgress";
import StreakMilestone from "../components/StreakMilestone";
import CosmicMentorChat from "../components/CosmicMentorChat";
import { useUserProgress } from "../hooks/useUserProgress";
import SpendingOverview from "@/components/SpendingOverview";
import AffordabilityCard from "@/components/AffordabilityCard";
import ProjectionCard from "@/components/ProjectionCard";

// Types
type SummaryTask = { id: string; title: string; is_done: boolean };
type SummaryProgress = {
  goal_id: string;
  target_amount: number;
  total_saved: number;
  pct_complete: number; // 0..100
  remaining: number;
  goal_name?: string;
};
type SummaryResponse = {
  progress: SummaryProgress | null;
  tasks: SummaryTask[];
  streak: number;
};

type Transaction = { amount: number; date: string; description: string };

// New finance types
type FinanceData = {
  income: { annual: number; monthly: number; safeCarBudget: number };
  spendByCat: Record<string, number>;
  budgets: { category: string; monthly_limit: number }[];
  budgetFlags: { category: string; used: number; limit: number; pct: number }[];
};

const Dashboard: React.FC = () => {
  // Supabase session check
  useEffect(() => {
    const supabase = createClientBrowser();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/login";
    });
  }, []);

  // Dashboard summary data
  const [summary, setSummary] = useState<SummaryResponse>({
    progress: null,
    tasks: [],
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // If useUserProgress relies on these, keep them
  const [accountData] = useState<any[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const mainAccount = accountData.length > 0 ? accountData[0] : null;

  const goalProgress = summary.progress?.pct_complete ?? 0;
  const { streak: computedStreak, milestones } = useUserProgress(
    mainAccount,
    transactions
  );

  const loadSummary = useCallback(async () => {
    try {
      setLoading(true);
      setErr(null);
      const res = await fetch("/api/dashboard/summary", { cache: "no-store" });
      if (!res.ok) throw new Error(`Summary ${res.status}`);
      const data: SummaryResponse = await res.json();
      setSummary(data);
    } catch (e: any) {
      setErr(e.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSummary();
  }, [loadSummary]);

  // Toggle a daily goal (optimistic)
  async function handleComplete(taskId: string) {
    setSummary((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === taskId ? { ...t, is_done: !t.is_done } : t
      ),
    }));

    const res = await fetch("/api/tasks/toggle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: taskId }),
    });

    if (!res.ok) {
      // revert on error
      setSummary((prev) => ({
        ...prev,
        tasks: prev.tasks.map((t) =>
          t.id === taskId ? { ...t, is_done: !t.is_done } : t
        ),
      }));
      return;
    }

    const j = await res.json().catch(() => null);
    if (j?.streak !== undefined) {
      setSummary((prev) => ({ ...prev, streak: j.streak }));
    }
  }

  // -- Finance Features --
  const [finance, setFinance] = useState<FinanceData | null>(null);

  const loadFinance = useCallback(async () => {
    try {
      const r = await fetch("/api/finance/summary", { cache: "no-store" });
      if (!r.ok) throw new Error("finance " + r.status);
      setFinance(await r.json());
    } catch (e) {}
  }, []);

  useEffect(() => { loadFinance(); }, [loadFinance]);

  async function handleAddTransaction(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const amount = Number(fd.get("amount"));
    const category = String(fd.get("category") || "Uncategorized");
    const description = String(fd.get("description") || "");
    await fetch("/api/transactions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: -Math.abs(amount), category, description }),
    });
    loadFinance(); // refresh spend chart
    (e.target as HTMLFormElement).reset();
  }

  return (
    <Layout>
      <NebulaOverlay />
      <div className="relative z-10 flex flex-col items-center pt-8 pb-24 min-h-screen">
        <CelestialCanvas
          celestialBody="Saturn"
          rings={goalProgress > 0 ? Math.ceil(goalProgress / 25) : 0}
          glow={(summary.streak ?? 0) >= 7}
        />

        <FinancialProgress
          goal={summary.progress?.goal_name || "RAV4"}
          percent={goalProgress}
        />

<DailyGoals
  goals={(summary.tasks ?? []).map((t) => ({
    id: t.id,
    description: t.title,
    completed: t.is_done,
  }))}
  onComplete={handleComplete}
/>

        <StreakMilestone
          streak={summary.streak ?? computedStreak}
          milestones={milestones}
        />

        <CosmicMentorChat mockData={mainAccount} />

        {/* --- FINANCE CARDS START --- */}
        {finance && (
          <div className="mt-8 w-full flex flex-col items-center gap-6">
            <AffordabilityCard
              safeBudget={finance.income.safeCarBudget}
              estPayment={undefined /* Fill from Payment Simulator if available */}
            />
            <SpendingOverview spendByCat={finance.spendByCat} />
            <ProjectionCard
              targetAmount={Math.round((summary.progress?.target_amount ?? 3000) * 0.2)}
              currentSaved={summary.progress?.total_saved ?? 0}
            />
            {finance.budgetFlags?.length > 0 && (
              <div className="w-full max-w-xl rounded-2xl bg-yellow-500/10 border border-yellow-400/30 p-4 text-yellow-100">
                <div className="font-semibold mb-2">Heads up</div>
                <ul className="list-disc ml-5">
                  {finance.budgetFlags.map(b => (
                    <li key={b.category}>
                      {b.category}: ${b.used.toFixed(0)} of ${b.limit.toFixed(0)} ({b.pct}%)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {/* --- FINANCE CARDS END --- */}

        {/* --- MINI ADD TRANSACTION FORM --- */}
        <form
          onSubmit={handleAddTransaction}
          className="w-full max-w-xl mt-6 bg-black/60 border border-white/10 p-4 rounded-2xl text-sm text-blue-100"
        >
          <div className="font-semibold text-white mb-2">Add an expense</div>
          <div className="grid grid-cols-3 gap-2">
            <input name="amount" type="number" step="0.01" placeholder="Amount" className="bg-white/10 rounded px-3 py-2 text-white" required />
            <input name="category" placeholder="Category" className="bg-white/10 rounded px-3 py-2 text-white" />
            <input name="description" placeholder="Description" className="bg-white/10 rounded px-3 py-2 text-white col-span-2" />
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold">Add</button>
          </div>
        </form>

        {loading && (
          <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
            <div className="text-white text-xl">Loading dashboard…</div>
          </div>
        )}

        {err && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-red-200 bg-red-900/60 px-3 py-2 rounded-lg border border-red-300/30">
            {err}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

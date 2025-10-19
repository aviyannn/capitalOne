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
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";
import toast from "react-hot-toast";

type SummaryTask = { id: string; title: string; is_done: boolean };
type SummaryProgress = {
  goal_id: string;
  target_amount: number;
  total_saved: number;
  pct_complete: number;
  remaining: number;
  goal_name?: string;
};
type SummaryResponse = {
  progress: SummaryProgress | null;
  tasks: SummaryTask[];
  streak: number;
};
type Transaction = { amount: number; date: string; description: string };
type FinanceData = {
  income: { annual: number; monthly: number; safeCarBudget: number };
  spendByCat: Record<string, number>;
  budgets: { category: string; monthly_limit: number }[];
  budgetFlags: { category: string; used: number; limit: number; pct: number }[];
};

const Dashboard: React.FC = () => {
  useEffect(() => {
    const supabase = createClientBrowser();
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) window.location.href = "/login";
    });
  }, []);

  const [summary, setSummary] = useState<SummaryResponse>({
    progress: null,
    tasks: [],
    streak: 0,
  });
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [accountData] = useState<any[]>([]);
  const [transactions] = useState<Transaction[]>([]);
  const mainAccount = accountData.length > 0 ? accountData[0] : null;
  const goalProgress = summary.progress?.pct_complete ?? 0;
  const { streak: computedStreak, milestones } = useUserProgress(
    mainAccount,
    transactions
  );
  const [finance, setFinance] = useState<FinanceData | null>(null);

  // Reminders state!
  const [reminders, setReminders] = useState<string[]>([]);
  const [reminderInput, setReminderInput] = useState("");

  // Add/Show reminders
  function handleAddReminder(e: React.FormEvent) {
    e.preventDefault();
    if (reminderInput.trim().length === 0) return;
    setReminders([...reminders, reminderInput]);
    setReminderInput("");
    toast.success("Reminder set!");
    // Persist to backend if needed
  }

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
  useEffect(() => { loadSummary(); }, [loadSummary]);

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
    loadFinance();
    (e.target as HTMLFormElement).reset();
  }

  // Auto-alert on budget overdraw (example for financial alerts)
  useEffect(() => {
    if (finance?.budgetFlags?.some(b => b.pct > 100)) {
      toast.error('Budget exceeded!');
    }
  }, [finance]);

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

            {/* Finance Cards */}
            <AffordabilityCard
              safeBudget={finance.income.safeCarBudget}
              estPayment={undefined}
            />

            {/* Chart example: Pie Chart for spending by category */}
            <div className="max-w-lg w-full bg-black/50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-blue-200 mb-2">Spending Breakdown</h3>
              <Pie
                data={{
                  labels: Object.keys(finance.spendByCat),
                  datasets: [
                    {
                      data: Object.values(finance.spendByCat),
                      backgroundColor: [
                        '#4F8CFF', '#6FFFBF', '#FFDD57', '#FF5A5A', '#F15BB5'
                      ],
                    },
                  ],
                }}
                options={{
                  plugins: { legend: { labels: { color: "#fff" } } },
                }}
              />
            </div>

            <SpendingOverview spendByCat={finance.spendByCat} />

            <ProjectionCard
              targetAmount={Math.round((summary.progress?.target_amount ?? 3000) * 0.2)}
              currentSaved={summary.progress?.total_saved ?? 0}
            />

            {/* Financial Alerts (budgetFlags) */}
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

        {/* --- Reminders UI --- */}
        <form
          onSubmit={handleAddReminder}
          className="w-full max-w-xl mt-6 mb-2 bg-blue-900/30 border border-blue-300/20 p-4 rounded-2xl text-sm text-blue-100"
        >
          <div className="font-semibold text-white mb-2">Set Reminder</div>
          <div className="flex gap-2">
            <input value={reminderInput} onChange={e => setReminderInput(e.target.value)} placeholder="Type reminder here..." className="bg-white/10 rounded px-3 py-2 text-white flex-1" required />
            <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold">Add</button>
          </div>
        </form>
        <ul className="w-full max-w-xl mb-2 text-blue-300">
          {reminders.map((r, i) => (
            <li key={i} className="mb-1">{r}</li>
          ))}
        </ul>

        {/* --- MINI ADD TRANSACTION FORM --- */}
        <form
          onSubmit={handleAddTransaction}
          className="w-full max-w-xl mt-4 bg-black/60 border border-white/10 p-4 rounded-2xl text-sm text-blue-100"
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

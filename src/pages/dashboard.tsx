import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import NebulaOverlay from "../components/NebulaOverlay";
import CelestialCanvas from "../components/CelestialCanvas";
import { PaymentSimulator } from "@/components/PaymentSimulator";
import toast from "react-hot-toast";
import { getAccounts, getTransactions } from "@/lib/nessieApi";

const CUSTOMER_ID = "YOUR_CUSTOMER_ID";
const DEFAULT_CAR = { name: "RAV4", price: 30000 };

const defaultSavingGoals = [
  { id: "goal-1", label: "Pack lunch 3x/week ($45 saved)", done: false, amount: 45 },
  { id: "goal-2", label: "Cancel unused subscriptions ($20 saved)", done: false, amount: 20 },
  { id: "goal-3", label: "Transfer $100 from side gig", done: false, amount: 100 },
  { id: "goal-4", label: "Cut back weekend takeout ($30 saved)", done: false, amount: 30 }
];

const Dashboard: React.FC = () => {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [mainAccount, setMainAccount] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [carGoal, setCarGoal] = useState(DEFAULT_CAR);
  const [savingGoals, setSavingGoals] = useState(defaultSavingGoals);
  const [expenseInput, setExpenseInput] = useState({ amount: "", category: "", description: "" });
  const [userExpenses, setUserExpenses] = useState<any[]>([]);

  const [apiBalance, setApiBalance] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setErr(null);
      try {
        const acctRes = await getAccounts(CUSTOMER_ID);
        setAccounts(acctRes.data.accounts || []);
        setMainAccount(acctRes.data.accounts?.[0]);
        if (acctRes.data.accounts?.[0]) {
          setApiBalance(acctRes.data.accounts[0].balance?.current || 0);
          const txRes = await getTransactions(acctRes.data.accounts[0]._id);
          setTransactions(txRes.data.transactions || []);
        }
      } catch (e: any) {
        setErr(e?.message || "Could not load accounts");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const fakeCreditScore = 730;
  const completedSavings = savingGoals.filter(g => g.done).reduce((acc, g) => acc + g.amount, 0);
  const totalExpenses = userExpenses.reduce((acc, exp) => acc + Number(exp.amount), 0);
  const saved = Math.max(0, apiBalance + completedSavings - totalExpenses);

  const suggestedMonthly = carGoal.price > 0 ? Math.ceil((carGoal.price - saved) / 18) : 0;
  const estMonths = suggestedMonthly > 0 ? Math.ceil((carGoal.price - saved) / suggestedMonthly) : 0;

  function handleSaveGoalTick(id: string) {
    setSavingGoals(goals =>
      goals.map(goal =>
        goal.id === id ? { ...goal, done: !goal.done } : goal
      )
    );
    const goalObj = savingGoals.find(g => g.id === id);
    if (goalObj && !goalObj.done) {
      toast.success(`Added $${goalObj.amount} to your car fund`);
    }
  }

  function handleAddExpense(e: React.FormEvent) {
    e.preventDefault();
    const amt = Number(expenseInput.amount);
    if (amt > 0 && expenseInput.category) {
      setUserExpenses(expenses => [
        ...expenses,
        {
          amount: amt,
          category: expenseInput.category,
          description: expenseInput.description,
          date: new Date().toISOString().slice(0, 10)
        }
      ]);
      setExpenseInput({ amount: "", category: "", description: "" });
      toast.success("Expense added!");
    }
  }

  // Main layout and theme wrap
  return (
    <Layout>
      <NebulaOverlay />
      <div
        className="relative z-10 flex flex-col items-center pt-8 pb-24 min-h-screen"
        style={{
          background: "linear-gradient(120deg,#1a193b 0%, #121228 100%)"
        }}
      >
        <CelestialCanvas celestialBody="Saturn" rings={Math.ceil((saved / carGoal.price) * 5)} glow={savingGoals.filter(g => g.done).length >= 2} />

        {/* Unified card theme for all sections */}
        <div className="w-full max-w-xl flex flex-col gap-6">

          {/* Car Goal + Current Balance */}
          <div className="bg-gradient-to-br from-[#1a193b] to-[#121228] p-5 rounded-xl shadow-lg text-white">
            <div className="font-extrabold text-lg mb-1">
              Funding your <span className="text-yellow-200">{carGoal.name}</span> goal
            </div>
            <div>
              <span className="text-green-300 font-bold text-xl">${saved.toLocaleString()}</span>
              <span className="text-blue-100"> / ${carGoal.price.toLocaleString()} saved</span>
            </div>
            <div className="mt-1">
              Your bank balance: <span className="font-mono">{apiBalance.toLocaleString()}</span>
            </div>
            <div className="mt-1">
              <span className="text-blue-200 font-semibold">Save ${suggestedMonthly}/month for {estMonths} months.</span>
            </div>
            <div className="mt-2 text-fuchsia-300">
              {saved >= carGoal.price
                ? "Congrats! You're ready to buy your dream car 🪐"
                : `Keep saving: You need $${(carGoal.price - saved).toLocaleString()} more.`}
            </div>
          </div>

          {/* Saving Goals checklist */}
          <div className="bg-gradient-to-br from-[#1a193b] to-[#121228] p-5 rounded-xl shadow text-white">
            <div className="font-bold mb-2">Your Saving Goals</div>
            <ul>
              {savingGoals.map(goal => (
                <li key={goal.id} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={goal.done}
                    onChange={() => handleSaveGoalTick(goal.id)}
                  />
                  <span className={`ml-2 ${goal.done ? "line-through text-green-300" : ""}`}>{goal.label}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Simulator for Car */}
          <div className="bg-gradient-to-br from-[#1a193b] to-[#121228] rounded-xl shadow-lg p-5">
            <h2 className="text-white text-2xl font-extrabold mb-2 flex items-center gap-2">
              🚗 Payment Simulator ({carGoal.name})
            </h2>
            <PaymentSimulator
              car={{
                name: carGoal.name,
                price: carGoal.price,
                monthly: suggestedMonthly,
                description: `Save $${suggestedMonthly}/month to reach your goal in ${estMonths} months.`,
              }}
              profile={{
                income: apiBalance,
                creditScore: fakeCreditScore,
                lifestyle: "balanced",
              }}
              // No finish button, so just don't pass onFinish or pass blank function
              onFinish={() => {}}
            />
          </div>

          {/* Expense Tracker Form and Data */}
          <div className="bg-gradient-to-br from-[#1a193b] to-[#121228] p-5 rounded-xl shadow text-blue-100">
            <form
              onSubmit={handleAddExpense}
              className="mb-4 flex flex-col gap-2"
            >
              <div className="font-semibold text-white mb-2">Track an expense</div>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={expenseInput.amount}
                  onChange={e => setExpenseInput(exp => ({ ...exp, amount: e.target.value }))}
                  placeholder="Amount"
                  required
                  className="bg-white/10 rounded px-3 py-2 text-white flex-1"
                />
                <input
                  value={expenseInput.category}
                  onChange={e => setExpenseInput(exp => ({ ...exp, category: e.target.value }))}
                  placeholder="Category"
                  required
                  className="bg-white/10 rounded px-3 py-2 text-white flex-1"
                />
                <input
                  value={expenseInput.description}
                  onChange={e => setExpenseInput(exp => ({ ...exp, description: e.target.value }))}
                  placeholder="Description"
                  className="bg-white/10 rounded px-3 py-2 text-white flex-2"
                />
                <button type="submit" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded px-4 py-2 font-semibold">Add</button>
              </div>
            </form>
            {/* Logged Expenses */}
            <div className="font-bold mb-2">Tracked Expenses</div>
            <ul>
              {userExpenses.map((exp, idx) => (
                <li key={idx} className="mb-1">
                  <span className="text-blue-200 font-mono">${exp.amount}</span> · {exp.category} · <span className="italic">{exp.description}</span> ({exp.date})
                </li>
              ))}
            </ul>
          </div>

          {/* Account Overview & Recent Transactions */}
          {mainAccount && (
            <div className="bg-gradient-to-br from-[#1a193b] to-[#121228] p-5 rounded-xl shadow text-white">
              <div className="font-bold mb-1">
                🚀 Linked Demo Bank: {mainAccount.type} — ${mainAccount.balance?.current?.toLocaleString() ?? "?"}
              </div>
              <div className="mb-2">Account # {mainAccount._id}</div>
              <div className="mb-2 text-blue-300">Recent Transactions:</div>
              <ul className="bg-black/40 rounded-xl p-3 text-blue-100 text-sm max-h-48 overflow-y-auto">
                {transactions.slice(0, 8).map((tx, i) => (
                  <li key={tx._id || i} className="border-b border-white/10 py-1">
                    <span className="font-mono text-blue-200">${Math.abs(tx.amount).toFixed(2)}</span>
                    {" "}· {tx.transaction_date} · <span className="italic">{tx.description || tx.status}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        {err && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 text-sm text-red-200 bg-red-900/60 px-3 py-2 rounded-lg border border-red-300/30">
            {err}
          </div>
        )}
        {loading && (
          <div className="fixed inset-0 bg-black/30 z-40 flex items-center justify-center">
            <div className="text-white text-xl">Loading dashboard…</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

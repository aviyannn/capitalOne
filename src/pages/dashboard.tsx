import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import NebulaOverlay from "../components/NebulaOverlay";
import CelestialCanvas from "../components/CelestialCanvas";
import DailyGoals from "../components/DailyGoals";
import FinancialProgress from "../components/FinancialProgress";
import StreakMilestone from "../components/StreakMilestone";
import CosmicMentorChat from "../components/CosmicMentorChat";
import { useUserProgress } from "../hooks/useUserProgress";

const API_KEY = "c62b58470698367d714d049d9eac594a"; 

type Transaction = {
  amount: number;
  date: string;
  description: string;
};

const Dashboard: React.FC = () => {
  const [accountData, setAccountData] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Example static goals for DailyGoals component (optional)
  const [goals, setGoals] = useState([
    { id: "1", description: "Save $20 today", completed: false },
    { id: "2", description: "Track 3 expenses", completed: true },
    { id: "3", description: "Learn a new financing tip", completed: false }
  ]);

  useEffect(() => {
    async function fetchAccountData() {
      setLoading(true);
      try {
        const accountsRes = await fetch(
          `https://api.nessieisreal.com/accounts?key=${API_KEY}`
        );
        const accounts = await accountsRes.json();
        setAccountData(accounts || []);
        
        if (accounts && accounts.length > 0) {
          // Get transactions for the first account
          const id = accounts[0]._id || accounts[0].id;
          const txRes = await fetch(
            `https://api.nessieisreal.com/accounts/${id}/transactions?key=${API_KEY}`
          );
          const txs = await txRes.json();
          setTransactions(txs || []);
        }
      } catch (err) {
        setAccountData([]);
        setTransactions([]);
      }
      setLoading(false);
    }
    fetchAccountData();
  }, []);

  function handleComplete(goalId: string) {
    setGoals((prev) =>
      prev.map((g) => (g.id === goalId ? { ...g, completed: !g.completed } : g))
    );
  }

  const mainAccount = accountData.length > 0 ? accountData[0] : null;

  const { streak, milestones, goalProgress } = useUserProgress(mainAccount, transactions);

  return (
    <Layout>
      <NebulaOverlay />
      <div className="relative z-10 flex flex-col items-center pt-8 pb-24 min-h-screen">
        <CelestialCanvas
          celestialBody="Saturn"
          rings={goalProgress > 0 ? Math.ceil(goalProgress / 25) : 0}
          glow={streak >= 7}
        />
        <FinancialProgress goal="RAV4" percent={goalProgress} />
        <DailyGoals goals={goals} onComplete={handleComplete} />
        <StreakMilestone streak={streak} milestones={milestones} />
        <CosmicMentorChat mockData={mainAccount} />
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 z-40 flex items-center justify-center">
            <div className="text-white text-xl">Loading account data...</div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Dashboard;

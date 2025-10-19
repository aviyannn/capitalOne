import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseApiClient } from "../_supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") return res.status(405).end();

  const supabase = createSupabaseApiClient(req, res);
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  // Profile (income)
  const { data: profile } = await supabase
    .from("profiles")
    .select("annual_income, preferred_toyota_models")
    .eq("id", user.id)
    .maybeSingle();

  // Current month spend by category
  const start = new Date(); start.setDate(1);
  const startISO = start.toISOString().slice(0,10);

  const { data: spendRows } = await supabase
    .from("monthly_spend_v")
    .select("*")
    .eq("user_id", user.id)
    .gte("month", startISO);

  // Budgets for warnings
  const { data: budgets } = await supabase
    .from("budgets")
    .select("category, monthly_limit")
    .eq("user_id", user.id);

  const spendByCat: Record<string, number> = {};
  (spendRows ?? []).forEach(r => spendByCat[r.category] = Number(r.spend) || 0);

  const budgetFlags = (budgets ?? []).map(b => {
    const used = spendByCat[b.category] ?? 0;
    const pct = b.monthly_limit ? (used / Number(b.monthly_limit)) * 100 : 0;
    return { category: b.category, used, limit: Number(b.monthly_limit), pct: Math.round(pct) };
  }).filter(x => x.pct >= 75);

  // Simple 20/4/10 guideline (10% of gross monthly income for total car costs)
  const annual = Number(profile?.annual_income) || 0;
  const monthlyIncome = annual / 12;
  const safeCarBudget = Math.round(monthlyIncome * 0.10); // very conservative envelope

  // Return everything the dashboard needs
  return res.status(200).json({
    income: { annual, monthly: Math.round(monthlyIncome), safeCarBudget },
    spendByCat,
    budgets: budgets ?? [],
    budgetFlags,
  });
}

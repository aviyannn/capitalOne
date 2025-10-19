import type { NextApiRequest, NextApiResponse } from "next";
import { createSupabaseApiClient } from "../_supabase";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();
  const supabase = createSupabaseApiClient(req, res);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: "Unauthorized" });

  const { amount, category, description, posted_date } = req.body || {};
  if (typeof amount !== "number") return res.status(400).json({ error: "amount required" });

  const { error } = await supabase.from("transactions").insert([{
    user_id: user.id,
    amount,
    category: category || "Uncategorized",
    description,
    posted_date: posted_date || new Date().toISOString().slice(0,10),
    source: "manual",
  }]);

  if (error) return res.status(400).json({ error: error.message });
  return res.status(200).json({ ok: true });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { createSupabaseApiClient } from '../_supabase';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') return res.status(405).end();
  const supabase = createSupabaseApiClient(req, res);

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { id } = req.body as { id: string };
  if (!id) return res.status(400).json({ error: 'Missing id' });

  // Flip is_done only if the row belongs to the user
  const { data: row, error: readErr } = await supabase
    .from('daily_tasks')
    .select('id,is_done,user_id')
    .eq('id', id)
    .maybeSingle();

  if (readErr || !row || row.user_id !== user.id) {
    return res.status(404).json({ error: 'Task not found' });
  }

  const { error: updErr } = await supabase
    .from('daily_tasks')
    .update({ is_done: !row.is_done })
    .eq('id', id);

  if (updErr) return res.status(500).json({ error: updErr.message });

  // Recompute streak
  const { data: streakRow } = await supabase
    .from('current_streak_v')
    .select('current_streak')
    .eq('user_id', user.id)
    .maybeSingle();

  return res.status(200).json({ ok: true, streak: streakRow?.current_streak ?? 0 });
}

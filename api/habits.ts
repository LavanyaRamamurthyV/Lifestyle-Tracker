import type { VercelRequest, VercelResponse } from '@vercel/node';
const SB = process.env.SUPABASE_URL; const KEY = process.env.SUPABASE_KEY;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const userId = req.query.userId as string;
  const h = { 'apikey': KEY!, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json' };
  try {
    if (req.method === 'GET') {
      const r = await fetch(`${SB}/rest/v1/habits?user_id=eq.${userId}`, { headers: h });
      const data = await r.json();
      return res.json(data.map((x: any) => ({ ...x, userId: x.user_id, name: x.title, dailyTarget: x.daily_target, daysOfWeek: x.days_of_week || [] })));
    }
    if (req.method === 'POST') {
      const habit = req.body;
      const r = await fetch(`${SB}/rest/v1/habits`, { method: 'POST', headers: { ...h, 'Prefer': 'return=representation' }, body: JSON.stringify({ id: crypto.randomUUID(), user_id: habit.userId, title: habit.name || habit.title, frequency: habit.frequency, daily_target: habit.dailyTarget || 1, days_of_week: habit.daysOfWeek || [], completions: habit.completions || [], icon: habit.icon, priority: habit.priority, difficulty: habit.difficulty, tags: habit.tags || [], notes: habit.notes || '' })});
      return res.status(201).json((await r.json())[0]);
    }
    if (req.method === 'PUT') {
      const habit = req.body;
      const r = await fetch(`${SB}/rest/v1/habits?id=eq.${habit.id}&user_id=eq.${userId}`, { method: 'PATCH', headers: { ...h, 'Prefer': 'return=representation' }, body: JSON.stringify({ title: habit.name || habit.title, frequency: habit.frequency, daily_target: habit.dailyTarget, days_of_week: habit.daysOfWeek, completions: habit.completions, icon: habit.icon, priority: habit.priority, difficulty: habit.difficulty, tags: habit.tags, notes: habit.notes })});
      return res.json((await r.json())[0]);
    }
    if (req.method === 'DELETE') {
      await fetch(`${SB}/rest/v1/habits?id=eq.${req.query.id}&user_id=eq.${userId}`, { method: 'DELETE', headers: h });
      return res.json({ success: true });
    }
  } catch (e) { return res.status(500).json({ error: 'Error' }); }
}

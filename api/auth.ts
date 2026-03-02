import type { VercelRequest, VercelResponse } from '@vercel/node';
const SB = process.env.SUPABASE_URL;
const KEY = process.env.SUPABASE_KEY;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const { action, email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Required' });
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(password));
  const hashedPassword = Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  try {
    if (action === 'register') {
      const check = await fetch(`${SB}/rest/v1/users?email=eq.${email}`, { headers: { 'apikey': KEY!, 'Authorization': `Bearer ${KEY}` }});
      if ((await check.json()).length > 0) return res.status(409).json({ error: 'User exists' });
      const create = await fetch(`${SB}/rest/v1/users`, { method: 'POST', headers: { 'apikey': KEY!, 'Authorization': `Bearer ${KEY}`, 'Content-Type': 'application/json', 'Prefer': 'return=representation' }, body: JSON.stringify({ email, name: name || email.split('@')[0], password: hashedPassword })});
      const user = (await create.json())[0];
      if (user) { const { password: _, ...u } = user; return res.status(201).json({ user: u }); }
    }
    if (action === 'login') {
      const resp = await fetch(`${SB}/rest/v1/users?email=eq.${email}`, { headers: { 'apikey': KEY!, 'Authorization': `Bearer ${KEY}` }});
      const users = await resp.json();
      if (!users[0] || users[0].password !== hashedPassword) return res.status(401).json({ error: 'Invalid' });
      const { password: _, ...user } = users[0];
      return res.status(200).json({ user });
    }
  } catch (e) { return res.status(500).json({ error: 'Error' }); }
}

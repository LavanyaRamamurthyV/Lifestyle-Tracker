import type { VercelRequest, VercelResponse } from '@vercel/node';
const SB = process.env.SUPABASE_URL; const KEY = process.env.SUPABASE_KEY;
export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(204).end();
  const userId = req.query.userId as string;
  const h = { 'apikey': KEY!, 'Authorization': \`Bearer \${KEY}\`, 'Content-Type': 'application/json' };
  try {
    if (req.method === 'GET') {
      const r = await fetch(\`\${SB}/rest/v1/todos?user_id=eq.\${userId}\`, { headers: h });
      return res.json(await r.json());
    }
    if (req.method === 'POST') {
      const item = req.body;
      const r = await fetch(\`\${SB}/rest/v1/todos\`, { method: 'POST', headers: { ...h, 'Prefer': 'return=representation' }, body: JSON.stringify({ id: crypto.randomUUID(), user_id: item.userId, ...item })});
      return res.status(201).json((await r.json())[0]);
    }
    if (req.method === 'PUT') {
      const item = req.body;
      const r = await fetch(\`\${SB}/rest/v1/todos?id=eq.\${item.id}&user_id=eq.\${userId}\`, { method: 'PATCH', headers: { ...h, 'Prefer': 'return=representation' }, body: JSON.stringify(item)});
      return res.json((await r.json())[0]);
    }
    if (req.method === 'DELETE') {
      await fetch(\`\${SB}/rest/v1/todos?id=eq.\${req.query.id}&user_id=eq.\${userId}\`, { method: 'DELETE', headers: h });
      return res.json({ success: true });
    }
  } catch (e) { return res.status(500).json({ error: 'Error' }); }
}

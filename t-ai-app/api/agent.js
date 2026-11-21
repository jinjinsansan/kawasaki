// AIエージェント用の読み取り窓口。キーは ?key= / Authorization: Bearer / X-API-Key のどれでもよい
//   GET /api/agent?date=2026-11-22[&race=202608050611]
// 中身は Supabase の agent_data()（鍵の確認・会員の期限・回数の上限・記録もそこで行う）。記録を書くので POST で呼ぶ
import { CORS, keyOf, agentData } from './_lib.js';
export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  const key = keyOf(req, url);
  if (!key) return new Response(JSON.stringify({ error: 'no key', message: 'キーを ?key= か Authorization: Bearer で付けてください。' }), { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });
  const date = url.searchParams.get('date');
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Response(JSON.stringify({ error: 'bad date', message: 'date は YYYY-MM-DD で指定してください。' }), { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });
  const { status, text } = await agentData(key, date, url.searchParams.get('race'));
  return new Response(text, { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS } });
}

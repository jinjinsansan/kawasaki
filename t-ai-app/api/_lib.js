// /api/agent と /api/mcp の共通部分（_ で始まるファイルは窓口にならない）
export const RPC = 'https://tpawwkbqwfyohqhvbtui.supabase.co/rest/v1/rpc/agent_data';
export const PUB = 'sb_publishable_Ws8k7nsbcxG-9SCbXtzrGQ_lchgKHiZ';  // 画面と同じ公開用のキー
export const CORS = { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Authorization, X-API-Key, Content-Type, Mcp-Session-Id, Mcp-Protocol-Version', 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS' };

export function keyOf(req, url) {
  const a = req.headers.get('authorization') || '';
  return (url.searchParams.get('key') || req.headers.get('x-api-key') || (/^bearer\s+/i.test(a) ? a.replace(/^bearer\s+/i, '') : '')).trim();
}

export async function agentData(key, date, race) {
  const r = await fetch(RPC, {
    method: 'POST',
    headers: { apikey: PUB, Authorization: 'Bearer ' + PUB, 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ key, date: date || null, race: race || null }),
  });
  const text = await r.text();
  if (r.ok) return { status: 200, text };
  let msg = 'error';
  try { msg = JSON.parse(text).message || msg; } catch (e) { /* そのまま */ }
  const status = /invalid key/.test(msg) ? 401 : /membership expired/.test(msg) ? 403 : /rate limit/.test(msg) ? 429 : r.status === 400 ? 400 : r.status >= 500 ? 502 : r.status;
  const ja = { 401: 'キーが違うか、再発行で無効になっています。', 403: '会員の有効期限が切れています。', 429: '使える回数の上限です（1分60回・1日3,000回）。少し待ってから使ってください。' };
  return { status, text: JSON.stringify({ error: msg, message: ja[status] || 'データを取れませんでした。' }) };
}


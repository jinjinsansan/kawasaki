// T-AI の MCP 窓口（Streamable HTTP・状態を持たない形）。Claude などから「カスタムコネクタ」として登録する
//   https://t-ai-app.clubkawasaki.net/api/mcp?key=<会員のキー>   （Authorization: Bearer / X-API-Key でも可）
// 道具は川崎さんの ai_connect_kit と同じ3つ。中身は /api/agent と同じ agent_data()（鍵・期限・回数の上限・記録はそこで）
import { CORS, keyOf, agentData } from './_lib.js';
export const config = { runtime: 'edge' };

const VERSIONS = ['2025-06-18', '2025-03-26', '2024-11-05'];
const INFO = { name: 't-ai', title: 'T-AI 競馬データ', version: '1.0.0' };
const today = () => new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
const DATE = { type: 'string', description: '開催日（YYYY-MM-DD）。省略すると今日（日本時間）' };
const TOOLS = [
  { name: 'get_day_races', title: 'その日のレース一覧',
    description: '指定した開催日の全レースと全馬を返す。各馬の勝つ確率 win_prob（T-AI、レース内合計1）、予測順位 rank、単勝オッズ・人気、着順（確定後）、脚質・展開。指数の内訳（idx）は量が多いので含めない（get_horse_index で1頭ずつ取る）。',
    inputSchema: { type: 'object', properties: { date: DATE } } },
  { name: 'get_race_detail', title: 'レースの詳細',
    description: '指定したレースの全馬（指数の内訳 idx つき）と、全券種のオッズ（単勝・複勝・枠連・馬連・ワイド・馬単・3連複・3連単）、ペース判定を返す。',
    inputSchema: { type: 'object', properties: { date: DATE, race_id: { type: 'string', description: 'レースID（get_day_races の race_id）' } }, required: ['race_id'] } },
  { name: 'get_horse_index', title: '1頭の指数カード',
    description: '指定した1頭の指数の内訳（スピード指数・ペース・脚質・成績・騎手厩舎・外厩・今回の条件など。サイトの指数カード相当）と、馬場状態別の勝率・展開を返す。',
    inputSchema: { type: 'object', properties: { date: DATE, race_id: { type: 'string', description: 'レースID' }, horse_no: { type: 'integer', description: '馬番' } }, required: ['race_id', 'horse_no'] } },
];
const ro = { readOnlyHint: true, openWorldHint: false };
TOOLS.forEach((t) => { t.annotations = ro; });

class ToolError extends Error {}
async function day(key, date, race) {
  const { status, text } = await agentData(key, date || today(), race);
  if (status !== 200) { let m = text; try { m = JSON.parse(text).message || text; } catch (e) { /* そのまま */ } throw new ToolError(m); }
  return JSON.parse(text);
}
const raceOf = (d, id) => { const r = (d.races || []).find((x) => x.race_id === String(id)); if (!r) throw new ToolError(`レース ${id} は ${d.date} にありません。get_day_races で race_id を確かめてください。`); return r; };
async function callTool(key, name, a) {
  a = a || {};
  if (name === 'get_day_races') {
    const d = await day(key, a.date);
    return { date: d.date, note: d.note, races: (d.races || []).map(({ odds, horses, ...r }) => ({ ...r, horses: (horses || []).map(({ idx, going_win_pct, ...h }) => h) })) };
  }
  if (name === 'get_race_detail') {
    if (!a.race_id) throw new ToolError('race_id を指定してください。');
    const d = await day(key, a.date, String(a.race_id));
    return { date: d.date, note: d.note, race: raceOf(d, a.race_id) };
  }
  if (name === 'get_horse_index') {
    if (!a.race_id || a.horse_no == null) throw new ToolError('race_id と horse_no を指定してください。');
    const d = await day(key, a.date);
    const r = raceOf(d, a.race_id), h = (r.horses || []).find((x) => x.horse_no === Number(a.horse_no));
    if (!h) throw new ToolError(`${r.venue}${r.race_no}R に馬番 ${a.horse_no} はいません。`);
    const { horses, odds, ...rest } = r;
    return { date: d.date, race: rest, horse: h };
  }
  throw new ToolError('知らない道具です: ' + name);
}

async function handle(key, m) {
  const ok = (result) => ({ jsonrpc: '2.0', id: m.id, result });
  const err = (code, message) => ({ jsonrpc: '2.0', id: m.id ?? null, error: { code, message } });
  if (m.id === undefined) return null;  // 通知には返さない
  switch (m.method) {
    case 'initialize': {
      const v = m.params && m.params.protocolVersion;
      return ok({ protocolVersion: VERSIONS.includes(v) ? v : VERSIONS[0], capabilities: { tools: { listChanged: false } }, serverInfo: INFO,
        instructions: 'T-AI（競馬の勝つ確率の予測）の会員データを読む道具です。まず get_day_races でその日のレースと race_id を見て、気になるレースは get_race_detail、1頭の内訳は get_horse_index で取ってください。win_prob はT-AIの勝つ確率で、的中を保証するものではありません。' });
    }
    case 'ping': return ok({});
    case 'tools/list': return ok({ tools: TOOLS });
    case 'tools/call': {
      const p = m.params || {};
      if (!TOOLS.some((t) => t.name === p.name)) return err(-32602, '知らない道具です: ' + p.name);
      try {
        const data = await callTool(key, p.name, p.arguments);
        return ok({ content: [{ type: 'text', text: JSON.stringify(data) }], isError: false });
      } catch (e) {
        if (e instanceof ToolError) return ok({ content: [{ type: 'text', text: e.message }], isError: true });
        return ok({ content: [{ type: 'text', text: 'データを取れませんでした。少し待ってからもう一度試してください。' }], isError: true });
      }
    }
    default: return err(-32601, 'Method not found: ' + m.method);
  }
}

const json = (obj, status = 200, extra = {}) => new Response(obj == null ? null : JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS, ...extra } });

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  if (req.method !== 'POST') return json({ jsonrpc: '2.0', id: null, error: { code: -32000, message: 'POST で JSON-RPC を送ってください（この窓口は SSE のストリームを持ちません）。' } }, 405, { Allow: 'POST, OPTIONS' });
  const key = keyOf(req, new URL(req.url));
  if (!key) return json({ jsonrpc: '2.0', id: null, error: { code: -32001, message: 'キーがありません。接続URLの ?key= か Authorization: Bearer に会員のキーを付けてください。' } }, 401, { 'WWW-Authenticate': 'Bearer' });
  let body;
  try { body = await req.json(); } catch (e) { return json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } }, 400); }
  if (Array.isArray(body)) {
    const out = (await Promise.all(body.map((m) => handle(key, m)))).filter(Boolean);
    return out.length ? json(out) : new Response(null, { status: 202, headers: CORS });
  }
  const out = await handle(key, body);
  return out ? json(out) : new Response(null, { status: 202, headers: CORS });
}

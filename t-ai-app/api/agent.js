// AIエージェント用の読み取り窓口。キーは ?key= / Authorization: Bearer / X-API-Key のどれでもよい
//   GET /api/agent?date=2026-11-22[&race=202608050611]
// 中身は Supabase の agent_data()（鍵の確認・会員の期限・回数の上限・記録もそこで行う）。記録を書くので POST で呼ぶ
import { CORS, keyOf, agentData } from './_lib.js';
export const config = { runtime: 'edge' };

// 軽い版（&view=summary）。川崎さんの SUMMARY_VIEW_SPEC.md：形はフル版と同じで、idx を要点だけに絞る（URL読み込み型のAI向け）
const IDX_KEEP = ['fig_last', 'fig_mean_5', 'sf_best3', 'last_finish_pos', 'career_starts', 'career_win_rate_raw', 'career_top3_rate_raw', 'class_win_rate_raw',
  'jockey_win_rate_raw', 'trainer_win_rate_raw', 'jt_win_rate_raw', 'early_pos_mean5', 'gaikyu_name', 'farm_score', 'sire_name'];
function summary(d) {
  d.view = 'summary';
  d.note = (d.note || '') + '。この版は idx を要点だけに絞っている（内訳は view なしで取る）';
  (d.races || []).forEach((r) => (r.horses || []).forEach((h) => {
    if (h.idx) { const x = {}; IDX_KEEP.forEach((k) => { if (h.idx[k] != null) x[k] = h.idx[k]; }); h.idx = x; }
    if (h.pace) h.pace = { style: h.pace.style, adv: h.pace.adv };
  }));
  return d;
}

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });
  const url = new URL(req.url);
  const key = keyOf(req, url);
  if (!key) return new Response(JSON.stringify({ error: 'no key', message: 'キーを ?key= か Authorization: Bearer で付けてください。' }), { status: 401, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });
  const date = url.searchParams.get('date');
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) return new Response(JSON.stringify({ error: 'bad date', message: 'date は YYYY-MM-DD で指定してください。' }), { status: 400, headers: { 'Content-Type': 'application/json; charset=utf-8', ...CORS } });
  let { status, text } = await agentData(key, date, url.searchParams.get('race'));
  if (status === 200 && url.searchParams.get('view') === 'summary') text = JSON.stringify(summary(JSON.parse(text)));
  return new Response(text, { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS } });
}

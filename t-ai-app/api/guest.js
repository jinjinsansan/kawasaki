// ゲスト（ログインなし）用の紙面データ。Supabase の guest_data() を読み、CDN に60秒ためて返す。
// Supabase の応答には Cloudflare のクッキーが付き、そのままでは CDN にためられないので、ここで中身だけ返し直す。
// 読めるのは、データベースの決まりで公開している分（無料公開の午前のレース）だけ。キーは画面と同じ公開用のもの
export const config = { runtime: 'edge' };

const URL = 'https://tpawwkbqwfyohqhvbtui.supabase.co/rest/v1/rpc/guest_data';
const KEY = 'sb_publishable_Ws8k7nsbcxG-9SCbXtzrGQ_lchgKHiZ';

export default async function handler() {
  const r = await fetch(URL, { headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, Accept: 'application/json' } });
  const body = await r.text();
  return new Response(body, {
    status: r.status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=30',
      // 失敗した応答はためない
      'CDN-Cache-Control': r.ok ? 'public, s-maxage=60, stale-while-revalidate=300' : 'no-store',
    },
  });
}

// トップ（/）の出し分け：2026/10/22（木）20:00 JST の公開までは予告ページ、以降は本LP。
// URLは変えずにサーバー側で中身だけ差し替える（Vercel Routing Middleware）。
//   確認用：/?preview=teaser … 予告ページ ／ /?preview=main … 本LP
export const config = { matcher: '/' };

const LAUNCH = Date.parse('2026-10-22T20:00:00+09:00');

export default function middleware(request) {
  const url = new URL(request.url);
  // 旧ドメイン（2week）のトップは 1week へ。トップ以外は vercel.json の redirects が転送する（/ はここが先に処理するため）
  if (url.hostname === '2week.clubkawasaki.net') {
    url.hostname = '1week.clubkawasaki.net';
    return Response.redirect(url.toString(), 307);
  }
  const preview = url.searchParams.get('preview');
  const showTeaser = preview ? preview === 'teaser' : Date.now() < LAUNCH;
  if (showTeaser) {
    return new Response(null, { headers: { 'x-middleware-rewrite': new URL('/teaser', request.url).toString() } });
  }
  return new Response(null, { headers: { 'x-middleware-next': '1' } });
}

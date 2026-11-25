# カワサキクラブ LP

競馬予想クラブ「カワサキクラブ」2026年最終会員募集のランディングページ。
素の HTML / CSS / Vanilla JS による静的サイト（ビルド不要）。

## 構成

```
index.html        LP本体
style.css         スタイル（デザイントークンは :root に集約）
main.js           CTA URL・固定CTAバー・スクロールリビール
tokushoho.html    特定商取引法に基づく表記（/tokushoho）
privacy.html      プライバシーポリシー（/privacy）
assets/           画像（WebP + JPGフォールバック、OGP画像）
favicon.svg / apple-touch-icon.png
vercel.json       cleanUrls・キャッシュ/セキュリティヘッダ
design_handoff_kawasaki_club_lp/   デザイナーからのハンドオフ（デプロイ対象外）
```

## ローカル確認

```
npx serve .
```

## デプロイ（Vercel）

GitHub リポジトリを Vercel に Import → Framework Preset「Other」、Build Command なし、Output Directory はルートのまま。
`main` への push で本番デプロイされます。

## 公開前に差し替えが必要な箇所

- [x] **申込URL**：`main.js` の `CTA_URL`（index.html の `data-cta` リンクにも直接記載）
- [x] **特商法表記**：`tokushoho.html`（販売事業者：合同会社KK企画）
- [x] **プライバシーポリシー**：`privacy.html`（運営責任者・連絡先は過去サイト「AI競馬研究所」に準拠）
- [x] **OGP画像の絶対URL**：`https://www.clubkawasaki.net/assets/og-v3.jpg`（ドメイン変更時は `og:image` / `og:url` / `canonical` を更新）

## 長期会員募集 LP（`member/`）

縦スワイプ型の手記LP（https://member.clubkawasaki.net ・別Vercelプロジェクト、Root Directory を `member`）。申込URLは `member/content.js` の `CTA_URL`。詳細と公開前チェックリストは `docs/member-lp/README.md`。ルートのプロジェクトでは `/member/*` をトップへ転送している。

## 指数システム 体験デモ（`demo/`）

ステップメールから開いてもらう、川崎の「独自指数＆投票システム」の体験デモ（数字はすべて架空のサンプル）。デザインは Claude Design のハンドオフ v4（依頼文 `docs/demo/design-prompt.md`、仕様 `docs/demo/handoff/README.md`）。本番は https://tai.clubkawasaki.net （Vercelプロジェクト `kawasaki-tai`、Root Directory を `demo`、`main` へのプッシュで自動デプロイ。DNSはCloudflareに CNAME `tai` → `b60feeb9f3202246.vercel-dns-016.com`（DNS only）。確認用 https://kawasaki-tai.vercel.app/ ）。ルートのプロジェクトでは `/demo/*` をトップへ転送している。現状と残り作業は `docs/demo/README.md`。

## T-AI 販売LP（`t-ai/`）

川崎の新商品「T-AI」の販売LP（縦スクロール）。https://t-ai.clubkawasaki.net （Vercelプロジェクト `kawasaki-t-ai`、Root Directory を `t-ai`。DNSはCloudflareに CNAME `t-ai` → `cb0c0e3743ddf069.vercel-dns-016.com`（DNS only）。確認用 https://kawasaki-t-ai.vercel.app/ ）。デザインは Claude Design のハンドオフ v4「競馬新聞版（T-AI新報）」（`docs/t-ai-lp/handoff/README.md`）、依頼文と原稿全文 `docs/t-ai-lp/design-prompt.md`、返金保証の条件 `docs/t-ai-lp/refund-terms.md`（11/19 川崎さん確認済み、`t-ai/tokushoho.html` にも同じ文）。

- 申込URL：`t-ai/index.html` の `a[data-cta="member" | "plan-2027" | "plan-6m" | "plan-4m" | "final"]`。いまは `#`（川崎さんからURLが届いたら差し替え）
- 公開時：`t-ai/index.html` の `<meta name="robots" content="noindex">` を外す
- **文言を直したら**：`python -X utf8 docs/t-ai-lp/tools/add_wbr.py` を実行する（日本語の文節の切れ目に `<wbr>` を入れ直す。ページは `word-break: keep-all` なので、これがないと長い行が折り返せない）
- 11/19 直したこと：指が不安定になる原因（画面を固定するスクロール演出・横スワイプ・長押しの文字選択・本文の日本語Webフォント）を避けている。本文の明朝体は端末の明朝体（ヒラギノ・游明朝）を先に使い、ない端末（Android）だけ Webフォント。見出しは文節の切れ目でだけ折り返し、本文は新聞どおり両端そろえ。「T-AI」はハイフンで割らない
- 募集状況（限定30名のカウンター）：川崎さんの指定で 11/19 の時刻ごとに表示を切り替える（〜21:00 残り30名／21:00 17名／22:00 10名／22:30 6名／23:00 3名／23:30 締切まで残り30分／24:00 募集終了の表示。申込ボタンは24:00以降も押せる）。`t-ai/index.html` の最後の script の `SEAT_PLAN`・`LAST_CALL`・`CLOSE`。確認用 `?at=2026-11-19T22:10`。閲覧者の端末の時計で切り替わる
- 共有用画像 `t-ai/ogp.png` は前の黒×金のまま（紙面に合わせるなら作り直し）
- ルートのプロジェクトでは `/t-ai/*` をトップへ転送している

## T-AI 会員サイト プロトタイプ（`t-ai-app/`）

会員が使う画面のプロトタイプ（競馬新聞デザイン「T-AI新報 会員版」）。https://t-ai-app.clubkawasaki.net （Vercelプロジェクト `kawasaki-t-ai-app`、Root Directory を `t-ai-app`。DNSはCloudflareに CNAME `t-ai-app` → `2c7ad3626f115fe5.vercel-dns-016.com`（DNS only）。確認用 https://kawasaki-t-ai-app.vercel.app/ ）。依頼文 `docs/t-ai-app/design-prompt.md`、ハンドオフ `docs/t-ai-app/handoff/README.md`。

- データはすべて架空の見本（`makeSampleData()`）。確率の計算は `CALC` の1か所（Harville法）。本番ではこの2か所を差し替える
- ログインは見本（何を入れても入れる）。noindex
- T-AI のシステム本体（川崎さんから受け取ったZIP）は非公開。このリポジトリ（公開）には入れない

## 2026年 クライマックスプラン LP（`climax/`）

T-AI年間プランのダウンセル（15,000円税抜・12月末まで、ジャパンカップから）。ギラギラ系の縦スクロールLP。公開先（予定）https://climax.clubkawasaki.net （Vercelプロジェクトは未作成。作るときは Root Directory を `climax`）。依頼文と原稿全文 `docs/climax-lp/design-prompt.md`、ハンドオフ `docs/climax-lp/handoff/README.md`。

- 申込URL：`climax/index.html` の `const APPLY_URL = '#';` の1か所（ボタン4つにまとめて入る）
- 公開時：`climax/index.html` の `<meta name="robots" content="noindex">` を外す
- 特商法 `climax/tokushoho.html`：支払方法・提供方法・返品は前回の15,000円プラン（`lp2/tokushoho.html`）と同じ文。提供期間は 2026/11/29〜12/31、募集期間は「一定の人数に達し次第終了」
- ルートのプロジェクトでは `/climax/*` をトップへ転送している

## 究極2ウィーク LP（`lp2/`）

スワイプ型LP（https://1week.clubkawasaki.net ・別Vercelプロジェクト。旧 https://2week.clubkawasaki.net は `lp2/vercel.json` の redirects で 1week へ転送）。Vercel では同じリポジトリを別プロジェクトとして Import し、**Root Directory を `lp2`** に設定する。ルートのプロジェクトでは `vercel.json` の redirects で `/lp2/*` をトップへ転送している（`.vercelignore` に `lp2` を書くと lp2 プロジェクト側でも除外されて404になるので不可）。

- 申込URL：`lp2/main.js` の `CTA_URL`
- 現在の内容：タカシプレゼンツ 決戦の1週間（天皇賞・JBC・BC）（経緯は `docs/2week-launch.md`）
- 募集開始：`lp2/index.html` の `<html data-open-at>`。開始前は申込ボタンが押せず「20:00から受付開始」と表示
- 締切：`lp2/index.html` の `<html data-deadline>`。未設定なら締切カウントダウンを出さず「好評受付中」表示。締切後は表示のみ「募集終了」に切り替わり、CTAは有効のまま
- 参加費：15,000円（税抜）／16,500円（税込）。`lp2/index.html`（ヒーロー・商品内容・申込の3か所）と `lp2/tokushoho.html`
- OGP画像：`lp2/assets/og-v3.jpg`（1200×630）。差し替えるときはファイル名を変える（`/assets/*` は7日キャッシュ、LINE・Xも画像URLで覚えている）

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

## 究極2ウィーク LP（`lp2/`）

スワイプ型LP（https://2week.clubkawasaki.net ・別Vercelプロジェクト）。Vercel では同じリポジトリを別プロジェクトとして Import し、**Root Directory を `lp2`** に設定する。ルートのプロジェクトでは `vercel.json` の redirects で `/lp2/*` をトップへ転送している（`.vercelignore` に `lp2` を書くと lp2 プロジェクト側でも除外されて404になるので不可）。

- 申込URL：`lp2/main.js` の `CTA_URL`
- 現在の内容：タカシプレゼンツ 決戦の1週間（天皇賞・JBC・BC）（経緯は `docs/2week-launch.md`）
- 募集開始：`lp2/index.html` の `<html data-open-at>`。開始前は申込ボタンが押せず「20:00から受付開始」と表示
- 締切：`lp2/index.html` の `<html data-deadline>`。未設定なら締切カウントダウンを出さず「好評受付中」表示。締切後は表示のみ「募集終了」に切り替わり、CTAは有効のまま
- 参加費：15,000円（税抜）／16,500円（税込）。`lp2/index.html`（ヒーロー・商品内容・申込の3か所）と `lp2/tokushoho.html`
- OGP画像：`lp2/assets/og-v3.jpg`（1200×630）。差し替えるときはファイル名を変える（`/assets/*` は7日キャッシュ、LINE・Xも画像URLで覚えている）

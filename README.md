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

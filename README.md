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

- [ ] **申込URL**：`main.js` 冒頭の `CTA_URL` に設定（全CTA共通。空の間は募集要項 `#entry` へスクロール）
- [ ] **特商法表記**：`tokushoho.html` の【要記入】【要確認】箇所
- [ ] **プライバシーポリシー**：`privacy.html` の問い合わせ窓口
- [ ] **OGP画像の絶対URL**：本番ドメイン確定後、`index.html` の `og:image` を `https://<ドメイン>/assets/og.jpg` に変更（SNSは相対パスを解釈しないことがある）

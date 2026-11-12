# 川崎クラブ 長期会員募集LP（`member/`）：制作記録

- 公開予定URL：https://member.clubkawasaki.net/
- Vercel：別プロジェクトとして Import し、**Root Directory を `member`** にする（lp2 と同じやり方）
- デザイン依頼書：`docs/member-lp/design-prompt.md`
- デザイナーのハンドオフ：`docs/member-lp/handoff/README.md`（仕様の詳細はこちら）。共有用画像の元データ `ogp.html` も同じ場所

## 方針
- 主宰者の手記を**最後まで読ませる**ためのLP。手記・エディトリアル調（生成りの紙、墨色の明朝体、金は差し色）
- ハンドオフにはA案（縦スワイプ）とB案（縦スクロール読書型）があったが、**A案（縦スワイプ）だけを採用**（11/12）。B案と読み比べページは入れていない
- 価格表と申込ボタンは、第六章の最後の「扉」を開けるまで出さない（`localStorage.kc_member_unlocked`）

## ファイル
```
member/
  index.html     本体（A案：縦スワイプ）
  a.js           画面の組み立て・スワイプ・扉
  content.js     原稿（一字一句そのまま）・部品・申込URL（CTA_URL）
  shared.css     デザイントークンと部品
  doc.css        特商法・プライバシーポリシー用
  tokushoho.html / privacy.html
  assets/        takashi.jpg、ogp.png（共有用画像 1200×630）
  vercel.json    cleanUrls・キャッシュ・セキュリティヘッダ
```
ルートのプロジェクト（www）では `vercel.json` の redirects で `/member/*` をトップへ転送している。

## 確認用パラメータ
- `/?state=new`：初回の状態に戻す
- `/?state=unlocked`：扉を開けた後（プランが見える）状態

## 公開前にやること
- [ ] 申込URL：`member/content.js` の `CTA_URL`（今は `#`。押しても何も起きない）
- [ ] みやこSの的中画像：`member/assets/` に置き、`content.js` の `miyako()` の `figure.shot` の中を `<img src="assets/miyako.jpg" alt="みやこS 3連単271,010円 的中">` にする
- [ ] 価格の税込・税抜：`content.js` の `.plan-tax` と `member/tokushoho.html` の販売価格
- [ ] 特商法の支払方法・提供方法：前回（lp2）と同じ「銀行振込 → LINEで決済報告 → 会員専用メルマガ」で仮置き。違えば直す
- [ ] 検索除け：確認期間中は全ページ `noindex`。公開時に `member/index.html` の `<meta name="robots" content="noindex">` を外す（特商法・プライバシーは残してよい）
- [ ] Vercelプロジェクト作成（Root Directory：`member`）とドメイン `member.clubkawasaki.net`（DNSはCloudflare、CNAME・DNS only）
- [ ] 本文中の「今週の『エリザベス女王杯』」は公開週によって古くなる（原稿どおり）

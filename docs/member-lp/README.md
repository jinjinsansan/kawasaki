# 川崎クラブ 長期会員募集LP（`member/`）：制作記録

- 公開予定URL：https://member.clubkawasaki.net/
- Vercel：プロジェクト `kawasaki-member`（Root Directory：`member`、GitHub連携・`main` へのプッシュで本番デプロイ）。11/12 作成
  - ドメイン `member.clubkawasaki.net` は追加済み。DNSはCloudflareに CNAME `member` → `f6e7f5a0abf252d7.vercel-dns-016.com`（DNS only）
  - DNS設定前の確認用：https://kawasaki-member.vercel.app/
- デザイン依頼書：`docs/member-lp/design-prompt.md`
- デザイナーのハンドオフ：`docs/member-lp/handoff/README.md`（仕様の詳細はこちら）。共有用画像の元データ `ogp.html` も同じ場所

## 方針
- 主宰者の手記を**最後まで読ませる**ためのLP。手記・エディトリアル調（生成りの紙、墨色の明朝体、金は差し色）
- ハンドオフにはA案（縦スワイプ）とB案（縦スクロール読書型）があったが、**A案（縦スワイプ）だけを採用**（11/12）。B案と読み比べページは入れていない
- 価格表と申込ボタンは、第六章の最後の「扉」を開けるまで出さない（`localStorage.kc_member_unlocked`）

## 挿絵（11/12 追加）
- 「絵 → 文章 → 絵 → 文章」のリズムにするため、川崎さんのアニメ版キャラクターで墨線＋金の挿絵を19枚入れた。章扉8枚（絵＋章タイトル）と、本文中の11枚（1画面まるごと絵）。13〜19は「間延びする」との指摘で追加（依頼文 `shots_ink2.txt`）
- 絵は Codex（ChatGPT ログイン・組み込みの画像生成）で作成。依頼文は `docs/member-lp/art/`（`STYLE_INK.txt`＋`CHARS.txt`＋`shots_ink.txt`、場面の一覧は `PLAN.md`）。手順は anger プロジェクトの `anime/TASK_PC.md` と同じ
- 元のPNG（1024×1536）はローカルの `docs/member-lp/art/img/` にあり、コミットしていない。ページ用は `member/assets/art/01〜19.webp`（900×1350、1枚250KB前後、画面に近づいてから読み込む）
- 描き直すときは、PNGを差し替えて WebP に変換し直す（同じファイル名だと7日キャッシュが残るので、差し替え時は名前を変えるか `?v=2` を付ける）
- 置き場所は `member/content.js`：章扉は各章の `art: '02'`、本文中は `C('art', '01')` の画面

## 文字の演出（11/12 追加）
- 本文の大事な言葉（27か所）を太字にし、画面に入ると金の下線が左から引かれる。`content.js` の本文中で `[[…]]` で囲んだ範囲（文言は変えていない）
- 決め台詞は一文字ずつ現れ、そのあと金のマーカーが引かれる（`a.js` の `splitChars`）
- 数字（成績表の的中数、271,010円、1.75万人・1,500人、比較図の利益）は初めて表示したときに0から数え上がる（`a.js` の `countUp`）
- 動きを減らす設定の端末では、どれも最初から表示した状態になる

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
- [x] Vercelプロジェクト作成とドメイン追加
- [x] CloudflareのDNSにCNAMEを追加（11/12 13:35 https で表示を確認）
- [ ] 本文中の「今週の『エリザベス女王杯』」は公開週によって古くなる（原稿どおり）

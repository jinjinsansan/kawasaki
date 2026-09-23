# Handoff: カワサキクラブ LP（競馬予想クラブ 会員募集ページ）

## Overview
競馬予想クラブ「カワサキクラブ」2026年最終会員募集のランディングページ（1ページ完結・縦スクロール）。
目的：申込ボタン（CTA）へのコンバージョン。限定40名／44,980円（税抜）。

最終デプロイ：GitHub → Vercel（静的サイト）。

## About the Design Files
`design/` 内のファイルは **HTMLで作成したデザインリファレンス**（見た目と挙動のプロトタイプ）です。本番コードとしてそのまま使うものではありません。
`Kawasaki Club LP.dc.html` は独自ランタイム（`support.js`）で動くため、**本番では下記仕様に沿って静的サイトとして再実装**してください。

推奨スタック（既存環境がない場合）：
- **素のHTML + CSS + 少量のVanilla JS**（最軽量・Vercelにそのまま置ける）。または Next.js / Astro の静的出力。
- ページは1枚。フレームワーク不要なら `index.html` / `style.css` / `main.js` / `assets/` 構成で十分。

プレビュー方法：`design/` フォルダをローカルサーバで開く（例 `npx serve design`）→ `Kawasaki Club LP.dc.html`。

## Fidelity
**High-fidelity**。色・タイポ・余白・アニメーションは最終。ピクセル単位で再現してください。

---

## Design Tokens

### Colors
| 用途 | HEX |
|---|---|
| 背景（base） | `#0c0a09` |
| 背景（section alt グラデ上端） | `#140d0b` |
| パネル / カード | `#1a1210` |
| 深いパネル | `#110c0a` / `#0f0b09` |
| フッター背景 | `#080605` |
| カードグラデ | `#1c1411 → #120d0b`（160deg） |
| 本文テキスト | `#f4ede4` |
| サブテキスト | `#d8cdc0` / `#e9dfd3` |
| 補足テキスト | `#b9aea2` |
| フッター文字 | `#9a8f84` |
| ゴールド（メイン） | `#e2b857` |
| ゴールド（明） | `#f5dc92` |
| ゴールド（濃） | `#c9973a` |
| ゴールドボタン上端 | `#f8e2a0` |
| レッド（アクセント） | `#c1121f` |
| レッド（明・◎印） | `#ff4d57` |
| レッド（淡） | `#ff8a90` |
| ディープレッド（背景） | `#7a0c14` / `#5a0a10` / `#3a070b` / `#3a0a0f` |
| 罫線（金茶） | `#3a2a16` / `#4a3519` / `#6b4e22` / `#2a1f12` |
| CTA文字 | `#1a0d05` |

### Gradients
- **ゴールド文字**：`linear-gradient(100deg,#f5dc92 0%,#e2b857 40%,#fff4d2 55%,#c9973a 100%)` + `background-clip:text; color:transparent`
- **ゴールドボタン**：`linear-gradient(180deg,#f8e2a0,#e2b857 55%,#c9973a)`
- **FV背景**：`radial-gradient(120% 90% at 70% 30%,#7a0c14 0%,#3a070b 45%,#0c0a09 100%)` + 斜線 `repeating-linear-gradient(115deg,rgba(226,184,87,.05) 0 2px,transparent 2px 70px)`
- **募集要項背景**：`radial-gradient(100% 80% at 50% 0%,#5a0a10,#0c0a09 75%)`
- **T-AIブロック背景**：`radial-gradient(90% 120% at 0% 0%,#5a0a10,#1a0d0b 70%)`
- **赤マーカー**：`linear-gradient(transparent 62%, rgba(193,18,31,.85) 62%)`（テキスト背景）

### Typography（Google Fonts）
```
https://fonts.googleapis.com/css2?family=Shippori+Mincho+B1:wght@600;800&family=Zen+Kaku+Gothic+New:wght@400;500;700;900&family=Oswald:wght@500;700&display=swap
```
- 見出し：**Shippori Mincho B1** 800
- 本文・UI：**Zen Kaku Gothic New** 400/500/700/900、本文 line-height 1.9
- 英字ラベル・数字：**Oswald** 500/700（ラベルは 13px / letter-spacing .4em / `#e2b857`）

| 要素 | サイズ |
|---|---|
| H1（FV） | `clamp(27px,5.6vw,64px)` / lh 1.3 |
| H2（各セクション） | `clamp(22–23px,4vw,44px)` / lh 1.4–1.45 |
| H2（About） | `clamp(21px,3.4vw,38px)` |
| H3（カード） | `clamp(20px,2.4vw,26px)` 900 |
| 本文 | 16px（ブラウザ既定） |
| 注記 | 12–14px |
| T-AIロゴ文字 | Oswald 700 `clamp(56px,9vw,96px)` |

### Spacing / Radius / Shadow
- セクション上下 padding：96px（FV 110/80、Mindset・Closing 110/120）
- 左右 padding：`clamp(16px,4vw,48px)`
- コンテナ max-width：1180px（FV・実績）/ 1080px（その他）/ 820px（Mindset）/ 720px（募集要項）
- Radius：カード 8px / パネル 6px / 大パネル 10–12px / ピル 999px
- Shadow：浮遊カード `0 24px 50px rgba(0,0,0,.6)`、中央カード `0 30px 70px rgba(0,0,0,.7)`、募集要項 `0 0 80px rgba(226,184,87,.15)`、Closing画像 `0 30px 80px rgba(193,18,31,.35)`

---

## Screens / Sections（上から順）

### Header（absolute, FV上に重ねる）
- 左：「カワサキクラブ」Shippori 800 20px `#f5dc92` ls .12em ＋「KAWASAKI CLUB」Oswald 11px ls .3em `#b9aea2`
- 右：「参加する」ピルボタン（bg `#e2b857`, 文字 `#0c0a09` 13px 700, padding 8×16）→ CTA URL

### 01 FV
- 2カラムグリッド `repeat(auto-fit,minmax(min(100%,440px),1fr))` gap 48、モバイルで1列（テキスト→画像）
- バッジ：「今年最後の会員募集」（金ベタ）／「限定40名」（金枠）
- H1：「一切の無駄を排除した、<br>**真に勝てる**競馬クラブ。」（「真に勝てる」はゴールドグラデ文字）
- サブ：「絶好調の波に乗るなら、今しかない。<br>独自の減点式AI「T-AI」で、的中のためのすべてを分析し尽くす。」
- CTA：「カワサキクラブに参加する →」ゴールドボタン（padding 18×32, radius 6, 900）＋ pulseアニメ
- CTA下：「参加費 44,980円（税抜）／ 今年度の募集は今回のみ」13px `#b9aea2`
- 右ビジュアル（aspect 1/1.02, max 560px）：アニメ画像3枚を重ねて浮遊
  - 背面左：`visual-a.jpg` 幅48% top18% rotate -9°（floatA 6s）
  - 背面右：`visual-b.jpg` 幅48% top22% rotate 8°（floatB 7s）
  - 前面中央：`tai-max.jpg` 幅60% top0（floatC 5.5s）枠 3px `#f5dc92`
  - 各カードにホロ光沢オーバーレイ（sheen）、背後に金の円形グロー（glow 4s）

### 02 実績（RESULTS）
- 見出し：「論より証拠。<br>直近の的中実績をご覧ください。」
- リード：「直近の絶好調は、決して不正などではありません。ロジック的に本当に好調な時期に入っているからです。すでに会員様がいるため、結果を誤魔化すことは一切できません。」
- カードグリッド `repeat(auto-fill,minmax(min(100%,260px),1fr))` gap 16。**カード全体がXポストへのリンク**（別タブ）
  - 上段：タグピル（会員様的中 / X先出し）＋右に「HIT」
  - レース名 Shippori 800 24px
  - 印 ◎/○（`#ff4d57`）＋馬名 17px 700
  - 特記（任意）Oswald 700 26px `#f5dc92`
  - 下：**Xボタン**（黒 `#000` / 枠 `#4a4a4a` / ピル / Xロゴ白 + 「ポストを見る」14px 700）
  - hover：translateY(-4px)、border `#e2b857`

| レース | タグ | 印 | 特記 | URL |
|---|---|---|---|---|
| 神戸新聞杯 | 会員様的中 | ◎ロブチェン ○アルトラムス | 一点的中 | https://x.com/VVkeibaVV/status/2101929352804147577 |
| オールカマー | 会員様的中 | ◎メイショウゲキリン | – | https://x.com/aaand53ra/status/2101576867350528364 |
| セントライト記念 | X先出し | ◎ジャスティンシカゴ | 単勝 50.6倍 | https://x.com/VVkeibaVV/status/2099024198081581067 |
| ローズステークス | X先出し | ◎モンローウォーク | – | https://x.com/VVkeibaVV/status/2099021478499094597 |
| CBC賞 | X先出し | ◎フロムダスク | – | https://x.com/VVkeibaVV/status/2086338729300627663 |
| レパードS | X先出し | ◎パイロマンサー | – | https://x.com/VVkeibaVV/status/2086338641295778246 |
| 小倉記念 | X先出し | ◎ジョバンニ | – | https://x.com/VVkeibaVV/status/2078721978106876023 |

- 透明性ボックス（破線枠 `#6b4e22`）：「賛否両論あるかもしれませんが、目立つ前から**「当てても外しても」**馬券の証拠を出してきたのが事実です。実際に外した例も隠さず公開しています。」＋「外した例を見る →」→ https://x.com/VVkeibaVV/status/2091415749382561835

> 任意：X公式埋め込み（`platform.twitter.com/widgets.js`）に差し替え可。ただし表示速度が落ちるため、現状のカード＋リンクを推奨。

### 03 カワサキクラブとは（ABOUT）
- 2カラム（写真 / テキスト）`minmax(min(100%,380px),1fr)` gap 56
- 写真：`takashi.jpg` 正方形、金1px枠＋内側 padding 8px（bg `#0f0b09`）、max 440px。下に「かわさき たかし」Shippori 800 22px ／「カワサキクラブ主宰」13px
- H2：「家賃すら払えなかった私が、<br>本気で人生で勝つために作ったクラブ。」
- 本文 → 強調文（赤マーカー）「**「あとは運だけ」と言い切れるレベル**まで、<br>あなたは分析できているでしょうか？」
- 比較3行（パネル）：スポーツ／仕事／**競馬では？**（最後のみ bg `#3a0a0f` 枠 `#c1121f` ラベル `#ff8a90`）
- **T-AIブロック**（幅1080、上マージン72）：左「METHOD / T-AI（ゴールドグラデ大）/ 減点式AI」、右に説明2段落
- 文言は `design/Kawasaki Club LP.dc.html` を正とする

### 04 マインドセット（MINDSET）
- 背景に巨大透かし文字「人生」（Shippori 800, `clamp(200px,34vw,460px)`, rgba(226,184,87,.05)）右寄せ・装飾のみ
- H2：「競馬はただの趣味ですか？<br>いいえ、**あなたの人生そのもの**です。」（強調 `#ff4d57`）
- 掛け合いブロック（上下罫線）：「何で稼ぎましたか？」（`#b9aea2`）／「競馬で稼ぎました」（`#f5dc92`）／「それでいいじゃないですか。」
- 締め：「今年度の募集は「今回のみ」」を金で強調

### 05 提供内容（CONTENTS）＋ 特典（BONUS）
- 2カラムカード（bg `#1a1210`, 上ボーダー4px）
  - 01（金）「メインプラン」タグ／2026年 JRA G1 全レース予想（本文に金太字「投票数が集中するG1は、T-AIがもっとも分析しやすい得意分野です。」を含む）
  - 02（赤）2026年 JRA 重賞 全レース予想 ＋ 注意ボックス
- 特典カード（金1px枠＋金の淡グラデ）
  - 特典1：Takashi200 平場予想の配信（以前49,800円）
  - 特典2：カワサキクラブ2027 会員継続権利

### 06 募集要項（ENTRY）
- 中央パネル max 720、金2px枠、glow shadow
- 定義リスト（2列グリッド・下罫線）：募集人数 限定**40**名／参加費用 **44,980**円（税抜）／募集期間 今年度最終募集（今回のみ）／対象期間 有馬記念まで
- CTA：「今すぐ参加を申し込む →」全幅ゴールドボタン＋pulse

### 07 最後に（MESSAGE）
- 2カラム（テキスト / `tai-max.jpg` を rotate 2°、金3px枠、sheen）
- H2：「有馬記念まで、<br>私があなたの味方です。」
- 強調：「この金額は**「覚悟の金額」**です。」（赤マーカー）
- 「参加するか、しないか。<br>これが人生の分かれ目です。」（Shippori 金）
- CTA：「覚悟を決めて参加する →」＋「限定40名 ／ 44,980円（税抜）」

### Footer
- リンク：特定商取引法に基づく表記（`#tokushoho`）／プライバシーポリシー（`#privacy`）→ **URL要差し替え**
- 注記：「※掲載の実績は過去の結果であり、将来の的中や利益を保証するものではありません。馬券の購入は20歳以上、ご自身の判断と責任でお願いいたします。」
- © 2026 カワサキクラブ
- 下 padding 120px（固定CTAと重ならないため）

### 固定CTAバー（Sticky）
- `position:fixed; bottom:0` 全幅、bg `rgba(12,10,9,.92)` + `backdrop-filter:blur(8px)`、上罫線 `#6b4e22`
- 左「残りわずか / 限定40名」、右ゴールドボタン「カワサキクラブに参加する →」（max 360px）
- `scrollY > 700` で表示：`translateY(110%) → 0`、transition .35s ease
- iOS safe-area：`padding-bottom: calc(10px + env(safe-area-inset-bottom))`

---

## Interactions & Behavior

### CTA
全CTA（Header / FV / 募集要項 / Closing / Sticky）は同一URL。**現在は仮 `#entry`。本番の申込URLに差し替え**（環境変数 or 定数1箇所で管理）。

### アニメーション（CSS @keyframes）
```css
@keyframes floatA{0%,100%{transform:translate(0,0) rotate(-9deg)}50%{transform:translate(0,-14px) rotate(-7deg)}}
@keyframes floatB{0%,100%{transform:translate(0,0) rotate(8deg)}50%{transform:translate(0,-10px) rotate(10deg)}}
@keyframes floatC{0%,100%{transform:translate(-50%,0) rotate(-1deg)}50%{transform:translate(-50%,-18px) rotate(1deg)}}
@keyframes sheen{0%{background-position:-150% 0}60%,100%{background-position:250% 0}}
@keyframes pulse{0%,100%{box-shadow:0 0 0 0 rgba(226,184,87,.55)}50%{box-shadow:0 0 0 14px rgba(226,184,87,0)}}
@keyframes glow{0%,100%{opacity:.55}50%{opacity:1}}
```
- sheen オーバーレイ：`linear-gradient(105deg,transparent 35%,rgba(255,255,255,.45) 48%,rgba(160,220,255,.25) 52%,transparent 65%)`, `background-size:250% 100%`, 5s ease-in-out infinite（カードごとに delay 0 / 1s / 2.5s）
- CTA pulse：2.4s infinite
- **スクロールリビール**：`[data-reveal]` 要素を IntersectionObserver（threshold .12, rootMargin `0px 0px -40px 0px`）で監視。初期 `opacity:0; translate:0 28px` → 表示時 `opacity:1; translate:0 0`、`.8s cubic-bezier(.2,.7,.2,1)`、兄弟間 delay `(index%4)*70ms`。初期表示範囲内の要素はアニメさせない。
- `prefers-reduced-motion: reduce` の場合は浮遊・sheen・pulse・リビールを無効化すること（推奨）。

### Responsive
- 全グリッドは `auto-fit/auto-fill + minmax(min(100%,Xpx),1fr)` で自動1列化。メディアクエリ不要。
- 見出しは `clamp()` で流体。375px幅でH1が1行11文字収まる最小値に設定済み。
- 確認幅：375 / 390 / 768 / 1280 / 1440。

## State Management
- `scrolled: boolean`（scrollY > 700）→ 固定CTAの表示
- それ以外は静的

## Assets（`design/assets/`）
| ファイル | 内容 | 使用箇所 |
|---|---|---|
| `takashi.jpg` | 主宰者 実写ポートレート（399×399） | ABOUT |
| `tai-max.jpg` | アニメ調「T-AI指数MAX」バナー | FV中央 / Closing |
| `visual-a.jpg` | アニメ調「指数MAX勝負 単勝一択」 | FV背面左 |
| `visual-b.jpg` | アニメ調「相手4頭厳選勝負」 | FV背面右 |
- アニメ画像はクライアント提供（生成AI作成）。本番では WebP 変換・`loading="lazy"`（FV以外）推奨。
- Xロゴは inline SVG（`design/Kawasaki Club LP.dc.html` 内）。

## 本番実装チェックリスト
- [ ] CTA URL 差し替え
- [ ] 特商法・プライバシーポリシーページ作成＆リンク
- [ ] `<title>` / meta description / OGP（og:image は `tai-max.jpg` 推奨）/ favicon
- [ ] 画像最適化（WebP, width/height 指定）
- [ ] prefers-reduced-motion 対応
- [ ] GitHub push → Vercel デプロイ（静的：Framework Preset「Other」、Output はルート）

## Files
- `design/Kawasaki Club LP.dc.html` — デザイン本体（全文言・スタイルの正）
- `design/support.js` — プレビュー用ランタイム（本番不要）
- `design/assets/*` — 画像素材

/* 川崎クラブ 長期会員募集LP：原稿データと共通部品（A・B共通）
   原稿は docs/member-lp/design-prompt.md の全文を一字一句そのまま使用。
   画面（A案）の区切り＝screens の配列。B案は同じ配列を連続して流し込む。 */
(function () {
  const CTA_URL = '#';                       // 申込URL（全プラン共通）
  const LINE_URL = 'https://lin.ee/uDgbNni'; // お問い合わせ
  const X_URL = 'https://x.com/VVkeibaVV/status/2103655594536431987';
  const KEY_UNLOCK = 'kc_member_unlocked';
  const MIYAKO_IMG = '';                     // みやこSの的中画像（届いたら assets/proof/ に置いてパスを入れる。空なら枠ごと出さない）

  const P = (p) => ({ p });
  const K = (a, m, b) => ({ key: [a, m, b] });
  const R = (n, t) => ({ reason: [n, t] });
  const C = (c, i) => ({ c, i });

  const CH = [
    { n: 0, title: '序', screens: [
      [C('cover')],
      [C('miyako')],
      [P('この実績を自慢したいのではありません。')],
      [C('art', '01')],
      [K('私が言いたいこと。それは「', '競馬は人生である', '」ということです。')],
      [P('皆さんは趣味や娯楽程度に捉えていますが、果たしてそうでしょうか？'), P('人間は、多くの行動をお金を稼ぐことに時間を費やしています。何もない日常では何も感じないと思いますが、')],
      [K('', '人間に平等なのは「命」だけです。', '')],
    ]},
    { n: 1, art: '02', title: '大病を患ったからこそ分かること', screens: [
      [P('初めて公表します。\n私は昨年末に、糖尿病からくる合併症で入院をしていました。ここでは詳しい病名を公表するのは控えさせてください。'), P('普通の仕事ができなくなりました。\nそれでも、私は別に困りませんでした。[[「競馬で稼いでいけるノウハウ」]]があったからです。お金は何とかなるだろうと思っていました。')],
      [P('ただ、その病棟で思うことがありました。')],
      [K('1つは「', '人間はいつ死ぬか分からないし、やりたいことをやるべきだ', '」ということです。')],
      [C('art', '13')],
      [P('私は以前にも話した通り、競馬で人生を大きく変えた人間です。競馬がなければ、ここでこういう配信すらしていない、何もない人間です。ある意味、場所や健康状態に囚われずとも仕事として競馬ができるので困らないなと。\nただ、同じ病棟で過ごす人たちや同年代の人が、もし私と同じような状況になったら、何もできなくなってしまう人が多いのではないか？と考えました。')],
      [P('そして初めて[[「残された時間」]]について考えるようになりました。'), P('今まで漫然と永遠の命のように考えて、一生これが続くと考えていた私。\n「時が進むのは早いな」とか言いつつ、まだ若いと思っていた私。\nそんな私にも終わりが来ること、そしてそれはいつ起こるか分からないということ。')],
      [C('art', '03')],
      [P('日々流されながら自分の時間は止まっていても、あっという間に世の中は時が進んでいて。\n子供の頃見ていたアイドルはいつの間にか50代になり、大人に見えた高校球児はいつの間にか何個も下の子供になり、若手騎手で上手いと言われていた川田や浜中はベテランと言われるようになり、[[時は進むのが非常に早いな]]と痛感しました。')],
    ]},
    { n: 2, art: '04', title: '病院で覚えたSNSへの強烈な嫌悪感と「やりたいこと」', screens: [
      [P('やりたいことをやるべきだと思いつつ、やりたいことなんて日々の日常で固定化されているし、特に見つからない。\nでもひとつ、強烈に嫌悪感を覚えたものがありました。'), P('それは「SNS」です。きっかけは病院でした。')],
      [P('普段SNSをやらなかった私は、暇な時間に初めてSNSをじっくり見ました。\nそこでは、ありもしない儲け話や、何と言いますか治安の悪さ、人の揚げ足取り、逆に賞賛など、様々な人の本音がぶつかっているなと笑いながら見られたものもありました。')],
      [P('しかし、一番許せなかったのは「競馬に関すること」です。\n競馬予想に関して、[[真実の配信をしている人がひとりもいなかった]]のです。'), P('皆さんが何を信じるかは分かりませんが、何度も言います。')],
      [C('art', '05')],
      [K('', '競馬って「予想したら負け」なんです。', ''), K('', '必要なのは「期待値計測とベットコントロール」だけなんです。', '')],
      [P('それをSNSでは、「これが穴だー」とか「これが不利あったから買い」とか「過去の傾向、自信あります！」とか。\nなんだこれはと。私からするとあり得ない、ありもしないようなことがまかり通っていて、競馬で生活する身分として非常に憤りを感じました。[[多くの人が騙されているだろうな]]と。')],
      [C('art', '15')],
      [P('そこで、やりたいことが見つかりました。'), P('私がやりたいことは「多くの人を勝たせる」とか綺麗事ではありません。\n私と同じような状況になったときに、場所にも環境にも囚われず、時間を大切にできる、お金をどこでも稼げる状況を作ってあげたいなと思ったのもあります。')],
      [P('それ以上に、[[「競馬で勝つには予想じゃない」]]ということを世間に分かってもらいたい。本当の勝ち方を配信していきたい。そう思ったのです。ひとつの自己顕示欲でしょう。')],
      [C('art', '14')],
      [P('私は実は、アカウントを作ったのは2026年の1月なんです。まだ1年経っていないんです。\nそれでもこの思いが通じたのか、[[フォロワーは1.75万人に増え、会員数は1,500人を超えました]]。'), C('numbers')],
      [P('特に好評をいただいているのが、実は重賞ではなく「平場」で、多くの人に[[「収支が安定するようになった」]]と言われています。'), C('x')],
    ]},
    { n: 3, art: '06', title: 'なぜ圧倒的な結果が出るのか？3つの理由', screens: [
      [P('実績の自慢をしても仕方ありません。なぜ結果が出るのか？それには大きく3つの理由があります。')],
      [R(1, '「買わないこと」を徹底している'), P('多くの予想家や情報配信者は、重賞のたびに「自信ある」と言います。そんなことは絶対に無理です。基本的に毎週のように自信があったら、そりゃもう全知全能です。自信があるんじゃなく、狂言回しです。')],
      [C('art', '07')],
      [P('そうではなく、[[私の場合は「買わないこと」を徹底しています]]。クレームが来ようと、配信のない日は配信をしない。G1だろうと見解を出さない。重賞だろうと買わない。[[やらないことを徹底しています]]。')],
      [R(2, '配当レンジを最初から設定する'), P('多くの人は「来る馬」や「来た後に何倍になるか」を考えますが、思考が違います。私の場合は[[「配当レンジ」しか見ません]]。合成オッズで何倍で、いくら投資するか？')],
      [C('art', '16')],
      [P('たとえば「3.5倍の馬を買おう」ではなく、[[「このレースでは3.5倍にする」と最初から設定してしまいます]]。3.5倍の配当を得るのに、50%の確率で得られるなら、これは期待値的に「買い」ですよね？分かりますか？[[これを淡々と繰り返すのです]]。')],
      [R(3, '6年間負けなしのデータと独自AI「<span class="tai">T-AI</span>」'), P('私は「T-AI」という投票数解析AIを使います。この投票数解析AIは、他の人がどれほどデータだなんだと個人開発で作ろうが何をしようが絶対に作れません。')],
      [C('art', '17')],
      [P('モデルにしたのは香港競馬で稼ぐ人や、ブックメーカーのオッズ構築システムの根幹で、[[「正確なWin%（勝率）の計測」と「投票数のズレ込み」]]、ここを数学的にモデル化しているのです。')],
      [P('特にこの投票数解析が重要で、私の会員様は分かると思うのですが、私は原則[[「前日から予想を出すことはない」]]んです。これが最大のヒントです。'), P('この投票数解析AIを使い、[[6年間プラスを叩き出しています]]。本当か嘘か、それはこのフォロワー数の増加が物語っているでしょう。')],
    ]},
    { n: 4, art: '08', title: '「そんなに儲かるなら自分で買えよ党」の人へ', warn: true, screens: [
      [P('こういう配信をすると、必ずひとりは現れます。私は[[「計算ができない人」]]だと思っています。')],
      [P('仮に100万円の投資金があります。2.0倍の馬を買います。これをそのまま買っても払戻は200万円、利益は100万円です。\n一方、予想を売って200万円の投資金になりました。オッズが1.9倍になりました。200万円投入したら払戻は380万円、[[利益額は180万円です]]（元本差し引き後も圧倒的に手元に残ります）。')],
      [C('compare')],
      [P('私は善人面したくないので「多くの人を救いたい」とか言いません。利益額面で見ても、自分で買うよりも、この配信をしたほうが私へのメリットも大きいです。')],
      [C('art', '18')],
      [P('また、さすがに私もバカではなく投票数を分析するAIを使っていますので、[[オッズに致命的な影響を及ぼすレベルでは会員様を募集していません]]。\nその証拠として、地方競馬も実は投票数解析で儲けることは容易なのですが、会員様を含めて売上（投票数）のあるダートグレード競走（DG競走）以外は配信を全くしていません。')],
    ]},
    { n: 5, art: '09', title: '追伸：価値観の合わない方へ', screens: [
      [P('あと、そういうことを言う人は、なぜ私のこのページを見たり、私のXを読んでいるのでしょうか？\n「自分で予想しろ」とか「自分が買えよ」と言うなら、この私の文章を読む時間すら無駄なはずです。')],
      [P('先ほども言いましたが、人生何があるか分かりません。いつ終わりが来るか分からないのに、分かり合えない人に使うほど無駄な時間はありません。\n私とは価値観が違うと思いますし、[[ご自身の時間を無駄にされないようお願いします]]。')],
    ]},
    { n: 6, art: '10', title: '川崎タカシに賭けたいという方へ', screens: [
      [P('ここまで長い文章を読んでいただき、ありがとうございました。'), P('皆さんは今週の「エリザベス女王杯」のことしか興味がないと思いますが、私はそういう単発的なレース予想には、やはり何度考えても否定的です。')],
      [C('eriza')],
      [P('競馬は楽をしては勝てないのですが、楽をしてその場のお金が欲しい人がやっているのも分かります。今週だけ勝てればいい人、なんならその1レースだけ勝てればいい人も多いのも分かります。')],
      [C('art', '19')],
      [P('でも、考えてみてください。[[それで本当にお金は増えていますか？]]\n[[今週勝っても、翌週で溶かしていませんか？]]今だけ良くても、後で苦しみませんか？'), P('「同じことのルーティン」になっていませんか？ということです。')],
      [P('大切なことなので何度も言います。')],
      [K('', 'どうせ繰り返すなら、【勝ち続けるルーティン】にしよう', '、ということです。')],
      [P('正直、エリザベス女王杯を単体で販売することや、情報を公開することも考えましたが、私のポリシーに反します。\n私は[[「勝ち続ける人」を増やしたい]]。そして[[「人生を変えるんだ」という覚悟を持った人にだけ接したい]]ので、今回はそういう単発の配信を一切やめてみます。')],
      [K('', '分かる人、この文章を読んで分かり合えた人だけ、ついてきてください。', '')],
      [C('door')],
    ]},
    { n: 7, art: '11', title: '「川崎クラブ」特別募集プラン一覧', locked: true, screens: [
      [P('[[「点」ではなく「線」で勝ち続ける]]ための、3つの長期プランを用意しました。ご自身の覚悟と投資スタイルに合わせて選択してください。'), C('note')],
      [C('plan', 0)],
      [C('plan', 1)],
      [C('plan', 2)],
    ]},
    { n: 8, art: '12', title: '最後に：決断するのは「今」しかない', locked: true, screens: [
      [P('先ほども書いた通り、投票数解析AI「T-AI」の精度とオッズの優位性を守るため、参加枠には厳格な上限を設けています。[[定員に達した瞬間、予告なく募集を完全に打ち切ります]]。'), P('来年の今頃も、SNSの適当な予想に振り回されて「あの時買っておけば…」と後悔する日々を続けるのか。\nそれとも今日この瞬間から「予想」を捨て、圧倒的な期待値と数字を味方につけて「勝ち続ける側」へと足を踏み入れるのか。')],
      [P('[[時間は有限であり、人生を変えるチャンスは何度も巡ってはきません。]]\n本気で現状を打破したいと願うあなたの参加を、「川崎クラブ」でお待ちしています。'), C('sign')],
      [C('cta'), C('footer')],
    ]},
  ];

  const COMMON = ['G1全配信', '地方競馬・通常配信レース', '地方競馬・会員独占配信レース（週2鞍程度）', 'JRA・会員独占配信レース（週1鞍程度）', 'JRA・note配信レース全レース'];
  const PLANS = [
    { no: 1, name: '2027年末までの完全制覇プラン', price: '149,800', top: true },
    { no: 2, name: '2027年 日本ダービーまでの半年プラン', price: '98,000' },
    { no: 3, name: '2026年 年末駆け込みプラン', price: '49,800' },
  ];
  const KANJI = ['序', '一', '二', '三', '四', '五', '六', '七', '八'];

  const br = (s) => s.replace(/\n/g, '<br>');
  const X_SVG = '<svg viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>';

  const store = {
    get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
    del: (k) => { try { localStorage.removeItem(k); } catch (e) {} },
  };

  const KC = {
    CH, PLANS, KANJI, CTA_URL, mode: 'a',
    unlocked: () => store.get(KEY_UNLOCK) === '1',
    store,
    onUnlock: null, goto: null, resumeAvailable: () => false,
  };

  // 確認用：?state=unlocked（読了後の状態）／?state=new（初回の状態に戻す）
  KC.applyQuery = (posKey) => {
    const s = new URLSearchParams(location.search).get('state');
    if (s === 'unlocked') store.set(KEY_UNLOCK, '1');
    if (s === 'new') { store.del(KEY_UNLOCK); store.del(posKey); }
  };

  // 読了目安（本文の文字数 ÷ 500字/分）
  KC.chars = (filter) => CH.filter(filter || (() => true)).reduce((n, ch) =>
    n + ch.screens.flat().reduce((m, b) => m + (b.p ? b.p.replace(/\[\[|\]\]/g, '').length : b.key ? b.key.join('').length : 0), 0), 0);
  KC.minutes = (chars) => Math.max(1, Math.round(chars / 500));

  const comp = {
    cover() {
      const cue = KC.mode === 'a'
        ? '<span class="cue-arrow" aria-hidden="true"></span><span>上へスワイプして読む</span>'
        : '<span>スクロールして読む</span><span class="cue-line" aria-hidden="true"></span>';
      return `<div class="cover">
  <figure class="cover-portrait"><img src="assets/takashi.jpg" alt="川崎タカシ" width="399" height="399"></figure>
  <p class="cover-mark" aria-hidden="true"><span></span>KAWASAKI CLUB<span></span></p>
  <h1 class="cover-title"><small>圧倒的成果を上げる</small><span>「川崎クラブ」</span></h1>
  <div class="record" role="table" aria-label="直近の有料配信成績">
    <div class="record-row" role="row"><span class="rec-date" role="cell">2026/11/07</span><span class="rec-kind" role="cell">有料配信</span><span class="rec-val" role="cell"><b>9</b>戦<b>7</b>的中</span></div>
    <div class="record-row" role="row"><span class="rec-date" role="cell">2026/11/08</span><span class="rec-kind" role="cell">有料配信</span><span class="rec-val" role="cell"><b>8</b>戦<b>6</b>的中</span></div>
  </div>
  <div class="resume" data-resume hidden>
    <button type="button" class="resume-btn" data-go="resume">続きから読む</button>
    <button type="button" class="resume-btn resume-btn--gold" data-go="plans">プランを見る</button>
  </div>
  <p class="cue">${cue}<span class="cue-time">読了まで約${KC.minutes(KC.chars())}分</span></p>
</div>`;
    },
    miyako() {
      return `<div class="miyako">
  <p class="miyako-race">みやこS</p>
  <dl class="miyako-rows">
    <div><dt>無料配信</dt><dd>◎ロードクロンヌ</dd></div>
    <div class="is-paid"><dt>有料配信</dt><dd>3連単 <b class="num">271,010</b>円的中<small>（3連単16点）</small></dd></div>
  </dl>
  ${MIYAKO_IMG ? `<figure class="shot" data-slot="miyako-hit"><img src="${MIYAKO_IMG}" alt="みやこS 的中画像" loading="lazy"></figure>` : ''}
</div>`;
    },
    eriza() {
      return `<div class="miyako miyako--eriza">
  <p class="miyako-race">2025 エリザベス女王杯</p>
  <dl class="miyako-rows">
    <div><dt>買い目</dt><dd>3連単 07→01→12</dd></div>
    <div class="is-paid"><dt>払戻</dt><dd><b class="num">493,600</b>円的中<small>（2点・購入4,000円）</small></dd></div>
  </dl>
  <figure class="shot shot--receipt"><img src="assets/proof/eriza2025.webp" alt="2025年エリザベス女王杯 京都11R 3連単07→01→12 的中、払戻金額493,600円の照会画面" width="736" height="753" loading="lazy"></figure>
</div>`;
    },
    numbers() {
      return `<dl class="nums">
  <div><dt>フォロワー</dt><dd><b>1.75</b>万人</dd></div>
  <div><dt>会員</dt><dd><b>1,500</b>人超</dd></div>
  <div><dt>アカウント開設</dt><dd><b>2026</b>年<b>1</b>月</dd></div>
</dl>`;
    },
    x() {
      return `<figure class="xpost">
  <div class="xpost-clip">
    <blockquote class="twitter-tweet" data-lang="ja" data-dnt="true" data-conversation="none"><a href="${X_URL}">Xの投稿を見る</a></blockquote>
  </div>
  <figcaption>${X_SVG}<span>タップでXの投稿を開く</span></figcaption>
  <a class="xpost-link" href="${X_URL}" target="_blank" rel="noopener" aria-label="平場の実績の投稿をXで開く"></a>
</figure>`;
    },
    compare() {
      const col = (cls, lbl, inv, odds, pay, profit, w) => `<div class="cmp ${cls}">
    <p class="cmp-label">${lbl}</p>
    <dl><div><dt>投資金</dt><dd>${inv}<small>万円</small></dd></div><div><dt>オッズ</dt><dd>${odds}<small>倍</small></dd></div><div><dt>払戻</dt><dd>${pay}<small>万円</small></dd></div></dl>
    <p class="cmp-profit"><span>利益</span><b>${profit}</b><small>万円</small></p>
    <span class="cmp-bar"><i style="--w:${w}"></i></span>
  </div>`;
      return `<figure class="compare">${col('', 'そのまま買う', '100', '2.0', '200', '100', '55.6%')}${col('is-win', '予想を売って', '200', '1.9', '380', '180', '100%')}</figure>`;
    },
    note() { return '<p class="plans-note">定員に達した時点で、予告なく募集を締め切ります</p>'; },
    plan(i) {
      const p = PLANS[i];
      const items = COMMON.map((t, k) => `<li><span class="pl-n">${k + 1}</span><span>${t}</span></li>`).join('') +
        (p.top ? '<li class="is-extra"><span class="pl-n">6</span><span>海外競馬配信</span><small>（※本プラン限定特典）</small></li>' : '');
      return `<article class="plan${p.top ? ' is-top' : ''}">
  <p class="plan-no"><span>${p.no}</span></p>
  <h3 class="plan-name">${p.name}</h3>
  <p class="plan-price"><span class="plan-price-lbl">料金</span><b>${p.price}</b><span class="plan-yen">円</span><span class="plan-tax" data-tax></span></p>
  <p class="plan-lbl">【配信内容】</p>
  <ol class="plan-list">${items}</ol>
  <a class="btn${p.top ? '' : ' btn--line'}" href="${CTA_URL}" data-cta>このプランで参加する</a>
</article>`;
    },
    art(id) { return KC.artImg(id, 'art'); },
    sign() { return '<p class="sign">川崎タカシ</p>'; },
    cta() { return `<a class="btn btn--lg" href="${CTA_URL}" data-cta>川崎クラブに参加する</a>`; },
    footer() {
      return `<footer class="foot">
  <nav><a href="/tokushoho">特定商取引法に基づく表記</a><a href="/privacy">プライバシーポリシー</a><a href="${LINE_URL}" target="_blank" rel="noopener">お問い合わせ（LINE）</a></nav>
  <p>© カワサキクラブ</p>
</footer>`;
    },
    door() {
      const open = KC.unlocked();
      return `<div class="door${open ? ' is-open' : ''}" data-door>
  <div class="door-frame" aria-hidden="true">
    <div class="door-light"><span>第七章</span><span>第八章</span></div>
    <div class="door-leaf door-leaf--l"><i></i></div>
    <div class="door-leaf door-leaf--r"><i></i></div>
  </div>
  <button type="button" class="door-btn" data-door-btn>${open ? 'プラン一覧へ進む' : '分かり合えた方だけ、扉をお開けください'}</button>
</div>`;
    },
  };

  // 挿絵（Codexで作成・墨線＋金）。紙の色に溶け込むよう multiply で重ねる
  KC.artImg = (id, cls) => `<figure class="${cls}"><img src="assets/art/${id}.webp" alt="" width="900" height="1350" loading="lazy" decoding="async"></figure>`;

  KC.block = (b) => {
    if (b.p != null) return `<p class="tx">${br(b.p).replace(/\[\[(.+?)\]\]/g, '<strong class="em">$1</strong>')}</p>`;
    if (b.key) return `<p class="key">${b.key[0]}<mark>${b.key[1]}</mark>${b.key[2]}</p>`;
    if (b.reason) return `<h3 class="reason"><span class="reason-no">${b.reason[0]}</span><span class="reason-t">${b.reason[1]}</span></h3>`;
    return comp[b.c](b.i);
  };

  KC.chapterTitle = (ch) => ch.warn
    ? `<span class="warn" aria-hidden="true">◇</span>${ch.title}<span class="warn" aria-hidden="true">◇</span>`
    : ch.title;

  // CTA・扉・再訪案内・X埋め込みの配線（描画した範囲ごとに呼ぶ）
  KC.wire = (root) => {
    root.querySelectorAll('[data-cta]').forEach((a) => {
      if (a.dataset.w) return; a.dataset.w = '1';
      if (CTA_URL === '#') a.addEventListener('click', (e) => e.preventDefault());
    });
    root.querySelectorAll('[data-door-btn]').forEach((btn) => {
      if (btn.dataset.w) return; btn.dataset.w = '1';
      btn.addEventListener('click', () => {
        const door = btn.closest('[data-door]');
        if (KC.unlocked()) { KC.goto && KC.goto('plans'); return; }
        store.set(KEY_UNLOCK, '1');
        door.classList.add('is-open');
        btn.textContent = 'プラン一覧へ進む';
        KC.onUnlock && KC.onUnlock();
      });
    });
    root.querySelectorAll('[data-resume]').forEach((el) => {
      const canResume = KC.resumeAvailable();
      const plans = KC.unlocked();
      el.hidden = !(canResume || plans);
      el.querySelector('[data-go="resume"]').hidden = !canResume;
      el.querySelector('[data-go="plans"]').hidden = !plans;
      el.querySelectorAll('[data-go]').forEach((b) => {
        if (b.dataset.w) return; b.dataset.w = '1';
        b.addEventListener('click', () => KC.goto && KC.goto(b.dataset.go));
      });
    });
    if (window.twttr && twttr.widgets) twttr.widgets.load(root);
  };

  window.KC = KC;
})();

/* タカシプレゼンツ 究極2ウィーク（スワイプ型LP） v2 */

// 申込URL（全CTA共通）：メルマガ配信申込フォーム
const CTA_URL = 'https://takashiskeiba.com/fm/32739/9Zgv7xa';

const root = document.documentElement;
root.classList.add('js');

// 募集開始：<html data-open-at>。開始前は申込ボタンを押せないようにし、開始までをカウントダウンする。
// 募集締切：<html data-deadline>。未設定なら締切カウントダウンは出さず「受付中」表示にする。
//   締切後もCTAは有効のまま、表示だけ締切仕様に切り替える。
// 予告ページ（teaser.html）は data-deadline で公開時刻を、data-closed-text で0になった後の表示を指定する。
const OPEN_AT = Date.parse(root.dataset.openAt || '');
const DEADLINE = Date.parse(root.dataset.deadline || '');
const HAS_DEADLINE = !Number.isNaN(DEADLINE);
const CLOSED_TEXT = root.dataset.closedText || '募集終了';
const OPEN_TEXT = '受付中';

(() => {
  // ---- 確認用パラメータ（本番に影響なし）----
  //   ?state=closed                        … 締切後の表示
  //   ?now=2026-10-22T23:30:00+09:00       … 任意の時刻を再現（残り1時間未満の演出確認など）
  const q = new URLSearchParams(location.search);
  let offset = 0;
  const qNow = Date.parse(q.get('now') || '');
  if (!Number.isNaN(qNow)) offset = qNow - Date.now();
  if (q.get('state') === 'closed' && HAS_DEADLINE) offset = DEADLINE - Date.now() + 1000;
  const now = () => Date.now() + offset;
  // 予告ページ：公開時刻を過ぎたら本LPへ（確認用パラメータ付きのときは除く）
  //   トップ（/）はサーバー側（middleware.js）が20時で予告→本LPに切り替える。
  //   端末の時計が進んでいてトップで予告が出た場合は、ここで飛ばすとループするので飛ばさない。
  const redirect = offset === 0 ? root.dataset.closedRedirect : '';
  if (redirect && now() >= DEADLINE && location.pathname !== redirect) {
    location.replace(redirect);
    return;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- CTA ----
  // 募集開始前（.is-pre）は申込URLを外して押せないようにする。開始時刻になれば自動で押せるようになる。
  const ctas = document.querySelectorAll('[data-cta]');
  ctas.forEach((a) => {
    a.addEventListener('click', (e) => {
      if (!CTA_URL || root.classList.contains('is-pre')) e.preventDefault();
    });
  });
  const setLocked = (locked) => {
    ctas.forEach((a) => {
      if (locked || !CTA_URL) a.removeAttribute('href');
      else a.href = CTA_URL;
      a.toggleAttribute('aria-disabled', locked);
    });
  };

  // ---- カウントダウン（開始前は開始まで、開始後は締切まで）----
  const timers = document.querySelectorAll('[data-countdown]');
  const seg = (k) => document.querySelectorAll(`[data-cd-${k}]`);
  const segs = { d: seg('d'), h: seg('h'), m: seg('m'), s: seg('s') };
  const put = (list, v) => list.forEach((el) => { if (el.textContent !== v) el.textContent = v; });
  const pad = (n) => String(n).padStart(2, '0');
  let tick;
  let locked;
  const render = () => {
    const t = now();
    const pre = t < OPEN_AT;
    if (pre !== locked) {
      locked = pre;
      root.classList.toggle('is-pre', pre);
      setLocked(pre);
    }
    if (!pre && !HAS_DEADLINE) {
      root.classList.add('no-deadline');
      root.classList.remove('is-tonight', 'is-final', 'has-days');
      timers.forEach((el) => { el.textContent = OPEN_TEXT; });
      clearInterval(tick);
      return;
    }
    const left = (pre ? OPEN_AT : DEADLINE) - t;
    if (left <= 0) {
      root.classList.add('is-closed');
      root.classList.remove('is-tonight', 'is-final', 'has-days');
      timers.forEach((el) => { el.textContent = CLOSED_TEXT; });
      // 開いたまま公開時刻を迎えた人は、数秒おいて本LPを読み込み直す（サーバー側の切替を待つ）
      if (tick && redirect) setTimeout(() => location.replace(redirect), 3000);
      clearInterval(tick);
      return;
    }
    const s = Math.floor(left / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor(s / 3600) % 24;
    const m = Math.floor(s / 60) % 60;
    const sec = s % 60;
    root.classList.toggle('has-days', d > 0);
    root.classList.toggle('is-tonight', left < 86400000);
    root.classList.toggle('is-final', left < 3600000);
    put(segs.d, String(d)); put(segs.h, pad(h)); put(segs.m, pad(m)); put(segs.s, pad(sec));
    const hms = `${pad(h)}:${pad(m)}:${pad(sec)}`;
    const text = d > 0 ? `${d}日 ${hms}` : hms;
    timers.forEach((el) => { el.textContent = text; });
  };
  render();
  if (!root.classList.contains('is-closed') && !root.classList.contains('no-deadline')) tick = setInterval(render, 1000);

  // ---- スワイプ（横スクロールスナップ） ----
  const deck = document.getElementById('deck');
  const pages = deck.querySelectorAll('.page');
  const total = pages.length;
  const nowEl = document.getElementById('page-now');
  const bar = document.getElementById('progress-bar');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const dotsWrap = document.getElementById('dots');
  document.getElementById('page-total').textContent = pad(total);
  const dots = Array.from(pages, () => dotsWrap.appendChild(document.createElement('i')));

  // お客様の声：タイトルを1文字ずつ出すために文字を span に分ける（読み上げは元の文のまま）
  document.querySelectorAll('.page--voice .voice-title').forEach((t) => {
    const text = t.textContent;
    t.setAttribute('aria-label', text);
    t.textContent = '';
    Array.from(text).forEach((c, i) => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.style.setProperty('--i', i);
      s.setAttribute('aria-hidden', 'true');
      s.textContent = c;
      t.appendChild(s);
    });
  });

  // 的中実績：初めて表示したときだけ払戻額を 0 から数え上げる
  const countUp = (page) => {
    if (reduce) return;
    page.querySelectorAll('.hit-amount').forEach((el) => {
      const final = el.textContent;
      const n = parseInt(final.replace(/,/g, ''), 10);
      if (!n) return;
      el.style.minWidth = `${el.offsetWidth}px`; // 桁が増えてもレイアウトを揺らさない
      el.textContent = '0';
      const t0 = performance.now() + 300;
      const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / 1000));
        el.textContent = k < 1 ? Math.round(n * (1 - Math.pow(1 - k, 3))).toLocaleString('ja-JP') : final;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  };

  let current = -1;
  const setCurrent = (i) => {
    if (i === current) return;
    current = i;
    nowEl.textContent = pad(i + 1);
    bar.style.transform = `scaleX(${(i + 1) / total})`;
    prev.disabled = i === 0;
    next.disabled = i === total - 1;
    pages.forEach((p, j) => p.classList.toggle('is-active', j === i));
    if (!pages[i].classList.contains('is-seen')) {
      pages[i].classList.add('is-seen');
      countUp(pages[i]);
    }
    dots.forEach((d, j) => {
      d.classList.toggle('on', j === i);
      if (j < i) d.classList.add('seen');
    });
  };
  const indexFromScroll = () => Math.round(deck.scrollLeft / deck.clientWidth);
  const goTo = (i) => {
    i = Math.max(0, Math.min(total - 1, i));
    deck.scrollTo({ left: i * deck.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
  };

  deck.addEventListener('scroll', () => setCurrent(indexFromScroll()), { passive: true });
  prev.addEventListener('click', () => goTo(current - 1));
  next.addEventListener('click', () => goTo(current + 1));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') goTo(current + 1);
    else if (e.key === 'ArrowLeft') goTo(current - 1);
  });
  // 画面回転・リサイズ時に表示中ページへ位置を合わせ直す
  window.addEventListener('resize', () => {
    deck.scrollLeft = current * deck.clientWidth;
  });

  setCurrent(indexFromScroll());

  // ---- 初回だけ：次ページの端をチラ見せしてスワイプを促す ----
  const HINT_KEY = 'k2w_swipe_hint_v1';
  let touched = false;
  ['pointerdown', 'touchstart', 'keydown', 'wheel'].forEach((ev) =>
    window.addEventListener(ev, () => { touched = true; }, { once: true, passive: true }));
  let shown = false;
  try { shown = localStorage.getItem(HINT_KEY) === '1'; } catch (e) { /* noop */ }
  if (!reduce && !shown) {
    setTimeout(() => {
      if (touched || current !== 0) return;
      deck.classList.add('is-peek');
      setTimeout(() => deck.classList.remove('is-peek'), 1600);
      try { localStorage.setItem(HINT_KEY, '1'); } catch (e) { /* noop */ }
    }, 1800);
  }
})();

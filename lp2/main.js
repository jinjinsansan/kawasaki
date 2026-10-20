/* タカシプレゼンツ 究極2ウィーク（スワイプ型LP） v2 */

// 申込URL（全CTA共通）。メルマガ配信申込URLが決まったらここに入れる。
const CTA_URL = '';

// 募集締切：2026/10/22（木）24:00 JST。締切後もCTAは有効のまま、表示だけ締切仕様に切り替える。
const DEADLINE = Date.parse('2026-10-23T00:00:00+09:00');

const root = document.documentElement;
root.classList.add('js');

(() => {
  // ---- 確認用パラメータ（本番に影響なし）----
  //   ?state=closed                        … 締切後の表示
  //   ?now=2026-10-22T23:30:00+09:00       … 任意の時刻を再現（残り1時間未満の演出確認など）
  const q = new URLSearchParams(location.search);
  let offset = 0;
  const qNow = Date.parse(q.get('now') || '');
  if (!Number.isNaN(qNow)) offset = qNow - Date.now();
  if (q.get('state') === 'closed') offset = DEADLINE - Date.now() + 1000;
  const now = () => Date.now() + offset;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- CTA ----
  document.querySelectorAll('[data-cta]').forEach((a) => {
    if (CTA_URL) a.href = CTA_URL;
    else a.addEventListener('click', (e) => e.preventDefault());
  });

  // ---- カウントダウン ----
  const timers = document.querySelectorAll('[data-countdown]');
  const seg = (k) => document.querySelectorAll(`[data-cd-${k}]`);
  const segs = { d: seg('d'), h: seg('h'), m: seg('m'), s: seg('s') };
  const put = (list, v) => list.forEach((el) => { if (el.textContent !== v) el.textContent = v; });
  const pad = (n) => String(n).padStart(2, '0');
  let tick;
  const render = () => {
    const left = DEADLINE - now();
    if (left <= 0) {
      root.classList.add('is-closed');
      root.classList.remove('is-tonight', 'is-final', 'has-days');
      timers.forEach((el) => { el.textContent = '募集終了'; });
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
  if (!root.classList.contains('is-closed')) tick = setInterval(render, 1000);

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

  let current = -1;
  const setCurrent = (i) => {
    if (i === current) return;
    current = i;
    nowEl.textContent = pad(i + 1);
    bar.style.transform = `scaleX(${(i + 1) / total})`;
    prev.disabled = i === 0;
    next.disabled = i === total - 1;
    pages.forEach((p, j) => p.classList.toggle('is-active', j === i));
    pages[i].classList.add('is-seen');
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

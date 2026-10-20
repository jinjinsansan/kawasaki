/* タカシプレゼンツ 究極2ウィーク（スワイプ型LP） */

// 申込URL（全CTA共通）。メルマガ配信申込URLが決まったらここに入れる。
const CTA_URL = '';

// 募集締切：2026/10/22（木）24:00 JST。締切後もCTAは有効のまま、表示だけ締切仕様に切り替える。
const DEADLINE = Date.parse('2026-10-23T00:00:00+09:00');

document.documentElement.classList.add('js');

(() => {
  // ---- CTA ----
  document.querySelectorAll('[data-cta]').forEach((a) => {
    if (CTA_URL) a.href = CTA_URL;
    else a.addEventListener('click', (e) => e.preventDefault());
  });

  // ---- カウントダウン ----
  const timers = document.querySelectorAll('[data-countdown]');
  const pad = (n) => String(n).padStart(2, '0');
  let tick;
  const render = () => {
    const left = DEADLINE - Date.now();
    if (left <= 0) {
      document.documentElement.classList.add('is-closed');
      timers.forEach((el) => { el.textContent = '募集終了'; });
      clearInterval(tick);
      return;
    }
    const s = Math.floor(left / 1000);
    const d = Math.floor(s / 86400);
    const hms = `${pad(Math.floor(s / 3600) % 24)}:${pad(Math.floor(s / 60) % 60)}:${pad(s % 60)}`;
    const text = d > 0 ? `${d}日 ${hms}` : hms;
    timers.forEach((el) => { el.textContent = text; });
  };
  render();
  if (!document.documentElement.classList.contains('is-closed')) tick = setInterval(render, 1000);

  // ---- スワイプ（横スクロールスナップ） ----
  const deck = document.getElementById('deck');
  const pages = deck.querySelectorAll('.page');
  const total = pages.length;
  const now = document.getElementById('page-now');
  const bar = document.getElementById('progress-bar');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  document.getElementById('page-total').textContent = total;

  let current = -1;
  const setCurrent = (i) => {
    if (i === current) return;
    current = i;
    now.textContent = i + 1;
    bar.style.transform = `scaleX(${(i + 1) / total})`;
    prev.disabled = i === 0;
    next.disabled = i === total - 1;
    pages.forEach((p, j) => p.classList.toggle('is-active', j === i));
  };
  const indexFromScroll = () => Math.round(deck.scrollLeft / deck.clientWidth);
  const goTo = (i) => {
    i = Math.max(0, Math.min(total - 1, i));
    deck.scrollTo({ left: i * deck.clientWidth, behavior: 'smooth' });
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
})();

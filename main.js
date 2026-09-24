/* カワサキクラブ LP */

// 申込URL（全CTA共通）。変更時はここと index.html の data-cta リンクを更新する。
const CTA_URL = 'https://takashiskeiba.com/fm/32465/ypEMXIRW';

(() => {
  // ---- CTA ----
  if (CTA_URL) {
    document.querySelectorAll('[data-cta]').forEach((a) => {
      a.href = CTA_URL;
    });
  }

  // ---- 固定CTAバー（scrollY > 700 で表示） ----
  const sticky = document.getElementById('sticky-cta');
  const stickyLink = sticky && sticky.querySelector('a');
  let shown = false;
  const onScroll = () => {
    const s = window.scrollY > 700;
    if (s === shown || !sticky) return;
    shown = s;
    sticky.classList.toggle('is-shown', s);
    sticky.setAttribute('aria-hidden', String(!s));
    stickyLink.tabIndex = s ? 0 : -1;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- スクロールリビール ----
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('is-in');
      io.unobserve(el);
      // 表示後はホバー時の transition に遅延を残さない
      el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('[data-reveal]').forEach((el, i) => {
    // 初期表示範囲内の要素はアニメさせない
    if (el.getBoundingClientRect().top < window.innerHeight) return;
    el.classList.add('rv');
    el.style.transitionDelay = (i % 4) * 70 + 'ms';
    io.observe(el);
  });
})();

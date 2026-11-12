/* A案：縦スワイプ（ストーリー型） */
(() => {
  const KC = window.KC;
  KC.mode = 'a';
  const POS = 'kc_member_a_pos';
  KC.applyQuery(POS);
  document.documentElement.classList.add('js');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const deck = document.getElementById('deck');
  const hud = document.getElementById('hud');
  const hudCh = document.getElementById('hud-ch');
  const hudBar = document.getElementById('hud-bar');

  // 画面リストを組み立て：章扉 → 本文画面
  const screens = [];
  KC.CH.forEach((ch) => {
    if (ch.n > 0) {
      // 章扉：挿絵があれば「絵＋章タイトル」、なければ縦書きの章扉
      screens.push({ ch: ch.n, kind: ch.art ? 'opener scr--opener-art' : 'opener', html: ch.art
        ? `<div class="opener opener--art">${KC.artImg(ch.art, 'art art--opener')}<p class="opener-no">第${KC.KANJI[ch.n]}章</p><h2 class="opener-title">${KC.chapterTitle(ch)}</h2></div>`
        : `<div class="opener"><div class="opener-v"><p class="opener-no">第${KC.KANJI[ch.n]}章</p><h2 class="opener-title">${KC.chapterTitle(ch)}</h2></div><span class="opener-num" aria-hidden="true">${ch.n}</span></div>` });
    }
    ch.screens.forEach((s, k) => {
      const first = ch.n > 0 && k === 0 && s[0].p != null;
      const kind = s[0].c === 'cover' ? 'cover' : s[0].c === 'art' ? 'art' : s.every((b) => b.key) ? 'key' : s[0].c === 'door' ? 'door' : '';
      screens.push({ ch: ch.n, kind, first, html: s.map(KC.block).join('') });
    });
  });
  const total = screens.length;
  const lockAt = screens.findIndex((s) => s.ch === 7);

  let cur = 0;
  const savedPos = parseInt(KC.store.get(POS) || '0', 10);
  KC.resumeAvailable = () => savedPos > 1 && savedPos < total;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) setActive(+e.target.dataset.i); });
  }, { root: deck, threshold: 0.6 });

  // 本文（.scr-in）の高さを、画面の内側の高さと比べる（装飾の透かし数字は対象外）
  const over = (el) => {
    const cs = getComputedStyle(el);
    const avail = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    return el.firstElementChild.scrollHeight > avail + 1;
  };
  const fit = (el) => {
    el.classList.remove('dense', 'denser');
    if (el.classList.contains('scr--opener')) return; // 章扉は固定レイアウト
    if (over(el)) el.classList.add('dense');
    if (over(el)) el.classList.add('denser');
  };

  const mount = (upto) => {
    const frag = document.createDocumentFragment();
    const added = [];
    for (let i = deck.children.length; i < upto; i++) {
      const s = screens[i];
      const el = document.createElement('section');
      el.className = 'scr' + (s.kind ? ' scr--' + s.kind : '') + (s.first ? ' scr--first' : '');
      if (s.ch > 0) el.dataset.num = s.ch;
      el.dataset.i = i;
      el.dataset.screenLabel = String(i + 1).padStart(2, '0');
      const folio = s.kind === 'cover' ? '' : `<p class="folio" aria-hidden="true"><span>KAWASAKI CLUB</span><b>${String(i + 1).padStart(2, '0')}</b></p>`;
      el.innerHTML = `<div class="scr-in">${s.html}</div>${folio}`;
      frag.appendChild(el);
      added.push(el);
    }
    deck.appendChild(frag);
    added.forEach((el) => { io.observe(el); fit(el); });
    KC.wire(deck);
  };

  const setActive = (i) => {
    if (i === cur && deck.children[i].classList.contains('is-on')) return;
    cur = i;
    deck.children[i].classList.add('is-on');
    const ch = screens[i].ch;
    hud.classList.toggle('is-hidden', i === 0);
    hudCh.innerHTML = ch === 0 ? '序' : `第<b>${ch}</b>章／全<b>8</b>章`;
    hudBar.style.setProperty('--p', (i / (total - 1)).toFixed(4));
    KC.store.set(POS, String(i));
  };

  const goTo = (i, instant) => {
    i = Math.max(0, Math.min(deck.children.length - 1, i));
    deck.scrollTo({ top: deck.children[i].offsetTop, behavior: reduce || instant ? 'auto' : 'smooth' });
  };

  KC.goto = (where) => {
    if (where === 'plans') goTo(lockAt);
    else if (where === 'resume') goTo(savedPos);
  };
  KC.onUnlock = () => {
    mount(total);
    setTimeout(() => goTo(lockAt), reduce ? 0 : 1900);
  };

  document.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); goTo(cur + 1); }
    else if (['ArrowUp', 'PageUp'].includes(e.key)) { e.preventDefault(); goTo(cur - 1); }
    else if (e.key === 'Home') goTo(0);
  });
  addEventListener('resize', () => {
    [...deck.children].forEach(fit);
    goTo(cur, true);
  });

  mount(KC.unlocked() ? total : lockAt);
  setActive(0);
  if (document.fonts) document.fonts.ready.then(() => [...deck.children].forEach(fit));
})();

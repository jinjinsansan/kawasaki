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

  // 決め台詞：一文字ずつ現れるように文字を span に分ける（読み上げは元の文のまま）
  const splitChars = (scr) => {
    if (reduce) return;
    scr.querySelectorAll('.key').forEach((key) => {
      key.setAttribute('aria-label', key.textContent);
      let n = 0;
      const walk = (node) => {
        [...node.childNodes].forEach((c) => {
          if (c.nodeType === 3) {
            const frag = document.createDocumentFragment();
            Array.from(c.textContent).forEach((ch) => {
              const sp = document.createElement('span');
              sp.className = 'ch';
              sp.setAttribute('aria-hidden', 'true');
              sp.style.setProperty('--i', n++);
              sp.textContent = ch;
              frag.appendChild(sp);
            });
            c.replaceWith(frag);
          } else if (c.nodeType === 1) walk(c);
        });
      };
      walk(key);
      key.style.setProperty('--n', n);
    });
  };

  // 数字：初めて表示したときに 0 から数え上げる（271,010円・1.75万人・180万円など）
  const countUp = (scr) => {
    if (reduce) return;
    scr.querySelectorAll('.miyako .num, .nums div:nth-child(-n+2) b, .cmp-profit b, .rec-val b').forEach((el) => {
      const final = el.textContent;
      const dec = (final.split('.')[1] || '').length;
      const n = parseFloat(final.replace(/,/g, ''));
      if (!n) return;
      el.style.display = 'inline-block';
      el.style.minWidth = `${el.offsetWidth}px`;
      const t0 = performance.now() + 450;
      const step = (t) => {
        const k = Math.max(0, Math.min(1, (t - t0) / 1300));
        const v = n * (1 - Math.pow(1 - k, 3));
        el.textContent = k < 1 ? v.toLocaleString('ja-JP', { minimumFractionDigits: dec, maximumFractionDigits: dec }) : final;
        if (k < 1) requestAnimationFrame(step);
      };
      el.textContent = (0).toFixed(dec);
      requestAnimationFrame(step);
    });
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
    added.forEach((el) => { if (el.classList.contains('scr--key')) splitChars(el); io.observe(el); fit(el); });
    KC.wire(deck);
  };

  const setActive = (i) => {
    if (i === cur && deck.children[i].classList.contains('is-on')) return;
    cur = i;
    const scr = deck.children[i];
    if (!scr.classList.contains('is-on')) countUp(scr);
    scr.classList.add('is-on');
    const ch = screens[i].ch;
    hud.classList.toggle('is-hidden', i === 0);
    hudCh.innerHTML = ch === 0 ? '序' : `第<b>${ch}</b>章／全<b>8</b>章`;
    hudBar.style.setProperty('--p', (i / (total - 1)).toFixed(4));
    KC.store.set(POS, String(i));
    voice.onActive(i);
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

  /* 朗読（AI音声）：声に合わせて画面を送る。読者が自分でスワイプしたら、声もその画面に移る。
     assets/voice/timeline.json＝章ごとの音声と「何秒からどの画面か」の目印（docs/member-lp/voice/make_voice.py が作る） */
  const voice = (() => {
    const bar = document.getElementById('vbar');
    const btn = document.getElementById('vbar-btn');
    const label = bar.querySelector('span');
    const audio = new Audio();
    audio.preload = 'auto';
    let marks = null;     // [{chap, t, i}]（画面順）
    let tl = null;
    let chap = -1;
    let on = false;       // 朗読モード中（一時停止も含む）
    let target = -1;      // 声に合わせて送っている先の画面
    let mark = null;      // いま読んでいる目印

    const plain = (html) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, '');
    const find = (a, from) => {
      for (let i = from; i < screens.length; i++) {
        const s = screens[i];
        if (a.startsWith('open:') ? s.kind.startsWith('opener') && s.ch === +a.slice(5)
          : a.startsWith('#') ? s.html.includes(a.slice(1)) : plain(s.html).includes(a)) return i;
      }
      return -1;
    };
    const load = async () => {
      if (marks) return;
      tl = await (await fetch('assets/voice/timeline.json')).json();
      marks = [];
      let from = 0;
      tl.forEach((c, chapNo) => c.marks.forEach(([t, a]) => {
        const i = find(a, from);
        if (i < 0) { console.warn('voice: 画面が見つからない', a); return; }
        from = i;
        marks.push({ chap: chapNo, t, i });
      }));
    };
    const ui = () => {
      bar.hidden = !on;
      bar.classList.toggle('is-paused', audio.paused);
      label.textContent = audio.paused ? 'AI音声（一時停止中）' : 'AI音声で朗読中';
      btn.setAttribute('aria-label', audio.paused ? '再生' : '一時停止');
    };
    const seek = (m) => new Promise((res) => {
      const go = () => { audio.currentTime = m.t; res(); };
      if (chap === m.chap) return go();
      chap = m.chap;
      audio.src = tl[chap].src;
      audio.addEventListener('loadedmetadata', go, { once: true });
      audio.load();
    });
    const playFrom = async (i) => {
      await load();
      // その画面の目印。なければ、その手前でいちばん近い目印から
      const m = marks.find((x) => x.i === i) || [...marks].reverse().find((x) => x.i < i) || marks[0];
      mark = m;
      target = m.i;
      on = true;
      await seek(m);
      try { await audio.play(); } catch (e) { /* 自動再生の制限など */ }
      if (cur !== m.i) goTo(m.i);
      ui();
    };
    const stop = () => { audio.pause(); on = false; mark = null; ui(); };

    audio.addEventListener('timeupdate', () => {
      if (!on || !marks) return;
      const t = audio.currentTime;
      let m = null;
      for (const x of marks) { if (x.chap === chap && x.t <= t + 0.05) m = x; }
      if (m && m !== mark) {
        mark = m;
        if (m.i !== cur) { target = m.i; goTo(m.i); }
      }
    });
    audio.addEventListener('ended', async () => {
      if (chap + 1 < tl.length) {
        const m = marks.find((x) => x.chap === chap + 1);
        mark = m; target = m.i;
        await seek(m);
        audio.play().catch(() => {});
        if (cur !== m.i) goTo(m.i);
      } else {
        // 読み終わり：扉の画面へ送って止める
        const door = screens.findIndex((s) => s.kind === 'door');
        if (door >= 0) goTo(door);
        stop();
      }
    });
    audio.addEventListener('play', ui);
    audio.addEventListener('pause', ui);

    btn.addEventListener('click', () => {
      if (audio.paused) {
        // 止めている間にほかの画面へ移っていたら、そこから読む
        if (mark && mark.i !== cur && marks.some((x) => x.i === cur)) playFrom(cur);
        else audio.play().catch(() => {});
      } else audio.pause();
    });
    document.getElementById('vbar-x').addEventListener('click', stop);
    deck.addEventListener('click', (e) => {
      if (e.target.closest('[data-voice]')) playFrom(cur);
    });
    if ('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({ title: '川崎クラブ 手記（AI音声）', artist: '川崎タカシ' });
      navigator.mediaSession.setActionHandler('play', () => audio.play());
      navigator.mediaSession.setActionHandler('pause', () => audio.pause());
    }

    return {
      onActive(i) {
        if (!on || audio.paused || !marks) return;
        if (i === target || (mark && i === mark.i)) return; // 声に合わせて送った画面
        // 読者が自分でスワイプした：その画面に声があればそこから、なければ（プランなど）止める
        if (marks.some((x) => x.i === i)) playFrom(i);
        else if (i > marks[marks.length - 1].i) stop();
        else playFrom(i);
      },
    };
  })();

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

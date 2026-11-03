/* ==========================================================================
   Interactions: kinetic type, reveals, horizontal scroll, poster tilt,
   follow-cursor portraits, draggable archive, menu, clock, countdown.
   ========================================================================== */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const desktop = matchMedia('(min-width: 900px)');

  /* ---------- split hero letters ---------- */
  $$('[data-split]').forEach((el) => {
    const txt = el.textContent.trim();
    el.textContent = '';
    [...txt].forEach((ch, i) => {
      const s = document.createElement('span');
      s.className = 'ch'; s.textContent = ch; s.style.setProperty('--i', i);
      el.appendChild(s);
    });
  });

  /* ---------- fit text to its container ---------- */
  function fit() {
    $$('[data-fit]').forEach((el) => {
      el.style.fontSize = '100px';
      const nat = el.getBoundingClientRect().width;
      const target = el.parentElement.clientWidth * parseFloat(el.dataset.fit || 1);
      let size = nat ? 100 * target / nat : 100;
      if (el.dataset.fitH) size = Math.min(size, innerHeight * parseFloat(el.dataset.fitH));
      el.style.fontSize = size.toFixed(2) + 'px';
    });
  }
  fit();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { fit(); document.documentElement.classList.add('fonts-in'); measure(); });
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { fit(); measure(); onScroll(); }, 120); });

  /* ---------- hero: letters stretch toward the pointer ---------- */
  const hero = $('.hero');
  const letters = $$('.hero .ch');
  letters.forEach((l) => { l._s = 1; });
  let px = 0, active = false, raf = 0;
  function tickLetters() {
    let moving = false;
    letters.forEach((l) => {
      const r = l.getBoundingClientRect();
      const d = (r.left + r.width / 2 - px) / (innerWidth * 0.11);
      const t = active ? 1 + 0.26 * Math.exp(-d * d) : 1;
      l._s += (t - l._s) * 0.14;
      if (Math.abs(t - l._s) > 0.001) moving = true;
      l.style.scale = `1 ${l._s.toFixed(4)}`;
    });
    raf = moving ? requestAnimationFrame(tickLetters) : 0;
  }
  const kick = () => { if (!raf) raf = requestAnimationFrame(tickLetters); };
  if (hero && !reduce.matches) {
    hero.addEventListener('pointermove', (e) => { if (e.pointerType !== 'mouse') return; px = e.clientX; active = true; kick(); });
    hero.addEventListener('pointerleave', () => { active = false; kick(); });
  }

  /* glyph swap: a letter briefly turns serif italic */
  function swap(l) {
    if (l.classList.contains('alt')) return;
    l.style.width = l.getBoundingClientRect().width / (l._s ? 1 : 1) + 'px';
    l.classList.add('alt');
    setTimeout(() => { l.classList.remove('alt'); l.style.width = ''; }, 700);
  }
  if (letters.length && !reduce.matches) {
    letters.forEach((l) => l.addEventListener('pointerenter', () => swap(l)));
    setInterval(() => { if (!document.hidden) swap(letters[Math.floor(Math.random() * letters.length)]); }, 2600);
  }

  /* ---------- record: spin speed follows scroll velocity & pads ---------- */
  const rec = $('.record');
  let recAnim = null;
  if (rec && !reduce.matches && rec.animate) {
    recAnim = rec.animate([{ rotate: '0deg' }, { rotate: '360deg' }], { duration: 9000, iterations: Infinity });
  }
  let boost = 0;
  document.addEventListener('ms:hit', (e) => { boost = Math.min(boost + (e.detail === 'kick' ? 4 : 1.5), 10); });

  /* ---------- reveals ---------- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    $$('[data-reveal]').forEach((el) => io.observe(el));
  } else {
    $$('[data-reveal]').forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- horizontal scroll (releases) ---------- */
  const hs = $('[data-hs]');
  const track = hs && $('[data-hs-track]', hs);
  const bar = hs && $('[data-hs-bar]', hs);
  let hsDist = 0;
  function measure() {
    if (!hs) return;
    if (desktop.matches && !reduce.matches) {
      hs.classList.add('is-pinned');
      hsDist = Math.max(0, track.scrollWidth - innerWidth);
      hs.style.height = (hsDist + innerHeight) + 'px';
    } else {
      hs.classList.remove('is-pinned');
      hs.style.height = ''; track.style.transform = ''; hsDist = 0;
    }
  }
  measure();
  if (track) {
    track.addEventListener('focusin', (e) => {
      if (!hs.classList.contains('is-pinned')) return;
      const panel = e.target.closest('.hs__panel'); if (!panel) return;
      const x = clamp(panel.offsetLeft - innerWidth * 0.2, 0, hsDist);
      scrollTo({ top: hs.offsetTop + x, behavior: 'auto' });
    });
    if (!track.scrollWidth) setTimeout(measure, 300);
  }

  /* ---------- manifesto: words light up with scroll ---------- */
  const man = $('[data-words]');
  let words = [];
  if (man) {
    const nodes = Array.from(man.childNodes);
    man.textContent = '';
    nodes.forEach((n) => {
      if (n.nodeType === 3) {
        n.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) { man.appendChild(document.createTextNode(' ')); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = part; man.appendChild(s);
        });
      } else {
        n.classList.add('w'); man.appendChild(n);
      }
    });
    words = $$('.w', man);
    if (reduce.matches) words.forEach((w) => w.classList.add('on'));
  }

  /* ---------- scroll loop ---------- */
  let lastY = scrollY, ticking = false;
  function onScroll() {
    ticking = false;
    const y = scrollY;
    if (hs && hs.classList.contains('is-pinned')) {
      const p = clamp(-hs.getBoundingClientRect().top / (hsDist || 1), 0, 1);
      track.style.transform = `translate3d(${(-p * hsDist).toFixed(1)}px,0,0)`;
      if (bar) bar.style.transform = `scaleX(${p.toFixed(3)})`;
    }
    if (words.length && !reduce.matches) {
      const r = man.getBoundingClientRect();
      const p = clamp((innerHeight * 0.78 - r.top) / (r.height * 0.95), 0, 1);
      const n = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    }
    if (recAnim) boost = Math.min(boost + Math.abs(y - lastY) / 60, 10);
    lastY = y;
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  if (recAnim) {
    (function decay() {
      boost *= 0.93;
      recAnim.playbackRate = 1 + boost;
      requestAnimationFrame(decay);
    })();
  }

  /* ---------- poster tilt + misregistration ---------- */
  if (fine.matches && !reduce.matches) {
    $$('[data-tilt]').forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg');
        el.style.setProperty('--ry', (x * 11).toFixed(2) + 'deg');
        el.style.setProperty('--mx', (x * 26).toFixed(1) + 'px');
        el.style.setProperty('--my', (y * 20).toFixed(1) + 'px');
      });
      el.addEventListener('pointerleave', () => ['--rx', '--ry', '--mx', '--my'].forEach((p) => el.style.removeProperty(p)));
    });
  }

  /* ---------- artists: portrait follows the cursor ---------- */
  const follow = $('[data-follow]');
  if (follow && fine.matches) {
    let fx = 0, fy = 0, tx = 0, ty = 0, on = false, fr = 0;
    const loop = () => {
      fx += (tx - fx) * 0.16; fy += (ty - fy) * 0.16;
      follow.style.transform = `translate3d(${fx.toFixed(1)}px,${fy.toFixed(1)}px,0) rotate(${clamp((tx - fx) * 0.05, -12, 12).toFixed(2)}deg)`;
      fr = (on || Math.abs(tx - fx) > 0.5) ? requestAnimationFrame(loop) : 0;
    };
    $$('.artist').forEach((row) => {
      row.addEventListener('pointerenter', (e) => {
        const thumb = $('.artist__thumb', row);
        follow.innerHTML = thumb.innerHTML + `<p class="follow__cap mono">${$('.artist__bio', row).textContent}</p>`;
        if (!on) { fx = tx = e.clientX + 24; fy = ty = e.clientY - 120; }
        on = true; follow.classList.add('is-on');
        if (!fr) fr = requestAnimationFrame(loop);
      });
      row.addEventListener('pointermove', (e) => { tx = e.clientX + 24; ty = e.clientY - 120; });
      row.addEventListener('pointerleave', () => { on = false; follow.classList.remove('is-on'); });
    });
  }

  /* ---------- archive: drag flyers around ---------- */
  let z = 10;
  $$('[data-drag]').forEach((el) => {
    let sx, sy, ox, oy, dragging = false;
    el.addEventListener('pointerdown', (e) => {
      if (!fine.matches || !desktop.matches) return;
      e.preventDefault();
      dragging = true; el.setPointerCapture(e.pointerId);
      sx = e.clientX; sy = e.clientY;
      ox = parseFloat(el.dataset.x || 0); oy = parseFloat(el.dataset.y || 0);
      el.style.zIndex = ++z; el.classList.add('is-drag');
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      const x = ox + e.clientX - sx, y = oy + e.clientY - sy;
      el.dataset.x = x; el.dataset.y = y;
      el.style.translate = `${x}px ${y}px`;
    });
    const end = () => { dragging = false; el.classList.remove('is-drag'); };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  });

  /* ---------- menu ---------- */
  const btn = $('[data-menu-btn]'), menu = $('[data-menu]');
  if (btn && menu) {
    const set = (open) => {
      btn.setAttribute('aria-expanded', String(open));
      btn.textContent = open ? 'Close' : 'Menu';
      menu.hidden = !open;
      document.documentElement.classList.toggle('menu-open', open);
      if (open) { const a = $('a', menu); if (a) a.focus(); }
    };
    btn.addEventListener('click', () => set(btn.getAttribute('aria-expanded') !== 'true'));
    menu.addEventListener('click', (e) => { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !menu.hidden) { set(false); btn.focus(); } });
    desktop.addEventListener('change', () => set(false));
  }

  /* ---------- London clock ---------- */
  const clocks = $$('[data-clock]');
  const tf = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hour: '2-digit', minute: '2-digit', hour12: false });
  const tickClock = () => clocks.forEach((c) => { c.textContent = tf.format(new Date()); });
  tickClock(); setInterval(tickClock, 10000);

  /* ---------- countdown ---------- */
  const cd = $('[data-countdown]');
  if (cd) {
    const target = new Date(cd.dataset.countdown).getTime();
    const p2 = (n) => String(n).padStart(2, '0');
    const t = () => {
      let s = Math.max(0, Math.floor((target - Date.now()) / 1000));
      const d = Math.floor(s / 86400); s -= d * 86400;
      const h = Math.floor(s / 3600); s -= h * 3600;
      const m = Math.floor(s / 60); s -= m * 60;
      cd.textContent = target > Date.now() ? `T–${p2(d)}D ${p2(h)}H ${p2(m)}M ${p2(s)}S` : 'Doors are open';
    };
    t(); setInterval(t, 1000);
  }

  /* ---------- embed facade ---------- */
  $$('[data-embed]').forEach((box) => {
    const b = $('button', box);
    b.addEventListener('click', () => {
      const src = box.dataset.embed;
      if (!src) { const n = $('.mix__note', box); if (n) n.classList.add('flash'); setTimeout(() => n && n.classList.remove('flash'), 600); return; }
      box.innerHTML = `<iframe title="SoundCloud player" width="100%" height="166" allow="autoplay" loading="lazy" src="${src}"></iframe>`;
    });
  });

  /* ---------- year ---------- */
  $$('[data-year]').forEach((y) => { y.textContent = new Date().getFullYear(); });
})();

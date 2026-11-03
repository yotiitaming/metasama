/* ==========================================================================
   Generative posters, covers and portraits (inline SVG).
   Stand-ins until real flyers / artwork / photos exist — every piece is
   seeded by its id, so it always renders the same way.
   ========================================================================== */
(function () {
  'use strict';

  const C = { ink: '#0b0b0b', paper: '#efece4', red: '#ff3b1f', blue: '#2a3bff' };
  let uid = 0;

  const hash = (s) => { s = String(s); let h = 2166136261 >>> 0; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };
  const rng = (seed) => { let a = hash(seed); return () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const f = (n) => Math.round(n * 10) / 10;

  /* photocopy edge roughness */
  const xerox = (id, scale) => `<filter id="xr${id}" x="-3%" y="-3%" width="106%" height="106%"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="${id % 97}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${scale || 4}" xChannelSelector="R" yChannelSelector="G"/></filter>`;

  /* offset-row halftone: fn(x,y) -> 0..1 dot size */
  function halftone(w, h, step, fn, fill) {
    let s = '', row = 0;
    for (let y = step / 2; y < h + step; y += step * 0.866, row++) {
      const off = (row % 2) * step / 2;
      for (let x = off; x < w + step; x += step) {
        const v = fn(x, y);
        if (v > 0.05) s += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(Math.min(1, v) * step * 0.6)}"/>`;
      }
    }
    return `<g fill="${fill}">${s}</g>`;
  }

  /* stacked condensed headline, each line justified to width w */
  function stack(lines, o) {
    let sizes = lines.map((l) => Math.min(o.cap || 9999, o.w / (Math.max(2, l.length) * 0.46)));
    const tot = sizes.reduce((a, s) => a + s * 0.84, 0);
    if (o.maxH && tot > o.maxH) { const k = o.maxH / tot; sizes = sizes.map((s) => s * k); }
    let y = o.y, out = '';
    lines.forEach((l, i) => {
      const s = sizes[i];
      y += s * 0.73;
      const natural = l.length * 0.5 * s;
      const fit = natural > o.w * 0.78 ? ` textLength="${o.w}" lengthAdjust="spacingAndGlyphs"` : '';
      out += `<text class="pt" x="${o.x}" y="${f(y)}" font-size="${f(s)}" fill="${o.fill}"${fit}>${esc(l.toUpperCase())}</text>`;
      y += s * 0.11;
    });
    return out;
  }

  const mono = (t, x, y, o) => `<text class="pm" x="${x}" y="${y}" font-size="${(o && o.size) || 13}" fill="${o.fill}"${o.anchor ? ` text-anchor="${o.anchor}"` : ''}>${esc(t)}</text>`;
  const open = (w, h, label, cls) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" class="art ${cls}" role="img" aria-label="${esc(label)}" focusable="false">`;

  const TZ = 'Europe/London';
  const fmt = (d, o) => new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: TZ }, o)).format(d);

  /* ---------------------------------------------------------------- event */
  function eventPoster(e, opt) {
    opt = opt || {};
    const id = ++uid, W = 500, H = 700, R = rng(e.id || e.title);
    const p = e.poster || {}, st = p.style || 'shred', acc = p.accent || C.red;
    const step = opt.small ? 19 : 13;
    const d = new Date(e.date);
    const day = fmt(d, { weekday: 'short' }).toUpperCase();
    const dd = `${fmt(d, { day: '2-digit' })}.${fmt(d, { month: '2-digit' })}.${fmt(d, { year: '2-digit' })}`;
    const lines = p.lines || e.title.split(/\s+/);
    const ed = String(e.edition || '').replace(/^vol\.?/i, '').replace('#', '');
    const T = (y, maxH, fill) => stack(lines, { x: 22, y, w: 456, maxH, fill });
    let bg, fg, art = '', title = '', extra = '';

    if (st === 'shred') {
      bg = C.ink; fg = C.paper;
      art = halftone(W, H, step, (x, y) => Math.pow(clamp(1 - Math.hypot(x - 340, y - 380) / 280, 0, 1), 0.75) * (0.7 + 0.3 * R()), acc);
      title = `<g class="reg"><g transform="translate(7 5)">${T(72, 330, C.blue)}</g></g><g filter="url(#xr${id})">${T(72, 330, fg)}</g>`;
      extra = `<text class="pt" x="478" y="596" font-size="210" text-anchor="end" fill="none" stroke="${fg}" stroke-width="1.6">${esc(ed)}</text>`;
    } else if (st === 'beats') {
      bg = C.paper; fg = C.ink;
      const gap = 8, cw = (456 - gap * 3) / 4, hot = Math.floor(R() * 8);
      for (let i = 0; i < 8; i++) {
        const x = 22 + (i % 4) * (cw + gap), y = 64 + Math.floor(i / 4) * (cw + gap);
        const fill = i === hot ? acc : (R() < 0.3 ? fg : 'none');
        art += `<rect x="${f(x)}" y="${f(y)}" width="${f(cw)}" height="${f(cw)}" fill="${fill}" stroke="${fg}" stroke-width="2.5"/>`;
        if (i === hot) extra = `<text class="pt" x="${f(x + cw / 2)}" y="${f(y + cw * 0.78)}" font-size="${f(cw * 0.72)}" text-anchor="middle" fill="${C.paper}">${esc(ed)}</text>`;
      }
      title = `<g class="reg"><g transform="translate(6 4)">${T(300, 290, acc)}</g></g><g filter="url(#xr${id})">${T(300, 290, fg)}</g>`;
    } else if (st === 'live') {
      bg = C.ink; fg = C.paper;
      for (let x = 22; x < 470;) { const bw = 2 + R() * 12; if (R() > 0.3) art += `<rect x="${f(x)}" y="64" width="${f(Math.min(bw, 478 - x))}" height="220" fill="${fg}"/>`; x += bw + 2 + R() * 6; }
      art += `<rect x="-30" y="318" width="560" height="270" fill="${acc}" transform="rotate(-4 250 450)"/>`;
      extra = `<rect x="334" y="224" width="144" height="66" fill="${C.ink}"/><text class="pt" x="470" y="280" font-size="62" text-anchor="end" fill="${fg}">${esc(ed)}</text>`;
      title = `<g filter="url(#xr${id})">${T(338, 250, C.ink)}</g>`;
    } else if (st === 'type') {
      bg = acc; fg = C.ink;
      art = `<text class="pt" x="22" y="590" font-size="560" textLength="456" lengthAdjust="spacingAndGlyphs" fill="${fg}" filter="url(#xr${id})">${esc(ed || '?')}</text>`;
      title = `<g class="reg"><g transform="translate(5 4)">${T(66, 140, fg)}</g></g>${T(66, 140, C.paper)}`;
    } else { /* rings */
      bg = acc === C.red ? C.blue : acc; fg = C.paper;
      for (let r = 18; r < 560; r += 10 + R() * 14) art += `<circle cx="330" cy="300" r="${f(r)}" fill="none" stroke="${fg}" stroke-width="${f(1 + R() * 5)}"/>`;
      title = `<rect x="22" y="372" width="456" height="222" fill="${C.ink}"/><g filter="url(#xr${id})">${stack(lines, { x: 34, y: 384, w: 432, maxH: 196, fill: fg })}</g>`;
    }

    const lu = (e.lineup || []).join(' / ').toUpperCase();
    const frame =
      mono('META SAMA PRESENTS', 22, 40, { fill: fg }) + mono('LDN', 478, 40, { fill: fg, anchor: 'end' }) +
      `<rect x="22" y="48" width="456" height="1.5" fill="${fg}"/><rect x="22" y="614" width="456" height="1.5" fill="${fg}"/>` +
      mono(`${day} ${dd}${e.doors ? '  ' + e.doors : ''}`, 22, 638, { fill: fg }) +
      mono(`${e.venue}, ${e.area}`.toUpperCase().slice(0, 54), 22, 658, { fill: fg }) +
      mono(lu.length > 54 ? lu.slice(0, 53) + '…' : lu, 22, 678, { fill: fg });

    const label = `Poster: ${e.title} ${e.edition || ''}, ${day} ${dd}, ${e.venue}`;
    return `${open(W, H, label, 'art--poster')}<defs>${xerox(id)}</defs><rect width="${W}" height="${H}" fill="${bg}"/>${art}${extra}${title}${frame}</svg>`;
  }

  /* ---------------------------------------------------------------- cover */
  function cover(r) {
    const id = ++uid, W = 500, H = 500, R = rng(r.cat), st = (r.cover && r.cover.style) || 'dots';
    let bg, fg, art = '';
    if (st === 'dots') {
      bg = C.paper; fg = C.ink;
      art = halftone(W, H, 15, (x, y) => clamp((x + y) / (W + H) * 1.35 - 0.2, 0, 1) * (0.8 + 0.2 * R()), fg) +
        `<circle cx="372" cy="128" r="70" fill="${C.red}"/>`;
    } else if (st === 'stripes') {
      bg = C.ink; fg = C.paper;
      for (let y = 70; y < H;) { const h = 1 + (y / H) * 20; art += `<rect x="0" y="${f(y)}" width="${W}" height="${f(h)}" fill="${fg}"/>`; y += h + 6; }
      art += `<rect x="318" y="0" width="70" height="${H}" fill="${C.red}"/>`;
    } else if (st === 'rings') {
      bg = C.red; fg = C.ink;
      for (let r2 = 60; r2 < 360; r2 += 6 + R() * 10) art += `<circle cx="250" cy="250" r="${f(r2)}" fill="none" stroke="${fg}" stroke-width="${f(0.8 + R() * 3.5)}"/>`;
      art += `<circle cx="250" cy="250" r="52" fill="${C.paper}"/><circle cx="250" cy="250" r="5" fill="${fg}"/>`;
    } else if (st === 'grid') {
      bg = C.paper; fg = C.ink;
      const n = 8, cs = 420 / n;
      for (let i = 0; i < n * n; i++) {
        const c = i % n, rw = Math.floor(i / n), on = rw === 5 ? (c % 2 === 0) : R() < 0.28;
        if (on) art += `<rect x="${f(40 + c * cs + 3)}" y="${f(60 + rw * cs + 3)}" width="${f(cs - 6)}" height="${f(cs - 6)}" fill="${rw === 5 ? C.blue : fg}"/>`;
        else art += `<rect x="${f(40 + c * cs + 3)}" y="${f(60 + rw * cs + 3)}" width="${f(cs - 6)}" height="${f(cs - 6)}" fill="none" stroke="${fg}" stroke-width="1"/>`;
      }
    } else { /* bignum */
      bg = C.blue; fg = C.paper;
      const num = (r.cat.match(/\d+/) || ['0'])[0];
      art = `<text class="pt" x="24" y="470" font-size="430" textLength="452" lengthAdjust="spacingAndGlyphs" fill="${fg}" filter="url(#xr${id})">${esc(num)}</text>`;
    }
    const top = `<rect x="0" y="0" width="${W}" height="44" fill="${bg}"/>` + mono(r.cat, 24, 30, { fill: fg }) + mono('META SAMA REC.', 476, 30, { fill: fg, anchor: 'end' });
    return `${open(W, H, `Cover: ${r.artist} — ${r.title}`, 'art--cover')}<defs>${xerox(id, 3)}</defs><rect width="${W}" height="${H}" fill="${bg}"/>${art}${top}</svg>`;
  }

  /* ------------------------------------------------------------- portrait */
  function portrait(a, i) {
    const W = 400, H = 500, R = rng(a.name), dark = i % 2 === 1;
    const bg = dark ? C.ink : C.paper, fg = dark ? C.paper : C.ink;
    const hx = 200 + (R() - 0.5) * 50, hy = 196 + (R() - 0.5) * 24, hrx = 78 + R() * 18, hry = 98 + R() * 14;
    const srx = 170 + R() * 40, sry = 150;
    const art = halftone(W, H, 11, (x, y) => {
      const e1 = 1 - (((x - hx) / hrx) ** 2 + ((y - hy) / hry) ** 2);
      const e2 = 1 - (((x - 200) / srx) ** 2 + ((y - 480) / sry) ** 2);
      const v = Math.max(e1, e2);
      if (v <= 0) return 0;
      return Math.pow(clamp(v * 2.4, 0, 1), 0.6) * (0.5 + 0.5 * (1 - x / W)) * (0.85 + 0.15 * R());
    }, fg);
    const bar = `<rect x="${f(hx - hrx - 26)}" y="${f(hy - 22)}" width="${f(hrx * 2 + 52)}" height="34" fill="${C.red}"/>` +
      mono(a.name.toUpperCase(), f(hx), f(hy + 0), { fill: C.ink, anchor: "middle", size: 15 });
    return `${open(W, H, `Portrait placeholder: ${a.name}`, 'art--portrait')}<rect width="${W}" height="${H}" fill="${bg}"/>${art}${bar}${mono(String(i + 1).padStart(2, '0'), 20, 34, { fill: fg })}</svg>`;
  }

  window.Posters = { event: eventPoster, cover, portrait, esc };
})();

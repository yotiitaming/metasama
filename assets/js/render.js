/* ==========================================================================
   Renders data/content.js into the page.
   ========================================================================== */
(function () {
  'use strict';
  const D = window.METASAMA, P = window.Posters;
  if (!D || !P) return;

  const $ = (s, r) => (r || document).querySelector(s);
  const esc = P.esc;
  const fmt = (d, o) => new Intl.DateTimeFormat('en-GB', Object.assign({ timeZone: 'Europe/London' }, o)).format(d);
  const ddmm = (d) => `${fmt(d, { day: '2-digit' })}.${fmt(d, { month: '2-digit' })}`;
  const dow = (d) => fmt(d, { weekday: 'short' }).toUpperCase();
  const lineupHTML = (s) => esc(s).replace(/\s+b2b\s+/gi, ' <em>b2b</em> ').replace(/\((.+?)\)/g, '<em>$1</em>');
  const posterHTML = (e, opt) => (e.poster && e.poster.image)
    ? `<img src="${esc(e.poster.image)}" alt="Poster: ${esc(e.title)} ${esc(e.edition || '')}" loading="lazy" decoding="async">`
    : P.event(e, opt);

  const now = new Date();
  const all = D.events
    .map((e) => Object.assign({}, e, { _d: new Date(e.date), _end: new Date(e.end || e.date) }))
    .sort((a, b) => a._d - b._d);
  const upcoming = all.filter((e) => e._end >= now);
  const past = all.filter((e) => e._end < now).reverse();
  const next = upcoming[0];

  /* ---- ticker ---- */
  const tk = $('[data-ticker]');
  if (tk) {
    const items = next
      ? [`Next → ${next.title} ${next.edition}`, `${dow(next._d)} ${fmt(next._d, { day: 'numeric', month: 'long' })}`, `${next.venue}, ${next.area}`].concat(next.lineup, ['Doors ' + next.doors])
      : ['New dates soon', 'Stay locked'];
    const chunk = items.map((t) => `<span>${esc(t)}</span><span class="ticker__sep">✶</span>`).join('');
    tk.innerHTML = `<div class="ticker__track">${chunk}${chunk}</div>`;
  }

  /* ---- next event ---- */
  const nx = $('[data-next]');
  if (nx) {
    if (!next) {
      nx.innerHTML = '<p class="next__empty">No dates announced yet. Get on the mailing list and you\'ll hear first.</p>';
    } else {
      nx.innerHTML = `
        <div class="next__poster" data-reveal>
          <figure class="poster" data-tilt style="--rot:-2.5deg">
            <span class="tape" aria-hidden="true"></span>
            ${posterHTML(next)}
          </figure>
        </div>
        <div class="next__info">
          <p class="next__when" data-reveal>
            <span class="next__date">${ddmm(next._d)}</span>
            <span class="next__dow mono">${dow(next._d)}<br>${fmt(next._d, { year: 'numeric' })}<br>${esc(next.doors)}</span>
          </p>
          <h3 class="next__title" data-reveal>${esc(next.title)} <span class="next__ed">${esc(next.edition)}</span></h3>
          <p class="next__blurb" data-reveal>${esc(next.blurb || '')}</p>
          <ul class="lineup" data-reveal aria-label="Line-up">${next.lineup.map((l) => `<li>${lineupHTML(l)}</li>`).join('')}</ul>
          <dl class="facts mono" data-reveal>
            <dt>Where</dt><dd>${esc(next.venue)}, ${esc(next.area)}</dd>
            <dt>When</dt><dd>${dow(next._d)} ${fmt(next._d, { day: 'numeric', month: 'long' })}, ${esc(next.doors)}</dd>
            <dt>Entry</dt><dd>${esc(next.price || '')}</dd>
          </dl>
          <div class="next__cta" data-reveal>
            <a class="btn" href="${esc(next.tickets || '#contact')}">Get tickets <span aria-hidden="true">↗</span></a>
            <p class="countdown mono" data-countdown="${next._d.toISOString()}"></p>
          </div>
        </div>`;
    }
  }

  /* ---- agenda (rest of upcoming) ---- */
  const ag = $('[data-agenda]');
  if (ag) {
    const rest = upcoming.slice(1);
    ag.innerHTML = rest.length
      ? rest.map((e) => `
        <li data-reveal>
          <a class="agenda__row" href="${esc(e.tickets || '#events')}">
            <span class="agenda__date mono">${dow(e._d)} ${ddmm(e._d)}</span>
            <span class="agenda__title">${esc(e.title)} <em>${esc(e.edition)}</em></span>
            <span class="agenda__where mono">${esc(e.venue)} — ${esc(e.area)}</span>
            <span class="agenda__arrow" aria-hidden="true">→</span>
          </a>
        </li>`).join('')
      : '<li class="agenda__row mono">More dates soon.</li>';
  }

  /* ---- releases ---- */
  const rl = $('[data-releases]');
  if (rl) {
    rl.innerHTML = D.releases.map((r, i) => {
      const href = r.bandcamp || r.soundcloud || '#music';
      const links = [r.bandcamp && `<a href="${esc(r.bandcamp)}">Bandcamp ↗</a>`, r.soundcloud && `<a href="${esc(r.soundcloud)}">SoundCloud ↗</a>`].filter(Boolean).join('');
      return `
        <article class="release hs__panel" style="--i:${i}">
          <a class="release__cover" href="${esc(href)}" aria-label="Listen: ${esc(r.artist)} — ${esc(r.title)}">
            ${r.image ? `<img src="${esc(r.image)}" alt="" loading="lazy" decoding="async">` : P.cover(r)}
            <span class="release__play mono" aria-hidden="true">▶ Play</span>
          </a>
          <p class="release__meta mono"><span>${esc(r.cat)}</span><span>${esc(r.format)}</span><span>${esc(r.year)}</span></p>
          <h3 class="release__title">${esc(r.title)}</h3>
          <p class="release__artist">${esc(r.artist)}</p>
          <p class="release__links mono">${links}</p>
        </article>`;
    }).join('');
  }

  /* ---- featured mix ---- */
  const mx = $('[data-mix]');
  if (mx && D.featuredMix) {
    const m = D.featuredMix;
    mx.innerHTML = `
      <p class="mono mix__kicker">Mix of the month</p>
      <h3 class="mix__title">${esc(m.title)}</h3>
      <p class="mono mix__meta">${esc(m.meta)}</p>
      <div class="mix__player" data-embed="${esc(m.soundcloud ? 'https://w.soundcloud.com/player/?url=' + encodeURIComponent(m.soundcloud) + '&color=%23ff3b1f&auto_play=true&hide_related=true&show_comments=false&visual=false' : '')}">
        <button class="mix__btn" type="button"><span aria-hidden="true">▶</span> Load player</button>
        <p class="mono mix__note">${m.soundcloud ? 'Loads SoundCloud (third-party).' : 'Add a SoundCloud URL in data/content.js'}</p>
      </div>`;
  }

  /* ---- artists ---- */
  const ro = $('[data-roster]');
  if (ro) {
    ro.innerHTML = D.artists.map((a, i) => `
      <li class="artist" data-artist="${i}" data-reveal>
        <span class="artist__num mono">${String(i + 1).padStart(2, '0')}</span>
        <span class="artist__thumb" aria-hidden="true">${a.image ? `<img src="${esc(a.image)}" alt="">` : P.portrait(a, i)}</span>
        <h3 class="artist__name">${esc(a.name)}</h3>
        <p class="artist__roles mono">${a.roles.map(esc).join(' / ')}</p>
        <p class="artist__area mono">${esc(a.area)}</p>
        <p class="artist__bio visually-hidden">${esc(a.bio)}</p>
      </li>`).join('');
  }

  /* ---- archive collage ---- */
  const ar = $('[data-archive]');
  if (ar) {
    const slots = [[1, 4, -6], [19, 30, 4], [38, 2, -2], [57, 24, 7], [77, 4, -8], [6, 56, 3], [44, 56, -4], [70, 54, 5]];
    const flyers = past.slice(0, slots.length).map((e, i) => {
      const [x, y, r] = slots[i];
      return `
        <figure class="flyer" data-drag style="--x:${x}%;--y:${y}%;--r:${r}deg">
          ${posterHTML(e, { small: true })}
          <figcaption class="mono">${esc(e.title)} ${esc(e.edition || '')} — ${ddmm(e._d)}.${fmt(e._d, { year: '2-digit' })}</figcaption>
        </figure>`;
    }).join('');
    const sSlots = [[30, 24, -10], [62, 8, 6], [14, 48, 4], [82, 50, -5], [52, 88, -3]];
    const scraps = (D.archiveScraps || []).slice(0, sSlots.length).map((t, i) => {
      const [x, y, r] = sSlots[i];
      return `<p class="scrap scrap--${i % 3}" data-drag style="--x:${x}%;--y:${y}%;--r:${r}deg">${esc(t)}</p>`;
    }).join('');
    ar.innerHTML = flyers + scraps;
  }

  /* ---- contact ---- */
  const ct = $('[data-contact]');
  if (ct) {
    ct.innerHTML = D.contact.map((c) => `
      <li data-reveal>
        <a class="contact__row" href="mailto:${esc(c.email)}">
          <span class="contact__label">${esc(c.label)}</span>
          <span class="contact__desc">${esc(c.desc)}</span>
          <span class="contact__mail mono">${esc(c.email)} <span aria-hidden="true">↗</span></span>
        </a>
      </li>`).join('');
  }
  const so = $('[data-socials]');
  if (so) so.innerHTML = D.socials.map((s) => `<li><a href="${esc(s.url)}" rel="me noopener" target="_blank">${esc(s.label)}</a></li>`).join('');

  /* ---- structured data for upcoming events ---- */
  if (upcoming.length) {
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify(upcoming.map((e) => ({
      '@context': 'https://schema.org', '@type': 'MusicEvent',
      name: `${e.title} ${e.edition || ''}`.trim(), startDate: e.date, endDate: e.end,
      location: { '@type': 'Place', name: e.venue, address: `${e.area}, London` },
      performer: e.lineup.map((n) => ({ '@type': 'PerformingGroup', name: n.replace(/\s*\(.*?\)/g, '') })),
      organizer: { '@type': 'Organization', name: 'META SAMA' },
      description: e.blurb || ''
    })));
    document.head.appendChild(ld);
  }
})();

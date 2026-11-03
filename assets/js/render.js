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
  const tba = (v, label) => v ? esc(v) : `<span class="tba">${label || 'TBA'}</span>`;
  const ext = (url) => /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : '';
  const L = D.links || {};

  /* ---- ticker ---- */
  const tk = $('[data-ticker]');
  if (tk) {
    const items = ['Sounds of the Eclectic', 'Interstellar Galactic Music Collective', 'Eclectic Mobilisation', 'Sound Shred', 'Beat Sessions', 'London']
      .concat(D.members.map((m) => m.name));
    const chunk = items.map((t) => `<span>${esc(t)}</span><span class="ticker__sep">✶</span>`).join('');
    tk.innerHTML = `<div class="ticker__track">${chunk}${chunk}</div>`;
  }

  /* ---- featured event ---- */
  const e = D.featuredEvent;
  const nx = $('[data-next]');
  if (nx && e) {
    const d = e.date ? new Date(e.date) : null;
    const poster = e.poster && e.poster.image
      ? `<img src="${esc(e.poster.image)}" alt="Poster: ${esc(e.title)} ${esc(e.edition)}" loading="lazy" decoding="async">`
      : P.event(e, { mark: e.edition ? '' : 'TBA', label: `Placeholder poster: ${e.title}` });
    nx.innerHTML = `
      <div class="next__poster" data-reveal>
        <figure class="poster" data-tilt style="--rot:-2.5deg">
          <span class="tape" aria-hidden="true"></span>
          ${poster}
          ${e.poster && e.poster.image ? '' : '<figcaption class="ph-label mono">Placeholder poster</figcaption>'}
        </figure>
      </div>
      <div class="next__info">
        <p class="next__when" data-reveal>
          <span class="next__date">${d ? ddmm(d) : 'TBA'}</span>
          <span class="next__dow mono">${d ? `${dow(d)}<br>${fmt(d, { year: 'numeric' })}` : 'Date<br>to be<br>announced'}</span>
        </p>
        <h3 class="next__title" data-reveal>${esc(e.title)} <span class="next__ed">${e.edition ? esc(e.edition) : 'Next edition'}</span></h3>
        <p class="next__blurb" data-reveal>${esc(e.blurb || '')}</p>
        <div class="lineup" data-reveal>
          <p class="mono lineup__label">Line-up</p>
          ${e.lineup && e.lineup.length
            ? `<ul>${e.lineup.map((l) => `<li>${lineupHTML(l)}</li>`).join('')}</ul>`
            : '<ul><li class="lineup--tba">To be <em>announced</em></li></ul>'}
        </div>
        <dl class="facts mono" data-reveal>
          <dt>Where</dt><dd>${tba(e.venue, 'Venue TBA')}${e.area ? ' — ' + esc(e.area) : ''}</dd>
          <dt>When</dt><dd>${d ? `${dow(d)} ${fmt(d, { day: 'numeric', month: 'long' })}` : '<span class="tba">Date TBA</span>'}${e.doors ? ', ' + esc(e.doors) : ''}</dd>
          <dt>Entry</dt><dd>${tba(e.price, 'TBA')}</dd>
        </dl>
        <div class="next__cta" data-reveal>
          <a class="btn" href="${esc(e.link || L.linktree || '#contact')}"${ext(e.link || L.linktree)}>${esc(e.linkLabel || 'Info')} <span aria-hidden="true">↗</span></a>
          ${d ? `<p class="countdown mono" data-countdown="${d.toISOString()}"></p>` : '<p class="countdown mono">Follow @metasamasoundsystem for the announcement</p>'}
        </div>
      </div>`;
  }

  /* ---- series list ---- */
  const ag = $('[data-agenda]');
  if (ag && D.series) {
    ag.innerHTML = D.series.map((s) => `
      <li data-reveal>
        <a class="agenda__row" href="${esc(s.link || '#events')}"${ext(s.link)}>
          <span class="agenda__date mono">Series</span>
          <span class="agenda__title">${esc(s.title)}</span>
          <span class="agenda__where mono">${esc(s.note)}</span>
          <span class="agenda__arrow" aria-hidden="true">↗</span>
        </a>
      </li>`).join('');
  }

  /* ---- members ---- */
  const mb = $('[data-members]');
  if (mb) {
    const n = D.members.length;
    mb.innerHTML = D.members.map((m, i) => {
      const id = `member-${i + 1}`;
      const fit = (100 / (Math.max(4, m.name.length) * 0.5)).toFixed(2);
      const photo = m.photo
        ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" loading="lazy" decoding="async" style="object-position:${esc(m.focus || '50% 40%')}">`
        : `<span class="member__nophoto"><span class="mono">Photo to come</span></span>`;
      const links = (m.links || []).length
        ? m.links.map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join('')
        : '<span class="tba">Links TBA</span>';
      return `
        <article class="member member--${i + 1}" data-member data-reveal aria-labelledby="${id}-name">
          <button class="member__hit" type="button" aria-expanded="false" aria-controls="${id}-panel">
            <span class="member__num mono">${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span>
            <span class="member__photo">${photo}</span>
            <span class="member__name" id="${id}-name" style="--fit:${fit}">${esc(m.name)}</span>
            <span class="member__more mono" aria-hidden="true">+ Info</span>
          </button>
          <div class="member__panel" id="${id}-panel">
            <p class="mono member__panel-name">${esc(m.name)}</p>
            <p class="member__bio">${m.bio ? esc(m.bio) : '<span class="tba">Biography coming soon.</span>'}</p>
            <p class="member__links mono">${links}</p>
          </div>
        </article>`;
    }).join('');
  }

  /* ---- music slots ---- */
  const mu = $('[data-music]');
  if (mu) {
    mu.innerHTML = D.music.map((r, i) => {
      const href = r.url || L.linktree || '#music';
      return `
        <article class="release hs__panel" style="--i:${i}">
          <a class="release__cover" href="${esc(href)}"${ext(href)} aria-label="${esc(r.type)}${r.title ? ': ' + esc(r.title) : ' (placeholder)'}">
            ${r.image ? `<img src="${esc(r.image)}" alt="" loading="lazy" decoding="async">` : P.cover({ id: r.id, label: r.type.toUpperCase(), mark: String(i + 1).padStart(2, '0'), cover: r.cover })}
            <span class="release__play mono" aria-hidden="true">▶ Listen</span>
          </a>
          <p class="release__meta mono"><span>${String(i + 1).padStart(2, '0')}</span><span>${esc(r.type)}</span></p>
          <h3 class="release__title">${r.title ? esc(r.title) : '<span class="tba-big">Title TBA</span>'}</h3>
          <p class="release__artist">${r.artist ? esc(r.artist) : 'Artist TBA'}</p>
          <p class="release__links mono">${r.embed ? `<button type="button" class="embed-btn" data-embed-src="${esc(r.embed)}">▶ Load player</button>` : '<span class="tba">SoundCloud / Bandcamp embed slot</span>'}</p>
        </article>`;
    }).join('');
  }

  /* ---- archive collage ---- */
  const ar = $('[data-archive]');
  if (ar) {
    const slots = [[1, 3, -6], [20, 28, 4], [39, 2, -2], [58, 26, 6], [78, 4, -8], [8, 58, 3], [46, 60, -4], [70, 56, 5]];
    const items = D.archive.slice(0, slots.length).map((a, i) => {
      const [x, y, r] = slots[i];
      let body;
      if (a.image) body = `<img src="${esc(a.image)}" alt="${esc(a.caption)}" loading="lazy" decoding="async">`;
      else if (a.kind === 'flyer') body = P.event({ id: 'arch' + i, title: a.title || 'Sound Shred', area: 'London', poster: { style: a.style || 'shred' } }, { small: true, mark: 'TBA', label: `Placeholder flyer: ${a.caption}` });
      else body = `<span class="ph ph--${a.kind}"><span class="mono">${a.kind === 'video' ? '▶ Video to come' : 'Photo to come'}</span></span>`;
      return `
        <figure class="flyer flyer--${a.kind}" data-drag style="--x:${x}%;--y:${y}%;--r:${r}deg">
          ${body}
          <figcaption class="mono">${esc(a.caption)}${a.image ? '' : ' — placeholder'}</figcaption>
        </figure>`;
    }).join('');
    const sSlots = [[30, 22, -10], [63, 7, 6], [14, 48, 4], [84, 52, -5], [36, 90, -3]];
    const scraps = (D.archiveScraps || []).slice(0, sSlots.length).map((t, i) => {
      const [x, y, r] = sSlots[i];
      return `<p class="scrap scrap--${i % 3}" data-drag style="--x:${x}%;--y:${y}%;--r:${r}deg">${esc(t)}</p>`;
    }).join('');
    ar.innerHTML = items + scraps;
  }

  /* ---- contact ---- */
  const ct = $('[data-contact]');
  if (ct) {
    const rows = [
      { label: 'Instagram', url: L.instagram, handle: '@metasamasoundsystem', desc: 'Bookings, collaborations, event enquiries and artist submissions.' },
      { label: 'Linktree', url: L.linktree, handle: 'linktr.ee/metasamasoundsystem', desc: 'Music, events and everything else in one place.' }
    ];
    ct.innerHTML = rows.map((c) => `
      <li data-reveal>
        <a class="contact__row" href="${esc(c.url)}" target="_blank" rel="noopener">
          <span class="contact__label">${esc(c.label)}</span>
          <span class="contact__desc">${esc(c.desc)}</span>
          <span class="contact__mail mono">${esc(c.handle)} <span aria-hidden="true">↗</span></span>
        </a>
      </li>`).join('');
  }

  /* ---- structured data for a dated featured event ---- */
  if (e && e.date && e.venue) {
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'MusicEvent',
      name: `${e.title} ${e.edition || ''}`.trim(), startDate: e.date,
      location: { '@type': 'Place', name: e.venue, address: `${e.area || ''}, London` },
      organizer: { '@type': 'Organization', name: 'META SAMA SOUNDSYSTEM' }
    });
    document.head.appendChild(ld);
  }
})();

# META SAMA — website

Homepage concept for **META SAMA**, a London underground collective (hip-hop, beatmaking, electronic music, DJ culture, independent artists).

Static HTML + CSS + vanilla JS, with no framework, no build step and no CMS.

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing content

All content lives in **`data/content.js`**: events, releases, featured mix, artists, contact emails and social links.

- **Events** are sorted by date. Once an event's date has passed, it moves to the archive collage on its own.
- **Posters / covers / portraits** are generated (SVG halftone, riso-style) as placeholders.
  To use real artwork, add `poster: { image: 'assets/img/flyer.jpg' }` to an event, `image: '…'` to a release or artist.
- **Mix player**: paste a SoundCloud URL into `featuredMix.soundcloud` to enable the embedded player (it only loads on click).

> ⚠️ Names, venues, dates, emails and links are realistic placeholders. Replace them with real info before going live.

## Structure

```
index.html            page markup (static text, section layout, SEO meta)
data/content.js       all editable content
assets/css/main.css   design system + layout (mobile-first)
assets/js/posters.js  generative posters / covers / portraits
assets/js/render.js   renders content.js into the page (+ Event JSON-LD)
assets/js/main.js     interactions: kinetic type, horizontal scroll, reveals, drag, menu
assets/js/pads.js     "Noise break" drum pads (Web Audio, no samples)
```

## Notes

- Fonts: Archivo (variable width axis), Instrument Serif, Space Mono, via Google Fonts.
- `prefers-reduced-motion` is respected: no grain animation, horizontal scroll falls back to swipe, no kinetic type.
- Deploy on GitHub Pages: Settings → Pages → Deploy from branch `main`, folder `/`.

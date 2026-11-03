# META SAMA SOUNDSYSTEM — website

Homepage for **META SAMA SOUNDSYSTEM**, an Interstellar Galactic Music Collective from London.
*Sounds of the Eclectic. Eclectic Mobilisation.*

Static HTML + CSS + vanilla JS, with no framework, no build step and no CMS. Works on any static host (GitHub Pages, Netlify, shared hosting…).

## Run locally

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing content: `data/content.js`

Everything editable lives in one file:

| Block | What to fill in |
|---|---|
| `members` | `photo`, `bio`, `links: [{ label, url }]` for each artist |
| `featuredEvent` | SOUND SHRED `date`, `venue`, `lineup`, `link`, optional `poster.image` |
| `series` | Event series rows (Sound Shred, Beat Sessions…) |
| `music` | Per category: `title`, `artist`, `url`, `embed` (SoundCloud or Bandcamp URL) |
| `archive` | Flyers / photos / videos: set `image` to a real file |

Empty fields render as clearly labelled placeholders (TBA, "Photo to come", "Placeholder art"). Nothing is invented.

### ⚠️ Photo mapping to check

The supplied photos had no names, so they are assigned **in upload order**:

| File | Assigned to |
|---|---|
| `assets/img/members/photo-1.webp` | Automageddon |
| `assets/img/members/photo-2.webp` | Mangrotin |
| `assets/img/members/photo-3.webp` | Vigi Beats |
| `assets/img/members/photo-4.webp` | Truefunktion |
| `assets/img/members/photo-5.webp` | ELI.P |
| *(missing)* | garagechild |

Swap the `photo` paths in `data/content.js` if any are wrong.

## Brand

- Official logo: `assets/img/meta-sama-logo.svg`, used unmodified (inlined once as a `<symbol>` and recoloured via `fill` only).
- Palette: near-black `#0a0a0a`, off-white `#f3f1ec`, META SAMA red `#ff2a1a`.
- Fonts: Archivo (variable width), Instrument Serif, Space Mono (Google Fonts).

## Structure

```
index.html            markup, SEO meta, inline logo symbol
data/content.js       all editable content
assets/css/main.css   design system + layout (mobile-first)
assets/js/posters.js  generative placeholder posters / covers
assets/js/render.js   renders content.js into the page
assets/js/main.js     interactions: kinetic type, reveals, horizontal scroll, portraits, drag, menu
assets/js/pads.js     "Noise break" drum pads (Web Audio, no samples)
```

`prefers-reduced-motion` is respected.

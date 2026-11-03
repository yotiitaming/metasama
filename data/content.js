/* ==========================================================================
   META SAMA SOUNDSYSTEM — site content
   --------------------------------------------------------------------------
   Everything editable lives here. No build step: edit, save, refresh.

   Anything marked TBA / placeholder is waiting for real information.
   Do not fill it with guesses: leave `null` / '' and the site shows a
   clearly labelled placeholder.
   ========================================================================== */

window.METASAMA = {
  identity: {
    name: 'META SAMA',
    full: 'META SAMA SOUNDSYSTEM',
    description: 'Interstellar Galactic Music Collective',
    philosophy: 'Eclectic Mobilisation',
    tagline: 'Sounds of the Eclectic',
    city: 'London'
  },

  links: {
    instagram: 'https://www.instagram.com/metasamasoundsystem/',
    linktree: 'https://linktr.ee/metasamasoundsystem'
  },

  /* ------------------------------------------------------------------------
     MEMBERS: PHOTO MAPPING
     The supplied photos had no names (1.webp … 5.webp), so they are
     assigned IN UPLOAD ORDER below. Check each name ↔ photo and swap the
     `photo` paths if needed. garagechild has no photo yet: drop a file in
     assets/img/members/ and set its path.
     `bio` and `links` stay empty until the real info is provided.
     ------------------------------------------------------------------------ */
  members: [
    { name: 'Automageddon', photo: 'assets/img/members/photo-1.webp', focus: '50% 35%', bio: '', links: [] },
    { name: 'Mangrotin',    photo: 'assets/img/members/photo-2.webp', focus: '50% 40%', bio: '', links: [] },
    { name: 'Vigi Beats',   photo: 'assets/img/members/photo-3.webp', focus: '50% 40%', bio: '', links: [] },
    { name: 'Truefunktion', photo: 'assets/img/members/photo-4.webp', focus: '45% 40%', bio: '', links: [] },
    { name: 'ELI.P',        photo: 'assets/img/members/photo-5.webp', focus: '50% 35%', bio: '', links: [] },
    { name: 'garagechild',  photo: '',                                 focus: '50% 50%', bio: '', links: [] }
  ],

  /* ------------------------------------------------------------------------
     FEATURED EVENT: SOUND SHRED
     Fill in date (ISO, e.g. '2026-12-05T21:00:00Z'), venue, lineup, link.
     ------------------------------------------------------------------------ */
  featuredEvent: {
    id: 'sound-shred',
    title: 'Sound Shred',
    edition: '',              // e.g. 'Vol.08'
    date: null,               // ISO date string, or null → "Date TBA"
    doors: '',                // e.g. '21:00 — 03:00'
    venue: '',                // → "Venue TBA"
    area: 'London',
    price: '',
    lineup: [],               // → "Line-up TBA"
    link: 'https://linktr.ee/metasamasoundsystem',
    linkLabel: 'Info & tickets',
    blurb: 'The META SAMA event series. Details for the next edition coming soon.',
    poster: { style: 'shred', image: '' }   // set image to a real flyer path
  },

  /* Other event series shown under the featured event. */
  series: [
    { title: 'Sound Shred',   note: 'Event series. Next dates TBA', link: 'https://www.instagram.com/metasamasoundsystem/' },
    { title: 'Beat Sessions', note: 'Dates TBA',                     link: 'https://www.instagram.com/metasamasoundsystem/' }
  ],

  /* ------------------------------------------------------------------------
     MUSIC: one slot per category. Add `title`, `artist`, `url`
     and `embed` (SoundCloud / Bandcamp URL) when real releases exist.
     ------------------------------------------------------------------------ */
  music: [
    { id: 'mu1', type: 'Beats & productions', title: '', artist: '', url: '', embed: '', cover: { style: 'dots' } },
    { id: 'mu2', type: 'DJ mixes',            title: '', artist: '', url: '', embed: '', cover: { style: 'rings' } },
    { id: 'mu3', type: 'Live recordings',     title: '', artist: '', url: '', embed: '', cover: { style: 'stripes' } },
    { id: 'mu4', type: 'Releases',            title: '', artist: '', url: '', embed: '', cover: { style: 'grid' } },
    { id: 'mu5', type: 'Collaborations',      title: '', artist: '', url: '', embed: '', cover: { style: 'bignum' } }
  ],

  /* ------------------------------------------------------------------------
     ARCHIVE: flyers / photos / videos. Leave `image` empty for a
     labelled placeholder. `caption` is shown under each piece.
     ------------------------------------------------------------------------ */
  archive: [
    { kind: 'flyer', image: '', caption: 'Sound Shred flyer', style: 'shred' },
    { kind: 'photo', image: '', caption: 'Event photo' },
    { kind: 'flyer', image: '', caption: 'Beat Session flyer', title: 'Beat Session', style: 'beats' },
    { kind: 'video', image: '', caption: 'Video' },
    { kind: 'flyer', image: '', caption: 'Sound Shred flyer', style: 'type' },
    { kind: 'photo', image: '', caption: 'Event photo' },
    { kind: 'flyer', image: '', caption: 'Flyer', style: 'rings' }
  ],

  archiveScraps: ['Sounds of the eclectic', 'Eclectic mobilisation', 'Interstellar', 'Galactic', 'London']
};

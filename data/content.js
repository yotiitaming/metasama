/* ==========================================================================
   META SAMA — site content
   --------------------------------------------------------------------------
   Everything editable lives here: events, releases, artists, contact.
   No build step — edit, save, refresh.

   ⚠ PLACEHOLDER CONTENT: names, venues, dates, emails and links below are
   realistic stand-ins for the concept. Replace them with the real info.

   EVENTS
   - Events are sorted by date automatically.
   - Anything whose `end` (or `date`) is in the past moves to the archive.
   - `poster.style`: 'shred' | 'beats' | 'live' | 'type' | 'rings'
     (generated posters — or set `poster.image` to a real flyer path).
   - In `lineup`, "(live)" and " b2b " are typeset in italic automatically.
   ========================================================================== */

window.METASAMA = {
  contact: [
    { label: 'Bookings', email: 'bookings@metasama.co.uk', desc: 'DJ sets, live shows, club nights, festivals.' },
    { label: 'Collabs',  email: 'hello@metasama.co.uk',    desc: 'Venues, labels, crews, brands with taste.' },
    { label: 'Demos',    email: 'demos@metasama.co.uk',    desc: 'Send links, not attachments. We listen to everything.' }
  ],

  socials: [
    { label: 'Instagram',  url: 'https://www.instagram.com/' },
    { label: 'SoundCloud', url: 'https://soundcloud.com/' },
    { label: 'Bandcamp',   url: 'https://bandcamp.com/' },
    { label: 'YouTube',    url: 'https://www.youtube.com/' },
    { label: 'Mixcloud',   url: 'https://www.mixcloud.com/' }
  ],

  events: [
    /* ---- upcoming ---- */
    {
      id: 'ss07', title: 'Sound Shred', edition: 'Vol.07',
      date: '2026-11-14T22:00:00Z', end: '2026-11-15T05:00:00Z',
      venue: 'Railway Arch 212', area: 'Hackney Wick, E9',
      doors: '22:00 — 05:00', price: '£8 adv / £12 OTD', tickets: '#',
      lineup: ['Okra', 'K.Olu (live)', 'Sister Tape', 'Trash Oracle b2b Mo Dust'],
      blurb: 'Seven hours of boom-bap, broken beat, jungle and whatever else gets pulled out of the crates. Low ceiling, stupidly loud rig, no phones on the front row.',
      poster: { style: 'shred', accent: '#ff3b1f' }
    },
    {
      id: 'bs13', title: 'Beat Session', edition: '#13',
      date: '2026-11-26T19:00:00Z', end: '2026-11-26T23:00:00Z',
      venue: 'The Basement', area: 'Deptford, SE8',
      doors: '19:00 — 23:00', price: 'Free — bring a beat', tickets: '#',
      lineup: ['Open decks', 'Hosted by K.Olu'],
      blurb: 'Producers bring a USB, we play it loud. Feedback circle, sample swap, no egos.',
      poster: { style: 'beats', accent: '#ff3b1f' }
    },
    {
      id: 'lr03', title: 'Live Room', edition: '03',
      date: '2026-12-12T20:00:00Z', end: '2026-12-13T02:00:00Z',
      venue: 'Unit 4', area: 'Peckham, SE15',
      doors: '20:00 — 02:00', price: '£10', tickets: '#',
      lineup: ['Bassline Bibi (live)', 'Sister Tape (live)', 'Okra'],
      blurb: 'Hardware only. Samplers, drum machines, tape loops, a bassline that rearranges your organs.',
      poster: { style: 'live', accent: '#ff3b1f' }
    },

    /* ---- past (auto-archived) ---- */
    { id: 'bs12', title: 'Beat Session', edition: '#12', date: '2026-10-29T19:00:00Z', venue: 'The Basement', area: 'Deptford, SE8', lineup: ['Open decks'], poster: { style: 'beats', accent: '#2a3bff' } },
    { id: 'ss06', title: 'Sound Shred', edition: 'Vol.06', date: '2026-09-19T22:00:00Z', venue: 'Railway Arch 212', area: 'Hackney Wick, E9', lineup: ['Okra', 'Mo Dust', 'K.Olu'], poster: { style: 'type', accent: '#ff3b1f' } },
    { id: 'ss05', title: 'Sound Shred', edition: 'Vol.05', date: '2026-06-06T22:00:00Z', venue: 'Unit 4', area: 'Peckham, SE15', lineup: ['Trash Oracle', 'Sister Tape'], poster: { style: 'rings' } },
    { id: 'lr02', title: 'Live Room', edition: '02', date: '2026-04-18T20:00:00Z', venue: 'Unit 4', area: 'Peckham, SE15', lineup: ['Bassline Bibi', 'K.Olu'], poster: { style: 'live', accent: '#2a3bff' } },
    { id: 'ss04', title: 'Sound Shred', edition: 'Vol.04', date: '2026-02-14T22:00:00Z', venue: 'Railway Arch 212', area: 'Hackney Wick, E9', lineup: ['Okra', 'Trash Oracle'], poster: { style: 'shred', accent: '#2a3bff' } },
    { id: 'bs09', title: 'Beat Session', edition: '#09', date: '2025-11-20T19:00:00Z', venue: 'The Basement', area: 'Deptford, SE8', lineup: ['Open decks'], poster: { style: 'type', accent: '#2a3bff' } }
  ],

  releases: [
    { cat: 'MSR-014', title: 'Concrete Lullabies', artist: 'K.Olu', format: '12" EP', year: 2026, cover: { style: 'dots' }, bandcamp: '#', soundcloud: '#' },
    { cat: 'MSR-013', title: 'Dust on the Needle', artist: 'Sister Tape', format: 'Beat tape', year: 2026, cover: { style: 'stripes' }, bandcamp: '#' },
    { cat: 'MIX-031', title: 'Live at Sound Shred 06', artist: 'Okra', format: 'Mix — 92 min', year: 2026, cover: { style: 'rings' }, soundcloud: '#' },
    { cat: 'MSR-012', title: 'Pirate Weather', artist: 'Trash Oracle', format: 'LP', year: 2025, cover: { style: 'grid' }, bandcamp: '#', soundcloud: '#' },
    { cat: 'MSR-011', title: 'Sound Shred Vol.1', artist: 'Various Artists', format: 'Compilation', year: 2025, cover: { style: 'bignum' }, bandcamp: '#' }
  ],

  /* Paste a SoundCloud track/playlist URL to enable the embedded player. */
  featuredMix: {
    title: 'Okra — Live at Sound Shred 06',
    meta: '92 min · boom-bap / jungle / broken beat',
    soundcloud: ''
  },

  artists: [
    { name: 'Okra',          roles: ['DJ', 'Selector'],   area: 'Peckham',      bio: 'Boom-bap to footwork in one breath. Resident since day one.' },
    { name: 'K.Olu',         roles: ['Producer', 'Live'], area: 'Lewisham',     bio: 'MPC, tape delay and a lot of patience.' },
    { name: 'Sister Tape',   roles: ['Producer', 'DJ'],   area: 'Walthamstow',  bio: 'Beat tapes recorded straight to cassette.' },
    { name: 'Trash Oracle',  roles: ['DJ', 'Radio'],      area: 'Hackney Wick', bio: 'Pirate-radio energy, jungle in the bloodstream.' },
    { name: 'Bassline Bibi', roles: ['Live', 'Bass'],     area: 'Croydon',      bio: 'Sub-heavy live sets, all hardware, no laptop.' },
    { name: 'Mo Dust',       roles: ['DJ', 'Flyers'],     area: 'Deptford',     bio: 'Digs records by day, draws the flyers by night.' }
  ],

  archiveScraps: ['Sold out', 'Bring earplugs', 'No photos on the floor', 'Last train 00:32', 'Thank you Deptford']
};

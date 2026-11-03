/* ==========================================================================
   Noise break — 8 synthesised drum pads + a boom-bap loop (Web Audio, no samples).
   ========================================================================== */
(function () {
  'use strict';
  const wrap = document.querySelector('[data-pads]');
  if (!wrap) return;

  let ctx, out, noise;
  function ac() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      const comp = ctx.createDynamicsCompressor();
      out = ctx.createGain(); out.gain.value = 0.7;
      out.connect(comp); comp.connect(ctx.destination);
      noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
      const d = noise.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  const env = (g, t, a, peak, dec) => { g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(peak, t + a); g.gain.exponentialRampToValueAtTime(0.0001, t + dec); };
  function osc(type, freq, t, dur, peak, to) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur * 0.4);
    env(g, t, 0.003, peak, dur); o.connect(g); g.connect(out); o.start(t); o.stop(t + dur + 0.05);
    return g;
  }
  function nz(t, dur, peak, type, freq, q) {
    const s = ctx.createBufferSource(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
    s.buffer = noise; fl.type = type; fl.frequency.value = freq; if (q) fl.Q.value = q;
    env(g, t, 0.002, peak, dur); s.connect(fl); fl.connect(g); g.connect(out); s.start(t); s.stop(t + dur + 0.05);
  }

  const voices = {
    kick:  (t) => osc('sine', 160, t, 0.5, 1, 42),
    snare: (t) => { nz(t, 0.2, 0.7, 'bandpass', 1900, 0.8); osc('triangle', 190, t, 0.12, 0.45, 150); },
    hat:   (t) => nz(t, 0.05, 0.3, 'highpass', 7500),
    open:  (t) => nz(t, 0.35, 0.25, 'highpass', 7000),
    clap:  (t) => { [0, 0.011, 0.023].forEach((o) => nz(t + o, 0.03, 0.5, 'bandpass', 1300, 1.2)); nz(t + 0.03, 0.22, 0.4, 'bandpass', 1300, 1.2); },
    rim:   (t) => { osc('square', 820, t, 0.03, 0.25); nz(t, 0.02, 0.3, 'bandpass', 3000, 3); },
    bass:  (t) => {
      const o = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain();
      o.type = 'sawtooth'; o.frequency.setValueAtTime(55, t); fl.type = 'lowpass'; fl.frequency.setValueAtTime(900, t); fl.frequency.exponentialRampToValueAtTime(120, t + 0.4);
      env(g, t, 0.005, 0.55, 0.6); o.connect(fl); fl.connect(g); g.connect(out); o.start(t); o.stop(t + 0.7);
    },
    stab:  (t) => [261.6, 311.1, 392, 466.2].forEach((fq) => osc('sawtooth', fq, t, 0.28, 0.09))
  };

  const pads = [
    ['kick', 'Kick', 'Q'], ['snare', 'Snare', 'W'], ['hat', 'Hat', 'E'], ['open', 'Open hat', 'R'],
    ['clap', 'Clap', 'A'], ['rim', 'Rim', 'S'], ['bass', 'Sub', 'D'], ['stab', 'Stab', 'F']
  ];
  wrap.innerHTML = pads.map(([id, name, key]) =>
    `<button type="button" class="pad" data-voice="${id}" aria-keyshortcuts="${key}"><span class="pad__key mono">${key}</span><span class="pad__name">${name}</span></button>`).join('');
  const byVoice = {};
  wrap.querySelectorAll('.pad').forEach((b) => { byVoice[b.dataset.voice] = b; });

  function flash(v) {
    const b = byVoice[v]; if (!b) return;
    b.classList.remove('hit'); void b.offsetWidth; b.classList.add('hit');
    document.dispatchEvent(new CustomEvent('ms:hit', { detail: v }));
  }
  function hit(v, when) {
    if (!ac()) return;
    const t = when || ctx.currentTime;
    voices[v](t);
    const delay = Math.max(0, (t - ctx.currentTime) * 1000);
    setTimeout(() => flash(v), delay);
  }

  wrap.addEventListener('pointerdown', (e) => {
    const b = e.target.closest('.pad'); if (!b) return;
    hit(b.dataset.voice);
  });
  wrap.addEventListener('keydown', (e) => {
    const b = e.target.closest('.pad');
    if (b && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); hit(b.dataset.voice); }
  });

  const keys = {}; pads.forEach(([id, , k]) => { keys[k.toLowerCase()] = id; });
  let armed = false;
  const section = wrap.closest('section');
  if ('IntersectionObserver' in window && section) {
    new IntersectionObserver((en) => { armed = en[0].isIntersecting; }, { threshold: 0.35 }).observe(section);
  }
  document.addEventListener('keydown', (e) => {
    if (!armed || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
    const v = keys[e.key.toLowerCase()]; if (v) hit(v);
  });

  /* ---- boom-bap loop, 90 BPM, lookahead scheduler ---- */
  const pattern = {
    kick:  [1,0,0,1, 0,0,0,0, 0,0,1,0, 0,0,0,0],
    snare: [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0],
    hat:   [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,0,0],
    open:  [0,0,0,0, 0,0,0,0, 0,0,0,0, 0,0,1,0],
    bass:  [1,0,0,0, 0,0,0,0, 0,0,1,0, 0,0,0,0]
  };
  const loopBtn = document.querySelector('[data-loop]');
  const stepEl = document.querySelector('[data-steps]');
  if (stepEl) stepEl.innerHTML = Array.from({ length: 16 }, () => '<i></i>').join('');
  const stepDots = stepEl ? stepEl.querySelectorAll('i') : [];
  let timer = null, step = 0, nextT = 0;
  const bpm = 90, sixteenth = 60 / bpm / 4;

  function schedule() {
    while (nextT < ctx.currentTime + 0.12) {
      const swing = step % 2 ? sixteenth * 0.18 : 0;
      Object.keys(pattern).forEach((v) => { if (pattern[v][step]) hit(v, nextT + swing); });
      const s = step, d = Math.max(0, (nextT - ctx.currentTime) * 1000);
      setTimeout(() => stepDots.forEach((el, i) => el.classList.toggle('on', i === s)), d);
      nextT += sixteenth; step = (step + 1) % 16;
    }
  }
  function stop() {
    clearInterval(timer); timer = null;
    stepDots.forEach((el) => el.classList.remove('on'));
    if (loopBtn) { loopBtn.setAttribute('aria-pressed', 'false'); loopBtn.querySelector('span').textContent = '▶ Play a loop'; }
  }
  if (loopBtn) loopBtn.addEventListener('click', () => {
    if (timer) return stop();
    if (!ac()) return;
    step = 0; nextT = ctx.currentTime + 0.05;
    timer = setInterval(schedule, 25); schedule();
    loopBtn.setAttribute('aria-pressed', 'true'); loopBtn.querySelector('span').textContent = '■ Stop';
  });
  document.addEventListener('visibilitychange', () => { if (document.hidden && timer) stop(); });
})();

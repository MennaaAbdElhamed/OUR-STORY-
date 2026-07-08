(function () {
  'use strict';

  /* ============================================================
     1. AMBIENT PARTICLES
     ============================================================ */
  function buildParticles() {
    const wrap = document.getElementById('particles');
    if (!wrap) return;
    const count = window.innerWidth < 600 ? 14 : 22;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.className = 'particle';
      const left = Math.random() * 100;
      const size = 3 + Math.random() * 4;
      const duration = 14 + Math.random() * 14;
      const delay = Math.random() * 20;
      const drift = (Math.random() * 60 - 30).toFixed(0) + 'px';
      p.style.left = left + 'vw';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.animationDuration = duration + 's';
      p.style.animationDelay = '-' + delay + 's';
      p.style.setProperty('--drift', drift);
      wrap.appendChild(p);
    }
  }

  /* ============================================================
     1b. FALLING PETALS — blue & white, continuous, before & after opening
     ============================================================ */
  function buildPetals() {
    const wrap = document.getElementById('petals');
    if (!wrap) return;
    const MAX_CONCURRENT = window.innerWidth < 600 ? 10 : 16;
    let active = 0;

    function spawnPetal() {
      if (active >= MAX_CONCURRENT) return;
      active++;
      const petal = document.createElement('span');
      const isBlue = Math.random() > 0.45;
      petal.className = 'petal ' + (isBlue ? 'is-blue' : 'is-white');

      const size = 9 + Math.random() * 14;
      const duration = 11 + Math.random() * 9;
      const left = Math.random() * 100;
      const swing = Math.random() > 0.5 ? 1 : -1;

      petal.style.width = size + 'px';
      petal.style.height = (size * 1.3) + 'px';
      petal.style.left = left + 'vw';
      petal.style.opacity = (0.55 + Math.random() * 0.35).toFixed(2);
      petal.style.animationDuration = duration + 's';
      petal.style.setProperty('--swing', swing);

      wrap.appendChild(petal);

      petal.addEventListener('animationiteration', () => {
        // re-randomize a bit so petals don't loop identically forever
        petal.style.left = (Math.random() * 100) + 'vw';
      });

      setTimeout(() => {
        petal.remove();
        active--;
      }, duration * 1000 * 3); // let it loop a few times, then recycle
    }

    // Initial burst so petals are already falling on load
    for (let i = 0; i < MAX_CONCURRENT; i++) {
      setTimeout(spawnPetal, i * 260);
    }
    // Keep spawning gently forever
    setInterval(spawnPetal, 900);
  }

  /* ============================================================
     2. ENVELOPE OPENING SEQUENCE
     ============================================================ */
  function initEnvelope() {
    const wrap = document.getElementById('envelopeWrap');
    const scene = document.getElementById('envelopeScene');
    const letter = document.getElementById('letterCard');
    const tapHint = document.getElementById('tapHint');
    const scrollCue = document.getElementById('scrollCue');
    const sealFlash = document.getElementById('sealFlash');

    if (!wrap) return;
    let opened = false;

    function spawnSparkles() {
      const count = 14;
      for (let i = 0; i < count; i++) {
        const s = document.createElement('span');
        s.className = 'sparkle';
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.4;
        const dist = 60 + Math.random() * 60;
        s.style.setProperty('--sx', (Math.cos(angle) * dist).toFixed(0) + 'px');
        s.style.setProperty('--sy', (Math.sin(angle) * dist).toFixed(0) + 'px');
        s.style.animationDelay = (Math.random() * 0.15) + 's';
        wrap.appendChild(s);
        setTimeout(() => s.remove(), 1200);
      }
    }

    function spawnConfetti() {
      const colors = ['#B7D6EA', '#DCEBF5', '#ffffff', '#CBA968'];
      const count = 26;
      const originX = window.innerWidth / 2;
      const originY = window.innerHeight * 0.38;

      for (let i = 0; i < count; i++) {
        const c = document.createElement('span');
        c.className = 'confetti-piece';
        const angle = Math.random() * Math.PI * 2;
        const dist = 90 + Math.random() * 190;
        const cx = (Math.cos(angle) * dist).toFixed(0) + 'px';
        const cy = (60 + Math.random() * 160).toFixed(0) + 'px'; // gravity: mostly downward
        c.style.left = originX + 'px';
        c.style.top = originY + 'px';
        c.style.background = colors[Math.floor(Math.random() * colors.length)];
        c.style.setProperty('--cx', cx);
        c.style.setProperty('--cy', cy);
        c.style.setProperty('--cr', (Math.random() * 540 - 270) + 'deg');
        c.style.animationDelay = (Math.random() * 0.2) + 's';
        document.body.appendChild(c);
        setTimeout(() => c.remove(), 2000);
      }
    }

    function openEnvelope() {
      if (opened) return;
      opened = true;

      wrap.classList.add('is-pressed');
      if (tapHint) tapHint.classList.add('is-hidden');

      // 1. quick press, then a gentle shake
      setTimeout(() => {
        wrap.classList.remove('is-pressed');
        wrap.classList.add('is-shaking');
      }, 150);

      // 2. seal cracks with a soft flash right as the shake settles
      setTimeout(() => {
        if (sealFlash) sealFlash.classList.add('is-cracking');
      }, 520);

      // 3. flap opens smoothly in 3D + sparkles + glow
      setTimeout(() => {
        wrap.classList.remove('is-shaking');
        wrap.classList.add('is-opening', 'flap-open');
        spawnSparkles();
      }, 640);

      // 4. envelope fades as the letter is about to rise
      setTimeout(() => {
        wrap.classList.add('letter-out');
      }, 1260);

      // 5. letter rises into place, with a confetti burst
      setTimeout(() => {
        letter.classList.add('is-visible');
        letter.setAttribute('aria-hidden', 'false');
        spawnConfetti();
      }, 1460);

      setTimeout(() => {
        scene.classList.add('is-hidden');
      }, 1750);

      setTimeout(() => {
        if (scrollCue) scrollCue.classList.add('is-visible');
      }, 2300);
    }

    wrap.addEventListener('click', openEnvelope);
    wrap.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openEnvelope();
      }
    });
  }

  /* ============================================================
     3. MUSIC TOGGLE
     ============================================================ */
  function initMusic() {
    const btn = document.getElementById('musicBtn');
    const audio = document.getElementById('songAudio');
    const label = document.getElementById('musicLabel');
    const icon = document.getElementById('musicIcon');
    if (!btn || !audio) return;

    let playing = false;
    let noteInterval = null;

    function spawnNote() {
      const note = document.createElement('span');
      note.className = 'floating-note';
      note.textContent = Math.random() > 0.5 ? '\u266A' : '\u266B';
      const rect = btn.getBoundingClientRect();
      note.style.left = (rect.left + rect.width * (0.25 + Math.random() * 0.5)) + 'px';
      note.style.top = (rect.top + rect.height * 0.4) + 'px';
      note.style.fontSize = (13 + Math.random() * 6) + 'px';
      note.style.setProperty('--nx', (Math.random() * 40 - 20).toFixed(0) + 'px');
      note.style.setProperty('--nr', (Math.random() * 50 - 25) + 'deg');
      document.body.appendChild(note);
      setTimeout(() => note.remove(), 2300);
    }

    btn.addEventListener('click', () => {
      if (!playing) {
        audio.play().catch(() => {});
        playing = true;
        btn.classList.add('is-playing');
        label.textContent = 'Pause Music';
        noteInterval = setInterval(spawnNote, 700);
      } else {
        audio.pause();
        playing = false;
        btn.classList.remove('is-playing');
        label.textContent = 'Play Our Song';
        if (noteInterval) clearInterval(noteInterval);
      }
    });

    // Reveal the button shortly after load so it's visible right away
    requestAnimationFrame(() => {
      setTimeout(() => btn.classList.add('is-loaded'), 300);
    });
  }

  /* ============================================================
     4. TIMELINE BUILD (photos + hand-drawn arrows)
     ============================================================ */
  const TOTAL_PHOTOS = 21;

  // Hand-drawn-feeling arrow path variants (wobbly bezier curves)
  const ARROW_VARIANTS = [
    // down-right curve
    { d: 'M20,4 C40,25 55,35 60,72', arrowAt: [60, 72], angle: 68, w: 90 },
    // down-left curve
    { d: 'M70,4 C48,26 34,36 26,72', arrowAt: [26, 72], angle: 112, w: 90 },
    // gentle down
    { d: 'M45,4 C38,28 52,42 45,74', arrowAt: [45, 74], angle: 90, w: 90 },
    // down-right sharper
    { d: 'M18,6 C36,20 62,30 66,70', arrowAt: [66, 70], angle: 62, w: 90 },
  ];

  function makeArrowSVG(variantIndex, mirror) {
    const v = ARROW_VARIANTS[variantIndex % ARROW_VARIANTS.length];
    const ns = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('viewBox', '0 0 90 90');
    svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    if (mirror) svg.style.transform = 'scaleX(-1)';

    const path = document.createElementNS(ns, 'path');
    path.setAttribute('d', v.d);
    svg.appendChild(path);

    // Arrow head (small hand-drawn triangle)
    const [ax, ay] = v.arrowAt;
    const angleRad = (v.angle * Math.PI) / 180;
    const size = 9;
    const p1 = [ax, ay];
    const p2 = [ax - size * Math.cos(angleRad - 0.5), ay - size * Math.sin(angleRad - 0.5)];
    const p3 = [ax - size * Math.cos(angleRad + 0.5), ay - size * Math.sin(angleRad + 0.5)];
    const poly = document.createElementNS(ns, 'polygon');
    poly.setAttribute('points', `${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`);
    svg.appendChild(poly);

    return { svg, path };
  }

  function buildTimeline() {
    const track = document.getElementById('timelineTrack');
    if (!track) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -8% 0px' });

    const arrowObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const path = entry.target;
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = 0;
          arrowObserver.unobserve(path);
        }
      });
    }, { threshold: 0.4 });

    for (let i = 1; i <= TOTAL_PHOTOS; i++) {
      const isLeft = i % 2 === 1;
      const tilt = (isLeft ? -1 : 1) * (2 + Math.random() * 2.2);

      const item = document.createElement('div');
      item.className = 'photo-item floaty ' + (isLeft ? 'align-left' : 'align-right');
      item.style.setProperty('--tilt', tilt.toFixed(2) + 'deg');
      item.style.transitionDelay = '0s';

      const frame = document.createElement('div');
      frame.className = 'photo-frame';

      const img = document.createElement('img');
      img.src = 'assets/images/' + i + '.jpg';
      img.alt = 'A memory from our story — photo ' + i;
      img.loading = 'lazy';
      img.decoding = 'async';

      frame.appendChild(img);
      item.appendChild(frame);

      const idx = document.createElement('span');
      idx.className = 'photo-index';
      idx.textContent = 'chapter ' + String(i).padStart(2, '0');
      item.appendChild(idx);

      track.appendChild(item);
      revealObserver.observe(item);

      if (i < TOTAL_PHOTOS) {
        const slot = document.createElement('div');
        slot.className = 'arrow-slot';
        const variantIndex = (i - 1) % ARROW_VARIANTS.length;
        const mirror = !isLeft;
        const { svg, path } = makeArrowSVG(variantIndex, mirror);

        // prep for draw-in animation
        requestAnimationFrame(() => {
          const len = path.getTotalLength();
          path.style.strokeDasharray = len;
          path.style.strokeDashoffset = len;
          path.style.transition = 'stroke-dashoffset 1.1s cubic-bezier(.3,.8,.4,1)';
        });

        slot.appendChild(svg);
        track.appendChild(slot);
        arrowObserver.observe(path);
      }
    }
  }

  /* ============================================================
     5. GENERIC SCROLL REVEALS (finale + timeline head)
     ============================================================ */
  function initReveals() {
    const targets = document.querySelectorAll('.reveal, .finale-heart');
    if (!targets.length) return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    targets.forEach((t) => obs.observe(t));

    const head = document.querySelector('.timeline-head');
    if (head) {
      const obs2 = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            obs2.unobserve(entry.target);
          }
        });
      }, { threshold: 0.3 });
      obs2.observe(head);
    }
  }

  /* ============================================================
     INIT
     ============================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    buildParticles();
    buildPetals();
    initEnvelope();
    initMusic();
    buildTimeline();
    initReveals();
  });
})();

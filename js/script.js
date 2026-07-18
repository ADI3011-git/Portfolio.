/* =========================================================
   Aditya Khairwad — Business Architect | Kinaxis
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Footer year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- AOS ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (window.AOS) {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
      disable: reduceMotion
    });
  }

  /* =========================================================
     SIGNATURE ELEMENT — dotted globe with signal pins
     A dot-matrix sphere representing global, always-on supply
     chain visibility, with pulsing location pins and traveling
     signal arcs (concurrent planning across geographies).
     ========================================================= */
  buildGlobe();

  function buildGlobe() {
    const svg = document.getElementById('networkGraph');
    if (!svg) return;
    const ns = 'http://www.w3.org/2000/svg';
    const cx = 280, cy = 280, R = 220;

    const orbitsG = document.getElementById('graphLines');
    const dotsG = document.getElementById('graphNodes');
    const pinsG = document.getElementById('graphSignals');

    /* Outer + latitude/longitude guide ellipses */
    const guide = document.createElementNS(ns, 'circle');
    guide.setAttribute('cx', cx); guide.setAttribute('cy', cy); guide.setAttribute('r', R);
    guide.setAttribute('fill', 'none');
    guide.setAttribute('stroke', '#E4E6EC');
    guide.setAttribute('stroke-width', '1');
    orbitsG.appendChild(guide);

    const latRatios = [0.82, 0.55, 0.25];
    latRatios.forEach(r => {
      const ell = document.createElementNS(ns, 'ellipse');
      ell.setAttribute('cx', cx); ell.setAttribute('cy', cy);
      ell.setAttribute('rx', R); ell.setAttribute('ry', R * r);
      ell.setAttribute('fill', 'none');
      ell.setAttribute('stroke', '#EDEFF3');
      ell.setAttribute('stroke-width', '1');
      orbitsG.appendChild(ell);
    });
    [0, 45, 90, 135].forEach(deg => {
      const ell = document.createElementNS(ns, 'ellipse');
      ell.setAttribute('cx', cx); ell.setAttribute('cy', cy);
      ell.setAttribute('rx', R * 0.4); ell.setAttribute('ry', R);
      ell.setAttribute('fill', 'none');
      ell.setAttribute('stroke', '#EDEFF3');
      ell.setAttribute('stroke-width', '1');
      ell.setAttribute('transform', `rotate(${deg} ${cx} ${cy})`);
      orbitsG.appendChild(ell);
    });

    /* Dot-matrix sphere fill — denser toward a few "continent" clusters */
    const clusters = [
      { a: -40, r: 0.55, spread: 0.55 },
      { a: 30,  r: 0.7,  spread: 0.5  },
      { a: 140, r: 0.5,  spread: 0.6  },
      { a: 200, r: 0.65, spread: 0.45 },
      { a: 280, r: 0.4,  spread: 0.5  }
    ];
    const dots = [];
    clusters.forEach(c => {
      const count = 34;
      for (let i = 0; i < count; i++) {
        const angle = (c.a + (Math.random() - 0.5) * 70) * Math.PI / 180;
        const dist = c.r * R * (0.55 + Math.random() * c.spread);
        const x = cx + Math.cos(angle) * dist;
        const y = cy + Math.sin(angle) * dist * 0.94;
        const dxy = Math.hypot(x - cx, (y - cy) / 0.94);
        if (dxy > R * 0.98) continue;
        dots.push([x, y, dxy / R]);
      }
    });
    dots.forEach(([x, y, edge]) => {
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('cx', x.toFixed(1));
      dot.setAttribute('cy', y.toFixed(1));
      dot.setAttribute('r', 1.6 - edge * 0.5);
      dot.setAttribute('fill', '#C7CBD4');
      dot.setAttribute('opacity', (0.85 - edge * 0.35).toFixed(2));
      dotsG.appendChild(dot);
    });

    /* Location pins (pulsing) */
    const pins = [
      { x: cx - 90, y: cy - 70 },
      { x: cx + 60, y: cy - 40 },
      { x: cx - 30, y: cy + 90 },
      { x: cx + 110, y: cy + 30 }
    ];
    pins.forEach((p, i) => {
      const ring = document.createElementNS(ns, 'circle');
      ring.setAttribute('cx', p.x); ring.setAttribute('cy', p.y);
      ring.setAttribute('r', 4);
      ring.setAttribute('fill', 'none');
      ring.setAttribute('stroke', '#E24232');
      ring.setAttribute('stroke-width', '1.4');
      ring.setAttribute('class', 'globe-pin');
      if (!reduceMotion) {
        ring.innerHTML = `<animate attributeName="r" values="4;16;4" dur="2.8s" begin="${i * 0.5}s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.9;0;0.9" dur="2.8s" begin="${i * 0.5}s" repeatCount="indefinite"/>`;
      }
      pinsG.appendChild(ring);

      const core = document.createElementNS(ns, 'circle');
      core.setAttribute('cx', p.x); core.setAttribute('cy', p.y);
      core.setAttribute('r', 3.4);
      core.setAttribute('fill', '#E24232');
      core.setAttribute('class', 'globe-pin');
      pinsG.appendChild(core);
    });

    /* Signal arcs between pins */
    for (let i = 0; i < pins.length - 1; i++) {
      const a = pins[i], b = pins[i + 1];
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 40;
      const path = document.createElementNS(ns, 'path');
      path.setAttribute('d', `M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`);
      path.setAttribute('fill', 'none');
      path.setAttribute('stroke', '#E24232');
      path.setAttribute('stroke-width', '1.2');
      path.setAttribute('opacity', '0.3');
      path.setAttribute('stroke-dasharray', '4 5');
      orbitsG.appendChild(path);
    }
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    });
  }

  /* =========================================================
     JOURNEY TIMELINE — mark the current/last node active
     ========================================================= */
  const dots = document.querySelectorAll('.timeline-dots span');
  if (dots.length) dots[dots.length - 1].classList.add('is-active');

  /* =========================================================
     Active nav link on scroll
     ========================================================= */
  const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
  const sections = Array.from(navLinks)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = '#' + entry.target.id;
          navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(s => io.observe(s));
  }

});

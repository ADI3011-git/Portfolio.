/* =========================================================
   Aditya Khairwad — Supply Chain × AI × Kinaxis
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
      duration: 700,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      disable: reduceMotion
    });
  }

  /* ---------- GSAP header hide-on-scroll ---------- */
  const header = document.querySelector('.site-header');
  if (window.gsap && header && !reduceMotion) {
    let lastY = window.scrollY;
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y > lastY && y > 120) {
        gsap.to(header, { yPercent: -100, duration: 0.35, ease: 'power2.out' });
      } else {
        gsap.to(header, { yPercent: 0, duration: 0.35, ease: 'power2.out' });
      }
      lastY = y;
    }, { passive: true });
  }

  /* =========================================================
     SIGNATURE ELEMENT — concurrent planning network graph
     Nodes represent planning domains; animated packets travel
     the connecting lines to visualize real-time concurrent
     signal flow (the core Kinaxis Maestro concept).
     ========================================================= */
  buildNetworkGraph();

  function buildNetworkGraph() {
    const svg = document.getElementById('networkGraph');
    if (!svg) return;

    const nodes = [
      { id: 'demand',    label: 'DEMAND',    x: 280, y: 90  },
      { id: 'supply',    label: 'SUPPLY',    x: 480, y: 200 },
      { id: 'inventory', label: 'INVENTORY', x: 440, y: 430 },
      { id: 'production',label: 'PRODUCTION',x: 200, y: 470 },
      { id: 'logistics', label: 'LOGISTICS', x: 80,  y: 230 },
      { id: 'ai',        label: 'AI SIGNAL', x: 280, y: 280 }
    ];

    const edges = [
      ['demand','ai'], ['supply','ai'], ['inventory','ai'],
      ['production','ai'], ['logistics','ai'],
      ['demand','supply'], ['supply','inventory'],
      ['inventory','production'], ['production','logistics'],
      ['logistics','demand']
    ];

    const linesG = document.getElementById('graphLines');
    const nodesG = document.getElementById('graphNodes');
    const signalsG = document.getElementById('graphSignals');
    const ns = 'http://www.w3.org/2000/svg';
    const byId = Object.fromEntries(nodes.map(n => [n.id, n]));

    edges.forEach(([a, b], i) => {
      const na = byId[a], nb = byId[b];
      const line = document.createElementNS(ns, 'line');
      line.setAttribute('x1', na.x); line.setAttribute('y1', na.y);
      line.setAttribute('x2', nb.x); line.setAttribute('y2', nb.y);
      line.setAttribute('data-edge', i);
      linesG.appendChild(line);
    });

    nodes.forEach(n => {
      const g = document.createElementNS(ns, 'g');
      g.setAttribute('class', 'graph-node');
      const isCore = n.id === 'ai';
      const r = isCore ? 26 : 15;

      if (isCore) {
        const glow = document.createElementNS(ns, 'circle');
        glow.setAttribute('cx', n.x); glow.setAttribute('cy', n.y);
        glow.setAttribute('r', 60); glow.setAttribute('fill', 'url(#coreGlow)');
        g.appendChild(glow);
      }

      const circle = document.createElementNS(ns, 'circle');
      circle.setAttribute('cx', n.x); circle.setAttribute('cy', n.y);
      circle.setAttribute('r', r);
      circle.setAttribute('fill', isCore ? 'rgba(245,166,35,0.16)' : 'rgba(53,199,240,0.1)');
      circle.setAttribute('stroke', isCore ? '#F5A623' : '#35C7F0');
      circle.setAttribute('stroke-width', isCore ? 2 : 1.4);
      g.appendChild(circle);

      const text = document.createElementNS(ns, 'text');
      text.setAttribute('x', n.x);
      text.setAttribute('y', n.y + r + 16);
      text.setAttribute('text-anchor', 'middle');
      text.textContent = n.label;
      g.appendChild(text);

      nodesG.appendChild(g);
    });

    if (reduceMotion) return;

    /* Traveling signal packets along random edges */
    const signalCount = 6;
    for (let i = 0; i < signalCount; i++) {
      const dot = document.createElementNS(ns, 'circle');
      dot.setAttribute('r', 3.2);
      dot.setAttribute('fill', i % 2 === 0 ? '#F5A623' : '#35C7F0');
      dot.setAttribute('class', 'graph-signal');
      signalsG.appendChild(dot);
      animateSignal(dot, edges, byId, i * 900);
    }

    function animateSignal(dot, edges, byId, delay) {
      function run() {
        const [a, b] = edges[Math.floor(Math.random() * edges.length)];
        const na = byId[a], nb = byId[b];
        const duration = 1800 + Math.random() * 900;

        if (window.gsap) {
          gsap.fromTo(dot,
            { attr: { cx: na.x, cy: na.y }, opacity: 0 },
            {
              attr: { cx: nb.x, cy: nb.y },
              opacity: 1,
              duration: duration / 1000,
              ease: 'power1.inOut',
              onComplete: () => {
                gsap.to(dot, { opacity: 0, duration: 0.3, onComplete: run });
              }
            }
          );
        }
      }
      setTimeout(run, delay);
    }

    /* Gentle ambient rotation of the whole graph for depth */
    if (window.gsap) {
      gsap.to('#networkGraph .graph-nodes, #networkGraph .graph-lines', {
        rotation: 2,
        transformOrigin: '50% 50%',
        duration: 8,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut'
      });
    }
  }

});

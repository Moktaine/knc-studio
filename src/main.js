// Latin + Latin Extended only (Turkish needs ş ğ ı İ from latin-ext); the other script subsets
// would only add @font-face rules to the CSS.
import '@fontsource/inter/latin-300.css';
import '@fontsource/inter/latin-ext-300.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-300.css';
import '@fontsource/cormorant-garamond/latin-ext-300.css';
import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-ext-400.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/cormorant-garamond/latin-ext-400-italic.css';
import '@fontsource/cinzel/latin-600.css';
import 'lenis/dist/lenis.css';
import './style.css';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import { mountHeroArt, addHeroToTimeline } from './scenes/hero.js';
import { mountWall, measure, addWallToTimeline, mountGallery } from './scenes/wall.js';
import { initTimeline, initReveals } from './scenes/closing.js';
import { initPlanner } from './scenes/planner.js';
import { initDock } from './scenes/dock.js';
import { loadNear, loadNow } from './lazy.js';

gsap.registerPlugin(ScrollTrigger);

const stage = document.querySelector('.stage');
// pinned scroll length in viewport heights: 152 timeline units at 0.07 viewport heights each
const PIN_VH = 10.64;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

mountHeroArt(stage);
initPlanner();
const dock = initDock({ reduced: reduced.matches });

if (reduced.matches) {
  document.documentElement.classList.add('reduced');
  mountGallery(stage);
} else {
  runMotion();
}

// Case-study (and reduced-motion gallery) images load as the visitor approaches them.
loadNear([
  ...document.querySelectorAll('.case img[data-src]'),
  ...document.querySelectorAll('[data-gallery]:not([hidden])'),
]);

// Palette switcher for trying colour directions (bottom-left "Tema" button). Shipped on purpose
// while the palette is being chosen; remove this line to take it out of the live site.
import('./dev/themes.js').then((m) => m.initThemes());

// Switching the OS setting mid-visit: simplest correct answer for a prototype is a reload.
reduced.addEventListener('change', () => location.reload());

function runMotion() {
  ScrollTrigger.config({ ignoreMobileResize: true });

  // Lenis drives the scroll; ScrollTrigger reads it on the same ticker.
  const lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  const cards = mountWall(stage);

  // The ring's screenshots wait until the visitor starts scrolling (or the page has been idle a
  // moment), so the first load is just the hero; the hero alone takes ~3 screens to scroll past.
  const ringImgs = stage.querySelectorAll('.ring img[data-src]');
  const loadRing = () => loadNow(ringImgs);
  addEventListener('scroll', loadRing, { once: true, passive: true });
  addEventListener('load', () => setTimeout(loadRing, 2500), { once: true });
  const q = gsap.utils.selector(stage);
  let ctx;
  let pin;

  const build = () => {
    ctx?.revert();
    ctx = gsap.context(() => {
      const g = measure(stage);
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: stage,
          start: 'top top',
          end: () => `+=${window.innerHeight * PIN_VH}`,
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });
      addHeroToTimeline(tl, q, g.crop);
      addWallToTimeline(tl, stage, cards, g);
      // the docked header takes over as the hero nav leaves (40–44)
      tl.fromTo(dock, { autoAlpha: 0, yPercent: -100 }, { autoAlpha: 1, yPercent: 0, duration: 3, ease: 'power2.out' }, 42);
      pin = tl.scrollTrigger;
    }, stage);
  };

  build();

  const mm = gsap.matchMedia();
  initTimeline(mm);
  initReveals();

  // Rebuild only on real layout changes (width, or a large height change), not mobile URL-bar jitter.
  let w = window.innerWidth;
  let h = window.innerHeight;
  let raf;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      if (window.innerWidth === w && Math.abs(window.innerHeight - h) < 140) return;
      w = window.innerWidth;
      h = window.innerHeight;
      build();
      ScrollTrigger.refresh();
    });
  });

  // In-page links go through Lenis. "İşler" lands mid-wall (pinned, so it has no real offset).
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      e.preventDefault();
      if (id === '#isler') {
        lenis.scrollTo(pin.start + (pin.end - pin.start) * 0.6, { duration: 2.4 });
      } else if (id === '#top') {
        lenis.scrollTo(0, { duration: 2.4 });
      } else {
        lenis.scrollTo(id, { duration: 2.4, offset: -dock.offsetHeight });
      }
    });
  });

  // Ring cards open their case study.
  stage.querySelector('[data-ring]').addEventListener('click', (e) => {
    const card = e.target.closest('[data-anchor]');
    if (card) lenis.scrollTo(card.dataset.anchor, { duration: 2.4, offset: -dock.offsetHeight });
  });

  // A reload inside the pinned scene would land mid-ring with nothing explained, so only
  // positions past the pin are restored; anything earlier starts again from the top.
  history.scrollRestoration = 'manual';
  let resumeAt = 0;
  try {
    resumeAt = Number(sessionStorage.getItem('knc-scroll')) || 0;
  } catch {}
  addEventListener('pagehide', () => {
    try {
      sessionStorage.setItem('knc-scroll', String(Math.round(scrollY)));
    } catch {}
  });

  // Headline metrics feed the frame size, so re-measure once the real fonts are in, but only if
  // they actually changed it: a second build is the biggest main-thread task on a slow phone.
  const frame = stage.querySelector('.frame');
  const frameSize = () => `${frame.offsetWidth}x${frame.offsetHeight}`;
  const builtAt = frameSize();
  document.fonts?.ready.then(() => {
    if (frameSize() !== builtAt) {
      build();
      ScrollTrigger.refresh();
    }
    if (resumeAt > pin.end) lenis.scrollTo(resumeAt, { immediate: true });
  });
}

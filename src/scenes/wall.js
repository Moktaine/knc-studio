import { gsap } from 'gsap';
import { projects, renderCardInner, SHAPES } from '../data/projects.js';

const N = projects.length;
const DESIGN = { h: 210, gap: 16, perspective: 320 };
const HERO_W = SHAPES.hero;
// the arch's circle in card-01 design units: centre offset below the card's centre, radius
const SUN = { dy: 118 - 105, r: 16 };
const pad = (n) => String(n).padStart(2, '0');
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export function mountWall(stage) {
  const ring = stage.querySelector('[data-ring]');
  ring.innerHTML = projects
    .map((p, i) => `<div class="card card--${p.shape}" data-i="${i}" data-anchor="${p.anchor}">${renderCardInner(p)}<span class="card__shade"></span></div>`)
    .join('');
  return [...ring.children];
}

/**
 * Cards have different widths (screens are 16:10 or tall phone shots), so the ring is a
 * polygon of unequal chords on one circle. Card i spans the angle θi = 2·asin((Wi+gap) / 2R);
 * R is solved so the angles close the circle (Σθi = 2π). Each card sits on its chord, at
 * distance Ri = R·cos(θi/2) from the centre, facing inward.
 */
function solveRing(widths, gap) {
  const chords = widths.map((w) => w + gap);
  let lo = Math.max(...chords) / 2;
  let hi = chords.reduce((a, b) => a + b, 0);
  for (let n = 0; n < 60; n++) {
    const R = (lo + hi) / 2;
    const sum = chords.reduce((a, c) => a + 2 * Math.asin(Math.min(1, c / (2 * R))), 0);
    sum > Math.PI * 2 ? (lo = R) : (hi = R);
  }
  const R = (lo + hi) / 2;
  const theta = chords.map((c) => 2 * Math.asin(c / (2 * R)));
  const centre = [];
  theta.reduce((acc, t, i) => {
    centre[i] = i === 0 ? 0 : acc + t / 2;
    return centre[i] + t / 2;
  }, -theta[0] / 2);
  return { R, theta, centre, dist: theta.map((t) => R * Math.cos(t / 2)) };
}

/**
 * Geometry for the current viewport. Everything is derived from the hero frame so
 * card 01 at the start of the wall sits on exactly the pixels the cropped hero frame covers.
 *
 * Camera model: CSS perspective puts the eye at z = +P. The ring's centre sits at z = d.
 *   d = d0     → card 01 sits at perspective scale k: the hand-off frame (k = 1 on desktop).
 *   d → dEnd   → camera pulls back toward the far wall; neighbours curve in toward the viewer.
 */
export function measure(stage) {
  const frame = stage.querySelector('.frame');
  const sr = stage.getBoundingClientRect();
  const fr = frame.getBoundingClientRect();

  // Card size as it appears in the hero frame (matches .frame__art in CSS).
  const frameS = Math.min(fr.height / DESIGN.h, fr.width / HERO_W);

  // On narrow screens the frame card is nearly full-width, so the ring is built smaller and
  // card 01 starts magnified by k (closer to the eye); the hand-off still lands on the frame.
  const aspect = sr.width / sr.height;
  const k = aspect < 0.8 ? 1.45 : aspect < 1.2 ? 1.3 : 1;
  // wide screens show more of the arc; phones pull further back so a 16:10 screen still fits
  const pull = aspect > 1.2 ? 0.3 : aspect > 0.8 ? 0.45 : 0.62;

  const s = frameS / k;
  const widths = projects.map((p) => SHAPES[p.shape] * s);
  const H = DESIGN.h * s;
  const P = DESIGN.perspective * s;
  const ring = solveRing(widths, DESIGN.gap * s);
  const R0 = ring.dist[0];

  return {
    s, k, H, P, widths, ...ring,
    d0: R0 + P - P / k, // card 01 at z where perspective scale = k
    dEnd: Math.max(R0 * (1 - pull), P - ring.R + 8 * s),
    crop: {
      x: sr.left + sr.width / 2 - (fr.left + fr.width / 2),
      y: sr.top + sr.height / 2 - (fr.top + fr.height / 2),
      t: (fr.height - H * k) / 2,
      l: (fr.width - widths[0] * k) / 2,
    },
  };
}

/**
 * Scene 2 on the master timeline: hand-off, the ring, and the door into the intro (152 units in all).
 */
export function addWallToTimeline(tl, stage, cards, g) {
  const ringEl = stage.querySelector('[data-ring]');
  const wall = stage.querySelector('.wall');
  const hero = stage.querySelector('.hero');
  const counter = stage.querySelector('.counter');
  const num = stage.querySelector('[data-counter-num]');
  const title = stage.querySelector('[data-counter-title]');

  stage.style.setProperty('--s', g.s);
  cards.forEach((el, i) => {
    const w = g.widths[i];
    el.style.width = `${w}px`;
    el.style.height = `${g.H}px`;
    el.style.left = `${-w / 2}px`;
    el.style.top = `${-g.H / 2}px`;
    el.style.transform = `rotateY(${(-g.centre[i]).toFixed(5)}rad) translateZ(${-g.dist[i]}px)`;
  });

  const shades = cards.map((el) => el.querySelector('.card__shade'));
  const cam = { d: g.d0, rot: 0, reveal: 0 };
  let front = -1;

  const render = () => {
    ringEl.style.transform = `translateZ(${cam.d.toFixed(2)}px) rotateY(${cam.rot.toFixed(5)}rad)`;

    let best = 0;
    let bestA = Infinity;
    for (let i = 0; i < N; i++) {
      // card angle relative to straight ahead, wrapped to −π…π
      const a = wrap(cam.rot - g.centre[i]);
      if (Math.abs(a) < bestA) {
        bestA = Math.abs(a);
        best = i;
      }
      const cos = Math.cos(a);
      // nearest edge of the card to the eye; hide anything that reaches the camera plane
      const nearZ = cam.d - g.dist[i] * cos + (g.widths[i] / 2) * Math.abs(Math.sin(a));
      const el = cards[i];
      if (cos < 0.05 || nearZ > g.P * 0.92) {
        if (el.style.visibility !== 'hidden') el.style.visibility = 'hidden';
        continue;
      }
      if (el.style.visibility === 'hidden') el.style.visibility = '';
      // edges darken through an ink shade instead of fading the card, so light screens never turn grey
      const edge = 1 - Math.min(1, Math.abs(a) / 1.3) * 0.65;
      el.style.opacity = (i === 0 ? 1 : cam.reveal).toFixed(3);
      shades[i].style.opacity = (1 - edge).toFixed(3);
    }

    if (best !== front) {
      front = best;
      const p = projects[best];
      // count screens per client, so two projects never read as nine
      const same = projects.filter((q) => q.title === p.title);
      num.textContent = p.media ? `${p.title} · ${pad(same.indexOf(p) + 1)} / ${pad(same.length)}` : p.title;
      title.textContent = p.sector;
      title.setAttribute('href', p.anchor);
    }
  };
  render();

  // The door: the circle in the arch, SUN units below the card's centre (see projects.js).
  // At 120 card 01 is back on exactly the hero frame's pixels, so the flat hero frame takes over
  // again (vector SVG, stays sharp at any scale, unlike the 3D layer). It scales around the circle
  // until the circle covers the screen, and the intro opens inside it as a matching circular clip.
  const portal = stage.querySelector('[data-portal]');
  const frame = stage.querySelector('.frame');
  const sunY = SUN.dy * g.s * g.k; // circle centre below the stage centre, px
  const sunR = SUN.r * g.s * g.k; // circle radius at the hand-off scale, px
  const zMax = (Math.hypot(stage.clientWidth, stage.clientHeight) / 2 / sunR) * 1.15;
  const origin = `50% calc(50% + ${sunY.toFixed(1)}px)`;
  // GSAP needs plain px here (no calc): the frame's centre sits on the stage centre after the crop
  gsap.set(frame, { transformOrigin: `${frame.offsetWidth / 2}px ${frame.offsetHeight / 2 + sunY}px` });
  const door = { z: 1 };
  const renderDoor = () => {
    gsap.set(frame, { scale: door.z });
    // the opening sits just inside the gold rim, so a thin ring of gold frames the new world
    const open = Math.min(1, Math.max(0, (door.z - 2.5) / 3));
    portal.style.visibility = open > 0 ? 'visible' : 'hidden';
    // once the intro covers the screen the giant frame is redundant (and would bleed a row at the edge)
    frame.style.visibility = open >= 1 ? 'hidden' : '';
    portal.style.opacity = open.toFixed(3);
    portal.style.clipPath = `circle(${(sunR * door.z * 0.94).toFixed(1)}px at ${origin})`;
    portal.firstElementChild.style.transform = `scale(${(0.94 + 0.06 * open).toFixed(4)})`;
  };
  renderDoor();

  // T is the hand-off, right after the hero frame has closed onto card 01 (hero.js, 44–58).
  // T swap · +0–14 pull back · +14–58 full turn back to the arch · +60–74 push back in ·
  // +74–90 through the door · +90–94 hold on the intro
  const T = 58;
  tl.set(wall, { autoAlpha: 1 }, T)
    .set(hero, { autoAlpha: 0 }, T + 0.4)
    .to(cam, { d: g.dEnd, reveal: 1, duration: 14, ease: 'power2.inOut', onUpdate: render }, T)
    .to(counter, { opacity: 1, duration: 5, ease: 'power1.inOut' }, T + 7)
    .to(cam, { rot: Math.PI * 2, duration: 44, ease: 'sine.inOut', onUpdate: render }, T + 14)
    .to(counter, { autoAlpha: 0, duration: 4, ease: 'power1.in' }, T + 58)
    .to(cam, { d: g.d0, reveal: 0, duration: 14, ease: 'power2.inOut', onUpdate: render }, T + 60)
    .set(hero, { autoAlpha: 1 }, T + 74)
    .set(wall, { autoAlpha: 0 }, T + 74.2)
    .to(door, { z: zMax, duration: 16, ease: 'power3.in', onUpdate: renderDoor }, T + 74.2)
    .to({}, { duration: 4 }, T + 90);

  return render;
}

// prefers-reduced-motion: a plain horizontal gallery, no 3D, no scrub.
export function mountGallery(stage) {
  const gallery = stage.querySelector('[data-gallery]');
  gallery.innerHTML = projects
    .slice(1)
    .map(
      (p, i) => `<figure class="gallery__item gallery__item--${p.shape}">
        <div class="card card--${p.shape}">${renderCardInner(p)}</div>
        <figcaption><span class="label" lang="en">${pad(i + 1)} / ${pad(N - 1)} — ${p.title}</span>
        <span class="counter__title">${p.sector}</span></figcaption>
      </figure>`,
    )
    .join('');
  gallery.hidden = false;
  gallery.setAttribute('aria-label', 'Seçilmiş işler');
  gallery.id = 'isler';
  stage.querySelector('.wall').removeAttribute('id');
}

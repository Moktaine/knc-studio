import { heroLayers } from '../data/projects.js';

const svg = (cls, body) =>
  `<svg class="${cls}" viewBox="0 0 150 210" preserveAspectRatio="xMidYMid meet" aria-hidden="true">${body}</svg>`;

// Injects the three art layers once. The art box is the same 150×210 box as card 01,
// so the hand-off to the wall is a straight swap.
export function mountHeroArt(root = document) {
  const art = root.querySelector('[data-hero-art]');
  art.innerHTML =
    svg('art-decor', heroLayers.decor) +
    svg('art-horizon', heroLayers.horizon) +
    svg('art-wire', heroLayers.wire) +
    // the gold layer rises inside a sliding window (see wipe below), so it is revealed without repaints
    `<div class="art-gold-wipe">${svg('art-gold wipe__in', heroLayers.gold)}</div>`;
}

/**
 * Scene 1 on the master timeline (positions are % of the pinned scroll, 0–100).
 * 0–4 hold · 4–28 headline fill · 12–34 wireframe → finished · 38–58 frame closes in on card 01.
 * `crop` comes from wall.js: where the frame must end up to match card 01 exactly.
 */
// Reveals are "sliding windows": an overflow-hidden wrapper slides one way while its content
// slides back the same distance, so the content appears to stand still while being uncovered.
// Both are transforms, so the GPU composites them; a clip-path wipe would repaint every frame,
// which is what made the hero drop frames on phones (3x pixel density).
// x/y: 0 clears the pixel offset GSAP reads from the CSS starting transform (otherwise it would
// be added on top of the percentage and the layer would never come back into view).
const wipe = (tl, wrap, axis, from, to, vars, at) =>
  tl
    .fromTo(wrap, { x: 0, y: 0, [axis]: from }, { [axis]: to, ...vars }, at)
    .fromTo(wrap.map((el) => el.firstElementChild), { x: 0, y: 0, [axis]: -from }, { [axis]: -to, ...vars }, at);

export function addHeroToTimeline(tl, q, crop) {
  const inset0 = 'inset(0% 0% 0% 0%)';
  // the frame's border lines shrink to the card's width/height as they travel inward
  const frame = q('.frame')[0];
  const sx = (frame.offsetWidth - 2 * crop.l) / frame.offsetWidth;
  const sy = (frame.offsetHeight - 2 * crop.t) / frame.offsetHeight;
  const closing = { duration: 14, ease: 'power3.inOut' };

  tl.to(q('.hint'), { opacity: 0, duration: 5, ease: 'power1.out' }, 1)

    // headline: the outline sans only dims
    .to(q('.headline__a'), { opacity: 0.35, duration: 24, ease: 'none' }, 4);

  // headline: gold serif fills left → right
  wipe(tl, q('.headline__fill'), 'xPercent', -100, 0, { duration: 24, ease: 'none' }, 4);
  // dashed → solid: the solid line sweeps in while the dashed one is wiped out ahead of it
  wipe(tl, q('.frame__wipe--dash'), 'xPercent', 0, 100, { duration: 16, ease: 'power1.inOut' }, 12);
  wipe(tl, q('.frame__wipe--solid'), 'xPercent', -100, 0, { duration: 16, ease: 'power1.inOut' }, 12);
  // the gold arch composition rises out of the wireframe arch
  wipe(tl, q('.art-gold-wipe'), 'yPercent', 100, 0, { duration: 15, ease: 'power2.inOut' }, 18);

  tl
    .fromTo(q('.rule--dash'), { clipPath: inset0 }, { clipPath: 'inset(0% 0% 0% 100%)', duration: 14, ease: 'power1.inOut' }, 12)
    .to(q('.rule--solid'), { clipPath: inset0, duration: 14, ease: 'power1.inOut' }, 12)
    .to(q('.frame__cross'), { opacity: 0, duration: 10, ease: 'power1.inOut' }, 12)

    // nav fills in
    .to(q('.nav__wire'), { opacity: 0, duration: 8, ease: 'power1.inOut' }, 14)
    .fromTo(q('.nav__real'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 12, ease: 'power2.out' }, 18)

    // hero area: warm tone, then the gold arch composition rises out of the wireframe arch
    .to(q('.frame__fill'), { opacity: 1, duration: 14, ease: 'power1.inOut' }, 16)
    .to(q('.art-wire'), { opacity: 0, duration: 10, ease: 'power1.inOut' }, 19)
    .to([q('.art-decor'), q('.art-horizon')], { opacity: 1, duration: 12, ease: 'power1.inOut' }, 22)

    // 34–38 rest. 38–44: the words and the side ornaments leave, so nothing is sliced later.
    // 40–48: the frame drifts to centre stage. 44–58: its four edges travel inward together with
    // the clip, so the frame visibly narrows into card 01 rather than being cut to it; the edge
    // lines fade on arrival because card 01 has no border.
    .to([q('.nav'), q('.headline')], { autoAlpha: 0, duration: 6, ease: 'power2.inOut' }, 38)
    .to(q('.art-decor'), { opacity: 0, duration: 6, ease: 'power1.inOut' }, 38)
    .fromTo(q('.frame'), { x: 0, y: 0 }, { x: crop.x, y: crop.y, duration: 8, ease: 'power2.inOut' }, 40)
    .set(q('.frame__line--solid'), { opacity: 0 }, 44)
    .set(q('.frame__edge'), { opacity: 1 }, 44)
    .fromTo(
      q('.frame'),
      { clipPath: 'inset(0px 0px 0px 0px)' },
      { clipPath: `inset(${crop.t}px ${crop.l}px ${crop.t}px ${crop.l}px)`, ...closing },
      44,
    )
    .fromTo(q('.frame__edge--l'), { x: 0, scaleY: 1 }, { x: crop.l, scaleY: sy, ...closing }, 44)
    .fromTo(q('.frame__edge--r'), { x: 0, scaleY: 1 }, { x: -crop.l, scaleY: sy, ...closing }, 44)
    .fromTo(q('.frame__edge--t'), { y: 0, scaleX: 1 }, { y: crop.t, scaleX: sx, ...closing }, 44)
    .fromTo(q('.frame__edge--b'), { y: 0, scaleX: 1 }, { y: -crop.t, scaleX: sx, ...closing }, 44)
    .to(q('.frame__edge'), { opacity: 0, duration: 4, ease: 'power1.in' }, 54);
}

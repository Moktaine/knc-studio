// Project wall content: the hero hand-off card plus screens from delivered work.
// Ring card images are the *-card.webp copies in public/work (smaller than the case-study ones).

// Colours come from the CSS tokens (var(--gold) etc.) so the artwork follows the active theme.

// Shared arch path (outer), used by the hero and card 01 so the hand-off is pixel-identical.
// The circle in the arch carries the KNC mark (placeholder logo, Cinzel) and is the door the
// ring zooms through at the end of the pinned scene; its centre is SUN in wall.js.
const ARCH = 'M33 184V100a42 42 0 0 1 84 0v84';
const ARCH_IN = 'M45 184V102a30 30 0 0 1 60 0v82';

// The hero is split into layers so scene 1 can animate them separately.
// Card 01 renders decor + gold over the same background.
export const heroLayers = {
  bg: 'var(--warm)',
  wire: `<path d="${ARCH}" fill="none" style="stroke:var(--cream)" stroke-opacity=".38" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>
         <line x1="-4000" y1="184" x2="4150" y2="184" style="stroke:var(--cream)" stroke-opacity=".2" stroke-dasharray="3 3" vector-effect="non-scaling-stroke"/>`,
  // the horizon runs through card 01, so it stays when the side ornaments fade before the hand-off
  horizon: `<line x1="-4000" y1="184" x2="4150" y2="184" style="stroke:var(--gold)" stroke-opacity=".4" vector-effect="non-scaling-stroke"/>`,
  decor: `${[-330, -230, -150, 300, 380, 480].map((x) => `<line x1="${x}" y1="-4000" x2="${x}" y2="4000" style="stroke:var(--cream)" stroke-opacity=".06" vector-effect="non-scaling-stroke"/>`).join('')}
          <circle cx="-190" cy="120" r="64" fill="none" style="stroke:var(--gold)" stroke-opacity=".14" vector-effect="non-scaling-stroke"/>
          <circle cx="340" cy="120" r="64" fill="none" style="stroke:var(--gold)" stroke-opacity=".14" vector-effect="non-scaling-stroke"/>`,
  gold: `<path d="${ARCH}" style="fill:var(--warm2);stroke:var(--gold)" stroke-width="1"/>
         <path d="${ARCH_IN}" fill="none" style="stroke:var(--gold)" stroke-opacity=".45" stroke-width=".6"/>
         <circle cx="75" cy="118" r="16" style="fill:var(--gold)"/>
         <text x="75" y="118" text-anchor="middle" dominant-baseline="central" font-family="Cinzel, serif" font-weight="600" font-size="9.5" letter-spacing=".6" style="fill:var(--warm)">KNC</text>
         <line x1="60" y1="152" x2="90" y2="152" style="stroke:var(--gold)" stroke-opacity=".55" stroke-width=".5"/>
         <line x1="65" y1="158" x2="85" y2="158" style="stroke:var(--gold)" stroke-opacity=".4" stroke-width=".5"/>
         <line x1="70" y1="166" x2="80" y2="166" style="stroke:var(--gold)" stroke-opacity=".28" stroke-width=".5"/>`,
};

// Card shapes in design units; every card is 210 tall, width follows the screenshot.
// The hero card keeps 150×210 so it matches the cropped hero frame exactly.
export const SHAPES = { hero: 150, desktop: 336, mobile: 118 };

const ANCHORS = { Maxytrip: '#vaka', Taply: '#vaka-taply' };

const shot = (client, file, label, shape) => ({
  title: client,
  anchor: ANCHORS[client],
  sector: label,
  shape,
  media: { type: 'image', src: `${import.meta.env.BASE_URL}work/${client.toLowerCase()}/${file}-card.webp`, alt: `${client} — ${label}` },
});

// Ring order. Card 01 is the hero hand-off; the rest are real screens from delivered work.
export const projects = [
  { title: 'KNC Studio', sector: 'Bir fikir, çalışan bir ürün.', shape: 'hero', anchor: '#vaka', media: null },
  shot('Maxytrip', 'maxytrip-desktop', 'Ana sayfa ve canlı kontenjan', 'desktop'),
  shot('Maxytrip', 'maxytrip-mobile', 'Mobil ana sayfa', 'mobile'),
  shot('Maxytrip', 'maxytrip-desktop-tours', 'Tur listesi ve filtreler', 'desktop'),
  shot('Maxytrip', 'maxytrip-desktop-activities', 'Aktiviteler ve öne çıkanlar', 'desktop'),
  shot('Taply', 'taply-site', 'Tanıtım sitesi', 'desktop'),
  shot('Taply', 'taply-menu', 'Telefonda dijital menü', 'mobile'),
  shot('Taply', 'taply-panel', 'İşletme paneli', 'desktop'),
  shot('Taply', 'taply-admin', 'Sistem yönetimi', 'desktop'),
];

export function renderCardInner(p) {
  if (p.media?.type === 'image') {
    return `<img src="${p.media.src}" alt="${p.media.alt}" decoding="async" draggable="false" />`;
  }
  return `<svg viewBox="0 0 150 210" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <rect width="150" height="210" style="fill:${heroLayers.bg}"/>${heroLayers.horizon}${heroLayers.gold}</svg>`;
}

// Palette switcher for trying colour directions. main.js loads it in dev and in the live
// build while the palette is being chosen; delete that import to remove it.
//
// Every colour on the page reads from the :root tokens, so a theme is just six hex values;
// the translucent tints (--cream-70 …, --gold-45) are derived here.

const THEMES = [
  { id: 'gece', name: 'Gece', note: 'mevcut', dark: true, ink: '#0f0f0d', warm: '#1a1713', warm2: '#241f19', cream: '#efe9dc', gold: '#c9ab70' },
  { id: 'mermer', name: 'Mermer', note: 'açık, bronz', dark: false, ink: '#f3efe7', warm: '#e8e1d4', warm2: '#ddd3c2', cream: '#1d1b17', gold: '#8c6a35' },
  { id: 'zumrut', name: 'Zümrüt', note: 'koyu yeşil, pirinç', dark: true, ink: '#0b1310', warm: '#12201a', warm2: '#1a2b23', cream: '#e7ede4', gold: '#c2a466' },
  { id: 'bordo', name: 'Bordo', note: 'şarap, pembe altın', dark: true, ink: '#130b0c', warm: '#211315', warm2: '#2c191c', cream: '#f2e7e1', gold: '#d4a383' },
  { id: 'lacivert', name: 'Lacivert', note: 'gece mavisi, gümüş', dark: true, ink: '#0a0e16', warm: '#121a27', warm2: '#1a2436', cream: '#e8ecf2', gold: '#a8b6c8' },
  { id: 'grafit', name: 'Grafit', note: 'tek renk', dark: true, ink: '#111111', warm: '#1b1b1b', warm2: '#252525', cream: '#ededeb', gold: '#d6d3cc' },
];
const KEY = 'knc-dev-theme';

const rgb = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

function apply(t) {
  const s = document.documentElement.style;
  for (const k of ['ink', 'warm', 'warm2', 'cream', 'gold']) s.setProperty(`--${k}`, t[k]);
  for (const a of [70, 55, 30, 12]) s.setProperty(`--cream-${a}`, `rgb(${rgb(t.cream)} / ${a / 100})`);
  s.setProperty('--gold-45', `rgb(${rgb(t.gold)} / 0.45)`);
  s.setProperty('color-scheme', t.dark ? 'dark' : 'light');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t.ink);
  try {
    localStorage.setItem(KEY, t.id);
  } catch {}
}

const CSS = `
.dev-theme { position: fixed; left: 16px; bottom: calc(16px + env(safe-area-inset-bottom)); z-index: 70; font: 400 12px/1.3 var(--sans); }
.dev-theme__btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border: 1px solid var(--gold-45); background: var(--ink); color: var(--cream); cursor: pointer; letter-spacing: .2em; text-transform: uppercase; font-size: 10px; }
.dev-theme__panel { position: absolute; left: 0; bottom: calc(100% + 8px); width: 248px; padding: 8px; border: 1px solid var(--gold-45); background: var(--ink); opacity: 0; visibility: hidden; transform: translateY(6px); transition: opacity .35s var(--ease-out), transform .35s var(--ease-out), visibility 0s .35s; }
.dev-theme:hover .dev-theme__panel, .dev-theme:focus-within .dev-theme__panel, .dev-theme.is-open .dev-theme__panel { opacity: 1; visibility: visible; transform: none; transition-delay: 0s; }
.dev-theme__head { padding: 6px 8px 10px; color: var(--cream-55); font-size: 10px; letter-spacing: .2em; text-transform: uppercase; }
.dev-theme__opt { display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; padding: 10px 8px; border: 0; border-top: 1px solid var(--cream-12); background: none; color: var(--cream); text-align: left; cursor: pointer; }
.dev-theme__opt:hover, .dev-theme__opt[aria-pressed="true"] { color: var(--gold); }
.dev-theme__opt small { display: block; color: var(--cream-55); font-size: 11px; margin-top: 2px; }
.dev-theme__sw { display: flex; flex: none; }
.dev-theme__sw i { width: 14px; height: 14px; border-radius: 50%; margin-left: -4px; box-shadow: 0 0 0 1px rgb(128 128 128 / .35); }
`;

const swatches = (t) => `<span class="dev-theme__sw" aria-hidden="true">${['ink', 'warm', 'cream', 'gold'].map((k) => `<i style="background:${t[k]}"></i>`).join('')}</span>`;

export function initThemes() {
  const style = document.createElement('style');
  style.textContent = CSS;
  document.head.append(style);

  let current = THEMES[0];
  try {
    current = THEMES.find((t) => t.id === localStorage.getItem(KEY)) ?? THEMES[0];
  } catch {}

  const root = document.createElement('div');
  root.className = 'dev-theme';
  root.innerHTML = `
    <div class="dev-theme__panel" role="group" aria-label="Tema dene">
      <p class="dev-theme__head">Tema · yalnızca test</p>
      ${THEMES.map((t) => `<button class="dev-theme__opt" type="button" data-theme="${t.id}"><span>${t.name}<small>${t.note}</small></span>${swatches(t)}</button>`).join('')}
    </div>
    <button class="dev-theme__btn" type="button" aria-expanded="false"><span data-cur>${swatches(current)}</span>Tema</button>`;
  document.body.append(root);

  const btn = root.querySelector('.dev-theme__btn');
  const sync = () => {
    root.querySelectorAll('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === current.id)));
    root.querySelector('[data-cur]').innerHTML = swatches(current);
  };
  root.addEventListener('click', (e) => {
    const opt = e.target.closest('[data-theme]');
    if (opt) {
      current = THEMES.find((t) => t.id === opt.dataset.theme);
      apply(current);
      sync();
      return;
    }
    if (e.target.closest('.dev-theme__btn')) {
      const open = !root.classList.contains('is-open');
      root.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    }
  });
  document.addEventListener('click', (e) => {
    if (!root.contains(e.target)) {
      root.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });

  if (current.id !== 'gece') apply(current);
  sync();
}

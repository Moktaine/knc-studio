// Docked header: appears once the hero has handed over (motion: on the pinned timeline;
// reduced motion: when the hero nav leaves the screen), marks the section in view,
// and opens a full-screen menu on phones.
export function initDock({ reduced }) {
  const dock = document.querySelector('[data-dock]');
  const toggle = dock.querySelector('[data-dock-toggle]');
  const menu = document.querySelector('[data-dock-menu]');

  if (reduced) {
    new IntersectionObserver(([e]) => dock.classList.toggle('is-shown', !e.isIntersecting)).observe(
      document.querySelector('.nav'),
    );
  }

  const setOpen = (open) => {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? 'Kapat' : 'Menü';
    document.documentElement.classList.toggle('menu-open', open);
    // keep keyboard focus inside the header + menu while it is open
    document.querySelectorAll('.stage, main, footer, [data-plan-bar]').forEach((el) => (el.inert = open));
    if (open) menu.querySelector('a').focus();
  };
  toggle.addEventListener('click', () => setOpen(menu.hidden));
  menu.addEventListener('click', (e) => e.target.closest('a') && setOpen(false));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      toggle.focus();
    }
  });

  // current section → aria-current on the matching link
  const links = [...dock.querySelectorAll('.dock__links a')];
  // the case study counts as "İşler"; the intro belongs to no link
  const targets = { top: '#isler', yaklasim: null, vaka: '#isler', 'vaka-taply': '#isler', hizmetler: '#hizmetler', surec: '#surec', sss: '#sss', iletisim: '#iletisim' };
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const href = targets[e.target.id];
        links.forEach((a) => (a.getAttribute('href') === href ? a.setAttribute('aria-current', 'true') : a.removeAttribute('aria-current')));
      }
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  Object.keys(targets).forEach((id) => io.observe(document.getElementById(id)));

  return dock;
}

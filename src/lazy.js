// Deferred images. Markup carries data-src (and optionally data-srcset / data-sizes) instead of src.
//
// The browser's loading="lazy" can't be trusted on this page: before the scroll scene is built the
// case studies sit right under the hero, so phones fetched them during the first load. Here they
// load only once the visitor is within about a screen and a half of them.

export function loadNow(imgs) {
  for (const img of imgs) {
    if (!img.dataset.src) continue;
    if (img.dataset.srcset) img.srcset = img.dataset.srcset;
    if (img.dataset.sizes) img.sizes = img.dataset.sizes;
    img.src = img.dataset.src;
    delete img.dataset.src;
  }
}

// Elements are watched directly; a container (e.g. a sideways-scrolling gallery, whose clipped
// items never report as near) loads all of its images once the container itself is near.
export function loadNear(targets) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        loadNow(e.target.matches('img') ? [e.target] : e.target.querySelectorAll('img[data-src]'));
        io.unobserve(e.target);
      }
    },
    { rootMargin: '150% 0px 150% 0px' },
  );
  targets.forEach((el) => io.observe(el));
}

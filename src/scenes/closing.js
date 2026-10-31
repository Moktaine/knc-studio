import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Süreç: the line draws with scroll; each step lights up when the line reaches its dot.
export function initTimeline(mm) {
  const timeline = document.querySelector('.timeline');
  const draw = timeline.querySelector('.timeline__draw');
  const track = timeline.querySelector('.timeline__track');
  const steps = [...timeline.querySelectorAll('.step')];

  const setup = (axis) => () => {
    const horizontal = axis === 'x';
    const tr = track.getBoundingClientRect();
    const len = horizontal ? tr.width : tr.height;
    const at = steps.map((st) => {
      const r = st.querySelector('.step__dot').getBoundingClientRect();
      return ((horizontal ? r.left - tr.left : r.top - tr.top) + 4) / len;
    });
    gsap.fromTo(
      draw,
      { [horizontal ? 'scaleX' : 'scaleY']: 0 },
      {
        [horizontal ? 'scaleX' : 'scaleY']: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: timeline,
          start: horizontal ? 'top 72%' : 'top 70%',
          end: horizontal ? 'top 30%' : 'bottom 55%',
          scrub: true,
          onUpdate: (self) => steps.forEach((st, i) => st.classList.toggle('is-on', self.progress >= at[i] - 0.001)),
        },
      },
    );
  };

  mm.add('(max-width: 859px)', setup('y'));
  mm.add('(min-width: 860px)', setup('x'));
}

// Section titles rise out of a mask once. The hero is the authored moment; these stay quiet.
export function initReveals() {
  document.querySelectorAll('.section__title, .brief__title').forEach((el) => {
    el.classList.add('reveal');
    gsap.to(el, {
      clipPath: 'inset(-0.2em -0.1em -0.3em -0.1em)',
      y: 0,
      duration: 1.6,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

export { ScrollTrigger };

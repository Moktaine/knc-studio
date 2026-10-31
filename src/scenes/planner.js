import { groups, modules, CONTACT_EMAIL, WHATSAPP } from '../data/services.js';

const DAYS_PER_WEEK = 5;
const STORE = 'knc-plan'; // session only: a returning visitor starts fresh, a refresh does not
const weeks = (d) => Math.max(1, Math.ceil(d / DAYS_PER_WEEK));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const norm = (s) => s.toLocaleLowerCase('tr').replace(/\s+/g, ' ').trim();

const closeIcon = `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M4 4l8 8M12 4l-8 8" /></svg>`;

function load() {
  try {
    const saved = JSON.parse(sessionStorage.getItem(STORE));
    const ids = new Set(modules.map((m) => m.id));
    return {
      on: (saved?.on ?? []).filter((id) => ids.has(id)),
      ideas: (saved?.ideas ?? []).filter((t) => typeof t === 'string' && t.trim()).slice(0, 20),
    };
  } catch {
    return { on: [], ideas: [] };
  }
}

/**
 * The plan is the schedule: each module is a row on a week ruler. Rows run in sequence,
 * so a selected row's bar starts where the previous selected one ends, and the finish line
 * sits at the end of the last bar. Unselected rows preview a ghost bar at the current finish.
 * Bars move with transform only (translateX + scaleX of a full-width element).
 */
export function initPlanner() {
  const root = document.querySelector('[data-planner]');
  const rowsEl = root.querySelector('[data-rows]');
  const ruler = root.querySelector('[data-ruler]');
  const finish = root.querySelector('[data-finish]');
  const flag = root.querySelector('[data-flag]');
  const finishLabel = root.querySelector('[data-finish-label]');
  const total = document.querySelector('[data-total]');
  const chips = document.querySelector('[data-chips]');
  const briefWeeks = document.querySelector('[data-brief-weeks]');
  const planBar = document.querySelector('[data-plan-bar]');
  const barCount = planBar.querySelector('[data-bar-count]');

  // phones: one running strip on the sticky ruler keeps the schedule readable as a whole
  const strip = document.createElement('div');
  strip.className = 'board__strip';
  strip.setAttribute('aria-hidden', 'true');
  ruler.after(strip);

  // shown while the rows are on screen; hidden once the in-flow total or the brief is, so the
  // bar never covers them and each view carries one range
  const seen = new Map();
  const watch = [root, total, document.getElementById('iletisim')];
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => seen.set(e.target, e.isIntersecting));
    const [board, totalEl, brief] = watch.map((el) => seen.get(el));
    planBar.classList.toggle('is-shown', !!board && !totalEl && !brief);
  });
  watch.forEach((el) => io.observe(el));

  const saved = load();
  const state = {
    on: new Set([...modules.filter((m) => m.base).map((m) => m.id), ...saved.on]),
    ideas: saved.ideas,
  };
  const save = () => {
    try {
      sessionStorage.setItem(STORE, JSON.stringify({ on: [...state.on], ideas: state.ideas }));
    } catch {}
  };

  const rowHtml = (m) => `<li class="row${m.base ? ' row--base' : ''}" data-id="${m.id}">
        <label class="row__pick">
          <input class="row__check" type="checkbox" ${m.base || state.on.has(m.id) ? 'checked' : ''} ${m.base ? 'disabled' : ''} />
          <span class="row__box" aria-hidden="true"></span>
          <span class="row__name">${m.name}</span>
          <span class="row__days">${m.days[0] === m.days[1] ? m.days[0] : `${m.days[0]}–${m.days[1]}`} gün</span>
        </label>
        <p class="row__desc">${m.desc}</p>
        <div class="row__track" aria-hidden="true"><span class="row__ghost"></span><span class="row__bar"></span></div>
      </li>`;

  // subsections: one heading per group, rows in schedule order
  rowsEl.innerHTML = groups
    .map(
      (g) => `<li class="group">
        <h3 class="group__title">${g.name}</h3>
        <ul class="group__rows">${modules.filter((m) => m.group === g.id).map(rowHtml).join('')}</ul>
      </li>`,
    )
    .join('');

  const rowEls = new Map([...rowsEl.querySelectorAll('.row')].map((el) => [el.dataset.id, el]));

  const setModule = (id, on) => {
    on ? state.on.add(id) : state.on.delete(id);
    rowEls.get(id).querySelector('.row__check').checked = on;
    update();
  };

  rowsEl.addEventListener('change', (e) => {
    const row = e.target.closest('.row');
    if (!row || !e.target.matches('.row__check')) return;
    setModule(row.dataset.id, e.target.checked);
  });

  // ideas: free-text rows with no duration of their own
  const ideaForm = root.querySelector('[data-idea]');
  const ideaInput = ideaForm.querySelector('input');
  const ideaMsg = root.querySelector('[data-idea-msg]');
  ideaInput.addEventListener('input', () => {
    const left = ideaInput.maxLength - ideaInput.value.length;
    ideaMsg.textContent = left <= 15 ? `${left} karakter kaldı.` : '';
  });
  ideaForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = ideaInput.value.replace(/\s+/g, ' ').trim();
    if (text.length < 3) {
      ideaMsg.textContent = 'Fikrinizi birkaç kelimeyle yazın.';
      return ideaInput.focus();
    }
    if (state.ideas.some((t) => norm(t) === norm(text))) {
      ideaMsg.textContent = 'Bu fikir zaten planınızda.';
      return ideaInput.focus();
    }
    state.ideas.push(text);
    ideaInput.value = '';
    ideaMsg.textContent = 'Fikir plana eklendi.';
    renderIdeas();
    update();
  });

  const ideaList = document.createElement('ul');
  ideaList.className = 'board__ideas';
  ideaForm.before(ideaList);
  const removeIdea = (i) => {
    state.ideas.splice(i, 1);
    renderIdeas();
    update();
  };
  ideaList.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-remove]');
    if (!btn) return;
    removeIdea(Number(btn.dataset.remove));
    ideaInput.focus();
  });

  function renderIdeas() {
    ideaList.innerHTML = state.ideas
      .map(
        (t, i) => `<li class="row row--idea">
          <span class="row__pick"><span class="row__box row__box--idea" aria-hidden="true"></span><span class="row__name">${esc(t)}</span>
          <button class="row__remove" type="button" data-remove="${i}" aria-label="${esc(t)} fikrini kaldır">${closeIcon}</button></span>
          <p class="row__desc">Süresi görüşmede netleşir.</p>
        </li>`,
      )
      .join('');
  }

  // brief chips: optional modules and ideas can be taken out right there
  chips.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-chip]');
    if (!btn) return;
    const [kind, key] = btn.dataset.chip.split(':');
    kind === 'm' ? setModule(key, false) : removeIdea(Number(key));
  });

  function summary() {
    const chosen = modules.filter((m) => state.on.has(m.id));
    const lo = chosen.reduce((s, m) => s + m.days[0], 0);
    const hi = chosen.reduce((s, m) => s + m.days[1], 0);
    return { chosen, lo, hi, range: `${weeks(lo)}–${weeks(hi)} hafta` };
  }

  function render() {
    const { chosen, hi, range } = summary();
    const mid = (m) => (m.days[0] + m.days[1]) / 2;

    // the ruler stretches with the plan so short plans still read as a schedule
    const span = Math.max(30, Math.ceil((hi * 1.15) / 10) * 10);
    // fewer ticks on narrow rulers so the numbers never collide
    const maxTicks = ruler.clientWidth < 560 ? 4 : 7;
    const step = Math.max(1, Math.ceil(span / DAYS_PER_WEEK / maxTicks));
    let ticks = '';
    const last = Math.floor(span / DAYS_PER_WEEK / step) * step;
    for (let w = 0; w <= last; w += step) {
      ticks += `<span style="left:${((w * DAYS_PER_WEEK) / span) * 100}%">${w === last ? `${w} hafta` : w}</span>`;
    }
    ruler.innerHTML = ticks;

    let cursor = 0;
    let segs = '';
    for (const m of modules) {
      const el = rowEls.get(m.id);
      const on = state.on.has(m.id);
      const len = mid(m) / span;
      const bar = el.querySelector('.row__bar');
      const ghost = el.querySelector('.row__ghost');
      el.classList.toggle('is-on', on);
      if (on) {
        bar.style.transform = `translateX(${(cursor / span) * 100}%) scaleX(${len})`;
        segs += `<span style="transform:translateX(${(cursor / span) * 100}%) scaleX(${len})"></span>`;
        cursor += mid(m);
      } else {
        bar.style.transform = `translateX(${(cursor / span) * 100}%) scaleX(0)`;
      }
      // dashed ghost: moved by transform, cut to length by clip-path, so the dashes never stretch
      ghost.style.transform = `translateX(${(cursor / span) * 100}%)`;
      ghost.style.clipPath = `inset(0 ${(1 - len) * 100}% 0 0)`;
    }
    strip.innerHTML = segs;

    finish.style.transform = flag.style.transform = `translateX(${(cursor / span) * 100}%)`;
    finishLabel.textContent = `~ ${range}`;
    flag.classList.toggle('is-late', cursor / span > 0.62);
    total.textContent = `Tahmini teslim yaklaşık ${range}.`;
    briefWeeks.textContent = `Tahmini teslim yaklaşık ${range}`;
    // like the hero headline: an outline until the visitor adds something of their own
    const picked = chosen.filter((m) => !m.base).length + state.ideas.length;
    total.classList.toggle('is-filled', picked > 0);
    barCount.textContent = picked ? `${picked} seçim` : 'Temel kurulum';

    chips.innerHTML =
      chosen
        .map((m) =>
          m.base
            ? `<li>${m.name}</li>`
            : `<li>${m.name}<button type="button" data-chip="m:${m.id}" aria-label="${m.name} planından çıkar">${closeIcon}</button></li>`,
        )
        .join('') +
      state.ideas
        .map((t, i) => `<li class="is-idea">${esc(t)}<button type="button" data-chip="i:${i}" aria-label="${esc(t)} fikrini çıkar">${closeIcon}</button></li>`)
        .join('');
  }

  function update() {
    render();
    save();
  }

  renderIdeas();
  render();
  window.addEventListener('resize', render);
  initBrief(summary, () => state.ideas);
}

function planText(summary, ideas, fields) {
  const { chosen, range } = summary();
  const lines = [
    'Merhaba KNC Studio,',
    '',
    'Sitemiz için hazırladığım plan:',
    ...chosen.map((m) => `- ${m.name} (${m.days[0]}–${m.days[1]} gün)`),
  ];
  if (ideas.length) lines.push('', 'Ek fikirler:', ...ideas.map((t) => `- ${t}`));
  lines.push('', `Tahmini teslim: yaklaşık ${range}`, '');
  if (fields.name) lines.push(`Ad: ${fields.name}`);
  if (fields.company) lines.push(`Şirket: ${fields.company}`);
  lines.push('', 'İşimiz ve ihtiyaçlarımız:', fields.needs);
  return lines.join('\n');
}

function initBrief(summary, ideas) {
  const form = document.querySelector('[data-brief]');
  const status = form.querySelector('[data-status]');
  const needs = form.querySelector('#b-needs');
  const error = form.querySelector('[data-needs-error]');
  const read = () => ({
    name: form.name.value.trim(),
    company: form.company.value.trim(),
    needs: needs.value.trim(),
  });

  // the error sits under the field it is about and is announced with it (aria-describedby)
  const ok = (f) => {
    if (f.needs.length >= 10) {
      needs.removeAttribute('aria-invalid');
      error.textContent = '';
      return true;
    }
    needs.setAttribute('aria-invalid', 'true');
    error.textContent = f.needs
      ? 'Biraz daha anlatın: ne yaptığınızı ve siteden ne beklediğinizi bir cümleyle yazın.'
      : 'Planı gönderebilmemiz için işinizi bir cümleyle anlatın.';
    needs.focus();
    return false;
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const f = read();
    if (!ok(f)) return;
    const subject = `Proje planı${f.company ? ` — ${f.company}` : ''}`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(planText(summary, ideas(), f))}`;
    status.textContent = `E-posta uygulamanız açılıyor; mesajı oradan gönderin. Açılmadıysa “Planı kopyala” ile ${CONTACT_EMAIL} adresine gönderebilirsiniz.`;
  });

  if (WHATSAPP) {
    const wa = form.querySelector('[data-whatsapp]');
    wa.hidden = false;
    wa.addEventListener('click', () => {
      const f = read();
      if (!ok(f)) return;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(planText(summary, ideas(), f))}`, '_blank', 'noopener');
      status.textContent = 'WhatsApp yeni sekmede açıldı; mesajı oradan gönderin.';
    });
  }

  form.querySelector('[data-copy]').addEventListener('click', async () => {
    const f = read();
    if (!ok(f)) return;
    try {
      await navigator.clipboard.writeText(planText(summary, ideas(), f));
      status.textContent = `Plan kopyalandı. ${CONTACT_EMAIL} adresine yapıştırıp gönderebilirsiniz.`;
    } catch {
      status.textContent = `Kopyalanamadı. Lütfen ${CONTACT_EMAIL} adresine yazın.`;
    }
  });

  needs.addEventListener('input', () => {
    needs.style.height = 'auto';
    needs.style.height = `${needs.scrollHeight}px`;
    if (needs.getAttribute('aria-invalid') && needs.value.trim().length >= 10) {
      needs.removeAttribute('aria-invalid');
      error.textContent = '';
    }
  });
}

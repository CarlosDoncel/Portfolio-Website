import { rand, type Ctx, type Scene } from '../util';

const TESTS = [
  { n: 'login.spec', es: 'usuario válido', en: 'valid user', ms: '42ms' },
  { n: 'cart.spec', es: 'total con IVA', en: 'total with tax', ms: '118ms' },
  { n: 'api.spec', es: 'GET /health → 200', en: 'GET /health → 200', ms: '67ms' },
  { n: 'form.spec', es: 'campos requeridos', en: 'required fields', ms: '89ms' },
  { n: 'perf.spec', es: 'LCP < 2.5 s', en: 'LCP < 2.5 s', ms: '204ms' },
];
const BUG = `<svg viewBox="0 0 32 32" fill="none"><g stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"><path d="M9 11 5 7M23 11l4-4M7 17H2M25 17h5M9 23l-4 4M23 23l4 4"/><path d="M13 6l-2-3M19 6l2-3"/></g><ellipse cx="16" cy="19" rx="8" ry="9" fill="#8B2635"/><circle cx="16" cy="9" r="5" fill="#1A1A1A"/><path d="M16 12v16" stroke="#F7F4EE" stroke-width="1.4" opacity=".5"/><circle cx="13.8" cy="8.5" r="1.1" fill="#F7F4EE"/><circle cx="18.2" cy="8.5" r="1.1" fill="#F7F4EE"/></svg>`;

export function createQA(root: HTMLElement, ctx: Ctx): Scene {
  root.innerHTML = `<div class="qa">
    ${TESTS.map((t, i) => `<div class="qa-row" data-i="${i}" data-s="pass" style="--i:${i}"><span class="qa-ic"></span><span class="qa-name"><b>${t.n}</b><span data-lang="es">${t.es}</span><span data-lang="en">${t.en}</span></span><span class="qa-ms">${t.ms}</span><span class="qa-badge"></span></div>`).join('')}
    <div class="qa-foot"><div class="qa-bar"><i></i></div><span class="qa-sum"></span><span class="qa-score"></span></div>
  </div>`;
  const rows = [...root.querySelectorAll<HTMLElement>('.qa-row')];
  const bar = root.querySelector<HTMLElement>('.qa-bar i')!;
  const sum = root.querySelector<HTMLElement>('.qa-sum')!;
  const scoreEl = root.querySelector<HTMLElement>('.qa-score')!;
  const timers: number[] = [];
  const bugs = new Map<number, { el: HTMLElement; t: number }>();
  let active = false, playing = false, squashed = 0, missed = 0;

  const es = () => ctx.lang() === 'es';
  function refresh() {
    const pass = rows.filter((r) => r.dataset.s === 'pass').length;
    sum.textContent = `${pass} / ${rows.length} passing`;
    bar.style.transform = `scaleX(${pass / rows.length})`;
    bar.style.background = pass === rows.length ? '#3f7d58' : '#8B2635';
    scoreEl.textContent = playing ? (es() ? `🐛 ${squashed} · escapados ${missed}` : `🐛 ${squashed} · escaped ${missed}`) : '';
  }
  const setRow = (i: number, s: 'pass' | 'fail') => { rows[i].dataset.s = s; refresh(); };
  const later = (fn: () => void, ms: number) => { const id = window.setTimeout(fn, ms); timers.push(id); return id; };

  function removeBug(i: number, dead: boolean) {
    const b = bugs.get(i); if (!b) return;
    clearTimeout(b.t); bugs.delete(i);
    if (dead) { b.el.classList.add('dead'); later(() => b.el.remove(), 320); } else b.el.remove();
  }
  function spawnBug(i: number, life: number, auto = false) {
    if (bugs.has(i)) return;
    const el = document.createElement('button');
    el.type = 'button'; el.className = 'qa-bug'; el.innerHTML = BUG; el.setAttribute('aria-label', 'bug');
    el.style.left = rand(54, 76) + '%';
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (!bugs.has(i)) return;
      removeBug(i, true); setRow(i, 'pass'); if (playing) { squashed++; refresh(); }
    });
    rows[i].appendChild(el);
    setRow(i, 'fail');
    const t = window.setTimeout(() => {
      if (auto) { removeBug(i, true); setRow(i, 'pass'); return; }
      removeBug(i, false); setRow(i, 'pass'); missed++; refresh();
    }, life);
    bugs.set(i, { el, t });
  }

  function loopGame() {
    if (!active || !playing) return;
    const free = rows.map((_, i) => i).filter((i) => !bugs.has(i));
    if (free.length) spawnBug(free[Math.floor(Math.random() * free.length)], Math.max(1200, 2300 - squashed * 55));
    later(loopGame, Math.max(420, 900 - squashed * 22));
  }
  function reset() {
    timers.forEach(clearTimeout); timers.length = 0;
    [...bugs.keys()].forEach((i) => removeBug(i, false));
    root.querySelectorAll('.qa-bug').forEach((b) => b.remove());
    rows.forEach((r) => { r.dataset.s = 'pass'; r.style.animation = 'none'; void r.offsetWidth; r.style.animation = ''; });
    squashed = 0; missed = 0; refresh();
  }

  return {
    start(engaged) {
      active = true; playing = engaged; reset();
      if (engaged) later(loopGame, 500);
      else later(() => spawnBug(2, 1500, true), 700);
    },
    stop() { active = false; playing = false; timers.forEach(clearTimeout); timers.length = 0; },
    onEngage() { if (!active) return; playing = true; reset(); later(loopGame, 450); },
  };
}

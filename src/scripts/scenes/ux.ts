import { clamp, type Ctx, type Scene } from '../util';

const COLORS = ['#8B2635', '#2F5D8A', '#3f7d58', '#C27A1A'];
const bi = (es: string, en: string) => `<span data-lang="es">${es}</span><span data-lang="en">${en}</span>`;

export function createUX(root: HTMLElement, ctx: Ctx): Scene {
  root.innerHTML = `<div class="ux">
    <div class="ux-win">
      <div class="ux-nav"><i class="ux-logo"></i><b>studio</b><span class="ux-links"><u></u><u></u><u></u></span></div>
      <div class="ux-hero">
        <div><h4>${bi('Diseño que se entiende', 'Design that makes sense')}</h4><p>${bi('Interfaces claras, probadas con personas.', 'Clear interfaces, tested with people.')}</p><span class="ux-btn">${bi('Empezar', 'Start')}</span></div>
        <div class="ux-art"><i></i><i></i></div>
      </div>
      <div class="ux-grid">
        ${[
          [bi('Usabilidad', 'Usability'), bi('Flujos simples y directos', 'Simple, direct flows')],
          [bi('Accesibilidad', 'Accessibility'), bi('Contraste y foco claros', 'Clear contrast and focus')],
          [bi('Prototipos', 'Prototypes'), bi('Probar antes de construir', 'Test before building')],
        ].map((c, i) => `<div class="ux-slot" style="--i:${i}" data-c="${i}"><div class="ux-card"><i class="ux-ic"></i><b>${c[0]}</b><span>${c[1]}</span></div></div>`).join('')}
      </div>
    </div>
    <aside class="ux-side">
      <div class="ux-lab">${bi('color', 'color')}</div>
      <div class="ux-sw">${COLORS.map((c, i) => `<button type="button" style="--c:${c}" aria-label="${c}" aria-pressed="${i === 0}" data-ci="${i}"></button>`).join('')}</div>
      <div class="ux-lab">${bi('forma', 'shape')}</div>
      <div class="ux-shape"><button type="button" data-r=".9em" aria-pressed="true">${bi('suave', 'soft')}</button><button type="button" data-r=".15em" aria-pressed="false">${bi('recta', 'sharp')}</button></div>
      <div class="ux-hex">#8B2635</div>
    </aside>
  </div>`;
  const ux = root.querySelector<HTMLElement>('.ux')!;
  const grid = root.querySelector<HTMLElement>('.ux-grid')!;
  const slots = [...root.querySelectorAll<HTMLElement>('.ux-slot')];
  const sw = [...root.querySelectorAll<HTMLButtonElement>('[data-ci]')];
  const shapes = [...root.querySelectorAll<HTMLButtonElement>('[data-r]')];
  const hex = root.querySelector<HTMLElement>('.ux-hex')!;
  let order = [0, 1, 2], ci = 0, active = false, demoTimer = 0;

  function setColor(i: number) {
    ci = i; ux.style.setProperty('--ux', COLORS[i]); hex.textContent = COLORS[i];
    sw.forEach((b, k) => b.setAttribute('aria-pressed', String(k === i)));
  }
  sw.forEach((b) => b.addEventListener('click', () => setColor(Number(b.dataset.ci))));
  shapes.forEach((b) => b.addEventListener('click', () => {
    ux.style.setProperty('--r', b.dataset.r!);
    shapes.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
  }));

  slots.forEach((el, c) => {
    el.addEventListener('pointerdown', (e) => {
      el.setPointerCapture(e.pointerId);
      const slotW = grid.clientWidth / 3, slot0 = order.indexOf(c), startX = e.clientX, startY = e.clientY;
      let target = slot0, preview = order.slice();
      el.classList.add('drag');
      const move = (ev: PointerEvent) => {
        const dx = ev.clientX - startX;
        el.style.transform = `translate(${dx}px, ${clamp((ev.clientY - startY) * 0.25, -12, 12)}px) rotate(${clamp(dx / 60, -4, 4)}deg)`;
        const tgt = clamp(Math.round(slot0 + dx / slotW), 0, 2);
        if (tgt !== target) {
          target = tgt; preview = order.filter((x) => x !== c); preview.splice(tgt, 0, c);
          preview.forEach((cc, s) => { if (cc !== c) slots[cc].style.setProperty('--i', String(s)); });
        }
      };
      const up = (ev: PointerEvent) => {
        el.removeEventListener('pointermove', move); el.removeEventListener('pointerup', up); el.removeEventListener('pointercancel', up);
        const dx = ev.clientX - startX;
        el.classList.remove('drag');
        el.style.transition = 'none';
        el.style.setProperty('--i', String(target));
        el.style.transform = `translateX(${dx - (target - slot0) * slotW}px)`;
        void el.offsetWidth;
        el.style.transition = ''; el.style.transform = '';
        order = preview;
      };
      el.addEventListener('pointermove', move); el.addEventListener('pointerup', up); el.addEventListener('pointercancel', up);
    });
  });

  return {
    start(engaged) {
      active = true; clearInterval(demoTimer);
      if (!engaged) demoTimer = window.setInterval(() => { if (!active || ctx.engaged()) return clearInterval(demoTimer); setColor((ci + 1) % COLORS.length); }, 800);
    },
    stop() { active = false; clearInterval(demoTimer); },
    onEngage() { clearInterval(demoTimer); },
  };
}

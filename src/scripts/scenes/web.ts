import { clamp, type Ctx, type Scene } from '../util';

const bi = (es: string, en: string) => `<span data-lang="es">${es}</span><span data-lang="en">${en}</span>`;
const MIN = 0.34;

export function createWeb(root: HTMLElement, ctx: Ctx): Scene {
  root.innerHTML = `<div class="web">
    <div class="web-bar">
      <button type="button" data-w="1" aria-pressed="true">Desktop</button>
      <button type="button" data-w=".62" aria-pressed="false">Tablet</button>
      <button type="button" data-w=".36" aria-pressed="false">Mobile</button>
      <span class="web-px"></span>
    </div>
    <div class="web-wrap"><div class="web-stage">
      <div class="web-frame" data-bp="lg">
        <div class="web-clip">
          <div class="web-chrome"><i></i><i></i><i></i><span class="web-url">tu-sitio.com</span></div>
          <div class="web-page">
            <header><b>studio</b><nav class="web-links"><u>${bi('Inicio', 'Home')}</u><u>${bi('Trabajo', 'Work')}</u><u>${bi('Contacto', 'Contact')}</u></nav><span class="web-burger">≡</span></header>
            <section class="web-hero"><div><h4>${bi('Hola, mundo', 'Hello, world')}</h4><p>${bi('Un sitio que se adapta a cualquier pantalla.', 'A site that adapts to any screen.')}</p><span class="web-cta">${bi('Ver más', 'Learn more')}</span></div><div class="web-img"></div></section>
            <section class="web-cards"><div><i></i><b></b><u></u></div><div><i></i><b></b><u></u></div><div><i></i><b></b><u></u></div></section>
          </div>
        </div>
        <div class="web-handle" role="slider" aria-label="resize"><span>⇆</span></div>
      </div>
    </div></div>
  </div>`;
  const stage = root.querySelector<HTMLElement>('.web-stage')!;
  const frame = root.querySelector<HTMLElement>('.web-frame')!;
  const handle = root.querySelector<HTMLElement>('.web-handle')!;
  const px = root.querySelector<HTMLElement>('.web-px')!;
  const btns = [...root.querySelectorAll<HTMLButtonElement>('[data-w]')];
  let pct = 1, raf = 0, t0 = 0, active = false;

  function apply(p: number) {
    pct = clamp(p, MIN, 1);
    frame.style.width = pct * stage.clientWidth + 'px';
    frame.dataset.bp = pct > 0.8 ? 'lg' : pct > 0.5 ? 'md' : 'sm';
    px.textContent = Math.round(375 + ((pct - MIN) / (1 - MIN)) * 905) + 'px';
    btns.forEach((b) => b.setAttribute('aria-pressed', String(Math.abs(Number(b.dataset.w) - pct) < 0.06)));
  }
  btns.forEach((b) => b.addEventListener('click', () => {
    frame.classList.add('anim'); apply(Number(b.dataset.w));
    setTimeout(() => frame.classList.remove('anim'), 400);
  }));
  handle.addEventListener('pointerdown', (e) => {
    handle.setPointerCapture(e.pointerId);
    const move = (ev: PointerEvent) => apply((ev.clientX - stage.getBoundingClientRect().left) / stage.clientWidth);
    const up = () => { handle.removeEventListener('pointermove', move); handle.removeEventListener('pointerup', up); handle.removeEventListener('pointercancel', up); };
    handle.addEventListener('pointermove', move); handle.addEventListener('pointerup', up); handle.addEventListener('pointercancel', up);
  });
  new ResizeObserver(() => apply(pct)).observe(stage);

  function demo(now: number) {
    if (!active || ctx.engaged()) return;
    const t = (now - t0) / 1000;
    apply(0.67 + 0.33 * Math.cos(t * 1.7));
    raf = requestAnimationFrame(demo);
  }
  return {
    start(engaged) {
      active = true; cancelAnimationFrame(raf); apply(1);
      if (!engaged) { t0 = performance.now(); raf = requestAnimationFrame(demo); }
    },
    stop() { active = false; cancelAnimationFrame(raf); },
    onEngage() { cancelAnimationFrame(raf); },
  };
}

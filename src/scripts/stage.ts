import type { Ctx, Scene } from './util';
import { createSoftware } from './scenes/software';
import { createWorld } from './scenes/world';
import { createUX } from './scenes/ux';
import { createQA } from './scenes/qa';
import { createGame } from './scenes/game';
import { createWeb } from './scenes/web';

const FILES = ['software.ts', 'world.scene', 'app.fig', 'tests.spec.ts', 'game.cs', 'index.html'];

export function initStage() {
  const stage = document.getElementById('stage');
  if (!stage) return;
  const roots = [...stage.querySelectorAll<HTMLElement>('[data-scene]')];
  const dots = [...stage.querySelectorAll<HTMLButtonElement>('[data-scene-dot]')];
  const hint = document.getElementById('sceneHint');
  const fileLabel = document.getElementById('sceneFile');

  let engaged = false, hover = false, visible = true, cur = -1, last = 0;
  const lang = () => (document.documentElement.lang === 'en' ? 'en' : 'es') as 'es' | 'en';

  function engage() {
    last = performance.now();
    if (engaged) return;
    engaged = true;
    document.dispatchEvent(new CustomEvent('stage-engage'));
    scenes[cur]?.onEngage?.();
  }
  const ctx: Ctx = { lang, engaged: () => engaged, engage };

  const scenes: Scene[] = [
    createSoftware(roots[0], ctx),
    createWorld(roots[1], ctx),
    createUX(roots[2], ctx),
    createQA(roots[3], ctx),
    createGame(roots[4], ctx),
    createWeb(roots[5], ctx),
  ];

  function updateHint() {
    if (hint && cur >= 0) hint.textContent = dots[cur].dataset[lang() === 'en' ? 'hintEn' : 'hintEs'] ?? '';
  }
  function show(i: number) {
    if (i === cur) return;
    scenes[cur]?.stop();
    cur = i;
    roots.forEach((r, k) => r.classList.toggle('on', k === i));
    dots.forEach((d, k) => d.setAttribute('aria-current', String(k === i)));
    if (fileLabel) fileLabel.textContent = FILES[i];
    updateHint();
    if (visible) scenes[i].start(engaged);
  }

  stage.addEventListener('pointerdown', engage, true);
  stage.addEventListener('focusin', engage);
  stage.addEventListener('pointermove', () => { if (engaged) last = performance.now(); });
  stage.addEventListener('pointerenter', () => (hover = true));
  stage.addEventListener('pointerleave', () => (hover = false));
  dots.forEach((d, i) => d.addEventListener('click', () => document.dispatchEvent(new CustomEvent('requestscene', { detail: i }))));

  document.addEventListener('keydown', (e) => {
    const inside = stage.contains(document.activeElement);
    if (!(inside || (engaged && hover))) return;
    if (scenes[cur]?.key?.(e)) { e.preventDefault(); engage(); }
  });

  // hand control back to the auto-cycle after a few idle seconds
  setInterval(() => {
    if (engaged && performance.now() - last > 6000 && !stage.contains(document.activeElement)) {
      engaged = false;
      document.dispatchEvent(new CustomEvent('stage-release'));
    }
  }, 500);

  // keep animation loops off while the stage is scrolled out of view
  new IntersectionObserver((es) => {
    visible = es[0].isIntersecting;
    if (cur < 0) return;
    visible ? scenes[cur].start(engaged) : scenes[cur].stop();
  }, { threshold: 0.05 }).observe(stage);

  document.addEventListener('scene', (e) => show((e as CustomEvent<number>).detail));
  document.addEventListener('langchange', updateHint);
  show(0);
}

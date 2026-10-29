import type { Ctx, Scene } from '../util';

const EMAIL = 'carlosdoncel2004@gmail.com';

export function createSoftware(root: HTMLElement, ctx: Ctx): Scene {
  root.innerHTML = `
  <div class="sw">
    <div class="sw-top"><span>~/carlos</span><b>● build passing</b></div>
    <div class="sw-out" aria-live="polite"></div>
    <form class="sw-line"><span class="sw-p">carlos@doncel:~$</span><input class="sw-in" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="terminal" /></form>
    <div class="sw-chips">
      ${['help', 'skills', 'projects', 'contact', 'clear'].map((c) => `<button type="button" data-cmd="${c}">${c}</button>`).join('')}
    </div>
  </div>`;
  const out = root.querySelector<HTMLElement>('.sw-out')!;
  const input = root.querySelector<HTMLInputElement>('.sw-in')!;
  const form = root.querySelector<HTMLFormElement>('.sw-line')!;
  const timers: number[] = [];
  const history: string[] = [];
  let hi = 0, active = false, used = false;

  const es = () => ctx.lang() === 'es';
  const print = (html: string) => {
    const d = document.createElement('div');
    d.className = 'l'; d.innerHTML = html; out.appendChild(d);
    out.scrollTop = out.scrollHeight;
  };
  const welcome = () => print(es() ? 'Hola 👋 escribe un comando o toca uno de abajo.' : 'Hi 👋 type a command or tap one below.');

  const commands: Record<string, () => string[]> = {
    help: () => [es() ? 'comandos disponibles:' : 'available commands:', '  <span class="k">about · skills · projects · contact · clear</span>', es() ? 'prueba también: <span class="k">sudo hire carlos</span>' : 'also try: <span class="k">sudo hire carlos</span>'],
    about: () => [es() ? 'Carlos Doncel — Ingeniero Multimedia, Bogotá.' : 'Carlos Doncel — Multimedia Engineer, Bogotá.', es() ? 'Videojuegos, VR, UX/UI, software y QA.' : 'Games, VR, UX/UI, software and QA.'],
    whoami: () => ['carlos@doncel'],
    ls: () => ['skills.txt  projects/  contact.txt'],
    skills: () => ['<span class="k">code</span>   Unity · C# · C++ · Python · JS/TS', '<span class="k">web</span>    React · FastAPI · PostgreSQL · Tailwind', '<span class="k">ux/ui</span>  Figma · Maya · Substance 3D', '<span class="k">qa</span>     ' + (es() ? 'testing funcional · Scrum' : 'functional testing · Scrum')],
    projects: () => ['01  Alas del Calabozo  <span class="k">Unity · Mapbox</span>', '02  Los Ojos del Planeta  <span class="k">VR · Meta Quest</span>', '03  FlowDesk  <span class="k">React · FastAPI</span>', '04  GymTrack  <span class="k">React Native</span>', '<a href="#trabajo">' + (es() ? 'ver proyectos ↓' : 'see projects ↓') + '</a>'],
    contact: () => [`<a href="mailto:${EMAIL}">${EMAIL}</a>`, '<a href="https://www.linkedin.com/in/carlos-doncel-/" target="_blank" rel="noopener">linkedin.com/in/carlos-doncel-/ ↗</a>'],
    'sudo hire carlos': () => ['[sudo] password for recruiter: ********', '<span class="k">✓ ' + (es() ? 'permiso concedido' : 'permission granted') + '</span>', `→ <a href="mailto:${EMAIL}?subject=Hola%20Carlos">${es() ? 'escríbeme' : 'write to me'}</a>`],
  };

  function run(raw: string) {
    const cmd = raw.trim().toLowerCase().replace(/\s+/g, ' ');
    if (!cmd) return;
    used = true;
    history.push(cmd); hi = history.length;
    const e = document.createElement('div');
    e.className = 'l'; e.innerHTML = `<span class="p">carlos@doncel:~$</span> `;
    e.appendChild(document.createTextNode(raw.trim()));
    out.appendChild(e);
    if (cmd === 'clear') { out.innerHTML = ''; return; }
    const fn = commands[cmd];
    if (fn) fn().forEach(print);
    else print((es() ? 'comando no encontrado: ' : 'command not found: ') + cmd.replace(/[<>&]/g, '') + (es() ? ' · prueba <span class="k">help</span>' : ' · try <span class="k">help</span>'));
    out.scrollTop = out.scrollHeight;
  }

  const clearTimers = () => { timers.forEach(clearTimeout); timers.length = 0; };

  form.addEventListener('submit', (e) => { e.preventDefault(); run(input.value); input.value = ''; });
  root.querySelectorAll<HTMLButtonElement>('[data-cmd]').forEach((b) => b.addEventListener('click', () => { clearTimers(); input.value = ''; run(b.dataset.cmd!); }));
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && history.length) { hi = Math.max(0, hi - 1); input.value = history[hi]; e.preventDefault(); }
    if (e.key === 'ArrowDown' && history.length) { hi = Math.min(history.length, hi + 1); input.value = history[hi] ?? ''; e.preventDefault(); }
  });
  root.querySelector('.sw')!.addEventListener('click', (e) => {
    const t = e.target as HTMLElement;
    if (!t.closest('button,a') && matchMedia('(pointer: fine)').matches) input.focus();
  });

  function demo() {
    out.innerHTML = ''; welcome();
    const text = 'skills'; let i = 0;
    const type = () => {
      if (!active || ctx.engaged()) return;
      input.value = text.slice(0, ++i);
      if (i < text.length) timers.push(window.setTimeout(type, 85));
      else timers.push(window.setTimeout(() => { if (ctx.engaged()) return; input.value = ''; run(text); used = false; }, 320));
    };
    timers.push(window.setTimeout(type, 450));
  }

  return {
    start(engaged) {
      active = true; clearTimers();
      if (!used) { if (engaged) { out.innerHTML = ''; welcome(); } else demo(); }
    },
    stop() { active = false; clearTimers(); if (document.activeElement === input) input.blur(); },
    onEngage() { clearTimers(); if (!used) input.value = ''; },
  };
}

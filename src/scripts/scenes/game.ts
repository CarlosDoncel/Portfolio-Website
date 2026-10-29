import { C, H, W, MONO, DISPLAY, fitCanvas, type Ctx, type Scene } from '../util';

const GROUND = 252;
const PX = 96; // player x

interface Ob { x: number; w: number; h: number; kind: 'spike' | 'block' }
interface Coin { x: number; y: number; got: boolean }
interface Pop { x: number; y: number; t: number }

export function createGame(root: HTMLElement, ctx: Ctx): Scene {
  const canvas = root.querySelector('canvas')!;
  const g = fitCanvas(canvas);

  let mode: 'demo' | 'play' | 'over' = 'demo';
  let raf = 0, last = 0, t = 0;
  let py = GROUND, vy = 0, onGround = true, landed = 0;
  let speed = 200, dist = 0, coinsN = 0, lives = 3, inv = 0, best = 0, shake = 0, nextSpawn = 0;
  let obs: Ob[] = [], coins: Coin[] = [], pops: Pop[] = [];

  function reset() {
    py = GROUND; vy = 0; onGround = true; speed = 200; dist = 0; coinsN = 0;
    lives = 3; inv = 0; obs = []; coins = []; pops = []; nextSpawn = 260; shake = 0;
  }
  const jump = () => {
    if (!onGround) return;
    vy = -640; onGround = false;
  };
  const score = () => Math.floor(dist / 10) + coinsN * 10;

  function spawn() {
    const kind = Math.random() < 0.55 ? 'spike' : 'block';
    const o: Ob = { x: W + 30, w: kind === 'spike' ? 24 : 26, h: kind === 'spike' ? 24 : 34, kind };
    obs.push(o);
    if (Math.random() < 0.6) {
      const ys = [GROUND - 84, GROUND - 106, GROUND - 84];
      ys.forEach((y, i) => coins.push({ x: o.x - 34 + i * 32, y, got: false }));
    }
    nextSpawn = 250 + Math.random() * 150 + speed * 0.3;
  }

  function input() {
    if (mode === 'demo' || mode === 'over') { reset(); mode = 'play'; }
    jump();
  }

  function update(dt: number) {
    t += dt;
    const sp = mode === 'over' ? 0 : speed;
    if (mode !== 'over') {
      dist += sp * dt;
      if (mode === 'play') speed = Math.min(340, 200 + dist / 40);
    }
    if (!onGround) {
      vy += 1900 * dt; py += vy * dt;
      if (py >= GROUND) { py = GROUND; vy = 0; onGround = true; landed = 0.14; }
    }
    landed = Math.max(0, landed - dt);
    inv = Math.max(0, inv - dt);
    shake = Math.max(0, shake - dt);
    if (mode !== 'over') {
      nextSpawn -= sp * dt;
      if (nextSpawn <= 0) spawn();
    }
    obs.forEach((o) => (o.x -= sp * dt));
    coins.forEach((c) => (c.x -= sp * dt));
    obs = obs.filter((o) => o.x + o.w > -30);
    coins = coins.filter((c) => c.x > -20 && !c.got);
    pops.forEach((p) => (p.t += dt));
    pops = pops.filter((p) => p.t < 0.7);

    if (mode === 'demo' && onGround) {
      const n = obs.find((o) => o.x + o.w > PX);
      if (n) {
        const gap = n.x - (PX + 30);
        if (gap > 0 && gap < speed * 0.28) jump();
      }
    }
    // coins
    coins.forEach((c) => {
      if (Math.hypot(c.x - (PX + 15), c.y - (py - 17)) < 20) {
        c.got = true;
        if (mode === 'play') { coinsN++; pops.push({ x: c.x, y: c.y, t: 0 }); }
      }
    });
    // collisions
    if (mode === 'play' && inv <= 0) {
      for (const o of obs) {
        const hit = PX + 26 > o.x + 3 && PX + 4 < o.x + o.w - 3 && py > GROUND - o.h + 5;
        if (hit) {
          lives--; inv = 1.1; shake = 0.25; obs = obs.filter((x) => x !== o);
          if (lives <= 0) { mode = 'over'; best = Math.max(best, score()); }
          break;
        }
      }
    }
  }

  const circle = (x: number, y: number, r: number) => { g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill(); };

  function mountains(factor: number, alpha: number, base: number, h: number) {
    const off = -((dist * factor) % W);
    g.fillStyle = `rgba(26,26,26,${alpha})`;
    for (let k = 0; k < 2; k++) {
      const ox = off + k * W;
      g.beginPath();
      g.moveTo(ox, base);
      const pts = [[0, 0.1], [50, 0.85], [110, 0.35], [175, 1], [240, 0.3], [300, 0.7], [360, 0.25], [440, 0.6]];
      pts.forEach(([x, y]) => g.lineTo(ox + x, base - y * h));
      g.lineTo(ox + W, base); g.closePath(); g.fill();
    }
  }

  function draw() {
    g.save();
    if (shake > 0) g.translate((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 5);
    g.fillStyle = C.paper2; g.fillRect(-10, -10, W + 20, H + 20);
    g.fillStyle = 'rgba(139,38,53,.09)'; circle(352, 92, 54);
    g.fillStyle = 'rgba(139,38,53,.14)'; circle(352, 92, 32);
    mountains(0.12, 0.05, GROUND, 120);
    mountains(0.3, 0.08, GROUND, 78);
    g.fillStyle = 'rgba(26,26,26,.1)'; g.fillRect(-10, GROUND, W + 20, H - GROUND + 10);
    g.fillStyle = C.ink; g.fillRect(-10, GROUND - 1, W + 20, 2.5);
    g.fillStyle = 'rgba(26,26,26,.28)';
    const toff = -(dist % 36);
    for (let x = toff; x < W; x += 36) g.fillRect(x, GROUND + 22, 16, 2.5);

    // obstacles
    obs.forEach((o) => {
      if (o.kind === 'spike') {
        g.fillStyle = C.ink;
        g.beginPath(); g.moveTo(o.x, GROUND); g.lineTo(o.x + o.w / 2, GROUND - o.h); g.lineTo(o.x + o.w, GROUND); g.closePath(); g.fill();
        g.fillStyle = C.accent;
        g.beginPath(); g.moveTo(o.x + 6, GROUND); g.lineTo(o.x + o.w / 2, GROUND - o.h + 9); g.lineTo(o.x + o.w - 6, GROUND); g.closePath(); g.fill();
      } else {
        g.fillStyle = C.accent; g.beginPath(); g.roundRect(o.x, GROUND - o.h, o.w, o.h, 4); g.fill();
        g.fillStyle = 'rgba(255,255,255,.22)'; g.fillRect(o.x + 4, GROUND - o.h + 5, o.w - 8, 4);
        g.fillStyle = 'rgba(26,26,26,.35)'; g.fillRect(o.x + 4, GROUND - 9, o.w - 8, 4);
      }
    });
    // coins
    coins.forEach((c, i) => {
      const w = Math.abs(Math.cos(t * 4 + i));
      g.fillStyle = C.accent; g.beginPath(); g.ellipse(c.x, c.y, 3 + 5 * w, 8, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = 'rgba(255,255,255,.35)'; g.beginPath(); g.ellipse(c.x - 1, c.y - 2, 1 + 1.5 * w, 3, 0, 0, Math.PI * 2); g.fill();
    });
    // shadow
    g.fillStyle = 'rgba(26,26,26,.18)';
    const sh = 1 - Math.min(0.6, (GROUND - py) / 160);
    g.beginPath(); g.ellipse(PX + 15, GROUND + 3, 18 * sh, 4 * sh, 0, 0, Math.PI * 2); g.fill();

    // player
    const blink = inv > 0 && Math.floor(inv * 14) % 2 === 0;
    if (!blink) {
      const air = !onGround;
      const sy = air ? 1 + Math.min(0.16, Math.abs(vy) / 4200) : landed > 0 ? 0.88 : 1;
      const sx = 1 / sy;
      g.save();
      g.translate(PX + 15, py);
      g.scale(sx, sy);
      // scarf
      g.strokeStyle = C.accent; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath();
      g.moveTo(-13, -22);
      for (let i = 1; i <= 4; i++) g.lineTo(-13 - i * 7, -22 + Math.sin(t * 12 + i) * 3 + (air ? -vy * 0.012 : 0) * i * 0.4);
      g.stroke();
      // legs
      g.fillStyle = C.ink;
      const l = onGround ? Math.sin(t * 20) * 5 : 0;
      g.fillRect(-11 + l, -4, 8, 6); g.fillRect(3 - l, -4, 8, 6);
      // body
      g.beginPath(); g.roundRect(-15, -36, 30, 34, 7); g.fill();
      g.fillStyle = C.paper;
      g.beginPath(); g.roundRect(1, -28, 8, 10, 2); g.fill();
      g.beginPath(); g.roundRect(-9, -28, 8, 10, 2); g.fill();
      g.fillStyle = C.ink; g.fillRect(4, -25, 3.5, 5); g.fillRect(-6, -25, 3.5, 5);
      g.restore();
    }
    pops.forEach((p) => {
      g.globalAlpha = 1 - p.t / 0.7; g.fillStyle = C.accent; g.font = `600 12px ${MONO}`; g.textAlign = 'center';
      g.fillText('+10', p.x, p.y - p.t * 40); g.globalAlpha = 1;
    });

    // HUD
    g.font = `700 16px ${MONO}`; g.textAlign = 'left';
    for (let i = 0; i < 3; i++) { g.fillStyle = i < lives ? C.accent : 'rgba(26,26,26,.18)'; g.fillText('♥', 18 + i * 20, 34); }
    g.textAlign = 'right'; g.fillStyle = C.ink; g.font = `600 12px ${MONO}`;
    g.fillText('SCORE ' + String(score()).padStart(5, '0'), W - 18, 32);
    if (best) { g.fillStyle = C.dim; g.font = `500 10px ${MONO}`; g.fillText('BEST ' + String(best).padStart(5, '0'), W - 18, 48); }

    const es = ctx.lang() === 'es';
    if (mode === 'demo') {
      const a = 0.75 + 0.25 * Math.sin(t * 4);
      const txt = es ? '▶ CLIC O ESPACIO PARA JUGAR' : '▶ CLICK OR SPACE TO PLAY';
      g.font = `600 11px ${MONO}`; const w = g.measureText(txt).width + 28;
      g.globalAlpha = a; g.fillStyle = C.ink; g.beginPath(); g.roundRect((W - w) / 2, 66, w, 26, 13); g.fill();
      g.fillStyle = C.paper; g.textAlign = 'center'; g.fillText(txt, W / 2, 83); g.globalAlpha = 1;
    }
    if (mode === 'over') {
      g.fillStyle = 'rgba(247,244,238,.82)'; g.fillRect(0, 0, W, H);
      g.textAlign = 'center'; g.fillStyle = C.accent; g.font = `700 34px ${DISPLAY}`;
      g.fillText('GAME OVER', W / 2, 132);
      g.fillStyle = C.ink; g.font = `600 14px ${MONO}`;
      g.fillText((es ? 'PUNTAJE ' : 'SCORE ') + String(score()).padStart(5, '0'), W / 2, 162);
      g.fillStyle = C.dim; g.font = `500 11px ${MONO}`;
      g.fillText(es ? 'clic para reintentar' : 'click to retry', W / 2, 190);
    }
    g.restore();
  }

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    update(dt); draw();
    raf = requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (e) => { e.preventDefault(); input(); });

  return {
    start() { mode = 'demo'; reset(); cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { cancelAnimationFrame(raf); },
    key(e) {
      if (e.key === ' ' || e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') { input(); return true; }
      return false;
    },
  };
}

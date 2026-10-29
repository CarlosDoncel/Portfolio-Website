import { C, H, W, MONO, clamp, fitCanvas, type Ctx, type Scene } from '../util';

type V3 = [number, number, number];
const CX = W / 2, CY = 138, F = 600, D = 9, FLOOR = -1.7, HALF = 0.92;

export function createWorld(root: HTMLElement, _ctx: Ctx): Scene {
  const canvas = root.querySelector('canvas')!;
  const g = fitCanvas(canvas);
  let yaw = 0.7, pitch = -0.38, vyaw = 0, raf = 0, last = 0, t = 0;
  let drag: { x: number; y: number; time: number } | null = null;

  const stars = Array.from({ length: 16 }, (_, i) => [
    (i * 97) % W, 14 + ((i * 53) % 150), 0.8 + (i % 3) * 0.5, 4 + (i % 4) * 3,
  ]);

  const rot = (x: number, y: number, z: number): V3 => {
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
    const x1 = x * cy + z * sy, z1 = -x * sy + z * cy;
    return [x1, y * cp - z1 * sp, y * sp + z1 * cp];
  };
  const proj = (p: V3) => { const s = F / (p[2] + D); return { x: CX + p[0] * s, y: CY - p[1] * s, s, z: p[2] }; };

  function frame(dt: number) {
    t += dt;
    if (!drag) {
      yaw += (vyaw + 0.32) * dt;
      vyaw *= Math.pow(0.04, dt);
    }
    g.fillStyle = C.paper2; g.fillRect(0, 0, W, H);

    // stars (parallax with yaw)
    g.fillStyle = C.ink;
    stars.forEach(([x, y, r, k]) => {
      g.globalAlpha = 0.28;
      g.beginPath(); g.arc(((x - yaw * k * 6) % W + W) % W, y, r, 0, 7); g.fill();
    });
    g.globalAlpha = 1;

    // floor grid with radial fade
    g.lineWidth = 1;
    const seg = 10, R = 4, step = 0.8;
    for (let i = -5; i <= 5; i++) {
      for (let axis = 0; axis < 2; axis++) {
        for (let s = 0; s < seg; s++) {
          const a = -R + (2 * R * s) / seg, b = -R + (2 * R * (s + 1)) / seg;
          const c = i * step;
          const p1 = axis ? rot(a, FLOOR, c) : rot(c, FLOOR, a);
          const p2 = axis ? rot(b, FLOOR, c) : rot(c, FLOOR, b);
          const mid = (a + b) / 2;
          const rad = Math.hypot(mid, c);
          const alpha = Math.max(0, 1 - rad / (R * 1.15)) * 0.5;
          if (alpha <= 0.02 || p1[2] + D < 0.8 || p2[2] + D < 0.8) continue;
          const q1 = proj(p1), q2 = proj(p2);
          g.strokeStyle = `rgba(26,26,26,${alpha})`;
          g.beginPath(); g.moveTo(q1.x, q1.y); g.lineTo(q2.x, q2.y); g.stroke();
        }
      }
    }

    const bob = 0.12 * Math.sin(t * 1.6);
    const cyc = 0.15 + bob;

    // shadow
    const fp = proj(rot(0, FLOOR, 0));
    const rx = 1.2 * fp.s * (1 - bob * 0.8);
    g.fillStyle = 'rgba(26,26,26,.14)';
    g.beginPath(); g.ellipse(fp.x, fp.y, rx, rx * (0.08 + 0.9 * Math.abs(Math.sin(pitch)) * 0.55), 0, 0, 7); g.fill();

    // orbit ring (behind/in front handled by single pass: dashed)
    g.strokeStyle = 'rgba(139,38,53,.65)'; g.lineWidth = 1.6; g.lineCap = 'round';
    g.setLineDash([2, 7]); g.lineDashOffset = -t * 22; g.beginPath();
    for (let i = 0; i <= 72; i++) {
      const a = (i / 72) * Math.PI * 2;
      const q = proj(rot(Math.cos(a) * 2.4, cyc, Math.sin(a) * 2.4));
      i ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y);
    }
    g.stroke(); g.setLineDash([]);

    // cube
    const v: V3[] = [];
    for (let i = 0; i < 8; i++) v.push(rot(((i & 1) ? 1 : -1) * HALF, cyc + ((i & 2) ? 1 : -1) * HALF, ((i & 4) ? 1 : -1) * HALF));
    const P = v.map(proj);
    // thin back+front edges
    g.strokeStyle = 'rgba(139,38,53,.32)'; g.lineWidth = 1;
    for (let i = 0; i < 8; i++) for (const b of [1, 2, 4]) if (!(i & b)) {
      g.beginPath(); g.moveTo(P[i].x, P[i].y); g.lineTo(P[i | b].x, P[i | b].y); g.stroke();
    }
    const faces: { idx: number[]; n: V3 }[] = [
      { idx: [0, 2, 6, 4], n: [-1, 0, 0] }, { idx: [1, 3, 7, 5], n: [1, 0, 0] },
      { idx: [0, 1, 5, 4], n: [0, -1, 0] }, { idx: [2, 3, 7, 6], n: [0, 1, 0] },
      { idx: [0, 1, 3, 2], n: [0, 0, -1] }, { idx: [4, 5, 7, 6], n: [0, 0, 1] },
    ];
    faces.forEach((f) => {
      const n = rot(f.n[0], f.n[1], f.n[2]);
      if (n[2] >= 0) return;
      const shade = -n[2];
      g.fillStyle = `rgba(139,38,53,${0.1 + 0.28 * shade})`;
      g.strokeStyle = C.accent; g.lineWidth = 2; g.lineJoin = 'round';
      g.beginPath(); f.idx.forEach((k, i) => (i ? g.lineTo(P[k].x, P[k].y) : g.moveTo(P[k].x, P[k].y))); g.closePath();
      g.fill(); g.stroke();
    });

    // orbiters
    for (let k = 0; k < 3; k++) {
      const a = t * 0.9 + k * ((Math.PI * 2) / 3);
      const q = proj(rot(Math.cos(a) * 2.4, cyc + Math.sin(a * 2 + k) * 0.35, Math.sin(a) * 2.4));
      const r = q.s * 0.1;
      g.fillStyle = k === 1 ? C.ink : C.accent;
      g.beginPath(); g.moveTo(q.x, q.y - r); g.lineTo(q.x + r, q.y); g.lineTo(q.x, q.y + r); g.lineTo(q.x - r, q.y); g.closePath(); g.fill();
    }

    // HUD
    g.fillStyle = C.dim; g.font = `500 10px ${MONO}`; g.textAlign = 'left';
    g.fillText('FOV 110° · 6DoF', 16, H - 16);
    g.textAlign = 'right';
    const deg = (r: number) => String(Math.round(((r * 180) / Math.PI) % 360)).padStart(4, ' ');
    g.fillText(`yaw ${deg(yaw)}°  pitch ${deg(pitch)}°`, W - 16, H - 16);
    g.strokeStyle = 'rgba(26,26,26,.25)'; g.lineWidth = 1;
    g.strokeRect(10, 10, 14, 14); g.strokeRect(W - 24, 10, 14, 14);
  }

  function loop(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now; frame(dt);
    raf = requestAnimationFrame(loop);
  }

  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    drag = { x: e.clientX, y: e.clientY, time: performance.now() };
    vyaw = 0;
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = e.clientY - drag.y, now = performance.now();
    const dtm = Math.max(1, now - drag.time) / 1000;
    yaw += dx * 0.012; pitch = clamp(pitch + dy * 0.008, -1.25, 0.3);
    vyaw = clamp((dx * 0.012) / dtm, -9, 9) * 0.5 + vyaw * 0.5;
    drag = { x: e.clientX, y: e.clientY, time: now };
  });
  const up = () => (drag = null);
  canvas.addEventListener('pointerup', up);
  canvas.addEventListener('pointercancel', up);

  return {
    start() { cancelAnimationFrame(raf); last = performance.now(); raf = requestAnimationFrame(loop); },
    stop() { cancelAnimationFrame(raf); drag = null; },
  };
}

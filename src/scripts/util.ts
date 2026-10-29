export interface Scene {
  start(engaged: boolean): void;
  stop(): void;
  onEngage?(): void;
  /** return true if the key was handled (page will not scroll) */
  key?(e: KeyboardEvent): boolean;
}
export interface Ctx {
  lang(): 'es' | 'en';
  engaged(): boolean;
  engage(): void;
}

export const C = {
  ink: '#1A1A1A',
  paper: '#F7F4EE',
  paper2: '#EFEAE0',
  accent: '#8B2635',
  dim: '#6B655D',
  green: '#3f7d58',
};
export const W = 440;
export const H = 330;
export const MONO = '"IBM Plex Mono", ui-monospace, monospace';
export const DISPLAY = '"Space Grotesk", ui-sans-serif, sans-serif';

/** Canvas with a fixed 440x330 logical space, scaled to its CSS size. */
export function fitCanvas(canvas: HTMLCanvasElement) {
  const g = canvas.getContext('2d')!;
  const apply = () => {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    g.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);
  };
  apply();
  new ResizeObserver(apply).observe(canvas);
  return g;
}

export function toLogical(canvas: HTMLCanvasElement, e: PointerEvent) {
  const r = canvas.getBoundingClientRect();
  return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H };
}

export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

/**
 * Shared brand tokens + canvas helpers for the OG-image and video render targets.
 * Mirrors the CSS custom properties in src/styles/global.css so every off-site
 * asset stays on-brand from the same palette.
 */
import { GlobalFonts } from '@napi-rs/canvas';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const fontDir = join(here, '..', 'assets', 'fonts');

export const COLORS = {
  sky: '#1f8ad0',
  skyInk: '#0b4a76',
  skySoft: '#d6ecfa',
  sun: '#f2a51c',
  sunInk: '#9a6205',
  sunSoft: '#fbe6ba',
  pop: '#e5496b',
  ink: '#16273a',
  muted: '#55697c',
  paper: '#f3f9fd',
  surface: '#ffffff',
  line: '#d9e6f0',
  white: '#ffffff',
};

/** Register brand fonts if their TTFs are present; fall back to system fonts. */
export function registerFonts() {
  const tryReg = (file, family) => {
    const p = join(fontDir, file);
    if (existsSync(p)) {
      GlobalFonts.registerFromPath(p, family);
      return true;
    }
    return false;
  };
  const display = tryReg('Bricolage.ttf', 'Brand Display') ? 'Brand Display' : 'sans-serif';
  const body = tryReg('InstrumentSans.ttf', 'Brand Body') ? 'Brand Body' : 'sans-serif';
  const data = tryReg('SpaceGrotesk.ttf', 'Brand Data') ? 'Brand Data' : 'monospace';
  return { display, body, data };
}

/** Rounded-rect path helper. */
export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Word-wrap `text` to a max pixel width; returns an array of lines. */
export function wrapText(ctx, text, maxWidth) {
  const words = text.split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/** Deterministic ticker-tape confetti (papelitos) using a seeded PRNG so frames
 *  are reproducible. Draws n rotated rectangles across the canvas. */
export function drawConfetti(ctx, w, h, n, seed = 7, alpha = 1) {
  let s = seed >>> 0;
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
  const palette = [COLORS.sky, COLORS.sun, COLORS.pop, COLORS.white, COLORS.skySoft];
  ctx.save();
  ctx.globalAlpha = alpha;
  for (let i = 0; i < n; i++) {
    const x = rnd() * w;
    const y = rnd() * h;
    const rw = 6 + rnd() * 12;
    const rh = 10 + rnd() * 20;
    const rot = (rnd() - 0.5) * Math.PI;
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot);
    ctx.fillStyle = palette[(rnd() * palette.length) | 0];
    ctx.globalAlpha = alpha * (0.5 + rnd() * 0.5);
    ctx.fillRect(-rw / 2, -rh / 2, rw, rh);
    ctx.restore();
  }
  ctx.restore();
}

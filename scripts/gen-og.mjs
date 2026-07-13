/**
 * Generates the social-share OG images (1200×630) for each locale into
 * public/og/<locale>.png, on-brand from the shared tokens. Run: node scripts/gen-og.mjs
 */
import { createCanvas } from '@napi-rs/canvas';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { COLORS, registerFonts, drawConfetti, roundRect } from './brand.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public', 'og');
mkdirSync(outDir, { recursive: true });
const F = registerFonts();

const COPY = {
  en: {
    title: 'La Alegría',
    sub: 'A celebration of Argentina’s World Cup run —\nwith the homework done on the gossip.',
    tag: 'JOY · HONEST LOOK · JOY',
  },
  es: {
    title: 'La Alegría',
    sub: 'Un festejo de la campaña de Argentina —\ncon la tarea hecha sobre los chismes.',
    tag: 'ALEGRÍA · MIRADA HONESTA · ALEGRÍA',
  },
};

function render(locale) {
  const W = 1200;
  const H = 630;
  const c = createCanvas(W, H);
  const ctx = c.getContext('2d');

  // background: sunlit gradient
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, COLORS.skySoft);
  g.addColorStop(1, COLORS.paper);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  drawConfetti(ctx, W, 220, 60, 11, 0.9);

  // top albiceleste bar
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, W, 14);
  ctx.fillStyle = COLORS.sun;
  ctx.fillRect(0, 14, W, 6);

  const copy = COPY[locale];

  // sun disc
  ctx.beginPath();
  ctx.arc(W - 150, 165, 70, 0, Math.PI * 2);
  ctx.fillStyle = COLORS.sun;
  ctx.fill();

  // title
  ctx.fillStyle = COLORS.skyInk;
  ctx.font = `800 118px ${F.display}`;
  ctx.textBaseline = 'alphabetic';
  ctx.fillText(copy.title, 72, 260);

  // Argentine flag emoji-ish stripes accent under title
  ctx.fillStyle = COLORS.sky;
  roundRect(ctx, 74, 292, 250, 10, 5);
  ctx.fill();

  // subtitle (two lines)
  ctx.fillStyle = COLORS.ink;
  ctx.font = `500 40px ${F.body}`;
  copy.sub.split('\n').forEach((line, i) => {
    ctx.fillText(line, 74, 380 + i * 54);
  });

  // tag chip
  ctx.font = `600 26px ${F.data}`;
  const tagW = ctx.measureText(copy.tag).width + 44;
  ctx.fillStyle = COLORS.sunSoft;
  roundRect(ctx, 74, 500, tagW, 52, 26);
  ctx.fill();
  ctx.fillStyle = COLORS.sunInk;
  ctx.fillText(copy.tag, 96, 534);

  // byline + little albiceleste flag chip (drawn, not emoji)
  ctx.fillStyle = COLORS.muted;
  ctx.font = `500 26px ${F.body}`;
  ctx.textAlign = 'right';
  const by = locale === 'es' ? 'por Emmanuel Oga' : 'by Emmanuel Oga';
  ctx.fillText(by, W - 118, 590);
  ctx.textAlign = 'left';
  const fx = W - 104;
  const fy = 570;
  ctx.fillStyle = COLORS.sky;
  roundRect(ctx, fx, fy, 44, 30, 5);
  ctx.fill();
  ctx.fillStyle = COLORS.white;
  ctx.fillRect(fx, fy + 10, 44, 10);
  ctx.fillStyle = COLORS.sun;
  ctx.beginPath();
  ctx.arc(fx + 22, fy + 15, 5, 0, Math.PI * 2);
  ctx.fill();

  const out = join(outDir, `${locale}.png`);
  writeFileSync(out, c.toBuffer('image/png'));
  console.log('wrote', out);
}

for (const l of ['en', 'es']) render(l);

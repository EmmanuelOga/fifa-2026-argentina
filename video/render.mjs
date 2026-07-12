/**
 * Video render target — `pnpm render:video`.
 *
 * Composes selected content units (hook → the story in 3 beats → the four
 * hypotheses at a glance → who-wins snapshot → vamos closing) into a short 9:16
 * MP4, one per locale, into video/out/. Reads the SAME content layer as the site,
 * so a content edit propagates here on the next render. Speculative labels stay
 * on screen — guardrails apply to every output.
 *
 * Pipeline: @napi-rs/canvas frames → ffmpeg (image2pipe → H.264 MP4). Lighter
 * than Remotion and keeps React entirely out of the site bundle.
 */
import { createCanvas } from '@napi-rs/canvas';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { COLORS, registerFonts, roundRect, wrapText, drawConfetti } from '../scripts/brand.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });
const F = registerFonts();

const W = 1080;
const H = 1920;
const FPS = 30;

const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const sections = Object.fromEntries(read('src/content/sections.json').map((s) => [s.id, s.content]));
const hypotheses = read('src/content/hypotheses.json');
const UI = {
  en: { spec: 'SPECULATIVE', tag: 'A celebration with footnotes', who: 'Who wins? (speculative)', by: 'by Emmanuel Oga' },
  es: { spec: 'ESPECULATIVO', tag: 'Una celebración con notas al pie', who: '¿Quién gana? (especulativo)', by: 'por Emmanuel Oga' },
};
const AUTHOR = { FRA: [33, 40], ESP: [20, 24], ENG: [18, 23], ARG: [17, 22] };
const NAMES = {
  en: { FRA: 'France', ESP: 'Spain', ENG: 'England', ARG: 'Argentina' },
  es: { FRA: 'Francia', ESP: 'España', ENG: 'Inglaterra', ARG: 'Argentina' },
};

const easeOut = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 3);

/** Shared background: sunlit gradient + a settled confetti band up top. */
function bg(ctx) {
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, COLORS.skySoft);
  g.addColorStop(1, COLORS.paper);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = COLORS.sky;
  ctx.fillRect(0, 0, W, 16);
  ctx.fillStyle = COLORS.sun;
  ctx.fillRect(0, 16, W, 7);
}

function specPill(ctx, x, y, label) {
  ctx.font = `600 30px ${F.data}`;
  const w = ctx.measureText(label).width + 40;
  ctx.fillStyle = COLORS.pop;
  roundRect(ctx, x, y, w, 46, 23);
  ctx.fill();
  ctx.fillStyle = '#fff';
  ctx.fillText(label, x + 20, y + 32);
  return w;
}

function centeredBlock(ctx, lines, font, color, cx, startY, lh) {
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textAlign = 'center';
  lines.forEach((l, i) => ctx.fillText(l, cx, startY + i * lh));
  ctx.textAlign = 'left';
}

// ── scenes: each returns draw(ctx, p) where p is 0..1 progress within the scene ──
function scene(locale) {
  const t = UI[locale];
  const S = (id, field) => sections[id][locale][field];

  return [
    // 1. Hook
    {
      dur: 3.5,
      draw(ctx, p) {
        bg(ctx);
        drawConfetti(ctx, W, 620, 90, 11, easeOut(p * 2));
        const a = easeOut((p - 0.05) * 3);
        ctx.globalAlpha = a;
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.skyInk;
        ctx.font = `800 150px ${F.display}`;
        ctx.fillText('La Alegría', W / 2, 820);
        ctx.fillStyle = COLORS.sun;
        roundRect(ctx, W / 2 - 160, 880, 320, 12, 6);
        ctx.fill();
        ctx.fillStyle = COLORS.ink;
        ctx.font = `500 46px ${F.body}`;
        wrapText(ctx, t.tag, 760).forEach((l, i) => ctx.fillText(l, W / 2, 990 + i * 60));
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      },
    },
    // 2. Story in 3 beats
    ...['story-intro', 'story-two-threads', 'story-takeaway'].map((id, idx) => ({
      dur: 4,
      draw(ctx, p) {
        bg(ctx);
        const a = easeOut(p * 2.5);
        ctx.globalAlpha = a;
        ctx.fillStyle = COLORS.muted;
        ctx.font = `600 34px ${F.data}`;
        ctx.textAlign = 'center';
        ctx.fillText(`${idx + 1} / 3`, W / 2, 620);
        ctx.fillStyle = COLORS.skyInk;
        ctx.font = `800 66px ${F.display}`;
        wrapText(ctx, S(id, 'headline'), 900).forEach((l, i) => ctx.fillText(l, W / 2, 760 + i * 76));
        ctx.fillStyle = COLORS.ink;
        ctx.font = `400 44px ${F.body}`;
        const lines = wrapText(ctx, S(id, 'short'), 880);
        lines.forEach((l, i) => ctx.fillText(l, W / 2, 1020 + i * 58));
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      },
    })),
    // 3. Four hypotheses at a glance
    {
      dur: 6,
      draw(ctx, p) {
        bg(ctx);
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.skyInk;
        ctx.font = `800 64px ${F.display}`;
        ctx.fillText(locale === 'es' ? 'Cuatro hipótesis' : 'Four hypotheses', W / 2, 360);
        ctx.textAlign = 'left';
        specPill(ctx, W / 2 - 110, 400, t.spec);
        hypotheses.forEach((h, i) => {
          const reveal = easeOut(p * 4 - i * 0.5);
          if (reveal <= 0) return;
          ctx.globalAlpha = reveal;
          const y = 560 + i * 300;
          const col = h.thread === 'financial' ? COLORS.sun : COLORS.sky;
          ctx.fillStyle = '#fff';
          roundRect(ctx, 80, y, W - 160, 260, 26);
          ctx.fill();
          ctx.fillStyle = col;
          roundRect(ctx, 80, y, 14, 260, 7);
          ctx.fill();
          ctx.fillStyle = col;
          ctx.font = `700 54px ${F.data}`;
          ctx.fillText(h.code, 130, y + 80);
          ctx.fillStyle = COLORS.skyInk;
          ctx.font = `700 52px ${F.data}`;
          const rng = `${(h.rangeLow * 100).toFixed(0)}–${(h.rangeHigh * 100).toFixed(0)}%`;
          ctx.textAlign = 'right';
          ctx.fillText(rng, W - 130, y + 80);
          ctx.textAlign = 'left';
          ctx.fillStyle = COLORS.ink;
          ctx.font = `500 40px ${F.body}`;
          wrapText(ctx, h.content[locale].headline, W - 320).slice(0, 3).forEach((l, k) =>
            ctx.fillText(l, 130, y + 150 + k * 50),
          );
          ctx.globalAlpha = 1;
        });
      },
    },
    // 4. Who wins snapshot
    {
      dur: 5,
      draw(ctx, p) {
        bg(ctx);
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.skyInk;
        ctx.font = `800 64px ${F.display}`;
        ctx.fillText(t.who, W / 2, 420);
        ctx.textAlign = 'left';
        const order = ['FRA', 'ESP', 'ENG', 'ARG'];
        order.forEach((code, i) => {
          const y = 620 + i * 230;
          const [lo, hi] = AUTHOR[code];
          const mid = (lo + hi) / 2;
          const grow = easeOut(p * 3 - i * 0.4);
          ctx.fillStyle = COLORS.ink;
          ctx.font = `600 46px ${F.body}`;
          ctx.fillText(NAMES[locale][code], 100, y - 20);
          ctx.fillStyle = COLORS.surface2 || '#eef6fc';
          roundRect(ctx, 100, y, W - 200, 70, 35);
          ctx.fill();
          ctx.fillStyle = code === 'ARG' ? COLORS.sun : COLORS.sky;
          roundRect(ctx, 100, y, (W - 200) * (mid / 45) * grow, 70, 35);
          ctx.fill();
          ctx.fillStyle = COLORS.skyInk;
          ctx.font = `700 46px ${F.data}`;
          ctx.textAlign = 'right';
          ctx.fillText(`${lo}–${hi}%`, W - 110, y + 52);
          ctx.textAlign = 'left';
        });
      },
    },
    // 5. Vamos closing
    {
      dur: 4,
      draw(ctx, p) {
        bg(ctx);
        drawConfetti(ctx, W, H, 120, 23, easeOut(p * 1.5));
        const a = easeOut(p * 2.5);
        ctx.globalAlpha = a;
        ctx.textAlign = 'center';
        ctx.fillStyle = COLORS.skyInk;
        ctx.font = `800 120px ${F.display}`;
        ctx.fillText('Vamos', W / 2, 820);
        ctx.fillText('Argentina', W / 2, 950);
        // drawn flag chip
        const fx = W / 2 - 60;
        ctx.fillStyle = COLORS.sky;
        roundRect(ctx, fx, 1010, 120, 82, 12);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.fillRect(fx, 1038, 120, 26);
        ctx.fillStyle = COLORS.sun;
        ctx.beginPath();
        ctx.arc(fx + 60, 1051, 13, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS.ink;
        ctx.font = `400 42px ${F.body}`;
        wrapText(ctx, S('closing-note', 'short'), 820).forEach((l, i) =>
          ctx.fillText(l, W / 2, 1180 + i * 56),
        );
        ctx.fillStyle = COLORS.muted;
        ctx.font = `500 38px ${F.body}`;
        ctx.fillText(t.by, W / 2, 1560);
        ctx.textAlign = 'left';
        ctx.globalAlpha = 1;
      },
    },
  ];
}

async function renderLocale(locale) {
  const scenes = scene(locale);
  const out = join(outDir, `la-alegria-${locale}.mp4`);
  const ff = spawn(
    'ffmpeg',
    [
      '-y',
      '-f', 'image2pipe',
      '-framerate', String(FPS),
      '-i', '-',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-movflags', '+faststart',
      out,
    ],
    { stdio: ['pipe', 'ignore', 'ignore'] },
  );

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  let total = 0;
  for (const s of scenes) {
    const frames = Math.round(s.dur * FPS);
    for (let i = 0; i < frames; i++) {
      s.draw(ctx, i / frames);
      const buf = canvas.toBuffer('image/png');
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
      total++;
    }
  }
  ff.stdin.end();
  await new Promise((res, rej) => {
    ff.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`))));
    ff.on('error', rej);
  });
  const secs = (total / FPS).toFixed(1);
  console.log(`wrote ${out}  (${total} frames, ${secs}s)`);
}

for (const loc of ['en', 'es']) {
  await renderLocale(loc);
}

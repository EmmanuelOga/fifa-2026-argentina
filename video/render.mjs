/**
 * Video render target — `pnpm render:video`.
 *
 * Composes the content layer (hook → the-final masthead → the story in 3
 * beats → four hypotheses → who-wins ranges → vamos closing) into a short
 * 9:16 MP4 per locale, into video/out/. Reads the SAME content layer as the
 * site, so a content edit propagates here on the next render. Speculative
 * labels stay on screen — guardrails apply to every output.
 *
 * Pipeline: puppeteer-core drives the installed Chromium (Edge) rendering
 * video/template.html — a WebGL2 "estadio de noche" shader background under
 * DOM overlays typeset in the site's real fonts. Frames are seeked
 * deterministically (no wall clock) and piped to ffmpeg (image2pipe → H.264).
 */
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import { readFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });

const W = 1080;
const H = 1920;
const FPS = 30;

const CHROMIUM = [
  process.env.VIDEO_BROWSER,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
].find((p) => p && existsSync(p));
if (!CHROMIUM) {
  console.error('No Chromium found — set VIDEO_BROWSER to a Chrome/Edge binary.');
  process.exit(1);
}

/* ── content layer ─────────────────────────────────────────────────────── */
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
const sections = Object.fromEntries(read('src/content/sections.json').map((s) => [s.id, s.content]));
const hypotheses = read('src/content/hypotheses.json');

const UI = {
  en: {
    spec: 'SPECULATIVE',
    tag: 'A celebration with footnotes',
    who: 'Who wins?',
    hypo: 'Four hypotheses',
    by: 'by Emmanuel Oga · la alegría',
    out: 'out',
    finalKicker: 'The final · July 19 · MetLife',
  },
  es: {
    spec: 'ESPECULATIVO',
    tag: 'Una celebración con notas al pie',
    who: '¿Quién gana?',
    hypo: 'Cuatro hipótesis',
    by: 'por Emmanuel Oga · la alegría',
    out: 'afuera',
    finalKicker: 'La final · 19 de julio · MetLife',
  },
};

/* AUTHOR ranges + display order from src/data/models.ts (single source of
 * truth) — extracted textually so the video never re-ships stale numbers. */
const modelsTs = readFileSync(join(root, 'src/data/models.ts'), 'utf8');
const rangesBlock = modelsTs.match(/AUTHOR_RANGES[^=]*=\s*{([\s\S]*?)};/)?.[1] ?? '';
const AUTHOR = Object.fromEntries(
  [...rangesBlock.matchAll(/([A-Z]{3}):\s*{\s*low:\s*([\d.]+),\s*high:\s*([\d.]+)/g)].map(
    ([, code, lo, hi]) => [code, [Math.round(lo * 100), Math.round(hi * 100)]],
  ),
);
const MODEL_ORDER = modelsTs.match(/MODEL_ORDER\s*=\s*\[([^\]]*)\]/)?.[1].match(/[A-Z]{3}/g) ?? [
  'ESP', 'ARG', 'ENG', 'FRA',
];
const NAMES = {
  en: { FRA: 'France', ESP: 'Spain', ENG: 'England', ARG: 'Argentina' },
  es: { FRA: 'Francia', ESP: 'España', ENG: 'Inglaterra', ARG: 'Argentina' },
};
const FLAGS = { FRA: '🇫🇷', ESP: '🇪🇸', ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', ARG: '🇦🇷' };

/** The finalists = teams whose author range is still alive, ARG listed last. */
const finalists = MODEL_ORDER.filter((c) => (AUTHOR[c]?.[1] ?? 0) > 0).sort((a, b) =>
  a === 'ARG' ? 1 : b === 'ARG' ? -1 : 0,
);

function sceneData(locale) {
  const t = UI[locale];
  const S = (id, field) => sections[id]?.[locale]?.[field] ?? '';
  return {
    tag: t.tag,
    spec: t.spec,
    by: t.by,
    finalKicker: t.finalKicker,
    finalHeadline: S('masthead-final-set', 'headline'),
    finalKick: S('masthead-final-set', 'short'),
    matchLine:
      finalists.length === 2
        ? `${FLAGS[finalists[0]]} ${NAMES[locale][finalists[0]]} v ${NAMES[locale][finalists[1]]} ${FLAGS[finalists[1]]}`
        : '',
    beats: ['story-intro', 'story-two-threads', 'story-takeaway'].map((id) => ({
      headline: S(id, 'headline'),
      short: S(id, 'short'),
    })),
    hypoTitle: t.hypo,
    hypotheses: hypotheses.map((h) => ({
      code: h.code,
      fin: h.thread === 'financial',
      range: `${(h.rangeLow * 100).toFixed(0)}–${(h.rangeHigh * 100).toFixed(0)}%`,
      name: h.content[locale].headline,
    })),
    whoTitle: t.who,
    teams: MODEL_ORDER.map((code) => {
      const [lo, hi] = AUTHOR[code] ?? [0, 0];
      return {
        flag: FLAGS[code],
        name: NAMES[locale][code],
        gold: code === 'ARG',
        mid: hi > 0 ? (lo + hi) / 2 : 0,
        label: hi > 0 ? `${lo}–${hi}%` : t.out,
      };
    }),
    closing: S('closing-note', 'short'),
  };
}

/* ── render ────────────────────────────────────────────────────────────── */
async function renderLocale(page, locale) {
  const out = join(outDir, `la-alegria-${locale}.mp4`);
  const ff = spawn(
    'ffmpeg',
    ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
     '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out],
    { stdio: ['pipe', 'ignore', 'ignore'] },
  );

  const total = await page.evaluate((d) => window.setup(d), sceneData(locale));
  const shaderError = await page.evaluate(() => window.__shaderError ?? null);
  if (shaderError) throw new Error(`shader failed to compile:\n${shaderError}`);

  const frames = Math.round(total * FPS);
  for (let i = 0; i < frames; i++) {
    await page.evaluate((t) => window.seek(t), i / FPS);
    const buf = await page.screenshot({ type: 'png', optimizeForSpeed: true });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  }
  ff.stdin.end();
  await new Promise((res, rej) => {
    ff.on('close', (code) => (code === 0 ? res() : rej(new Error(`ffmpeg exited ${code}`))));
    ff.on('error', rej);
  });
  console.log(`wrote ${out}  (${frames} frames, ${(frames / FPS).toFixed(1)}s)`);
}

const browser = await puppeteer.launch({
  executablePath: CHROMIUM,
  headless: true,
  args: ['--enable-unsafe-swiftshader', '--hide-scrollbars', '--force-color-profile=srgb'],
});
try {
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(join(here, 'template.html')).href, { waitUntil: 'networkidle0' });
  await page.evaluate(() => document.fonts.ready);
  for (const loc of ['en', 'es']) {
    await renderLocale(page, loc);
  }
} finally {
  await browser.close();
}

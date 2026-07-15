/**
 * Compiles the content layer + research findings into a compact bilingual text
 * corpus that the /api/ask Cloudflare Pages Function grounds its answers in.
 * Runs before `astro build` (see package.json). Output: functions/api/corpus.json
 *
 * This keeps the chat answering from the SAME single source of truth as the site,
 * so a content edit propagates to the assistant on the next build.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const read = (p) => JSON.parse(readFileSync(join(root, p), 'utf8'));

/** Newest dated research folder — so a fresh `update:research` run flows into the build. */
const latestResearch = readdirSync(join(root, 'research'))
  .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
  .sort()
  .at(-1);

const sections = read('src/content/sections.json');
const timeline = read('src/content/timeline.json');
const hypotheses = read('src/content/hypotheses.json');
const precedents = read('src/content/precedents.json');
const sources = read('src/content/sources.json');
const updates = read('src/content/updates.json');
const findings = readFileSync(join(root, `research/${latestResearch}/findings.md`), 'utf8');
const snapshot = read(`research/${latestResearch}/snapshot.json`);

function buildLocale(loc) {
  const out = [];
  out.push('# LA ALEGRÍA — COMPILED RESEARCH CORPUS');
  out.push(`Snapshot: ${snapshot.date} (bracket stage: ${snapshot.bracketStage})`);

  out.push('\n## NARRATIVE SECTIONS');
  for (const s of sections) {
    const c = s.data ? s.data.content[loc] : s.content[loc];
    out.push(`### ${c.headline}\n${c.full}${c.body?.length ? '\n- ' + c.body.join('\n- ') : ''}`);
  }

  out.push('\n## TIMELINE OF EVENTS');
  for (const t of [...timeline].sort((a, b) => a.content.en.headline.localeCompare(b.content.en.headline))) {
    const c = t.content[loc];
    out.push(`### [${t.date}] ${c.headline} (${t.thread})\n${c.full}\n${c.detail}`);
  }

  out.push('\n## THE FOUR HYPOTHESES (all ranges SPECULATIVE)');
  for (const h of hypotheses) {
    const c = h.content[loc];
    const range = `${(h.rangeLow * 100).toFixed(0)}–${(h.rangeHigh * 100).toFixed(0)}%`;
    const sec = h.secondary ? ` | secondary ${(h.secondary.low * 100).toFixed(0)}–${(h.secondary.high * 100).toFixed(0)}%` : '';
    out.push(
      `### ${h.code} — ${c.headline} [${range}${sec}]\n${c.full}\nFOR: ${c.forPoints.join('; ')}\nAGAINST: ${c.againstPoints.join('; ')}\nWHAT WOULD CHANGE MY MIND: ${c.changeMind}`,
    );
  }

  out.push('\n## HISTORICAL PRECEDENTS');
  for (const p of precedents) {
    const c = p.content[loc];
    out.push(`### ${c.name} (${p.year}, ${p.tag})\n${c.summary}\nLESSON: ${c.lesson}`);
  }

  out.push('\n## KEY NUMBERS (who wins, as of snapshot)');
  out.push(
    'Opta title: France 34.0%, Spain 23.4%, England 21.9%, Argentina 20.6%. Author synthesized ranges: France 33–40%, Spain 20–24%, England 18–23%, Argentina 17–22%. Bookmakers: France +140 favorite. Silver Bulletin per-team numbers are paywalled.',
  );

  out.push('\n## SOURCES');
  for (const s of sources) {
    const c = s.content[loc];
    out.push(`- ${c.title}${s.url ? ` <${s.url}>` : ' (link unverified)'} — ${c.why}`);
  }

  out.push('\n## RE-RUN LOG');
  for (const u of updates) {
    const c = u.content[loc];
    out.push(`### ${c.title}\n${c.summary}\n${c.body.join('\n')}`);
  }

  out.push('\n## VERIFICATION NOTES / CORRECTIONS (internal, English)');
  out.push(findings);

  return out.join('\n');
}

const corpus = {
  lastUpdated: snapshot.date,
  en: buildLocale('en'),
  es: buildLocale('es'),
};

mkdirSync(join(root, 'functions/api'), { recursive: true });
writeFileSync(join(root, 'functions/api/corpus.json'), JSON.stringify(corpus));
console.log(
  `wrote functions/api/corpus.json (en ${corpus.en.length} chars, es ${corpus.es.length} chars)`,
);

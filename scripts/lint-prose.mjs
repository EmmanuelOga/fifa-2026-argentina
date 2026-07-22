/**
 * Comparative prose linter for La Alegría — the quality gate around the `prose`
 * (verbosity-cutting) pipeline step.
 *
 * These tools do NOT rewrite prose; they measure it. We run each available
 * grammar/style engine over the reader-facing EN/ES copy and report a combined
 * scorecard: how many issues each engine finds, broken down by kind, plus the
 * total word count (the thing the prose step is trying to shrink).
 *
 *   Engines (each skipped gracefully if its binary is missing):
 *     - Harper (`harper-cli`)       — fast, Markdown-native, local. EN only.
 *       Uniquely flags long sentences — the core terseness signal.
 *     - LanguageTool (`languagetool`) — deepest engine, EN + ES. Fed
 *       Markdown-stripped text (LanguageTool has no Markdown parser of its own).
 *     - LTeX+ (`ltex-ls-plus`)      — LanguageTool with real Markdown parsing,
 *       driven over its LSP stdio interface (no batch CLI exists). Best-effort,
 *       EN only, timeout-guarded; a comparative cross-check on the LanguageTool
 *       findings. Spelling is disabled in all three (this bilingual, proper-noun
 *       heavy corpus buries real grammar signal under dictionary misses).
 *
 *   Modes:
 *     --baseline   lint, print the scorecard, and write it to .prose-lint.json
 *                  (the `prose` step reads this file to target real issues).
 *     --verify     lint again and print the DELTA vs the stored baseline —
 *                  % of words removed and whether the error count held/improved.
 *     (no flag)    same as --baseline.
 *
 * Never exits non-zero on findings: it's a soft gate that warns, because some
 * LanguageTool style flags are false positives against this site's deliberately
 * informal first-person voice. Missing tools are reported, not fatal.
 *
 * Runs on demand; wired into scripts/update.mjs as the `lint` / `postlint` steps.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync, accessSync, constants } from 'node:fs';
import { execFileSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { tmpdir } from 'node:os';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const BASELINE = join(root, '.prose-lint.json');
// Homebrew's bin isn't always on the interactive/mise PATH; make sure we find the tools.
const PATH = `/opt/homebrew/bin:${process.env.PATH ?? ''}`;

const mode = process.argv.includes('--verify') ? 'verify' : 'baseline';

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

// The reader-facing content files (author bio is a sanctioned exception, still prose).
const FILES = [
  'sections', 'updates', 'timeline', 'hypotheses', 'sources', 'precedents',
  'glossary', 'author',
];

/** Is `bin` an executable on our PATH? Shell-free, so no child process is spawned. */
const have = (bin) =>
  PATH.split(':').some((dir) => {
    if (!dir) return false;
    try {
      accessSync(join(dir, bin), constants.X_OK);
      return true;
    } catch {
      return false;
    }
  });

/** A value counts as prose if it's a multi-word string that isn't a URL/id/date. */
const isProse = (v) =>
  typeof v === 'string' &&
  v.trim().length >= 15 &&
  /\s/.test(v.trim()) &&
  !/^https?:\/\//.test(v.trim()) &&
  !/^[a-z0-9][a-z0-9-]*$/.test(v.trim()) &&
  !/^\d{4}-\d\d-\d\d/.test(v.trim());

/**
 * Walk a content tree collecting prose strings tagged by language. An `en`/`es`
 * key opens a language context for its whole subtree; strings outside any such
 * context are ignored (ids, urls, shared non-prose).
 */
function collect(node, lang, out) {
  if (Array.isArray(node)) {
    for (const item of node) collect(item, lang, out);
  } else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      const next = k === 'en' || k === 'es' ? k : lang;
      collect(v, next, out);
    }
  } else if (lang && isProse(node)) {
    out[lang].push(node.trim());
  }
}

/** Light Markdown → plain text, so LanguageTool doesn't flag our markup. */
const stripMd = (s) =>
  s
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\((?:[^)]+)\)/g, '$1')
    .replace(/^\s*[-*]\s+/gm, '')
    .replace(/^\s*\d+[.)]\s+/gm, '')
    .replace(/^#{1,6}\s+/gm, '');

function buildCorpora() {
  const out = { en: [], es: [] };
  for (const name of FILES) {
    const p = join(root, 'src/content', `${name}.json`);
    if (!existsSync(p)) continue;
    collect(JSON.parse(readFileSync(p, 'utf8')), null, out);
  }
  return out;
}

const words = (arr) => arr.join(' ').split(/\s+/).filter(Boolean).length;

/**
 * The longest sentences in a corpus — concrete targets for the prose step to
 * split. Sentences are found WITHIN each string, never across field boundaries
 * (titles and scorecard claims have no terminal punctuation and would otherwise
 * fuse into bogus mega-sentences).
 */
function longSentences(arr, threshold = 34, limit = 25) {
  const sents = [];
  for (const str of arr) {
    for (const raw of stripMd(str).split(/(?<=[.!?])\s+/)) {
      const s = raw.trim();
      if (s) sents.push({ s, n: s.split(/\s+/).length });
    }
  }
  return sents
    .filter((x) => x.n >= threshold)
    .sort((a, b) => b.n - a.n)
    .slice(0, limit);
}

const tmp = mkdtempSync(join(tmpdir(), 'proselint-'));
const writeTmp = (name, text) => {
  const p = join(tmp, name);
  writeFileSync(p, text);
  return p;
};

/** Harper — parse the `(Rule: N)` summary from its output. EN only. */
function runHarper(enText) {
  if (!have('harper-cli')) return { available: false };
  const file = writeTmp('harper.md', enText);
  let output = '';
  try {
    // Skip spell-check: this bilingual, proper-noun-heavy corpus ("Messi", "AFA",
    // Spanish loanwords) drowns real grammar/style signal in dictionary misses.
    output = execFileSync('harper-cli', ['lint', '--no-color', '--ignore', 'SpellCheck', file], {
      env: { ...process.env, PATH },
      encoding: 'utf8',
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (e) {
    // harper-cli exits 1 when it finds lints; the report is still on stdout.
    output = (e.stdout ?? '').toString();
  }
  const section = output.split('All files rule names:')[1] ?? output;
  const byRule = {};
  for (const m of section.matchAll(/\(([^:]+):\s*(\d+)\)/g)) byRule[m[1]] = +m[2];
  // Harper's "Excellent" kind is stylistic vocabulary advice, not an error.
  const total = Object.values(byRule).reduce((a, b) => a + b, 0);
  const advisory = byRule['Excellent'] ?? 0; // vocabulary-enhancement suggestions
  const longSentences = byRule['LongSentences'] ?? 0; // terseness signal
  return { available: true, total, errors: total - advisory, longSentences, byRule };
}

/** LanguageTool — JSON matches grouped by issueType. Markdown stripped first. */
function runLT(text, langCode) {
  if (!have('languagetool')) return { available: false };
  const file = writeTmp(`lt-${langCode}.txt`, stripMd(text));
  let json = '';
  try {
    json = execFileSync(
      'languagetool',
      // TYPOS off for the same reason Harper's spell-check is: the dictionary
      // misses drown the grammar signal on a bilingual, name-dense corpus.
      ['--json', '-l', langCode, '--disablecategories', 'TYPOGRAPHY,WHITESPACE,TYPOS', file],
      { env: { ...process.env, PATH }, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 },
    );
  } catch (e) {
    json = (e.stdout ?? '').toString();
  }
  let matches = [];
  try {
    matches = JSON.parse(json).matches ?? [];
  } catch {
    return { available: true, total: 0, errors: 0, byType: {}, parseFailed: true };
  }
  const byType = {};
  for (const m of matches) {
    const t = m.rule?.issueType ?? 'other';
    byType[t] = (byType[t] ?? 0) + 1;
  }
  // "style" is advisory; the rest (grammar, misspelling, duplication, …) are errors.
  const errors = matches.length - (byType['style'] ?? 0);
  // Concrete flags the prose step can act on: message + the offending snippet.
  const samples = matches
    .filter((m) => ['grammar', 'duplication', 'style'].includes(m.rule?.issueType))
    .slice(0, 20)
    .map((m) => ({ msg: m.shortMessage || m.message, ctx: (m.context?.text ?? '').trim() }));
  return { available: true, total: matches.length, errors, byType, samples };
}

/**
 * LTeX+ (ltex-ls-plus) — LanguageTool wrapped with real Markdown parsing, driven
 * over its LSP stdio interface (it ships no batch CLI). Feed it raw Markdown; it
 * strips the markup itself. Best-effort and fully guarded: any handshake hiccup or
 * timeout resolves to { available:false } so it can never destabilize the gate.
 * Included for the comparison — it catches the same grammar class as our direct
 * LanguageTool pass but, unlike Harper, doesn't flag sentence length.
 */
function runLtex(markdown, language = 'en-US', timeoutMs = 120000) {
  if (!have('ltex-ls-plus')) return Promise.resolve({ available: false });
  return new Promise((resolve) => {
    let proc;
    try {
      proc = spawn('ltex-ls-plus', [], { env: { ...process.env, PATH } });
    } catch {
      return resolve({ available: false, note: 'spawn failed' });
    }
    const uri = 'file:///corpus.md';
    const settings = {
      language,
      enabled: true,
      // Spelling off, to match Harper/LanguageTool on this name-dense corpus.
      disabledRules: { [language]: ['MORFOLOGIK_RULE_EN_US', 'MORFOLOGIK_RULE_ES'] },
      dictionary: {},
      hiddenFalsePositives: {},
    };
    let buf = Buffer.alloc(0);
    let done = false;
    const finish = (r) => {
      if (done) return;
      done = true;
      clearTimeout(timer);
      try { proc.kill(); } catch {}
      resolve(r);
    };
    const timer = setTimeout(() => finish({ available: false, note: 'timeout' }), timeoutMs);
    const send = (m) => {
      const s = JSON.stringify(m);
      proc.stdin.write(`Content-Length: ${Buffer.byteLength(s)}\r\n\r\n${s}`);
    };
    proc.stderr.on('data', () => {});
    proc.on('error', () => finish({ available: false, note: 'proc error' }));
    proc.stdout.on('data', (chunk) => {
      buf = Buffer.concat([buf, chunk]);
      for (;;) {
        const h = buf.indexOf('\r\n\r\n');
        if (h < 0) break;
        const m = /Content-Length:\s*(\d+)/i.exec(buf.slice(0, h).toString());
        if (!m) { buf = buf.slice(h + 4); continue; }
        const len = +m[1];
        const start = h + 4;
        if (buf.length < start + len) break;
        const body = buf.slice(start, start + len).toString();
        buf = buf.slice(start + len);
        let msg;
        try { msg = JSON.parse(body); } catch { continue; }
        if (msg.method === 'workspace/configuration') {
          // The server asks the client for its config before it will check anything.
          const items = msg.params?.items ?? [{}];
          send({ jsonrpc: '2.0', id: msg.id, result: items.map(() => settings) });
        } else if (msg.id === 1 && msg.result) {
          send({ jsonrpc: '2.0', method: 'initialized', params: {} });
          send({
            jsonrpc: '2.0',
            method: 'textDocument/didOpen',
            params: { textDocument: { uri, languageId: 'markdown', version: 1, text: markdown } },
          });
        } else if (msg.method === 'textDocument/publishDiagnostics' && msg.params?.uri === uri) {
          const diags = msg.params.diagnostics ?? [];
          const byRule = {};
          for (const d of diags) {
            const id = d.code?.value ?? d.code ?? d.source ?? 'other';
            byRule[id] = (byRule[id] ?? 0) + 1;
          }
          finish({ available: true, total: diags.length, byRule });
        }
      }
    });
    send({
      jsonrpc: '2.0',
      id: 1,
      method: 'initialize',
      params: {
        processId: process.pid,
        rootUri: null,
        capabilities: { workspace: { configuration: true } },
        initializationOptions: { ltex: settings },
      },
    });
  });
}

async function scan() {
  const corpora = buildCorpora();
  const en = corpora.en;
  const es = corpora.es;
  const s = {
    at: new Date().toISOString(),
    en: {
      words: words(en),
      strings: en.length,
      harper: runHarper(en.join('\n\n')),
      lt: runLT(en.join('\n\n'), 'en-US'),
      ltex: await runLtex(en.join('\n\n'), 'en-US'),
    },
    es: {
      words: words(es),
      strings: es.length,
      lt: runLT(es.join('\n\n'), 'es'),
    },
  };
  s._long = { en: longSentences(en), es: longSentences(es) };
  return s;
}

/**
 * Human-readable guidance the `prose` step reads (.prose-lint.md): the concrete
 * long sentences to break up and the specific grammar/style flags to fix. Kept
 * out of the JSON so the prompt gets prose it can act on, not metrics.
 */
function writeGuidance(s) {
  const L = [];
  L.push('# Prose-lint guidance (auto-generated by scripts/lint-prose.mjs)\n');
  L.push('Fix these concrete items during the summarize/prose passes, on top of the ≥50% cut.\n');
  for (const [lang, label] of [['en', 'English'], ['es', 'Spanish']]) {
    const longs = s._long[lang];
    if (longs.length) {
      L.push(`\n## ${label}: longest sentences to break up or trim (${longs.length})\n`);
      for (const x of longs) L.push(`- (${x.n} words) ${x.s}`);
    }
    const lt = lang === 'en' ? s.en.lt : s.es.lt;
    if (lt.available && lt.samples?.length) {
      L.push(`\n## ${label}: LanguageTool grammar/style flags\n`);
      for (const m of lt.samples) L.push(`- ${m.msg}\n  ↳ …${m.ctx}…`);
    }
  }
  const p = join(root, '.prose-lint.md');
  writeFileSync(p, L.join('\n') + '\n');
  return p;
}

const fmtRules = (obj) =>
  Object.entries(obj)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([k, v]) => `${k}:${v}`)
    .join(' ');

function printScorecard(s) {
  console.log(c.bold('\n  Prose scorecard'));
  console.log(c.dim('  ─────────────────────────────────────────────'));
  console.log(`  ${c.cyan('EN')}  ${s.en.words} words · ${s.en.strings} strings`);
  if (s.en.harper.available) {
    console.log(
      `      Harper       ${s.en.harper.total} issues ` +
        c.dim(`(${s.en.harper.longSentences} long sentences) `) + c.dim(fmtRules(s.en.harper.byRule)),
    );
  } else console.log(c.dim('      Harper       (not installed)'));
  if (s.en.lt.available) {
    console.log(
      `      LanguageTool ${s.en.lt.total} issues ` +
        c.dim(`(${s.en.lt.errors} err) `) + c.dim(fmtRules(s.en.lt.byType)),
    );
  } else console.log(c.dim('      LanguageTool (not installed)'));
  if (s.en.ltex?.available) {
    console.log(
      `      LTeX+        ${s.en.ltex.total} issues ` + c.dim(fmtRules(s.en.ltex.byRule)),
    );
  } else {
    console.log(
      c.dim(`      LTeX+        ${s.en.ltex?.note ? `skipped (${s.en.ltex.note})` : '(not installed)'} — Markdown-aware LanguageTool via LSP`),
    );
  }
  console.log(`  ${c.cyan('ES')}  ${s.es.words} words · ${s.es.strings} strings`);
  if (s.es.lt.available) {
    console.log(
      `      LanguageTool ${s.es.lt.total} issues ` +
        c.dim(`(${s.es.lt.errors} err) `) + c.dim(fmtRules(s.es.lt.byType)),
    );
  } else console.log(c.dim('      LanguageTool (not installed)'));
}

function pct(from, to) {
  if (!from) return '0.0';
  return (((from - to) / from) * 100).toFixed(1);
}

function verify(now) {
  if (!existsSync(BASELINE)) {
    console.log(c.yellow('\n  no .prose-lint.json baseline — run the lint (baseline) step first; skipping delta.'));
    printScorecard(now);
    return;
  }
  const base = JSON.parse(readFileSync(BASELINE, 'utf8'));
  printScorecard(now);
  console.log(c.bold('\n  Delta vs baseline'));
  console.log(c.dim('  ─────────────────────────────────────────────'));
  for (const lang of ['en', 'es']) {
    const wCut = pct(base[lang].words, now[lang].words);
    const sign = base[lang].words >= now[lang].words ? c.green : c.red;
    console.log(
      `  ${c.cyan(lang.toUpperCase())}  words ${base[lang].words} → ${now[lang].words}  ` +
        sign(`(${wCut}% removed)`),
    );
    const baseErr = (base[lang].harper?.errors ?? 0) + (base[lang].lt?.errors ?? 0);
    const nowErr = (now[lang].harper?.errors ?? 0) + (now[lang].lt?.errors ?? 0);
    const errSign = nowErr <= baseErr ? c.green : c.red;
    console.log(`      grammar/style issues ${baseErr} → ${nowErr} ${errSign(nowErr <= baseErr ? '✓' : '⚠ went up')}`);
    if (lang === 'en' && base.en.harper?.available && now.en.harper?.available) {
      const bl = base.en.harper.longSentences ?? 0;
      const nl = now.en.harper.longSentences ?? 0;
      console.log(`      long sentences ${bl} → ${nl} ${(nl <= bl ? c.green : c.red)(nl <= bl ? '✓' : '⚠')}`);
    }
    const cut = +wCut;
    if (cut < 50) console.log(c.yellow(`      note: ${lang.toUpperCase()} cut ${wCut}% — below the ≥50% target for the summarize pass.`));
    else if (cut > 70) console.log(c.yellow(`      note: ${lang.toUpperCase()} cut ${wCut}% — very deep; check nothing load-bearing (facts, numbers, sources, hedges) was lost.`));
  }
}

const now = await scan();
if (mode === 'verify') {
  verify(now);
} else {
  printScorecard(now);
  writeFileSync(BASELINE, JSON.stringify(now, null, 2));
  const md = writeGuidance(now);
  console.log(c.dim(`\n  wrote ${BASELINE.replace(root + '/', '')} (metrics baseline for verify)`));
  console.log(c.dim(`  wrote ${md.replace(root + '/', '')} (concrete targets the prose step reads)`));
}
// Soft gate: never fail the pipeline over prose findings.
process.exit(0);

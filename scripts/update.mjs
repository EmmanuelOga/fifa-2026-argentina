/**
 * One command to re-run the living loop and republish.
 *
 *   node scripts/update.mjs                 # everything (additive): research → log → prose → translate → score → build → deploy
 *   node scripts/update.mjs research        # just the additive research re-run (+ log recommendation)
 *   node scripts/update.mjs prose translate # a subset, in the order you list
 *   node scripts/update.mjs scratch "topic" # bootstrap a brand-new research topic, then stop
 *   node scripts/update.mjs --no-deploy     # do everything except the Cloudflare deploy
 *
 * Usually invoked through mise: `mise run update`, `mise run update:research`, etc.
 *
 * The default run is the natural thing to repeat (by hand or on a cron): pull the
 * current state, do MORE online research (additive — accumulate, don't replace),
 * translate, refresh the RAG corpus, and republish.
 *
 * Kinds of steps:
 *   - AI steps (research/translate/scratch) shell out to headless `claude -p` with a
 *     scoped prompt from scripts/prompts/ and an edit/search-only tool allowlist. They
 *     MERGE into the existing content; they never wipe-and-rebuild (except `scratch`).
 *   - The `log` step reads the research step's recommendation (.update-pending-log.json):
 *     if the change is Log-worthy it asks you to confirm (interactive) or auto-adds
 *     (non-interactive/cron); if the LLM judged it cosmetic, it adds nothing.
 *   - Deterministic steps (score/build/deploy/video) run the existing scripts. `build`
 *     rebuilds functions/api/corpus.json — the RAG corpus the chat is grounded in — so
 *     the RAG side refreshes on every publish, no separate step needed.
 * Nothing here git-commits — you review the diff, then commit/deploy as you like.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, readdirSync, unlinkSync } from 'node:fs';
import { createInterface } from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const CF_PROJECT = 'fifa-2026-argentina';
const PENDING_LOG = join(root, '.update-pending-log.json');

const c = {
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

// ── args ──────────────────────────────────────────────────────────────────
const raw = process.argv.slice(2);
const noDeploy = raw.includes('--no-deploy');
const tokens = raw.filter((a) => !a.startsWith('--'));

const KNOWN = ['research', 'log', 'prose', 'translate', 'timeline', 'score', 'video', 'build', 'deploy', 'publish', 'scratch'];
// prose (EN de-AI/tightening pass) runs BEFORE translate so Spanish syncs from clean English.
// timeline snapshots ESPN match events for any bracket match with an espnId.
const DEFAULT_ALL = ['research', 'log', 'prose', 'translate', 'timeline', 'score', 'build', 'deploy'];

// `scratch` is special: it takes a free-text topic and runs alone.
if (tokens[0] === 'scratch') {
  const topic = tokens.slice(1).join(' ').trim();
  if (!topic) {
    fail('`scratch` needs a topic, e.g.  mise run update:scratch -- "Boca 2024 refereeing controversy"');
  }
  await run([{ kind: 'ai', name: 'scratch', topic }]);
  process.exit(0);
}

// Resolve the requested scope into an ordered, de-duplicated step list.
let scope = tokens.length ? tokens : ['all'];
scope = scope.flatMap((t) => (t === 'all' ? DEFAULT_ALL : t === 'publish' ? ['build', 'deploy'] : [t]));
for (const s of scope) {
  if (!KNOWN.includes(s)) fail(`unknown step "${s}". known: ${KNOWN.join(', ')}, all`);
}
if (noDeploy) scope = scope.filter((s) => s !== 'deploy');
scope = [...new Set(scope)];

const AI = { research: 'research', translate: 'translate', prose: 'prose' };
const steps = scope.map((name) =>
  name === 'log' ? { kind: 'log', name } : AI[name] ? { kind: 'ai', name } : { kind: 'shell', name },
);

await run(steps);

// ── runner ────────────────────────────────────────────────────────────────
async function run(steps) {
  console.log(c.bold(`\nla-alegría update  ·  ${steps.map((s) => s.name).join(' → ')}\n`));
  const t0 = Date.now();
  for (const [i, step] of steps.entries()) {
    console.log(c.cyan(c.bold(`▸ [${i + 1}/${steps.length}] ${step.name}`)));
    const ok =
      step.kind === 'ai' ? aiStep(step) : step.kind === 'log' ? await logStep() : shellStep(step.name);
    if (!ok) fail(`step "${step.name}" failed — stopping. Nothing was deployed past this point.`);
    console.log(c.green(`  ✓ ${step.name} done\n`));
  }
  const secs = ((Date.now() - t0) / 1000).toFixed(0);
  console.log(c.green(c.bold(`✓ update complete in ${secs}s`)));
  console.log(c.dim('  Review the diff (git status / git diff) before committing.'));
}

// ── AI steps (headless claude) ──────────────────────────────────────────────
function aiStep({ name, topic }) {
  const claude = which('claude');
  if (!claude) {
    console.error(c.red('  claude CLI not found on PATH (expected ~/.local/bin/claude).'));
    console.error(c.dim('  Install Claude Code, or run this step interactively instead.'));
    return false;
  }
  const promptFile = join(here, 'prompts', `update-${name}.md`);
  if (!existsSync(promptFile)) return fail(`missing prompt file ${promptFile}`), false;
  let prompt = readFileSync(promptFile, 'utf8');
  if (topic) prompt += `\n${topic}\n`;

  console.log(
    c.dim(`  running claude headless — this can take several minutes (web search + edits)…`),
  );
  const res = spawnSync(
    claude,
    [
      '-p',
      '--permission-mode',
      'acceptEdits',
      '--allowedTools',
      'Read Edit Write Grep Glob WebSearch WebFetch TodoWrite',
      '--add-dir',
      root,
    ],
    { cwd: root, input: prompt, stdio: ['pipe', 'inherit', 'inherit'] },
  );
  return res.status === 0;
}

// ── Log decision (interactive ask / cron auto-add / trivial skip) ───────────
async function logStep() {
  if (!existsSync(PENDING_LOG)) {
    console.log(c.dim('  no research recommendation this run — nothing to log.'));
    return true;
  }
  const consume = () => {
    try {
      unlinkSync(PENDING_LOG);
    } catch {}
  };

  let pending;
  try {
    pending = JSON.parse(readFileSync(PENDING_LOG, 'utf8'));
  } catch (e) {
    console.error(c.red(`  couldn't parse ${PENDING_LOG}: ${e.message} — leaving it for you to inspect.`));
    return true; // don't hard-fail the whole run over a bad recommendation file
  }

  if (!pending.recommend) {
    console.log(c.dim(`  LLM judged this run too minor for a Log entry — skipping.`));
    if (pending.reason) console.log(c.dim(`  reason: ${pending.reason}`));
    consume();
    return true;
  }

  const e = pending.entry;
  if (!e?.content?.en?.title) {
    console.error(c.red('  recommendation had no usable entry — skipping.'));
    consume();
    return true;
  }
  console.log(`  ${c.bold('Recommended Log entry')} (run ${e.run ?? '?'}):`);
  console.log(`    ${c.bold(e.content.en.title)}`);
  if (e.content.en.summary) console.log(`    ${e.content.en.summary}`);
  if (pending.reason) console.log(c.dim(`    why: ${pending.reason}`));

  const add = await confirm('  Add this entry to the Log?', true);
  if (!add) {
    console.log(c.dim('  Skipped — your content edits still stand, just no new Log entry.'));
    consume();
    return true;
  }

  const upPath = join(root, 'src/content/updates.json');
  let updates;
  try {
    updates = JSON.parse(readFileSync(upPath, 'utf8'));
  } catch (err) {
    console.error(c.red(`  couldn't read ${upPath}: ${err.message}`));
    return false;
  }
  // One Log entry per day: a same-day re-run refreshes today's entry in place,
  // keeping the original id and run number so archive links stay stable.
  const sameDay = updates.findIndex((u) => u.date === e.date);
  if (sameDay >= 0) {
    const prev = updates[sameDay];
    updates[sameDay] = { ...prev, ...e, id: prev.id, run: prev.run, date: prev.date };
    writeFileSync(upPath, JSON.stringify(updates, null, 2) + '\n');
    console.log(c.green(`  refreshed today's Log entry "${prev.id}" in place (run ${prev.run}).`));
    consume();
    return true;
  }
  updates.push(e);
  writeFileSync(upPath, JSON.stringify(updates, null, 2) + '\n');
  console.log(c.green(`  added Log entry "${e.id}" to src/content/updates.json`));
  consume();
  return true;
}

/** Ask a yes/no question. Non-interactive (cron, piped stdin) → take the default. */
async function confirm(question, defaultYes = true) {
  if (!process.stdin.isTTY) {
    console.log(c.dim(`  (non-interactive — auto-answering ${defaultYes ? 'yes' : 'no'})`));
    return defaultYes;
  }
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try {
    const ans = (await rl.question(`${question} ${defaultYes ? '[Y/n]' : '[y/N]'} `)).trim().toLowerCase();
    if (!ans) return defaultYes;
    return ans === 'y' || ans === 'yes';
  } finally {
    rl.close();
  }
}

// ── deterministic steps ─────────────────────────────────────────────────────
function shellStep(name) {
  switch (name) {
    case 'build':
      return sh('pnpm', ['build']);
    case 'deploy':
      return sh('pnpm', ['exec', 'wrangler', 'pages', 'deploy', 'dist', '--project-name', CF_PROJECT]);
    case 'score': {
      const snap = latestSnapshot();
      if (!snap) {
        console.log(c.dim('  no research snapshot found — skipping score.'));
        return true;
      }
      return sh('node', ['scripts/score-predictions.mjs', snap]);
    }
    case 'timeline':
      return sh('node', ['scripts/fetch-match-timeline.mjs']);
    case 'video':
      return sh('pnpm', ['render:video']);
    default:
      return fail(`no shell handler for "${name}"`), false;
  }
}

function latestSnapshot() {
  const base = join(root, 'research');
  if (!existsSync(base)) return null;
  const dated = readdirSync(base)
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
    .sort();
  for (let i = dated.length - 1; i >= 0; i--) {
    const rel = join('research', dated[i], 'snapshot.json');
    if (existsSync(join(root, rel))) return rel;
  }
  return null;
}

// ── helpers ─────────────────────────────────────────────────────────────────
function sh(cmd, args) {
  console.log(c.dim(`  $ ${cmd} ${args.join(' ')}`));
  const res = spawnSync(cmd, args, { cwd: root, stdio: 'inherit' });
  return res.status === 0;
}

function which(bin) {
  const res = spawnSync('command', ['-v', bin], { shell: true, encoding: 'utf8' });
  return res.status === 0 ? res.stdout.trim() : null;
}

function fail(msg) {
  console.error(c.red(`\n✗ ${msg}`));
  process.exit(1);
}

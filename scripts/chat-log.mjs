/**
 * Print the chat question log (newest first) from the QUESTIONS KV namespace.
 *
 *   node scripts/chat-log.mjs            # last 50
 *   node scripts/chat-log.mjs 200        # last 200
 *   node scripts/chat-log.mjs --unanswered
 *
 * Uses the wrangler auth you already have. Also prints today's rate-limit
 * counters, which double as a per-day question tally.
 */
import { spawnSync } from 'node:child_process';

const NAMESPACE_ID = 'c28393030afa4776a611c6bca60a5879';
const args = process.argv.slice(2);
const onlyUnanswered = args.includes('--unanswered');
const limit = Number(args.find((a) => /^\d+$/.test(a)) ?? 50);

function wrangler(...cmd) {
  const res = spawnSync('pnpm', ['exec', 'wrangler', ...cmd], { encoding: 'utf8' });
  if (res.status !== 0) {
    console.error(res.stderr || res.stdout);
    process.exit(1);
  }
  return res.stdout;
}

const keys = JSON.parse(
  wrangler('kv', 'key', 'list', '--namespace-id', NAMESPACE_ID, '--remote'),
);

const dayCounters = keys.filter((k) => k.name.startsWith('rl:day:'));
const qKeys = keys
  .filter((k) => k.name.startsWith('q:'))
  .sort((a, b) => b.name.localeCompare(a.name))
  .slice(0, limit);

console.log('Questions per day (KV rate-limit counters):');
for (const k of dayCounters.sort((a, b) => a.name.localeCompare(b.name))) {
  const count = wrangler('kv', 'key', 'get', k.name, '--namespace-id', NAMESPACE_ID, '--remote').trim();
  console.log(`  ${k.name.slice('rl:day:'.length)}  ${count}`);
}

console.log(`\nLogged questions (newest first, showing up to ${limit}):`);
for (const k of qKeys) {
  const raw = wrangler('kv', 'key', 'get', k.name, '--namespace-id', NAMESPACE_ID, '--remote');
  let entry;
  try {
    entry = JSON.parse(raw);
  } catch {
    continue;
  }
  // Entries logged before 2026-07-16 predate the `answered` flag (only
  // unanswered questions were logged back then).
  const answered = entry.answered === undefined ? false : entry.answered;
  if (onlyUnanswered && answered) continue;
  const when = k.name.slice(2, 21).replace('T', ' ');
  console.log(`  [${when}] (${entry.locale}) ${answered ? '  ' : '✗ '}${entry.question}`);
}
console.log('\n✗ = the corpus could not answer it.');

/**
 * Grade a past run's predictions once real outcomes are known.
 *
 *   node scripts/score-predictions.mjs research/2026-07-12/snapshot.json
 *
 * Fill the `outcomes` block of the snapshot first (champion, semifinal winners,
 * dojMovedToIndictment). Prints a Brier score on the title probabilities and a
 * hit/miss table — paste the result into the next Log / Bitácora entry.
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) {
  console.error('usage: node scripts/score-predictions.mjs <snapshot.json>');
  process.exit(1);
}
const snap = JSON.parse(readFileSync(path, 'utf8'));
const out = snap.outcomes || {};
const champ = out.champion;

console.log(`\nScoring run ${snap.run} (${snap.date})`);
console.log(`bracket at snapshot: ${snap.bracketStage}`);

// The research step names this block `titleProbabilities` mid-tournament and
// `titleProbabilities_preMatch` once the final is set/played; accept either (or any
// future `titleProbabilities*` variant) so a schema rename never crashes scoring.
const preds = snap.predictions || {};
const probKey =
  ['titleProbabilities', 'titleProbabilities_preMatch'].find((k) => preds[k]) ||
  Object.keys(preds).find((k) => k.startsWith('titleProbabilities'));
const probs = probKey ? preds[probKey] : null;

if (!champ) {
  console.log('\nNo champion recorded yet — fill outcomes.champion to score the title forecast.');
} else if (!probs) {
  console.log('\nChampion recorded, but no titleProbabilities* block in predictions — skipping title Brier.');
} else {
  const teams = Object.entries(probs);
  console.log(`\nChampion: ${champ}`);
  console.log('\nTitle forecast (author midpoint & Opta) vs outcome:');
  // Author bands and Opta each cover a different set of teams (eliminated sides may
  // carry only opta:0), so score each over the teams that actually have that number.
  let brierAuthor = 0;
  let nAuthor = 0;
  let brierOpta = 0;
  let nOpta = 0;
  for (const [code, p] of teams) {
    const actual = code === champ ? 1 : 0;
    const hasBand = p.authorLow != null && p.authorHigh != null;
    const authorMid = hasBand ? (p.authorLow + p.authorHigh) / 2 : null;
    if (hasBand) {
      brierAuthor += (authorMid - actual) ** 2;
      nAuthor++;
    }
    if (p.opta != null) {
      brierOpta += (p.opta - actual) ** 2;
      nOpta++;
    }
    const authorCol = hasBand
      ? `author ${(p.authorLow * 100).toFixed(0)}–${(p.authorHigh * 100).toFixed(0)}% (mid ${(authorMid * 100).toFixed(0)}%)`
      : 'author —';
    const optaCol = p.opta != null ? `Opta ${(p.opta * 100).toFixed(0)}%` : 'Opta —';
    console.log(`  ${code}: ${authorCol}  ${optaCol}  actual ${actual}`);
  }
  console.log(`\nBrier score (lower is better):`);
  if (nAuthor) console.log(`  author midpoints: ${(brierAuthor / nAuthor).toFixed(4)} (over ${nAuthor} team${nAuthor > 1 ? 's' : ''})`);
  if (nOpta) console.log(`  Opta:             ${(brierOpta / nOpta).toFixed(4)} (over ${nOpta} team${nOpta > 1 ? 's' : ''})`);
  if (nAuthor && nOpta) {
    const a = brierAuthor / nAuthor;
    const o = brierOpta / nOpta;
    console.log(`  → ${a < o ? 'author edged Opta' : a > o ? 'Opta edged author' : 'tie'} this run`);
  }
}

// Semifinal grading (if recorded)
const semis = out.semifinals || {};
const recorded = Object.entries(semis).filter(([, v]) => v);
if (recorded.length) {
  console.log('\nSemifinals:');
  for (const [k, v] of recorded) console.log(`  ${k}: ${v}`);
}

if (out.dojMovedToIndictment != null) {
  console.log(`\nH2 watch — DOJ moved to indictment/cooperating witness: ${out.dojMovedToIndictment ? 'YES' : 'not yet'}`);
}
console.log('');

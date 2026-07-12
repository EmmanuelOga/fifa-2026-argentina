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

if (!champ) {
  console.log('\nNo champion recorded yet — fill outcomes.champion to score the title forecast.');
} else {
  const teams = Object.entries(snap.predictions.titleProbabilities);
  console.log(`\nChampion: ${champ}`);
  console.log('\nTitle forecast (author midpoint & Opta) vs outcome:');
  let brierAuthor = 0;
  let brierOpta = 0;
  for (const [code, p] of teams) {
    const actual = code === champ ? 1 : 0;
    const authorMid = (p.authorLow + p.authorHigh) / 2;
    brierAuthor += (authorMid - actual) ** 2;
    brierOpta += (p.opta - actual) ** 2;
    const inBand = champ === code ? (actual >= p.authorLow ? '' : '') : '';
    console.log(
      `  ${code}: author ${(p.authorLow * 100).toFixed(0)}–${(p.authorHigh * 100).toFixed(0)}% (mid ${(authorMid * 100).toFixed(0)}%)  Opta ${(p.opta * 100).toFixed(0)}%  actual ${actual}${inBand}`,
    );
  }
  brierAuthor /= teams.length;
  brierOpta /= teams.length;
  console.log(`\nBrier score (lower is better):`);
  console.log(`  author midpoints: ${brierAuthor.toFixed(4)}`);
  console.log(`  Opta:             ${brierOpta.toFixed(4)}`);
  console.log(
    `  → ${brierAuthor < brierOpta ? 'author edged Opta' : brierAuthor > brierOpta ? 'Opta edged author' : 'tie'} this run`,
  );
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

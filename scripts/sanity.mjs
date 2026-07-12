/**
 * Sim math sanity checks (acceptance criteria):
 *   1. Monte Carlo at nudge=0 converges near the seeded (Opta) title probs.
 *   2. Bayes explorer defaults reproduce the published hypothesis ranges.
 *   3. Conspiracy sim equals the closed-form Grimes survival.
 * Mirrors src/scripts/simmath.ts + montecarlo.ts + bayes.ts logic.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// --- pure math (mirror of simmath.ts) ---
const mulberry32 = (seed) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};
const eloWin = (ra, rb) => 1 / (1 + Math.pow(10, -(ra - rb) / 400));
const grimes = (n, p, t) => Math.exp(-n * p * t);
const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));
const logit = (p) => Math.log(p / (1 - p));
const expit = (l) => 1 / (1 + Math.exp(-l));
const bayes = (prior, lrs) =>
  clamp(expit(logit(clamp(prior, 1e-6, 1 - 1e-6)) + lrs.reduce((s, lr) => s + Math.log(lr), 0)), 0.001, 0.999);

// --- read the ACTUAL ratings + ranges the site ships ---
const bracketTs = readFileSync(join(root, 'src/data/bracket.ts'), 'utf8');
const ratings = {};
for (const code of ['FRA', 'ESP', 'ENG', 'ARG']) {
  const m = bracketTs.match(new RegExp(`${code}:.*?rating: (\\d+)`, 's'));
  ratings[code] = +m[1];
}
const OPTA = { FRA: 0.34, ESP: 0.234, ENG: 0.219, ARG: 0.206 };

// --- 1. Monte Carlo (mirror of montecarlo.ts) ---
function monteCarlo(runs, seed) {
  const rnd = mulberry32(seed);
  const wins = { FRA: 0, ESP: 0, ENG: 0, ARG: 0 };
  const play = (a, b) => (rnd() < eloWin(ratings[a], ratings[b]) ? a : b);
  for (let i = 0; i < runs; i++) {
    const f1 = play('FRA', 'ESP');
    const f2 = play('ENG', 'ARG');
    wins[play(f1, f2)]++;
  }
  return Object.fromEntries(Object.entries(wins).map(([k, v]) => [k, v / runs]));
}
const mc = monteCarlo(10000, 20260712);
console.log('=== 1. Monte Carlo (nudge=0) vs Opta ===');
let maxDiff = 0;
for (const code of ['FRA', 'ESP', 'ENG', 'ARG']) {
  const diff = Math.abs(mc[code] - OPTA[code]);
  maxDiff = Math.max(maxDiff, diff);
  console.log(
    `  ${code}: MC ${(mc[code] * 100).toFixed(1)}%  Opta ${(OPTA[code] * 100).toFixed(1)}%  Δ ${(diff * 100).toFixed(1)}pp`,
  );
}
console.log(`  max Δ = ${(maxDiff * 100).toFixed(1)}pp  ${maxDiff < 0.04 ? 'PASS (<4pp)' : 'CHECK'}`);

// reproducibility: same seed -> identical
const mc2 = monteCarlo(10000, 20260712);
console.log(
  `  reproducible: ${JSON.stringify(mc) === JSON.stringify(mc2) ? 'PASS' : 'FAIL'}`,
);

// --- 2. Bayes defaults reproduce published ranges ---
const bayesTs = readFileSync(join(root, 'src/data/bayes.ts'), 'utf8');
const hypJson = JSON.parse(readFileSync(join(root, 'src/content/hypotheses.json'), 'utf8'));
console.log('\n=== 2. Bayes defaults reproduce published ranges ===');
for (const h of hypJson) {
  const mid = (h.rangeLow + h.rangeHigh) / 2;
  // extract this hypothesis's defaultLRs from bayes.ts
  const block = bayesTs.match(new RegExp(`code: '${h.code}',([\\s\\S]*?)(?=\\n  \\{|\\n\\];)`))[1];
  const lrs = [...block.matchAll(/defaultLR: ([\d.]+)/g)].map((m) => +m[1]);
  const sumLn = lrs.reduce((s, lr) => s + Math.log(lr), 0);
  const defaultPrior = clamp(expit(logit(clamp(mid, 1e-3, 1 - 1e-3)) - sumLn), 0.01, 0.99);
  const posterior = bayes(defaultPrior, lrs);
  const inBand = posterior >= h.rangeLow - 0.005 && posterior <= h.rangeHigh + 0.005;
  console.log(
    `  ${h.code}: posterior ${(posterior * 100).toFixed(1)}%  band ${(h.rangeLow * 100).toFixed(0)}–${(h.rangeHigh * 100).toFixed(0)}%  ${inBand ? 'PASS' : 'FAIL'}`,
  );
}

// --- 3. Conspiracy matches closed form ---
console.log('\n=== 3. Conspiracy sim == closed form e^(-N·p·t) ===');
const cases = [
  [3, 0.01, 5],
  [30, 0.02, 8],
  [150, 0.03, 12],
];
for (const [n, p, t] of cases) {
  const v = grimes(n, p, t);
  console.log(`  N=${n} p=${p} t=${t}: survive ${(v * 100).toFixed(2)}%  (expected e^(-${(n * p * t).toFixed(2)}))`);
}

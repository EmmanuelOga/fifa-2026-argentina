/**
 * Pure math shared by the three simulations. No DOM here — unit-checkable and
 * reused by both the islands and (via mirrored logic) the sanity-check scripts.
 */

/** Deterministic PRNG (mulberry32). Seed it for reproducible Monte Carlo runs. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Logistic Elo win probability for A over B given ratings. */
export function eloWin(ra: number, rb: number): number {
  return 1 / (1 + Math.pow(10, -(ra - rb) / 400));
}

/**
 * Grimes (2016) conspiracy survival, constant-population special case:
 *   P(secret survives to time t) = e^(−N·p·t)
 * N = people who must stay silent, p = per-person yearly exposure prob, t = years.
 */
export function grimesSurvival(n: number, p: number, t: number): number {
  return Math.exp(-n * p * t);
}

export const clamp = (x: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, x));

/** Probability → odds, odds → probability, and log-odds helpers for Bayes. */
export const toOdds = (p: number) => p / (1 - p);
export const fromOdds = (o: number) => o / (1 + o);
export const logit = (p: number) => Math.log(toOdds(p));
export const expit = (l: number) => 1 / (1 + Math.exp(-l));

/**
 * Bayesian update in log-odds: posterior logit = prior logit + Σ ln(LR_i).
 * Returns posterior probability, clamped to a display-safe [0.001, 0.999].
 */
export function bayesPosterior(prior: number, likelihoodRatios: number[]): number {
  const l = logit(clamp(prior, 1e-6, 1 - 1e-6)) + likelihoodRatios.reduce((s, lr) => s + Math.log(lr), 0);
  return clamp(expit(l), 0.001, 0.999);
}

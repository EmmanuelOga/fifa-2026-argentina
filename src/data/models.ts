/**
 * Model & market synthesis for Tab 4. Three independent anchors:
 *   1. Opta / The Analyst supercomputer (quantitative, public)
 *   2. Silver Bulletin "PELE" model (Elo/SPI-style; live per-team numbers paywalled)
 *   3. Bookmaker outright odds (market-implied, incl. overround)
 *
 * All figures verified as of the snapshot date. Author's synthesized ranges
 * triangulate the three and are labelled SPECULATIVE everywhere they render.
 */

export interface TeamProb {
  code: string;
  title: number; // 0..1
  reachFinal: number; // 0..1
}

/**
 * Opta / The Analyst supercomputer — 25,000 sims, last published post-quarterfinals
 * (Jul 12). Opta had NOT refreshed after semifinal 1 as of the Jul 15 snapshot
 * (re-verified by fetch), so two kinds of numbers coexist here:
 *   - elimination/qualification RESOLUTIONS (arithmetic facts, not model outputs):
 *     France title/reachFinal → 0 (out Jul 14), England title/reachFinal → 0
 *     (out Jul 15), Spain and Argentina reachFinal → 1 (the final is set);
 *   - Opta's last PUBLISHED title figures for ESP/ARG, which predate the semis —
 *     Spain's 23.4% is stale-low versus the post-semis market (~55–60%). Reconcile
 *     when Opta publishes its final-stage refresh. Calibration footnote for the
 *     prose: both of Opta's slim semifinal favorites lost — France (57.7% to reach
 *     the final, Jul 12 article) and England (52.3% to advance, Jul 15 match
 *     preview) — so the 42.3% and 47.7% branches happened back-to-back.
 */
export const OPTA = {
  asOf: '2026-07-15',
  sims: 25000,
  url: 'https://theanalyst.com/articles/world-cup-2026-semi-final-predictions-opta-supercomputer',
  teams: {
    ESP: { code: 'ESP', title: 0.234, reachFinal: 1 },
    ARG: { code: 'ARG', title: 0.206, reachFinal: 1 },
    ENG: { code: 'ENG', title: 0, reachFinal: 0 },
    FRA: { code: 'FRA', title: 0, reachFinal: 0 },
  } satisfies Record<string, TeamProb>,
};

/**
 * Silver Bulletin — Nate Silver's soccer model ("PELE"): Elo/SPI-style power
 * ratings + 100k Monte Carlo sims, re-run daily. Per-team title numbers sit
 * behind Silver's paywall and could not be independently extracted, so we cite
 * methodology + reputation and the public prediction-market figure instead of
 * inventing a number. This limitation is stated on the page.
 */
export const SILVER = {
  asOf: '2026-07-12',
  sims: 100000,
  url: 'https://www.natesilver.net/p/world-cup-2026-odds-predictions',
  perTeamAvailable: false as const,
  /** Public prediction-market reference (NOT PELE output): pre-QF co-favorites. */
  marketNote: { fra: 0.17, esp: 0.17 },
};

/**
 * Bookmaker outright odds. American odds vary book-to-book; France is the clear
 * favorite everywhere, the other three tightly bunched. Implied % includes the
 * bookmaker's overround (margin), so the four implied numbers sum to >100%.
 */
export const BOOKMAKERS = {
  asOf: '2026-07-15',
  url: 'https://www.oddschecker.com/us/soccer/world-cup',
  source: 'Caesars / bet365 / Kalshi (via Sports Betting Dime, Jul 15 evening)',
  /** Post-SF2 opening prices for the Spain–Argentina final (Jul 15 evening, after
   *  Argentina's 2–1 over England): Caesars ESP −170 / ARG +135; bet365 −175/+125;
   *  theScore −160/+130; Kalshi 58¢ v 43¢. England and France eliminated — no
   *  outright price exists, shown as a dash with implied 0. With one match left,
   *  title odds ≈ final-match odds. */
  teams: {
    ESP: { code: 'ESP', american: '-170', implied: 0.63 },
    ARG: { code: 'ARG', american: '+135', implied: 0.426 },
    ENG: { code: 'ENG', american: '—', implied: 0 },
    FRA: { code: 'FRA', american: '—', implied: 0 },
  },
};

/** Author's synthesized SPECULATIVE title ranges (0..1). Re-synthesized Jul 15
 *  evening for the final-set state (one match left): overround-normalized books
 *  land near 59/41, Kalshi near 57/43, and the Elo bracket at nudge=0 gives
 *  ~56/44; Opta's refresh was still pending. France and England resolved to 0. */
export const AUTHOR_RANGES: Record<string, { low: number; high: number }> = {
  ESP: { low: 0.55, high: 0.6 },
  ARG: { low: 0.4, high: 0.45 },
  ENG: { low: 0, high: 0 },
  FRA: { low: 0, high: 0 },
};

/**
 * Controversy adjustment for the Monte Carlo "bias nudge" (Tab 4), presented as a
 * conditional what-if, never a forecast:
 *   - soft/structural bias (H3) alone ≈ +2–5 percentage points to ARG per match
 *   - strong H1 (unproven) could push ARG title odds to ~30–45%
 */
export const CONTROVERSY = {
  softBiasPpRange: [2, 5] as const,
  strongH1TitleRange: [0.3, 0.45] as const,
};

/** Team display order for Tab 4 tables: the two finalists first, then the
 *  eliminated semifinalists. */
export const MODEL_ORDER = ['ESP', 'ARG', 'ENG', 'FRA'] as const;

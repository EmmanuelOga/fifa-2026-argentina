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

/** Opta / The Analyst supercomputer — 25,000 sims, refreshed post-quarterfinals. */
export const OPTA = {
  asOf: '2026-07-12',
  sims: 25000,
  url: 'https://theanalyst.com/articles/world-cup-2026-semi-final-predictions-opta-supercomputer',
  teams: {
    FRA: { code: 'FRA', title: 0.34, reachFinal: 0.577 },
    ESP: { code: 'ESP', title: 0.234, reachFinal: 0.423 },
    ENG: { code: 'ENG', title: 0.219, reachFinal: 0.509 },
    ARG: { code: 'ARG', title: 0.206, reachFinal: 0.491 },
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
  asOf: '2026-07-12',
  url: 'https://www.oddschecker.com/us/soccer/world-cup',
  source: 'FanDuel via FOX Sports',
  teams: {
    FRA: { code: 'FRA', american: '+140', implied: 0.417 },
    ENG: { code: 'ENG', american: '+310', implied: 0.244 },
    ESP: { code: 'ESP', american: '+330', implied: 0.233 },
    ARG: { code: 'ARG', american: '+400', implied: 0.2 },
  },
};

/** Author's synthesized SPECULATIVE title ranges (0..1). Triangulates the above. */
export const AUTHOR_RANGES: Record<string, { low: number; high: number }> = {
  FRA: { low: 0.33, high: 0.4 },
  ESP: { low: 0.2, high: 0.24 },
  ENG: { low: 0.18, high: 0.23 },
  ARG: { low: 0.17, high: 0.22 },
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

/** Team display order for Tab 4 tables, strongest-first per the clean model. */
export const MODEL_ORDER = ['FRA', 'ESP', 'ENG', 'ARG'] as const;

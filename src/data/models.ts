/**
 * Model & market synthesis for Tab 4. Three independent anchors:
 *   1. Opta / The Analyst supercomputer (quantitative, public)
 *   2. Silver Bulletin "PELE" model (Elo/SPI-style; live per-team numbers paywalled)
 *   3. Bookmaker outright odds (market-implied, incl. overround)
 *
 * All figures verified as of the snapshot date, with one disclosed exception: the
 * Opta title column is currently DERIVED from Opta's published figures rather than
 * printed by Opta (see the OPTA block for the arithmetic and why). Author's
 * synthesized ranges triangulate the three and are labelled SPECULATIVE everywhere
 * they render.
 */

export interface TeamProb {
  code: string;
  title: number; // 0..1
  reachFinal: number; // 0..1
}

/**
 * Opta / The Analyst supercomputer — 25,000 sims. Run 4 flagged Opta's figures as
 * stale (the Jul 12 post-quarterfinal run had Spain at 23.4%); Run 5 reconciles.
 *
 * Opta DID refresh after semifinal 1 — the main semi-final article never moved,
 * but the supercomputer's bracket re-ran and the refreshed set was published by
 * TNT Sports (Jul 14–15, after Spain 2–0 France, before England v Argentina):
 *     Spain 56.15% · England 23.38% · Argentina 20.47% · France 0 (sums to 100.0)
 *     England 52.53% to beat Argentina → Argentina 47.47% to reach the final.
 *
 * That vintage predates SF2, so it can't be shown as-is: Argentina's 20.47%
 * assumed a 47.47% chance of merely REACHING the final, and they are now in it.
 * The figures below therefore condition Opta's own published numbers on the known
 * SF2 result — division, not invention:
 *     ARG title | in the final = 20.47 / 47.47 = 43.1%  →  ESP = 56.9%
 * It back-solves exactly, which is why we trust the arithmetic: ENG 23.38 / 52.53
 * ⇒ Spain beats England 55.5% of the time; 55.5%×52.53 + 56.9%×47.47 = 56.15 ✓.
 * Opta's live bracket widget (JS-rendered, not machine-readable for us) should be
 * showing approximately this pair. The prose says plainly that this column is
 * Opta's model conditioned on a known result, not a figure Opta printed.
 *
 * UPDATE Jul 17 (Run 7): Opta HAS now published an explicit Spain-v-Argentina final
 * simulation — the open item from Run 6 is closed. Across Jul 16 syndication of the
 * 25,000-sim model the direct-matchup read is Spain ~56.05–56.31% v Argentina
 * ~43.69–43.95% (representative ~56.1/43.9 used below). So the DERIVED .569/.431 is
 * retired in favour of the printed figure, and the conditioning language is dropped.
 * The printed pair sits a shade closer to Argentina than the old derivation
 * (43.9% vs 43.1%), reflecting that Opta is now simulating the actual final rather
 * than back-solving a pre-SF2 trophy column; it stays well inside the author range.
 *
 * Calibration footnote for the prose: both of Opta's slim semifinal favorites lost
 * — France (57.7% to reach the final, Jul 12) and England (52.53%) — so the 42.3%
 * and 47.47% branches happened back-to-back.
 */
export const OPTA = {
  asOf: '2026-07-16',
  sims: 25000,
  url: 'https://theanalyst.com/articles/2026-world-cup-bracket-opta-supercomputer',
  /** Published post-SF1 refresh, kept for provenance (pre-SF2 vintage). */
  publishedPostSF1: { ESP: 0.5615, ENG: 0.2338, ARG: 0.2047, FRA: 0 },
  teams: {
    ESP: { code: 'ESP', title: 0.561, reachFinal: 1 },
    ARG: { code: 'ARG', title: 0.439, reachFinal: 1 },
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
 * Bookmaker outright odds. American odds vary book-to-book. With the final set,
 * Spain is favored everywhere and the price is a two-horse market. Implied %
 * includes the bookmaker's overround (margin), so the implied numbers sum to >100%.
 *
 * Re-checked again Jul 17 (Run 7): the market has consolidated rather than moved.
 * Prediction markets held their Jul 16 level (Kalshi ~58.2¢, Polymarket ~58.0¢
 * Spain — essentially flat vs the ~58.5/58.4 of the day before) and DraftKings kept
 * Spain's 90-minute three-way at +115 (ARG +285). The named trophy lines below
 * (Caesars −170, bet365 −175, theScore −160) still drew no fresh re-quote, carried
 * as unchanged; the overround-normalized trophy market is still ~59/41 Spain. So the
 * two-day drift toward Spain has settled — the price is stable two days out. (Run 6
 * note: Jul 16 saw Kalshi ~57.7¢ → ~58.5¢ and DraftKings +125 → +115.) The headline
 * table keeps Caesars for continuity.
 */
export const BOOKMAKERS = {
  asOf: '2026-07-17',
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

/** Author's synthesized SPECULATIVE title ranges (0..1). Held at the Run 4 values
 *  for the final-set state (one match left). Run 5 was the first pass where all the
 *  anchors agreed rather than one being stale; Run 7 (Jul 17) re-checked with the
 *  market now stable (Kalshi ~58.2, DraftKings 90-min +115) and Opta now printing an
 *  EXPLICIT final simulation (~56.1/43.9, see above) rather than a derivation.
 *  Overround-normalized books land near 59/41, Kalshi ~58/42, the Elo bracket at
 *  nudge=0 ~56/44, and Opta's explicit pair ~56/44 — still four independent anchors
 *  inside a five-point band, all inside the published range, so no reason to move it.
 *  France and England resolved to 0. */
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

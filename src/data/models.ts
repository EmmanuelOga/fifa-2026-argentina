/**
 * Model & market synthesis for Tab 4. Three independent anchors:
 *   1. Opta / The Analyst supercomputer (quantitative, public)
 *   2. Silver Bulletin "PELE" model (Elo/SPI-style; live per-team numbers paywalled)
 *   3. Bookmaker outright odds (market-implied, incl. overround)
 *
 * All figures verified as of the snapshot date. The Opta title column is now a
 * figure Opta printed for this exact matchup (the earlier derivation is retired —
 * see the OPTA block for that history). Author's synthesized ranges triangulate the
 * three and are labelled SPECULATIVE everywhere they render.
 *
 * RESULT IN (Jul 19, graded Run 9 / Jul 20): Spain beat Argentina 1–0 after extra
 * time (Ferran Torres 106′). The numbers below are the locked PRE-MATCH forecast and
 * are deliberately NOT overwritten to 1/0 — the site grades forecasts, so the record
 * stays. Two of them landed: the model's favorite (Opta 59.5%, market ~59%) won, and
 * the extra-time tail hit — the final went to ET exactly as Opta's 29% / Kalshi's 32%
 * regulation-draw share flagged (Argentina's 40.5% title number always sat well above
 * its 26% regulation-win number for that reason). Unlike the two semifinals, where
 * both slim favorites lost, the final favorite held. See bracket.ts for the result.
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
 * 25,000-sim model the direct-matchup read was Spain ~56.05–56.31% v Argentina
 * ~43.69–43.95% (representative ~56.1/43.9). So the DERIVED .569/.431 is retired in
 * favour of the printed figure, and the conditioning language is dropped.
 *
 * UPDATE Jul 19 (Run 8): Opta re-ran the model for its match-day final preview and
 * moved further toward Spain — 25,000 PRE-MATCH sims give Spain 59.5% v Argentina
 * 40.5%, a ~3.4-point shift toward Spain in three days with no football played in
 * between (the move is a model refresh on final team news, not a reaction to a
 * result). The same preview splits the 90 minutes: Spain 45.0%, draw 29.0%,
 * Argentina 26.0% — i.e. Opta puts ~29% on the final going to extra time, and
 * Argentina's title number is meaningfully larger than its regulation-win number
 * because the knockout path runs through ET/penalties. Figures below adopt the
 * match-day pair; `publishedJul16` keeps the prior explicit vintage for provenance.
 *
 * Calibration footnote for the prose: both of Opta's slim semifinal favorites lost
 * — France (57.7% to reach the final, Jul 12) and England (52.53%) — so the 42.3%
 * and 47.47% branches happened back-to-back.
 */
export const OPTA = {
  asOf: '2026-07-19',
  sims: 25000,
  url: 'https://theanalyst.com/articles/spain-vs-argentina-prediction-world-cup-final-2026-match-preview',
  /** Published post-SF1 refresh, kept for provenance (pre-SF2 vintage). */
  publishedPostSF1: { ESP: 0.5615, ENG: 0.2338, ARG: 0.2047, FRA: 0 },
  /** The Jul 16 explicit final pair, superseded by the match-day re-run. */
  publishedJul16: { ESP: 0.561, ARG: 0.439 },
  /** Opta's match-day 90-minute split (title odds above include ET/penalties). */
  final90: { ESP: 0.45, draw: 0.29, ARG: 0.26 },
  teams: {
    ESP: { code: 'ESP', title: 0.595, reachFinal: 1 },
    ARG: { code: 'ARG', title: 0.405, reachFinal: 1 },
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
 * Spain) and DraftKings kept Spain's 90-minute three-way at +115 (ARG +285). The
 * overround-normalized trophy market was ~59/41 Spain. (Run 6 note: Jul 16 saw
 * Kalshi ~57.7¢ → ~58.5¢ and DraftKings +125 → +115.)
 *
 * Re-checked at kickoff, Jul 19 (Run 8): the price firmed a shade more toward Spain
 * and then sat still. Kalshi has Spain ~59% v Argentina ~41.6%; Polymarket 59¢ v
 * 40¢. Kalshi's regulation-time-only book splits Spain 43% / draw 32% / Argentina
 * 28%, and prices Argentina to score at least one goal at 66% and over 2.5 goals at
 * 43%. The named trophy lines below (Caesars −170, bet365 −175, theScore −160) never
 * drew a fresh re-quote after Jul 15, so they are carried as opening prices and
 * flagged as such rather than restated as live; the headline table keeps Caesars for
 * continuity. Scale note worth the prose: this final is the largest prediction market
 * ever run — the Kalshi Spain–Argentina contract passed $1.27B and Polymarket's World
 * Cup winner market has cleared $4B cumulative since July 2025, overtaking its own
 * 2024 US presidential market. Volume is liquidity, not accuracy: the same markets
 * had both losing semifinalists favored.
 */
export const BOOKMAKERS = {
  asOf: '2026-07-19',
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
 *  anchors agreed rather than one being stale.
 *
 *  Run 8 (Jul 19, kickoff) re-checked and HELD the band, but the honest caveat is
 *  that the anchors have stopped straddling it and now bunch at its Spain edge:
 *  Opta's match-day re-run 59.5/40.5, Kalshi ~59/41.6, Polymarket 59/40, and
 *  overround-normalized books ~59/41 — four independent reads within a point of each
 *  other, all at or just inside the top of the published Spain range rather than
 *  around its middle. Only the site's own Elo bracket at nudge=0 (~56/44) still sits
 *  low in the band. The range is kept because every anchor remains inside it and
 *  because moving a speculative band to chase the market on match day is exactly the
 *  hindsight-shaped edit this project tries not to make; the drift is disclosed
 *  instead. France and England resolved to 0. */
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

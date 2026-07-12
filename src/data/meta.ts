/**
 * Snapshot metadata. `lastUpdated` is rendered visibly across the site
 * ("Snapshot as of …"). Bump it whenever any src/data file changes.
 */
export const meta = {
  /** ISO date of the current data snapshot. */
  lastUpdated: '2026-07-12',
  /** The final is July 19, 2026 (NY/NJ). Used for the "who wins" framing. */
  finalDate: '2026-07-19',
} as const;

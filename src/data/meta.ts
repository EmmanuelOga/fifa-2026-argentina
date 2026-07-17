/**
 * Snapshot metadata. `lastUpdated` is rendered visibly across the site
 * ("Snapshot as of …"). Bump it whenever any src/data file changes.
 */
export const meta = {
  /** ISO date of the current data snapshot. */
  lastUpdated: '2026-07-16',
  /** The final is July 19, 2026 (NY/NJ). Used for the "who wins" framing. */
  finalDate: '2026-07-19',
  /** Cloudflare Turnstile SITE key (public — safe to commit). Empty = widget off.
   *  Create at dash.cloudflare.com → Turnstile; the paired SECRET key goes in a
   *  Pages secret (TURNSTILE_SECRET_KEY), never here. */
  turnstileSiteKey: '0x4AAAAAAD2sbYqCg0ZZBMAZ',
} as const;

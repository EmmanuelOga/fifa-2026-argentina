/**
 * Snapshot match timelines from ESPN's public JSON (goals, reds, team stats).
 *
 *   node scripts/fetch-match-timeline.mjs        # every bracket match with an espnId
 *
 * Writes src/data/match-events.json, consumed by the Who Wins bracket. Facts only
 * (scorers, minutes, possession, shots) with an outbound link to ESPN's match page
 * for their full timeline & momentum chart — we don't reproduce the chart itself.
 * Like everything else on the site this is a snapshot, stamped with fetchedAt, and
 * is expected to be re-run by `mise run update` / the deploy loop.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const OUT = join(root, 'src/data/match-events.json');
const API = 'https://site.api.espn.com/apis/site/v2/sports/soccer/fifa.world/summary?event=';

// Pull espnId ↔ match-id pairs straight out of bracket.ts (no TS runtime needed).
const bracketSrc = readFileSync(join(root, 'src/data/bracket.ts'), 'utf8');
const pairs = [...bracketSrc.matchAll(/id:\s*'([^']+)'[^}]*?espnId:\s*'(\d+)'/gs)].map((m) => ({
  matchId: m[1],
  espnId: m[2],
}));
if (!pairs.length) {
  console.log('no espnId fields in bracket.ts — nothing to fetch.');
  process.exit(0);
}

const KEEP = new Set(['Goal', 'Goal - Header', 'Goal - Free-kick', 'Goal - Volley', 'Penalty - Scored', 'Own Goal', 'Red Card', 'Yellow Red Card']);
const STATS = ['possessionPct', 'totalShots', 'shotsOnTarget'];

const result = { fetchedAt: new Date().toISOString().slice(0, 10), source: 'ESPN match pages (public JSON)', matches: {} };

for (const { matchId, espnId } of pairs) {
  const res = await fetch(API + espnId);
  if (!res.ok) {
    console.error(`  ${matchId}: ESPN returned ${res.status} — skipping`);
    continue;
  }
  const data = await res.json();
  const comp = data.header?.competitions?.[0];
  const status = comp?.status?.type ?? {};

  const events = (data.keyEvents ?? [])
    .filter((e) => KEEP.has(e.type?.text))
    .map((e) => ({
      minute: e.clock?.displayValue ?? '',
      type: e.type.text.startsWith('Goal') || e.type.text.includes('Scored') || e.type.text === 'Own Goal' ? 'goal' : 'red',
      team: e.team?.abbreviation ?? e.team?.displayName ?? '',
      // "Goal! England 1, Argentina 1. Enzo Fernández (Argentina) ..." → player name
      player: (e.participants?.[0]?.athlete?.displayName ?? (e.text?.match(/\.\s*([^(]+)\(/)?.[1] ?? '')).trim(),
    }));

  const stats = {};
  for (const t of data.boxscore?.teams ?? []) {
    const abbr = t.team?.abbreviation;
    if (!abbr) continue;
    stats[abbr] = Object.fromEntries(
      (t.statistics ?? []).filter((s) => STATS.includes(s.name)).map((s) => [s.name, s.displayValue]),
    );
  }

  result.matches[matchId] = {
    espnId,
    espnUrl: `https://www.espn.com/football/match/_/gameId/${espnId}`,
    state: status.description ?? 'unknown', // "Full Time" | "Second Half" | ...
    completed: status.completed === true,
    events,
    stats,
  };
  console.log(`  ${matchId}: ${status.description}, ${events.length} key events`);
}

writeFileSync(OUT, JSON.stringify(result, null, 2) + '\n');
console.log(`wrote ${OUT}`);

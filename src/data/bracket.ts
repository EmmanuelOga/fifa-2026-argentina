/**
 * Bracket state — the most volatile data on the site. Tab 4 and the Monte Carlo
 * sim read entirely from here, and both render gracefully for ANY state:
 * pre-semis, one-semi, final-set, champion, or Argentina-eliminated.
 *
 * To update after a match: fill in the relevant result, advance `state`, bump
 * meta.lastUpdated, push. That is the entire workflow.
 *
 * Snapshot as of 2026-07-12: quarterfinals complete, semifinals NOT yet played
 * (verified via ESPN/FIFA/Al Jazeera, Jul 12 2026).
 */
import type { Locale } from '../lib/i18n';

export type Stage = 'pre-semis' | 'one-semi' | 'final-set' | 'champion';

export interface Team {
  code: string;
  name: Record<Locale, string>;
  flag: string;
  /** Elo-style strength rating; seeds the Monte Carlo. Tuned so nudge=0 output
   *  converges near the clean-model title probabilities (see models.ts). */
  rating: number;
}

export interface Match {
  id: string;
  home: string; // team code
  away: string; // team code
  date: string; // ISO
  venue: Record<Locale, string>;
  /** null until played. Scores in regulation+ET; `winner` names the advancing code. */
  result: { home: number; away: number; winner: string; note?: Record<Locale, string> } | null;
}

/** The four live semifinalists. Ratings baked with Argentina's fatigue (three
 *  straight 120-minute knockouts) already priced in as a mild penalty. */
export const TEAMS: Record<string, Team> = {
  FRA: { code: 'FRA', name: { en: 'France', es: 'Francia' }, flag: '🇫🇷', rating: 2062 },
  ESP: { code: 'ESP', name: { en: 'Spain', es: 'España' }, flag: '🇪🇸', rating: 2020 },
  ENG: { code: 'ENG', name: { en: 'England', es: 'Inglaterra' }, flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', rating: 2009 },
  ARG: { code: 'ARG', name: { en: 'Argentina', es: 'Argentina' }, flag: '🇦🇷', rating: 2000 },
};

/** Quarterfinal results (all verified Jul 2026). Kept for the Tab 4 recap. */
export const QUARTERFINALS: Match[] = [
  {
    id: 'qf-arg-sui',
    home: 'ARG',
    away: 'SUI',
    date: '2026-07-11',
    venue: { en: 'Kansas City', es: 'Kansas City' },
    result: {
      home: 3,
      away: 1,
      winner: 'ARG',
      note: {
        en: 'AET. Mac Allister 10′, Álvarez 112′, L. Martínez 120+1′; Ndoye 67′. Embolo sent off 72′ (2nd yellow, simulation, after VAR review).',
        es: 'Tras alargue. Mac Allister 10′, Álvarez 112′, L. Martínez 120+1′; Ndoye 67′. Embolo expulsado 72′ (2.ª amarilla, simulación, tras revisión del VAR).',
      },
    },
  },
  {
    id: 'qf-eng-nor',
    home: 'ENG',
    away: 'NOR',
    date: '2026-07-11',
    venue: { en: '—', es: '—' },
    result: { home: 2, away: 1, winner: 'ENG', note: { en: 'AET.', es: 'Tras alargue.' } },
  },
  {
    id: 'qf-fra-mar',
    home: 'FRA',
    away: 'MAR',
    date: '2026-07-09',
    venue: { en: '—', es: '—' },
    result: { home: 2, away: 0, winner: 'FRA' },
  },
  {
    id: 'qf-esp-bel',
    home: 'ESP',
    away: 'BEL',
    date: '2026-07-10',
    venue: { en: '—', es: '—' },
    result: {
      home: 2,
      away: 1,
      winner: 'ESP',
      note: { en: 'Late winner.', es: 'Gol sobre el final.' },
    },
  },
];

/** Semifinals — not yet played as of the snapshot. */
export const SEMIFINALS: Match[] = [
  {
    id: 'sf-fra-esp',
    home: 'FRA',
    away: 'ESP',
    date: '2026-07-14',
    venue: { en: 'Dallas (Arlington)', es: 'Dallas (Arlington)' },
    result: null,
  },
  {
    id: 'sf-eng-arg',
    home: 'ENG',
    away: 'ARG',
    date: '2026-07-15',
    venue: { en: 'Atlanta', es: 'Atlanta' },
    result: null,
  },
];

/** The final. `contestants` derive from semifinal winners once known. */
export const FINAL = {
  id: 'final',
  date: '2026-07-19',
  venue: { en: 'New York / New Jersey (MetLife)', es: 'Nueva York / Nueva Jersey (MetLife)' },
  result: null as Match['result'],
};

/** Current bracket stage, derived from which results are filled in. */
export function bracketStage(): Stage {
  const semisPlayed = SEMIFINALS.filter((m) => m.result !== null).length;
  if (FINAL.result) return 'champion';
  if (semisPlayed === 2) return 'final-set';
  if (semisPlayed === 1) return 'one-semi';
  return 'pre-semis';
}

/** True once Argentina can no longer win (lost its semi, or lost the final). */
export function argentinaEliminated(): boolean {
  const sf = SEMIFINALS.find((m) => m.home === 'ARG' || m.away === 'ARG');
  if (sf?.result && sf.result.winner !== 'ARG') return true;
  if (FINAL.result && FINAL.result.winner !== 'ARG') {
    // only counts if Argentina was in the final
    return true;
  }
  return false;
}

/**
 * Client runtime for the Monte Carlo bracket. Simulates the remaining tournament
 * from the current bracket state N times with a seeded PRNG, tallies champions,
 * and renders clean vs adjusted (bias-nudged) title odds. Reproducible: same seed
 * + same inputs → identical output.
 */
import { mulberry32, eloWin, clamp } from './simmath';

interface TeamCfg {
  code: string;
  name: string;
  flag: string;
  rating: number;
  opta: number | null;
}
interface SemiCfg {
  home: string;
  away: string;
  winner: string | null;
}
interface Config {
  numLocale: string;
  labels: { clean: string; adjusted: string; nudgeOff: string; running: string; champions: string };
  stage: string;
  seed: number;
  runs: number;
  maxNudgePp: number;
  teams: TeamCfg[];
  semifinals: SemiCfg[];
  final: { winner: string | null };
}

export function initMonteCarlo(): void {
  document.querySelectorAll<HTMLElement>('[data-sim="montecarlo"]').forEach(setup);
}

function setup(root: HTMLElement): void {
  const cfg = JSON.parse(
    root.querySelector<HTMLElement>('[data-config]')!.textContent || '{}',
  ) as Config;
  const pct = new Intl.NumberFormat(cfg.numLocale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  const ratingById = new Map(cfg.teams.map((t) => [t.code, t.rating]));
  const strHost = root.querySelector<HTMLElement>('[data-strengths]')!;
  const nudgeIn = root.querySelector<HTMLInputElement>('[data-in="nudge"]')!;
  const seedIn = root.querySelector<HTMLInputElement>('[data-in="seed"]')!;
  const barsHost = root.querySelector<HTMLElement>('[data-bars]')!;
  const $out = (k: string) => root.querySelector<HTMLElement>(`[data-out="${k}"]`)!;

  // strength sliders: ±120 Elo around the seeded rating
  cfg.teams.forEach((t) => {
    const row = document.createElement('div');
    row.className = 'str-row';
    row.innerHTML = `
      <span>${t.flag} <b>${t.code}</b></span>
      <input type="range" min="${t.rating - 120}" max="${t.rating + 120}" step="2" value="${t.rating}" data-str="${t.code}" />
      <span class="data" data-str-val="${t.code}">${t.rating}</span>`;
    strHost.appendChild(row);
    row.querySelector('input')!.addEventListener('input', () => {
      $strVal(t.code).textContent = row.querySelector('input')!.value;
      run();
    });
  });
  const $strVal = (c: string) => root.querySelector<HTMLElement>(`[data-str-val="${c}"]`)!;
  const currentRatings = () => {
    const m = new Map<string, number>();
    cfg.teams.forEach((t) => {
      const el = strHost.querySelector<HTMLInputElement>(`[data-str="${t.code}"]`)!;
      m.set(t.code, +el.value);
    });
    return m;
  };

  /** Simulate the remaining bracket `runs` times; return champion probability by code. */
  function simulate(ratings: Map<string, number>, nudgePp: number, seed: number): Map<string, number> {
    const rnd = mulberry32(seed);
    const wins = new Map<string, number>(cfg.teams.map((t) => [t.code, 0]));

    // helper: probability `a` beats `b`, applying the ARG nudge symmetrically
    const pWin = (a: string, b: string) => {
      let p = eloWin(ratings.get(a)!, ratings.get(b)!);
      if (a === 'ARG') p = clamp(p + nudgePp / 100, 0, 1);
      else if (b === 'ARG') p = clamp(p - nudgePp / 100, 0, 1);
      return p;
    };
    const play = (a: string, b: string) => (rnd() < pWin(a, b) ? a : b);

    // if the final is already decided, it's deterministic
    if (cfg.final.winner) {
      wins.set(cfg.final.winner, cfg.runs);
      return normalize(wins);
    }

    for (let i = 0; i < cfg.runs; i++) {
      const finalists: string[] = [];
      for (const sf of cfg.semifinals) {
        finalists.push(sf.winner ?? play(sf.home, sf.away));
      }
      const champ = finalists.length === 2 ? play(finalists[0]!, finalists[1]!) : finalists[0]!;
      wins.set(champ, (wins.get(champ) ?? 0) + 1);
    }
    return normalize(wins);
  }

  const normalize = (wins: Map<string, number>) => {
    const out = new Map<string, number>();
    wins.forEach((v, k) => out.set(k, v / cfg.runs));
    return out;
  };

  function run(): void {
    const nudgePp = +nudgeIn.value;
    const seed = +seedIn.value | 0;
    $out('nudge').textContent = nudgePp === 0 ? cfg.labels.nudgeOff : `+${nudgePp} pp`;

    // clean = seeded ratings, no nudge (constant reference)
    const clean = simulate(ratingById, 0, seed);
    // adjusted = current slider ratings + nudge
    const adj = simulate(currentRatings(), nudgePp, seed);

    renderBars(clean, adj, nudgePp);

    // convergence note: at nudge 0 + default strengths, compare to Opta
    const argClean = clean.get('ARG') ?? 0;
    const argAdj = adj.get('ARG') ?? 0;
    $out('conv').textContent =
      nudgePp === 0
        ? convText(cfg, clean)
        : `${cfg.labels.adjusted}: Argentina ${pct.format(argAdj)} (${cfg.labels.clean} ${pct.format(argClean)}).`;
  }

  function convText(cfg: Config, clean: Map<string, number>): string {
    // report how close the clean run is to Opta for the leaders
    const parts = cfg.teams
      .filter((t) => t.opta != null)
      .map((t) => `${t.code} ${pct.format(clean.get(t.code) ?? 0)} (Opta ${pct.format(t.opta!)})`);
    return `${cfg.labels.clean} vs Opta — ${parts.join(' · ')}`;
  }

  function renderBars(clean: Map<string, number>, adj: Map<string, number>, nudgePp: number): void {
    const order = [...cfg.teams].sort((a, b) => (adj.get(b.code) ?? 0) - (adj.get(a.code) ?? 0));
    barsHost.innerHTML = '';
    order.forEach((t) => {
      const c = clean.get(t.code) ?? 0;
      const a = adj.get(t.code) ?? 0;
      const row = document.createElement('div');
      row.className = 'bar-row';
      row.innerHTML = `
        <div class="bar-top"><span>${t.flag} ${t.name}</span><span class="data">${pct.format(a)}</span></div>
        <div class="bar-track">
          <div class="bar-clean" style="width:${(c * 100).toFixed(1)}%"></div>
          <div class="bar-adj ${nudgePp > 0 && t.code === 'ARG' ? 'nudged' : ''}" style="width:${(a * 100).toFixed(1)}%"></div>
        </div>
        <div class="bar-vals">
          <span><span class="swatch" style="background:color-mix(in srgb,var(--sky) 30%,white)"></span>${cfg.labels.clean} ${pct.format(c)}</span>
          <span><span class="swatch" style="background:${nudgePp > 0 && t.code === 'ARG' ? 'var(--pop)' : 'var(--sky)'}"></span>${cfg.labels.adjusted} ${pct.format(a)}</span>
        </div>`;
      barsHost.appendChild(row);
    });
  }

  nudgeIn.addEventListener('input', run);
  root.querySelector<HTMLButtonElement>('[data-run]')!.addEventListener('click', run);
  seedIn.addEventListener('change', run);

  run();
}

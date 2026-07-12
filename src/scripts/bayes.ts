/**
 * Client runtime for the Bayesian Explorer. Combines a prior with per-evidence
 * likelihood ratios in log-odds, clamps the display to [0.1%, 99.9%], and draws
 * the posterior against the published band. The reset default PRIOR is
 * back-solved so the reset posterior lands on the band midpoint.
 */
import { bayesPosterior, logit, expit, clamp } from './simmath';

interface EvidenceCfg {
  id: string;
  label: string;
  lrMin: number;
  lrMax: number;
  defaultLR: number;
}
interface ModelCfg {
  code: string;
  label: string;
  low: number;
  high: number;
  evidence: EvidenceCfg[];
}
interface Config {
  numLocale: string;
  labels: { weak: string; neutral: string; strong: string; evidence: string };
  models: ModelCfg[];
}

// slider 0..100 → LR (log scale between lrMin and lrMax)
const sliderToLR = (s: number, e: EvidenceCfg) =>
  e.lrMin * Math.pow(e.lrMax / e.lrMin, s / 100);
const lrToSlider = (lr: number, e: EvidenceCfg) =>
  (100 * Math.log(lr / e.lrMin)) / Math.log(e.lrMax / e.lrMin);

export function initBayes(): void {
  document.querySelectorAll<HTMLElement>('[data-sim="bayes"]').forEach(setup);
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

  const priorIn = root.querySelector<HTMLInputElement>('[data-in="prior"]')!;
  const evHost = root.querySelector<HTMLElement>('[data-evidence]')!;
  const $out = (k: string) => root.querySelector<HTMLElement>(`[data-out="${k}"]`)!;
  const bandRange = root.querySelector<HTMLElement>('[data-band-range]')!;
  const bandMarker = root.querySelector<HTMLElement>('[data-band-marker]')!;
  const bandLo = root.querySelector<HTMLElement>('[data-band-lo]')!;
  const bandHi = root.querySelector<HTMLElement>('[data-band-hi]')!;

  let current = cfg.models[0]!;

  /** default prior so that posterior(defaultPrior, defaultLRs) = band midpoint */
  const defaultPriorFor = (m: ModelCfg) => {
    const mid = (m.low + m.high) / 2;
    const sumLnLR = m.evidence.reduce((s, e) => s + Math.log(e.defaultLR), 0);
    return clamp(expit(logit(clamp(mid, 1e-3, 1 - 1e-3)) - sumLnLR), 0.01, 0.99);
  };

  function buildEvidence(m: ModelCfg): void {
    evHost.innerHTML = '';
    m.evidence.forEach((e) => {
      const wrap = document.createElement('label');
      wrap.className = 'ctrl';
      wrap.innerHTML = `
        <span class="ctrl-label">${e.label} <b class="data" data-lr></b></span>
        <input type="range" min="0" max="100" step="1" data-ev="${e.id}" />
        <span class="ev-scale"><span>${cfg.labels.weak}</span><span>${cfg.labels.neutral}</span><span>${cfg.labels.strong}</span></span>`;
      evHost.appendChild(wrap);
      const input = wrap.querySelector<HTMLInputElement>('input')!;
      input.value = String(Math.round(lrToSlider(e.defaultLR, e)));
      input.addEventListener('input', render);
    });
  }

  function currentLRs(): number[] {
    return current.evidence.map((e) => {
      const input = evHost.querySelector<HTMLInputElement>(`[data-ev="${e.id}"]`)!;
      return sliderToLR(+input.value, e);
    });
  }

  function render(): void {
    const prior = +priorIn.value / 100;
    $out('prior').textContent = pct.format(prior);

    // update each evidence LR readout
    current.evidence.forEach((e) => {
      const input = evHost.querySelector<HTMLInputElement>(`[data-ev="${e.id}"]`)!;
      const lr = sliderToLR(+input.value, e);
      const b = input.previousElementSibling!.querySelector('[data-lr]')!;
      b.textContent = `×${lr.toFixed(2)}`;
      (b as HTMLElement).style.color = lr >= 1 ? 'var(--sky-ink)' : 'var(--pop)';
    });

    const post = bayesPosterior(prior, currentLRs());
    $out('posterior').textContent = pct.format(post);

    // published band on a 0..100% axis
    bandRange.style.left = `${current.low * 100}%`;
    bandRange.style.width = `${(current.high - current.low) * 100}%`;
    bandLo.style.left = `${current.low * 100}%`;
    bandLo.textContent = pct.format(current.low);
    bandHi.style.left = `${current.high * 100}%`;
    bandHi.textContent = pct.format(current.high);
    bandMarker.style.left = `${clamp(post, 0, 1) * 100}%`;
  }

  function selectModel(code: string): void {
    current = cfg.models.find((m) => m.code === code) ?? cfg.models[0]!;
    root.querySelectorAll<HTMLButtonElement>('[data-hypo]').forEach((b) => {
      const on = b.dataset.hypo === current.code;
      b.classList.toggle('active', on);
      b.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    buildEvidence(current);
    priorIn.value = String(Math.round(defaultPriorFor(current) * 100));
    render();
  }

  root.querySelectorAll<HTMLButtonElement>('[data-hypo]').forEach((b) =>
    b.addEventListener('click', () => selectModel(b.dataset.hypo!)),
  );
  priorIn.addEventListener('input', render);
  root.querySelector<HTMLButtonElement>('[data-reset]')!.addEventListener('click', () =>
    selectModel(current.code),
  );

  selectModel(cfg.models[0]!.code);
}

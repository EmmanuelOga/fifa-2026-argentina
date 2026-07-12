/**
 * Client runtime for the Conspiracy Simulator. Reads its JSON config, wires the
 * sliders/presets, and renders the survival curve on a canvas. Instant redraw
 * (no tweening) so it is fine under prefers-reduced-motion.
 */
import { grimesSurvival } from './simmath';

interface Config {
  numLocale: string;
  labels: {
    survives: string;
    conspiracyTakeawayHi: string;
    conspiracyTakeawayLo: string;
    leakChance: string;
  };
  presets: Record<string, { n: number; p: number; t: number }>;
}

// Map the 0..100 slider to a per-year probability in [0.0001, 0.05] (log scale).
const P_LO = 0.0001;
const P_HI = 0.05;
const sliderToP = (s: number) => P_LO * Math.pow(P_HI / P_LO, s / 100);
const pToSlider = (p: number) => (100 * Math.log(p / P_LO)) / Math.log(P_HI / P_LO);

export function initConspiracy(): void {
  document.querySelectorAll<HTMLElement>('[data-sim="conspiracy"]').forEach(setup);
}

function setup(root: HTMLElement): void {
  const cfg = JSON.parse(
    root.querySelector<HTMLElement>('[data-config]')!.textContent || '{}',
  ) as Config;
  const pctFmt = new Intl.NumberFormat(cfg.numLocale, {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const pctFine = new Intl.NumberFormat(cfg.numLocale, {
    style: 'percent',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const intFmt = new Intl.NumberFormat(cfg.numLocale, { maximumFractionDigits: 0 });

  const $in = (k: string) => root.querySelector<HTMLInputElement>(`[data-in="${k}"]`)!;
  const $out = (k: string) => root.querySelector<HTMLElement>(`[data-out="${k}"]`)!;
  const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]')!;
  const ctx = canvas.getContext('2d')!;

  const read = () => {
    const n = +$in('n').value;
    const p = sliderToP(+$in('p').value);
    const t = +$in('t').value;
    return { n, p, t };
  };

  function render(): void {
    const { n, p, t } = read();
    $out('n').textContent = intFmt.format(n);
    $out('p').textContent = pctFine.format(p);
    $out('t').textContent = intFmt.format(t);

    const survive = grimesSurvival(n, p, t);
    $out('survive').textContent = pctFmt.format(survive);

    const takeaway = $out('takeaway');
    takeaway.textContent = survive < 0.5 ? cfg.labels.conspiracyTakeawayLo : cfg.labels.conspiracyTakeawayHi;
    takeaway.style.color = survive < 0.5 ? 'var(--pop)' : 'var(--sun-ink)';

    drawCurve(n, p, t);
  }

  function drawCurve(n: number, p: number, tMax: number): void {
    const W = canvas.width;
    const H = canvas.height;
    const pad = 26;
    ctx.clearRect(0, 0, W, H);

    // axes
    ctx.strokeStyle = '#c7d8e6';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(pad, 6);
    ctx.lineTo(pad, H - pad);
    ctx.lineTo(W - 6, H - pad);
    ctx.stroke();

    // gridlines at 50% and 100%
    ctx.strokeStyle = '#e3eef6';
    for (const frac of [0.5, 1]) {
      const y = 6 + (H - pad - 6) * (1 - frac);
      ctx.beginPath();
      ctx.moveTo(pad, y);
      ctx.lineTo(W - 6, y);
      ctx.stroke();
    }

    const x = (t: number) => pad + (W - pad - 6) * (t / tMax);
    const y = (s: number) => 6 + (H - pad - 6) * (1 - s);

    // filled area under the survival curve
    ctx.beginPath();
    ctx.moveTo(x(0), y(1));
    const steps = 120;
    for (let i = 0; i <= steps; i++) {
      const t = (tMax * i) / steps;
      ctx.lineTo(x(t), y(grimesSurvival(n, p, t)));
    }
    ctx.lineTo(x(tMax), y(0));
    ctx.closePath();
    ctx.fillStyle = 'rgba(31,138,208,0.14)';
    ctx.fill();

    // the curve line
    ctx.beginPath();
    for (let i = 0; i <= steps; i++) {
      const t = (tMax * i) / steps;
      const px = x(t);
      const py = y(grimesSurvival(n, p, t));
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
    }
    ctx.strokeStyle = '#1f8ad0';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // marker at t
    const s = grimesSurvival(n, p, tMax);
    ctx.fillStyle = s < 0.5 ? '#e5496b' : '#f2a51c';
    ctx.beginPath();
    ctx.arc(x(tMax), y(s), 4.5, 0, Math.PI * 2);
    ctx.fill();
  }

  root.querySelectorAll<HTMLInputElement>('[data-in]').forEach((el) =>
    el.addEventListener('input', render),
  );
  root.querySelectorAll<HTMLButtonElement>('[data-preset]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const pr = cfg.presets[btn.dataset.preset!];
      if (!pr) return;
      $in('n').value = String(pr.n);
      $in('p').value = String(Math.round(pToSlider(pr.p)));
      $in('t').value = String(pr.t);
      render();
    }),
  );

  render();
}

/**
 * Restrained count-up for probability numbers. Animates a "lo–hi%" range when it
 * scrolls into view. Under prefers-reduced-motion it leaves the server-rendered
 * text untouched (no animation).
 */
export function initCountUp(): void {
  if (typeof window === 'undefined') return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = document.querySelectorAll<HTMLElement>('[data-countup]');
  if (reduced || !('IntersectionObserver' in window)) return;

  const fmt = (locale: string, v: number) =>
    new Intl.NumberFormat(locale === 'es' ? 'es-AR' : 'en', {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(v);

  const animate = (el: HTMLElement) => {
    const from = parseFloat(el.dataset.from || '0');
    const to = parseFloat(el.dataset.to || '0');
    const locale = el.dataset.locale || 'en';
    const dur = 750;
    const start = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - start) / dur);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = `${fmt(locale, from * ease)}–${fmt(locale, to * ease)}`;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          animate(e.target as HTMLElement);
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.6 },
  );
  els.forEach((el) => io.observe(el));
}

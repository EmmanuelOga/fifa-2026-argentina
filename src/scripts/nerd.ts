/**
 * Nerd mode — the switch between the two sites-in-one. Off (default): the
 * layman read — sims stay playable but their "The math" panels are collapsed
 * and .nerd-only extras are hidden. On: `data-nerd` lands on <html>, extras
 * appear, and every math <details> opens. Persisted in localStorage so the
 * choice follows the reader across pages. CSP forbids inline scripts, so this
 * runs from the bundle; the pre-hydration flash is a non-issue on a dark page.
 */
const KEY = 'la-alegria-nerd';

function apply(on: boolean): void {
  const html = document.documentElement;
  if (on) html.setAttribute('data-nerd', '');
  else html.removeAttribute('data-nerd');
  document
    .querySelectorAll<HTMLButtonElement>('[data-nerd-toggle]')
    .forEach((b) => b.setAttribute('aria-pressed', String(on)));
  document
    .querySelectorAll<HTMLDetailsElement>('details.math')
    .forEach((d) => (d.open = on));
}

function enabled(): boolean {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

function persist(on: boolean): void {
  try {
    localStorage.setItem(KEY, on ? '1' : '0');
  } catch {
    /* private mode etc. — mode still works for this page view */
  }
}

export function initNerdMode(): void {
  apply(enabled());

  document.querySelectorAll<HTMLButtonElement>('[data-nerd-toggle]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const on = !document.documentElement.hasAttribute('data-nerd');
      persist(on);
      apply(on);
    }),
  );

  // "Turn on nerd mode" invitations under each sim.
  document.querySelectorAll<HTMLButtonElement>('[data-nerd-cta]').forEach((btn) =>
    btn.addEventListener('click', () => {
      persist(true);
      apply(true);
      // Bring the freshly-opened math of the nearest sim into view.
      btn.closest('.sim')?.querySelector('details.math')?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }),
  );
}

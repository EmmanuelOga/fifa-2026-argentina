/**
 * Day/night theme switch. Night ("estadio de noche") is the default brand
 * look; day mode stamps `data-theme="light"` on <html> and global.css swaps
 * the tokens. Persisted in localStorage. A tiny CSP-hashed inline script in
 * Base.astro applies the stored theme before first paint, so this module only
 * needs to own the toggle behavior.
 */
const KEY = 'la-alegria-theme';
const DARK_BG = '#050e1c';
const LIGHT_BG = '#f4f9fd';

function apply(light: boolean): void {
  const html = document.documentElement;
  if (light) html.setAttribute('data-theme', 'light');
  else html.removeAttribute('data-theme');
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', light ? LIGHT_BG : DARK_BG);
  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((b) => {
    b.setAttribute('aria-pressed', String(light));
    const icon = b.querySelector('[data-theme-icon]');
    if (icon) icon.textContent = light ? '🌙' : '☀️';
  });
  // Canvas sims read the tokens at draw time — nudge them to repaint.
  window.dispatchEvent(new Event('resize'));
}

export function initTheme(): void {
  let light = false;
  try {
    light = localStorage.getItem(KEY) === 'light';
  } catch {
    /* private mode — theme still toggles for this page view */
  }
  apply(light);

  document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]').forEach((btn) =>
    btn.addEventListener('click', () => {
      const toLight = !document.documentElement.hasAttribute('data-theme');
      try {
        localStorage.setItem(KEY, toLight ? 'light' : 'dark');
      } catch {
        /* ignore */
      }
      apply(toLight);
    }),
  );
}

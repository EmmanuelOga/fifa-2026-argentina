/**
 * Base-path-agnostic URL helpers. Everything internal goes through here so that
 * switching from Cloudflare Pages (base "/") to GitHub Pages (base "/la-alegria")
 * is a config-only change. Never hard-code leading-slash absolute paths in
 * components — call these instead.
 */
import { TAB_SLUGS, type Locale, type TabKey } from './i18n';

const BASE = import.meta.env.BASE_URL; // "/" or "/la-alegria/" depending on host

/** Join the configured base path with a site-relative path, collapsing slashes. */
export function withBase(path: string): string {
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const rel = path.startsWith('/') ? path : `/${path}`;
  return `${base}${rel}` || '/';
}

/** URL for a localized tab, e.g. tabPath('es', 'who-wins') -> "/es/quien-gana". */
export function tabPath(locale: Locale, tab: TabKey): string {
  return withBase(`/${locale}/${TAB_SLUGS[tab][locale]}`);
}

/** URL for the localized home/hero page. */
export function homePath(locale: Locale): string {
  return withBase(`/${locale}`);
}

/** URL for an asset under /public, base-path aware. */
export function asset(path: string): string {
  return withBase(path);
}

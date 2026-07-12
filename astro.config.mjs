// @ts-check
import { defineConfig } from 'astro/config';

/*
 * Hosting is host-agnostic by design (see README "Switching hosts").
 *
 *  - Cloudflare Pages (PRIMARY): serves from the domain root, so `base` stays "/".
 *      site: 'https://la-alegria.pages.dev'
 *  - GitHub Pages (FALLBACK): served from a subpath, so set base: '/la-alegria'
 *      and site: 'https://emmanueloga.github.io'
 *
 * All internal links/asset refs go through src/lib/url.ts, which reads
 * import.meta.env.BASE_URL — so switching hosts is a config-only change.
 */
const SITE = process.env.SITE_URL ?? 'https://la-alegria.pages.dev';
const BASE = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  i18n: {
    locales: ['en', 'es'],
    defaultLocale: 'en',
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },
  devToolbar: { enabled: false },
});

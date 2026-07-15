// @ts-check
import { defineConfig } from 'astro/config';

/*
 * Hosting is host-agnostic by design (see README "Switching hosts").
 *
 *  - Cloudflare Pages (PRIMARY): serves from the domain root, so `base` stays "/".
 *      site: 'https://fifa-2026-argentina.pages.dev'
 *  - GitHub Pages (FALLBACK): served from a subpath, so set base: '/fifa-2026-argentina'
 *      and site: 'https://emmanueloga.github.io'
 *
 * All internal links/asset refs go through src/lib/url.ts, which reads
 * import.meta.env.BASE_URL — so switching hosts is a config-only change.
 */
const SITE = process.env.SITE_URL ?? 'https://fifa-2026-argentina.pages.dev';
const BASE = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  // Never inline scripts: the CSP in public/_headers is script-src 'self' (no
  // 'unsafe-inline'), so every script must ship as an external hashed file.
  build: { format: 'directory', inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
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

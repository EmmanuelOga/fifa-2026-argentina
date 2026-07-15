/**
 * Locale + routing config. The site has two first-class locales; every tab is a
 * route whose slug is localized. A single canonical "tab key" maps to a per-locale
 * slug so the language toggle can swap to the equivalent page, and so nav links
 * are generated from one source.
 */

export const LOCALES = ['en', 'es'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'en';

/** BCP-47 language tags for the <html lang> attribute and Intl formatting. */
export const HTML_LANG: Record<Locale, string> = {
  en: 'en',
  es: 'es-AR',
};

export const LOCALE_LABEL: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

/** Canonical tab keys, in nav order. `log` is the blog (per-run posts); `ask` is
 *  the LLM chat over the compiled research; `sources` is the "Sources & fine
 *  print" appendix. Keys are internal — display slugs/labels are mapped below. */
export const TAB_KEYS = [
  'story',
  'log',
  'feasibility',
  'probabilities',
  'who-wins',
  'ask',
  'sources',
] as const;
export type TabKey = (typeof TAB_KEYS)[number];

/** Localized slug for each tab in each locale. */
export const TAB_SLUGS: Record<TabKey, Record<Locale, string>> = {
  story: { en: 'story', es: 'historia' },
  feasibility: { en: 'feasibility', es: 'factibilidad' },
  probabilities: { en: 'probabilities', es: 'probabilidades' },
  'who-wins': { en: 'who-wins', es: 'quien-gana' },
  ask: { en: 'ask', es: 'consultar' },
  sources: { en: 'fine-print', es: 'letra-chica' },
  log: { en: 'blog', es: 'blog' },
};

/** Reverse lookup: given a locale + slug, find the canonical tab key. */
export function tabKeyFromSlug(locale: Locale, slug: string): TabKey | undefined {
  return TAB_KEYS.find((key) => TAB_SLUGS[key][locale] === slug);
}

export function isLocale(value: string | undefined): value is Locale {
  return value === 'en' || value === 'es';
}

export function otherLocale(locale: Locale): Locale {
  return locale === 'en' ? 'es' : 'en';
}

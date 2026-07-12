/**
 * Locale-aware number/date formatting. es-AR uses comma decimals and dot
 * thousands; the sims and probability cards route all numeric output through
 * here so the Spanish site reads naturally (e.g. "20,6 %" not "20.6%").
 */
import { HTML_LANG, type Locale } from './i18n';

export function pct(locale: Locale, value01: number, digits = 1): string {
  return new Intl.NumberFormat(HTML_LANG[locale], {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value01);
}

export function num(locale: Locale, value: number, digits = 0): string {
  return new Intl.NumberFormat(HTML_LANG[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

/** Integer with thousands separators, e.g. 10.000 (es) / 10,000 (en). */
export function int(locale: Locale, value: number): string {
  return new Intl.NumberFormat(HTML_LANG[locale], { maximumFractionDigits: 0 }).format(value);
}

/** A percentage-point delta with explicit sign, e.g. "+3,5 pp". */
export function ppDelta(locale: Locale, valuePp: number, digits = 1): string {
  const sign = valuePp > 0 ? '+' : valuePp < 0 ? '−' : '';
  const n = new Intl.NumberFormat(HTML_LANG[locale], {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Math.abs(valuePp));
  return `${sign}${n} pp`;
}

/** ISO date string -> localized long date. */
export function longDate(locale: Locale, iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`);
  return new Intl.DateTimeFormat(HTML_LANG[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  }).format(d);
}

/**
 * Thin typed helpers over the content collections. Components call these instead
 * of reaching into `astro:content` directly, so locale selection and ordering
 * live in one place.
 */
import { getCollection, getEntry } from 'astro:content';
import type { Locale } from './i18n';

/** Fetch a keyed prose section's bilingual content, throwing if the id is unknown. */
export async function getSection(id: string) {
  const entry = await getEntry('sections', id);
  if (!entry) throw new Error(`Missing content section: "${id}"`);
  return entry.data.content;
}

/** Localized view of a section (headline/short/full/body). */
export async function section(id: string, locale: Locale) {
  return (await getSection(id))[locale];
}

export async function timeline() {
  return (await getCollection('timeline')).sort((a, b) => a.data.order - b.data.order);
}

export async function hypotheses() {
  return (await getCollection('hypotheses')).sort((a, b) => a.data.order - b.data.order);
}

export async function precedents() {
  return (await getCollection('precedents')).sort((a, b) => a.data.order - b.data.order);
}

export async function sources() {
  return (await getCollection('sources')).sort(
    (a, b) => a.data.tier - b.data.tier || a.data.order - b.data.order,
  );
}

/** Sources grouped by reliability tier, tiers ascending. */
export async function sourcesByTier() {
  const all = await sources();
  const map = new Map<number, typeof all>();
  for (const s of all) {
    const list = map.get(s.data.tier) ?? [];
    list.push(s);
    map.set(s.data.tier, list);
  }
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}

export async function updates() {
  return (await getCollection('updates')).sort((a, b) => b.data.run - a.data.run);
}

/** Resolve a source reference id to its localized title + url, for citations. */
export async function sourceCite(id: string, locale: Locale) {
  const entry = await getEntry('sources', id);
  if (!entry) return undefined;
  return { title: entry.data.content[locale].title, url: entry.data.url, unverified: entry.data.unverified };
}

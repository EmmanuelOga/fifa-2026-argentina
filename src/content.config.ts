/**
 * Content collections = the single source of truth for ALL prose.
 *
 * Every substantive string on the site lives here as typed, bilingual, structured
 * content — never hard-coded in a component. Each unit carries graded fields
 * (`headline` / `short` / `full`) so any output target (website, video, future
 * slides/social) can pick a length without a rewrite, and both locales live in one
 * entry so a single edit propagates to EN, ES, and the video on rebuild.
 *
 * Volatile numbers (bracket results, model probabilities, team strengths) live
 * separately in src/data/ — see those files.
 */
import { defineCollection, reference, z } from 'astro:content';
import { file } from 'astro/loaders';

/** Graded prose in one locale. `full` may contain a few inline markers but is plain text. */
const graded = z.object({
  headline: z.string().max(90),
  short: z.string(),
  full: z.string(),
});

/** A bilingual graded unit. Extra per-locale fields can be merged via `.extend()`. */
const bilingual = z.object({ en: graded, es: graded });

/* Tab 1 — timeline of events (The Story). */
const timeline = defineCollection({
  loader: file('src/content/timeline.json'),
  schema: z.object({
    order: z.number(),
    date: z.string(), // ISO yyyy-mm-dd (approximate dates flagged in prose)
    dateApprox: z.boolean().default(false),
    /** which narrative thread: sporting perception vs. financial probe. */
    thread: z.enum(['sporting', 'financial', 'both']),
    icon: z.string(),
    sources: z.array(reference('sources')).default([]),
    content: bilingual.extend({
      en: graded.extend({ detail: z.string() }),
      es: graded.extend({ detail: z.string() }),
    }),
  }),
});

/* Tab 3 — the four hypotheses. */
const hypotheses = defineCollection({
  loader: file('src/content/hypotheses.json'),
  schema: z.object({
    order: z.number(),
    code: z.enum(['H1', 'H2', 'H3', 'H4']),
    /** primary speculative probability band, as 0..1 fractions. */
    rangeLow: z.number().min(0).max(1),
    rangeHigh: z.number().min(0).max(1),
    /** optional secondary band (H2 has two: inquiry-exists vs. chargeable-conduct). */
    secondary: z
      .object({ low: z.number(), high: z.number() })
      .optional(),
    /** which thread this hypothesis belongs to — keeps H1≠H2 visually separable. */
    thread: z.enum(['sporting', 'financial']),
    sources: z.array(reference('sources')).default([]),
    content: z.object({
      en: graded.extend({
        rangeCaption: z.string(),
        secondaryCaption: z.string().optional(),
        forPoints: z.array(z.string()),
        againstPoints: z.array(z.string()),
        changeMind: z.string(),
      }),
      es: graded.extend({
        rangeCaption: z.string(),
        secondaryCaption: z.string().optional(),
        forPoints: z.array(z.string()),
        againstPoints: z.array(z.string()),
        changeMind: z.string(),
      }),
    }),
  }),
});

/* Tab 2 — historical precedents. */
const precedents = defineCollection({
  loader: file('src/content/precedents.json'),
  schema: z.object({
    order: z.number(),
    year: z.string(),
    /** how it bears on WC-finals feasibility. */
    tag: z.enum(['proven-domestic', 'proven-betting', 'suspected', 'financial', 'circumstantial']),
    sources: z.array(reference('sources')).default([]),
    content: z.object({
      en: z.object({ name: z.string(), summary: z.string(), lesson: z.string() }),
      es: z.object({ name: z.string(), summary: z.string(), lesson: z.string() }),
    }),
  }),
});

/* Tab 5 — sources, grouped by reliability tier. */
const sources = defineCollection({
  loader: file('src/content/sources.json'),
  schema: z.object({
    order: z.number(),
    tier: z.number().int().min(1).max(5),
    url: z.string().url().optional(),
    unverified: z.boolean().default(false), // true = link a search / cite by name
    content: z.object({
      en: z.object({ title: z.string(), why: z.string() }),
      es: z.object({ title: z.string(), why: z.string() }),
    }),
  }),
});

/* Reusable keyed prose blocks: intros, bias disclosure, caveats, takeaways,
   closing note, explainers. `body` holds multi-paragraph prose per locale. */
const sections = defineCollection({
  loader: file('src/content/sections.json'),
  schema: z.object({
    content: z.object({
      en: graded.extend({ body: z.array(z.string()).default([]) }),
      es: graded.extend({ body: z.array(z.string()).default([]) }),
    }),
  }),
});

/* Tooltip glossary terms. */
const glossary = defineCollection({
  loader: file('src/content/glossary.json'),
  schema: z.object({
    content: z.object({
      en: z.object({ term: z.string(), def: z.string(), learnMore: z.string().url().optional() }),
      es: z.object({ term: z.string(), def: z.string(), learnMore: z.string().url().optional() }),
    }),
  }),
});

/* The Log / La Bitácora — a changelog of analysis re-runs. Each entry can carry a
   prediction "scorecard" (once outcomes are known) and a link to an archived
   version of the site. This is what makes the analysis a living, honest record. */
const updates = defineCollection({
  loader: file('src/content/updates.json'),
  schema: ({ image }) =>
    z.object({
    date: z.string(), // ISO
    run: z.number().int(),
    /** optional link to an archived deployment of this run. */
    archiveUrl: z.string().url().optional(),
    /** Optional mood photo (freely licensed; credit is REQUIRED and rendered). */
    image: z
      .object({
        src: image(),
        alt: z.object({ en: z.string(), es: z.string() }),
        /** Editorial caption shown under the photo (what it is / why it's here). */
        caption: z.object({ en: z.string(), es: z.string() }),
        credit: z.string(), // "Author · License · Wikimedia Commons"
        creditUrl: z.string().url(), // source page (Commons file page)
      })
      .optional(),
    /** prediction scorecard rows, filled once real outcomes are known. */
    scorecard: z
      .array(
        z.object({
          claim: z.object({ en: z.string(), es: z.string() }),
          verdict: z.enum(['pending', 'hit', 'miss', 'partial']),
        }),
      )
      .default([]),
    content: z.object({
      en: z.object({ title: z.string(), summary: z.string(), body: z.array(z.string()) }),
      es: z.object({ title: z.string(), summary: z.string(), body: z.array(z.string()) }),
    }),
  }),
});

export const collections = {
  timeline,
  hypotheses,
  precedents,
  sources,
  sections,
  glossary,
  updates,
};

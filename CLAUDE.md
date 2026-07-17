# CLAUDE.md

**La Alegría** — bilingual (EN/ES) explorable explanation of Argentina's 2026 World Cup
run. Astro 7 + strict TS, pnpm, Cloudflare Pages (`fifa-2026-argentina.pages.dev`).

## Commands

The interactive shell lacks the mise PATH — run tooling as `mise exec -- pnpm <cmd>`
(or `mise run update`, `mise exec -- node scripts/update.mjs <steps>`).

- Build: `mise exec -- pnpm build` · Deploy: `mise exec -- pnpm exec wrangler pages deploy dist --project-name fifa-2026-argentina`
- Full pipeline: `node scripts/update.mjs` → research → log → prose → translate → timeline → score → build → deploy

## CONTENT RULE — the published site talks about football, never about itself

Everything a reader can see or receive — `src/content/*.json`, `src/data/*`,
`src/i18n/ui.ts`, page copy in `src/components/`, OG images, rendered videos, the
`/api/ask` chat corpus and its responses — must be about the FIFA 2026 World Cup story:
matches, players, odds and models, the refereeing gossip, the money/FBI thread, sources
and evidence. It must **never** surface the site's own internals:

- No site mechanics: tabs, components, badges, warnings, toggles, layout, "the Who Wins
  tab now says…", "I removed the banner…".
- No engineering or editorial process narration: why we built X instead of Y, redesigns,
  refactors, pipeline/run mechanics, prompt or tooling talk, corrections about how the
  site is maintained.
- No AI/SWE chat-log internals: nothing that reads as a transcript of, or commentary on,
  the development conversation with the LLM.
- Blog entries (`src/content/updates.json`) are a **football research diary**: what
  happened on the pitch, what moved in the odds/models/evidence, and honest grading of
  earlier predictions. Methodology talk is fine only when it's about the football
  analysis itself (e.g. "removing the bookmaker overround"), not about the website.
- Blog titles are dated diary entries about the football story — never "Run N" /
  pipeline numbering in reader-facing titles or prose. (`run` stays as an internal JSON
  field for scoring.)

Sanctioned exceptions (transparency, kept deliberately): the author bio in
`src/content/author.json` (who made the site, including the "built with Claude"
disclosure), the footer's "Made with Claude" credit, and the Sources & Fine Print
page's sourcing/hedging standards. Even these never discuss code, tooling, or the dev
conversation.

Not violations: plain reader wayfinding ("browse the tabs", "the full list is on the
home page") and widget instructions ("move the sliders") — the rule targets narration
of the site's construction/maintenance, not normal web copy.

Internals belong in the repo (comments, commit messages, `research/` notes, README,
docs) — never in the rendered site. When auditing or generating content, apply this rule
to anything that ends up in `dist/` or the chat corpus.

## Editorial guardrails (load-bearing)

- Every probability labelled speculative; allegations phrased as allegations.
- H1 (match-fixing, unproven) vs H2 (money-flows, credible) kept visually and verbally
  distinct.
- Named living people traced to on-the-record sources, otherwise referred to by role.

## Cloudflare reference

When writing or changing Workers / Pages Functions code (`functions/`), consult
`docs/cloudflare-workers-prompt.txt` — Cloudflare's official agent prompt, vendored
2026-07-16 from developers.cloudflare.com/workers/prompt.txt. It's kept out of this
file on purpose (40 KB would load into every session); read it on demand.

## Gotchas

- Astro scoped styles miss runtime-injected DOM (ask.ts messages, sim controls): style
  those from `global.css` or `:global()` blocks.
- A same-day pipeline re-run overwrites that day's blog entry in place — diff
  `src/content/updates.json` after `update.mjs` before trusting it.
- AI pipeline steps can die on transient API errors — resume with
  `node scripts/update.mjs <remaining steps>`.
- Pages secrets only bind on the next deployment.

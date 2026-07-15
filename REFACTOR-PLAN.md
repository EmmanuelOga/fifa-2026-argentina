# Refactor plan: Blog-first, celebration-first (approved 2026-07-15)

Argentina is in the final (beat England 1–2 on Jul 15; Spain v Argentina, Jul 19,
MetLife). This refactor pivots the site: **celebration and the final front and
center; the rumors homework one click behind it** — framed exactly as the author
treats it: "let's get this out of the way, and have an honest look."

Execute autonomously, no check-ins. Standing rules: rioplatense voseo for ES;
every hedge/attribution survives edits; run content changes through the pipeline
(`mise exec -- node scripts/update.mjs <steps>`); typecheck (`astro check`),
build+deploy via `update.mjs publish`; verify live; commit in logical chunks and
push. Interactive shell needs `mise exec --` and `/usr/bin` in PATH.

## 1. Rename "The Log" → "Blog" + make it prominent
- `src/lib/i18n.ts`: TAB_SLUGS `log: { en: 'blog', es: 'blog' }`; move `log`
  first (or right after `story`) in TAB_KEYS nav order.
- `src/i18n/ui.ts`: TAB_LABEL/TAB_SHORT → "Blog" (both locales; drop "Bitácora").
  Grep for remaining "Log"/"Bitácora" strings in sections.json (log-intro),
  updates prose, README.
- Rename `src/pages/en/log.astro` → `blog.astro`, `src/pages/es/bitacora.astro`
  → `blog.astro` (they're thin wrappers; check how slugs map to filenames —
  the page filename must match TAB_SLUGS).
- Add `public/_redirects`: `/en/log/* /en/blog/ 301` and `/es/bitacora/* /es/blog/ 301`.

## 2. Callout diet + consolidated appendix
- New page: EN `fine-print` ("Sources & fine print"), ES `letra-chica`
  ("Fuentes y letra chica") — replaces the `sources` tab (reuse its key/slot,
  update slugs + redirects from `/en/sources`, `/es/fuentes`).
- Consolidates: sources tiers (existing SourcesPage), bias-disclosure, caveats,
  footer-disclaimer, open-questions, silver-note. One calm page, prose-first.
- Strip Callout boxes from Home/Story/Feasibility/Probabilities/WhoWins.
  Guardrail CONTENT stays but as plain inline prose (one sentence + link to the
  appendix), not boxes. Exception: prob-h1h2-warning is load-bearing — keep a
  single slim inline version on the probabilities page.
- KeyTerms strips can stay (not boxes).

## 3. Landing overhaul (HomePage.astro)
- Remove the three.js Hero from home (keep component file; drops the chunk from
  first paint). Text-first masthead instead.
- Masthead is bracket-aware via `bracketStage()`:
  - `final-set` (now): "Argentina is in the final." / "Argentina está en la final."
    + date/venue/opponent line. Design: big, celebratory, albiceleste.
  - `champion` / eliminated states: adjust headline accordingly (re-run loop!).
- Lead item: latest blog post's one-sentence `summary` + link to Blog (replaces
  the small news banner; use `updates()[0]`, delete `.news-banner`).
- Ease-in section for the rumors angle (secondary but the site's real value):
  headline like "The rumors? Let's get that out of the way." → 2 sentences,
  links to story/probabilities. No box.
- Keep the two path cards (story-first 🧉 / stats-first 📊).
- OG copy (`src/data/meta.ts` og fields if any + `src/content/sections.json`
  hero) should match the new framing; regenerate OG images only if trivial.

## 4. "Where to watch in SF" (EN only)
New home section + mention in the next blog entry. Researched 2026-07-15 (re-verify
links during execution; add as sources.json entries tier-appropriate):
- Yerba Buena Gardens, Pier 39, Thrive City, China Basin Park (Mission Rock) —
  final watch parties per SF Travel / Bay Area host committee.
- Ferry Building Plaza — final on the bayside plaza (Hog Island oysters).
- Volo's North Beach block party — Green St between Powell & Columbus, 8am–5pm,
  12-ft screen + DJ.
- Pride House SF final watch party at KQED HQ (Mission), from noon.
- Foster City: Leo J. Ryan Park "Ultimate Final Watch Party" (650 Shell Blvd).
- Sources: sfbayareafwc26.com/bay-area-events, sftravel.com watch-parties guide,
  sf.funcheap.com world-cup guide, missionlocal.org viewing-guide-map,
  bayareahostcommittee.com. Worth one search for Argentine community events
  (consulate, Club Argentino) during execution.
- EN-only: gate on `locale === 'en'`.

## 5. Aligned pending items to fold in
- Next research run writes the "Argentina reach the final" blog entry with fresh
  post-SF2 market numbers (Opta/books will have repriced) and grades the
  semifinal predictions (both were "pending" — SF1 models favored France = miss
  branch; score honestly).
- models.ts: refresh via research; MODEL_ORDER now ESP/ARG/(ENG,FRA eliminated).
- Social video regen (`pnpm render:video`) if time allows — content changed a lot.
- Do NOT add: GH Pages fallback, analytics, two-track IA beyond what exists.

## 6. Finish
- Full pipeline run: `mise exec -- node scripts/update.mjs` (research → log →
  prose → translate → timeline → score → build → deploy). Same-day log refresh
  will UPDATE today's run-3 entry in place — that's intended; it becomes the
  "Argentina in the final" post.
- Verify live: blog rename+redirects, appendix, landing, SF section, chat still
  answers (mind 10/hr IP rate limit), timelines render.
- Commit in chunks, push to origin main.

## Context (state as of 2026-07-15 evening, all committed & deployed)
- Chat live: Sonnet 5, $20-capped workspace key, Turnstile (widget
  `la-alegria-chat`), KV rate limits. Secrets in Pages, bind on next deploy.
- Pipeline: research/log/prose/translate/timeline/score/build/deploy steps;
  prose = humanizer pass (vendored .agents/skills/humanizer); one blog entry
  per day (same-day runs refresh in place).
- match-events.json: ESPN timelines (fetch-match-timeline.mjs, espnIds in
  bracket.ts). ESPN has no public momentum data — we render facts + link out.
- DeepDive component wraps sims/math collapsed; photos in blog/story with
  schema-enforced credits; macOS notification hooks in ~/.claude/settings.json.

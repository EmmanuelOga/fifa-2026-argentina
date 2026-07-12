# La Alegría / The Joy 🇦🇷

An explorable, bilingual celebration of Argentina's 2026 World Cup run — **with the
homework done on the gossip**. A fan's honest look at the refereeing whispers, the
reported FBI/AFA money story, and who actually wins, built as resume-quality work.

The arc: **joy → honest examination → joy with a clear head.** A celebration with
footnotes, not an exposé. Every probability is labelled speculative; every
allegation is phrased as an allegation; the match-fixing hypothesis (H1) and the
financial-probe hypothesis (H2) are kept visually distinct throughout.

By [Emmanuel Oga](https://www.linkedin.com/in/emmanueloga/). Made with Claude.
Opinion & analysis — not reporting, not affiliated with FIFA or AFA.

---

## What's in here

- **Bilingual site** (English `/en/…`, rioplatense Spanish `/es/…`) — 7 deep-linkable
  routes: The Story, Could It Be Done?, The Probabilities, Who Wins?, Ask the
  Research, Sources, and The Log.
- **Three interactive simulations** (vanilla TS + Canvas, mobile-friendly): a
  Conspiracy Simulator (Grimes 2016 math), a Bayesian Explorer (log-odds), and a
  seeded Monte Carlo bracket simulator.
- **A three.js hero** (lazy-loaded, with a static SVG fallback under
  `prefers-reduced-motion`) and a papelitos/ticker-tape moment on load.
- **Ask the Research** — an LLM chat grounded *only* in the site's compiled research,
  running as a Cloudflare Pages Function; unanswerable questions are logged to feed
  the next research re-run.
- **A video render target** — `pnpm render:video` produces a 9:16 MP4 per locale
  from the same content layer.
- **A living re-run loop** — the analysis is meant to be re-run; each run is
  archived and its predictions graded once outcomes are known.

## Architecture: one content layer, many outputs

**All prose lives in typed Astro content collections** (`src/content/*.json`, schemas
in `src/content.config.ts`) — bilingual, with graded fields (`headline` / `short` /
`full`) so any output target can pick a length without a rewrite. **Volatile numbers**
(bracket results, model probabilities, team strengths) live in `src/data/*.ts` with a
single visible `lastUpdated`. Components, pages, the video, and the chat all render
*from* this one layer — edit a fact once and it propagates everywhere on rebuild.

```
src/content/   canonical bilingual prose (sections, timeline, hypotheses, precedents, sources, glossary, updates)
src/data/      volatile numbers (bracket, models, team strengths, bayes config, meta.lastUpdated)
src/components/ layout, chrome, sims, page bodies (render FROM the layers above)
functions/api/ Cloudflare Pages Function for the chat (grounded in a compiled corpus)
scripts/       corpus builder, OG images, sanity checks, prediction scorer
video/         Canvas + ffmpeg render target
research/       dated archive of each analysis re-run (findings + machine-readable snapshot)
```

## Tech stack

- **Astro 7** + TypeScript (strict), **pnpm**, Vite. Toolchain pinned in `mise.toml`
  (Node 26, pnpm 10) — run `mise install` for a reproducible setup.
- **three.js** (lazy-loaded, hero only). Sims are plain TS + Canvas — no UI framework.
- Self-hosted fonts (Bricolage Grotesque / Instrument Sans / Space Grotesk) — no CDN.
- No backend for the site, no cookies, no localStorage. The chat is an optional
  serverless function.

## Develop & build

```bash
mise install            # or: use Node ≥22 + pnpm
pnpm install
pnpm dev                # http://localhost:4321  → redirects to /en/
pnpm build              # builds the corpus, then the static site into dist/
pnpm preview            # serve the production build
pnpm check              # astro check (types)
pnpm sanity             # sim-math sanity checks (MC convergence, Bayes, Grimes)
```

## Updating after a match (the 3-line workflow)

1. Edit the relevant result in `src/data/bracket.ts` (fill in a semifinal/final,
   advance the stage) and/or refresh `src/data/models.ts`.
2. Bump `lastUpdated` in `src/data/meta.ts`.
3. `git commit && git push` — the host auto-deploys. Tab 4 (and the Monte Carlo)
   re-render for the new bracket state automatically, including an
   "Argentina eliminated" state that keeps the joyful-but-honest tone.

## Re-running the analysis (the living loop)

The site is designed to be re-run as facts move and predictions resolve:

1. Re-run the Phase 0 research (web search over the same checklist). Drop a new
   `research/YYYY-MM-DD/` folder with `findings.md` + `snapshot.json`.
2. Update `src/data/` and any content that changed. Add a Log/Bitácora entry in
   `src/content/updates.json` (bump the `run` number; note what changed).
3. Once outcomes are known, fill the `outcomes` block of an earlier snapshot and run
   `node scripts/score-predictions.mjs research/2026-07-12/snapshot.json` — it prints
   a Brier score + hit/miss table. Paste that into the new Log entry's `scorecard`.
4. Optionally link the previous version: Cloudflare Pages keeps a persistent URL per
   deployment (`wrangler pages deployment list`) — put it in the entry's `archiveUrl`.

Unanswered chat questions (logged to KV, see below) are a good source of gaps to
research on the next run.

## Ask the Research (the chat)

`functions/api/ask.ts` is a Cloudflare Pages Function. On build, `scripts/build-corpus.mjs`
compiles the content layer into `functions/api/corpus.json`; the function grounds
Claude in that corpus and answers *only* from it (speculative labels + H1≠H2
distinction enforced in the system prompt). Questions it can't answer are logged to a
KV namespace for the next re-run. It degrades gracefully when the endpoint or API key
is absent (e.g. on the GitHub Pages fallback), showing a fallback message.

Configure in the Cloudflare Pages project (see Deploy):
- `ANTHROPIC_API_KEY` (secret) — required for the chat.
- `CHAT_MODEL` (var, optional) — defaults to `claude-opus-4-8`.
- `QUESTIONS` (KV binding, optional) — logs unanswerable questions.

## Video

```bash
pnpm render:video       # writes video/out/la-alegria-{en,es}.mp4 (1080×1920 H.264)
```

Composes hook → the story in 3 beats → the four hypotheses at a glance → who-wins
snapshot → *vamos* closing, from the content layer, on-brand from the shared tokens,
with speculative labels on screen. Requires `ffmpeg` (installed via Homebrew here).
Brand TTFs live in `assets/fonts/` (fetched once); the renderer falls back to system
fonts if they're absent.

## Deploy

### Primary: Cloudflare Pages (recommended — chat + preview deployments)

1. Push this repo to GitHub under `emmanueloga`.
2. Cloudflare dashboard → **Workers & Pages → Create → Pages → Connect to Git** →
   select `emmanueloga/la-alegria`. Build command `pnpm build`, output `dist`,
   framework preset **Astro**. Deploy. Every push to `main` auto-deploys after that,
   and every branch/PR gets a preview deployment.
3. For the chat: Pages project → **Settings → Environment variables** → add
   `ANTHROPIC_API_KEY` (encrypted). Optionally bind a KV namespace named `QUESTIONS`
   and set `CHAT_MODEL`. (Locally: `wrangler pages secret put ANTHROPIC_API_KEY`,
   `wrangler kv namespace create QUESTIONS`.)
4. Analytics: enable **Cloudflare Web Analytics** with one toggle in the Pages project
   (or paste the beacon into `src/components/Analytics.astro`). No `base` path needed —
   the site serves from the root; `site` is `https://la-alegria.pages.dev`.

Serves from root, so `astro.config.mjs` keeps `base: '/'`.

### Fallback: GitHub Pages

`.github/workflows/deploy.yml` builds with a subpath base and deploys via GitHub
Actions. One-time: repo **Settings → Pages → Source: "GitHub Actions"**. The workflow
sets `SITE_URL=https://emmanueloga.github.io` and `BASE_PATH=/la-alegria`; all internal
links go through `src/lib/url.ts` (`import.meta.env.BASE_URL`), so **switching hosts is
config-only** — no hard-coded paths. The chat needs serverless functions and only works
on Cloudflare; on GitHub Pages it degrades gracefully.

Verify both host configs locally:
```bash
pnpm build                                   # Cloudflare (root)
SITE_URL=https://emmanueloga.github.io BASE_PATH=/la-alegria pnpm build   # GitHub Pages
```

### Analytics

Two cookie-free, consent-banner-free options are stubbed in
`src/components/Analytics.astro` — activate **one**: Cloudflare Web Analytics
(recommended on Pages) or GoatCounter. Google Analytics is intentionally not offered.

## Adding a Phase-2 output target (~5 lines)

Everything renders from the content layer, so a new target is a new reader, not new
content. To add e.g. LinkedIn/Twitter/Mastodon/Discord/Instagram cards or a slide deck:
(1) read `src/content/*.json` (the graded fields — use `headline`/`short` for social,
`full` for slides); (2) pick the locale key (`en`/`es`); (3) render — reuse
`scripts/brand.mjs` for on-brand Canvas assets (see `scripts/gen-og.mjs` and
`video/render.mjs` as worked examples); (4) keep the speculative labels + allegation
phrasing that already live in the content. No content edits required.

## Known limitations & changelog

**Phase 0 verification corrections (Run 1, 2026-07-12)** — verified facts overrode the
source payload; hedging was never removed and no allegation was upgraded to a fact:

- **Opta refreshed** post-quarterfinals (25k sims): title France 34.0 / Spain 23.4 /
  England 21.9 / Argentina 20.6; the "49.1% ARG vs ENG" figure is Argentina's
  *reach-final* probability.
- **Silver Bulletin** ("PELE", Elo/SPI-style, 100k sims, daily) — per-team title numbers
  are paywalled, so we cite methodology + reputation and the public prediction-market
  co-favorite figure instead of inventing a number.
- **Penalty superlative softened** to "most in recent World Cups, ~double any other" —
  the exact "most over a 12-match span in tournament history" isn't authoritatively
  sourced. The "~23M views" Cape Verde figure was **dropped** (unverifiable).
- **Xhaka's line is a paraphrase** ("a decision where you kill the game"), attributed as
  such — not a verbatim quote.
- **Financial thread:** real and traceable to La Nación + the Miami Herald, but the
  $260M/$57M split and the named prosecutors are single-sourced to La Nación (attributed,
  not asserted); the private TourProdEnter individuals are referred to **by role, not
  name**; "two law-enforcement sources" is attributed to the Miami Herald; Grondona is
  DOJ's "Soccer Official #1" (identified in reporting, deceased 2014, never charged).
- **Grimes** exponential form confirmed as the constant-population special case of the
  corrected model; Garicano/Erikstad/Morgulev/Lamptey citations verified with DOIs.

**Known limitations:** Silver/PELE live per-team numbers (paywalled); Spain's QF winning
scorer left generic ("late winner"); the Miami Herald original is paywalled (syndications
used); some single-source figures carried only with explicit attribution. Full notes in
`research/2026-07-12/findings.md`.

## License

[MIT](./LICENSE). See [`IDEAS.md`](./IDEAS.md) for the backlog (including turning this
into a reusable "evidence, honestly" framework for other contested topics).

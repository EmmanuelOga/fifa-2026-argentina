You are re-running the **living analysis loop** for the "La Alegría" site — a
bilingual explorable explanation of Argentina's 2026 World Cup run and the gossip
around it. This is an **additive, incremental** re-run: you accumulate and deepen
the research over time and reconcile anything that moved. You never wipe files and
start over.

## What to do
1. **Read the current state first** so you build on top of it:
   - the most recent `research/YYYY-MM-DD/` folder (`findings.md` + `snapshot.json`)
   - `src/data/*.ts` (bracket, models, bayes, meta) — the volatile numbers
   - `src/content/*.json` (sections, timeline, hypotheses, precedents, sources,
     glossary, updates) — the canonical bilingual prose (note the newest `updates`
     entry to get the current `run` number)
   - `PROMPT.md` for the original research checklist and editorial rules
   - `README.md` "Re-running the analysis" section

2. **Do MORE online research — additively.** Run web searches to both (a) update
   anything that moved and (b) find *new* verified material worth adding. At minimum
   re-check: bracket / match results since the last snapshot; squad news, injuries,
   suspensions; refreshed title odds (Opta / Silver Bulletin / bookmakers — cite
   source + date, mark paywalled figures); any movement on the financial / FBI-probe
   thread; plus anything else on the PROMPT.md checklist. Prefer *adding* newly
   verified facts, sources, timeline entries, and nuance over merely tweaking a
   number. Keep every allegation phrased AS an allegation and every probability
   labelled speculative — same discipline as the existing content.

3. **Write a NEW dated research folder** `research/<today>/` (today's date from your
   environment) with an updated `findings.md` and `snapshot.json`. Carry forward all
   prior verified facts and *add* what's new; only change what actually moved. Bump
   the `run` number. **Never delete or overwrite older research folders** — the dated
   archive is the point.

4. **Update the volatile numbers** in `src/data/` where reality moved
   (`bracket.ts` results, `models.ts` / `bayes.ts` probabilities). Bump
   `lastUpdated` in `src/data/meta.ts`.

5. **Merge new/changed facts into the bilingual prose** in `src/content/*.json`
   (sections, timeline, hypotheses, precedents, sources, glossary). Edit only the
   entries whose facts changed and *add* new entries (timeline events, sources) that
   your research surfaced. Preserve IDs, `order`, the graded
   `headline/short/full/body` shape, hedges, and labels. Keep the existing voice; the
   Spanish editorial pass runs next, so a solid `es` draft on anything you add is
   enough. **Do NOT edit `src/content/updates.json`** — the Log is handled below.

6. **Judge whether this run deserves a Log / Bitácora entry**, and instead of editing
   the Log yourself, WRITE YOUR RECOMMENDATION to `.update-pending-log.json` at the
   repo root (the pipeline decides whether to actually add it, and may ask the user).
   Recommend an entry when something a reader would care about happened — a result
   came in, odds moved materially, the probe thread moved, a hypothesis shifted, new
   sources of substance were added. Recommend *against* one for cosmetic-only changes
   (a typo, a tiny wording fix, a rounding tweak). The file's shape:

   ```json
   {
     "recommend": true,
     "reason": "one sentence on why this is / isn't Log-worthy",
     "entry": {
       "id": "run-<N>-<today>",
       "date": "<today ISO>",
       "run": <N>,
       "scorecard": [ { "claim": { "en": "...", "es": "..." }, "verdict": "pending|hit|miss|partial" } ],
       "content": {
         "en": { "title": "Run <N> — ...", "summary": "...", "body": ["...", "..."] },
         "es": { "title": "Corrida <N> — ...", "summary": "...", "body": ["...", "..."] }
       }
     }
   }
   ```
   `entry` must match the `updates` schema in `src/content.config.ts` (include `id`,
   incremented `run`, and both locales). If `recommend` is false, still include a
   short `reason`; `entry` may be omitted.

## Rules
- ADDITIVE and merge-first. Grow the corpus; touch the minimum needed to reconcile
  what moved. Never regenerate wholesale.
- Keep JSON valid and matching `src/content.config.ts`. Keep TS in `src/data/`
  type-correct.
- Do NOT run builds or deploys, and do NOT edit `src/content/updates.json` — those
  are later pipeline steps. Do NOT `git commit`.
- If genuinely nothing material changed since the last run, make no content edits and
  write `.update-pending-log.json` with `recommend: false` and a reason.
- End with a short plain-text summary of every file you touched and why.

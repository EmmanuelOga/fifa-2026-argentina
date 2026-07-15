You are doing the **Spanish editorial pass** for the "La Alegría" site — the same
rioplatense / porteño voice as the last "rioplatense editorial pass" commit.
This is a MERGE pass over existing content, not a regeneration.

## What to do
1. Read `src/content/*.json` and note every entry where the English (`en`) side
   changed but the Spanish (`es`) side is stale, missing, or was left as a rough
   draft (e.g. new entries the research step just added).
2. For each, write / refresh the `es` fields so they:
   - match the current `en` meaning, facts, numbers, hedges, and labels exactly
   - read as natural Argentine Spanish — **voseo**, porteño register, the site's
     established warm-but-honest tone; not neutral/translationese
   - preserve every "speculative" / "allegation" hedge and every citation
3. Also skim already-translated entries for consistency of voice with the newest
   ones, but do not churn text that is already good.
4. Keep the graded shape (`headline`/`short`/`full`/`body` and any per-collection
   extra fields like `detail`, `forPoints`, `rangeCaption`) intact and parallel to
   the `en` side.

## Rules
- Do NOT touch the `en` fields. Do NOT change any numbers, dates, or source URLs.
- Keep JSON valid and matching `src/content.config.ts`. Every `es` object must
  have the same keys as its `en` sibling.
- MERGE only what needs it — don't rewrite good existing Spanish.
- Do NOT run builds or deploys. Do NOT `git commit`.
- End with a short plain-text summary of which entries you re-translated or fixed.

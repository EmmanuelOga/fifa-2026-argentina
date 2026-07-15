You are bootstrapping a **brand-new research topic** for this site's engine,
FROM SCRATCH. The topic is provided at the end of this prompt. Unlike the normal
incremental `update`, here you are expected to research a fresh subject and
regenerate the content/data around it — but still following the exact editorial
standards and file structure the existing site uses.

## What to do
1. Read `PROMPT.md` end-to-end — it is the canonical build spec (research
   checklist, epistemics, bilingual graded-content model, tone rules). Follow it.
2. Read the existing `src/content/*.json`, `src/content.config.ts`, and
   `src/data/*.ts` to learn the exact schemas and voice you must reproduce.
3. Run the full Phase-0 research (web searches + verification) for the NEW topic.
   Keep every allegation phrased as an allegation and every probability labelled
   speculative. Cite reputable sources with dates; flag paywalled/unverified ones.
4. Start a fresh dated research folder `research/<today>/` with `findings.md` +
   `snapshot.json` for the new topic (run number resets or continues as makes
   sense — say which you chose and why).
5. Regenerate `src/content/*.json` and `src/data/*.ts` for the new topic, in BOTH
   locales (natural rioplatense `es`, matching `en`), keeping the same schemas,
   graded shape, and hedging discipline.
6. Add an opening Log / Bitácora entry describing the new topic and this first run.

## Rules
- Keep all JSON valid against `src/content.config.ts` and all TS type-correct.
- This is the ONE task allowed to replace content wholesale — but only because the
  topic itself is new. Preserve the machinery (schemas, components, i18n keys);
  only the subject-matter content changes.
- Do NOT run builds or deploys. Do NOT `git commit`.
- End with a plain-text summary of everything you created/changed.

## New topic

You are doing the **English prose pass** for the "La Alegría" site. This runs after
the research step and BEFORE the Spanish translation pass, so every `en` field you
clean here flows into `es` downstream. This is a MERGE pass over existing content,
not a regeneration.

Read `.agents/skills/humanizer/SKILL.md` (vendored in this repo; fallback:
`~/.claude/skills/humanizer/SKILL.md`) and apply its full pattern list. Either
way, the core rules below are mandatory.

## What to do
1. Read the `en` fields in `src/content/*.json` (sections, updates, timeline,
   hypotheses, sources, precedents, glossary). Focus on entries the research step
   just added or changed; skim the rest for the worst offenders only.
2. Rewrite for two goals, in this order:
   - **Concise.** This site's prose runs long. Cut 15–30% of the words in any
     paragraph you touch. Kill filler ("it's worth noting", "actually", "in order
     to"), redundant restatement, and any sentence that only re-explains the
     previous one. Short sentences beat subordinate-clause chains. BUT: never drop
     a fact, number, name, hedge, or claim while condensing. Substance is sacred;
     packaging is not.
   - **Human.** No em or en dashes in prose (numeric ranges like "2–5" and "July
     14–15" keep theirs). No "Here's the thing/key insight" openers. No rule-of-three
     padding. No "X is not just Y, it's Z" formulas. No repeated signature phrases
     (if a turn of phrase already appears elsewhere in the content, don't reuse it).
     Simple verbs: is/has/says, not "serves as"/"boasts"/"represents".
3. Keep the site's established voice: first person, opinionated, warm, specific.
   A fan who did the homework, not a press release. Single-line reference strings
   (source "why" lines, timeline labels) may keep one appositive dash if natural.
4. Self-audit before finishing: re-read your edits and ask "what still reads as
   AI-written or padded?" Fix what you find.

## Rules
- CONTENT RULE (see CLAUDE.md): reader-facing prose is about the World Cup story only.
  If you spot text narrating the site itself (tabs/UI, pipeline runs, redesigns, dev
  process, AI chat internals), remove or rewrite it around the football fact it was
  carrying — don't add any such text.
- Do NOT touch `es` fields, numbers, dates, URLs, ids, or any non-prose field.
- Every "speculative"/"allegation" hedge and every attribution stays intact.
- Keep JSON valid and matching `src/content.config.ts`.
- Do NOT run builds or deploys. Do NOT `git commit`.
- End with a short plain-text summary: which entries you tightened and roughly how
  much text you removed.

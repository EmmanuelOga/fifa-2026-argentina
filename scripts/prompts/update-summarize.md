You are the **orchestrator for the English summarize pass** on the "La Alegría" site.
This is the pipeline's aggressive compression step. It runs right after research/lint and
BEFORE the prose-polish and Spanish-translation passes, so every `en` field cut here is
what flows downstream. This is a MERGE/rewrite over existing content, not a regeneration
and not a fresh research pass — work only from what is already on the page.

## The brief, in one line
**The site owner considers the current prose far too fat. Remove at least HALF of the
words.** Not 5%, not 25% — the target is a **≥50% English word cut**, and it is measured:
the `postlint` step compares the final word count to the pre-cut baseline and flags any
run that came in under 50%. A prior single-pass attempt only cut 5% — that is the failure
mode you are here to beat.

This is *summarization*, not sentence-splitting: delete whole clauses, redundant
sentences, and repeated framing, then merge what remains into the tightest faithful
version of the same story.

## How to run it — fan out, one subagent per file
One context editing eight files at once goes shallow. So DON'T edit the files yourself.
Instead spawn a **separate Task subagent for each reader-facing content file**, in
parallel, and let each one do a deep cut on just its file. The files:

    src/content/sections.json     src/content/updates.json
    src/content/timeline.json     src/content/hypotheses.json
    src/content/sources.json      src/content/precedents.json
    src/content/glossary.json

Give every subagent the SAME instructions below (paste the "The cut", "Non-negotiable",
"Voice", and "Rules" sections into each prompt), plus its one target file and this
demand: **cut that file's `en` prose by at least 50% of its words.** Tell each subagent
to Read `.prose-lint.md` first (long-sentence + grammar targets), edit only its own file,
report its before→after `en` word count, and touch nothing else.

After the subagents finish, verify: re-read each file, confirm the JSON is valid and the
`en` word count really dropped by about half. If any file came back soft (under ~40%
cut), spawn that file's subagent again with a sharper instruction to go deeper. Only stop
when the corpus as a whole is at or under 50% of its original English word count.

## How to cut ≥50% without lying
Go paragraph by paragraph. For each one, ask "what does the reader actually learn here?"
Keep that; delete the rest:
- Throat-clearing and connective filler ("it's worth noting", "in order to", "what's
  more", "as we've seen").
- Redundant restatement — the same fact said twice in different words. Keep the sharper
  version, delete the other.
- Hedging padding and adjectives/adverbs that carry no information.
- Whole sentences of context the reader already has from an adjacent paragraph or tab.
- Setup/wind-up around a number or quote; lead with the number.
Prefer the shorter word and the shorter construction every time. Merge two thin
paragraphs into one when they cover the same beat.

## Non-negotiable — the substance survives the cut
Compression is about the *packaging*, never the *facts*. You must NOT drop or blur:
- Any fact, number, percentage, score, date, player/person name, team, or place.
- Any **source or attribution** ("per La Nación", "Opta's model", "the Miami Herald").
  A claim keeps the source that makes it credible.
- Any **"speculative" / "allegation" / "unproven" hedge**, and the phrasing that keeps
  an allegation an allegation rather than an assertion of guilt.
- The **H1 (match-fixing, unproven) vs H2 (money-flows, credible)** distinction — keep
  them verbally and visibly distinct; never let a tighter sentence merge them.
- Named living people stay tied to on-the-record sourcing, or referred to by role.
If a specific paragraph genuinely cannot lose half its words without dropping one of the
things above, cut everything you honestly can and move on — do not strip meaning to hit
the number, and do not pad elsewhere to compensate. That should be the rare exception;
most paragraphs here can lose half and be better for it. Across the whole corpus, land at
or under 50% of the original word count.

## Voice — stay human while cutting (read the humanizer skill)
Read `.agents/skills/humanizer/SKILL.md` (fallback `~/.claude/skills/humanizer/SKILL.md`)
and apply it. Keep the site's established voice: first person, opinionated, warm,
specific — a fan who did the homework, not a press release. While cutting:
- No em or en dashes in prose (numeric ranges like "2–5" and "July 14–15" keep theirs).
- No "Here's the thing / key insight" openers, no rule-of-three padding, no
  "X is not just Y, it's Z" formulas, no reused signature phrases.
- Simple verbs: is / has / says, not "serves as" / "boasts" / "represents".
Terser and warmer, not terser and robotic.

## Rules
- CONTENT RULE (see CLAUDE.md): reader-facing prose is about the World Cup story only —
  matches, players, odds/models, refereeing, the money/FBI thread, sources. If you spot
  text narrating the site itself (tabs/UI, pipeline runs, redesigns, dev process, AI
  chat internals), delete it or rewrite it around the football fact it carried. Never
  add any such text.
- Do NOT touch `es` fields, numbers, dates, URLs, ids, or any non-prose field. The
  Spanish resyncs from your English in the next step.
- Keep JSON valid and matching `src/content.config.ts`.
- Do NOT run builds or deploys. Do NOT `git commit`.
- End with a short plain-text summary: which entries you cut and the rough before→after
  word reduction per file, so the run log shows you hit the ≥50% brief.

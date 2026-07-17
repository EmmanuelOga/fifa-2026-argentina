# ROADMAP

Planned and in-progress work for **La Alegría**. Shipped items move to the bottom
under "Done". Reader-facing content always follows the CONTENT RULE in `CLAUDE.md`;
everything here is repo-internal.

## In progress

### Terser prose, guided by grammar linters

**Goal.** The site's prose still reads long even after the `prose` (humanizer) pass.
Push the tightening harder — cut **25–50%** of the words across the board — while
keeping the copy legible, grammatical, and true to the established voice (no dropped
fact, number, name, or hedge).

**Approach.** The verbosity cut stays an LLM job (the `prose` step). Three external
grammar/style linters are wired into the pipeline to *guide* that step and *validate*
its output — they don't rewrite prose themselves, they measure it:

| Tool | Role in pipeline | Notes |
|------|------------------|-------|
| **Harper** (`harper-cli`) | Fast, Markdown-native, fully local. Uniquely flags **long sentences** — the core terseness signal. | Rust binary via brew; no runtime deps. |
| **LanguageTool** (`languagetool`) | Deepest engine; checks **EN and ES** grammar/style. | brew; self-bundles openjdk@17. Fed Markdown-stripped text. |
| **LTeX+** (`ltex-ls-plus`) | LanguageTool wrapped with real Markdown parsing. Best-effort comparative engine (EN). | LSP-only (no batch CLI), so `lint-prose.mjs` drives it with a tiny built-in LSP client over stdio; guarded by a timeout so it can never destabilize the gate. |

All three are wired and working. In practice Harper is the terseness workhorse (long sentences); LanguageTool and LTeX+ agree closely on grammar (same engine), so LanguageTool carries the ES side and LTeX+ rides along on EN as a cross-check.

**Pipeline placement (comparative, in sequence):**

```
research → lint(baseline) → prose → translate → lint(verify) → timeline → score → build → deploy
```

- `lint` (baseline) runs the linters over current EN/ES prose, writes findings +
  word counts to `.prose-lint.json`, and prints a per-tool report.
- `prose` reads `.prose-lint.json`, cuts 25–50%, and fixes flagged grammar issues.
- `lint` (verify) re-lints and prints the **delta**: % words removed and whether the
  grammar-issue count held or improved. It's a soft gate — it warns, never fails the
  build, because some LanguageTool flags are stylistic false positives against this
  site's deliberately informal first-person voice.

**Outcome (shipped 2026-07-17).** The linter infrastructure and pipeline wiring are
done and working. The content cut landed at **~17% EN / ~16% ES**, below the 25–50%
target — and that gap is the honest finding, not a shortfall to fix by pushing harder:

- The narrative/voice files (updates, sources, glossary, author) cleared ~21–26%.
- The fact-dense files (sections, timeline, hypotheses, precedents) hit a substance
  floor at ~10–18%: nearly every sentence carries a number, a named person, a source,
  a date, or a mandatory hedge, and cutting to 25% there would mean dropping football
  facts, blurring the H1-vs-H2 distinction, or flattening the site's warm first-person
  voice. Given the choice, we kept the voice and the substance.
- Grammar/long-sentence quality improved alongside (EN long sentences 31 → 12,
  grammar-issue count down), so the prose is both shorter and cleaner.

To go further would be an **editorial** decision (thinning evidence points / analytical
asides), not compression — left as a future option, not a bug.

## Backlog

- Optional deeper cut: trim redundant for/against points and repeated analytical asides
  in the fact-dense files to approach 25% (editorial, changes substance).

## Done

- **Terser prose, guided by grammar linters** (2026-07-17) — see above. Harper +
  LanguageTool + LTeX+ wired as a comparative `lint`/`postlint` gate; prose cut ~17%
  EN / ~16% ES with grammar improved, published.
- **Every blog post has a picture** (2026-07-17) — run-4 (FBI HQ, CC BY 2.0) and run-5
  (Maradona '86, public domain) added; all five diary entries now carry a mood photo.

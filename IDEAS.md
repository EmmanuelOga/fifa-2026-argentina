# Ideas / backlog

A running list of possible next steps. Not commitments — a place to park good
ideas between re-runs. Keep the epistemics guardrails (§ README) on anything new:
speculative labels, allegations phrased as allegations, sources for named people.

## From friends / feedback
- **Racism & the wider "anti-Argentina" narrative.** A friend suggested covering
  the racism accusations and other threads that are part of the anti-Argentina
  campaign around the run. Worth a dedicated angle — but handle with the same
  rigor as the rest: separate *perception* from *proven*, source every claim,
  and never flatten distinct incidents into one "campaign" without evidence.
  Could be a new timeline thread (a third color?) or a short companion tab.
- **RAG-chat as an output target, not a replacement.** "Just feed the research to
  a RAG and chat with it directly instead of a frontend." We already ship this as
  the **Ask the Research** tab (`/api/ask`) — treat it as one output target of the
  single content layer, alongside the site and the video, rather than an
  alternative to the site. Possible extensions: streaming responses, a standalone
  embeddable widget, a CLI (`node scripts/ask.mjs "question"`), or a Discord/Slack
  bot that answers from the same corpus.

## Turn this into a framework (big one)
- **Generalize the engine beyond football.** The real reusable asset here isn't
  the World Cup take — it's the *method*: a bias-disclosed, source-traced,
  hypothesis-ranked, speculative-labelled explorable explanation with a Bayesian
  explorer, a "what would change my mind" per claim, an LLM chat grounded only in
  the compiled research, and a living re-run log that grades its own past
  predictions. That skeleton fits any contested, emotionally-loaded topic where
  people conflate distinct claims and where honesty-with-warmth beats a hot take:
  responding to anti-vaxxer claims, election-fraud allegations, "the moon landing",
  a company's PR crisis, a local political scandal, etc.
- **What "framework-ize" means concretely:**
  - Extract the topic-specific substance (content collections + `src/data`) from
    the reusable machinery (schemas, sims, layout, i18n, chat, video, re-run loop).
    Today content and engine already live in separate directories — the next step
    is a `create-explorable` scaffold that stamps out a new topic from a template.
  - Keep the guardrails as *code*, not convention: speculative labels, allegation
    phrasing, per-claim sourcing, and the H1≠H2-style "don't conflate these"
    device should be first-class schema fields every topic inherits.
  - Make the three sims configurable rather than football-specific: the Bayesian
    explorer and conspiracy-viability sim are already topic-agnostic; the Monte
    Carlo would be swapped for a topic-appropriate model (or dropped).
  - Ship it as an open template ("evidence, honestly" / "celebration with
    footnotes" kit) so others can build their own — the anti-vax response being
    an obvious, high-value first fork.
- **Caution:** the framework's value is the epistemic discipline. Guard against it
  being used to launder a predetermined conclusion — the "what would change my
  mind" and the self-grading re-run log are what keep it honest; keep them
  mandatory in the template.

## Content / analysis
- **xG-adjusted decision study.** The single most decision-relevant artifact for
  H3 (and named as the "what would change my mind"): compare Argentina's marginal
  calls vs peer teams on an xG-adjusted basis. If someone publishes it, cite it.
- **Post-final grading pass.** After July 19, grade Run 1's title-probability
  forecast (Brier score via `scripts/score-predictions.mjs`) and the H1–H4 ranges
  against whatever actually surfaced. Make the Log/Bitácora scorecard real.
- **DOJ watch.** A small tracker for the post-July-19 window: subpoena →
  indictment → cooperating witness. Data-file driven, like the bracket.

## Output targets (Phase 2, already schema-supported)
- Static HTML slide deck from the content layer.
- Per-platform post assets: LinkedIn, Twitter/X, Mastodon, Discord, Instagram
  (image cards/carousel + ready-to-paste captions). See README "Adding an output
  target."
- Longer-form video cut (~90s) and a 15s teaser from the same scenes.

## Product / tech
- **Prediction-market embed.** If a public market lists the four semifinalists,
  show live implied odds next to Opta and the author ranges (fourth anchor).
- **Deploy-per-rerun archive.** Wire the Log entries' `archiveUrl` to the
  Cloudflare Pages per-deployment aliases so each re-run's site stays browsable.
- **Reduced-data / offline mode** for the sims (they already run fully client-side
  — could ship a "download the analysis" static bundle).
- **Accessibility audit** with a screen reader on the sims specifically (sliders +
  live regions), beyond the automated Lighthouse pass.
- **i18n: a third locale?** Portuguese would fit the region and the rivalry.

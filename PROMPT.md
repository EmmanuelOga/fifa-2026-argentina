# Build Prompt: "La Alegría / The Joy" — an explorable celebration of Argentina's World Cup run (with the homework done on the gossip)

You are building a polished, bilingual, interactive explorable-explanation website. It will live on the author's GitHub as resume-quality work, so treat code quality, design, and epistemics as first-class. Work end to end: scaffold, build, verify, and prepare deployment.

---

## 0. Phase 0 — Verify before building (research tasks; you have web access, use it)

The content payload (Appendix A) was researched around July 12, 2026, partly from secondary sources. Before writing site copy, run a verification pass. **Rule: verified facts override Appendix A — correct silently and note corrections in the README's changelog — but never remove hedging language, and never upgrade an allegation to a fact.**

Verify (highest priority first):
1. **Anything that changed since Jul 12:** semifinal results (Jul 14–15), injuries/suspensions, any new statements on the FBI/AFA story, refreshed Opta/The Analyst probabilities and current bookmaker odds. Also fetch **Nate Silver's World Cup 2026 model** at https://www.natesilver.net/p/world-cup-2026-odds-predictions — extract its current per-team title/advance probabilities as a second independent model alongside Opta, note its methodology (Elo/SPI-style ratings), and briefly assess the source's reputation (Silver founded FiveThirtyEight; evaluate his forecasting track record and methodology transparency yourself before citing). If probabilities materially disagree with Opta, show both and say so — disagreement between models is itself informative content for Tab 4. If the page is partially paywalled, use what's public and note the limitation. Update the data files (§2) accordingly, including `lastUpdated`.
2. **Load-bearing statistics:** the "8 penalties across 2022+2026, most over a 12-match span" claim (this anchors the H1/H3 discussion — confirm against a stats source or soften to "among the most"); the "~23M views" Cape Verde clip figure (verify or drop the number); Opta's 21.9/20.6/49.1% figures (likely stale post-QF).
3. **Direct quotes:** Collina's integrity statement, Hossam Hassan's remarks, Xhaka's "killed the game." Verify exact wording against a linked source before quoting; keep quotes under ~15 words; otherwise paraphrase with attribution.
4. **Single-source details:** TourProdEnter LLC figures ($260M / ~$57M), named prosecutors, the travel-bond/post-final timing, Tapia's ~$12.7M Argentine charges, the Dec 2025 raids. Find the original La Nación pieces (Alconada Mon / Olivera) and the Miami Herald story; if a detail can't be traced to them, attribute it explicitly as "reported by X" or cut it.
5. **Canonical URLs** for Appendix B's unlinked items: DOJ 2015 press release + indictment (justice.gov), Arzuaga plea release, CAS Lamptey media release, Garicano et al. (DOI/JSTOR), Grimes 2016 (PLOS ONE DOI — **check for its published correction and use the corrected math**), exact citations for Erikstad & Johansen and Morgulev et al., IFAB Laws of the Game (blood-injury rule) and FIFA's 2026 VAR protocol changes, current Opta predictions page, an odds-comparison page.
6. **Match-detail sanity check:** scorers/timings for all four QFs, semifinal venues/dates, the Pinheiro Bayern–PSG incident description, the Tello all-Argentine crew for France–Morocco.

Timebox this to a focused pass (~30–60 min of searching); note anything unverifiable in the README under "Known limitations" rather than blocking the build.

## 1. Author, framing, and voice

- **Author:** Emmanuel Oga — link prominently to https://www.linkedin.com/in/emmanueloga/ (byline in header/hero and footer).
- **Framing (use this, it's the soul of the piece):** the World Cup is a joyful event, and the author — an Argentinian fan — is loving every minute of Argentina's run. He thinks Messi is the GOAT and admits he's biased ("I'm Argentinian, what did you expect 🇦🇷"). But people kept bringing up the gossip: refereeing favoritism, an FBI probe, corruption whispers. So instead of shrugging, he did the homework — and this site is the result: address the gossip to the best of anyone's ability, honestly and rigorously, and explain why, after all of it, he still celebrates every goal and hopes Argentina lifts the trophy on July 19. The arc is joy → honest examination → joy with a clear head. It is a celebration with footnotes, not an exposé. Each tab should land on its constructive takeaway, and the site's closing note is unapologetically hopeful: *vamos Argentina*.
- **Tone:** joyful, warm, wry, terse-but-readable — a fan's voice, not a prosecutor's. General-audience prose on the surface; technical depth behind expandable sections, tooltips, and source links. Never clickbait, never defensive, never gloomy. Short paragraphs. It should be *fun to read* while being rigorous — rigor in service of enjoying the tournament more, not less.
- **A visible "bias disclosure" box** near the top, in the author's voice.
- **Epistemics guardrails (non-negotiable):**
  - Every probability is labeled **speculative** — these are subjective estimates, not measured facts.
  - Allegations are phrased as allegations. No claim of guilt anywhere.
  - The distinction between H2 (financial probe — credible) and H1 (match-fixing — unproven) must be visually prominent; conflating them is called out as the #1 error people make.
  - Each hypothesis has a "what would change my mind" callout.
  - **Defamation hygiene:** every claim about a named living person must trace to a linked source and be attributed ("per La Nación…", "reported by…"). Where sourcing is thin, prefer roles over names (e.g., "two businessmen reported as figures investigators may approach" rather than bare names). Never speculate about an individual's guilt or motives.
  - **Quotes:** only verified wording, under ~15 words, one quote per source max; otherwise paraphrase with attribution.
  - Footer disclaimer: opinion/analysis, not reporting; not affiliated with FIFA/AFA; "made with Claude."

## 2. Tech stack (use latest stable versions)

- **Astro** (v5+, latest) with **pnpm** (latest) and TypeScript. Vite comes with Astro.
- **Toolchain management:** prefer **mise** first, **Homebrew** second, for installing/pinning any needed tools (node, pnpm, ffmpeg, etc.) — feel free to install missing tools with them. Prefer modern/latest stable versions of all tools; commit a `mise.toml` so the toolchain is reproducible.
- **three.js** installed via npm (latest) — used ONLY for the hero micro-interaction (see §6). Lazy-load it; the page must be fully readable before/without it.
- Interactive simulations as **Astro islands** using **vanilla TypeScript + Canvas/SVG** (preferred for bundle size) or Preact if state genuinely demands it. No React/Vue unless justified.
- No backend, no cookies, no localStorage. All state in memory / URL.
- **Data-driven volatile content:** everything that can change (bracket results, fixtures, model/bookmaker probabilities, hypothesis ranges, timeline events) lives in typed JSON/TS files under `src/data/` — never hard-coded in components — with a single `lastUpdated` field rendered visibly on the site ("Snapshot as of …"). Updating after a match = edit one data file, push, auto-deploy. This is one half of the single-source-of-truth requirement — the prose half lives in content collections, see §3. Design Tab 4 to render gracefully for any bracket state (pre-semis, one semi played, final set, champion decided — including an "Argentina eliminated" state that keeps the joyful-but-honest tone). Document the update workflow in the README in three lines.
- **Repo:** GitHub under `emmanueloga`; suggested name `la-alegria`. If the `gh` CLI is authenticated in this environment, create the repo and push (`gh repo create emmanueloga/la-alegria --public --source=. --push`); otherwise finish with the exact commands for the author to run.
- **Hosting — primary: Cloudflare Pages** (via Git integration, chosen for DX):
  - Build command `pnpm build`, output directory `dist`, framework preset Astro. Site serves from root at `https://la-alegria.pages.dev` — set `site` accordingly, **no `base` path needed**.
  - Benefits to actually use: per-branch/PR **preview deployments**; add a `public/_headers` file with sensible caching + security headers (e.g., long-cache hashed assets, `X-Content-Type-Options`, a reasonable CSP that still allows the GoatCounter/CF Analytics script).
  - One-time manual step for the author (document in README): Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → select `emmanueloga/la-alegria` → deploy. Every push to `main` auto-deploys afterward.
- **Hosting — fallback: GitHub Pages.** Also include `.github/workflows/deploy.yml` using `withastro/action` + `actions/deploy-pages` (manual step there: repo Settings → Pages → Source: "GitHub Actions"), and document in the README how to switch: set `base: '/la-alegria'` and `site: 'https://emmanueloga.github.io'`.
  - **Because two hosts are possible, write all internal links and asset references base-path-agnostically** (Astro's `import.meta.env.BASE_URL` / built-in helpers, never hard-coded absolute `/...` paths), so switching hosts is a config-only change. Verify the build works under both configs.

## 3. Content architecture: single source of truth, many output targets

This is a core requirement, and it plays to Astro's central concept (content-driven sites):

- **One canonical, machine-readable, refreshable content layer.** ALL substance — narrative prose, timeline events, hypothesis cards, stats, precedents, quotes, takeaways, caveats — lives as typed, structured content in **Astro content collections** (`src/content/` with zod schemas), alongside the volatile numbers in `src/data/` (§2). Pages, components, and every output target render *from* this layer; no prose is hard-coded in components or page templates. **Updating a fact or a paragraph once, in this one place, must be sufficient** — the site (both locales) and all derived outputs pick the change up on rebuild.
- **Author for reuse.** Give each content unit graded fields so downstream targets can pick a length without rewriting: e.g., `headline` (≤ 80 chars), `short` (1–2 sentences, social-ready), `full` (site prose), plus `sources[]` and locale variants under the same schema. The epistemics guardrails (§1 — speculative labels, allegation phrasing, hedging) are part of the content itself, so they propagate to every target automatically.
- **Output targets** (all rendered from the same content layer):
  1. **The website** — build now.
  2. **A video** — build now. A `pnpm render:video` script that composes selected content units (hook → the story in 3 beats → the four hypotheses at a glance → who-wins snapshot → *vamos* closing) into a short (~60–90s) vertical 9:16 MP4, suitable for social. Prefer a code-driven renderer so the video regenerates from the content layer whenever data changes: **Remotion** is acceptable here (its React dependency is justified for video and must stay out of the site bundle — isolate it in its own workspace package or a `video/` directory with its own deps), or a Canvas + ffmpeg pipeline if lighter. Reuse the design tokens (§6) so it's on-brand; render EN and ES variants; keep speculative labels and hedging on screen — guardrails apply to every output.
  3. **Phase 2 targets — design for, don't build:** a static HTML slide deck (responsive, readable on phones), and per-platform post assets for **LinkedIn, Twitter/X, Mastodon, Discord**, and Instagram (image cards/carousel + ready-to-paste caption text). For these, only ensure the content schema supports them (the graded fields above) and document in the README (~5 lines) how a new render target plugs into the content layer.

## 4. Site architecture: MPA with i18n routing

- Astro multi-page app. Astro's built-in i18n routing with two locales:
  - English at `/en/...` (default; root `/` redirects to `/en/`).
  - Spanish at `/es/...` — a **first-class translation**, rioplatense-friendly, natural (not machine-stiff). Translate ALL prose, tooltips, chart labels, sim controls, and UI chrome.
- A language toggle in the header that swaps to the equivalent page in the other locale.
- **"Tabs" are routes** sharing a persistent layout (header, tab nav, footer), so each tab is deep-linkable and shareable:

| # | EN route | ES route | Tab |
|---|---|---|---|
| 1 | `/en/story` | `/es/historia` | The Story / La Historia |
| 2 | `/en/feasibility` | `/es/factibilidad` | Could It Be Done? / ¿Se Puede? |
| 3 | `/en/probabilities` | `/es/probabilidades` | The Probabilities / Las Probabilidades |
| 4 | `/en/who-wins` | `/es/quien-gana` | Who Wins / ¿Quién Gana? |
| 5 | `/en/sources` | `/es/fuentes` | Sources / Fuentes |

- Tab nav: horizontal on desktop; on mobile, either a scrollable pill bar or bottom nav — usable with thumbs at 360px width.

## 5. The five tabs — content & interactions

Full content payload is in **Appendix A** (English source of truth; you write the Spanish). Summaries + interactions per tab:

### Tab 1 — The Story
What actually happened, as a narrative: Argentina's run (Cape Verde, Egypt, Switzerland — all decided in tight/extra-time moments), the disputed calls, Egypt coach Hossam Hassan's favoritism allegation and FIFA's rejection of it, the João Pinheiro appointment controversy, and — separately — the reported FBI probe into AFA finances. End with the key insight: **these are two independent threads** (sporting perception vs. financial investigation).
**Interaction:** a horizontal/vertical **timeline** of events (scroll- or tap-driven), each node expandable with detail + source link.

### Tab 2 — Could It Be Done? (Feasibility 3/10)
How referee/VAR appointments actually work at WC2026 (Collina's Referees Committee, "Team One" pool of 52 referees / 88 assistants / 30 VMOs, appointments ~3 days out, no officiating your own country); where discretion concentrates; historical precedents (Calciopoli's assignment mechanism, FIFA-Gate 2015, South Korea 2002, Argentina–Peru 1978, Lamptey & Perumal betting fixes); why 2026 tech (body cams, semi-automated offside, connected ball) raises detection risk.
**Interaction — Conspiracy Simulator:** sliders for *number of people who must stay silent* (e.g., 5–500) and *per-person annual leak/exposure probability* (e.g., 0.01%–5%), plus a time horizon slider. Live plot of P(secret survives) over time, modeled on Grimes (2016, PLOS ONE) conspiracy-viability math — use the exponential-failure form P(survive t) ≈ e^(−N·p·t) as the baseline (verify against the paper's corrected version from Phase 0) and show the formula in an expandable "the math" note. Preset buttons: "Calciopoli-scale", "single bribed ref", "institutional WC fix". Takeaway line updates live: big fixes leak.

### Tab 3 — The Probabilities
The four hypotheses, each as a card with: speculative range, top-3 evidence for, top-3 against, and "what would change my mind":
- **H1** Deliberate FIFA-level officiating favoritism — **2–8%**
- **H2** AFA financial corruption — **70–90%** that a genuine preliminary federal inquiry exists; **45–65%** that chargeable US conduct is eventually established
- **H3** Soft/structural bias (star-player/status bias, no conspiracy) — **35–55%** as a material contributor
- **H4** No bias; variance + social-media perception cascade — **30–50%** as primary explanation
Note H3+H4 combined = most likely explanation of the *perception*; H1 ≠ H2.
**Interaction — Bayesian Explorer:** per hypothesis, user sets a prior slider and 2–3 evidence-strength sliders (likelihood ratios with plain-language labels like "penalty outlier: how surprising?"). Compute in log-odds: posterior odds = prior odds × ∏LR, converted back to probability; clamp display to 0.1%–99.9%. State the simplifying assumption (evidence treated as independent — it isn't fully, which is why this is an intuition pump, not a calculator of truth). Posterior updates live and is drawn against the author's published range band; a reset button restores defaults that reproduce the published ranges. Include a short "how Bayes works" expandable for the curious.

### Tab 4 — Who Wins?
Bracket state as of July 12, 2026: QF results — Argentina 3–1 Switzerland (AET), England 2–1 Norway (AET), France 2–0 Morocco, Spain 2–1 Belgium. Semifinals: **France vs Spain (Jul 14, Dallas)** and **England vs Argentina (Jul 15, Atlanta)**; final Jul 19, NY/NJ. Clean model synthesis — triangulate **three independent sources**: Opta, the Silver Bulletin model (Phase 0), and bookmaker odds (Opta ≈ tight four-way: ENG ~21.9%, ARG ~20.6%, ARG 49.1% to beat ENG; bookmakers: France favorite ~+140/+155; all figures to be refreshed in Phase 0): author's synthesized title ranges — **France 33–40%, Spain 20–24%, England 18–23%, Argentina 17–22%** (recompute if refreshed inputs shift materially). Note Argentina's three straight 120-minute matches (fatigue) as the concrete non-conspiratorial fade factor. Close the tab in the author's voice: the models say France, the heart says Argentina — and both can coexist honestly.
**Interaction — Monte Carlo Bracket Simulator:** reads the bracket state and team strengths from the `src/data/` files (Phase 0-refreshed), runs 10,000 simulated tournaments from the current state. Pairwise match probabilities from a simple Elo-style logistic on team-strength sliders (seeded to the clean model; document the mapping in a "the math" expandable). One clearly-labeled **speculative "bias nudge"** slider (0 to strong-H1) implemented as additive percentage points to Argentina's per-match win probability, capped and shown numerically. Use a seedable PRNG so results are reproducible; animate the histogram/bars of title odds; show clean vs. adjusted side by side; verify at nudge=0 the output converges near the seeded probabilities. Label the whole thing speculative; note results in Appendix A §"controversy adjustment" (soft bias ≈ +2–5pp; strong H1 could reach ~30–45% — presented as a conditional what-if, not a forecast).

### Tab 5 — Sources
Grouped by reliability tier (primary/legal → quality journalism → data/models → academic → context), each with a one-line "why it matters." Full list in Appendix B. Include a "dig deeper" note inviting corrections via LinkedIn.

## 6. Design brief

- Act as a design lead delivering a distinctive identity — **not** a templated AI look. Explicitly avoid the three generic defaults: cream-background + serif + terracotta accent; near-black + single acid-green accent; broadsheet hairline-rules newspaper pastiche.
- **Ground it in the subject:** Argentine football *as celebration*. Draw from albiceleste sky-blue/white, ticker-tape (papelitos) raining from the stands, golden confetti, sunlit stadium energy, Buenos Aires street-mural exuberance — pick ONE coherent direction and commit. The mood is festive and luminous with a clear head; explicitly avoid noir, dark-conspiracy, or "investigation board" aesthetics — the serious sections earn trust through clarity and typography, not gloom. Define a small token system (4–6 named colors, display + body + data typefaces, spacing scale) and use it everywhere.
- **Signature element (the one memorable thing):** the three.js hero — an abstract, slowly rotating object evocative of a football/trophy (original geometry; **no FIFA/adidas trademarks, team crests, or player likenesses**) that reacts subtly to pointer/scroll, with a ticker-tape particle moment on load. Everything else stays quiet and disciplined.
- Micro-interactions elsewhere: tab-transition flourish, hover states, count-up numbers on probability cards — restrained.
- **Tooltips:** dotted-underline terms (VAR, AFA, DOJ, EDNY, IFAB, CAS, xG, VMO, Calciopoli, FIFA-Gate, overround, Monte Carlo, Bayesian prior/posterior…) showing a 1–2 sentence definition + optional "learn more" link. Must work on touch: tap opens, tap-away closes; keyboard-focusable; ARIA-correct.
- **Quality floor:** responsive to 360px; visible keyboard focus; `prefers-reduced-motion` respected (three.js falls back to a static SVG rendition; sims animate instantly instead of tweening); semantic HTML; good Lighthouse scores (perf ≥ 90 mobile); lazy-load three.js and sim islands; OG/meta tags per locale for nice social sharing cards; correct `lang` attributes (`en`, `es-AR`) and reciprocal `hreflang` alternate links; locale-aware number/date formatting via `Intl` (es-AR uses comma decimals — sim outputs too).

## 7. Analytics

Two privacy-friendly, cookie-free options — implement the placeholder for both, author activates one. **Recommended given Cloudflare Pages hosting: Cloudflare Web Analytics** (zero extra accounts — enabled with one toggle in the Pages project, or via its beacon `<script>` snippet; leave a clearly-marked comment block for the token). Alternative: **GoatCounter** — comment block `<!-- ANALYTICS: replace 'CODE' with your GoatCounter site code after signing up at goatcounter.com -->`. Do not add Google Analytics. Note in README that neither requires a consent banner.

## 8. Process & acceptance checklist

1. Run Phase 0 verification; refresh `src/data/` and Appendix-A-derived copy accordingly.
2. Brainstorm the design token system + signature; self-critique against the "generic AI look" list; then build.
3. Scaffold with `pnpm create astro@latest`, strict TS, minimal deps (toolchain via mise/Homebrew per §2).
4. Define the content-collection schemas (§3) first, load Appendix A into them, then build layout + i18n, then tabs in order, then sims, then hero, then the video render target.
5. Verify: `pnpm build` clean; preview under both host configs; test 360px; test reduced-motion; click every internal link in both locales; sim math sanity checks (Monte Carlo converges near seeded probabilities at nudge=0; Bayes explorer reproduces published ranges at default sliders; conspiracy sim matches the closed-form curve); `pnpm render:video` produces valid EN and ES MP4s; single-source check — change one content field, confirm site (both locales) and video reflect it with no other edits.
6. Ship: README (what it is, stack, `pnpm dev/build`, deploy notes, 3-line data-update workflow, video render instructions, ~5 lines on adding a phase-2 output target, known limitations/changelog), MIT license, deploy workflow, and either push via `gh` or print exact commands. **Commit in logical increments with clear messages** (scaffold → content schema → i18n → each tab → sims → hero → video → deploy) — this repo is resume material and the history will be read.

Checklist: [ ] Phase 0 verification done & corrections logged [ ] EN+ES complete & natural [ ] 5 tabs routed & deep-linkable [ ] hreflang + es-AR formatting [ ] volatile content in `src/data/` with visible lastUpdated [ ] ALL prose in typed content collections — zero hard-coded copy in components; one-place edits propagate everywhere [ ] video target renders EN+ES MP4s from the content layer [ ] schema supports phase-2 targets (slides, LinkedIn/Twitter/Mastodon/Discord/Instagram) & README documents how to add one [ ] 3 sims working on mobile [ ] three.js hero + reduced-motion fallback [ ] tooltips touch/keyboard accessible [ ] every probability labeled speculative [ ] H1≠H2 distinction prominent [ ] defamation hygiene pass on named individuals [ ] sources page complete with canonical links [ ] LinkedIn byline [ ] analytics placeholder (CF Web Analytics or GoatCounter) [ ] Cloudflare Pages config (root path) works [ ] GH Pages fallback workflow + base-path-agnostic links verified [ ] clean commit history [ ] Lighthouse mobile ≥ 90.

---

## Appendix A — Content payload (English source of truth; translate to Spanish)

> Use this as the factual substance. You may tighten prose but do not alter facts, ranges, or hedging language. Where a claim is an allegation, keep it an allegation.

### The story
- Argentina, defending champions, reached the 2026 semifinals via three tense knockout wins: Cape Verde (group/knockout controversy over a blood-injury restart — correctly applied under IFAB's bleeding rule, but a clip drew ~23M views), Egypt in the Round of 16 (Jul 7, Atlanta — a disputed VAR-disallowed Egypt goal for a build-up foul by Marwan Attia on Lisandro Martínez; Egypt coach Hossam Hassan alleged favoritism afterward, including an unsubstantiated claim that "they want Messi to exist in the tournament"; FIFA refereeing chief Pierluigi Collina publicly rejected the bias claims: unfounded allegations have no place in the sport), and Switzerland 3–1 AET in the quarterfinal (Jul 11, Kansas City — Mac Allister 10', Álvarez 112', Lautaro Martínez 120+1'; Ndoye 67'; Breel Embolo sent off 72' for a second yellow, simulation, after a VAR-recommended review; replays showed a clear dive; Granit Xhaka said the red "killed the game").
- Referee controversy: FIFA appointed João Pinheiro for the quarterfinal despite fresh debate over his Bayern–PSG Champions League semifinal handball reversal. Separately, an all-Argentine officiating crew (Facundo Tello + four compatriots) for France–Morocco was an optics own-goal even though it involved a *rival's* match.
- The financial thread: per La Nación (investigative reporters Hugo Alconada Mon and Francisco Olivera), corroborated by the Miami Herald citing two law-enforcement sources, the FBI and federal prosecutors are conducting a preliminary inquiry into how AFA moved $300M+ through US banks and companies — including TourProdEnter LLC (Florida), which allegedly handled at least $260M of AFA revenue with roughly $57M unexplained. Named prosecutors reported on the matter include Michael Berger, Patrick Gushue, and Christopher Ting. AFA president Claudio Tapia separately faces Argentine tax/social-security charges (~$12.7M) and alleges political persecution amid his feud with President Milei; December 2025 raids hit AFA and 17 clubs. The FBI declined to comment; **no US charges have been filed**. Key date: after the final (Jul 19), Tapia must return to Argentina under his travel bond; Argentine reporting suggests US authorities may move only after the tournament.
- Argentina's statistical outlier: 8 penalties awarded across the 2022+2026 World Cups — the most of any nation over a 12-match span in tournament history (Messi has missed two of the 2026 ones, vs Austria and Egypt).
- Core insight: the officiating complaints and the FBI probe are **independent threads** with no documented evidentiary bridge. The probe is about money laundering jurisdiction (US banks), the classic FIFA-Gate theory; it is not about match outcomes.

### Feasibility (rating: LOW-to-MODERATE, 3/10)
- Appointments: FIFA Referees Committee chaired by Pierluigi Collina (Director of Refereeing: Massimo Busacca) appoints match-by-match ~3 days out from the "Team One" pool: 52 referees, 88 assistant referees, 30 video match officials from all six confederations (FIFA release, April 9, 2026). Officials never handle their own nation's matches; no predetermined knockout list — form-based. Discretion concentrates in this small group (the Calciopoli-style vulnerability) and in VAR booths (review-trigger discretion; the 2026 protocol newly lets VAR recommend overturning an erroneous second-yellow red — the exact mechanism used on Embolo — and review attacking fouls before restarts).
- Precedents: **Calciopoli 2006** (assignment manipulation exposed by ~150k wiretapped calls; Juventus stripped/relegated — domestic league, compromised designators). **FIFA-Gate 2015** (DOJ/FBI/IRS 47-count indictment, $150M+ bribes through US banks; AFA's Julio Grondona was "Co-Conspirator #1"; banker Jorge Arzuaga pleaded guilty to moving $25M+ for his benefit). **South Korea 2002** (Moreno/Al-Ghandour eliminations of Italy/Spain — widely suspected, never proven). **Argentina 6–0 Peru 1978** (junta-era grain shipments, ~$50M unfrozen assets, Videla/Kissinger dressing-room visit — enduring circumstantial suspicion, no proven quid pro quo). **Proven WC-level fixes** (Lamptey 2016 qualifier, CAS-upheld lifetime ban; Perumal/Chaibou 2010 warm-up friendlies) were **betting-syndicate** jobs — never an organizer favoring a team, never a finals match.
- Base-rate anchor: **no World Cup finals match has ever been legally proven fixed or referee-manipulated by an organizing body.**
- To tilt a match undetected today you'd need a compromised appointer + compliant referee and/or VMO + silence across a multi-person booth, against body cams, comms records, semi-automated offside, and connected-ball telemetry. Selection-based *nudging* (assigning a "big-team-friendly" ref) hides inside normal discretion and is far more plausible than instructed calls — hence 3/10, not 0/10.

### The four hypotheses (all ranges speculative)
- **H1 — Deliberate FIFA-level favoritism: 2–8%.** For: penalty outlier; Tello-crew optics; commercial value of a Messi farewell + Pinheiro baggage. Against: zero proven finals precedent; each call has a defensible rule-based explanation; extreme detection risk; the all-Argentine crew on a rival's match is the *opposite* of what favoritism would design. Would move it: leaked comms, VMO/appointer whistleblower, assignment-anomaly study.
- **H2 — AFA financial corruption: 70–90%** a genuine preliminary inquiry exists; **45–65%** chargeable US conduct is eventually established. For: La Nación + Miami Herald sourcing; TourProdEnter specifics + named prosecutors (Berger convicted Ecuador's Carlos Pólit); Tapia's Argentine charges + Dec 2025 raids; perfect FIFA-Gate jurisdictional fit. Against: no charges; FBI no-comment; Tapia's political-persecution defense; anonymous sourcing. Reliability note: La Nación is a newspaper of record; Alconada Mon has a strong AFA/FIFA investigative track record — the strongest-sourced thread in the whole story. Would move it: grand jury subpoena, indictment, cooperating witness (Juan Pablo Beacon or Guillermo Tofoni), or AFA documentary rebuttal.
- **H3 — Soft/structural bias: 35–55%** as a material contributor. For: peer-reviewed status-bias literature — Garicano, Palacios-Huerta & Prendergast (*Rev. of Economics and Statistics*, 2005; 750 La Liga matches: ~2x injury time when home team trails by one vs leads by one); Argentina fits the champion-with-megastar deference profile (cf. Erikstad & Johansen); VAR-era penalty inflation. Against: some null results (e.g., Morgulev et al., basketball); key calls defensible; rival-crew assignment inconsistent with shading. Would move it: xG-adjusted study of Argentina's decisions vs peers.
- **H4 — No bias; variance + perception cascade: 30–50%** as primary explanation. For: three straight tight knockouts breed "rub of the green" narratives; correct rule explanations existed for the viral moments (23M-view Cape Verde clip); Collina's on-record rejection ("Nobody can question the integrity of the FIFA World Cup match officials"). Against: the penalty outlier persists; complaints came from many independent pundits, not only losers. Would move it: pattern regressing under semifinal/final scrutiny.
- H3+H4 combined = most likely explanation of the officiating *perception*. H2 true would NOT imply H1.

### Who wins (as of July 12, 2026)
- Semifinalists & condition: **France** (beat Morocco 2–0; 16–2 aggregate; Mbappé 8 goals, Dembélé 5; deepest squad; minor precautionary Mbappé knock). **Spain** (beat Belgium 2–1, late Merino; hadn't conceded before that; Unai Simón clean-sheet-minutes record; Lamine Yamal). **England** (beat Norway 2–1 AET; Bellingham 4 knockout goals; Rice illness scare, expected fit; cards reset after QFs — no suspensions). **Argentina** (3 straight 120-minute matches — real fatigue; Messi 8 goals; squad largely fit).
- Clean model (speculative synthesis): Opta ≈ England 21.9%, Argentina 20.6% (least fancied of four), France standing favorite, Spain between; Opta gives Argentina 49.1% to beat England. Bookmakers: France ~+140/+155, Spain ~+330, England ~+310/+350, Argentina ~+360/+400 (implied %s include overround). **Author's synthesized title ranges: France 33–40%, Spain 20–24%, England 18–23%, Argentina 17–22%.**
- Controversy adjustment (clearly hypothetical): if only H3 (soft bias) → Argentina +2–5pp (low-to-mid 20s). If strong H1 held (unproven what-if) → could reach ~30–45%, because manipulation would manifest exactly in tight knockout margins. Author regards the high end as unlikely given base rates and detectability.

### Caveats block (render prominently)
All probabilities subjective/speculative • FBI probe reported, not officially confirmed; no charges; AFA denies wrongdoing • controversy ≠ corruption; every flagged incident has a rule-based explanation on record • losing-side complaints are motivated • facts move fast (semifinals Jul 14–15 may change everything) • strongest single reason to keep H1 low: no finals match ever proven fixed.

### The 3 biggest open questions
1. Does the DOJ move from preliminary inquiry to indictment or a cooperating witness (Beacon/Tofoni)? Watch the post–Jul 19 window.
2. Does any hard artifact (leaked comms, whistleblower, assignment-anomaly study) ever link appointments/VAR to outcomes?
3. Does the officiating pattern regress under maximum semifinal/final scrutiny?

## Appendix B — Sources (verify URLs render; if any is dead, cite by name/description and link a search)

**Tier 1 — Primary / legal / official**
- FIFA media release, "Match officials appointed for FIFA World Cup 2026" (Apr 9, 2026): https://inside.fifa.com/refereeing/media-releases/fifa-world-cup-2026-match-referees-appointed
- FIFA.com official match report, Argentina v Switzerland QF: https://www.fifa.com/en/tournaments/mens/worldcup/canadamexicousa2026/articles/argentina-switzerland-match-report-highlights
- FIFA statement rejecting the Egypt bias allegations (Collina) — locate the official release or the wire report carrying it.
- IFAB Laws of the Game (blood-injury provision) + FIFA/IFAB documentation of the 2026 VAR protocol changes (second-yellow review) — needed to source the Cape Verde and Embolo explanations.
- US DOJ press release on the 2015 FIFA indictments (EDNY, May 27, 2015) and the Arzuaga guilty-plea release — locate canonical justice.gov URLs.
- CAS decision upholding Joseph Lamptey's lifetime ban (2017) — cite CAS media release.

**Tier 2 — Quality journalism on the current story**
- La Nación (Hugo Alconada Mon & Francisco Olivera): original FBI/AFA reporting — link their AFA investigation coverage.
- Miami Herald corroboration (two law-enforcement sources).
- Argentine coverage of Tapia's domestic tax/social-security charges and the December 2025 AFA/club raids (La Nación, Clarín, or Infobae) — currently uncited in the payload; find and link.
- Yahoo/The Comeback summary of the FBI probe: https://sports.yahoo.com/articles/argentina-faces-fbi-investigation-amid-044632444.html
- CBS Sports explainer on the probe: https://www.cbssports.com/soccer/news/fbi-investigates-argentina-football-association-alleged-money-laundering-in-u-s-2026/
- NBC DFW on the Pinheiro appointment & officiating scrutiny: https://www.nbcdfw.com/world-cup/referee-with-controversial-history-on-argentina-switzerland-2026-fifa-world-cup-match/4047663/
- Yahoo Sports, "FIFA's Argentina Problem": https://sports.yahoo.com/articles/fifa-argentina-problem-why-fans-203519501.html
- ESPN match report ARG 3–1 SUI: https://www.espn.com/soccer/match/_/gameId/760513/switzerland-argentina
- Al Jazeera live blog ARG–SUI: https://www.aljazeera.com/sports/liveblog/2026/7/11/argentina-vs-switzerland-live-fifa-world-cup-2026

**Tier 3 — Data & models**
- Opta / The Analyst World Cup 2026 predictions (link current page).
- Nate Silver, Silver Bulletin — World Cup 2026 odds & predictions: https://www.natesilver.net/p/world-cup-2026-odds-predictions (second independent model; one-line "why it matters" should note the FiveThirtyEight pedigree per your Phase 0 reputation check).
- Aggregated bookmaker outright odds (link an odds comparison page, e.g., Oddschecker).

**Tier 4 — Academic**
- Garicano, Palacios-Huerta & Prendergast, "Favoritism Under Social Pressure," *Review of Economics and Statistics* 87(2), 2005.
- Grimes, D.R., "On the Viability of Conspiratorial Beliefs," *PLOS ONE* 11(1), 2016 (basis of the Conspiracy Simulator math).
- Erikstad & Johansen on referee favoritism toward successful teams; Morgulev et al. for null-result balance.

**Tier 5 — Historical context**
- Wikipedia, "Argentina v Peru (1978 FIFA World Cup)": https://en.wikipedia.org/wiki/Argentina_v_Peru_(1978_FIFA_World_Cup)
- Calciopoli, FIFA-Gate, 2002 South Korea officiating — cite encyclopedic/retrospective coverage.

---

*End of build prompt. Build it beautiful, keep it honest. Vamos. 🇦🇷*

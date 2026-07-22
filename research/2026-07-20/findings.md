# Verification findings — Run 9 (2026-07-20)

Additive re-run **the day after the final**. This is the pass that resolves the whole
project: the tournament is over, and every open item from Run 8 that hinged on the
result can now be graded. This is a new dated folder; Run 8 (the match-in-progress
snapshot) is preserved in `research/2026-07-19/`, Runs 3–5 in `research/2026-07-15/`,
Run 6 in `research/2026-07-16/`, Run 7 in `research/2026-07-17/`, and all of it in git.
Everything from Runs 1–8 carries forward; nothing was removed and no hedge was softened.

## The result

**Spain 1–0 Argentina, after extra time, at MetLife (Jul 19). Spain are the 2026
world champions — their second title, after 2010.**

- **Ferran Torres 106′** (assisted by a **Nico Williams** header), six minutes into
  extra time. Torres was named **player of the match**.
- **Enzo Fernández was sent off on 90+3′** — booked earlier for dissent, then a second
  yellow for a reckless challenge on **Pau Cubarsí**. ESPN's officiating/VAR review
  judged the red **deserved**. Argentina played the entire extra time **a man down**.
- **Argentina did not register a shot on target in regulation.** Spain dominated
  throughout; the contest was one-way.
- **Attendance: 80,663** at MetLife. Referee **Slavko Vinčić** (Slovenia), VAR **Bastian
  Dankert** (Germany), as appointed Jul 17.
- Sources: ESPN match report (`espn-final-report`, gameId 760517), NPR
  (`npr-spain-champion`), Wikipedia "2026 FIFA World Cup final", FIFA match centre.

## Why this run matters: the favoritism thesis got its cleanest possible test — and failed

The entire H1/H3/H4 argument was, in the end, a bet about what the **most-scrutinized
match of the tournament** would show. It showed the opposite of favoritism toward
Argentina:

- The **decisive disciplinary call went against Argentina** (Enzo's second yellow),
  and **VAR upheld it**.
- The **only officiating errors flagged went against Spain** — a **Nico Williams goal
  disallowed** for a Merino foul on Otamendi (ex-PGMOL chief **Keith Hackett** argued
  VAR should have restored it) and a **Torres offside**. So under maximum scrutiny there
  was **not one call in Argentina's favor**.
- And **Argentina lost.** A plan to steer a Messi-farewell title, if it existed, ended
  1–0 the other way.

NBC framed the tournament exactly this way: "A World Cup known for officiating
controversy ends with Argentina seeing red" (`nbc-officiating-red`). This is the
strongest single data point the project ever got, and it lands on the **variance +
perception** side.

- **H1 (deliberate favoritism) narrowed: 2–8% → 2–6%.** The tournament is fully
  observed; the definitive datapoint disconfirms. `rangeHigh` lowered, a strong
  againstPoint added, source `nbc-officiating-red` attached. Not zeroed — a single
  match doesn't retroactively prove the earlier rounds were clean, and the penalty
  outlier still exists — but the ceiling comes down.
- **H4 (variance + perception) strengthened: 30–50% → 35–55%.** Its changeMind was
  literally "if the pattern regresses under semifinal and final scrutiny, that confirms
  it." It regressed. `rangeLow` nudged up, a "regression test passed" forPoint added,
  sources `nbc-officiating-red` + `yahoo-final-brawl` attached.
- **H3 (soft/structural bias) held at 35–55%** — the final adds nothing to the
  soft-bias literature either way.

## Grading the forecasts

- **The model's favorite won.** Opta's match-day sim had Spain 59.5%, the market ~59%;
  Spain won. After two semifinals where **both** slim favorites lost (France 57.7% to
  reach the final, England 52.53%), the final favorite finally held. **Hit.**
- **The extra-time tail hit.** Opta put ~29% on extra time and Argentina's 40.5% title
  number sat well above its 26% regulation-win number precisely because the knockout
  path ran through ET; Kalshi's regulation-only book had a 32% draw. **The final went to
  extra time.** The tail the split flagged is exactly where the game was decided. **Hit.**
- **The "no pro-Argentina officiating" reading held; the literal "no major controversy"
  call did not.** Run 6's scorecard had "the final passes without a major officiating
  controversy" as pending. Verdict is **partial**: there *was* major controversy — a
  red card that shaped the game, two disallowed Spain goals, ex-referees blasting the
  crew, and a post-match brawl — but **none of it favored Argentina**, so the bias
  thesis (the thing the claim was really testing) failed cleanly.
- **Run 6's Faghani miss** (tipped a confederation-neutral, non-European referee; FIFA
  picked Vinčić) stays graded a **miss** — carried, now closed.
- `models.ts` header updated to record the result and mark the two forecasts that
  landed; the pre-match probability numbers are deliberately **not** overwritten to 1/0
  (the site grades forecasts, so the record stays).

## Individual awards (all but one to Spain)

- **Golden Ball: Rodri** (Spain), ahead of **Messi (Silver)** and **Mbappé (Bronze)**.
- **Golden Glove: Unai Simón** (Spain) — one goal conceded in eight matches.
- **Best Young Player: Pau Cubarsí** (Spain), 19 — **not** Lamine Yamal.
- **Golden Boot: Kylian Mbappé** (France), 10 goals to **Messi's 8** — Mbappé's second
  straight, and the first player since Gerd Müller (1970) to score more than eight at a
  single men's World Cup.
- Source: `athlon-final-awards` (Athlon / Al Jazeera "Spain sweeps World Cup awards").

## Records and the Messi coda

- **Spain: first nation to hold the men's and women's World Cups at the same time**
  (women's, 2023).
- **First World Cup winner ever to concede only one goal across a tournament**
  (eight matches), anchored by **Cubarsí + Laporte**; part of a **37-match unbeaten run**
  (last defeat March 2024). Rodri captained.
- **Messi, 39**, left the pitch in tears with a runners-up medal in what is likely his
  last World Cup match — the **second man after Cafu to appear in three finals**, and
  the **first to start all three**. (This reconciles Run 8's "first to start three
  finals" with the "second to appear" framing: both are true — Cafu came on as a
  substitute in the 1994 final.)

## The aftermath: a brawl and a second FIFA case

- **After the whistle, a confrontation broke out.** **Nahuel Molina** appeared to swing
  at **Rodri**; **Leandro Paredes** grabbed **Eric García** by the throat and wrestled
  **Gavi** to the ground and was shown a **straight red**. Argentina's players **declined
  to join Spain's trophy lift**, turning away.
- **FIFA is reported to be investigating Argentina** over the incident
  (`yahoo-final-brawl`). This **stacks a second FIFA disciplinary matter on top of the
  still-open Malvinas-banner case**, and like the banner it is a **perception item with
  zero refereeing in it** — the flashpoint was players and staff, not a call. Recorded
  in both directions: it can be told as genuine misconduct or as one more instance of
  anything Argentina does becoming the tournament's headline. Added timeline node
  `final-brawl` (order 20).

## Still open / unresolved (carried to any future pass)

- **The Malvinas-banner ruling has still not been issued.** As of Jul 20, FIFA had
  announced only that its disciplinary bodies were assessing it; no warning, fine, or
  dismissal yet. The 2014 CHF 30,000 precedent remains the benchmark. **Still pending.**
- **The post-final brawl case is brand new** — no charge, sanction, or hearing date
  reported yet.
- **Money thread — no legal movement.** Re-checked Jul 20: **no US charges** against the
  AFA, Tapia or Toviggino; the reported FBI/DOJ inquiry is **still preliminary**, with
  investigators gathering testimony and financial records (TourProdEnter LLC, five named
  US banks, ~$90M flagged, $260M handled). **FBI still declines comment.** The H2
  changeMind trigger (subpoena / indictment / cooperating witness) is **still not met.**
  **H2 bands held: 70–90% / 45–65%.** The **domestic hearing remains set for Aug 12**,
  and **Tapia's travel-bond return** is still to come.
- **Silver per-team ("PELE") numbers still paywalled** (sixth consecutive run).
- **Official attendance** now available (80,663), closing that Run 8 open item.

## Hypothesis bands — summary

- **H1 2–6%** (was 2–8%) — narrowed; strong againstPoint added (the final's cleanest
  test disconfirmed it).
- **H2 70–90% / 45–65%** — held; quiet legal pass, changeMind unmet.
- **H3 35–55%** — held.
- **H4 30–50% → 35–55%** — strengthened; regression-test forPoint added.

## Run-number reconciliation

`updates.json` now tops at **Log run 6** (`run-6-2026-07-19`), so Run 8's recommendation
was merged. This research pass is **Run 9**; the pending recommendation is **Log run 7**
(`run-7-2026-07-20`). The research-run vs Log-run offset (research 9 ↔ Log 7) is stable.

## Data / content changes this run

- `meta.lastUpdated` 2026-07-19 → 2026-07-20.
- `bracket.ts`: **FINAL.result filled in** — Spain 1–0 Argentina, winner ESP, bilingual
  note (Torres 106′, Enzo red 90+3′, no ARG shot on target in regulation, Spain's 2nd
  title / one-goal record, Paredes post-match red). `bracketStage()` now returns
  `champion`; `argentinaEliminated()` returns true. Header comment updated to the final
  state.
- `models.ts`: header gains a **RESULT-IN grading note** (favorite won, extra-time tail
  hit); pre-match probabilities intentionally left unchanged as the graded forecast.
- `bayes.ts`: unchanged (config; the island back-solves priors from the published bands,
  so the H1/H4 band moves flow through automatically).
- `timeline.json`: added `final-result` (order 19, sporting, Jul 19) and `final-brawl`
  (order 20, sporting, Jul 19).
- `hypotheses.json`: H1 `rangeHigh` 0.08 → 0.06 + againstPoint + source
  `nbc-officiating-red`; H4 `rangeLow` 0.30 → 0.35 + forPoint + sources
  `nbc-officiating-red`, `yahoo-final-brawl`.
- `sources.json`: added `espn-final-report` (105), `npr-spain-champion` (106),
  `athlon-final-awards` (107), `nbc-officiating-red` (108), `yahoo-final-brawl` (109),
  all tier 2.
- `sections.json`: `whowins-intro` reconciled to the result in both locales (forecast
  kept, resolution appended: Spain won 1–0 AET, favorite + extra-time tail landed).
- `precedents.json`: **not** edited (no new fixing precedent; the final adds no
  match-fixing case).
- `glossary.json`: **not** edited.
- `updates.json`: **not** edited (Log handled via `.update-pending-log.json`).
- `.update-pending-log.json` written: recommend **true**, Log run 7 (`run-7-2026-07-20`).

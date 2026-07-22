# Verification findings — Run 8 (2026-07-19)

Additive re-run **on the day of the final, with the match in progress**. Kickoff was
3 p.m. ET at MetLife; at the time this pass was written the score was **0–0 around the
35th minute**, so **no result is recorded and `bracket.ts` is untouched**. This is a
new dated folder; Runs 3–5 are preserved in `research/2026-07-15/findings.md`, Run 6 in
`research/2026-07-16/`, Run 7 in `research/2026-07-17/`, and all of it in git.
Everything from Runs 1–7 carries forward; nothing was removed and no hedge was softened.

Three things moved this pass. **Opta re-ran the model on match day and shifted toward
Spain.** **A political story the earlier runs had missed entirely surfaced — the
Malvinas banner and FIFA's disciplinary review of it.** And **the final-day picture
around the match filled in**: confirmed elevens, record prediction-market volume,
absurd ticket prices, and the AFA president watching from the main box.

## The mover in the numbers: Opta's match-day re-run

- Opta published its **match-day final preview (Jul 19)**: **25,000 pre-match sims give
  Spain 59.5% v Argentina 40.5%**. That is a **~3.4-point shift toward Spain** in three
  days, with **no football played in between** — this is a model refresh on final team
  news and ratings, not a reaction to a result.
- The same preview splits the **90 minutes: Spain 45.0% / draw 29.0% / Argentina
  26.0%**. Worth surfacing in prose because it is the clearest available statement of
  something the trophy column hides: **Opta puts ~29% on extra time**, and Argentina's
  title number (40.5%) is well above its regulation-win number (26%) precisely because
  the knockout path runs through ET and penalties.
- `models.ts` OPTA updated: `asOf` → 2026-07-19, `url` → the final preview article,
  teams **ESP .595 / ARG .405**, new `final90` field, and `publishedJul16` added to keep
  the superseded explicit pair (.561/.439) for provenance alongside `publishedPostSF1`.
  The stale file-header claim that the Opta column is "DERIVED" was also corrected — it
  has been a printed figure since Run 7 and the header never caught up.

## Market at kickoff — firmed a shade, then sat still

- **Kalshi ~59% Spain / ~41.6% Argentina; Polymarket 59¢ / 40¢.** A touch more Spain
  than Run 7's ~58, then flat.
- **Kalshi's regulation-time-only book: Spain 43% / draw 32% / Argentina 28%** — a
  slightly fatter draw than Opta's 29%, i.e. the market prices a bit more extra time
  than the model does. Kalshi also has **Argentina to score at least one goal at 66%**
  and **over 2.5 goals at 43%**.
- The **named trophy moneylines (Caesars −170, bet365 −175, theScore −160) have not been
  re-quoted since Jul 15**. Carried, but now explicitly flagged in the code comment as
  *opening prices*, not live ones — four days without a re-quote is long enough that
  restating them as current would be misleading.
- **Scale, and it is genuinely a record.** The Kalshi Spain–Argentina contract passed
  **$1.27B**, the largest single prediction market ever run; Polymarket's World Cup
  winner market has cleared **$4B cumulative since July 2025**, overtaking its own 2024
  US presidential market; total World Cup trading across venues **exceeded $25B**
  (vs ~$2B for an NBA Finals, ~$1B for a Super Bowl). Recorded with the caveat that
  **volume is liquidity, not accuracy** — these same markets favored both losing
  semifinalists.

## Anchor convergence — the honest caveat this pass

The anchors have stopped straddling the author band and now **bunch at its Spain edge**:

| anchor | ESP | ARG |
| --- | --- | --- |
| Opta (match-day, 25k sims) | .595 | .405 |
| Kalshi | .590 | .416 |
| Polymarket | .590 | .400 |
| Books, overround-normalized | ~.59 | ~.41 |
| Site's own Elo bracket, nudge=0 | ~.56 | ~.44 |

Four independent reads within a point of each other, all sitting **at or just inside the
top of the published Spain range (.55–.60)** rather than around its middle. Only the
site's own Elo bracket still sits low in the band.

**AUTHOR_RANGES held at ESP .55–.60 / ARG .40–.45**, and the reasoning is written into
the code comment rather than left implicit: every anchor is still inside the band, and
nudging a speculative range to chase the market **on match day**, hours before the
result, is exactly the hindsight-shaped edit this project exists to avoid. The drift is
disclosed instead of absorbed.

## The thread earlier runs missed: the Malvinas banner

This is new material, not an update — Runs 6 and 7 covered the England semifinal without
catching it.

- After beating England 2–1, **several Argentina players unfurled a banner reading "Las
  Malvinas son Argentinas."** A day later **FIFA confirmed its independent disciplinary
  bodies were reviewing it** under **Article 34.3** of the tournament regulations, which
  bars political messages or slogans before, during or after a match.
- **Direct precedent, and it bounds the outcome:** in **2014 the AFA was fined CHF
  30,000 (~$37,000)** after its players displayed an **identical banner** before a
  friendly against Slovenia. So the realistic range runs **warning → fine**, nothing that
  touches the final. Recorded that way rather than left open-ended.
- **UK reaction:** Business Secretary **Peter Kyle** called the display "entirely
  inappropriate" and said politics needs to be separate from football.
- **White House reaction:** **Andrew Giuliani**, executive director of the White House's
  World Cup task force, **defended the players' right to display it on First Amendment
  grounds** and rejected calls to punish them. Commentators subsequently reported Trump
  was "reexamining" his position on the islands. Reported as reported — the
  "reexamining" line is commentator-sourced and is hedged accordingly.
- **Editorial read, two separable points.** (1) It is the clearest case yet of how fast
  anything Argentina does at this tournament **stops being football** — a celebration
  flag became a British-government complaint and a White House statement inside 48
  hours, with **no officiating involved at all**. Added as an **H4 forPoint**, because it
  is perception cascade with the refereeing variable removed entirely. (2) It cuts
  **against H1**: FIFA **opened a disciplinary case against a finalist three days before
  the final**, which is not the behavior of a body shielding them. Added as an **H1
  againstPoint**.
- **Bands held: H1 2–8%, H4 30–50%.** New evidence on both sides of the same event; it
  sharpens the argument rather than moving the numbers.

## Final-day picture

- **Confirmed elevens (this closes the Run 6/7 fitness watch).** Spain 4-2-3-1, **no
  changes** from the France semifinal: Unai Simón; Porro, Cubarsí, Laporte, Cucurella;
  Rodri, Fabián Ruiz, Olmo; Yamal, Oyarzabal, Baena. **Both Lamine Yamal (thigh
  strapping) and Pedro Porro (muscle overload) started** — the fitness doubts carried
  since Run 6 resolve as non-issues.
- **Argentina 4-4-2, three changes** from the England semifinal: Emiliano Martínez;
  Montiel, Romero, Lisandro Martínez, Tagliafico; Mac Allister, **De Paul**, Enzo
  Fernández, **Nico González**; Messi and **Julián Álvarez**. Out: Giuliano Simeone,
  Leandro Paredes, Nahuel Molina. The **Álvarez-or-Lautaro** question carried since Run 6
  **resolves toward Álvarez**, and **De Paul returns to the XI** after being dropped for
  the semifinal.
- **Messi is the first player to start three World Cup finals**, and the oldest outfield
  player to appear in one.
- **Tickets:** FIFA's own resale site listed its cheapest seat at **$6,411.25** Saturday
  morning and it was gone by lunchtime; last-minute seats ran **$10,000–$60,000**
  (upper deck ~$10k, mid-level ~$16k, lower bowl to ~$35k, hospitality to $60k). **No
  official attendance figure released** (MetLife cap ~82,500).
- **Match in progress at time of writing:** 0–0 around 35', Spain 63% possession, xG
  0.10–0.00, Yamal's deflected 5th-minute effort the only shot. Reported as **the fewest
  shots in the opening 25 minutes of a World Cup final on record** (ESPN cites since
  1966). Messi had **two touches in the opening 20 minutes**. Referee Vinčić, as
  appointed. **None of this is written into site content** — it is a live snapshot, it
  will be stale within the hour, and the site does not carry live match state.

## Money thread — no legal movement, but a proximity item

- **No verified legal development since Run 6's Jul 14 inward turn.** Re-checked this
  pass: **no charges** against the AFA, Tapia or Toviggino in the US; the reported
  inquiry is still described as **preliminary**, with prosecutors gathering testimony and
  bank documentation to decide whether it warrants a **formal criminal referral**;
  authorities still **seeking witnesses** with direct knowledge of the Tapia and
  Toviggino tenures; **FBI still declines comment**. The **H2 changeMind trigger
  (subpoena / indictment / formal cooperating witness) is still not met.** **H2 bands
  held: 70–90% / 45–65%.**
- **What is new is proximity, not evidence, and the two are kept apart in the prose.**
  Tapia **travelled to the US on judicial authorization** despite the open Argentine
  proceedings; he was among the federation officials **received at Trump Tower with
  Infantino on Friday**; he watches the final **from the main box** with FIFA, CONMEBOL
  and RFEF leadership and goes onto the pitch at full time; **Trump — whom FIFA disclosed
  had received $15,000 in tickets from Infantino — is expected to present the trophy.**
  La Nación's own framing ("close to Trump and, for now, far from the courts") is quoted
  as the honest version. Added as timeline node `tapia-final-box` (financial thread),
  written so the image does not get mistaken for a fact about the investigation. The
  **domestic hearing remains set for Aug 12**.

## Hypothesis bands — all unchanged

- **H1 2–8%** — gains an againstPoint (FIFA opened a disciplinary case against Argentina
  three days before the final).
- **H2 70–90% / 45–65%** — quiet legal pass; changeMind unmet.
- **H3 35–55%** — untouched.
- **H4 30–50%** — gains a forPoint (the Malvinas banner: perception cascade with the
  officiating variable removed).

## Known limitations (carried + updated)

- **The final was unresolved when this pass was written.** No result, no champion, no
  officiating verdict on the match itself. `bracket.ts` deliberately untouched, stage
  still `final-set`. The next run grades the champion, H4's regression test (did the
  final pass without a major officiating controversy under maximum scrutiny?), and
  Tapia's travel-bond return date.
- **Opta's .595/.405 is a match-day figure** taken from The Analyst's own preview — a
  primary read this time, not syndication, which is an improvement on Run 7's sourcing.
- **Silver per-team ("PELE") numbers still paywalled** (carried across five runs now).
- **The Trump "reexamining the Falklands position" line is commentator-sourced**, not an
  administration statement, and is hedged as such. Giuliani's defense and Kyle's
  criticism are on the record.
- **FIFA has not announced an outcome** in the Malvinas disciplinary review — only that
  it is under assessment. The 2014 fine is offered as a precedent bounding the likely
  range, not as a prediction.
- **Named trophy moneylines are four days stale** and now labelled as opening prices.
- **Financial specifics** remain single-thread (La Nación) or anonymous-law-enforcement
  sourced — attributed, not asserted; owner of the Florida LLC named in reporting but
  withheld here by rule.
- **Attendance for the final** still not officially released.
- **Run-number reconciliation:** `updates.json` tops at **Log run 5** (`run-5-2026-07-17`),
  so Run 7's recommendation was merged. This research pass is **Run 8** and the pending
  recommendation is **Log run 6** (`run-6-2026-07-19`). The one-step offset between
  research-run and Log-run numbering is stable, not drifting.

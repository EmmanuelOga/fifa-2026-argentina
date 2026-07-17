# Verification findings — Run 3 (2026-07-15)

Additive re-run the day after semifinal 1, **with semifinal 2 (England v Argentina)
in progress at pass time** (0–0 in the first half in Atlanta when this snapshot was
taken). Builds on Run 2 (2026-07-14); carries forward all prior verified facts and
**adds** what moved. Hedging is never removed; no allegation is upgraded to a fact.

## The big mover: Spain 2–0 France (bracket → one-semi)

- **Spain beat France 2–0** in Arlington/Dallas on Jul 14: **Oyarzabal 22′ (penalty),
  Pedro Porro 58′**. Spain dominated on xG (~1.63 v ~0.31 per ESPN) and reaches the
  Jul 19 final at MetLife. Referee: **Iván Barton** (El Salvador). No red cards.
  (ESPN match report; NPR; Al Jazeera; FIFA match centre.)
- **The penalty was itself a firestorm — and Argentina was nowhere in sight.** The
  22nd-minute award (Lucas Digne on Lamine Yamal) was hotly disputed: some analysts
  said Yamal initiated/invited the contact; VAR did not overturn. **Deschamps** after
  the match: "did tonight's referee have the level to officiate a World Cup
  semifinal?" (short verified quote, wire-reported). **Collina defended the
  official**; ex-PGMOL chief **Keith Hackett** analyzed the footage and called the
  penalty correct. This is a *material new data point for H3/H4*: at the semifinal
  stage, the tournament's officiating controversy attached to a Spain match, not an
  Argentina one — scrutiny follows the World Cup itself, not one team.
- **England v Argentina (Jul 15, Atlanta, Mercedes-Benz Stadium)** kicked off ~3 p.m.
  ET and was **live and scoreless at pass time** — deliberately left `null` in
  `bracket.ts`; the next pass fills it. England made three changes (Rogers, Spence,
  R. James in); **Rice started despite the illness doubt** per lineup reporting;
  Henderson out (arm/wrist injury reported inconsistently across outlets — kept
  vague). Messi has 8 goals in 6 matches this tournament (Al Jazeera preview).

## Models & market (material move — France out)

- **Opta NOT refreshed at pass time.** The Jul 12 article (25k sims: FRA 34.0 / ESP
  23.4 / ENG 21.9 / ARG 20.6; reach-final 57.7/42.3/50.9/49.1) had **not been
  updated** post-SF1 — re-verified by fetch on Jul 15. Reality has resolved parts of
  it: France title/reach-final → 0 (eliminated), Spain reach-final → 100%. In
  `models.ts` the elimination-resolved zeros are applied (arithmetic fact, not a
  model output — documented in a comment); the other teams keep Opta's last
  published figures, flagged as predating SF1. **Note the pre-semi model "miss":
  Opta had France 57.7% to reach the final; the 42.3% branch happened.**
- **Market flipped to Spain as clear favorite** (post-SF1, Jul 14–15):
  **DraftKings ESP −156 / ENG +300 / ARG +400** (ESPN betting, Jul 14 dateline);
  **FanDuel ESP −150 / ENG +280 / ARG +370** (SI/Yahoo, Jul 15); **Kalshi ESP 57.6%
  / ENG 22.9% / ARG 19.8%**. `models.ts` BOOKMAKERS refreshed asOf 2026-07-15
  (ESP −150 → implied 0.600, ENG +280 → 0.263, ARG +370 → 0.213, FRA dashed/0
  eliminated). Implied figures include overround as before.
- **Author ranges re-synthesized** (speculative, labelled): ESP 0.52–0.60,
  ENG 0.21–0.26, ARG 0.17–0.23, FRA 0. Triangulates Kalshi, overround-normalized
  books (~55.8/24.4/19.8), and the not-yet-refreshed Opta.
- **Silver "PELE"** per-team numbers **still paywalled** — limitation carried.
- `bracket.ts` ESP rating 2020 → **2045** (tuning note: shutout of France; one goal
  conceded all tournament) so the nudge-0 Monte Carlo from the one-semi state
  converges near the new clean synthesis (~ESP 55 / ENG 23 / ARG 21).

## Financial thread — no material movement since Run 2

- Re-searched Jul 15: coverage is syndication/synthesis of the known facts
  (TourProdEnter LLC, five named banks, La Nación $260M/$57M, Miami Herald ~$90M,
  Tofoni's ~3-hour videoconference interview, no charges, FBI declined comment).
  H2 bands unchanged.
- **One small new nugget (added, attributed):** reporting (Río Times / Al Día
  syntheses of La Nación) notes AFA president **Tapia — processed in the separate
  Argentine domestic case — needed judicial authorization to travel** to the US
  with the squad. Single-thread sourcing → one attributed sentence appended to the
  dec-raids timeline detail, phrased as reported.
- Investigation focus described in reporting as Tapia and treasurer Pablo
  Toviggino's management of AFA/TourProdEnter — both deny wrongdoing, frame the
  domestic cases as political persecution; **kept at role+denial level, no new
  allegation adopted**.

## Hypothesis bands — unchanged, one evidence addition

- H1 2–8%, H2 70–90% / 45–65%, H3 35–55%, H4 30–50% all hold.
- **H4 gains a forPoint** (and source): the Spain–France penalty controversy —
  officiating firestorms at this World Cup are tournament-wide, not
  Argentina-specific. This is exactly the "test under the brightest lights" the
  semis-ahead node predicted; SF1's data point cuts toward variance/perception.

## Known limitations (carried + updated)

- Opta post-semis refresh not yet published at pass time; Spain's 23.4% title figure
  is stale-low (market says ~57%) — flagged in prose and comments; Run 4 reconciles.
- Silver per-team numbers paywalled (carried).
- ENG–ARG unresolved at pass time — bracket left one-semi; Run 4 fills the result
  and grades the Run 1–2 scorecards (France v Spain resolves as a model coin-flip
  "miss" for Opta's 57.7% France-to-final lean; grading itself is the score step's
  job, not this pass's).
- Deschamps quote kept under 15 words, wire-verified; Henderson injury
  (arm vs wrist) inconsistent across outlets — left vague.
- Miami Herald original still paywalled (carried).

---

# Verification findings — Run 4 (2026-07-15, evening pass, same day)

Same-day second pass, a few hours after full time in Atlanta. Run 3's exact
findings/snapshot are preserved in git (commit 399ec52); this section extends the
file additively and the snapshot below it now reflects Run 4. Everything from
Runs 1–3 carries forward; nothing was removed and no hedge was softened.

## The big mover: England 1–2 Argentina → the final is set

- **Argentina beat England 2–1** in Atlanta (Mercedes-Benz Stadium): Gordon 55′;
  **Enzo Fernández 85′ (from distance), Lautaro Martínez 90+2′ (header, Messi
  cross)**. Argentina dominated: **64% possession, xG ~1.84 v ~0.53, 537 accurate
  passes at 91%** (ESPN). First knockout win of Argentina's run inside 90 minutes.
  England made late defensive subs (R. James, Rice on 82′) to protect the lead and
  conceded twice in seven minutes. (ESPN; CBS News; NPR; FOX; NBC live blog.)
- **The final: Spain v Argentina, July 19, MetLife, 3 p.m. ET.** No suspensions on
  either side (yellows wiped after QFs; no reds in the semis). First competitive
  international meeting of Messi and Lamine Yamal. Messi: 8 goals (tied for the
  tournament lead), 6th World Cup; assist on the winner (CBS credits Rogers on
  Gordon's goal and Messi on Martínez's; some outlets credit Messi with both
  Argentina assists — only the Martínez assist is treated as verified).
- **The officiating angle — the test resolved toward H3/H4.** The perception
  machinery was fully loaded pre-match: referee **Ismail Elfath** (USA) was dubbed
  **"Messi's lucky charm"** (fourth official at the 2022 final; a viral 4-0 record
  with Messi-club matches), with the first **all-US crew** (Elfath, Parker, Atkins)
  in a World Cup semifinal; an English referee can't take an Argentina match by
  convention (Al Jazeera, Goal, Athlon). Then the match gave the narrative nothing:
  Gordon's goal stood after a routine offside check, no VAR intervention decided
  anything, live blogs grumbled mildly about early card management, and no
  post-match officiating complaint of substance surfaced in the hours after FT.
  Across both semifinals, the round's only real firestorm attached to
  Spain–France. Added as timeline node `england-argentina-semi` + an H4 forPoint.
  Bands still unchanged (additive discipline; the final remains the last test).

## Models & market (post-SF2)

- **Opta main article STILL not refreshed** (re-verified by fetch this pass; still
  the Jul 12 25k-sim numbers). But Opta's **SF2 match preview (Jul 15)** is new
  verified material: **England to advance in 52.3%** of simulations (90-minute
  split ENG 37.3 / draw 30.7 / ARG 32.0). The 47.7% branch happened. Combined with
  SF1, both of Opta's slim semifinal favorites (57.7%, 52.3%) lost — added to the
  whowins-favorite-lost section as a calibration postscript, phrased as
  "near-coin-flips landing on the other face", not as model failure.
- **Market, final-set opening prices (Jul 15 ~5 p.m. ET, Sports Betting Dime):**
  trophy: **Caesars ESP −170 / ARG +135; bet365 −175/+125; theScore −160/+130;
  Kalshi ESP 58¢ / ARG 43¢**. 90-minute three-way (BetMGM): ESP +125 / draw +200 /
  ARG +250; O/U 2.5 at +135/−150. BOOKMAKERS refreshed (ESP −170/.630,
  ARG +135/.426, overround noted).
- **Author ranges re-synthesized: ESP 0.55–0.60, ARG 0.40–0.45** (books normalized
  ~59/41, Kalshi ~57/43, Elo bracket at nudge=0 ~56/44; Opta stale). No bracket.ts
  rating change needed — ESP 2045 v ARG 2000 already lands the Monte Carlo at
  ~56/44 from the final-set state.
- **Silver "PELE"** per-team numbers still paywalled (carried).

## Financial thread — still no material movement

- Re-searched this pass: coverage remains syndication of the known corpus
  (TourProdEnter LLC, five named banks, $260M/$57M per La Nación, ~$90M per Miami
  Herald, Tofoni's ~3-hour interview, no charges, FBI declined comment). The Daily
  Star's "19 billion pesos (~$13M)" figure for the domestic Tapia/Toviggino case is
  consistent with the ~$12.7M already published. H2 bands unchanged. The key date
  is unchanged and now four days out: after the July 19 final, Tapia must return
  to Argentina under his travel bond.

## Hypothesis bands — unchanged; H4 gains its second semifinal data point

- H1 2–8%, H2 70–90% / 45–65%, H3 35–55%, H4 30–50% all hold. H4's changeMind
  ("if the pattern regresses under semifinal and final scrutiny…") is now half
  resolved in H4's favor: both semifinals passed without an Argentina-linked
  controversy. The final is the remaining half; bands move (if at all) after it.

## Known limitations (carried + updated)

- Opta post-semis title refresh still unpublished at pass time; its ESP/ARG title
  figures remain stale-flagged in models.ts. Run 5 reconciles.
- Silver per-team numbers paywalled (carried).
- Miami Herald original paywalled (carried).
- "Both assists Messi" is not adopted (outlets disagree); only the Martínez assist
  is stated as fact.
- Attendance figure for the Atlanta semifinal not confirmed at pass time — omitted.
- Grading of Run 1–3 scorecards (semifinal claims now resolvable) is deliberately
  left to the score step, per the pipeline's division of labor.

---

# Verification findings — Run 5 (2026-07-15, late pass, same day)

Third pass of the day, ~5 hours after Run 4, four days out from the final. Run 4's
exact findings/snapshot are preserved in git (commit f5a8623); this section extends
the file additively and the snapshot below now reflects Run 5. No match has been
played since Run 4 — the value of this pass is that it **closes the one item Run 4
explicitly deferred to it** ("Opta post-semis title refresh still unpublished at
pass time… Run 5 reconciles"). It does.

## The big mover: Opta had refreshed after all — the stale flag comes off

Run 4 checked Opta's **main semi-final article**, found it unmoved from Jul 12, and
flagged `models.ts` as carrying stale-low figures (Spain 23.4%). That was true of
the article — but the **supercomputer's bracket had re-run after Spain 2–0 France**,
and the refreshed set was published by **TNT Sports (Jul 14–15, post-SF1, pre-SF2)**:

| Team | Opta title (post-SF1 refresh) |
|---|---|
| Spain | **56.15%** |
| England | **23.38%** |
| Argentina | **20.47%** |
| France | 0 (eliminated) |

Sum: **100.00%**. Plus **England 52.53%** to beat Argentina → **Argentina 47.47%**
to reach the final. Run 4's own `52.3%` came from Opta's *match preview*, a
slightly different artifact; both are real and both are cited.

### Why the published numbers can't be shown as-is, and what we show instead

That vintage predates SF2. Argentina's 20.47% is a *title* number that still priced
in a **47.47% chance of merely reaching the final** — and they are now in it. Pairing
20.47% with a "reach final: 100%" cell would render something visibly incoherent, and
England's 23.38% belongs to a team that is out.

So the table conditions Opta's own figures on the known result — division, not
invention:

```
ARG title | in the final = 20.47 / 47.47 = 43.12%   →   ESP = 56.88%
```

This **back-solves exactly**, which is why the arithmetic is trustworthy rather than
convenient:

```
ENG 23.38 / 52.53          ⇒ Spain beats England 55.49% of the time
55.49%×52.53 + 56.88%×47.47 = 56.15  ✓  (Opta's published Spain number)
```

Adopted in `models.ts` as **ESP .569 / ARG .431**, with the published post-SF1 set
retained alongside it (`publishedPostSF1`) for provenance. The prose says plainly
that this column is Opta's model conditioned on a result Opta hadn't seen — *not* a
number Opta printed. Same discipline as the Silver paywall note: no inventing, no
laundering a derivation into a citation.

### What it means: for the first time, the anchors agree

| Anchor | Spain | Argentina |
|---|---|---|
| Opta (conditioned) | ~56.9 | ~43.1 |
| Books (overround-normalized) | ~59 | ~41 |
| Kalshi | 57.7 | 42.4 |
| Elo bracket, nudge=0 | ~56 | ~44 |
| **Author range (unchanged)** | **55–60** | **40–45** |

Four independent anchors inside a five-point spread, all inside the published range.
Run 4 set that range with Opta stale and one anchor missing; Opta arriving late and
landing inside it is corroboration, not a reason to move. **AUTHOR_RANGES unchanged.**

## Market — re-checked, did NOT move

- **FanDuel** (new book this pass): trophy **ESP −156 / ARG +136**; 90-min ESP +130
  / draw +190 / ARG +270. **Kalshi unchanged** at 57.7¢/42.4¢.
- Normalizing the overround out: FanDuel **59.0/41.0**, Caesars **59.7/40.3** — the
  same market Run 4 recorded. `BOOKMAKERS.teams` keeps Caesars for continuity; the
  re-check is recorded in the doc comment.
- **Correction to a search-level misread this pass:** a first-pass search summary
  attributed "−136" to BetMGM, implying a sharp move toward Argentina. Fetching the
  source showed **−136 is Kalshi**, not BetMGM, and Kalshi was already in Run 4's
  snapshot. There was no move. Logged because it nearly became a wrong headline.

## Financial thread — re-searched, still no material movement

- Re-verified against Rio Times (Jul 9, fetched): **$260M** through TourProdEnter
  LLC, **$57M** without clear economic purpose, **AR$19bn (~$13M)** domestic case,
  three unnamed federal prosecutors, **no US charges**, FBI still not commenting.
  Argentine domestic case at indictment stage; AFA disputes it. All already in the
  corpus. **H2 bands unchanged.**
- Rio Times independently describes TourProdEnter's owner **by role** ("a former
  legislator and businessman") **and does not name him** — matching this site's own
  editorial rule from Run 1. Good convergent check on the naming discipline.
- **Not adopted:** a "**more than $300M**" framing (Latin Times / Yahoo syndication)
  and a version naming the LLC's owner. Both sources returned 403/404 on fetch, the
  $300M figure appears in no source I could open, and naming the owner would break
  the role-not-name rule. Excluded rather than hedged.
- Key date unchanged, now four days out: after the Jul 19 final, Tapia is due back
  in Argentina under his travel bond.

## Squad news for the final — checked, mostly NOT adopted

- **No suspensions** either side (carried from Run 4; re-confirmed).
- A FanDuel preview listed Spain's **Yeremy Pino "still out"** and "**unbeaten in 36
  straight**". **Neither adopted.** ESPN and Sports Mole report Pino's tests showed
  an **AC sprain, not a fracture**, and that he was **fit for the France semi** — the
  betting-page blurb is stale. The 36-match streak is uncorroborated in anything I
  could open; tournament-level facts that *are* solid (Spain conceded once in seven
  matches, first final since 2010) were already implied by existing content.
- **Rodri fit**, **Yamal fit** — corroborated, but not a change worth a content edit.
- Net: no squad edits. Recorded here so the next run doesn't re-chase it.

## Hypothesis bands — unchanged

- H1 2–8%, H2 70–90% / 45–65%, H3 35–55%, H4 30–50% all hold. Nothing happened
  since Run 4 that touches them; the final remains the outstanding test for H4.

## Known limitations (carried + updated)

- **Opta staleness: RESOLVED** (was the headline limitation of Runs 3–4).
- **New:** the Opta title column is now a **derivation**, not a printed figure.
  Disclosed in `models.ts`, in `whowins-intro` prose, and in the source `why`.
  If Opta publishes an explicit post-SF2 pair, Run 6 should replace the derived
  numbers with the printed ones and drop the conditioning language.
- **New:** `theanalyst.com`'s bracket widget is **JS-rendered**, so its live
  post-SF2 percentages are not machine-readable here; TNT Sports is
  **region-blocked** from this vantage, so its figures were extracted via multiple
  independent search-result snippets rather than a direct read. They are treated as
  solid because they **sum to 100.00 and back-solve exactly** — but the URL was not
  opened directly. Flagged honestly; a reader outside the block can open it.
- Silver per-team numbers paywalled (carried).
- Miami Herald original paywalled (carried).
- "Both assists Messi" still not adopted (outlets disagree).
- Attendance for the Atlanta semifinal still unconfirmed — still omitted.
- Grading of prior scorecards still belongs to the score step.
- **Run-number drift (flagged for the pipeline, not fixed here):** research runs and
  Log runs are off by one. `updates.json` tops out at **Log run 3**, whose entry
  narrates Run 4's research (research Run 3 was superseded same-day and never got
  its own entry). Per PROMPT ("the newest `updates` entry gives the current run
  number"), the pending recommendation below is numbered **Log run 4** while this
  research pass is **Run 5**. Worth reconciling deliberately rather than by drift.

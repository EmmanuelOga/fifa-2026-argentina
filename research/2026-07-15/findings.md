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

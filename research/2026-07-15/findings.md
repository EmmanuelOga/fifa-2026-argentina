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

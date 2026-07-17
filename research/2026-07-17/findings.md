# Verification findings — Run 7 (2026-07-17)

Additive re-run **two days before the final** (Spain v Argentina, July 19, MetLife).
No match has been played since Run 5, so the bracket is unchanged. This is a new
dated folder; the full Run 3 + Run 4 + Run 5 text is preserved in
`research/2026-07-15/findings.md`, and Run 6 in `research/2026-07-16/findings.md`, and
all of it in git. Everything from Runs 1–6 carries forward; nothing was removed and no
hedge was softened. Two of Run 6's open items closed cleanly this pass: **the final
referee was appointed**, and **Opta finally printed an explicit Spain-v-Argentina
simulation.** The money thread and the market, by contrast, were quiet.

## The big mover: the final referee is appointed — and it's a European

Run 6 flagged the final referee as the headline open item and reasoned toward a
"fully neutral" (non-UEFA, non-CONMEBOL) name, with Iran's Alireza Faghani the tipped
frontrunner. **That reasoning turned out wrong**, and it's worth recording the miss
honestly rather than quietly.

- **FIFA appointed Slavko Vinčić (Slovenia / UEFA)** for the July 19 final (announced
  Jul 17, ~two days out). He is the **first Slovenian and the 23rd person** to referee
  a men's World Cup final. Sourced to FIFA's official refereeing release.
- **Full crew:** assistants **Tomaž Klančnik** and **Andraž Kovačič** (Slovenia);
  fourth official **Adham Makhadmeh** (Jordan); reserve assistant **Mohammad Al-Kalaf**
  (Jordan); **VAR Bastian Dankert** (Germany); **assistant VAR Nicolás Gallo**
  (Colombia); **support VAR Khamis Al Marri** (Qatar).
- **Why Run 6's "neutral field" logic was wrong:** the operative FIFA pattern is not
  "no confederation that's in the final," it's that **European referees work finals
  played outside Europe** (and non-Europeans work finals in Europe). So a UEFA official
  was always plausible for a North-American final, and Faghani did **not** get it. The
  clean structural story told in the Run 4 Log entry ("this final can't take a European
  or a South American official") was simply mistaken about the convention.
- **Editorial read — this cuts *against* H1, not for it.** For this site's actual
  question (favoritism *toward Argentina*), a European referee for a Spain–Argentina
  final is **confederation-non-neutral toward Spain**, the *other* finalist. That is
  the opposite of what a thumb-on-the-scale-for-Argentina story would arrange. Added as
  an H1 againstPoint. It is, predictably, **fresh fuel for the H4 perception cascade** —
  instant social-media grumbling (some referencing his Sweden–Poland playoff match) —
  despite being a form-based, Champions-League-final-calibre pick. Added as an H4
  forPoint.
- **Context that colours the pick without proving anything:** it lands amid open
  **FIFA–UEFA friction** (the Infantino–Ceferin feud; UEFA's public anger over FIFA
  suspending a Balogun one-match ban, which it called "unprecedented, incomprehensible
  and unjustifiable"), which is why several outlets called a UEFA appointment
  *surprising*. Vinčić's **only prior Argentina match** was their shock 2022 opening
  loss to Saudi Arabia; he has **refereed Spain several times without them losing**
  (incl. a Euro 2024 group game). **Real Madrid** publicly criticised a Camavinga red
  he gave in an April 2026 Champions League tie (Bellingham: "a joke"; Arbeloa
  complained); **José Mourinho** has praised his work. All perception-adjacent, none of
  it evidence.
- Added: timeline node `final-referee` (order 15, sporting, Jul 17), sources
  `fifa-final-referee` (tier 1) and `espn-vincic` (tier 2), plus the H1/H4 points above.
  **H1 held 2–8%, H4 held 30–50%** — the appointment is a data point for the perception
  reading, not a mover of either band.

## The other closed item: Opta prints an explicit final pair

- **Opta published a direct Spain-v-Argentina final simulation** (25,000 sims, out
  Jul 16): **Spain ~56.05–56.31% v Argentina ~43.69–43.95%** across syndication
  (representative **~56.1 / 43.9**). This **retires the derived .569/.431** that Runs
  5–6 carried and **drops the conditioning language** everywhere.
- The printed pair sits a **shade closer to Argentina** than the old derivation
  (43.9% vs 43.1%) — expected, since Opta is now simulating the actual final rather
  than back-solving a pre-SF2 trophy column. Still **well inside the author range**
  (ESP .55–.60, ARG .40–.45).
- `models.ts`: OPTA `asOf` → 2026-07-16, teams **ESP .561 / ARG .439**, doc comment
  rewritten (explicit pair, derivation retired); `publishedPostSF1` kept for
  provenance. `whowins-intro` prose updated in both locales to say Opta now printed the
  explicit matchup rather than the arithmetic-on-a-column story.

## Market — consolidated, not moved

- The two-day drift toward Spain has **settled**: **Kalshi ~58.2¢, Polymarket ~58.0¢**
  Spain (essentially flat vs Run 6's ~58.5/58.4); **DraftKings 90-minute Spain +115 /
  ARG +285 unchanged**; FanDuel ~+130/+270, BetMGM ~+125/+250. Named trophy lines
  (Caesars −170, bet365 −175, theScore −160) drew **no fresh re-quote**, carried;
  overround-normalized trophy market **still ~59/41 Spain**.
- `BOOKMAKERS.asOf` → 2026-07-17, doc comment records the consolidation.
  **AUTHOR_RANGES unchanged** — four anchors (Opta explicit ~56/44, books ~59/41,
  Kalshi ~58/42, Elo bracket nudge=0 ~56/44) still inside a five-point band, all inside
  the published range.

## Money thread — quiet this pass

- **No verified movement since Run 6's Jul 14 inward turn.** Coverage this pass was
  syndication of the established corpus ($300M+ through US banks/TourProdEnter,
  five named banks, ~$90M flagged, the Tofoni interview, the reported informal insider
  videoconferences, Toviggino > Tapia as perceived focus). Some outlets now use loose
  "**under the watch of a federal grand jury**" phrasing, but no **subpoena,
  indictment, or formal cooperating witness** has been reported — the H2 changeMind
  trigger is **still not met**. No US charges; FBI still declines comment.
- **H2 bands held: 70–90% / 45–65%.** No content edit to the financial timeline or H2
  this pass beyond what Run 6 already added; the secondary band remains pressed toward
  the upper half of its range without a formal step to move it.

## Squad news — reconfirmed, no material change

- **Spain: Lamine Yamal (left-thigh strapping) and Pedro Porro (muscle
  overload/fatigue)** again trained apart on Thursday but are **expected fit**;
  reporting (Jul 16–17) says both were expected to **rejoin full training from Friday**
  if recovery held. Neither is considered a serious injury. No change from Run 6, just
  reconfirmed two days out.
- **Argentina: clean.** No new injuries or suspensions. Messi leads the Golden Boot
  race on **8 goals** (Mbappé eliminated). Scaloni's XI is a preview only (De Paul was
  dropped from the starting XI vs England; No. 9 choice Álvarez vs Lautaro alongside
  Messi still debated). Not adopted as fact.

## Hypothesis bands — all unchanged

- **H1 2–8%** (gains an againstPoint: the final ref is a UEFA official, non-neutral
  toward Spain not Argentina). **H2 70–90% / 45–65%** (quiet pass; changeMind unmet).
  **H3 35–55%.** **H4 30–50%** (gains a forPoint: the referee appointment became
  instant perception fuel). The **final itself remains the single event** that grades
  the champion, resolves H4's regression test, and returns Tapia's travel-bond date.

## Known limitations (carried + updated)

- **Opta explicit figure spans ~56.05–56.31%** across Jul 16 syndication (representative
  .561/.439 adopted); the analyst.com bracket widget is JS-rendered and not
  machine-readable for us, so the number is taken from reporting of the model, not a
  scraped cell.
- **Silver per-team ("PELE") numbers still paywalled** (carried) — his final preview
  exists but the per-team title split is behind the paywall; methodology + market
  reference used instead.
- **Final VAR/crew names** taken from FIFA's official release + wire corroboration;
  reliable, but the reserve/support-VAR names are single-release.
- **Financial specifics** remain single-thread (La Nación) or anonymous-law-enforcement
  sourced — attributed, not asserted; owner of the Florida LLC named in reporting but
  withheld here by rule.
- **Predicted final XIs are previews, not confirmed** — not adopted as fact.
- **Attendance for the final** still not officially released — omitted (MetLife cap
  ~82,500).
- Grading of prior scorecards still belongs to the score step; the **Jul 19 final**
  resolves the champion, H4's regression test, and Tapia's travel-bond return date.
- **Run-number reconciliation (resolved this pass):** `updates.json` now tops at **Log
  run 4** (id `run-4-2026-07-16`) — Run 6's pending Log-run-4 recommendation *was*
  merged. So this research pass is **Run 7** and the pending recommendation below is
  **Log run 5** (id `run-5-2026-07-17`). The off-by-one persists between research-run
  and Log-run numbering but is now internally consistent and no longer drifting.

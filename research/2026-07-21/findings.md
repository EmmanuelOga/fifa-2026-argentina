# Verification findings — Run 10 (2026-07-21)

Additive re-run two days after the final. Run 9 (`research/2026-07-20/`) was the
resolving pass: the result is in, the forecasts are graded, the H1/H4 bands moved.
This pass is the **aftermath pass** — the tournament story is over, so what moves now
is discipline, succession, and the money thread. This is a new dated folder; all
prior folders (2026-07-12 → 2026-07-20) are preserved untouched, and everything from
Runs 1–9 carries forward. No hedge was softened; no probability band moved this run.

## 1. The brawl case went formal — and the red card went away

- **On July 20 FIFA appointed a Disciplinary and Ethics Prosecutor** to investigate
  potential breaches of the disciplinary code in the post-final scenes ("further
  details… once the prosecutor's report has been completed"). Named in coverage:
  **Leandro Paredes** (grabbed Eric García by the throat, shoved Gavi down),
  **Nahuel Molina** (jab at Rodri), and assistant coach **Roberto Ayala** (captured
  striking Dani Olmo). Individuals could face **suspensions, fines, or both**; the
  AFA itself is exposed too. Sources: Yahoo (`yahoo-red-rescinded`), World Soccer
  Talk (FIFA statement wording), SI.
- **The twist: Paredes' straight red was RESCINDED** — erased from the official
  record, FIFA clarifying that no disciplinary measure had actually been imposed on
  the night. Any sanction will flow from the retrospective inquiry, not the card.
  This corrects the Run 9 record ("straight red") — the card was shown, then wiped.
  `bracket.ts` FINAL note and timeline `final-brawl` updated accordingly.
- **Enzo Fernández's red does carry over**: under FIFA's World Cup regulations, a
  suspension that cannot be served during the tournament transfers to the
  representative team's **next official match**. Recorded in the new `squad-returns`
  timeline node.
- **The Malvinas-banner ruling is STILL not issued** (as of Jul 21). Consistent with
  the 2014 precedent, where the CHF 30,000 fine was published **after** that
  tournament ended — so "after the final" was always the likely timing. Still
  pending; still the benchmark.

## 2. The football coda: a crowd, a date, and a non-announcement

- **The squad landed at Ezeiza on July 20** on the Aerolíneas charter; a multitude
  turned out despite the defeat; protocol reception, no celebration. Tapia, Scaloni
  and Otamendi came down first. **Messi and De Paul stayed in the US.**
  (`infobae-squad-return`)
- **Scaloni put a date on his own future**: "hasta diciembre sigo y después
  seguramente corte" — he'll see out his contract (runs to December 2026), then
  probably step away, adding he still has to talk to the AFA president. Verified
  wording via Ámbito (`ambito-scaloni`); also El Diario, Canal 12. Quote kept under
  15 words in site copy.
- **Messi, 39, announced nothing.** No statement from him or the AFA. TyC Sports
  (Gastón Edul) reported the final was **not** his last international match. His
  pre-final "The Last Tango" boots and farewell letter to teammates read as a
  goodbye to World Cups, not (yet) the shirt. NBC framed it as an open question
  (`nbc-messi-future`). The site records the question as open — no speculation
  upgraded to fact.

## 3. Tapia's return was itself a legal event; the domestic case slid backward

- **Tapia flew home with the squad, as required**: judge **Diego Amarante** (Penal
  Económico) had authorized the trip with an obligation to return **before July 21**.
  This CLOSES the Run 8/9 open item "Tapia's travel-bond return is still to come."
  (`infobae-tapia-return`)
- Infobae frames his landing as **"three storm fronts"**:
  1. **Domestic judicial**: Tapia stands **processed (procesado), without preventive
     detention**, in the ARCA withholdings case — reported domestically as roughly
     **AR$20,000 million** (~US$13M; the same matter earlier reported as ~US$12.7M)
     in allegedly withheld taxes and pension contributions. **Toviggino and other
     officials are processed too**, with multimillion asset embargoes.
  2. **The FBI/DOJ inquiry**: still **preliminary, no formal imputation**, FBI still
     declining comment. New reported detail: **more than US$13.5M moved through PNC
     alone in under a year**, inside the >$300M total. (TourProdEnter's reported
     principals are named in Infobae; the site keeps referring to them by role —
     "the company's operators" — per the defamation-hygiene rule.)
  3. **Political**: the Milei feud, parked during the tournament, resumes.
- **The separate "mansion" thread moved BACKWARD procedurally** (El Español, Jul 16,
  picked up this run): the **Cámara Federal de Casación annulled** the resolution
  that had fixed the case with federal judge González Charvay (Zárate-Campana) —
  camaristas Barroetaveña and Borinsky — so **venue must be re-decided between San
  Martín and Comodoro Py**. El Español's framing is the sharpest available read of
  the thread right now: *the FBI advances while the Argentine case regresses amid
  judicial maneuvering*. The **Aug 12 hearing** reported earlier remains the next
  fixed point on the domestic calendar (not re-confirmed post-annulment; phrased
  carefully in site copy).
- **H2 unchanged: 70–90% / 45–65%.** The changeMind trigger (grand-jury subpoena /
  indictment / cooperating witness) is still unmet. The domestic procesamiento
  detail thickens an existing forPoint ("real heat") but is not US-side movement;
  the Casación reset is procedural, not exculpatory. No band edit — recorded here
  instead.

## 4. Officiating retrospective: nothing new beyond Collina's existing statements

Searched for a post-tournament FIFA refereeing review or independent xG-adjusted
study. Nothing published yet beyond Collina's existing on-record defenses (Jul 9
integrity statement, semifinal defense) — all already in the corpus. The Run 9 open
item ("any post-tournament refereeing review that would sharpen H1/H3") stays open.
**H1 2–6%, H3 35–55%, H4 35–55% all held** — no new evidence either way.

## 5. Models / markets: nothing to update

Tournament over; forecasts resolved and graded in Run 9. `models.ts` untouched
(pre-match numbers stay as the graded record), `bayes.ts` untouched, bracket
result unchanged except the Paredes-note correction. Silver per-team PELE numbers:
still paywalled, **seventh consecutive run** — open item carried.

## Hypothesis bands — summary (all held)

- **H1 2–6%** — held; no new officiating evidence.
- **H2 70–90% / 45–65%** — held; changeMind unmet; domestic detail recorded in
  timeline, not in the bands.
- **H3 35–55%** — held.
- **H4 35–55%** — held.

## Run-number reconciliation

`updates.json` now tops at **Log run 7** (`run-7-2026-07-20`) — Run 9's
recommendation was merged. This research pass is **Run 10**; the pending
recommendation is **Log run 8** (`run-8-2026-07-21`). Research-run ↔ Log-run offset
(10 ↔ 8) stable.

## Data / content changes this run

- `meta.lastUpdated` 2026-07-20 → 2026-07-21.
- `bracket.ts`: header snapshot date bumped; FINAL note corrected — Paredes' post-
  whistle red now noted as later rescinded, with FIFA's prosecutor investigating.
- `models.ts`, `bayes.ts`: unchanged.
- `timeline.json`:
  - `final-brawl` (order 20) updated: FIFA formally appointed a Disciplinary and
    Ethics Prosecutor (Jul 20); Molina and Ayala named in coverage; Paredes' red
    rescinded/erased; source `yahoo-red-rescinded` added.
  - Added `squad-returns` (order 21, sporting, Jul 20): Ezeiza return, Scaloni's
    December signal, Messi's open future, Enzo's carried ban.
  - Added `tapia-returns` (order 22, financial, Jul 20): Amarante travel-bond
    return, the three fronts, the Casación jurisdictional reset, PNC detail.
- `hypotheses.json`: NOT edited (no band moves; reasoning above).
- `sources.json`: added `yahoo-red-rescinded` (110), `infobae-squad-return` (111),
  `ambito-scaloni` (112), `nbc-messi-future` (113), `infobae-tapia-return` (114),
  `elespanol-casacion` (115), all tier 2.
- `sections.json`, `precedents.json`, `glossary.json`: NOT edited.
- `updates.json`: NOT edited (Log handled via `.update-pending-log.json`).
- `.update-pending-log.json` written: recommend **true**, Log run 8
  (`run-8-2026-07-21`).

## Still open / carried to any future pass

- **FIFA's Malvinas-banner ruling** — warning, fine, or dismissal; CHF 30,000 (2014)
  is the grading benchmark; 2014 timing says post-tournament, so watch the coming
  weeks.
- **The brawl case** — the prosecutor's report: charges, sanctions, or dismissal;
  whether Paredes/Molina/Ayala draw bans and whether the AFA is fined.
- **The money thread's first formal US step** (subpoena / indictment / cooperating
  witness) that would move H2's secondary band; the **Aug 12** domestic hearing;
  where the mansion case lands (San Martín vs Comodoro Py).
- **Scaloni's December decision** and **Messi's announcement**, whichever comes
  first — both now have soft dates.
- Any post-tournament refereeing review or xG-adjusted study (would sharpen H1/H3).
- Silver PELE per-team split — still paywalled (seventh run).

## Key sources

- Yahoo Sports (red rescinded + prosecutor): https://sports.yahoo.com/articles/argentina-world-cup-final-red-144524307.html
- World Soccer Talk (FIFA statement, Jul 20): https://worldsoccertalk.com/world-cup/argentina-faces-potential-sanctions-as-fifa-opens-disciplinary-review-into-world-cup-final-clash-with-spain/
- SI (potential punishments): https://www.si.com/soccer/argentina-world-cup-final-brawl-potential-punishments-fifa-investigation
- Infobae (squad return): https://www.infobae.com/deportes/2026/07/20/la-seleccion-argentina-vuelve-al-pais-en-vivo-que-futbolistas-regresan-y-como-sera-la-recepcion-protocolar-en-ezeiza/
- Infobae (Tapia, three fronts): https://www.infobae.com/politica/2026/07/20/sin-la-copa-y-sin-messi-en-el-avion-vuelve-tapia-y-debera-enfrentar-tres-frentes-de-tormenta-tras-la-pausa-del-mundial/
- Ámbito (Scaloni quote): https://www.ambito.com/deportes/lionel-scaloni-puso-duda-su-continuidad-la-seleccion-hasta-diciembre-y-luego-probablemente-corte-n6301366
- NBC News (Messi future): https://www.nbcnews.com/sports/soccer/world-cup-final-heartbreak-was-end-lionel-messi-rcna588286
- El Español (Casación reset): https://www.elespanol.com/deportes/futbol/20260716/corrupcion-afa-fbi-avanza-causa-tapia-argentina-retrocede-maniobras-peleas-jueces/1003744323219_0.html
- Los Andes (return obligation context): https://www.losandes.com.ar/deportes/claudio-tapia-regresa-la-argentina-messi-y-la-copa-la-causa-judicial-que-lo-obliga-volver-perder-la-final-del-mundial-2026-n5999125

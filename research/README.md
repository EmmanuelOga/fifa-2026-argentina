# Research archive

Each time the analysis is re-run, drop a dated folder here:

```
research/
  YYYY-MM-DD/
    findings.md     # human-readable verification notes for that run
    snapshot.json   # machine-readable predictions + facts as of that run
```

`snapshot.json` is the contract the prediction-scorer reads. Once real outcomes
are known (a semifinal is played, the champion is crowned), fill the `outcomes`
block of an earlier snapshot and run:

```bash
node scripts/score-predictions.mjs research/2026-07-12/snapshot.json
```

It prints how the run's predictions fared (Brier-style scoring on the title
probabilities), which becomes a Log / Bitácora entry. See the root README section
**"Re-running the analysis"** for the full loop.

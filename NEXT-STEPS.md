# Next steps

Immediate, ordered, actionable follow-ups. (Broader/bigger ideas live in
[`IDEAS.md`](./IDEAS.md); the re-run mechanics are in the README.)

Live now: **https://fifa-2026-argentina.pages.dev** · sources:
**https://github.com/EmmanuelOga/fifa-2026-argentina**

Run project commands through mise (your interactive shell doesn't auto-load it
unless you added the hooks to `~/.bashrc`): `mise exec -- pnpm …`.

## 1. Turn on the Ask-the-Research chat (2 min)
```bash
mise exec -- pnpm wrangler pages secret put ANTHROPIC_API_KEY --project-name fifa-2026-argentina
mise exec -- pnpm build && mise exec -- pnpm wrangler pages deploy dist --project-name fifa-2026-argentina
```
Optional: log unanswered questions →
`mise exec -- pnpm wrangler kv namespace create QUESTIONS`, uncomment the binding
in `wrangler.toml` with the printed id, redeploy.

## 2. Auto-deploy on push (5 min, one-time)
Cloudflare dashboard → the `fifa-2026-argentina` Pages project → **Settings →
Builds & deployments → Connect to Git** → pick the repo. After that every
`git push` to `main` redeploys; you can stop running the deploy command by hand.

## 3. Analytics (1 min)
Same project → **Web Analytics → Enable** (cookie-free, no consent banner). Or
paste a beacon token into `src/components/Analytics.astro`.

## 4. Time-sensitive: keep the bracket current
The most valuable thing this site does is make live predictions and then grade
them. Don't miss the window:
- **Semifinals (Jul 14 France–Spain, Jul 15 England–Argentina):** edit the result
  in `src/data/bracket.ts`, bump `lastUpdated` in `src/data/meta.ts`, redeploy.
  Tab 4 + the Monte Carlo re-render for the new state automatically (incl. an
  Argentina-eliminated state).
- **After the final (Jul 19):** fill the `outcomes` block of
  `research/2026-07-12/snapshot.json`, run
  `node scripts/score-predictions.mjs research/2026-07-12/snapshot.json`, and paste
  the Brier scorecard into a new Log/Bitácora entry (`src/content/updates.json`).
- **Re-run Phase 0 research** each time (semifinal results, injuries, refreshed
  Opta/market, any FBI-story movement) → new `research/YYYY-MM-DD/` folder.

## 5. Polish / verify (nice-to-have)
- Check the social cards render: paste the URL into the LinkedIn Post Inspector and
  the Twitter/X card validator (OG images are at `/og/{en,es}.png`).
- Run Lighthouse (mobile) on a couple of tabs — target perf ≥ 90; the three.js
  chunk is lazy-loaded so it shouldn't count against first paint.
- Regenerate the social video anytime content changes: `pnpm render:video`.

## 6. Optional: restore the GitHub Pages fallback
It ships as `deploy/github-pages.yml.example` (kept out of `.github/workflows/` so
the repo pushes without the GitHub `workflow` OAuth scope). To enable it:
```bash
gh auth refresh -h github.com -s workflow           # grant the scope once
mkdir -p .github/workflows && cp deploy/github-pages.yml.example .github/workflows/deploy.yml
git add .github/workflows/deploy.yml && git commit -m "ci: enable GitHub Pages fallback" && git push
```
Then repo **Settings → Pages → Source: "GitHub Actions"**. (Cloudflare is primary;
this is only a backup host and the chat doesn't work there.)
